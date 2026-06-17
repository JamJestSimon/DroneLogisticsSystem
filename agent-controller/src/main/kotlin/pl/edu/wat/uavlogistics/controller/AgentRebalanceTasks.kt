package pl.edu.wat.uavlogistics.controller

import pl.edu.wat.uavlogistics.common.AgentStatus
import pl.edu.wat.uavlogistics.common.Geo
import pl.edu.wat.uavlogistics.common.GeoPoint
import pl.edu.wat.uavlogistics.common.NetworkStateDto
import pl.edu.wat.uavlogistics.common.StationStatus
import pl.edu.wat.uavlogistics.common.TransportAgentDto
import pl.edu.wat.uavlogistics.common.TransportTaskDto
import pl.edu.wat.uavlogistics.common.TransportTaskKind
import pl.edu.wat.uavlogistics.common.TransportTaskStatus

/** Observes hub load, ensures rebalance tasks exist, claims and executes them like transport work. */
internal class AgentRebalanceTasks(
    private val runtime: AgentRuntime,
    private val stations: AgentStationGeometry,
    private val hub: AgentHubParking,
    private val parking: AgentParkingCoordinator,
) {
    private val config get() = runtime.config
    private val backend get() = runtime.backend
    private val vehicle get() = runtime.vehicle

    /**
     * When this agent's hub is overloaded vs a neighbor by at least
     * [AgentControllerConstants.REBALANCE_MIN_LOAD_IMPROVEMENT], ensure a deterministic rebalance task exists.
     */
    suspend fun observeAndEnsureRebalanceTasks(
        agent: TransportAgentDto,
        network: NetworkStateDto,
    ) {
        if (agent.status != AgentStatus.AVAILABLE) {
            return
        }
        val stationsList = network.stations.filter { it.status == StationStatus.ACTIVE }
        val stationSlots = network.stationSlots
        val hubId = agent.currentStationId ?: parking.agentEffectiveHubId(agent, stationSlots) ?: return
        val currentStation = stationsList.firstOrNull { it.id == hubId } ?: return
        val currentLoad = parking.effectiveParkingLoad(currentStation, stationSlots)

        stationsList
            .filter { it.id != hubId }
            .filter { neighbor -> parking.hasParkingAvailableForAgent(neighbor, stationSlots) }
            .filter { neighbor -> !inboundStagingTargetsHub(neighbor.id, network) }
            .filter { neighbor ->
                currentLoad - parking.effectiveParkingLoad(neighbor, stationSlots) >=
                    AgentControllerConstants.REBALANCE_MIN_LOAD_IMPROVEMENT
            }
            .filter { neighbor -> rebalanceLegFeasible(agent, neighbor.position) }
            .forEach { neighbor ->
                runCatching {
                    backend.ensureRebalanceTask(hubId, neighbor.id)
                }.onFailure { error ->
                    println(
                        "[${config.agentId}] ensureRebalanceTask $hubId → ${neighbor.id} failed: ${error.message}",
                    )
                }
            }
    }

    fun selectRebalanceTask(
        agent: TransportAgentDto,
        tasks: List<TransportTaskDto>,
        network: NetworkStateDto,
    ): TransportTaskDto? {
        val hubId = agent.currentStationId
            ?: parking.agentEffectiveHubId(agent, network.stationSlots)
            ?: return null
        return tasks
            .filter { it.kind == TransportTaskKind.REBALANCE && it.status == TransportTaskStatus.AVAILABLE }
            .filter { it.startStationId == hubId }
            .filter { task ->
                val destId = task.endStationId ?: return@filter true
                !inboundStagingTargetsHub(destId, network)
            }
            .filter { task -> rebalanceLegFeasible(agent, task.endPoint) }
            .minByOrNull { task ->
                val dest = network.stations.firstOrNull { it.id == task.endStationId }
                if (dest != null) {
                    parking.effectiveParkingLoad(dest, network.stationSlots)
                } else {
                    Int.MAX_VALUE
                }
            }
    }

    /**
     * Destination parking must already be a non-ephemeral reservation. BUSY (from claim) → launch → fly → dock → complete.
     */
    suspend fun executeRebalanceTask(task: TransportTaskDto, destinationSlot: pl.edu.wat.uavlogistics.common.StationSlotDto) {
        val destinationId = task.endStationId ?: return
        val network = backend.networkState()
        val destinationStation = network.stations.firstOrNull { it.id == destinationId } ?: return

        val onBusy: suspend (Telemetry) -> Unit = { telemetry ->
            runtime.updateBusyState(telemetry)
        }

        runtime.vehicle.launch(onBusy)

        val routeAgent = runtime.routingAgent(backend.getAgent(config.agentId), vehicle.telemetry())
        val route = runtime.planRouteToPoint(
            routeAgent,
            stations.slotDrivePoint(destinationStation, destinationSlot),
            runtime.groundObstacles(network),
        )
        if (route.estimatedEnergyPercent + AgentControllerConstants.TASK_ROUTE_RESERVE_PERCENT >
            runtime.simulatedEnergyPercent
        ) {
            println("[${config.agentId}] Rebalance to $destinationId blocked: insufficient energy.")
            abortRebalance(task.id, destinationSlot, task.startStationId, destinationStation)
            return
        }

        var parkedPosition = hub.flyAndDockAtHubParkingSlot(
            station = destinationStation,
            slot = destinationSlot,
            routeAgent = routeAgent,
            groundObstacles = runtime.groundObstacles(network),
            onTelemetry = onBusy,
        )
        if (parkedPosition == null) {
            parkedPosition = hub.waitForPhysicalDockAtSlot(destinationStation, destinationSlot)
            if (parkedPosition != null) {
                runtime.vehicle.disarm()
                runtime.vehicle.resetHomeAtCurrentPosition()
            }
        }
        if (parkedPosition == null) {
            println("[${config.agentId}] Rebalance landing failed at $destinationId.")
            abortRebalance(task.id, destinationSlot, task.startStationId, destinationStation)
            return
        }
        runtime.consumeEnergy(route)
        if (!stations.physicallyLandedAtParkingSlot(parkedPosition, destinationStation, destinationSlot)) {
            println(
                "[${config.agentId}] Rebalance landed near $destinationId slot ${destinationSlot.index} " +
                    "but not on parking pad; aborting.",
            )
            abortRebalance(task.id, destinationSlot, task.startStationId, destinationStation)
            return
        }
        task.startStationId?.let { originId ->
            val origin = network.stations.firstOrNull { it.id == originId } ?: return@let
            val fromOriginMeters = Geo.distanceMeters(parkedPosition, origin.position)
            if (fromOriginMeters < AgentControllerConstants.SAME_STATION_RETURN_MAX_METERS) {
                println(
                    "[${config.agentId}] Rebalance still ${fromOriginMeters.formatForLog()}m from origin $originId; " +
                        "aborting premature completion.",
                )
                abortRebalance(task.id, destinationSlot, task.startStationId, destinationStation)
                return
            }
        }

        if (!hub.finalizeParkedAtHub(parkedPosition, destinationStation, destinationSlot, stayBusy = true)) {
            abortRebalance(task.id, destinationSlot, task.startStationId, destinationStation)
            return
        }
        val completed = runCatching {
            backend.completeRebalanceTask(task.id, config.agentId)
        }
        if (completed.isFailure) {
            println(
                "[${config.agentId}] completeRebalanceTask failed: ${completed.exceptionOrNull()?.message}",
            )
            abortRebalance(task.id, destinationSlot, task.startStationId, destinationStation)
            return
        }
        runtime.backend.updateAgentState(
            agentId = config.agentId,
            position = parkedPosition,
            energyLevelPercent = runtime.simulatedEnergyPercent,
            status = AgentStatus.AVAILABLE,
            currentStationId = destinationId,
        )
        if (runtime.simulatedEnergyPercent < AgentControllerConstants.FULL_ENERGY_PERCENT) {
            runtime.chargeAtStation(parkedPosition, destinationId, stations)
        }
        println("[${config.agentId}] Rebalance task ${task.id} completed at $destinationId.")
    }

    private suspend fun abortRebalance(
        taskId: String,
        destinationSlot: pl.edu.wat.uavlogistics.common.StationSlotDto,
        originStationId: String? = null,
        destinationStation: pl.edu.wat.uavlogistics.common.TransferStationDto? = null,
    ) {
        val position = vehicle.telemetry().position
        val destStation = destinationStation
            ?: backend.networkState().stations.firstOrNull { it.id == destinationSlot.stationId }
        if (destStation != null &&
            stations.physicallyLandedAtParkingSlot(position, destStation, destinationSlot)
        ) {
            runtime.vehicle.disarm()
            runtime.vehicle.resetHomeAtCurrentPosition()
            if (hub.finalizeParkedAtHub(position, destStation, destinationSlot, stayBusy = true)) {
                val completed = runCatching { backend.completeRebalanceTask(taskId, config.agentId) }
                if (completed.isSuccess) {
                    runtime.backend.updateAgentState(
                        agentId = config.agentId,
                        position = position,
                        energyLevelPercent = runtime.simulatedEnergyPercent,
                        status = AgentStatus.AVAILABLE,
                        currentStationId = destinationSlot.stationId,
                    )
                    if (runtime.simulatedEnergyPercent < AgentControllerConstants.FULL_ENERGY_PERCENT) {
                        runtime.chargeAtStation(position, destinationSlot.stationId, stations)
                    }
                    println("[${config.agentId}] Rebalance task $taskId recovered on pad at ${destinationSlot.stationId}.")
                    return
                }
                println(
                    "[${config.agentId}] Rebalance occupy recovered but complete failed: " +
                        "${completed.exceptionOrNull()?.message}",
                )
            }
        }
        runCatching {
            backend.abandonRelocationClaim(taskId, config.agentId)
        }
        if (destStation == null ||
            !stations.physicallyLandedAtParkingSlot(position, destStation, destinationSlot)
        ) {
            runCatching {
                backend.releaseParkingSlot(destinationSlot.stationId, destinationSlot.index, config.agentId)
            }
        }
        val onDestinationPad = destStation != null &&
            stations.physicallyLandedAtParkingSlot(position, destStation, destinationSlot)
        val dockId = if (onDestinationPad) {
            null
        } else {
            originStationId?.let { id ->
                parking.restoreOriginParkingIfPresent(id, backend.networkState().stationSlots)
                id
            }
        }
        runtime.backend.updateAgentState(
            agentId = config.agentId,
            position = position,
            energyLevelPercent = runtime.simulatedEnergyPercent,
            status = AgentStatus.AVAILABLE,
            currentStationId = dockId,
        )
        println("[${config.agentId}] Rebalance task $taskId aborted.")
    }

    /** Matches backend [RebalanceTaskService.rebalanceLegFeasible]: one-hop range from current position. */
    private fun rebalanceLegFeasible(agent: TransportAgentDto, destination: GeoPoint): Boolean {
        val distance = Geo.distanceMeters(agent.position, destination)
        val usableRange = agent.maxRangeMeters * (agent.energyLevelPercent / 100.0)
        return distance <= usableRange
    }

    /** True when a peer is staging into [hubId]; blocks rebalance *into* that hub, not departures from it. */
    private fun inboundStagingTargetsHub(hubId: String, network: NetworkStateDto): Boolean =
        network.tasks.any { task ->
            task.kind == TransportTaskKind.STAGING &&
                task.endStationId == hubId &&
                task.status in setOf(TransportTaskStatus.AVAILABLE, TransportTaskStatus.IN_PROGRESS)
        }
}
