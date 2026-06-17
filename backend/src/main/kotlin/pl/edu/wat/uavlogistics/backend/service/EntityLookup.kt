package pl.edu.wat.uavlogistics.backend.service

import org.jetbrains.exposed.sql.selectAll
import pl.edu.wat.uavlogistics.backend.persistence.ShipmentsTable
import pl.edu.wat.uavlogistics.backend.persistence.TransferStationsTable
import pl.edu.wat.uavlogistics.backend.persistence.TransportAgentsTable
import pl.edu.wat.uavlogistics.backend.persistence.TransportTasksTable
import pl.edu.wat.uavlogistics.common.parseEntityId

fun findAgentRow(id: String) =
    TransportAgentsTable.selectAll().where { TransportAgentsTable.id eq parseEntityId(id) }.singleOrNull()
        ?: throw NotFoundException("Agent $id was not found.")

fun findStationRow(id: String) =
    TransferStationsTable.selectAll().where { TransferStationsTable.id eq parseEntityId(id) }.singleOrNull()
        ?: throw NotFoundException("Station $id was not found.")

fun findShipmentRow(id: String) =
    ShipmentsTable.selectAll().where { ShipmentsTable.id eq parseEntityId(id) }.singleOrNull()
        ?: throw NotFoundException("Shipment $id was not found.")

fun findTaskRow(id: String) =
    TransportTasksTable.selectAll().where { TransportTasksTable.id eq parseEntityId(id) }.singleOrNull()
        ?: throw NotFoundException("Task $id was not found.")
