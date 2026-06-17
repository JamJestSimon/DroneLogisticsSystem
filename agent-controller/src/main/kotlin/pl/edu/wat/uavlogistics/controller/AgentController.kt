package pl.edu.wat.uavlogistics.controller

import kotlinx.coroutines.delay
import pl.edu.wat.uavlogistics.common.AgentStatus
import pl.edu.wat.uavlogistics.common.ControllerConfig
import pl.edu.wat.uavlogistics.common.NetworkStateDto
import pl.edu.wat.uavlogistics.common.StationStatus
import pl.edu.wat.uavlogistics.common.TransportAgentDto
import pl.edu.wat.uavlogistics.common.TransportTaskDto
import pl.edu.wat.uavlogistics.common.TransportTaskKind
import pl.edu.wat.uavlogistics.common.TransportTaskStatus
import pl.edu.wat.uavlogistics.common.inProgressTaskFor
import pl.edu.wat.uavlogistics.common.packageReturnPendingFor

/**
 * Main control loop: package tasks first, then load-based rebalance tasks from the backend registry.
 */
class AgentController(
    private val config: ControllerConfig,
    backend: BackendClient,
    vehicle: VehicleAdapter,
    cargoVisual: CargoVisualClient,
    private val planner: RoutePlanner,
) {
    private val runtime = AgentRuntime(config, backend, vehicle, planner)
    private val stations = AgentStationGeometry(runtime)
    private val hub = AgentHubParking(runtime, stations)
    private val parking = AgentParkingCoordinator(runtime, stations, hub, planner)
    private val transport = AgentTransportTasks(runtime, stations, hub, parking, cargoVisual, planner)
    private val staging = AgentStagingTasks(runtime, stations, hub, parking, transport)
    private val rebalance = AgentRebalanceTasks(runtime, stations, hub, parking)

    suspend fun run() {
        runtime.vehicle.connect()
        runtime.simulatedEnergyPercent =
            runtime.vehicle.telemetry().energyLevelPercent.coerceIn(0.0, 100.0)
        runtime.registerAndActivate(stations)

        while (true) {
            val telemetry = runtime.vehicle.telemetry()
            val network = runCatching { runtime.backend.networkState() }.getOrNull()
            if (network == null) {
                println("[${config.agentId}] networkState failed; retrying.")
                delay(config.pollingPeriodMillis)
                continue
            }

            val activeStations = network.stations.filter { it.status == StationStatus.ACTIVE }
            var agent = stations.reconcileStationRegistry(
                runtime.backend.getAgent(config.agentId),
                telemetry,
                activeStations,
                network.stationSlots,
            )

            if (runtime.relocationAwaitingParking) {
                parking.pollClaimedRelocationParking(agent)?.let { completion ->
                    executeClaimedRelocation(completion)
                }
                runtime.backend.updateAgentState(
                    agentId = config.agentId,
                    position = telemetry.position,
                    energyLevelPercent = runtime.simulatedEnergyPercent,
                    status = AgentStatus.BUSY,
                    currentStationId = agent.currentStationId,
                )
                delay(config.pollingPeriodMillis)
                continue
            }

            val inProgressTask = network.tasks.inProgressTaskFor(agent.id)
            val returnPendingTask = network.tasks.packageReturnPendingFor(agent.id)
            if (inProgressTask != null) {
                if (inProgressTask.kind == TransportTaskKind.PACKAGE &&
                    inProgressTask.status == TransportTaskStatus.IN_PROGRESS &&
                    transport.tryResumePackageReturn(inProgressTask)
                ) {
                    delay(config.pollingPeriodMillis)
                    continue
                }
                runtime.backend.updateAgentState(
                    agentId = config.agentId,
                    position = telemetry.position,
                    energyLevelPercent = runtime.simulatedEnergyPercent,
                    status = agent.status,
                    currentStationId = agent.currentStationId,
                )
                delay(config.pollingPeriodMillis)
                continue
            }
            if (returnPendingTask != null && agent.status == AgentStatus.BUSY &&
                transport.tryResumePackageReturn(returnPendingTask)
            ) {
                delay(config.pollingPeriodMillis)
                continue
            }

            val obstacles = runtime.groundObstacles(network)

            // Register staging/rebalance tasks before syncing dock (task API only; no parking changes).
            if (agent.status == AgentStatus.AVAILABLE) {
                val tasksForObserve = runCatching { runtime.backend.availableTasks(config.agentId) }.getOrNull()
                if (tasksForObserve != null) {
                    rebalance.observeAndEnsureRebalanceTasks(agent, network)
                    val planningAgent = runtime.planningAgent(agent, telemetry)
                    val packageTasks = tasksForObserve.filter { it.kind == TransportTaskKind.PACKAGE }
                    staging.observeAndEnsureStagingTasks(
                        agent = agent,
                        planningAgent = planningAgent,
                        packageTasks = packageTasks,
                        network = network,
                        groundObstacles = obstacles,
                    )
                }
            }

            val currentStationId = stations.reportedStationId(
                agent,
                telemetry.position,
                activeStations,
                network.stationSlots,
            )
            if (agent.status == AgentStatus.BUSY && network.tasks.inProgressTaskFor(agent.id) == null) {
                runtime.backend.updateAgentState(
                    agentId = config.agentId,
                    position = telemetry.position,
                    energyLevelPercent = runtime.simulatedEnergyPercent,
                    status = AgentStatus.AVAILABLE,
                    currentStationId = currentStationId ?: agent.currentStationId,
                )
                agent = runtime.backend.getAgent(config.agentId)
            } else if (agent.status == AgentStatus.BUSY) {
                runtime.backend.updateAgentState(
                    agentId = config.agentId,
                    position = telemetry.position,
                    energyLevelPercent = runtime.simulatedEnergyPercent,
                    status = AgentStatus.BUSY,
                    currentStationId = agent.currentStationId ?: currentStationId,
                )
                agent = runtime.backend.getAgent(config.agentId)
            } else if (agent.status == AgentStatus.CHARGING) {
                runtime.backend.updateAgentState(
                    agentId = config.agentId,
                    position = telemetry.position,
                    energyLevelPercent = runtime.simulatedEnergyPercent,
                    status = AgentStatus.CHARGING,
                    currentStationId = currentStationId ?: agent.currentStationId,
                )
                agent = runtime.backend.getAgent(config.agentId)
            } else if (agent.status == AgentStatus.AVAILABLE) {
                runtime.backend.updateAgentState(
                    agentId = config.agentId,
                    position = telemetry.position,
                    energyLevelPercent = runtime.simulatedEnergyPercent,
                    status = AgentStatus.AVAILABLE,
                    currentStationId = currentStationId,
                )
                agent = runtime.backend.getAgent(config.agentId)
            }

            if (agent.status == AgentStatus.AVAILABLE) {
                val availableTasks = runCatching { runtime.backend.availableTasks(config.agentId) }.getOrNull()
                if (availableTasks == null) {
                    println("[${config.agentId}] availableTasks failed; retrying.")
                    delay(config.pollingPeriodMillis)
                    continue
                }

                if (parking.tryCompleteEphemeralParkingRelocation(agent, obstacles)) {
                    delay(config.pollingPeriodMillis)
                    continue
                }

                if (parking.tryConfirmReservedParkingOccupancy(agent)) {
                    delay(config.pollingPeriodMillis)
                    continue
                }
                if (parking.tryRecoverOrphanedParkingOnPad(agent)) {
                    delay(config.pollingPeriodMillis)
                    continue
                }

                val planningAgent = runtime.planningAgent(agent, telemetry)
                val packageTasks = availableTasks.filter { it.kind == TransportTaskKind.PACKAGE }

                val candidate = transport.selectBestTaskCandidate(
                    planningAgent,
                    packageTasks,
                    activeStations,
                    network,
                    obstacles,
                )

                val stagingTask = staging.selectStagingTask(agent, availableTasks, network)
                if (stagingTask != null &&
                    runtime.simulatedEnergyPercent >= AgentControllerConstants.MIN_ENERGY_BEFORE_TASK_PERCENT &&
                    tryBeginRelocationTask(agent, stagingTask, network, obstacles)
                ) {
                    delay(config.pollingPeriodMillis)
                    continue
                }

                if (candidate != null &&
                    runtime.simulatedEnergyPercent >= AgentControllerConstants.MIN_ENERGY_BEFORE_TASK_PERCENT
                ) {
                    val parkingPlan = transport.reserveParkingForTask(candidate.task)
                    if (parkingPlan != null) {
                        val claim = runtime.backend.claimTask(candidate.task.id, config.agentId)
                        if (claim.claimed) {
                            println(
                                "[${config.agentId}] Claimed package task ${candidate.task.id}; " +
                                    "executing ${candidate.route.distanceMeters} m route.",
                            )
                            transport.executeTransportTask(candidate.task, parkingPlan)
                            delay(config.pollingPeriodMillis)
                            continue
                        }
                        runtime.backend.releaseParkingSlot(
                            parkingPlan.parkingSlot.stationId,
                            parkingPlan.parkingSlot.index,
                            config.agentId,
                        )
                        println("[${config.agentId}] Package claim rejected: ${claim.reason}")
                    }
                }

                val rebalanceTask = rebalance.selectRebalanceTask(agent, availableTasks, network)
                if (rebalanceTask != null &&
                    runtime.simulatedEnergyPercent >= AgentControllerConstants.MIN_ENERGY_BEFORE_TASK_PERCENT &&
                    tryBeginRelocationTask(agent, rebalanceTask, network, obstacles)
                ) {
                    delay(config.pollingPeriodMillis)
                    continue
                }

                if (currentStationId != null &&
                    runtime.simulatedEnergyPercent < AgentControllerConstants.FULL_ENERGY_PERCENT
                ) {
                    runtime.chargeAtStation(telemetry.position, currentStationId, stations)
                }
            }
            delay(config.pollingPeriodMillis)
        }
    }

    /**
     * Relocation: claim while docked at [TransportTaskDto.startStationId], then release origin parking,
     * then reserve destination (ephemeral wait or immediate drive).
     */
    private suspend fun tryBeginRelocationTask(
        agent: TransportAgentDto,
        relocationTask: TransportTaskDto,
        network: NetworkStateDto,
        groundObstacles: List<GroundObstacle>,
    ): Boolean {
        val destinationId = relocationTask.endStationId ?: return false
        val destinationStation = network.stations.firstOrNull { it.id == destinationId } ?: return false
        val originId = relocationTask.startStationId
        if (originId == null) {
            println(
                "[${config.agentId}] Relocation ${relocationTask.id} has no origin station; skipping.",
            )
            return false
        }
        if (agent.currentStationId != originId) {
            println(
                "[${config.agentId}] Cannot claim relocation ${relocationTask.id}: " +
                    "must be docked at origin $originId (dock=${agent.currentStationId}).",
            )
            return false
        }

        val claim = runtime.backend.claimTask(relocationTask.id, config.agentId)
        if (!claim.claimed) {
            println("[${config.agentId}] Relocation claim rejected: ${claim.reason}")
            return false
        }
        println(
            "[${config.agentId}] Claimed relocation task ${relocationTask.id} " +
                "($originId → $destinationId).",
        )

        return when (val outcome = parking.reserveRelocationParking(destinationStation, network.stationSlots)) {
            RelocationParkingOutcome.Unavailable -> {
                runCatching { runtime.backend.abandonRelocationClaim(relocationTask.id, config.agentId) }
                originId?.let { id ->
                    parking.restoreOriginParkingIfPresent(id, network.stationSlots)
                }
                println(
                    "[${config.agentId}] Relocation ${relocationTask.id} aborted: " +
                        "no parking at $destinationId.",
                )
                false
            }
            is RelocationParkingOutcome.EphemeralWait, is RelocationParkingOutcome.Ready -> {
                parking.releaseOriginParkingAfterRelocationClaim(
                    relocationTask = relocationTask,
                    fromStationId = originId,
                    stationSlots = network.stationSlots,
                )
                when (outcome) {
                    is RelocationParkingOutcome.EphemeralWait -> {
                        parking.holdEphemeralRelocationAfterClaim(
                            relocationTask = relocationTask,
                            destinationStationId = destinationId,
                            slot = outcome.slot,
                        )
                        true
                    }
                    is RelocationParkingOutcome.Ready -> {
                        executeClaimedRelocation(PendingRelocationCompletion(relocationTask, outcome.slot))
                        true
                    }
                    RelocationParkingOutcome.Unavailable -> false
                }
            }
        }
    }

    private suspend fun executeClaimedRelocation(completion: PendingRelocationCompletion) {
        when (completion.task.kind) {
            TransportTaskKind.STAGING -> staging.executeStagingTask(completion.task, completion.slot)
            TransportTaskKind.REBALANCE -> rebalance.executeRebalanceTask(completion.task, completion.slot)
            else -> error("Not a relocation task: ${completion.task.kind}")
        }
    }
}
