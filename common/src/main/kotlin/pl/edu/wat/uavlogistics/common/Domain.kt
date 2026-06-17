package pl.edu.wat.uavlogistics.common

import kotlinx.serialization.Serializable
import java.nio.charset.StandardCharsets
import java.util.UUID

@Serializable
enum class UserRole {
    CLIENT,
    ADMIN
}

@Serializable
enum class AgentType {
    UAV,
    UGV
}

@Serializable
enum class ShipmentStatus {
    CREATED,
    WAITING,
    ASSIGNED,
    IN_TRANSIT,
    AT_STATION,
    DELIVERED,
    CANCELLED
}

@Serializable
enum class TransportTaskKind {
    PACKAGE,
    REBALANCE,
    STAGING,
}

@Serializable
enum class TransportTaskStatus {
    AVAILABLE,
    RESERVED,
    IN_PROGRESS,
    COMPLETED,
    CANCELLED,
    REQUIRES_REPLAN
}

@Serializable
enum class AgentStatus {
    PENDING_ACTIVATION,
    ARMING,
    AVAILABLE,
    BUSY,
    CHARGING,
    WITHDRAWING,
    INACTIVE
}

@Serializable
enum class StationStatus {
    PREPARING,
    ACTIVE,
    CLOSING,
    TEMPORARILY_UNAVAILABLE,
    INACTIVE
}

@Serializable
enum class ShipmentEventType {
    SHIPMENT_CREATED,
    SHIPMENT_CANCELLED,
    TASK_CREATED,
    TASK_CLAIMED,
    TASK_COMPLETED,
    PICKED_UP,
    DELIVERED_TO_STATION,
    DELIVERED_TO_RECIPIENT,
    AGENT_STATUS_UPDATED,
    STATION_STATUS_UPDATED
}

@Serializable
data class GeoPoint(
    val latitude: Double,
    val longitude: Double,
    val altitudeMeters: Double = 0.0,
)

@Serializable
data class PackageSpec(
    val weightKg: Double,
    val volumeM3: Double,
    val requiresGroundTransport: Boolean = false,
)

@Serializable
data class UserDto(
    val id: String,
    val email: String,
    val role: UserRole,
)

@Serializable
data class ShipmentDto(
    val id: String,
    val customerId: String,
    val senderName: String,
    val recipientName: String,
    val origin: GeoPoint,
    val destination: GeoPoint,
    val packageSpec: PackageSpec,
    val status: ShipmentStatus,
    val currentStationId: String? = null,
    val carryingAgentId: String? = null,
)

@Serializable
data class TransportTaskDto(
    val id: String,
    val shipmentId: String,
    val startPoint: GeoPoint,
    val endPoint: GeoPoint,
    val startStationId: String? = null,
    val endStationId: String? = null,
    val kind: TransportTaskKind = TransportTaskKind.PACKAGE,
    val status: TransportTaskStatus,
    val assignedAgentId: String? = null,
)

object RebalanceTaskIds {
    val SYSTEM_SHIPMENT_ID: UUID = UUID.fromString("00000000-0000-4000-8000-000000000001")
    val SYSTEM_CUSTOMER_ID: UUID = UUID.fromString("00000000-0000-4000-8000-000000000002")

    fun deterministicId(fromStationId: String, toStationId: String): UUID =
        deterministicUuid("rebalance:$fromStationId:$toStationId")
}

object StagingTaskIds {
    fun deterministicId(packageTaskId: String, toStationId: String): UUID =
        deterministicUuid("staging:$packageTaskId:$toStationId")

    fun belongsToPackage(stagingTaskId: UUID, packageTaskId: String, toStationId: String): Boolean =
        stagingTaskId == deterministicId(packageTaskId, toStationId)
}

@Serializable
data class TransportAgentDto(
    val id: String,
    val type: AgentType,
    val position: GeoPoint,
    val energyLevelPercent: Double,
    val maxRangeMeters: Double,
    val payloadCapacityKg: Double,
    val status: AgentStatus,
    val currentStationId: String? = null,
)

@Serializable
data class TransferStationDto(
    val id: String,
    val name: String,
    val position: GeoPoint,
    val storageCapacity: Int,
    val occupiedStorage: Int,
    val parkingCapacity: Int,
    val occupiedParking: Int,
    val status: StationStatus,
)

@Serializable
enum class StationSlotKind {
    PARKING,
    STORAGE
}

@Serializable
data class StationSlotDto(
    val stationId: String,
    val kind: StationSlotKind,
    val index: Int,
    val position: GeoPoint,
    val reservedByAgentId: String? = null,
    val occupiedByAgentId: String? = null,
    val occupiedByShipmentId: String? = null,
    /** Single-slot overbook: holder waits for [expectsVacateByAgentId] to leave, then promotion to [index]. */
    val reservationEphemeral: Boolean = false,
    val expectsVacateByAgentId: String? = null,
    /** Agent holding an ephemeral overbook on this slot (may differ from [reservedByAgentId]). */
    val ephemeralWaiterAgentId: String? = null,
)

@Serializable
data class ShipmentEventDto(
    val id: String,
    val shipmentId: String,
    val taskId: String? = null,
    val agentId: String? = null,
    val stationId: String? = null,
    val type: ShipmentEventType,
    val occurredAt: String,
    val description: String,
)

@Serializable
data class NetworkStateDto(
    val shipments: List<ShipmentDto>,
    val tasks: List<TransportTaskDto>,
    val agents: List<TransportAgentDto>,
    val stations: List<TransferStationDto>,
    val stationSlots: List<StationSlotDto> = emptyList(),
    val fleetRangeSettings: FleetRangeSettingsDto,
)

private fun deterministicUuid(key: String): UUID =
    UUID.nameUUIDFromBytes("pl.edu.wat.uavlogistics:$key".toByteArray(StandardCharsets.UTF_8))
