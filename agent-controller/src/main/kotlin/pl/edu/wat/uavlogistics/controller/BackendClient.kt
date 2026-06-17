package pl.edu.wat.uavlogistics.controller

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.cio.CIO
import io.ktor.client.plugins.HttpTimeout
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.put
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.isSuccess
import io.ktor.http.contentType
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json
import pl.edu.wat.uavlogistics.common.AgentStatus
import pl.edu.wat.uavlogistics.common.AttachPackageRequest
import pl.edu.wat.uavlogistics.common.ErrorResponse
import pl.edu.wat.uavlogistics.common.ClaimTaskRequest
import pl.edu.wat.uavlogistics.common.ClaimTaskResponse
import pl.edu.wat.uavlogistics.common.CompleteRebalanceTaskRequest
import pl.edu.wat.uavlogistics.common.ConfirmParkingOccupancyRequest
import pl.edu.wat.uavlogistics.common.CompleteStagingTaskRequest
import pl.edu.wat.uavlogistics.common.CompleteTaskRequest
import pl.edu.wat.uavlogistics.common.EnsureRebalanceTaskRequest
import pl.edu.wat.uavlogistics.common.EnsureStagingTaskRequest
import pl.edu.wat.uavlogistics.common.GeoPoint
import pl.edu.wat.uavlogistics.common.NetworkStateDto
import pl.edu.wat.uavlogistics.common.PackagePoseRequest
import pl.edu.wat.uavlogistics.common.PickupTaskRequest
import pl.edu.wat.uavlogistics.common.RegisterAgentRequest
import pl.edu.wat.uavlogistics.common.ReserveStationSlotRequest
import pl.edu.wat.uavlogistics.common.StationSlotDto
import pl.edu.wat.uavlogistics.common.TransportAgentDto
import pl.edu.wat.uavlogistics.common.TransportTaskDto
import pl.edu.wat.uavlogistics.common.UpdateAgentStateRequest

class ParkingSlotUnavailableException(message: String) : Exception(message)

class BackendClient(private val baseUrl: String) {
    private val client = HttpClient(CIO) {
        install(HttpTimeout) {
            requestTimeoutMillis = 120_000
            connectTimeoutMillis = 30_000
            socketTimeoutMillis = 120_000
        }
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }

    suspend fun registerAgent(request: RegisterAgentRequest): TransportAgentDto =
        client.post("$baseUrl/api/agents") {
            contentType(ContentType.Application.Json)
            setBody(request)
        }.body()

    suspend fun activateAgent(agentId: String): TransportAgentDto =
        client.post("$baseUrl/api/agents/$agentId/activate").body()

    suspend fun getAgent(agentId: String): TransportAgentDto =
        client.get("$baseUrl/api/agents/$agentId").body()

    suspend fun updateAgentState(
        agentId: String,
        position: GeoPoint,
        energyLevelPercent: Double,
        status: AgentStatus,
        currentStationId: String? = null,
    ): TransportAgentDto =
        client.put("$baseUrl/api/agents/$agentId/state") {
            contentType(ContentType.Application.Json)
            setBody(UpdateAgentStateRequest(position, energyLevelPercent, status, currentStationId))
        }.body()

    suspend fun availableTasks(agentId: String): List<TransportTaskDto> =
        client.get("$baseUrl/api/tasks/available?agentId=$agentId").body()

    suspend fun claimTask(taskId: String, agentId: String): ClaimTaskResponse =
        client.post("$baseUrl/api/tasks/$taskId/claim") {
            contentType(ContentType.Application.Json)
            setBody(ClaimTaskRequest(agentId))
        }.body()

    suspend fun abandonRelocationClaim(taskId: String, agentId: String) {
        client.post("$baseUrl/api/tasks/$taskId/abandon-relocation") {
            contentType(ContentType.Application.Json)
            setBody(pl.edu.wat.uavlogistics.common.AbandonRelocationClaimRequest(agentId))
        }
    }

    suspend fun ensureRebalanceTask(fromStationId: String, toStationId: String): TransportTaskDto? {
        val response = client.post("$baseUrl/api/tasks/rebalance/ensure") {
            contentType(ContentType.Application.Json)
            setBody(EnsureRebalanceTaskRequest(fromStationId, toStationId))
        }
        return if (response.status == HttpStatusCode.NoContent) {
            null
        } else {
            response.body()
        }
    }

    suspend fun completeRebalanceTask(taskId: String, agentId: String): TransportTaskDto =
        client.post("$baseUrl/api/tasks/$taskId/complete-rebalance") {
            contentType(ContentType.Application.Json)
            setBody(CompleteRebalanceTaskRequest(agentId))
        }.body()

