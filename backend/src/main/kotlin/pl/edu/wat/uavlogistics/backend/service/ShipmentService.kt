package pl.edu.wat.uavlogistics.backend.service



import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

import org.jetbrains.exposed.sql.SqlExpressionBuilder.neq

import org.jetbrains.exposed.sql.and

import org.jetbrains.exposed.sql.insert

import org.jetbrains.exposed.sql.selectAll

import org.jetbrains.exposed.sql.transactions.transaction

import org.jetbrains.exposed.sql.update

import pl.edu.wat.uavlogistics.backend.persistence.ShipmentsTable

import pl.edu.wat.uavlogistics.backend.persistence.TransportAgentsTable

import pl.edu.wat.uavlogistics.backend.persistence.TransportTasksTable

import pl.edu.wat.uavlogistics.backend.persistence.toEventDto

import pl.edu.wat.uavlogistics.backend.persistence.toShipmentDto

import pl.edu.wat.uavlogistics.backend.persistence.toTaskDto

import pl.edu.wat.uavlogistics.common.AgentStatus

import pl.edu.wat.uavlogistics.common.CreateShipmentRequest

import pl.edu.wat.uavlogistics.common.CreateShipmentResponse

import pl.edu.wat.uavlogistics.common.GeoPoint

import pl.edu.wat.uavlogistics.common.ShipmentDto

import pl.edu.wat.uavlogistics.common.ShipmentEventDto

import pl.edu.wat.uavlogistics.common.ShipmentEventType

import pl.edu.wat.uavlogistics.common.ShipmentStatus

import pl.edu.wat.uavlogistics.common.TransportTaskStatus

import pl.edu.wat.uavlogistics.common.parseEntityId

import java.util.UUID



class ShipmentService(

    private val simulation: GazeboSimulationService = GazeboSimulationService.fromEnv(),

) {

    fun createShipment(request: CreateShipmentRequest): CreateShipmentResponse {

        val response = transaction {

            createShipmentInRegistry(request)

        }



        simulation.spawnPackage(response.shipment.id, response.shipment.origin)



        return response

    }



    private fun createShipmentInRegistry(request: CreateShipmentRequest): CreateShipmentResponse {

        validatePackage(request.packageSpec.weightKg, request.packageSpec.volumeM3)



        val shipmentId = UUID.randomUUID()

        val taskId = UUID.randomUUID()



        ShipmentsTable.insert {

            it[id] = shipmentId

            it[customerId] = parseEntityId(request.customerId)

            it[senderName] = request.senderName

            it[recipientName] = request.recipientName

            it[originLat] = request.origin.latitude

            it[originLon] = request.origin.longitude

            it[originAlt] = request.origin.altitudeMeters

            it[destinationLat] = request.destination.latitude

            it[destinationLon] = request.destination.longitude

            it[destinationAlt] = request.destination.altitudeMeters

            it[weightKg] = request.packageSpec.weightKg

            it[volumeM3] = request.packageSpec.volumeM3

            it[requiresGroundTransport] = request.packageSpec.requiresGroundTransport

            it[status] = ShipmentStatus.WAITING

            it[currentStationId] = null

            it[carryingAgentId] = null

        }



        TransportTasksTable.insert {

            it[id] = taskId

            it[TransportTasksTable.shipmentId] = shipmentId

            setTaskRoute(it, request.origin, request.destination)

            it[startStationId] = null

            it[endStationId] = null

            it[kind] = pl.edu.wat.uavlogistics.common.TransportTaskKind.PACKAGE

            it[status] = TransportTaskStatus.AVAILABLE

            it[assignedAgentId] = null

        }



        EventWriter.record(

            shipmentId = shipmentId.toString(),

            taskId = taskId.toString(),

            type = ShipmentEventType.SHIPMENT_CREATED,

            description = "Shipment created and initial transport task exposed.",

        )



        return CreateShipmentResponse(

            shipment = findShipmentRow(shipmentId.toString()).toShipmentDto(),

            initialTask = findTaskRow(taskId.toString()).toTaskDto(),

        )

    }



    fun listShipments(): List<ShipmentDto> = transaction {

        ShipmentsTable.selectAll().map { it.toShipmentDto() }

    }



    fun getShipment(id: String): ShipmentDto = transaction {

        findShipmentRow(id).toShipmentDto()

    }



    fun cancelShipment(id: String): ShipmentDto = transaction {

        val shipmentUuid = parseEntityId(id)

        val shipment = findShipmentRow(id).toShipmentDto()

        val assignedAgentIds = TransportTasksTable

            .selectAll()

            .where {

                (TransportTasksTable.shipmentId eq shipmentUuid) and

                    (TransportTasksTable.status neq TransportTaskStatus.COMPLETED)

            }

            .mapNotNull { it[TransportTasksTable.assignedAgentId] }

            .toSet() + listOfNotNull(shipment.carryingAgentId?.let { parseEntityId(it) })



        val updated = ShipmentsTable.update({ ShipmentsTable.id eq shipmentUuid }) {

            it[status] = ShipmentStatus.CANCELLED

            it[currentStationId] = null

            it[carryingAgentId] = null

        }

        if (updated == 0) throw NotFoundException("Shipment $id was not found.")



        TransportTasksTable.update({

            (TransportTasksTable.shipmentId eq shipmentUuid) and

                (TransportTasksTable.status neq TransportTaskStatus.COMPLETED)

        }) {

            it[status] = TransportTaskStatus.CANCELLED

        }



        assignedAgentIds.forEach { agentUuid ->

            TransportAgentsTable.update({ TransportAgentsTable.id eq agentUuid }) {

                it[status] = AgentStatus.AVAILABLE

            }

        }



        EventWriter.record(

            shipmentId = id,

            type = ShipmentEventType.SHIPMENT_CANCELLED,

            description = "Shipment cancelled.",

        )



        findShipmentRow(id).toShipmentDto()

    }.also {

        simulation.removePackage(id)

    }



    fun history(id: String): List<ShipmentEventDto> = transaction {

        findShipmentRow(id)

        pl.edu.wat.uavlogistics.backend.persistence.ShipmentEventsTable

            .selectAll()

            .where {

                pl.edu.wat.uavlogistics.backend.persistence.ShipmentEventsTable.shipmentId eq parseEntityId(id)

            }

            .orderBy(pl.edu.wat.uavlogistics.backend.persistence.ShipmentEventsTable.occurredAt)

            .map { it.toEventDto() }

    }



    private fun validatePackage(weightKg: Double, volumeM3: Double) {

        if (weightKg <= 0) throw ValidationException("Package weight must be positive.")

        if (volumeM3 <= 0) throw ValidationException("Package volume must be positive.")

    }

}



private fun setTaskRoute(

    statement: org.jetbrains.exposed.sql.statements.UpdateBuilder<*>,

    start: GeoPoint,

    end: GeoPoint,

) {

    statement[TransportTasksTable.startLat] = start.latitude

    statement[TransportTasksTable.startLon] = start.longitude

    statement[TransportTasksTable.startAlt] = start.altitudeMeters

    statement[TransportTasksTable.endLat] = end.latitude

    statement[TransportTasksTable.endLon] = end.longitude

    statement[TransportTasksTable.endAlt] = end.altitudeMeters

}


