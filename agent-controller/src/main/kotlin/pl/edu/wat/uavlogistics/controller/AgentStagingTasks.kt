package pl.edu.wat.uavlogistics.controller

import pl.edu.wat.uavlogistics.common.AgentStatus
import pl.edu.wat.uavlogistics.common.NetworkStateDto
import pl.edu.wat.uavlogistics.common.StationStatus
import pl.edu.wat.uavlogistics.common.StagingTaskIds
import pl.edu.wat.uavlogistics.common.TransportAgentDto
import pl.edu.wat.uavlogistics.common.TransportTaskDto
import pl.edu.wat.uavlogistics.common.TransportTaskKind
import pl.edu.wat.uavlogistics.common.TransportTaskStatus
import pl.edu.wat.uavlogistics.common.shipmentsById

/**
 * Ensures backend STAGING tasks when this agent is closest to a package but cannot afford the
 * mission from its current hub. Any feasible agent at the task origin may claim and execute them
 * (same open competition model as rebalance).
 */
internal class AgentStagingTasks(
    private val runtime: AgentRuntime,
    private val stations: AgentStationGeometry,
    private val hub: AgentHubParking,
    private val parking: AgentParkingCoordinator,
    private val transport: AgentTransportTasks,
) {
    private val config get() = runtime.config
    private val backend get() = runtime.backend
    private val vehicle get() = runtime.vehicle

    suspend fun observeAndEnsureStagingTasks(
        agent: TransportAgentDto,
        planningAgent: TransportAgentDto,
        packageTasks: List<TransportTaskDto>,
        network: NetworkStateDto,
        groundObstacles: List<GroundObstacle>,
    ) {
        if (agent.status != AgentStatus.AVAILABLE) {
            return
        }
        val activeStations = network.stations.filter { it.status == StationStatus.ACTIVE }
        val stationSlots = network.stationSlots
        for (task in transport.actionableTasks(planningAgent, packageTasks, network.shipmentsById())) {
            if (!transport.isClosestEligibleAgent(planningAgent, task, network, stations)) {
                continue
            }
            val proposal = resolveStagingProposal(
                agent = agent,
                planningAgent = planningAgent,
                packageTask = task,
                activeStations = activeStations,
                stationSlots = stationSlots,
                groundObstacles = groundObstacles,
                shipmentsById = network.shipmentsById(),
            )
            if (proposal == null) {
                runCatching { backend.cancelAvailableStagingForPackage(task.id) }
                continue
            }
            println(
                "[${config.agentId}] Ensuring staging ${proposal.fromStationId} → ${proposal.toStationId} " +
                    "for package ${task.id}.",
            )
            runCatching {
                backend.ensureStagingTask(
                    agentId = config.agentId,
                    packageTaskId = task.id,
                    fromStationId = proposal.fromStationId,
                    toStationId = proposal.toStationId,
                )
            }.onFailure { error ->
                println(
                    "[${config.agentId}] ensureStagingTask for package ${task.id} " +
                        "→ ${proposal.toStationId} failed: ${error.message}",
                )
            }
        }
    }

    fun selectStagingTask(
        agent: TransportAgentDto,
        tasks: List<TransportTaskDto>,
        network: NetworkStateDto,
    ): TransportTaskDto? {
        val dockId = agent.currentStationId ?: return null
        val candidates = tasks
            .filter { it.kind == TransportTaskKind.STAGING && it.status == TransportTaskStatus.AVAILABLE }
            .filter { task -> task.startStationId == dockId }
        if (candidates.isEmpty() && tasks.any { it.kind == TransportTaskKind.STAGING && it.startStationId != null }) {
            println(
                "[${config.agentId}] Staging task(s) exist but none start at docked hub $dockId.",
            )
        }
        return candidates.minByOrNull { task ->
                val dest = network.stations.firstOrNull { it.id == task.endStationId }
                if (dest != null) {
                    parking.effectiveParkingLoad(dest, network.stationSlots)
                } else {
                    Int.MAX_VALUE
                }
            }
    }

    suspend fun executeStagingTask(
        task: TransportTaskDto,
        destinationSlot: pl.edu.wat.uavlogistics.common.StationSlotDto,
    ) {
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
            println("[${config.agentId}] Staging to $destinationId blocked: insufficient energy.")
            abortStaging(task.id, destinationSlot, task.startStationId)
            return
        }

        val parkedPosition = hub.flyAndDockAtHubParkingSlot(
            station = destinationStation,
            slot = destinationSlot,
            routeAgent = routeAgent,
            groundObstacles = runtime.groundObstacles(network),
            onTelemetry = onBusy,
        )
        if (parkedPosition == null) {
            println("[${config.agentId}] Staging landing failed at $destinationId.")
            abortStaging(task.id, destinationSlot, task.startStationId)
            return
        }
        runtime.consumeEnergy(route)
        if (!stations.physicallyLandedAtParkingSlot(parkedPosition, destinationStation, destinationSlot)) {
            println(
                "[${config.agentId}] Staging landed near $destinationId slot ${destinationSlot.index} " +
                    "but not on parking pad; aborting.",
            )
            abortStaging(task.id, destinationSlot, task.startStationId)
            return
        }
        if (!hub.finalizeParkedAtHub(parkedPosition, destinationStation, destinationSlot, stayBusy = true)) {
            abortStaging(task.id, destinationSlot, task.startStationId)
            return
        }
        val completed = runCatching {
            backend.completeStagingTask(task.id, config.agentId)
        }
        if (completed.isFailure) {
            println(
                "[${config.agentId}] completeStagingTask failed: ${completed.exceptionOrNull()?.message}",
            )
            abortStaging(task.id, destinationSlot, task.startStationId)
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
        println(
            "[${config.agentId}] Staging task ${task.id} completed at $destinationId " +
                "(package task for shipment ${task.shipmentId}).",
        )
    }

    private suspend fun resolveStagingProposal(
        agent: TransportAgentDto,
        planningAgent: TransportAgentDto,
        packageTask: TransportTaskDto,
        activeStations: List<pl.edu.wat.uavlogistics.common.TransferStationDto>,
        stationSlots: List<pl.edu.wat.uavlogistics.common.StationSlotDto>,
        groundObstacles: List<GroundObstacle>,
        shipmentsById: Map<String, pl.edu.wat.uavlogistics.common.ShipmentDto>,
    ): StagingProposal? {
        val hubId = stations.effectiveHubId(agent, stationSlots) ?: return null

        val hub = activeStations.firstOrNull { it.id == hubId } ?: return null
        val atHubAgent = planningAgent.copy(
            position = hub.position,
            currentStationId = hubId,
            energyLevelPercent = AgentControllerConstants.FULL_ENERGY_PERCENT,
        )
        if (transport.canAffordPackageTaskFor(atHubAgent, packageTask)) {
            return null
        }
        if (stations.physicallyDockedAtHub(vehicle.telemetry().position, hub, stationSlots) &&
            transport.canAffordPackageTaskFor(planningAgent, packageTask)
        ) {
            return null
        }

        val stagingTasks = listOf(packageTask)
        val target = parking.selectTaskStagingStation(
            agent = planningAgent,
            tasks = stagingTasks,
            stationsList = activeStations,
            stationSlots = stationSlots,
            groundObstacles = groundObstacles,
            shipmentsById = shipmentsById,
        ) ?: parking.primaryPackagePickupStation(stagingTasks, activeStations, shipmentsById)
            ?: return null

        if (target.id == hubId) {
            return null
        }

        return StagingProposal(fromStationId = hubId, toStationId = target.id)
    }

    private data class StagingProposal(
        val fromStationId: String,
        val toStationId: String,
    )

    private suspend fun abortStaging(
        taskId: String,
        destinationSlot: pl.edu.wat.uavlogistics.common.StationSlotDto,
        originStationId: String? = null,
    ) {
        runCatching {
            backend.abandonRelocationClaim(taskId, config.agentId)
        }
        runCatching {
            backend.releaseParkingSlot(destinationSlot.stationId, destinationSlot.index, config.agentId)
        }
        val originId = originStationId
        val dockId = originId?.let { id ->
            parking.restoreOriginParkingIfPresent(id, backend.networkState().stationSlots)
            id
        }
        runtime.backend.updateAgentState(
            agentId = config.agentId,
            position = vehicle.telemetry().position,
            energyLevelPercent = runtime.simulatedEnergyPercent,
            status = AgentStatus.AVAILABLE,
            currentStationId = dockId,
        )
        println("[${config.agentId}] Staging task $taskId aborted.")
    }

}
