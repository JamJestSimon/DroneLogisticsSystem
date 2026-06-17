package pl.edu.wat.uavlogistics.backend.service

import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.or
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update
import pl.edu.wat.uavlogistics.backend.persistence.ShipmentsTable
import pl.edu.wat.uavlogistics.backend.persistence.TransportAgentsTable
import pl.edu.wat.uavlogistics.backend.persistence.TransportTasksTable
import pl.edu.wat.uavlogistics.common.ShipmentStatus
import pl.edu.wat.uavlogistics.backend.persistence.toAgentDto
import pl.edu.wat.uavlogistics.backend.persistence.toStationDto
import pl.edu.wat.uavlogistics.backend.persistence.toTaskDto
import pl.edu.wat.uavlogistics.common.AgentStatus
import pl.edu.wat.uavlogistics.common.GeoPoint
import pl.edu.wat.uavlogistics.common.Geo
import pl.edu.wat.uavlogistics.common.RebalanceTaskIds
import pl.edu.wat.uavlogistics.common.TransportTaskDto
import pl.edu.wat.uavlogistics.common.TransportTaskKind
import pl.edu.wat.uavlogistics.common.TransportTaskStatus
import pl.edu.wat.uavlogistics.common.parseEntityId
import pl.edu.wat.uavlogistics.common.parseEntityIdOrNull

