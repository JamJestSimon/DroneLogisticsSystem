package pl.edu.wat.uavlogistics.controller

import kotlinx.coroutines.delay
import pl.edu.wat.uavlogistics.common.AgentStatus
import pl.edu.wat.uavlogistics.common.AgentType
import pl.edu.wat.uavlogistics.common.Geo
import pl.edu.wat.uavlogistics.common.GeoPoint
import pl.edu.wat.uavlogistics.common.NetworkStateDto
import pl.edu.wat.uavlogistics.common.StationSlots
import pl.edu.wat.uavlogistics.common.StationSlotDto
import pl.edu.wat.uavlogistics.common.StationSlotKind
import pl.edu.wat.uavlogistics.common.StationStatus
import pl.edu.wat.uavlogistics.common.TransferStationDto
import pl.edu.wat.uavlogistics.common.TransportAgentDto
import pl.edu.wat.uavlogistics.common.TransportTaskDto
import pl.edu.wat.uavlogistics.common.inProgressTaskFor
import pl.edu.wat.uavlogistics.common.matchesAgentType
import pl.edu.wat.uavlogistics.common.requiredAgentType
import pl.edu.wat.uavlogistics.common.shipmentsById

internal sealed class RelocationParkingOutcome {
    data class Ready(val slot: StationSlotDto) : RelocationParkingOutcome()
    data class EphemeralWait(val slot: StationSlotDto) : RelocationParkingOutcome()
    data object Unavailable : RelocationParkingOutcome()
}

internal data class PendingRelocationCompletion(
    val task: TransportTaskDto,
    val slot: StationSlotDto,
)

