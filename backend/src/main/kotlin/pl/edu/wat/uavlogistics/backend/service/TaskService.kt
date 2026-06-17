package pl.edu.wat.uavlogistics.backend.service

import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.inList
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update
import pl.edu.wat.uavlogistics.backend.persistence.ShipmentsTable
import pl.edu.wat.uavlogistics.backend.persistence.TransferStationsTable
import pl.edu.wat.uavlogistics.backend.persistence.TransportAgentsTable
import pl.edu.wat.uavlogistics.backend.persistence.TransportTasksTable
import pl.edu.wat.uavlogistics.backend.persistence.toAgentDto
import pl.edu.wat.uavlogistics.backend.persistence.toShipmentDto
import pl.edu.wat.uavlogistics.backend.persistence.toStationDto
import pl.edu.wat.uavlogistics.backend.persistence.toTaskDto
import pl.edu.wat.uavlogistics.common.AgentStatus
import pl.edu.wat.uavlogistics.common.ClaimTaskResponse
import pl.edu.wat.uavlogistics.common.CompleteTaskRequest
import pl.edu.wat.uavlogistics.common.GeoPoint
import pl.edu.wat.uavlogistics.common.Geo
import pl.edu.wat.uavlogistics.common.PickupTaskRequest
import pl.edu.wat.uavlogistics.common.ShipmentEventType
import pl.edu.wat.uavlogistics.common.ShipmentStatus
import pl.edu.wat.uavlogistics.common.StationSlots
import pl.edu.wat.uavlogistics.common.StationStatus
import pl.edu.wat.uavlogistics.common.TransportAgentDto
import pl.edu.wat.uavlogistics.common.TransportTaskDto
import pl.edu.wat.uavlogistics.common.TransportTaskKind
import pl.edu.wat.uavlogistics.common.TransportTaskStatus
import pl.edu.wat.uavlogistics.common.matchesAgentType
import pl.edu.wat.uavlogistics.common.parseEntityId
import pl.edu.wat.uavlogistics.common.parseEntityIdOrNull
import java.util.UUID

