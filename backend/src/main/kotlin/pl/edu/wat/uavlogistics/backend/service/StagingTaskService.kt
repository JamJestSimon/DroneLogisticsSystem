package pl.edu.wat.uavlogistics.backend.service

import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.or
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update
import pl.edu.wat.uavlogistics.backend.persistence.TransportAgentsTable
import pl.edu.wat.uavlogistics.backend.persistence.TransportTasksTable
import pl.edu.wat.uavlogistics.backend.persistence.toAgentDto
import pl.edu.wat.uavlogistics.backend.persistence.toStationDto
import pl.edu.wat.uavlogistics.backend.persistence.toTaskDto
import pl.edu.wat.uavlogistics.common.AgentStatus
import pl.edu.wat.uavlogistics.common.Geo
import pl.edu.wat.uavlogistics.common.GeoPoint
import pl.edu.wat.uavlogistics.common.StagingTaskIds
import pl.edu.wat.uavlogistics.common.TransportTaskDto
import pl.edu.wat.uavlogistics.common.TransportTaskKind
import pl.edu.wat.uavlogistics.common.TransportTaskStatus
import pl.edu.wat.uavlogistics.common.parseEntityId
import pl.edu.wat.uavlogistics.common.parseEntityIdOrNull

class StagingTaskService(
    private val stationSlots: StationSlotService = StationSlotService(),
) {
    /**
     * Creates or reopens a staging task for [packageTaskId] toward [toStationId].
     * Any feasible agent at [fromStationId] may claim it (same model as rebalance).
     */
    fun ensureStagingTask(
        agentId: String,
        packageTaskId: String,
        fromStationId: String?,
        toStationId: String,
    ): TransportTaskDto? = transaction {
        if (fromStationId == null || fromStationId == toStationId) return@transaction null
        val packageTask = findTaskRow(packageTaskId).toTaskDto()
        if (packageTask.kind != TransportTaskKind.PACKAGE) {
            throw ValidationException("Staging can only be created for package tasks.")
        }
        cancelOtherStagingDestinationsForPackage(packageTaskId, keepToStationId = toStationId)

        val fromStation = fromStationId?.let { findStationRow(it).toStationDto() }
        val toStation = findStationRow(toStationId).toStationDto()
        val fromPoint = fromStation?.position
            ?: findAgentRow(agentId).toAgentDto().position
        val taskId = StagingTaskIds.deterministicId(packageTaskId, toStationId)

        val existing = TransportTasksTable.selectAll()
            .where { TransportTasksTable.id eq taskId }
            .firstOrNull()
            ?.toTaskDto()

        if (existing != null) {
            when (existing.status) {
                TransportTaskStatus.AVAILABLE -> {
                    refreshStagingEndpoints(existing.id, fromStationId, fromPoint, toStation.position, packageTask)
                    return@transaction findTaskRow(taskId.toString()).toTaskDto()
                }
                TransportTaskStatus.IN_PROGRESS -> return@transaction existing
                TransportTaskStatus.COMPLETED,
                TransportTaskStatus.CANCELLED,
                -> return@transaction reopenIfNeeded(
                    existing,
                    fromStationId,
                    fromPoint,
                    toStation.position,
                    packageTask,
                )
                else -> return@transaction null
            }
        }

        val inserted = runCatching {
            TransportTasksTable.insert {
                it[id] = taskId
                it[shipmentId] = parseEntityId(packageTask.shipmentId)
                it[startLat] = fromPoint.latitude
                it[startLon] = fromPoint.longitude
                it[startAlt] = fromPoint.altitudeMeters
                it[endLat] = toStation.position.latitude
                it[endLon] = toStation.position.longitude
                it[endAlt] = toStation.position.altitudeMeters
                it[startStationId] = parseEntityIdOrNull(fromStationId)
                it[endStationId] = parseEntityIdOrNull(toStationId)
                it[kind] = TransportTaskKind.STAGING
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

    fun completeStagingTask(taskId: String, agentId: String): TransportTaskDto = transaction {
        val task = findTaskRow(taskId).toTaskDto()
        if (task.kind != TransportTaskKind.STAGING) {
            throw ValidationException("Task $taskId is not a staging task.")
        }
        if (task.status != TransportTaskStatus.IN_PROGRESS || task.assignedAgentId != agentId) {
            throw ConflictException("Staging task $taskId is not in progress for agent $agentId.")
        }
        val destinationId = task.endStationId
            ?: throw ValidationException("Staging task $taskId has no destination station.")
        stationSlots.requireOccupiedParkingForTaskComplete(agentId, destinationId)

        val completed = TransportTasksTable.update({
            (TransportTasksTable.id eq parseEntityId(taskId)) and
                (TransportTasksTable.status eq TransportTaskStatus.IN_PROGRESS) and
                (TransportTasksTable.assignedAgentId eq parseEntityId(agentId))
        }) {
            it[status] = TransportTaskStatus.COMPLETED
        }
        if (completed != 1) {
            throw ConflictException("Staging task $taskId was already completed.")
        }

        TransportAgentsTable.update({ TransportAgentsTable.id eq parseEntityId(agentId) }) {
            it[status] = AgentStatus.AVAILABLE
        }
        recomputeStationParking()
        findTaskRow(taskId).toTaskDto()
    }

    fun stagingLegFeasible(
        agent: pl.edu.wat.uavlogistics.common.TransportAgentDto,
        task: TransportTaskDto,
    ): Boolean {
        val distance = Geo.distanceMeters(agent.position, task.endPoint)
        val usableRange = agent.maxRangeMeters * (agent.energyLevelPercent / 100.0)
        return distance <= usableRange
    }

    fun cancelAvailableStagingForPackage(packageTaskId: String) = transaction {
        TransportTasksTable.selectAll()
            .where {
                (TransportTasksTable.kind eq TransportTaskKind.STAGING) and
                    (TransportTasksTable.status eq TransportTaskStatus.AVAILABLE)
            }
            .map { it.toTaskDto() }
            .filter { task ->
                val toStationId = task.endStationId ?: return@filter false
                StagingTaskIds.belongsToPackage(parseEntityId(task.id), packageTaskId, toStationId)
            }
            .forEach { task ->
                TransportTasksTable.update({ TransportTasksTable.id eq parseEntityId(task.id) }) {
                    it[status] = TransportTaskStatus.CANCELLED
                    it[assignedAgentId] = null
                }
            }
    }

    private fun cancelOtherStagingDestinationsForPackage(packageTaskId: String, keepToStationId: String) {
        val keepTaskId = StagingTaskIds.deterministicId(packageTaskId, keepToStationId)
        TransportTasksTable.selectAll()
            .where {
                (TransportTasksTable.kind eq TransportTaskKind.STAGING) and
                    (TransportTasksTable.status eq TransportTaskStatus.AVAILABLE)
            }
            .map { it.toTaskDto() }
            .filter { task ->
                val toStationId = task.endStationId ?: return@filter false
                StagingTaskIds.belongsToPackage(parseEntityId(task.id), packageTaskId, toStationId)
            }
            .filter { parseEntityId(it.id) != keepTaskId }
            .forEach { task ->
                TransportTasksTable.update({ TransportTasksTable.id eq parseEntityId(task.id) }) {
                    it[status] = TransportTaskStatus.CANCELLED
                    it[assignedAgentId] = null
                }
            }
    }

    private fun refreshStagingEndpoints(
        taskId: String,
        fromStationId: String?,
        fromPosition: GeoPoint,
        toPosition: GeoPoint,
        packageTask: TransportTaskDto,
    ) {
        TransportTasksTable.update({ TransportTasksTable.id eq parseEntityId(taskId) }) {
            it[startLat] = fromPosition.latitude
            it[startLon] = fromPosition.longitude
            it[startAlt] = fromPosition.altitudeMeters
            it[endLat] = toPosition.latitude
            it[endLon] = toPosition.longitude
            it[endAlt] = toPosition.altitudeMeters
            if (fromStationId != null) {
                it[startStationId] = parseEntityIdOrNull(fromStationId)
            }
        }
    }

    private fun reopenIfNeeded(
        existing: TransportTaskDto,
        fromStationId: String?,
        fromPosition: GeoPoint,
        toPosition: GeoPoint,
        packageTask: TransportTaskDto,
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
            it[startStationId] = parseEntityIdOrNull(fromStationId)
            it[endStationId] = parseEntityIdOrNull(existing.endStationId)
        }
        return if (updated == 1) findTaskRow(existing.id).toTaskDto() else null
    }
}
