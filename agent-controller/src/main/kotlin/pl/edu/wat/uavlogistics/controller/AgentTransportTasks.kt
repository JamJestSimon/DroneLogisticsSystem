package pl.edu.wat.uavlogistics.controller
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import pl.edu.wat.uavlogistics.common.AgentStatus
import pl.edu.wat.uavlogistics.common.AgentType
import pl.edu.wat.uavlogistics.common.Geo
import pl.edu.wat.uavlogistics.common.GeoPoint
import pl.edu.wat.uavlogistics.common.NetworkStateDto
import pl.edu.wat.uavlogistics.common.StationSlotDto
import pl.edu.wat.uavlogistics.common.StationSlotKind
import pl.edu.wat.uavlogistics.common.StationStatus
import pl.edu.wat.uavlogistics.common.TransferStationDto
import pl.edu.wat.uavlogistics.common.TransportAgentDto
import pl.edu.wat.uavlogistics.common.TransportTaskDto
import pl.edu.wat.uavlogistics.common.inProgressTaskFor
import pl.edu.wat.uavlogistics.common.matchesAgentType
import pl.edu.wat.uavlogistics.common.requiredAgentType
import pl.edu.wat.uavlogistics.common.shipmentFor
import pl.edu.wat.uavlogistics.common.shipmentsById
import kotlin.math.min
internal data class ParkingPlan(
    val deliveryStationId: String?,
    val parkingSlot: StationSlotDto,
)
internal class AgentTransportTasks(
    private val runtime: AgentRuntime,
    private val stations: AgentStationGeometry,
    private val hub: AgentHubParking,
    private val parking: AgentParkingCoordinator,
    private val cargoVisual: CargoVisualClient,
    private val planner: RoutePlanner,
) {
    private val config get() = runtime.config
    /**
     * Best actionable task this agent may claim: in range, return parking affordable, and closest eligible
     * agent to the package pickup point among idle competitors.
     */
    suspend fun selectBestTaskCandidate(
        planningAgent: TransportAgentDto,
        tasks: List<TransportTaskDto>,
        activeStations: List<TransferStationDto>,
        network: NetworkStateDto,
        groundObstacles: List<GroundObstacle>,
    ): TaskCandidate? {
        var best: TaskCandidate? = null
        for (task in actionableTasks(planningAgent, tasks, network.shipmentsById())) {
            if (!isClosestEligibleAgent(planningAgent, task, network, stations)) {
                continue
            }
            val candidate = planner.feasibleCandidate(
                planningAgent,
                task,
                activeStations,
                groundObstacles,
                network.shipmentFor(task),
            )
                ?: continue
            if (previewAffordableParkingPlanFor(planningAgent, task) == null) {
                println(
                    "[${config.agentId}] Task ${task.id} in range but no affordable return parking " +
                        "(energy=${runtime.simulatedEnergyPercent.formatForLog()}%).",
                )
                continue
            }
            if (best == null || candidate.score < best.score) {
                best = candidate
            }
        }
        return best
    }
    /**
     * Package mission: BUSY → vacate pad (keep return reservation) → launch → pickup → delivery → return → AVAILABLE.
     */
    suspend fun executeTransportTask(task: TransportTaskDto, parkingPlan: ParkingPlan) {
        val onBusy: suspend (Telemetry) -> Unit = { telemetry ->
            runtime.updateBusyState(telemetry)
        }
        runtime.updateBusyState(runtime.vehicle.telemetry())
        val network = runtime.backend.networkState()
        parking.vacateForMissionDeparture(
            agent = runtime.backend.getAgent(config.agentId),
            stationSlots = network.stationSlots,
            returnSlot = parkingPlan.parkingSlot,
            taskId = task.id,
        )
        runtime.vehicle.launch(onBusy)
        if (!executePickupPhase(task, onBusy)) {
            abortMission(task.id, parkingPlan.parkingSlot, "pickup failed")
            return
        }
        if (!executeDeliveryPhase(task, parkingPlan, onBusy)) {
            abortMission(task.id, parkingPlan.parkingSlot, "delivery failed")
            return
        }
        executeReturnAndDock(task, parkingPlan, onBusy)
    }
    private suspend fun executePickupPhase(
        task: TransportTaskDto,
        onBusy: suspend (Telemetry) -> Unit,
    ): Boolean {
        val pickupPoint = stations.packagePickupPoint(task)
        val pickupApproach = stations.travelPoint(pickupPoint)
        val pickupContact = stations.contactPoint(pickupPoint)
        val agent = runtime.backend.getAgent(config.agentId)
        val network = runtime.backend.networkState()
        val pickupRoute = runtime.planRouteToPoint(agent, pickupApproach, network)
        val takeoffFrom = runtime.vehicle.telemetry().position
        when (config.agentType) {
            AgentType.UAV -> {
                val items = MissionBuilders.forUavPackagePickupMission(
                    cruiseHold = pickupApproach,
                    contact = pickupContact,
                    cruiseAltitudeMeters = AgentControllerConstants.UAV_CRUISE_ALTITUDE_METERS,
                    takeoffFrom = takeoffFrom,
                )
                runMissionLeg(
                    label = "pickup",
                    items = items,
                    onBusy = onBusy,
                    energyRoute = pickupRoute,
                ) {
                    runtime.vehicle.executeRoute(pickupRoute, onBusy)
                    runtime.vehicle.moveTo(pickupContact, onBusy)
                }
            }
            AgentType.UGV -> {
                runUgvPackageMission(
                    kind = UgvPackageMissionKind.PICKUP,
                    label = "pickup",
                    target = pickupContact,
                    energyRoute = pickupRoute,
                    onBusy = onBusy,
                )
                awaitPackageWorkDwell("pickup")
            }
        }
        runtime.updateBusyState(runtime.vehicle.telemetry().copy(position = pickupContact))
        val pickedUp = runCatching { runtime.backend.pickUpTask(task.id, config.agentId) }.isSuccess
        if (!pickedUp) {
            println("[${config.agentId}] pickUpTask failed for ${task.id}.")
            return false
        }
        val cargoVisualPosition = pickupPoint.copy(altitudeMeters = pickupApproach.altitudeMeters)
        val cargoAcquired = withContext(Dispatchers.IO) {
            cargoVisual.acquire(task.shipmentId, cargoVisualPosition)
        }
        if (!cargoAcquired) {
            println("[${config.agentId}] Cargo visual pickup failed for ${task.shipmentId}; continuing with registry only.")
        }
        return true
    }
    private suspend fun executeDeliveryPhase(
        task: TransportTaskDto,
        parkingPlan: ParkingPlan,
        onBusy: suspend (Telemetry) -> Unit,
    ): Boolean {
        val deliveryStationId = parkingPlan.deliveryStationId
        val packageDropPoint = deliveryStationId
            ?.let { stations.packageStorageDropPoint(it) }
            ?: task.endPoint
        val deliveryApproach = deliveryStationId
            ?.let { stations.storageDrivePoint(it) }
            ?: stations.travelPoint(packageDropPoint)
        val deliveryAgent = runtime.backend.getAgent(config.agentId)
        val network = runtime.backend.networkState()
        val deliveryRoute = runtime.planRouteToPoint(deliveryAgent, deliveryApproach, network)
        val dropContact = stations.contactPoint(packageDropPoint)
        val takeoffFrom = runtime.vehicle.telemetry().position
        when (config.agentType) {
            AgentType.UAV -> {
                val items = MissionBuilders.forUavPackageDeliveryMission(
                    cruiseHold = deliveryApproach,
                    contact = dropContact,
                    cruiseAltitudeMeters = AgentControllerConstants.UAV_CRUISE_ALTITUDE_METERS,
                    takeoffFrom = takeoffFrom,
                )
                runMissionLeg(
                    label = "delivery",
                    items = items,
                    onBusy = { telemetry ->
                        onBusy(telemetry)
                        cargoVisual.followCarrier(task.shipmentId, telemetry.position)
                    },
                    energyRoute = deliveryRoute,
                ) {
                    runtime.vehicle.executeRoute(deliveryRoute) { telemetry ->
                        onBusy(telemetry)
                        cargoVisual.followCarrier(task.shipmentId, telemetry.position)
                    }
                    runtime.vehicle.moveTo(dropContact, onBusy)
                }
            }
            AgentType.UGV -> {
                runUgvPackageMission(
                    kind = UgvPackageMissionKind.DELIVERY,
                    label = "delivery",
                    target = dropContact,
                    energyRoute = deliveryRoute,
                    onBusy = { telemetry ->
                        onBusy(telemetry)
                        cargoVisual.followCarrier(task.shipmentId, telemetry.position)
                    },
                )
                awaitPackageWorkDwell("delivery")
            }
        }
        runtime.updateBusyState(runtime.vehicle.telemetry().copy(position = dropContact))
        withContext(Dispatchers.IO) {
            cargoVisual.release(task.shipmentId, dropContact)
        }
        val delivered = runCatching {
            runtime.backend.completeTask(
                taskId = task.id,
                agentId = config.agentId,
                finalDelivery = parkingPlan.deliveryStationId == null,
                deliveredToStationId = parkingPlan.deliveryStationId,
                keepAgentBusy = true,
            )
        }.isSuccess
        if (!delivered) {
            println("[${config.agentId}] completeTask failed for ${task.id} at delivery contact.")
            return false
        }
        runtime.updateBusyState(runtime.vehicle.telemetry().copy(position = dropContact))
        return true
    }
    /**
     * Resume return/dock/complete for a package task left IN_PROGRESS (e.g. after parking mismatch).
     */
    suspend fun tryResumePackageReturn(task: TransportTaskDto): Boolean {
        if (task.kind != pl.edu.wat.uavlogistics.common.TransportTaskKind.PACKAGE) {
            return false
        }
        if (task.status != pl.edu.wat.uavlogistics.common.TransportTaskStatus.IN_PROGRESS &&
            task.status != pl.edu.wat.uavlogistics.common.TransportTaskStatus.COMPLETED
        ) {
            return false
        }
        val network = runtime.backend.networkState()
        val activeStations = network.stations.filter { it.status == StationStatus.ACTIVE }
        val pickupPoint = stations.packagePickupPoint(task)
        val deliveryStationId = deliveryStationOptions(task, pickupPoint, network.stationSlots)
            .firstOrNull { option -> option != null }
        val dropPoint = deliveryStationId
            ?.let { stations.packageStorageDropPoint(it) }
            ?: task.endPoint
        val parkingSlot = resolveReturnParkingForTask(
            deliveryStationId = deliveryStationId,
            dropPoint = dropPoint,
            stations = activeStations,
            stationSlots = network.stationSlots,
        ) ?: return false
        val onBusy: suspend (Telemetry) -> Unit = { telemetry ->
            runtime.updateBusyState(telemetry)
        }
        executeReturnAndDock(task, ParkingPlan(deliveryStationId, parkingSlot), onBusy)
        val agent = runtime.backend.getAgent(config.agentId)
        return agent.status == AgentStatus.AVAILABLE
    }
    private suspend fun executeReturnAndDock(
        task: TransportTaskDto,
        parkingPlan: ParkingPlan,
        onBusy: suspend (Telemetry) -> Unit,
    ) {
        val network = runtime.backend.networkState()
        val activeStations = network.stations.filter { it.status == StationStatus.ACTIVE }
        val stationSlots = network.stationSlots
        val parkingSlot = ensureReturnParkingAtDeliveryStation(
            parkingPlan = parkingPlan,
            activeStations = activeStations,
            stationSlots = stationSlots,
        ) ?: run {
            println("[${config.agentId}] Could not reserve return parking for package task ${task.id}.")
            return
        }
        val promotedSlot = parking.awaitPromotedReturnParking(parkingSlot) ?: run {
            println(
                "[${config.agentId}] Return parking at ${parkingSlot.stationId} not promoted; " +
                    "staying BUSY on package task ${task.id}.",
            )
            return
        }
        val station = activeStations.firstOrNull { it.id == promotedSlot.stationId }
        if (station == null) {
            println("[${config.agentId}] Return station ${parkingSlot.stationId} missing; staying BUSY.")
            return
        }
        val fromPosition = runtime.vehicle.telemetry().position
        val resolvedSlot = if (returnLegFeasible(fromPosition, station, promotedSlot)) {
            promotedSlot
        } else {
            runtime.backend.releaseParkingSlot(promotedSlot.stationId, promotedSlot.index, config.agentId)
            selectReachableReturnParking(
                fromPosition,
                activeStations,
                stationSlots,
                preferStationId = parkingPlan.deliveryStationId,
            ) ?: promotedSlot
        }
        val returnAgent = runtime.backend.getAgent(config.agentId).copy(position = fromPosition)
        val dockSlot = network.stationSlots.firstOrNull { slot ->
            slot.stationId == resolvedSlot.stationId &&
                slot.kind == StationSlotKind.PARKING &&
                slot.index == resolvedSlot.index
        } ?: resolvedSlot
        println(
            "[${config.agentId}] Returning to reserved parking ${dockSlot.stationId} slot ${dockSlot.index}.",
        )
        val returnRoute = runtime.planRouteToPoint(
            returnAgent,
            stations.slotDrivePoint(station, dockSlot),
            runtime.groundObstacles(network),
        )
        var parkedPosition = when (config.agentType) {
            AgentType.UAV -> hub.flyAndDockAtHubParkingSlot(
                station = station,
                slot = dockSlot,
                routeAgent = returnAgent,
                groundObstacles = runtime.groundObstacles(network),
                onTelemetry = onBusy,
            )
            AgentType.UGV -> {
                val padContact = stations.slotParkedPosition(station, dockSlot)
                runUgvPackageMission(
                    kind = UgvPackageMissionKind.RETURN,
                    label = "return",
                    target = padContact,
                    energyRoute = returnRoute,
                    onBusy = onBusy,
                )
                val position = runtime.vehicle.telemetry().position
                if (stations.physicallyLandedAtParkingSlot(position, station, dockSlot)) {
                    runtime.vehicle.resetHomeAtCurrentPosition()
                    position
                } else {
                    null
                }
            }
        }
        runtime.consumeEnergy(returnRoute)
        if (parkedPosition == null) {
            parkedPosition = hub.waitForPhysicalDockAtSlot(station, dockSlot)
            if (parkedPosition != null) {
                runtime.vehicle.resetHomeAtCurrentPosition()
            }
        }
        if (parkedPosition == null) {
            println(
                "[${config.agentId}] Could not land at ${resolvedSlot.stationId} slot ${resolvedSlot.index}.",
            )
            return
        }
        if (!stations.physicallyLandedAtParkingSlot(parkedPosition, station, dockSlot)) {
            println(
                "[${config.agentId}] Mission return landed near ${station.id} slot ${dockSlot.index} " +
                    "but not on parking pad.",
            )
            return
        }
        if (!hub.finalizeParkedAtHub(parkedPosition, station, dockSlot, stayBusy = true)) {
            println("[${config.agentId}] Could not confirm parking at ${station.id} after mission.")
            return
        }
        runtime.backend.updateAgentState(
            agentId = config.agentId,
            position = parkedPosition,
            energyLevelPercent = runtime.simulatedEnergyPercent,
            status = AgentStatus.AVAILABLE,
            currentStationId = station.id,
        )
        if (runtime.simulatedEnergyPercent < AgentControllerConstants.FULL_ENERGY_PERCENT) {
            runtime.chargeAtStation(parkedPosition, station.id, stations)
        }
    }
    private suspend fun runMissionLeg(
        label: String,
        items: List<MissionItem>,
        onBusy: suspend (Telemetry) -> Unit,
        energyRoute: PlannedRoute?,
        fallback: suspend () -> Unit,
    ): Boolean {
        println("[${config.agentId}] AUTO mission '$label' (${items.size} items).")
        if (runtime.vehicle.executeMissionItems(items, onBusy)) {
            energyRoute?.let { runtime.consumeEnergy(it) }
            return true
        }
        println("[${config.agentId}] Mission '$label' failed; offboard fallback.")
        fallback()
        energyRoute?.let { runtime.consumeEnergy(it) }
        return true
    }
    private enum class UgvPackageMissionKind { PICKUP, DELIVERY, RETURN }
    private suspend fun awaitPackageWorkDwell(phase: String) {
        val dwellMs = AgentControllerConstants.PACKAGE_WORK_DWELL_MILLIS
        if (dwellMs <= 0L) {
            return
        }
        println("[${config.agentId}] Package $phase: dwelling ${dwellMs}ms for load/unload.")
        delay(dwellMs)
    }
    private suspend fun runUgvPackageMission(
        kind: UgvPackageMissionKind,
        label: String,
        target: GeoPoint,
        energyRoute: PlannedRoute?,
        onBusy: suspend (Telemetry) -> Unit,
    ): Boolean {
        val agent = runtime.backend.getAgent(config.agentId)
        val route = energyRoute ?: runtime.planRouteToPoint(
            agent,
            target,
            runtime.groundObstacles(runtime.backend.networkState()),
        )
        val waypoints = route.waypoints.ifEmpty { listOf(target) }
        val items = when (kind) {
            UgvPackageMissionKind.PICKUP -> MissionBuilders.forUgvPackagePickupMission(waypoints, target)
            UgvPackageMissionKind.DELIVERY -> MissionBuilders.forUgvPackageDeliveryMission(waypoints, target)
            UgvPackageMissionKind.RETURN -> MissionBuilders.forUgvPackageReturnMission(waypoints, target)
        }
        return runMissionLeg(label, items, onBusy, route) {
            runtime.vehicle.executeRoute(route, onBusy)
            if (kind == UgvPackageMissionKind.RETURN) {
                runtime.vehicle.moveTo(target, onBusy)
                runtime.vehicle.resetHomeAtCurrentPosition()
            }
        }
    }
    private suspend fun abortMission(taskId: String, returnSlot: StationSlotDto, reason: String) {
        println("[${config.agentId}] Mission $taskId aborted: $reason.")
        runCatching {
            runtime.backend.releaseParkingSlot(returnSlot.stationId, returnSlot.index, config.agentId)
        }
        runtime.backend.updateAgentState(
            agentId = config.agentId,
            position = runtime.vehicle.telemetry().position,
            energyLevelPercent = runtime.simulatedEnergyPercent,
            status = AgentStatus.AVAILABLE,
            currentStationId = null,
        )
    }
    suspend fun canAffordPackageTask(task: TransportTaskDto): Boolean {
        val agent = runtime.backend.getAgent(config.agentId)
        val planningAgent = runtime.planningAgent(agent, runtime.vehicle.telemetry())
        return canAffordPackageTaskFor(planningAgent, task)
    }
    suspend fun canAffordPackageTaskFor(planningAgent: TransportAgentDto, task: TransportTaskDto): Boolean =
        previewAffordableParkingPlanFor(planningAgent, task) != null
    suspend fun reserveParkingForTask(task: TransportTaskDto): ParkingPlan? {
        val pickupPoint = stations.packagePickupPoint(task)
        val network = runtime.backend.networkState()
        val activeStations = network.stations.filter { it.status == StationStatus.ACTIVE }
        val routingAgent = runtime.routingAgent(
            runtime.backend.getAgent(config.agentId),
            runtime.vehicle.telemetry(),
        )
        for (option in rankedDeliveryParkingOptions(
            task,
            pickupPoint,
            activeStations,
            network.stationSlots,
            routingAgent,
        )) {
            val parkingSlot = resolveReturnParkingForTask(
                deliveryStationId = option.deliveryStationId,
                dropPoint = option.dropPoint,
                stations = activeStations,
                stationSlots = network.stationSlots,
            ) ?: continue
            if (option.plannedEnergyPercent + AgentControllerConstants.TASK_ROUTE_RESERVE_PERCENT <=
                runtime.simulatedEnergyPercent
            ) {
                val ephemeral = parkingSlot.reservationEphemeral
                println(
                    "[${config.agentId}] Reserved return parking ${parkingSlot.stationId} " +
                        "slot ${parkingSlot.index} before mission" +
                        if (ephemeral) " (ephemeral overbook)." else ".",
                )
                return ParkingPlan(
                    deliveryStationId = option.deliveryStationId,
                    parkingSlot = parkingSlot,
                )
            }
            runtime.backend.releaseParkingSlot(parkingSlot.stationId, parkingSlot.index, config.agentId)
        }
        return null
    }
    fun actionableTasks(
        agent: TransportAgentDto,
        tasks: List<TransportTaskDto>,
        shipmentsById: Map<String, pl.edu.wat.uavlogistics.common.ShipmentDto>,
    ): List<TransportTaskDto> =
        tasks.filter { task -> task.matchesAgentType(agent.type, shipmentsById) }
    /**
     * Skip when another eligible idle agent is strictly closer to the package pickup point.
     * UGVs yield to UAVs at the same distance or when the UAV is closer (open package tasks only).
     * Otherwise tie-break: lower agent id wins.
     */
    suspend fun isClosestEligibleAgent(
        agent: TransportAgentDto,
        task: TransportTaskDto,
        network: NetworkStateDto,
        stations: AgentStationGeometry,
    ): Boolean = isClosestEligibleForPickup(
        agent = agent,
        pickupPoint = stations.packagePickupPoint(task),
        requiredAgentType = task.requiredAgentType(network.shipmentsById()),
        peers = network.agents,
        tasks = network.tasks,
    )
    suspend fun deliveryStationOptions(
        task: TransportTaskDto,
        pickupPoint: GeoPoint,
        stationSlots: List<StationSlotDto>,
    ): List<String?> {
        if (task.endStationId != null) return listOf(task.endStationId)
        val activeStations = runtime.backend.networkState().stations
            .filter { station ->
                station.status == StationStatus.ACTIVE &&
                    station.occupiedStorage < station.storageCapacity &&
                    station.id != task.startStationId
            }
        val directDistance = Geo.distanceMeters(pickupPoint, task.endPoint)
        val handoffStationIds = activeStations
            .filter { station -> Geo.distanceMeters(station.position, task.endPoint) < directDistance }
            .sortedWith(
                compareByDescending<TransferStationDto> { station ->
                    if (parking.hasParkingAvailableForAgent(station, stationSlots)) 1 else 0
                }.thenByDescending { station -> Geo.routeProgress(pickupPoint, task.endPoint, station.position) },
            )
            .map { it.id }
        return if (config.agentType == AgentType.UAV) {
            listOf(null) + handoffStationIds
        } else {
            handoffStationIds + listOf(null)
        }
    }
    private suspend fun previewAffordableParkingPlanFor(
        planningAgent: TransportAgentDto,
        task: TransportTaskDto,
    ): ParkingPlan? {
        val pickupPoint = stations.packagePickupPoint(task)
        val network = runtime.backend.networkState()
        val activeStations = network.stations.filter { it.status == StationStatus.ACTIVE }
        val affordable = rankedDeliveryParkingOptions(
            task,
            pickupPoint,
            activeStations,
            network.stationSlots,
            routingAgent = runtime.routingAgent(planningAgent, runtime.vehicle.telemetry()),
        ).firstOrNull { option ->
            option.plannedEnergyPercent + AgentControllerConstants.TASK_ROUTE_RESERVE_PERCENT <=
                planningAgent.energyLevelPercent
        } ?: return null
        val parkingSlot = peekReturnParkingSlot(
            deliveryStationId = affordable.deliveryStationId,
            dropPoint = affordable.dropPoint,
            stations = activeStations,
            stationSlots = network.stationSlots,
        ) ?: return null
        return ParkingPlan(deliveryStationId = affordable.deliveryStationId, parkingSlot = parkingSlot)
    }
    private data class DeliveryParkingOption(
        val deliveryStationId: String?,
        val dropPoint: GeoPoint,
        val plannedEnergyPercent: Double,
    )
    private suspend fun rankedDeliveryParkingOptions(
        task: TransportTaskDto,
        pickupPoint: GeoPoint,
        activeStations: List<TransferStationDto>,
        stationSlots: List<StationSlotDto>,
        routingAgent: TransportAgentDto,
    ): List<DeliveryParkingOption> =
        deliveryStationOptions(task, pickupPoint, stationSlots)
            .mapNotNull { deliveryStationId ->
                val dropPoint = deliveryStationId
                    ?.let { stations.packageStorageDropPoint(it) }
                    ?: task.endPoint
                val parkingSlot = peekReturnParkingSlot(
                    deliveryStationId = deliveryStationId,
                    dropPoint = dropPoint,
                    stations = activeStations,
                    stationSlots = stationSlots,
                ) ?: return@mapNotNull null
                DeliveryParkingOption(
                    deliveryStationId = deliveryStationId,
                    dropPoint = dropPoint,
                    plannedEnergyPercent = plannedTaskEnergy(
                        routingAgent,
                        task,
                        pickupPoint,
                        deliveryStationId,
                        parkingSlot,
                    ),
                )
            }
            .sortedBy { option -> option.plannedEnergyPercent }
    private suspend fun peekReturnParkingSlot(
        deliveryStationId: String?,
        dropPoint: GeoPoint,
        stations: List<TransferStationDto>,
        stationSlots: List<StationSlotDto>,
    ): StationSlotDto? {
        preferReturnParkingForHandoff(deliveryStationId, dropPoint, stations, stationSlots)?.let { return it }
        if (deliveryStationId != null) {
            val station = stations.firstOrNull { it.id == deliveryStationId } ?: return null
            if (!parking.hasParkingAvailableForAgent(station, stationSlots)) {
                return null
            }
            val slot = peekParkingSlotForPlanning(deliveryStationId, stationSlots, stations) ?: return null
            return if (returnLegFeasible(dropPoint, station, slot)) slot else null
        }
        return stations
            .filter { station -> parking.hasParkingAvailableForAgent(station, stationSlots) }
            .sortedBy { station -> Geo.distanceMeters(dropPoint, station.position) }
            .mapNotNull { station ->
                val slot = peekParkingSlotForPlanning(station.id, stationSlots, stations) ?: return@mapNotNull null
                if (returnLegFeasible(dropPoint, station, slot)) slot else null
            }
            .firstOrNull()
    }

    private fun peekParkingSlotForPlanning(
        stationId: String,
        stationSlots: List<StationSlotDto>,
        stations: List<TransferStationDto>,
    ): StationSlotDto? {
        firstUsableParkingSlot(stationId, stationSlots)?.let { return it }
        val station = stations.firstOrNull { it.id == stationId } ?: return null
        if (!parking.hasParkingAvailableForAgent(station, stationSlots)) {
            return null
        }
        return stationSlots.firstOrNull { slot ->
            slot.stationId == stationId && slot.kind == StationSlotKind.PARKING
        }
    }

    private suspend fun resolveReturnParkingForTask(
        deliveryStationId: String?,
        dropPoint: GeoPoint,
        stations: List<TransferStationDto>,
        stationSlots: List<StationSlotDto>,
    ): StationSlotDto? {
        preferReturnParkingForHandoff(deliveryStationId, dropPoint, stations, stationSlots)?.let { slot ->
            return reserveReturnParkingSlot(slot, dropPoint, stations, stationSlots)
        }
        if (deliveryStationId != null) {
            val station = stations.firstOrNull { it.id == deliveryStationId } ?: return null
            return reserveReturnParkingAtStation(station, dropPoint, stationSlots)
        }
        return selectReachableReturnParking(dropPoint, stations, stationSlots, preferStationId = null)
    }

    private suspend fun reserveReturnParkingSlot(
        hint: StationSlotDto,
        dropPoint: GeoPoint,
        stations: List<TransferStationDto>,
        stationSlots: List<StationSlotDto>,
    ): StationSlotDto? {
        val station = stations.firstOrNull { it.id == hint.stationId } ?: return null
        when (val outcome = parking.reserveReturnParking(station, stationSlots)) {
            RelocationParkingOutcome.Unavailable -> return null
            is RelocationParkingOutcome.Ready -> {
                if (!returnLegFeasible(dropPoint, station, outcome.slot)) {
                    runtime.backend.releaseParkingSlot(outcome.slot.stationId, outcome.slot.index, config.agentId)
                    return null
                }
                return outcome.slot
            }
            is RelocationParkingOutcome.EphemeralWait -> {
                if (!returnLegFeasible(dropPoint, station, outcome.slot)) {
                    runtime.backend.releaseParkingSlot(outcome.slot.stationId, outcome.slot.index, config.agentId)
                    return null
                }
                return outcome.slot
            }
        }
    }

    private suspend fun reserveReturnParkingAtStation(
        station: TransferStationDto,
        dropPoint: GeoPoint,
        stationSlots: List<StationSlotDto>,
    ): StationSlotDto? {
        val hint = stationSlots.firstOrNull { it.stationId == station.id && it.kind == StationSlotKind.PARKING }
            ?: return null
        return reserveReturnParkingSlot(
            hint = hint,
            dropPoint = dropPoint,
            stations = listOf(station),
            stationSlots = stationSlots,
        )
    }
    /**
     * Reuse an existing hub reservation only when it matches the handoff destination (or for final delivery).
     */
    private suspend fun preferReturnParkingForHandoff(
        deliveryStationId: String?,
        dropPoint: GeoPoint,
        stations: List<TransferStationDto>,
        stationSlots: List<StationSlotDto>,
    ): StationSlotDto? {
        val agent = runtime.backend.getAgent(config.agentId)
        val existing = parking.preferReturnParkingAtHub(agent, stationSlots) ?: return null
        if (deliveryStationId != null && existing.stationId != deliveryStationId) {
            return null
        }
        val station = stations.firstOrNull { it.id == existing.stationId } ?: return null
        if (!returnLegFeasible(dropPoint, station, existing)) {
            return null
        }
        return existing
    }
    private suspend fun ensureReturnParkingAtDeliveryStation(
        parkingPlan: ParkingPlan,
        activeStations: List<TransferStationDto>,
        stationSlots: List<StationSlotDto>,
    ): StationSlotDto? {
        val deliveryStationId = parkingPlan.deliveryStationId
        if (deliveryStationId == null ||
            parkingPlan.parkingSlot.stationId == deliveryStationId
        ) {
            return parkingPlan.parkingSlot
        }
        println(
            "[${config.agentId}] Return parking was ${parkingPlan.parkingSlot.stationId} " +
                "but handoff targets $deliveryStationId; re-reserving at destination hub.",
        )
        runCatching {
            runtime.backend.releaseParkingSlot(
                parkingPlan.parkingSlot.stationId,
                parkingPlan.parkingSlot.index,
                config.agentId,
            )
        }
        val dropPoint = stations.packageStorageDropPoint(deliveryStationId)
        return resolveReturnParkingForTask(
            deliveryStationId = deliveryStationId,
            dropPoint = dropPoint,
            stations = activeStations,
            stationSlots = stationSlots,
        )
    }
    private fun firstUsableParkingSlot(stationId: String, stationSlots: List<StationSlotDto>): StationSlotDto? {
        val own = parking.agentParkingSlotAtHub(stationId, stationSlots)
        if (own != null &&
            (own.occupiedByAgentId == null || own.occupiedByAgentId == config.agentId) &&
            (own.reservedByAgentId == null || own.reservedByAgentId == config.agentId)
        ) {
            return own
        }
        return stationSlots.firstOrNull { slot ->
            slot.stationId == stationId &&
                slot.kind == StationSlotKind.PARKING &&
                (slot.occupiedByAgentId == null || slot.occupiedByAgentId == config.agentId) &&
                (slot.reservedByAgentId == null || slot.reservedByAgentId == config.agentId)
        }
    }
    suspend fun plannedTaskEnergy(
        routingAgent: TransportAgentDto,
        task: TransportTaskDto,
        pickupPoint: GeoPoint,
        deliveryStationId: String?,
        parkingSlot: StationSlotDto,
    ): Double {
        val network = runtime.backend.networkState()
        val agent = runtime.routingAgent(routingAgent, runtime.vehicle.telemetry())
        val pickupRoute = runtime.planRouteToPoint(agent, stations.travelPoint(pickupPoint), network)
        val deliveryStartAgent = agent.copy(position = stations.contactPoint(pickupPoint))
        val packageDropPoint = deliveryStationId
            ?.let { stations.packageStorageDropPoint(it) }
            ?: task.endPoint
        val deliveryApproach = deliveryStationId
            ?.let { stations.storageDrivePoint(it) }
            ?: stations.travelPoint(packageDropPoint)
        val deliveryRoute = runtime.planRouteToPoint(deliveryStartAgent, deliveryApproach, network)
        val returnStartAgent = agent.copy(position = stations.travelPoint(packageDropPoint))
        val station = network.stations.first { it.id == parkingSlot.stationId }
        val parkingApproach = stations.slotDrivePoint(station, parkingSlot)
        val returnRoute = runtime.planRouteToPoint(returnStartAgent, parkingApproach, network)
        val sameStationHandoff = deliveryStationId != null && parkingSlot.stationId == deliveryStationId
        val returnEnergyPercent = if (
            sameStationHandoff &&
            returnRoute.distanceMeters <= AgentControllerConstants.SAME_STATION_RETURN_MAX_METERS
        ) {
            min(returnRoute.estimatedEnergyPercent, AgentControllerConstants.SAME_STATION_RETURN_MAX_ENERGY_PERCENT)
        } else {
            returnRoute.estimatedEnergyPercent
        }
        return pickupRoute.estimatedEnergyPercent +
            deliveryRoute.estimatedEnergyPercent +
            returnEnergyPercent
    }

    suspend fun selectReachableReturnParking(
        fromPosition: GeoPoint,
        stations: List<TransferStationDto>,
        stationSlots: List<StationSlotDto>,
        preferStationId: String? = null,
    ): StationSlotDto? {
        preferReturnParkingForHandoff(preferStationId, fromPosition, stations, stationSlots)?.let { slot ->
            return reserveReturnParkingSlot(slot, fromPosition, stations, stationSlots)
        }
        preferStationId?.let { stationId ->
            val station = stations.firstOrNull { it.id == stationId } ?: return@let
            reserveReturnParkingAtStation(station, fromPosition, stationSlots)?.let { return it }
        }
        val candidates = stations
            .filter { station -> parking.hasParkingAvailableForAgent(station, stationSlots) }
            .sortedWith(
                compareBy<TransferStationDto> { station ->
                    if (station.id == preferStationId) 0 else 1
                }.thenBy { station -> Geo.distanceMeters(fromPosition, station.position) },
            )
        for (station in candidates) {
            val slot = reserveReturnParkingAtStation(station, fromPosition, stationSlots) ?: continue
            if (returnLegFeasible(fromPosition, station, slot)) {
                return slot
            }
            runtime.backend.releaseParkingSlot(slot.stationId, slot.index, config.agentId)
        }
        return null
    }

    suspend fun returnLegFeasible(
        fromPosition: GeoPoint,
        station: TransferStationDto,
        slot: StationSlotDto,
    ): Boolean {
        val agent = runtime.backend.getAgent(config.agentId).copy(position = fromPosition)
        val network = runtime.backend.networkState()
        val approach = stations.slotDrivePoint(station, slot)
        val returnRoute = runtime.planRouteToPoint(agent, approach, network)
        val sameStationHandoff = returnRoute.distanceMeters <= AgentControllerConstants.SAME_STATION_RETURN_MAX_METERS
        val returnEnergy = if (sameStationHandoff) {
            min(returnRoute.estimatedEnergyPercent, AgentControllerConstants.SAME_STATION_RETURN_MAX_ENERGY_PERCENT)
        } else {
            returnRoute.estimatedEnergyPercent
        }
        if (returnEnergy + AgentControllerConstants.TASK_ROUTE_RESERVE_PERCENT > runtime.simulatedEnergyPercent) {
            return false
        }
        val usableRange = agent.maxRangeMeters * (
            runtime.simulatedEnergyPercent / AgentControllerConstants.FULL_ENERGY_PERCENT
        )
        return returnRoute.distanceMeters <= usableRange
    }
}