class TaskService(
    private val simulation: GazeboSimulationService = GazeboSimulationService.fromEnv(),
    private val stationSlots: StationSlotService = StationSlotService(),
    private val rebalanceTasks: RebalanceTaskService = RebalanceTaskService(stationSlots = stationSlots),
    private val stagingTasks: StagingTaskService = StagingTaskService(stationSlots = stationSlots),
) {
    fun listAvailableTasks(agentId: String? = null): List<TransportTaskDto> = transaction {
        val agent = agentId?.let { findAgentRow(it).toAgentDto() }
        val tasks = TransportTasksTable.selectAll()
            .where { TransportTasksTable.status eq TransportTaskStatus.AVAILABLE }
            .map { it.toTaskDto() }

        if (agent == null) {
            return@transaction tasks
        }

        val shipmentIds = tasks.map { it.shipmentId }.distinct()
        val shipmentsById = if (shipmentIds.isEmpty()) {
            emptyMap()
        } else {
            ShipmentsTable.selectAll()
                .where { ShipmentsTable.id inList shipmentIds.map { parseEntityId(it) } }
                .map { it.toShipmentDto() }
                .associateBy { it.id }
        }

        tasks.filter { task ->
            when (task.kind) {
                TransportTaskKind.REBALANCE -> true
                else -> task.matchesAgentType(agent.type, shipmentsById)
            }
        }
    }

    fun ensureRebalanceTask(fromStationId: String, toStationId: String): TransportTaskDto? =
        rebalanceTasks.ensureRebalanceTask(fromStationId, toStationId)

    fun completeRebalanceTask(taskId: String, agentId: String): TransportTaskDto =
        rebalanceTasks.completeRebalanceTask(taskId, agentId)

    fun ensureStagingTask(
        agentId: String,
        packageTaskId: String,
        fromStationId: String?,
        toStationId: String,
    ): TransportTaskDto? = stagingTasks.ensureStagingTask(agentId, packageTaskId, fromStationId, toStationId)

    fun completeStagingTask(taskId: String, agentId: String): TransportTaskDto =
        stagingTasks.completeStagingTask(taskId, agentId)

    fun cancelAvailableStagingForPackage(packageTaskId: String) =
        stagingTasks.cancelAvailableStagingForPackage(packageTaskId)

    fun claimTask(taskId: String, agentId: String): ClaimTaskResponse = transaction {
        val task = findTaskRow(taskId).toTaskDto()
        if (task.status != TransportTaskStatus.AVAILABLE) {
            return@transaction ClaimTaskResponse(false, reason = "Task is not available.")
        }

        val agent = findAgentRow(agentId).toAgentDto()
        if (agent.status != AgentStatus.AVAILABLE) {
            return@transaction ClaimTaskResponse(false, reason = "Agent is not available.")
        }
        if (task.kind != TransportTaskKind.REBALANCE) {
            val shipment = findShipmentRow(task.shipmentId).toShipmentDto()
            if (!task.matchesAgentType(agent.type, shipment)) {
                return@transaction ClaimTaskResponse(false, reason = "Agent type does not match task requirement.")
            }
        }

        when (task.kind) {
            TransportTaskKind.REBALANCE -> {
                val originId = task.startStationId
                if (originId != null && agent.currentStationId != originId) {
                    return@transaction ClaimTaskResponse(
                        false,
                        reason = "Agent must be at origin station $originId to claim this rebalance task.",
                    )
                }
                if (!rebalanceTasks.rebalanceLegFeasible(agent, task)) {
                    return@transaction ClaimTaskResponse(false, reason = "Agent energy is insufficient for rebalance.")
                }
            }
            TransportTaskKind.STAGING -> {
                val originId = task.startStationId
                if (originId != null && agent.currentStationId != originId) {
                    return@transaction ClaimTaskResponse(
                        false,
                        reason = "Agent must be at origin station $originId to claim this staging task.",
                    )
                }
                if (!stagingTasks.stagingLegFeasible(agent, task)) {
                    return@transaction ClaimTaskResponse(false, reason = "Agent energy is insufficient for staging.")
                }
            }
            TransportTaskKind.PACKAGE -> {
                val shipment = findShipmentRow(task.shipmentId).toShipmentDto()
                if (shipment.packageSpec.weightKg > agent.payloadCapacityKg) {
                    return@transaction ClaimTaskResponse(false, reason = "Package exceeds agent payload capacity.")
                }

                val routeOrigin = agentRouteOrigin(agent)
                val requiredDistance = Geo.distanceMeters(routeOrigin, task.startPoint) +
                    Geo.distanceMeters(task.startPoint, task.endPoint)
                val usableRange = agent.maxRangeMeters * (agent.energyLevelPercent / 100.0)
                if (requiredDistance > usableRange && transferStationFor(agent, task, routeOrigin, usableRange) == null) {
                    return@transaction ClaimTaskResponse(false, reason = "Agent energy is insufficient for this task.")
                }
            }
        }

        val updated = TransportTasksTable.update({
            (TransportTasksTable.id eq parseEntityId(taskId)) and
                (TransportTasksTable.status eq TransportTaskStatus.AVAILABLE) and
                TransportTasksTable.assignedAgentId.isNull()
        }) {
            it[status] = TransportTaskStatus.IN_PROGRESS
            it[assignedAgentId] = parseEntityId(agentId)
        }

        if (updated != 1) {
            return@transaction ClaimTaskResponse(false, reason = "Task was claimed by another agent.")
        }

        TransportAgentsTable.update({ TransportAgentsTable.id eq parseEntityId(agentId) }) {
            it[status] = AgentStatus.BUSY
            when (task.kind) {
                TransportTaskKind.STAGING,
                TransportTaskKind.REBALANCE,
                -> it[currentStationId] = parseEntityIdOrNull(agent.currentStationId)
                else -> it[currentStationId] = null
            }
        }
        recomputeStationParking()
        if (task.kind == pl.edu.wat.uavlogistics.common.TransportTaskKind.PACKAGE) {
            ShipmentsTable.update({ ShipmentsTable.id eq parseEntityId(task.shipmentId) }) {
                it[status] = ShipmentStatus.ASSIGNED
            }
        }
        EventWriter.record(
            shipmentId = task.shipmentId,
            taskId = taskId,
            agentId = agentId,
            type = ShipmentEventType.TASK_CLAIMED,
            description = "Task atomically claimed by agent $agentId.",
        )

        ClaimTaskResponse(true, findTaskRow(taskId).toTaskDto())
    }

    /** Reopens a relocation task and frees the agent when destination parking could not be reserved after claim. */
    fun abandonRelocationClaim(taskId: String, agentId: String) = transaction {
        val task = findTaskRow(taskId).toTaskDto()
        if (task.kind !in setOf(TransportTaskKind.STAGING, TransportTaskKind.REBALANCE)) {
            throw ValidationException("Task $taskId is not a relocation task.")
        }
        if (task.status != TransportTaskStatus.IN_PROGRESS || task.assignedAgentId != agentId) {
            throw ConflictException("Task $taskId is not in progress for agent $agentId.")
        }
        TransportTasksTable.update({ TransportTasksTable.id eq parseEntityId(taskId) }) {
            it[status] = TransportTaskStatus.AVAILABLE
            it[assignedAgentId] = null
        }
        TransportAgentsTable.update({ TransportAgentsTable.id eq parseEntityId(agentId) }) {
            it[status] = AgentStatus.AVAILABLE
            it[currentStationId] = parseEntityIdOrNull(task.startStationId)
        }
        recomputeStationParking()
    }

    fun pickUpTask(taskId: String, request: PickupTaskRequest): TransportTaskDto {
        val pickup = transaction {
        val task = findTaskRow(taskId).toTaskDto()
        if (task.kind == TransportTaskKind.REBALANCE) {
            throw ValidationException("Rebalance tasks cannot be picked up.")
        }
        if (task.kind == TransportTaskKind.STAGING) {
            throw ValidationException("Staging tasks cannot be picked up.")
        }
        if (task.status != TransportTaskStatus.IN_PROGRESS || task.assignedAgentId != request.agentId) {
            throw ConflictException("Task $taskId is not in progress.")
        }

        val agent = findAgentRow(request.agentId).toAgentDto()
        val pickupDistance = Geo.distanceMeters(agent.position, task.startPoint)
        if (pickupDistance > pickupContactRadiusMeters()) {
            throw ConflictException(
                "Agent ${request.agentId} is ${pickupDistance.toInt()} m from pickup point and cannot pick up yet.",
            )
        }

        val shipment = findShipmentRow(task.shipmentId).toShipmentDto()
        if (shipment.carryingAgentId != null) {
            throw ConflictException("Shipment ${shipment.id} is already being carried.")
        }

        val pickedUp = ShipmentsTable.update({
            (ShipmentsTable.id eq parseEntityId(task.shipmentId)) and
                ShipmentsTable.carryingAgentId.isNull()
        }) {
            it[status] = ShipmentStatus.IN_TRANSIT
            it[carryingAgentId] = parseEntityId(request.agentId)
            it[currentStationId] = null
        }
        if (pickedUp != 1) {
            throw ConflictException("Shipment ${shipment.id} was already picked up.")
        }

        task.startStationId?.let { stationId ->
            val station = findStationRow(stationId).toStationDto()
            TransferStationsTable.update({ TransferStationsTable.id eq parseEntityId(stationId) }) {
                it[occupiedStorage] = (station.occupiedStorage - 1).coerceAtLeast(0)
            }
        }

        EventWriter.record(
            shipmentId = task.shipmentId,
            taskId = taskId,
            agentId = request.agentId,
            stationId = task.startStationId,
            type = ShipmentEventType.PICKED_UP,
            description = "Shipment picked up by agent ${request.agentId} after reaching the pickup point.",
        )

        val completedTask = findTaskRow(taskId).toTaskDto()
        PickupResult(
            task = completedTask,
            shipmentId = task.shipmentId,
            agent = agent,
        )
        }
        return pickup.task
    }

    private data class PickupResult(
        val task: TransportTaskDto,
        val shipmentId: String,
        val agent: TransportAgentDto,
    )

    fun completeTask(taskId: String, request: CompleteTaskRequest): TransportTaskDto {
        var finalShipmentId: String? = null
        var storedShipmentPose: Pair<String, GeoPoint>? = null
        val completed = transaction {
        val task = findTaskRow(taskId).toTaskDto()
        if (task.kind != TransportTaskKind.PACKAGE) {
            throw ValidationException("Only package tasks can be completed through this endpoint.")
        }

        val shipment = findShipmentRow(task.shipmentId).toShipmentDto()
        if (shipment.carryingAgentId != request.agentId) {
            throw ConflictException("Shipment ${shipment.id} is not being carried by agent ${request.agentId}.")
        }
        val status = if (request.finalDelivery) ShipmentStatus.DELIVERED else ShipmentStatus.AT_STATION
        val stationId = request.deliveredToStationId

        if (!request.finalDelivery && stationId == null) {
            throw ValidationException("Station handoff requires deliveredToStationId.")
        }

        stationId?.let {
            val station = findStationRow(it).toStationDto()
            if (station.status != StationStatus.ACTIVE || station.occupiedStorage >= station.storageCapacity) {
                throw ConflictException("Station $it cannot accept the shipment.")
            }
        }

        val agent = findAgentRow(request.agentId).toAgentDto()
        if (request.finalDelivery) {
            val deliveryDistance = Geo.distanceMeters(agent.position, task.endPoint)
            if (deliveryDistance > deliveryContactRadiusMeters()) {
                throw ConflictException(
                    "Agent ${request.agentId} is ${deliveryDistance.toInt()} m from the destination " +
                        "and cannot mark final delivery yet.",
                )
            }
        } else {
            val handoffStationId = stationId!!
            val dropPosition = deliveryDropPosition(handoffStationId, task.shipmentId)
            val handoffDistance = Geo.distanceMeters(agent.position, dropPosition)
            if (handoffDistance > deliveryContactRadiusMeters()) {
                throw ConflictException(
                    "Agent ${request.agentId} is ${handoffDistance.toInt()} m from the storage drop point " +
                        "at $handoffStationId and cannot complete the handoff yet.",
                )
            }
        }

        val completedRows = TransportTasksTable.update({
            (TransportTasksTable.id eq parseEntityId(taskId)) and
                (TransportTasksTable.status eq TransportTaskStatus.IN_PROGRESS) and
                (TransportTasksTable.assignedAgentId eq parseEntityId(request.agentId))
        }) {
            it[TransportTasksTable.status] = TransportTaskStatus.COMPLETED
        }
        if (completedRows != 1) {
            throw ConflictException("Task $taskId is not assigned to agent ${request.agentId} or was already completed.")
        }
        ShipmentsTable.update({ ShipmentsTable.id eq parseEntityId(task.shipmentId) }) {
            it[ShipmentsTable.status] = status
            it[currentStationId] = parseEntityIdOrNull(stationId)
            it[carryingAgentId] = null
        }
        if (!request.keepAgentBusy) {
            TransportAgentsTable.update({ TransportAgentsTable.id eq parseEntityId(request.agentId) }) {
                it[TransportAgentsTable.status] = AgentStatus.AVAILABLE
            }
        }

        if (request.finalDelivery) {
            finalShipmentId = task.shipmentId
            EventWriter.record(
                shipmentId = task.shipmentId,
                taskId = taskId,
                agentId = request.agentId,
                type = ShipmentEventType.TASK_COMPLETED,
                description = "Transport task completed as final delivery.",
            )
            EventWriter.record(
                shipmentId = task.shipmentId,
                taskId = taskId,
                agentId = request.agentId,
                type = ShipmentEventType.DELIVERED_TO_RECIPIENT,
                description = "Shipment delivered to recipient.",
            )
        } else {
            val nextTaskId = UUID.randomUUID()
            val station = findStationRow(stationId!!).toStationDto()
            TransferStationsTable.update({ TransferStationsTable.id eq parseEntityId(stationId) }) {
                it[occupiedStorage] = station.occupiedStorage + 1
            }
            val storagePosition = storageSlotForShipment(stationId, shipment.id)
            TransportTasksTable.insert {
                it[id] = nextTaskId
                it[shipmentId] = parseEntityId(shipment.id)
                it[startLat] = storagePosition.latitude
                it[startLon] = storagePosition.longitude
                it[startAlt] = storagePosition.altitudeMeters
                it[endLat] = shipment.destination.latitude
                it[endLon] = shipment.destination.longitude
                it[endAlt] = shipment.destination.altitudeMeters
                it[startStationId] = parseEntityIdOrNull(stationId)
                it[endStationId] = null
                it[kind] = pl.edu.wat.uavlogistics.common.TransportTaskKind.PACKAGE
                it[TransportTasksTable.status] = TransportTaskStatus.AVAILABLE
                it[assignedAgentId] = null
            }
            EventWriter.record(
                shipmentId = task.shipmentId,
                taskId = taskId,
                agentId = request.agentId,
                stationId = stationId,
                type = ShipmentEventType.TASK_COMPLETED,
                description = "Transport task completed at transfer station $stationId.",
            )
            EventWriter.record(
                shipmentId = task.shipmentId,
                taskId = taskId,
                agentId = request.agentId,
                stationId = stationId,
                type = ShipmentEventType.DELIVERED_TO_STATION,
                description = "Shipment delivered to transfer station and next task ${nextTaskId} exposed.",
            )
            storedShipmentPose = task.shipmentId to storagePosition
        }

        findTaskRow(taskId).toTaskDto()
        }
        finalShipmentId?.let {
            val delayMillis = (System.getenv("SIMULATION_COMPLETED_PACKAGE_DESPAWN_DELAY_MS") ?: "5000").toLong()
            simulation.removePackage(it, delayMillis)
        }
        storedShipmentPose?.let { (shipmentId, position) ->
            simulation.movePackage(shipmentId, position)
        }
        return completed
    }

    private fun pickupContactRadiusMeters(): Double =
        (System.getenv("TASK_PICKUP_CONTACT_RADIUS_METERS") ?: "25.0").toDouble()

    private fun deliveryContactRadiusMeters(): Double =
        (System.getenv("TASK_DELIVERY_CONTACT_RADIUS_METERS") ?: pickupContactRadiusMeters().toString()).toDouble()

    private fun agentRouteOrigin(agent: TransportAgentDto): pl.edu.wat.uavlogistics.common.GeoPoint =
        agent.currentStationId
            ?.let { stationId ->
                val station = findStationRow(stationId).toStationDto()
                if (station.status == StationStatus.ACTIVE) station.position else null
            }
            ?: agent.position

    private fun transferStationFor(
        agent: TransportAgentDto,
        task: TransportTaskDto,
        routeOrigin: GeoPoint,
        usableRange: Double,
    ) = if (task.endStationId != null) {
        null
    } else {
        TransferStationsTable.selectAll()
            .map { it.toStationDto() }
            .filter { station ->
                station.status == StationStatus.ACTIVE &&
                    station.occupiedStorage < station.storageCapacity &&
                    Geo.distanceMeters(station.position, task.endPoint) < Geo.distanceMeters(task.startPoint, task.endPoint)
            }
            .filter { station ->
                val distanceViaStation = Geo.distanceMeters(routeOrigin, task.startPoint) +
                    Geo.distanceMeters(task.startPoint, station.position)
                distanceViaStation <= usableRange
            }
            .minByOrNull { station -> Geo.distanceMeters(station.position, task.endPoint) }
    }
}

private fun storageSlotForShipment(stationId: String, shipmentId: String): GeoPoint =
    deliveryDropPosition(stationId, shipmentId)

private fun deliveryDropPosition(stationId: String, shipmentId: String): GeoPoint {
    val station = findStationRow(stationId).toStationDto()
    val storedShipmentIds = ShipmentsTable.selectAll()
        .where {
            (ShipmentsTable.currentStationId eq parseEntityId(stationId)) and
                (ShipmentsTable.status eq ShipmentStatus.AT_STATION)
        }
        .map { it[ShipmentsTable.id] }
        .sorted()
    val shipmentUuid = parseEntityId(shipmentId)
    val index = storedShipmentIds.indexOf(shipmentUuid).takeIf { it >= 0 } ?: storedShipmentIds.size
    return StationSlots.storageSlot(station, index).position
}
