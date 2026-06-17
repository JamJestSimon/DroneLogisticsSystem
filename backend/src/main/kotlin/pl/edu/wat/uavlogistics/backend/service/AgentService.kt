package pl.edu.wat.uavlogistics.backend.service

import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update
import pl.edu.wat.uavlogistics.backend.persistence.ShipmentsTable
import pl.edu.wat.uavlogistics.backend.persistence.TransferStationsTable
import pl.edu.wat.uavlogistics.backend.persistence.TransportAgentsTable
import pl.edu.wat.uavlogistics.common.ShipmentStatus
import pl.edu.wat.uavlogistics.backend.persistence.toAgentDto
import pl.edu.wat.uavlogistics.common.AgentStatus
import pl.edu.wat.uavlogistics.common.GeoPoint
import pl.edu.wat.uavlogistics.common.RegisterAgentRequest
import pl.edu.wat.uavlogistics.common.TransportAgentDto
import pl.edu.wat.uavlogistics.common.UpdateAgentStateRequest
import pl.edu.wat.uavlogistics.common.parseEntityId
import pl.edu.wat.uavlogistics.common.parseEntityIdOrNull
import kotlin.math.min

class AgentService(
    private val runtimeLauncher: AgentRuntimeLauncher = AgentRuntimeLauncher.fromEnv(),
    private val stationSlots: StationSlotService = StationSlotService(),
    private val simulation: GazeboSimulationService = GazeboSimulationService.fromEnv(),
) {
    fun register(request: RegisterAgentRequest): TransportAgentDto {
        findExistingAgent(request.id)?.let { return it }
        val agent = transaction {
            val initialPosition = request.currentStationId
                ?.let { stationSlots.reserveParkingSlotAtomic(it, request.id).position }
                ?: request.position
            registerInRegistry(request, initialPosition)
        }

        runtimeLauncher.launchIfRequested(
            AgentRuntimeLaunch(
                agentId = agent.id,
                agentType = agent.type,
                position = agent.position,
                maxRangeMeters = agent.maxRangeMeters,
                payloadCapacityKg = agent.payloadCapacityKg,
                runtime = request.runtime,
            ),
        )

        return agent
    }

    private fun registerInRegistry(request: RegisterAgentRequest, initialPosition: GeoPoint): TransportAgentDto {
        val existing = TransportAgentsTable.selectAll()
            .where { TransportAgentsTable.id eq parseEntityId(request.id) }
            .singleOrNull()
        if (existing == null) {
            TransportAgentsTable.insert {
                it[id] = parseEntityId(request.id)
                it[type] = request.type
                it[lat] = initialPosition.latitude
                it[lon] = initialPosition.longitude
                it[alt] = initialPosition.altitudeMeters
                it[energyLevelPercent] = request.energyLevelPercent
                it[maxRangeMeters] = request.maxRangeMeters
                it[payloadCapacityKg] = request.payloadCapacityKg
                it[status] = AgentStatus.PENDING_ACTIVATION
                it[currentStationId] = parseEntityIdOrNull(request.currentStationId)
            }
        }
        recomputeStationParking()
        return findAgentRow(request.id).toAgentDto()
    }

    fun activate(id: String): TransportAgentDto = transaction {
        val updated = TransportAgentsTable.update({ TransportAgentsTable.id eq parseEntityId(id) }) {
            it[status] = AgentStatus.ARMING
        }
        if (updated == 0) throw NotFoundException("Agent $id was not found.")
        findAgentRow(id).toAgentDto()
    }

    fun updateState(id: String, request: UpdateAgentStateRequest): TransportAgentDto = transaction {
        val updated = TransportAgentsTable.update({ TransportAgentsTable.id eq parseEntityId(id) }) {
            it[lat] = request.position.latitude
            it[lon] = request.position.longitude
            it[alt] = request.position.altitudeMeters
            it[energyLevelPercent] = request.energyLevelPercent
            it[status] = request.status
            it[currentStationId] = parseEntityIdOrNull(request.currentStationId)
        }
        if (updated == 0) throw NotFoundException("Agent $id was not found.")
        recomputeStationParking()
        findAgentRow(id).toAgentDto().also { agent ->
            stationSlots.reconcileAgent(agent)
        }
    }

    fun withdraw(id: String): TransportAgentDto = transaction {
        val agent = findAgentRow(id).toAgentDto()
        val target = if (!hasInProgressTask(id)) AgentStatus.INACTIVE else AgentStatus.WITHDRAWING
        TransportAgentsTable.update({ TransportAgentsTable.id eq parseEntityId(id) }) {
            it[status] = target
            it[currentStationId] = null
        }
        recomputeStationParking()
        stationSlots.releaseAgent(id)
        findAgentRow(id).toAgentDto()
    }

    fun purge(id: String) = transaction {
        val agent = findAgentRow(id).toAgentDto()
        if (hasInProgressTask(id)) {
            throw ConflictException("Agent $id has an active task and cannot be purged.")
        }
        TransportAgentsTable.deleteWhere { TransportAgentsTable.id eq parseEntityId(id) }
        recomputeStationParking()
        stationSlots.releaseAgent(id)
    }

    fun list(): List<TransportAgentDto> = transaction {
        TransportAgentsTable.selectAll().map { it.toAgentDto() }
    }

    fun get(id: String): TransportAgentDto = transaction {
        findAgentRow(id).toAgentDto()
    }

    private fun findExistingAgent(id: String): TransportAgentDto? = transaction {
        TransportAgentsTable.selectAll()
            .where { TransportAgentsTable.id eq parseEntityId(id) }
            .singleOrNull()
            ?.toAgentDto()
    }
}

fun recomputeStationParking() {
    val stationIds = TransferStationsTable.selectAll().map { it[TransferStationsTable.id] }
    val occupiedCounts = TransportAgentsTable.selectAll()
        .mapNotNull { it[TransportAgentsTable.currentStationId] }
        .groupingBy { it }
        .eachCount()

    stationIds.forEach { stationId ->
        val capacity = TransferStationsTable
            .selectAll()
            .where { TransferStationsTable.id eq stationId }
            .singleOrNull()
            ?.get(TransferStationsTable.parkingCapacity)
            ?: 1
        TransferStationsTable.update({ TransferStationsTable.id eq stationId }) {
            it[occupiedParking] = min(capacity, occupiedCounts[stationId] ?: 0)
        }
    }
}
