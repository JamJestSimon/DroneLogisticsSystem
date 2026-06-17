package pl.edu.wat.uavlogistics.backend.service

import org.jetbrains.exposed.sql.insert
import pl.edu.wat.uavlogistics.backend.persistence.ShipmentEventsTable
import pl.edu.wat.uavlogistics.common.ShipmentEventType
import pl.edu.wat.uavlogistics.common.parseEntityId
import pl.edu.wat.uavlogistics.common.parseEntityIdOrNull
import java.time.LocalDateTime
import java.util.UUID

object EventWriter {
    fun record(
        shipmentId: String,
        type: ShipmentEventType,
        description: String,
        taskId: String? = null,
        agentId: String? = null,
        stationId: String? = null,
    ) {
        ShipmentEventsTable.insert {
            it[id] = UUID.randomUUID()
            it[ShipmentEventsTable.shipmentId] = parseEntityId(shipmentId)
            it[ShipmentEventsTable.taskId] = parseEntityIdOrNull(taskId)
            it[ShipmentEventsTable.agentId] = parseEntityIdOrNull(agentId)
            it[ShipmentEventsTable.stationId] = parseEntityIdOrNull(stationId)
            it[ShipmentEventsTable.type] = type
            it[occurredAt] = LocalDateTime.now()
            it[ShipmentEventsTable.description] = description
        }
    }
}