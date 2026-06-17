package pl.edu.wat.uavlogistics.controller

import kotlinx.coroutines.delay
import pl.edu.wat.uavlogistics.common.AgentStatus
import pl.edu.wat.uavlogistics.common.AgentType
import pl.edu.wat.uavlogistics.common.ControllerConfig
import pl.edu.wat.uavlogistics.common.Geo
import pl.edu.wat.uavlogistics.common.GeoPoint
import pl.edu.wat.uavlogistics.common.NetworkStateDto
import pl.edu.wat.uavlogistics.common.RegisterAgentRequest
import pl.edu.wat.uavlogistics.common.StationSlotKind
import pl.edu.wat.uavlogistics.common.StationStatus
import pl.edu.wat.uavlogistics.common.TransportAgentDto
import pl.edu.wat.uavlogistics.common.inProgressTaskFor
import kotlin.math.max
import kotlin.math.min

/** Shared agent process state, energy model, routing, and backend telemetry updates. */
internal class AgentRuntime(
    val config: ControllerConfig,
    val backend: BackendClient,
    val vehicle: VehicleAdapter,
    private val planner: RoutePlanner,
) {
    var simulatedEnergyPercent = 100.0
    var lastRebalanceStationId: String? = null
    var lastPackageStagingAtMs = 0L
    var lastPackageStagingFromStationId: String? = null
    var lastPackageStagingTargetStationId: String? = null

    /**
     * Claimed STAGING/REBALANCE with destination parking reserved as ephemeral; agent is BUSY but not moving yet.
     */
    var relocationAwaitingParking: Boolean = false

    var claimedRelocationTask: pl.edu.wat.uavlogistics.common.TransportTaskDto? = null

    fun clearRelocationAwaitingParking() {
        relocationAwaitingParking = false
        claimedRelocationTask = null
    }

    fun clearPackageStagingMemory() {
        lastPackageStagingAtMs = 0L
        lastPackageStagingFromStationId = null
        lastPackageStagingTargetStationId = null
    }

    fun routingAgent(agent: TransportAgentDto, telemetry: Telemetry): TransportAgentDto =
        agent.copy(position = telemetry.position)

    /** Agent snapshot for planning: live position and simulated battery (not stale registry energy). */
    fun planningAgent(agent: TransportAgentDto, telemetry: Telemetry): TransportAgentDto =
        routingAgent(agent, telemetry).copy(energyLevelPercent = simulatedEnergyPercent)

    fun groundObstacles(network: NetworkStateDto): List<GroundObstacle> {
        if (!GroundRouteAvoidance.enabled()) {
            return emptyList()
        }
        return when (config.agentType) {
            AgentType.UGV -> GroundRouteAvoidance.fromAgents(config.agentId, network.agents)
            // Include every peer type (UAV + UGV); keep docked UAVs as obstacles for shared-hub departures.
            AgentType.UAV -> GroundRouteAvoidance.fromAgents(
                selfId = config.agentId,
                agents = network.agents,
                excludeDocked = false,
            )
        }
    }

    fun planRouteToPoint(
        agent: TransportAgentDto,
        target: GeoPoint,
        network: NetworkStateDto,
    ): PlannedRoute = planner.planToPoint(agent, target, groundObstacles(network))

    fun planRouteToPoint(
        agent: TransportAgentDto,
        target: GeoPoint,
        groundObstacles: List<GroundObstacle>,
    ): PlannedRoute = planner.planToPoint(agent, target, groundObstacles)

    fun consumeEnergy(route: PlannedRoute) {
        val spent = max(route.estimatedEnergyPercent, AgentControllerConstants.MIN_ROUTE_ENERGY_SPEND_PERCENT)
        simulatedEnergyPercent = max(0.0, simulatedEnergyPercent - spent)
        println(
            "[${config.agentId}] Energy spent ${spent.formatForLog()}%, " +
                "remaining ${simulatedEnergyPercent.formatForLog()}%.",
        )
    }

    fun transitTelemetryCallback(): suspend (Telemetry) -> Unit = { telemetry ->
        val network = backend.networkState()
        val agent = backend.getAgent(config.agentId)
        val status = if (network.tasks.inProgressTaskFor(config.agentId) != null) {
            AgentStatus.BUSY
        } else {
            agent.status
        }
        backend.updateAgentState(
            agentId = config.agentId,
            position = telemetry.position,
            energyLevelPercent = simulatedEnergyPercent,
            status = status,
            currentStationId = null,
        )
    }

    suspend fun updateBusyState(telemetry: Telemetry) {
        backend.updateAgentState(
            agentId = config.agentId,
            position = telemetry.position,
            energyLevelPercent = simulatedEnergyPercent,
            status = AgentStatus.BUSY,
            currentStationId = null,
        )
    }

    suspend fun chargeAtStation(
        position: GeoPoint,
        stationId: String,
        stations: AgentStationGeometry,
    ) {
        val network = backend.networkState()
        val station = network.stations.firstOrNull { it.id == stationId } ?: return
        if (!stations.physicallyAtStation(position, station)) {
            ParkingDiagnostics.log(
                agentId = config.agentId,
                decision = "charge-skip",
                details = "not at $stationId (${Geo.distanceMeters(position, station.position).formatForLog()}m from hub); won't charge here",
                agent = backend.getAgent(config.agentId),
                stationSlots = network.stationSlots,
            )
            return
        }
        var chargingPosition = position
        val dockedSlot = network.stationSlots.firstOrNull { slot ->
            slot.stationId == stationId &&
                slot.kind == StationSlotKind.PARKING &&
                (slot.occupiedByAgentId == config.agentId || slot.reservedByAgentId == config.agentId)
        }
        if (dockedSlot != null && stations.physicallyLandedAtParkingSlot(position, station, dockedSlot)) {
            chargingPosition = position
        } else {
            val slot = backend.reserveParkingSlot(stationId, config.agentId)
            val approach = stations.slotDrivePoint(station, slot)
            val distToPad = Geo.distanceMeters(position, approach)
            if (distToPad > AgentControllerConstants.PARKING_SLOT_DOCK_RADIUS_METERS) {
                val agent = backend.getAgent(config.agentId).copy(position = position)
                val route = planRouteToPoint(agent, approach, network)
                vehicle.executeRoute(route) { telemetry ->
                    backend.updateAgentState(
                        agentId = config.agentId,
                        position = telemetry.position,
                        energyLevelPercent = simulatedEnergyPercent,
                        status = AgentStatus.CHARGING,
                        currentStationId = stationId,
                    )
                }
                consumeEnergy(route)
                chargingPosition = vehicle.telemetry().position
            }
        }
        // UGV: no offboard hold during charge — parking mission sets home at the pad, so RTL failsafe stays on-pad.
        println("[${config.agentId}] Charging at station $stationId from ${simulatedEnergyPercent.formatForLog()}%.")
        while (simulatedEnergyPercent < AgentControllerConstants.FULL_ENERGY_PERCENT) {
            backend.updateAgentState(
                agentId = config.agentId,
                position = chargingPosition,
                energyLevelPercent = simulatedEnergyPercent,
                status = AgentStatus.CHARGING,
                currentStationId = stationId,
            )
            delay(AgentControllerConstants.CHARGE_TICK_MILLIS)
            simulatedEnergyPercent = min(
                AgentControllerConstants.FULL_ENERGY_PERCENT,
                simulatedEnergyPercent +
                    AgentControllerConstants.CHARGE_PERCENT_PER_SECOND *
                    (AgentControllerConstants.CHARGE_TICK_MILLIS / 1000.0),
            )
        }
        backend.updateAgentState(
            agentId = config.agentId,
            position = chargingPosition,
            energyLevelPercent = simulatedEnergyPercent,
            status = AgentStatus.AVAILABLE,
            currentStationId = stationId,
        )
        println("[${config.agentId}] Charging complete.")
    }

    suspend fun registerAndActivate(stations: AgentStationGeometry) {
        val telemetry = vehicle.telemetry()
        println("[${config.agentId}] Registering agent at ${telemetry.position}.")
        backend.registerAgent(
            RegisterAgentRequest(
                id = config.agentId,
                type = config.agentType,
                position = telemetry.position,
                energyLevelPercent = simulatedEnergyPercent,
                maxRangeMeters = configuredRangeMeters(),
                payloadCapacityKg = configuredPayloadCapacityKg(),
            ),
        )
        println("[${config.agentId}] Activating agent (ARMING until PX4 is armed).")
        backend.activateAgent(config.agentId)
        awaitArmedAndReady(telemetry, stations)
    }

    private suspend fun awaitArmedAndReady(initialTelemetry: Telemetry, stations: AgentStationGeometry) {
        var telemetry = initialTelemetry
        while (true) {
            val network = runCatching { backend.networkState() }.getOrNull()
            val homeStationId = network?.let { state ->
                stations.reportedStationId(
                    agent = backend.getAgent(config.agentId),
                    position = telemetry.position,
                    stations = state.stations.filter { it.status == StationStatus.ACTIVE },
                    stationSlots = state.stationSlots,
                ) ?: stations.effectiveHubId(backend.getAgent(config.agentId), state.stationSlots)
            } ?: backend.getAgent(config.agentId).currentStationId

            backend.updateAgentState(
                agentId = config.agentId,
                position = telemetry.position,
                energyLevelPercent = simulatedEnergyPercent,
                status = AgentStatus.ARMING,
                currentStationId = homeStationId,
            )
            if (vehicle.ensureArmed()) {
                val settleMillis = AgentControllerConstants.PX4_POST_ARM_SETTLE_MILLIS
                if (settleMillis > 0L) {
                    println(
                        "[${config.agentId}] PX4 armed; waiting ${settleMillis}ms for flight stack to settle.",
                    )
                    delay(settleMillis)
                }
                vehicle.disarm()
                println("[${config.agentId}] PX4 verified on pad; agent is AVAILABLE (disarmed until mission).")
                val freshNetwork = runCatching { backend.networkState() }.getOrNull()
                val agent = backend.getAgent(config.agentId)
                val position = vehicle.telemetry().position
                val reportedId = freshNetwork?.let { state ->
                    val active = state.stations.filter { it.status == StationStatus.ACTIVE }
                    stations.reportedStationId(agent, position, active, state.stationSlots)
                        ?: stations.effectiveHubId(agent, state.stationSlots)
                } ?: agent.currentStationId
                backend.updateAgentState(
                    agentId = config.agentId,
                    position = position,
                    energyLevelPercent = simulatedEnergyPercent,
                    status = AgentStatus.AVAILABLE,
                    currentStationId = reportedId,
                )
                return
            }
            println("[${config.agentId}] PX4 not armed yet; retrying in 2s.")
            delay(2_000)
            telemetry = vehicle.telemetry()
        }
    }

    private fun configuredRangeMeters(): Double =
        (System.getenv("AGENT_MAX_RANGE_METERS")
            ?: if (config.agentType == AgentType.UAV) "15000.0" else "8000.0").toDouble()

    private fun configuredPayloadCapacityKg(): Double =
        (System.getenv("AGENT_PAYLOAD_CAPACITY_KG")
            ?: if (config.agentType == AgentType.UAV) "5.0" else "20.0").toDouble()
}