/** Parking, staging, rebalance, and hub relocation decisions for idle agents. */
internal class AgentParkingCoordinator(
    private val runtime: AgentRuntime,
    private val stations: AgentStationGeometry,
    private val hub: AgentHubParking,
    private val planner: RoutePlanner,
) {
    private val config get() = runtime.config
    private val backend get() = runtime.backend
    private val vehicle get() = runtime.vehicle

    fun agentActionableTasks(
        agent: TransportAgentDto,
        tasks: List<TransportTaskDto>,
        shipmentsById: Map<String, pl.edu.wat.uavlogistics.common.ShipmentDto>,
    ): List<TransportTaskDto> =
        tasks.filter { task -> task.matchesAgentType(agent.type, shipmentsById) }

    /** Hub relocation and package return parking may use ephemeral overbook when real slots are full. */
    suspend fun reserveRelocationParking(
        station: TransferStationDto,
        stationSlots: List<StationSlotDto>,
    ): RelocationParkingOutcome = reserveParkingAtStation(station, stationSlots)

    suspend fun reserveReturnParking(
        station: TransferStationDto,
        stationSlots: List<StationSlotDto>,
    ): RelocationParkingOutcome = reserveParkingAtStation(station, stationSlots)

    private suspend fun reserveParkingAtStation(
        station: TransferStationDto,
        stationSlots: List<StationSlotDto>,
    ): RelocationParkingOutcome {
        if (!hasParkingAvailableForAgent(station, stationSlots)) {
            return RelocationParkingOutcome.Unavailable
        }
        return try {
            val slot = backend.reserveParkingSlot(station.id, config.agentId, allowEphemeral = true)
            if (slot.reservationEphemeral) {
                RelocationParkingOutcome.EphemeralWait(slot)
            } else {
                RelocationParkingOutcome.Ready(slot)
            }
        } catch (exception: Exception) {
            ParkingDiagnostics.log(
                agentId = config.agentId,
                decision = "relocation-reserve-failed",
                details = "${station.id}: ${exception.message}",
                agent = backend.getAgent(config.agentId),
                stationSlots = stationSlots,
            )
            RelocationParkingOutcome.Unavailable
        }
    }

    /**
     * Releases origin-hub parking after a relocation task was claimed. Keeps agent BUSY.
     */
    /** Re-reserve origin parking when a relocation aborts after the origin pad was released. */
    suspend fun restoreOriginParkingIfPresent(
        originStationId: String,
        stationSlots: List<StationSlotDto>,
    ): Boolean {
        val network = backend.networkState()
        val station = network.stations.firstOrNull { it.id == originStationId } ?: return false
        if (!stations.physicallyAtStation(vehicle.telemetry().position, station)) {
            return false
        }
        if (agentParkingSlotAtHub(originStationId, stationSlots) != null) {
            return true
        }
        return runCatching {
            backend.reserveParkingSlot(originStationId, config.agentId, allowEphemeral = false)
        }.isSuccess
    }

    suspend fun releaseOriginParkingAfterRelocationClaim(
        relocationTask: TransportTaskDto,
        fromStationId: String,
        stationSlots: List<StationSlotDto>,
    ) {
        stationSlots
            .filter { slot ->
                slot.stationId == fromStationId &&
                    (slot.occupiedByAgentId == config.agentId || slot.reservedByAgentId == config.agentId)
            }
            .forEach { slot ->
                runCatching {
                    backend.releaseParkingSlot(slot.stationId, slot.index, config.agentId)
                }
            }
        backend.updateAgentState(
            agentId = config.agentId,
            position = vehicle.telemetry().position,
            energyLevelPercent = runtime.simulatedEnergyPercent,
            status = AgentStatus.BUSY,
            currentStationId = null,
        )
        ParkingDiagnostics.log(
            agentId = config.agentId,
            decision = "relocation-origin-vacated",
            details = "task=${relocationTask.id} released parking at $fromStationId",
            agent = backend.getAgent(config.agentId),
            stationSlots = stationSlots,
        )
    }

    /**
     * After claim and origin vacate: wait for backend promotion before driving to [destinationStationId].
     */
    suspend fun holdEphemeralRelocationAfterClaim(
        relocationTask: TransportTaskDto,
        destinationStationId: String,
        slot: StationSlotDto,
    ) {
        runtime.claimedRelocationTask = relocationTask
        runtime.relocationAwaitingParking = true
        ParkingDiagnostics.log(
            agentId = config.agentId,
            decision = "ephemeral-relocation-hold",
            details = "task=${relocationTask.id} waiting at $destinationStationId for " +
                "${slot.expectsVacateByAgentId ?: "peer"} to vacate before driving",
            agent = backend.getAgent(config.agentId),
            stationSlots = backend.networkState().stationSlots,
        )
    }

    /**
     * Polls destination parking for a claimed relocation (re-reserve triggers backend ephemeral→real switch).
     */
    suspend fun pollClaimedRelocationParking(agent: TransportAgentDto): PendingRelocationCompletion? {
        if (!runtime.relocationAwaitingParking) {
            return null
        }
        val task = runtime.claimedRelocationTask
        val inProgressId = backend.networkState().tasks.inProgressTaskFor(agent.id)?.id
        if (task == null || inProgressId != task.id) {
            runtime.clearRelocationAwaitingParking()
            return null
        }
        val destinationId = task.endStationId ?: run {
            runtime.clearRelocationAwaitingParking()
            return null
        }
        val slot = runCatching {
            backend.reserveParkingSlot(destinationId, config.agentId, allowEphemeral = true)
        }.getOrNull() ?: return null
        if (slot.reservationEphemeral) {
            ParkingDiagnostics.log(
                agentId = config.agentId,
                decision = "ephemeral-relocation-hold",
                details = "still waiting at $destinationId for ${slot.expectsVacateByAgentId ?: "peer"}",
                agent = agent,
                stationSlots = backend.networkState().stationSlots,
            )
            return null
        }
        runtime.clearRelocationAwaitingParking()
        ParkingDiagnostics.log(
            agentId = config.agentId,
            decision = "ephemeral-relocation-promoted",
            details = "task=${task.id} driving to $destinationId slot ${slot.index}",
            agent = agent,
            stationSlots = backend.networkState().stationSlots,
        )
        return PendingRelocationCompletion(task, slot)
    }

    /**
     * Re-polls return parking until an ephemeral reservation is promoted to a real slot index,
     * or [maxWaitMillis] elapses (peer should vacate during the outbound package legs).
     */
    suspend fun awaitPromotedReturnParking(
        reserved: StationSlotDto,
        maxWaitMillis: Long = 120_000L,
    ): StationSlotDto? {
        if (!reserved.reservationEphemeral) {
            return reserved
        }
        val stationId = reserved.stationId
        val deadline = System.currentTimeMillis() + maxWaitMillis
        while (System.currentTimeMillis() < deadline) {
            val slot = runCatching {
                backend.reserveParkingSlot(stationId, config.agentId, allowEphemeral = true)
            }.getOrNull()
            if (slot != null && !slot.reservationEphemeral) {
                println(
                    "[${config.agentId}] Ephemeral return parking promoted at $stationId slot ${slot.index}.",
                )
                return slot
            }
            delay(2_000)
        }
        println(
            "[${config.agentId}] Timed out waiting for return parking promotion at $stationId.",
        )
        return null
    }

    suspend fun stageAtStationForReachableTask(
        agent: TransportAgentDto,
        tasks: List<TransportTaskDto>,
        stationsList: List<TransferStationDto>,
        network: NetworkStateDto,
        groundObstacles: List<GroundObstacle>,
        isTaskAffordable: suspend (TransportTaskDto) -> Boolean,
    ): Boolean {
        val stationSlots = network.stationSlots
        val shipmentsById = network.shipmentsById()
        val stagingTasks = agentActionableTasks(agent, tasks, shipmentsById).filter { task ->
            isClosestEligibleForPickup(
                agent = agent,
                pickupPoint = stations.packagePickupPoint(task),
                requiredAgentType = task.requiredAgentType(shipmentsById),
                peers = network.agents,
                tasks = network.tasks,
            )
        }
        if (stagingTasks.isEmpty()) return false

        agent.currentStationId?.let { stationId ->
            val station = stationsList.firstOrNull { it.id == stationId } ?: return@let
            if (stations.physicallyDockedAtHub(vehicle.telemetry().position, station, stationSlots)) {
                return false
            }
        }

        agent.currentStationId?.let { stationId ->
            val pickupStation = primaryPackagePickupStation(stagingTasks, stationsList, shipmentsById) ?: return@let
            if (pickupStation.id != stationId) {
                return@let
            }
            val station = stationsList.firstOrNull { it.id == stationId } ?: return@let
            if (!stations.physicallyAtStation(agent.position, station)) {
                return@let
            }
            if (stagingTasks.any { isTaskAffordable(it) }) {
                return false
            }
        }

        val target = selectTaskStagingStation(
            agent,
            stagingTasks,
            stationsList,
            stationSlots,
            groundObstacles,
            shipmentsById,
        )
            ?: primaryPackagePickupStation(stagingTasks, stationsList, shipmentsById)
            ?: return false
        if (target.id == agent.currentStationId) {
            return false
        }
        val fromStationId = agent.currentStationId
        if (fromStationId != null &&
            target.id != fromStationId &&
            runtime.lastPackageStagingTargetStationId == target.id &&
            runtime.lastPackageStagingFromStationId == fromStationId &&
            System.currentTimeMillis() - runtime.lastPackageStagingAtMs <
            AgentControllerConstants.PACKAGE_STAGING_PING_PONG_COOLDOWN_MS
        ) {
            println("[${config.agentId}] Skipping ping-pong staging between $fromStationId and ${target.id}.")
            return false
        }
        if (runtime.lastPackageStagingTargetStationId == target.id &&
            System.currentTimeMillis() - runtime.lastPackageStagingAtMs <
            AgentControllerConstants.PACKAGE_STAGING_MIN_INTERVAL_MS
        ) {
            return false
        }

        val slot = when (val outcome = reserveRelocationParking(target, stationSlots)) {
            is RelocationParkingOutcome.Ready -> outcome.slot
            is RelocationParkingOutcome.EphemeralWait -> {
                ParkingDiagnostics.log(
                    agentId = config.agentId,
                    decision = "ephemeral-hold",
                    details = "inline staging at ${target.id}; waiting for real slot",
                    agent = agent,
                    stationSlots = stationSlots,
                )
                return false
            }
            RelocationParkingOutcome.Unavailable -> return false
        }
        ParkingDiagnostics.log(
            agentId = config.agentId,
            decision = "staging-start",
            details = "from=${agent.currentStationId} to=${target.id} slot=${slot.index}",
            agent = agent,
            stationSlots = stationSlots,
        )
        val routeAgent = runtime.routingAgent(agent, vehicle.telemetry())
        val route = runtime.planRouteToPoint(
            routeAgent,
            stations.slotDrivePoint(target, slot),
            groundObstacles,
        )
        if (route.estimatedEnergyPercent + AgentControllerConstants.TASK_ROUTE_RESERVE_PERCENT >
            runtime.simulatedEnergyPercent
        ) {
            backend.releaseParkingSlot(slot.stationId, slot.index, config.agentId)
            return false
        }

        println("[${config.agentId}] Staging at station ${target.id} to make a compatible package task reachable.")
        beginHubRelocationTransit(agent, stationSlots, slot, fromStationId)
        return hub.driveToHubParkingSlot(
            agent = agent,
            targetStation = target,
            slot = slot,
            routeAgent = routeAgent,
            groundObstacles = groundObstacles,
            reason = "package task staging",
            fromStationId = fromStationId,
            stationSlots = stationSlots,
            applyStagingMemory = true,
            releaseReservationOnFailure = true,
        )
    }

    suspend fun driveToStationHub(
        agent: TransportAgentDto,
        targetStation: TransferStationDto,
        stationSlots: List<StationSlotDto>,
        groundObstacles: List<GroundObstacle>,
        reason: String,
        applyRelocationCooldown: Boolean,
    ): Boolean {
        if (!hasParkingAvailableForAgent(targetStation, stationSlots)) {
            ParkingDiagnostics.log(
                agentId = config.agentId,
                decision = "relocate-blocked",
                details = "no parking at ${targetStation.id} for $reason",
                agent = agent,
                stationSlots = stationSlots,
            )
            return false
        }
        val fromStationId = agent.currentStationId
        if (applyRelocationCooldown &&
            fromStationId != null &&
            targetStation.id != fromStationId &&
            runtime.lastPackageStagingTargetStationId == targetStation.id &&
            runtime.lastPackageStagingFromStationId == fromStationId &&
            System.currentTimeMillis() - runtime.lastPackageStagingAtMs <
            AgentControllerConstants.PACKAGE_STAGING_PING_PONG_COOLDOWN_MS
        ) {
            println("[${config.agentId}] Skipping ping-pong relocation between $fromStationId and ${targetStation.id}.")
            return false
        }

        val routeAgent = runtime.routingAgent(agent, vehicle.telemetry())
        val slot = when (val outcome = reserveRelocationParking(targetStation, stationSlots)) {
            is RelocationParkingOutcome.Ready -> outcome.slot
            is RelocationParkingOutcome.EphemeralWait -> {
                if (fromStationId != null && fromStationId != targetStation.id) {
                    vacateCurrentStationParking(agent, stationSlots, fromStationId)
                }
                ParkingDiagnostics.log(
                    agentId = config.agentId,
                    decision = "ephemeral-hold",
                    details = "reserved ephemeral at ${targetStation.id}; released $fromStationId; " +
                        "waiting for ${outcome.slot.expectsVacateByAgentId ?: "peer"} to vacate before driving",
                    agent = backend.getAgent(config.agentId),
                    stationSlots = backend.networkState().stationSlots,
                )
                return false
            }
            RelocationParkingOutcome.Unavailable -> return false
        }
        if (fromStationId != null && fromStationId != targetStation.id) {
            vacateCurrentStationParking(agent, stationSlots, fromStationId)
        }
        return hub.driveToHubParkingSlot(
            agent = agent,
            targetStation = targetStation,
            slot = slot,
            routeAgent = routeAgent,
            groundObstacles = groundObstacles,
            reason = reason,
            fromStationId = fromStationId,
            stationSlots = stationSlots,
            applyStagingMemory = true,
        )
    }

    /** After ephemeral promotion (real slot reserved), drive to the hub and dock. */
    suspend fun tryCompleteEphemeralParkingRelocation(
        agent: TransportAgentDto,
        groundObstacles: List<GroundObstacle>,
    ): Boolean {
        if (runtime.relocationAwaitingParking) {
            return false
        }
        if (agent.status != AgentStatus.AVAILABLE) {
            return false
        }
        val network = backend.networkState()
        val waitStationId = ephemeralWaitStationId(network.stationSlots) ?: return false
        val targetStation = network.stations.firstOrNull { it.id == waitStationId } ?: return false
        if (
            agent.currentStationId == waitStationId &&
            stations.physicallyAtStation(vehicle.telemetry().position, targetStation)
        ) {
            return false
        }

        val slot = runCatching {
            backend.reserveParkingSlot(waitStationId, config.agentId, allowEphemeral = true)
        }.getOrNull() ?: return false
        if (slot.reservationEphemeral) {
            ParkingDiagnostics.log(
                agentId = config.agentId,
                decision = "ephemeral-hold",
                details = "still waiting at $waitStationId for ${slot.expectsVacateByAgentId ?: "peer"} to vacate",
                agent = agent,
                stationSlots = network.stationSlots,
            )
            return false
        }

        ParkingDiagnostics.log(
            agentId = config.agentId,
            decision = "ephemeral-promoted",
            details = "driving to $waitStationId slot ${slot.index}",
            agent = agent,
            stationSlots = network.stationSlots,
        )
        val routeAgent = runtime.routingAgent(agent, vehicle.telemetry())
        return hub.driveToHubParkingSlot(
            agent = agent,
            targetStation = targetStation,
            slot = slot,
            routeAgent = routeAgent,
            groundObstacles = groundObstacles,
            reason = "ephemeral promotion",
            fromStationId = agent.currentStationId,
            stationSlots = network.stationSlots,
            applyStagingMemory = true,
        )
    }

    fun ugvCompatibleTasks(
        tasks: List<TransportTaskDto>,
        shipmentsById: Map<String, pl.edu.wat.uavlogistics.common.ShipmentDto>,
    ): List<TransportTaskDto> =
        tasks.filter { task ->
            when (task.requiredAgentType(shipmentsById)) {
                null, AgentType.UGV -> true
                else -> false
            }
        }

    fun primaryPackagePickupStation(
        tasks: List<TransportTaskDto>,
        stationsList: List<TransferStationDto>,
        shipmentsById: Map<String, pl.edu.wat.uavlogistics.common.ShipmentDto>,
    ): TransferStationDto? {
        val packageTasks = ugvCompatibleTasks(tasks, shipmentsById)
        if (packageTasks.isEmpty()) return null
        val pickupPoint = packageTasks.minByOrNull { task ->
            stationsList.minOfOrNull { station ->
                Geo.distanceMeters(station.position, task.startPoint)
            } ?: Double.MAX_VALUE
        }?.startPoint ?: return null
        return nearestStationToPoint(pickupPoint, stationsList)
    }

    fun nearestStationToPoint(
        point: GeoPoint,
        stationsList: List<TransferStationDto>,
    ): TransferStationDto? =
        stationsList
            .filter { it.status == StationStatus.ACTIVE }
            .minByOrNull { station -> Geo.distanceMeters(station.position, point) }

    fun selectTaskStagingStation(
        agent: TransportAgentDto,
        tasks: List<TransportTaskDto>,
        stationsList: List<TransferStationDto>,
        stationSlots: List<StationSlotDto>,
        groundObstacles: List<GroundObstacle>,
        shipmentsById: Map<String, pl.edu.wat.uavlogistics.common.ShipmentDto>,
    ): TransferStationDto? {
        if (tasks.isEmpty()) return null
        val currentStationId = agent.currentStationId
        return stationsList
            .filter { it.id != currentStationId }
            .filter { station -> hasParkingAvailableForAgent(station, stationSlots) }
            .filter { station ->
                val route = planner.planToPoint(
                    agent.copy(energyLevelPercent = runtime.simulatedEnergyPercent),
                    stations.travelPoint(station.position),
                    groundObstacles,
                )
                route.estimatedEnergyPercent + AgentControllerConstants.TASK_ROUTE_RESERVE_PERCENT <=
                    runtime.simulatedEnergyPercent
            }
            .mapNotNull { station ->
                val stagedAgent = agent.copy(
                    position = station.position,
                    energyLevelPercent = AgentControllerConstants.FULL_ENERGY_PERCENT,
                    currentStationId = station.id,
                )
                val bestCandidate = tasks
                    .mapNotNull { task ->
                        planner.feasibleCandidate(
                            stagedAgent,
                            task,
                            activeStations = stationsList,
                            groundObstacles = groundObstacles,
                            shipment = shipmentsById[task.shipmentId],
                        )
                    }
                    .minByOrNull { candidate -> candidate.score }
                    ?: return@mapNotNull null
                station to bestCandidate
            }
            .minWithOrNull(
                compareBy<Pair<TransferStationDto, TaskCandidate>> { (_, candidate) -> candidate.score }
                    .thenBy { (station, candidate) -> Geo.distanceMeters(station.position, candidate.task.startPoint) },
            )
            ?.first
    }

    /**
     * Marks the agent BUSY in transit to [destinationSlot] and releases departure-hub slots
     * (keeps the destination reservation). Prevents backend reconcile from dropping the reservation.
     */
    suspend fun beginHubRelocationTransit(
        agent: TransportAgentDto,
        stationSlots: List<StationSlotDto>,
        destinationSlot: StationSlotDto,
        fromStationId: String?,
    ) {
        fromStationId?.let { hubId ->
            if (hubId != destinationSlot.stationId) {
                stationSlots
                    .filter { slot ->
                        slot.stationId == hubId &&
                            (slot.occupiedByAgentId == config.agentId ||
                                slot.reservedByAgentId == config.agentId)
                    }
                    .forEach { slot ->
                        runCatching {
                            backend.releaseParkingSlot(slot.stationId, slot.index, config.agentId)
                        }
                    }
            }
        }
        backend.updateAgentState(
            agentId = config.agentId,
            position = vehicle.telemetry().position,
            energyLevelPercent = runtime.simulatedEnergyPercent,
            status = AgentStatus.BUSY,
            currentStationId = null,
        )
    }

    /**
     * Leaves the departure hub pad while keeping the reserved return slot (may be the same index).
     * Clears [TransportAgentDto.currentStationId] so the pad is free for other agents.
     */
    suspend fun vacateForMissionDeparture(
        agent: TransportAgentDto,
        stationSlots: List<StationSlotDto>,
        returnSlot: StationSlotDto,
        taskId: String,
    ) {
        val departureHubId = agent.currentStationId ?: agentEffectiveHubId(agent, stationSlots)
        if (departureHubId != null) {
            stationSlots
                .filter { slot ->
                    slot.stationId == departureHubId &&
                        (slot.occupiedByAgentId == config.agentId || slot.reservedByAgentId == config.agentId)
                }
                .forEach { slot ->
                    val keepReturnReservation =
                        slot.stationId == returnSlot.stationId && slot.index == returnSlot.index
                    if (!keepReturnReservation) {
                        runCatching {
                            backend.releaseParkingSlot(slot.stationId, slot.index, config.agentId)
                        }
                    }
                }
        }
        backend.updateAgentState(
            agentId = config.agentId,
            position = vehicle.telemetry().position,
            energyLevelPercent = runtime.simulatedEnergyPercent,
            status = AgentStatus.BUSY,
            currentStationId = null,
        )
    }

    /** Frees this agent's parking slot without reserving a replacement (hub relocation). */
    suspend fun vacateCurrentStationParking(
        agent: TransportAgentDto,
        stationSlots: List<StationSlotDto>,
        hubId: String? = null,
        statusAfterVacate: AgentStatus = AgentStatus.AVAILABLE,
    ): Boolean {
        val stationId = hubId ?: agent.currentStationId ?: agentEffectiveHubId(agent, stationSlots) ?: return false
        stationSlots
            .filter { slot ->
                slot.stationId == stationId &&
                    (slot.occupiedByAgentId == config.agentId || slot.reservedByAgentId == config.agentId)
            }
            .forEach { slot ->
                runCatching {
                    backend.releaseParkingSlot(slot.stationId, slot.index, config.agentId)
                }
            }
        backend.updateAgentState(
            agentId = config.agentId,
            position = vehicle.telemetry().position,
            energyLevelPercent = runtime.simulatedEnergyPercent,
            status = statusAfterVacate,
            currentStationId = null,
        )
        return true
    }

    fun agentEffectiveHubId(agent: TransportAgentDto, stationSlots: List<StationSlotDto>): String? =
        agent.currentStationId
            ?: ephemeralWaitStationId(stationSlots)
            ?: stationSlots.firstOrNull { slot ->
                slot.kind == StationSlotKind.PARKING &&
                    (slot.reservedByAgentId == agent.id || slot.occupiedByAgentId == agent.id)
            }?.stationId

    /** Hub for relocation select/claim when registry dock was cleared but the vehicle is still on site. */
    fun relocationOriginHubId(
        agent: TransportAgentDto,
        stationsList: List<TransferStationDto>,
        stationSlots: List<StationSlotDto>,
    ): String? {
        agent.currentStationId?.let { return it }
        agentEffectiveHubId(agent, stationSlots)?.let { return it }
        val nearest = nearestStationToPoint(agent.position, stationsList) ?: return null
        return if (stations.physicallyAtStation(agent.position, nearest)) {
            nearest.id
        } else {
            null
        }
    }

    /**
     * Restores [TransportAgentDto.currentStationId] at [hubId] when telemetry is on site but the
     * registry was cleared (e.g. reconcile-drop). Required before backend relocation claim.
     */
    suspend fun ensureRegistryDockAtHub(
        agent: TransportAgentDto,
        hubId: String,
        stationsList: List<TransferStationDto>,
        stationSlots: List<StationSlotDto>,
        groundObstacles: List<GroundObstacle>,
    ): Boolean {
        val station = stationsList.firstOrNull { it.id == hubId } ?: return false
        val telemetry = vehicle.telemetry()
        if (!stations.physicallyAtStation(telemetry.position, station)) {
            return false
        }
        if (stations.physicallyDockedAtHub(telemetry.position, station, stationSlots)) {
            if (agent.currentStationId != hubId) {
                val held = agentParkingSlotAtHub(hubId, stationSlots)
                if (held != null && held.reservedByAgentId == config.agentId) {
                    hub.finalizeParkedAtHub(telemetry.position, station, held)
                } else {
                    runtime.backend.updateAgentState(
                        agentId = config.agentId,
                        position = telemetry.position,
                        energyLevelPercent = runtime.simulatedEnergyPercent,
                        status = agent.status,
                        currentStationId = hubId,
                    )
                }
            }
            return true
        }
        agentParkingSlotAtHub(hubId, stationSlots)?.let { held ->
            if (held.reservedByAgentId == config.agentId && !held.reservationEphemeral) {
                val slotDto = StationSlots.parkingSlot(station, held.index).copy(
                    reservedByAgentId = config.agentId,
                    reservationEphemeral = false,
                )
                return hub.driveToHubParkingSlot(
                    agent = backend.getAgent(config.agentId),
                    targetStation = station,
                    slot = slotDto,
                    routeAgent = runtime.routingAgent(agent, telemetry),
                    groundObstacles = groundObstacles,
                    reason = "origin dock before relocation claim",
                    fromStationId = agent.currentStationId,
                    stationSlots = stationSlots,
                    applyStagingMemory = false,
                    releaseReservationOnFailure = true,
                )
            }
        }
        val reserved = runCatching {
            backend.reserveParkingSlot(hubId, config.agentId, allowEphemeral = false)
        }.getOrNull() ?: return false
        val slotDto = StationSlots.parkingSlot(station, reserved.index).copy(
            reservedByAgentId = config.agentId,
            reservationEphemeral = false,
        )
        return hub.driveToHubParkingSlot(
            agent = backend.getAgent(config.agentId),
            targetStation = station,
            slot = slotDto,
            routeAgent = runtime.routingAgent(agent, telemetry),
            groundObstacles = groundObstacles,
            reason = "origin dock before relocation claim",
            fromStationId = agent.currentStationId,
            stationSlots = stationSlots,
            applyStagingMemory = false,
            releaseReservationOnFailure = true,
        )
    }

    /**
     * Resolves this agent's parking slot at a hub. Occupied index wins over reservation so ephemeral
     * waiters mirrored on slot 0 in snapshots cannot steal return parking for agents on higher indices.
     */
    fun agentParkingSlotAtHub(hubId: String, stationSlots: List<StationSlotDto>): StationSlotDto? {
        val parking = stationSlots.filter { slot ->
            slot.stationId == hubId && slot.kind == StationSlotKind.PARKING
        }
        return parking.firstOrNull { it.occupiedByAgentId == config.agentId }
            ?: parking.firstOrNull {
                it.reservedByAgentId == config.agentId && !it.reservationEphemeral
            }
            ?: parking.firstOrNull { it.reservedByAgentId == config.agentId }
    }

    fun preferReturnParkingAtHub(
        agent: TransportAgentDto,
        stationSlots: List<StationSlotDto>,
    ): StationSlotDto? {
        val hubId = agent.currentStationId ?: agentEffectiveHubId(agent, stationSlots) ?: return null
        return agentParkingSlotAtHub(hubId, stationSlots)
    }

    fun ephemeralWaitStationId(stationSlots: List<StationSlotDto>): String? =
        stationSlots.firstOrNull { slot ->
            slot.kind == StationSlotKind.PARKING && isEphemeralWaiterSlot(slot)
        }?.stationId

    /** True when this agent is waiting on an ephemeral overbook (not the docked blocker). */
    fun isEphemeralWaiterSlot(slot: StationSlotDto): Boolean =
        slot.ephemeralWaiterAgentId == config.agentId ||
            (
                slot.reservedByAgentId == config.agentId &&
                    slot.reservationEphemeral &&
                    slot.occupiedByAgentId != config.agentId
                )

    fun maxParkingHolders(station: TransferStationDto): Int =
        station.parkingCapacity + parkingOverbookMargin()

    /**
     * Move to a less loaded hub when [effectiveParkingLoad] (occupied + reserved + ephemeral waiters)
     * favors another station. Fetches a fresh network snapshot (after dock state is written).
     */
    suspend fun tryRebalanceBetweenStations(
        agent: TransportAgentDto,
        groundObstacles: List<GroundObstacle>,
    ): Boolean {
        if (agent.status != AgentStatus.AVAILABLE) {
            return false
        }
        val network = backend.networkState()
        val stationsList = network.stations.filter { it.status == StationStatus.ACTIVE }
        val stationSlots = network.stationSlots
        if (tryLandAtReservedHub(agent, stationsList, stationSlots, groundObstacles)) {
            return true
        }
        val hubId = agent.currentStationId ?: agentEffectiveHubId(agent, stationSlots)
        if (hubId == null) {
            logRebalanceSkip(agent, stationSlots, "no hub (not docked and no slot reservation)")
            return false
        }
        val currentStation = stationsList.firstOrNull { it.id == hubId }
        if (currentStation == null) {
            logRebalanceSkip(agent, stationSlots, "unknown hub $hubId")
            return false
        }
        ephemeralWaitStationId(stationSlots)?.let { waitStationId ->
            logRebalanceSkip(agent, stationSlots, "holding ephemeral wait for promotion at $waitStationId")
            return false
        }
        val currentLoad = effectiveParkingLoad(currentStation, stationSlots)
        val target = selectRebalanceTarget(agent, stationsList, stationSlots)
        if (target == null) {
            logRebalanceSkip(
                agent,
                stationSlots,
                "no lighter hub (here=$hubId load=$currentLoad/${currentStation.parkingCapacity})",
            )
            return false
        }
        if (target.id == hubId) {
            val hubStation = stationsList.first { it.id == hubId }
            if (stations.physicallyDockedAtHub(vehicle.telemetry().position, hubStation, stationSlots)) {
                logRebalanceSkip(agent, stationSlots, "parked at lightest hub $hubId; holding for package or rebalance")
            } else {
                logRebalanceSkip(agent, stationSlots, "already at lightest hub $hubId")
            }
            return false
        }
        if (!shouldRebalanceFromCurrentStation(currentLoad, target, stationSlots)) {
            logRebalanceSkip(
                agent,
                stationSlots,
                "load not imbalanced enough (here=$hubId load=$currentLoad, " +
                    "target=${target.id} load=${effectiveParkingLoad(target, stationSlots)})",
            )
            return false
        }
        ParkingDiagnostics.log(
            agentId = config.agentId,
            decision = "load-rebalance",
            details = "leaving $hubId (load=$currentLoad/${currentStation.parkingCapacity}) → ${target.id} " +
                "(load=${effectiveParkingLoad(target, stationSlots)}/${target.parkingCapacity})",
            agent = agent,
            stationSlots = stationSlots,
        )
        val slot = when (val outcome = reserveRelocationParking(target, stationSlots)) {
            is RelocationParkingOutcome.Ready -> outcome.slot
            is RelocationParkingOutcome.EphemeralWait -> {
                if (hubId != target.id) {
                    vacateCurrentStationParking(agent, stationSlots, hubId, statusAfterVacate = AgentStatus.BUSY)
                }
                ParkingDiagnostics.log(
                    agentId = config.agentId,
                    decision = "ephemeral-rebalance-hold",
                    details = "reserved ephemeral at ${target.id}; vacated $hubId; waiting for promotion before driving",
                    agent = backend.getAgent(config.agentId),
                    stationSlots = backend.networkState().stationSlots,
                )
                return false
            }
            RelocationParkingOutcome.Unavailable -> {
                ParkingDiagnostics.log(
                    agentId = config.agentId,
                    decision = "load-rebalance-blocked",
                    details = "cannot reserve ${target.id}",
                    agent = agent,
                    stationSlots = stationSlots,
                )
                return false
            }
        }
        ParkingDiagnostics.log(
            agentId = config.agentId,
            decision = "load-rebalance-reserved",
            details = "${target.id} slot ${slot.index}",
            agent = agent,
            stationSlots = backend.networkState().stationSlots,
        )
        if (hubId != target.id) {
            vacateCurrentStationParking(agent, stationSlots, hubId, statusAfterVacate = AgentStatus.BUSY)
        }
        val routeAgent = runtime.routingAgent(agent, vehicle.telemetry())
        ParkingDiagnostics.log(
            agentId = config.agentId,
            decision = "rebalance-mission-start",
            details = "${target.id} slot ${slot.index}",
            agent = agent,
            stationSlots = null,
        )
        val moved = hub.driveToHubParkingSlot(
            agent = agent,
            targetStation = target,
            slot = slot,
            routeAgent = routeAgent,
            groundObstacles = groundObstacles,
            reason = "load rebalancing",
            fromStationId = hubId,
            stationSlots = stationSlots,
            applyStagingMemory = false,
            releaseReservationOnFailure = false,
        )
        if (moved) {
            runtime.lastRebalanceStationId = target.id
            ParkingDiagnostics.log(
                agentId = config.agentId,
                decision = "rebalance-parked",
                details = "load rebalancing parked at ${target.id}",
                agent = backend.getAgent(config.agentId),
                stationSlots = backend.networkState().stationSlots,
            )
        }
        return moved
    }

    /**
     * Agent is on a reserved pad but occupancy was never confirmed (e.g. land settled after abort).
     */
    suspend fun tryConfirmReservedParkingOccupancy(agent: TransportAgentDto): Boolean {
        val network = backend.networkState()
        val held = network.stationSlots.firstOrNull { slot ->
            slot.kind == StationSlotKind.PARKING &&
                slot.reservedByAgentId == config.agentId &&
                !slot.reservationEphemeral
        } ?: return false
        val station = network.stations.firstOrNull { it.id == held.stationId } ?: return false
        if (held.occupiedByAgentId == config.agentId) {
            if (agent.currentStationId != station.id) {
                runtime.backend.updateAgentState(
                    agentId = config.agentId,
                    position = vehicle.telemetry().position,
                    energyLevelPercent = runtime.simulatedEnergyPercent,
                    status = agent.status,
                    currentStationId = station.id,
                )
            }
            return false
        }
        val position = hub.waitForPhysicalDockAtSlot(station, held, timeoutMillis = 2_000)
            ?: vehicle.telemetry().position
        if (!stations.physicallyLandedAtParkingSlot(position, station, held)) {
            return false
        }
        val slotDto = StationSlots.parkingSlot(station, held.index).copy(
            reservedByAgentId = config.agentId,
            reservationEphemeral = false,
        )
        if (!hub.finalizeParkedAtHub(position, station, slotDto, stayBusy = agent.status == AgentStatus.BUSY)) {
            return false
        }
        ParkingDiagnostics.log(
            agentId = config.agentId,
            decision = "reserved-pad-confirmed",
            details = "occupancy confirmed at ${station.id} slot ${held.index}",
            agent = backend.getAgent(config.agentId),
            stationSlots = backend.networkState().stationSlots,
        )
        return true
    }

    /**
     * Physically on a vacant pad with no reservation (e.g. after a failed rebalance release).
     */
    suspend fun tryRecoverOrphanedParkingOnPad(agent: TransportAgentDto): Boolean {
        if (agent.status == AgentStatus.BUSY) {
            return false
        }
        val network = backend.networkState()
        val position = vehicle.telemetry().position
        val stationsList = network.stations.filter { it.status == StationStatus.ACTIVE }
        for (station in stationsList) {
            val parkingSlots = network.stationSlots.filter { slot ->
                slot.stationId == station.id && slot.kind == StationSlotKind.PARKING
            }
            for (slot in parkingSlots) {
                if (!stations.physicallyLandedAtParkingSlot(position, station, slot)) {
                    continue
                }
                if (slot.occupiedByAgentId == config.agentId) {
                    if (agent.currentStationId != station.id) {
                        runtime.backend.updateAgentState(
                            agentId = config.agentId,
                            position = position,
                            energyLevelPercent = runtime.simulatedEnergyPercent,
                            status = agent.status,
                            currentStationId = station.id,
                        )
                    }
                    continue
                }
                if (slot.occupiedByAgentId != null || slot.reservedByAgentId != null) {
                    continue
                }
                val reserved = runCatching {
                    backend.reserveParkingSlot(station.id, config.agentId, allowEphemeral = false)
                }.getOrNull() ?: continue
                if (reserved.index != slot.index) {
                    runCatching {
                        backend.releaseParkingSlot(station.id, reserved.index, config.agentId)
                    }
                    continue
                }
                val slotDto = StationSlots.parkingSlot(station, slot.index).copy(
                    reservedByAgentId = config.agentId,
                    reservationEphemeral = false,
                )
                if (hub.finalizeParkedAtHub(position, station, slotDto)) {
                    println(
                        "[${config.agentId}] Recovered orphaned parking at ${station.id} slot ${slot.index}.",
                    )
                    return true
                }
                runCatching {
                    backend.releaseParkingSlot(station.id, reserved.index, config.agentId)
                }
            }
        }
        return false
    }

    /** Finish approach and land when a real slot is already reserved but the agent is still in the air. */
    suspend fun tryLandAtReservedHub(
        agent: TransportAgentDto,
        stationsList: List<TransferStationDto>,
        stationSlots: List<StationSlotDto>,
        groundObstacles: List<GroundObstacle>,
    ): Boolean {
        if (tryConfirmReservedParkingOccupancy(agent)) {
            return true
        }
        val held = stationSlots.firstOrNull { slot ->
            slot.kind == StationSlotKind.PARKING &&
                slot.reservedByAgentId == config.agentId &&
                !slot.reservationEphemeral
        } ?: return false
        val station = stationsList.firstOrNull { it.id == held.stationId } ?: return false
        if (stations.physicallyLandedAtParkingSlot(vehicle.telemetry().position, station, held)) {
            return false
        }
        val slotDto = StationSlots.parkingSlot(station, held.index).copy(
            reservedByAgentId = config.agentId,
            reservationEphemeral = false,
        )
        println(
            "[${config.agentId}] Landing at reserved hub ${station.id} slot ${held.index} " +
                "(holding until package or rebalance).",
        )
        val moved = hub.driveToHubParkingSlot(
            agent = agent,
            targetStation = station,
            slot = slotDto,
            routeAgent = runtime.routingAgent(agent, vehicle.telemetry()),
            groundObstacles = groundObstacles,
            reason = "reserved hub landing",
            fromStationId = agent.currentStationId,
            stationSlots = stationSlots,
            applyStagingMemory = false,
            releaseReservationOnFailure = false,
        )
        if (moved) {
            ParkingDiagnostics.log(
                agentId = config.agentId,
                decision = "rebalance-parked",
                details = "landed at reserved ${station.id} slot ${held.index}",
                agent = backend.getAgent(config.agentId),
                stationSlots = stationSlots,
            )
        }
        return moved
    }

    fun logRebalanceSkip(
        agent: TransportAgentDto,
        stationSlots: List<StationSlotDto>,
        reason: String,
    ) {
        ParkingDiagnostics.log(
            agentId = config.agentId,
            decision = "load-rebalance-skip",
            details = reason,
            agent = agent,
            stationSlots = stationSlots,
        )
    }

    fun selectRebalanceTarget(
        agent: TransportAgentDto,
        stationsList: List<TransferStationDto>,
        stationSlots: List<StationSlotDto>,
    ): TransferStationDto? {
        if (stationsList.isEmpty()) return null
        val currentStation = agent.currentStationId
            ?.let { stationId -> stationsList.firstOrNull { it.id == stationId } }
            ?: stationsList.minByOrNull { Geo.distanceMeters(agent.position, it.position) }
                ?.takeIf { Geo.distanceMeters(agent.position, it.position) <= AgentControllerConstants.STATION_CONTACT_RADIUS_METERS }
        val currentLoad = currentStation?.let { effectiveParkingLoad(it, stationSlots) }

        val candidates = stationsList
            .filter { it.id != currentStation?.id }
            .filter { station -> hasParkingAvailableForAgent(station, stationSlots) }
            .filter { station -> shouldRebalanceFromCurrentStation(currentLoad, station, stationSlots) }
            .filter { it.id != runtime.lastRebalanceStationId }
            .ifEmpty {
                stationsList
                    .filter { it.id != currentStation?.id }
                    .filter { station -> hasParkingAvailableForAgent(station, stationSlots) }
                    .filter { station -> shouldRebalanceFromCurrentStation(currentLoad, station, stationSlots) }
            }

        return candidates.minWithOrNull(
            compareBy<TransferStationDto> { station ->
                effectiveParkingLoad(station, stationSlots).toDouble() / station.parkingCapacity.coerceAtLeast(1)
            }.thenBy { station ->
                Geo.distanceMeters(agent.position, station.position)
            },
        )
    }

    /** True when this hub has at least [REBALANCE_MIN_LOAD_IMPROVEMENT] more holders than the target. */
    fun shouldRebalanceFromCurrentStation(
        currentLoad: Int?,
        targetStation: TransferStationDto,
        stationSlots: List<StationSlotDto>,
    ): Boolean {
        if (currentLoad == null) return true
        val targetLoad = effectiveParkingLoad(targetStation, stationSlots)
        return currentLoad - targetLoad >= AgentControllerConstants.REBALANCE_MIN_LOAD_IMPROVEMENT
    }

    internal fun hasParkingAvailableForAgent(
        station: TransferStationDto,
        stationSlots: List<StationSlotDto>,
    ): Boolean {
        if (effectiveParkingLoad(station, stationSlots) < maxParkingHolders(station)) {
            return true
        }
        return stationSlots.any { slot ->
            slot.stationId == station.id &&
                slot.kind == StationSlotKind.PARKING &&
                (slot.occupiedByAgentId == config.agentId || slot.reservedByAgentId == config.agentId)
        }
    }

    /** Distinct agents docked, holding a reservation, or waiting on ephemeral overbook at this hub. */
    fun effectiveParkingLoad(station: TransferStationDto, stationSlots: List<StationSlotDto>): Int =
        stationSlots
            .filter { slot -> slot.stationId == station.id && slot.kind == StationSlotKind.PARKING }
            .flatMap { slot ->
                buildList {
                    slot.occupiedByAgentId?.let { add(it) }
                    slot.reservedByAgentId?.let { add(it) }
                    slot.ephemeralWaiterAgentId?.let { add(it) }
                }
            }
            .toSet()
            .size

    fun parkingOverbookMargin(): Int =
        (System.getenv("STATION_PARKING_OVERBOOK_MARGIN") ?: "1").toIntOrNull()?.coerceAtLeast(0) ?: 1
}
