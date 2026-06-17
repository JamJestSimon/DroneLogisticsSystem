package pl.edu.wat.uavlogistics.backend.persistence



import org.jetbrains.exposed.sql.ResultRow

import pl.edu.wat.uavlogistics.common.GeoPoint

import pl.edu.wat.uavlogistics.common.PackageSpec

import pl.edu.wat.uavlogistics.common.ShipmentDto

import pl.edu.wat.uavlogistics.common.ShipmentEventDto

import pl.edu.wat.uavlogistics.common.TransferStationDto

import pl.edu.wat.uavlogistics.common.TransportAgentDto

import pl.edu.wat.uavlogistics.common.TransportTaskDto

import java.util.UUID



private fun uuidString(value: UUID?): String? = value?.toString()



fun ResultRow.toShipmentDto() = ShipmentDto(

    id = this[ShipmentsTable.id].toString(),

    customerId = this[ShipmentsTable.customerId].toString(),

    senderName = this[ShipmentsTable.senderName],

    recipientName = this[ShipmentsTable.recipientName],

    origin = GeoPoint(this[ShipmentsTable.originLat], this[ShipmentsTable.originLon], this[ShipmentsTable.originAlt]),

    destination = GeoPoint(

        this[ShipmentsTable.destinationLat],

        this[ShipmentsTable.destinationLon],

        this[ShipmentsTable.destinationAlt],

    ),

    packageSpec = PackageSpec(

        weightKg = this[ShipmentsTable.weightKg],

        volumeM3 = this[ShipmentsTable.volumeM3],

        requiresGroundTransport = this[ShipmentsTable.requiresGroundTransport],

    ),

    status = this[ShipmentsTable.status],

    currentStationId = uuidString(this[ShipmentsTable.currentStationId]),

    carryingAgentId = uuidString(this[ShipmentsTable.carryingAgentId]),

)



fun ResultRow.toTaskDto() = TransportTaskDto(

    id = this[TransportTasksTable.id].toString(),

    shipmentId = this[TransportTasksTable.shipmentId].toString(),

    startPoint = GeoPoint(this[TransportTasksTable.startLat], this[TransportTasksTable.startLon], this[TransportTasksTable.startAlt]),

    endPoint = GeoPoint(this[TransportTasksTable.endLat], this[TransportTasksTable.endLon], this[TransportTasksTable.endAlt]),

    startStationId = uuidString(this[TransportTasksTable.startStationId]),

    endStationId = uuidString(this[TransportTasksTable.endStationId]),

    kind = this[TransportTasksTable.kind],

    status = this[TransportTasksTable.status],

    assignedAgentId = uuidString(this[TransportTasksTable.assignedAgentId]),

)



fun ResultRow.toAgentDto() = TransportAgentDto(

    id = this[TransportAgentsTable.id].toString(),

    type = this[TransportAgentsTable.type],

    position = GeoPoint(this[TransportAgentsTable.lat], this[TransportAgentsTable.lon], this[TransportAgentsTable.alt]),

    energyLevelPercent = this[TransportAgentsTable.energyLevelPercent],

    maxRangeMeters = this[TransportAgentsTable.maxRangeMeters],

    payloadCapacityKg = this[TransportAgentsTable.payloadCapacityKg],

    status = this[TransportAgentsTable.status],

    currentStationId = uuidString(this[TransportAgentsTable.currentStationId]),

)



fun ResultRow.toStationDto() = TransferStationDto(

    id = this[TransferStationsTable.id].toString(),

    name = this[TransferStationsTable.name],

    position = GeoPoint(this[TransferStationsTable.lat], this[TransferStationsTable.lon], this[TransferStationsTable.alt]),

    storageCapacity = this[TransferStationsTable.storageCapacity],

    occupiedStorage = this[TransferStationsTable.occupiedStorage],

    parkingCapacity = this[TransferStationsTable.parkingCapacity],

    occupiedParking = this[TransferStationsTable.occupiedParking],

    status = this[TransferStationsTable.status],

)



fun ResultRow.toEventDto() = ShipmentEventDto(

    id = this[ShipmentEventsTable.id].toString(),

    shipmentId = this[ShipmentEventsTable.shipmentId].toString(),

    taskId = uuidString(this[ShipmentEventsTable.taskId]),

    agentId = uuidString(this[ShipmentEventsTable.agentId]),

    stationId = uuidString(this[ShipmentEventsTable.stationId]),

    type = this[ShipmentEventsTable.type],

    occurredAt = this[ShipmentEventsTable.occurredAt].toString(),

    description = this[ShipmentEventsTable.description],

)


