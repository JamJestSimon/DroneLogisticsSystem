package pl.edu.wat.uavlogistics.backend.service

import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update
import pl.edu.wat.uavlogistics.backend.persistence.TransferStationsTable
import pl.edu.wat.uavlogistics.backend.persistence.toStationDto
import pl.edu.wat.uavlogistics.common.RegisterStationRequest
import pl.edu.wat.uavlogistics.common.StationStatus
import pl.edu.wat.uavlogistics.common.TransferStationDto
import pl.edu.wat.uavlogistics.common.UpdateStationStateRequest
import pl.edu.wat.uavlogistics.common.parseEntityId

class StationService(
    private val simulation: GazeboSimulationService = GazeboSimulationService.fromEnv(),
) {
    fun register(request: RegisterStationRequest): TransferStationDto {
        val station = transaction {
            registerInRegistry(request)
        }

        simulation.spawnStation(station.id, station.position, station.parkingCapacity, station.storageCapacity)

        return station
    }

    private fun registerInRegistry(request: RegisterStationRequest): TransferStationDto {
        val existing = TransferStationsTable.selectAll()
            .where { TransferStationsTable.id eq parseEntityId(request.id) }
            .singleOrNull()
        if (existing == null) {
            TransferStationsTable.insert {
                it[id] = parseEntityId(request.id)
                it[name] = request.name
                it[lat] = request.position.latitude
                it[lon] = request.position.longitude
                it[alt] = request.position.altitudeMeters
                it[storageCapacity] = request.storageCapacity
                it[occupiedStorage] = 0
                it[parkingCapacity] = request.parkingCapacity
                it[occupiedParking] = 0
                it[status] = StationStatus.PREPARING
            }
        }
        return findStationRow(request.id).toStationDto()
    }

    fun activate(id: String): TransferStationDto = updateState(
        id,
        UpdateStationStateRequest(status = StationStatus.ACTIVE),
    )

    fun updateState(id: String, request: UpdateStationStateRequest): TransferStationDto = transaction {
        val current = findStationRow(id).toStationDto()
        TransferStationsTable.update({ TransferStationsTable.id eq parseEntityId(id) }) {
            it[status] = request.status
            it[occupiedStorage] = request.occupiedStorage ?: current.occupiedStorage
            it[occupiedParking] = request.occupiedParking ?: current.occupiedParking
        }
        findStationRow(id).toStationDto()
    }

    fun withdraw(id: String): TransferStationDto = transaction {
        val current = findStationRow(id).toStationDto()
        val next = if (current.occupiedStorage == 0 && current.occupiedParking == 0) {
            StationStatus.INACTIVE
        } else {
            StationStatus.CLOSING
        }
        TransferStationsTable.update({ TransferStationsTable.id eq parseEntityId(id) }) {
            it[status] = next
        }
        findStationRow(id).toStationDto()
    }

    fun list(): List<TransferStationDto> = transaction {
        TransferStationsTable.selectAll().map { it.toStationDto() }
    }

    fun get(id: String): TransferStationDto = transaction {
        findStationRow(id).toStationDto()
    }
}