    suspend fun ensureStagingTask(
        agentId: String,
        packageTaskId: String,
        fromStationId: String?,
        toStationId: String,
    ): TransportTaskDto? {
        val response = client.post("$baseUrl/api/tasks/staging/ensure") {
            contentType(ContentType.Application.Json)
            setBody(
                EnsureStagingTaskRequest(
                    agentId = agentId,
                    packageTaskId = packageTaskId,
                    fromStationId = fromStationId,
                    toStationId = toStationId,
                ),
            )
        }
        return if (response.status == HttpStatusCode.NoContent) {
            null
        } else {
            response.body()
        }
    }

    suspend fun completeStagingTask(taskId: String, agentId: String): TransportTaskDto =
        client.post("$baseUrl/api/tasks/$taskId/complete-staging") {
            contentType(ContentType.Application.Json)
            setBody(CompleteStagingTaskRequest(agentId))
        }.body()

    suspend fun cancelAvailableStagingForPackage(packageTaskId: String) {
        client.post("$baseUrl/api/tasks/staging/cancel-for-package/$packageTaskId")
    }

    suspend fun pickUpTask(taskId: String, agentId: String): TransportTaskDto =
        client.post("$baseUrl/api/tasks/$taskId/pickup") {
            contentType(ContentType.Application.Json)
            setBody(PickupTaskRequest(agentId))
        }.body()

    suspend fun completeTask(
        taskId: String,
        agentId: String,
        finalDelivery: Boolean,
        deliveredToStationId: String? = null,
        keepAgentBusy: Boolean = false,
    ): TransportTaskDto =
        client.post("$baseUrl/api/tasks/$taskId/complete") {
            contentType(ContentType.Application.Json)
            setBody(
                CompleteTaskRequest(
                    agentId = agentId,
                    deliveredToStationId = deliveredToStationId,
                    finalDelivery = finalDelivery,
                    keepAgentBusy = keepAgentBusy,
                ),
            )
        }.body()

    suspend fun networkState(): NetworkStateDto =
        client.get("$baseUrl/api/network/state").body()

    suspend fun reserveParkingSlot(
        stationId: String,
        agentId: String,
        allowEphemeral: Boolean = false,
    ): StationSlotDto {
        val response = client.post("$baseUrl/api/stations/$stationId/parking-slots/reserve") {
            contentType(ContentType.Application.Json)
            setBody(ReserveStationSlotRequest(agentId = agentId, allowEphemeral = allowEphemeral))
        }
        if (response.status == HttpStatusCode.Conflict) {
            val message = runCatching { response.body<ErrorResponse>().error }
                .getOrNull()
                ?: response.bodyAsText()
            throw ParkingSlotUnavailableException(message)
        }
        if (!response.status.isSuccess()) {
            throw IllegalStateException(
                "Reserve parking at $stationId failed with HTTP ${response.status.value}: ${response.bodyAsText()}",
            )
        }
        return response.body()
    }

    suspend fun releaseParkingSlot(stationId: String, slotIndex: Int, agentId: String) {
        client.delete("$baseUrl/api/stations/$stationId/parking-slots/$slotIndex/reservation?agentId=$agentId")
            .body<Unit>()
    }

    /** Landed on reserved pad: dock at station, clear reservation, expose slot as occupied. */
    suspend fun confirmParkingOccupancy(stationId: String, slotIndex: Int, agentId: String): StationSlotDto {
        val response = client.post(
            "$baseUrl/api/stations/$stationId/parking-slots/$slotIndex/confirm-occupancy",
        ) {
            contentType(ContentType.Application.Json)
            setBody(ConfirmParkingOccupancyRequest(agentId))
        }
        if (!response.status.isSuccess()) {
            val message = runCatching { response.body<ErrorResponse>().error }
                .getOrNull()
                ?.takeIf { it.isNotBlank() }
                ?: response.bodyAsText()
            throw IllegalStateException(
                "Confirm parking at $stationId slot $slotIndex failed with HTTP ${response.status.value}: $message",
            )
        }
        return response.body()
    }

    suspend fun attachPackageVisual(shipmentId: String, agentId: String, position: GeoPoint) {
        client.post("$baseUrl/api/simulation/packages/$shipmentId/attach") {
            contentType(ContentType.Application.Json)
            setBody(AttachPackageRequest(agentId = agentId, position = position))
        }
    }

    suspend fun moveCargoVisual(shipmentId: String, position: GeoPoint) {
        client.put("$baseUrl/api/simulation/packages/$shipmentId/cargo-pose") {
            contentType(ContentType.Application.Json)
            setBody(PackagePoseRequest(position))
        }
    }

    suspend fun releasePackageVisual(shipmentId: String, position: GeoPoint) {
        client.post("$baseUrl/api/simulation/packages/$shipmentId/release") {
            contentType(ContentType.Application.Json)
            setBody(PackagePoseRequest(position))
        }
    }
}