internal fun isClosestEligibleForPickup(
    agent: TransportAgentDto,
    pickupPoint: GeoPoint,
    requiredAgentType: AgentType?,
    peers: List<TransportAgentDto>,
    tasks: List<TransportTaskDto> = emptyList(),
): Boolean {
    val myDistance = Geo.distanceMeters(agent.position, pickupPoint)
    val tieEpsilonMeters = AgentControllerConstants.PICKUP_DISTANCE_TIE_EPSILON_METERS
    for (peer in peers) {
        if (peer.id == agent.id) continue
        if (tasks.inProgressTaskFor(peer.id) != null) continue
        if (peer.status !in AgentControllerConstants.COMPETING_FOR_TASK_STATUSES) continue
        if (requiredAgentType != null && requiredAgentType != peer.type) continue
        val peerDistance = Geo.distanceMeters(peer.position, pickupPoint)
        if (agent.type == AgentType.UGV &&
            peer.type == AgentType.UAV &&
            requiredAgentType != AgentType.UGV &&
            peerDistance <= myDistance + tieEpsilonMeters
        ) {
            return false
        }
        if (peerDistance < myDistance - tieEpsilonMeters) return false
        if (kotlin.math.abs(peerDistance - myDistance) <= tieEpsilonMeters && peer.id < agent.id) return false
    }
    return true
}
