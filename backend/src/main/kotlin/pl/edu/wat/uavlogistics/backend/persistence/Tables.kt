package pl.edu.wat.uavlogistics.backend.persistence



import org.jetbrains.exposed.sql.Table

import org.jetbrains.exposed.sql.javatime.datetime

import pl.edu.wat.uavlogistics.common.AgentStatus

import pl.edu.wat.uavlogistics.common.AgentType

import pl.edu.wat.uavlogistics.common.ShipmentEventType

import pl.edu.wat.uavlogistics.common.ShipmentStatus

import pl.edu.wat.uavlogistics.common.StationStatus

import pl.edu.wat.uavlogistics.common.TransportTaskKind

import pl.edu.wat.uavlogistics.common.TransportTaskStatus

import pl.edu.wat.uavlogistics.common.UserRole



object UsersTable : Table("users") {

    val id = uuid("id")

    val email = varchar("email", 255).uniqueIndex()

    val role = enumerationByName<UserRole>("role", 32)

    override val primaryKey = PrimaryKey(id)

}



object ShipmentsTable : Table("shipments") {

    val id = uuid("id")

    val customerId = uuid("customer_id")

    val senderName = varchar("sender_name", 255)

    val recipientName = varchar("recipient_name", 255)

    val originLat = double("origin_lat")

    val originLon = double("origin_lon")

    val originAlt = double("origin_alt")

    val destinationLat = double("destination_lat")

    val destinationLon = double("destination_lon")

    val destinationAlt = double("destination_alt")

    val weightKg = double("weight_kg")

    val volumeM3 = double("volume_m3")

    val requiresGroundTransport = bool("requires_ground_transport")

    val status = enumerationByName<ShipmentStatus>("status", 32)

    val currentStationId = uuid("current_station_id").nullable()

    val carryingAgentId = uuid("carrying_agent_id").nullable()

    override val primaryKey = PrimaryKey(id)

}



object TransportTasksTable : Table("transport_tasks") {

    val id = uuid("id")

    val shipmentId = uuid("shipment_id").references(ShipmentsTable.id)

    val startLat = double("start_lat")

    val startLon = double("start_lon")

    val startAlt = double("start_alt")

    val endLat = double("end_lat")

    val endLon = double("end_lon")

    val endAlt = double("end_alt")

    val startStationId = uuid("start_station_id").nullable()

    val endStationId = uuid("end_station_id").nullable()

    val kind = enumerationByName<TransportTaskKind>("kind", 32)

    val status = enumerationByName<TransportTaskStatus>("status", 32)

    val assignedAgentId = uuid("assigned_agent_id").nullable()

    override val primaryKey = PrimaryKey(id)

}



object TransportAgentsTable : Table("transport_agents") {

    val id = uuid("id")

    val type = enumerationByName<AgentType>("type", 16)

    val lat = double("lat")

    val lon = double("lon")

    val alt = double("alt")

    val energyLevelPercent = double("energy_level_percent")

    val maxRangeMeters = double("max_range_meters")

    val payloadCapacityKg = double("payload_capacity_kg")

    val status = enumerationByName<AgentStatus>("status", 32)

    val currentStationId = uuid("current_station_id").nullable()

    override val primaryKey = PrimaryKey(id)

}



object TransferStationsTable : Table("transfer_stations") {

    val id = uuid("id")

    val name = varchar("name", 255)

    val lat = double("lat")

    val lon = double("lon")

    val alt = double("alt")

    val storageCapacity = integer("storage_capacity")

    val occupiedStorage = integer("occupied_storage")

    val parkingCapacity = integer("parking_capacity")

    val occupiedParking = integer("occupied_parking")

    val status = enumerationByName<StationStatus>("status", 32)

    override val primaryKey = PrimaryKey(id)

}



object ShipmentEventsTable : Table("shipment_events") {

    val id = uuid("id")

    val shipmentId = uuid("shipment_id").references(ShipmentsTable.id)

    val taskId = uuid("task_id").nullable()

    val agentId = uuid("agent_id").nullable()

    val stationId = uuid("station_id").nullable()

    val type = enumerationByName<ShipmentEventType>("type", 64)

    val occurredAt = datetime("occurred_at")

    val description = varchar("description", 1024)

    override val primaryKey = PrimaryKey(id)

}



object ParkingSlotReservationsTable : Table("parking_slot_reservations") {

    val agentId = uuid("agent_id")

    val stationId = uuid("station_id").references(TransferStationsTable.id)

    val slotIndex = integer("slot_index")

    val ephemeral = bool("ephemeral").default(false)

    val expectsVacateBy = uuid("expects_vacate_by").nullable()

    override val primaryKey = PrimaryKey(agentId)

}