class RebalanceTaskService(
    private val stationSlots: StationSlotService = StationSlotService(),
) {
    /**
     * Creates at most one AVAILABLE rebalance task per (from, to) pair.
     * Concurrent callers receive the same row (deterministic primary key).
     */
    fun ensureRebalanceTask(fromStationId: String, toStationId: String): TransportTaskDto? = transaction {
        ensureSystemShipment()
        if (fromStationId == toStationId) return@transaction null
        val fromStation = findStationRow(fromStationId).toStationDto()
        val toStation = findStationRow(toStationId).toStationDto()
        val taskId = RebalanceTaskIds.deterministicId(fromStationId, toStationId)

        val existing = TransportTasksTable.selectAll()
            .where { TransportTasksTable.id eq taskId }
            .firstOrNull()
            ?.toTaskDto()

        if (existing != null) {
            return@transaction when (existing.status) {
                TransportTaskStatus.AVAILABLE,
                TransportTaskStatus.IN_PROGRESS,
                -> existing
                TransportTaskStatus.COMPLETED,
                TransportTaskStatus.CANCELLED,
                -> reopenIfNeeded(existing, fromStation.position, toStation.position)
                else -> null
            }
        }

        val inserted = runCatching {
            TransportTasksTable.insert {
                it[id] = taskId
                it[shipmentId] = RebalanceTaskIds.SYSTEM_SHIPMENT_ID
                it[startLat] = fromStation.position.latitude
                it[startLon] = fromStation.position.longitude
                it[startAlt] = fromStation.position.altitudeMeters
                it[endLat] = toStation.position.latitude
                it[endLon] = toStation.position.longitude
                it[endAlt] = toStation.position.altitudeMeters
                it[startStationId] = parseEntityIdOrNull(fromStationId)
                it[endStationId] = parseEntityIdOrNull(toStationId)
                it[kind] = TransportTaskKind.REBALANCE
                it[status] = TransportTaskStatus.AVAILABLE
                it[assignedAgentId] = null
            }
        }.isSuccess

        if (!inserted) {
            return@transaction TransportTasksTable.selectAll()
                .where { TransportTasksTable.id eq taskId }
                .firstOrNull()
                ?.toTaskDto()
        }

        findTaskRow(taskId.toString()).toTaskDto()
    }

    private fun reopenIfNeeded(
        existing: TransportTaskDto,
        fromPosition: GeoPoint,
        toPosition: GeoPoint,
    ): TransportTaskDto? {
        val updated = TransportTasksTable.update({
            (TransportTasksTable.id eq parseEntityId(existing.id)) and
                ((TransportTasksTable.status eq TransportTaskStatus.COMPLETED) or
                    (TransportTasksTable.status eq TransportTaskStatus.CANCELLED))
        }) {
            it[status] = TransportTaskStatus.AVAILABLE
            it[assignedAgentId] = null
            it[startLat] = fromPosition.latitude
            it[startLon] = fromPosition.longitude
            it[startAlt] = fromPosition.altitudeMeters
            it[endLat] = toPosition.latitude
            it[endLon] = toPosition.longitude
            it[endAlt] = toPosition.altitudeMeters
        }
        return if (updated == 1) findTaskRow(existing.id).toTaskDto() else null
    }

    fun completeRebalanceTask(taskId: String, agentId: String): TransportTaskDto = transaction {
        val task = findTaskRow(taskId).toTaskDto()
        if (task.kind != TransportTaskKind.REBALANCE) {
            throw ValidationException("Task $taskId is not a rebalance task.")
        }
        if (task.status != TransportTaskStatus.IN_PROGRESS || task.assignedAgentId != agentId) {
            throw ConflictException("Rebalance task $taskId is not in progress for agent $agentId.")
        }
        val destinationId = task.endStationId
            ?: throw ValidationException("Rebalance task $taskId has no destination station.")
        val agent = findAgentRow(agentId).toAgentDto()
        val originId = task.startStationId
        if (originId != null && originId != destinationId) {
            val origin = findStationRow(originId).toStationDto()
            val distanceFromOriginMeters = Geo.distanceMeters(agent.position, origin.position)
            if (distanceFromOriginMeters < MIN_DEPARTURE_FROM_ORIGIN_METERS) {
                throw ConflictException(
                    "Agent $agentId must leave origin $originId before completing rebalance " +
                        "(${"%.1f".format(distanceFromOriginMeters)}m from origin hub).",
                )
            }
        }
        stationSlots.requireOccupiedParkingForTaskComplete(agentId, destinationId)

        val completed = TransportTasksTable.update({
            (TransportTasksTable.id eq parseEntityId(taskId)) and
                (TransportTasksTable.status eq TransportTaskStatus.IN_PROGRESS) and
                (TransportTasksTable.assignedAgentId eq parseEntityId(agentId))
        }) {
            it[status] = TransportTaskStatus.COMPLETED
        }
        if (completed != 1) {
            throw ConflictException("Rebalance task $taskId was already completed.")
        }

        TransportAgentsTable.update({ TransportAgentsTable.id eq parseEntityId(agentId) }) {
            it[status] = AgentStatus.AVAILABLE
        }
        recomputeStationParking()
        findTaskRow(taskId).toTaskDto()
    }

    fun rebalanceLegFeasible(
        agent: pl.edu.wat.uavlogistics.common.TransportAgentDto,
        task: TransportTaskDto,
    ): Boolean {
        val distance = Geo.distanceMeters(agent.position, task.endPoint)
        val usableRange = agent.maxRangeMeters * (agent.energyLevelPercent / 100.0)
        return distance <= usableRange
    }

    private fun ensureSystemShipment() {
        val exists = ShipmentsTable.selectAll()
            .where { ShipmentsTable.id eq RebalanceTaskIds.SYSTEM_SHIPMENT_ID }
            .any()
        if (exists) return
        ShipmentsTable.insert {
            it[id] = RebalanceTaskIds.SYSTEM_SHIPMENT_ID
            it[customerId] = RebalanceTaskIds.SYSTEM_CUSTOMER_ID
            it[senderName] = "System"
            it[recipientName] = "System"
            it[originLat] = 0.0
            it[originLon] = 0.0
            it[originAlt] = 0.0
            it[destinationLat] = 0.0
            it[destinationLon] = 0.0
            it[destinationAlt] = 0.0
            it[weightKg] = 0.0
            it[volumeM3] = 0.0
            it[requiresGroundTransport] = false
            it[status] = ShipmentStatus.DELIVERED
            it[currentStationId] = null
            it[carryingAgentId] = null
        }
    }

    private companion object {
        const val MIN_DEPARTURE_FROM_ORIGIN_METERS = 40.0
    }
}
