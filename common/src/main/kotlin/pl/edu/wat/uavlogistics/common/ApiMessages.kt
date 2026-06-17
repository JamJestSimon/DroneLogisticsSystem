package pl.edu.wat.uavlogistics.common

import kotlinx.serialization.Serializable

@Serializable
data class ErrorResponse(
    val error: String,
)

@Serializable
data class CreateShipmentRequest(
    val customerId: String,
    val senderName: String,
    val recipientName: String,
    val origin: GeoPoint,
    val destination: GeoPoint,
    val packageSpec: PackageSpec,
)

@Serializable
data class CreateShipmentResponse(
    val shipment: ShipmentDto,
    val initialTask: TransportTaskDto,
)

@Serializable
data class RegisterAgentRequest(
    val id: String,
    val type: AgentType,
    val position: GeoPoint,
    val energyLevelPercent: Double,
    val maxRangeMeters: Double,
    val payloadCapacityKg: Double,
    val currentStationId: String? = null,
    val runtime: AgentRuntimeRequest = AgentRuntimeRequest(),
)

@Serializable
data class AgentRuntimeRequest(
    val autoStart: Boolean = false,
    val px4Model: String? = null,
    val px4Instance: Int? = null,
    val mavlinkPort: Int? = null,
    val spawnInGazebo: Boolean = true,
)

@Serializable
data class UpdateAgentStateRequest(
    val position: GeoPoint,
    val energyLevelPercent: Double,
    val status: AgentStatus,
    val currentStationId: String? = null,
)

@Serializable
data class RegisterStationRequest(
    val id: String,
    val name: String,
    val position: GeoPoint,
    val storageCapacity: Int,
    val parkingCapacity: Int,
)

@Serializable
data class UpdateStationStateRequest(
    val status: StationStatus,
    val occupiedStorage: Int? = null,
    val occupiedParking: Int? = null,
)

@Serializable
data class ClaimTaskRequest(
    val agentId: String,
)

@Serializable
data class PickupTaskRequest(
    val agentId: String,
)

@Serializable
data class ClaimTaskResponse(
    val claimed: Boolean,
    val task: TransportTaskDto? = null,
    val reason: String? = null,
)

@Serializable
data class CompleteTaskRequest(
    val agentId: String,
    val deliveredToStationId: String? = null,
    val finalDelivery: Boolean = false,
    /** When true, agent stays BUSY (e.g. return-to-hub leg still pending). */
    val keepAgentBusy: Boolean = false,
)

@Serializable
data class EnsureRebalanceTaskRequest(
    val fromStationId: String,
    val toStationId: String,
)

@Serializable
data class CompleteRebalanceTaskRequest(
    val agentId: String,
)

@Serializable
data class EnsureStagingTaskRequest(
    val agentId: String,
    val packageTaskId: String,
    val fromStationId: String?,
    val toStationId: String,
)

@Serializable
data class CompleteStagingTaskRequest(
    val agentId: String,
)

@Serializable
data class AbandonRelocationClaimRequest(
    val agentId: String,
)

@Serializable
data class PackagePoseRequest(
    val position: GeoPoint,
)

@Serializable
data class AttachPackageRequest(
    val agentId: String,
    val position: GeoPoint,
)

@Serializable
data class ReserveStationSlotRequest(
    val agentId: String,
    /** When false, a full station returns conflict instead of an ephemeral overbook slot. */
    val allowEphemeral: Boolean = false,
)

@Serializable
data class ConfirmParkingOccupancyRequest(
    val agentId: String,
)

@Serializable
data class FleetRangeSettingsDto(
    val uavMaxRangeMeters: Double,
    val ugvMaxRangeMeters: Double,
    val routeReservePercent: Double = 15.0,
)

@Serializable
data class ControllerConfig(
    val agentId: String,
    val agentType: AgentType,
    val backendUrl: String,
    val px4Connection: String,
    val telemetryPeriodMillis: Long = 1_000,
    val pollingPeriodMillis: Long = 2_000,
)
