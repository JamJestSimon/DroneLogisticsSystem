package pl.edu.wat.uavlogistics.frontend.ui

import pl.edu.wat.uavlogistics.frontend.api.ApiClient
import pl.edu.wat.uavlogistics.frontend.model.GeoCoord
import pl.edu.wat.uavlogistics.frontend.model.MapAddMode

data class RegisterOverlayState(
    val mode: MapAddMode,
    val coord: GeoCoord,
    val stationId: String = "station-${timestamp()}",
    val stationName: String = "Transfer station",
    val storageCapacity: String = "4",
    val parkingCapacity: String = "2",
    val activateStation: Boolean = true,
    val customerId: String = "client-1",
    val weightKg: String = "2.0",
    val volumeM3: String = "0.02",
    val destLat: String = "",
    val destLon: String = "",
    val groundTransport: Boolean = false,
    val agentId: String = "uav-${timestamp()}",
    val agentType: String = "UAV",
    val agentAlt: String = "0",
    val agentRange: String = "650",
    val agentPayload: String = "5",
    val agentStationId: String = "",
    val agentAutoStart: Boolean = true,
    val agentPx4Model: String = "x500",
    val agentPx4Instance: String = "0",
    val agentMavlinkPort: String = "14580",
    val activateAgent: Boolean = true,
) {
    suspend fun submit(backendUrl: String): String = when (mode) {
        MapAddMode.STATION -> submitStation(backendUrl)
        MapAddMode.AGENT -> submitAgent(backendUrl)
        MapAddMode.PACKAGE -> submitPackage(backendUrl)
    }

    private suspend fun submitStation(backendUrl: String): String {
        val body = ApiClient.jsonBody(
            "id" to stationId,
            "name" to stationName,
            "position" to ApiClient.jsonObject(
                "latitude" to coord.lat,
                "longitude" to coord.lon,
                "altitudeMeters" to 0.0,
            ),
            "storageCapacity" to storageCapacity.toInt(),
            "parkingCapacity" to parkingCapacity.toInt(),
        )
        val created = ApiClient.request(backendUrl, "/api/stations", "POST", body, admin = true)
        return if (activateStation) {
            "$created\n\n${ApiClient.request(backendUrl, "/api/stations/${ApiClient.pathSegment(stationId)}/activate", "POST", admin = true)}"
        } else {
            created
        }
    }

    private suspend fun submitAgent(backendUrl: String): String {
        val body = ApiClient.jsonBody(
            "id" to agentId,
            "type" to agentType,
            "position" to ApiClient.jsonObject(
                "latitude" to coord.lat,
                "longitude" to coord.lon,
                "altitudeMeters" to agentAlt.toDouble(),
            ),
            "energyLevelPercent" to 100.0,
            "maxRangeMeters" to agentRange.toDouble(),
            "payloadCapacityKg" to agentPayload.toDouble(),
            "currentStationId" to agentStationId.ifBlank { null },
            "runtime" to ApiClient.jsonObject(
                "autoStart" to agentAutoStart,
                "px4Model" to agentPx4Model,
                "px4Instance" to agentPx4Instance.toInt(),
                "mavlinkPort" to agentMavlinkPort.toInt(),
                "spawnInGazebo" to true,
            ),
        )
        val registered = ApiClient.request(backendUrl, "/api/agents", "POST", body)
        return if (activateAgent) {
            "$registered\n\n${ApiClient.request(backendUrl, "/api/agents/${ApiClient.pathSegment(agentId)}/activate", "POST")}"
        } else {
            registered
        }
    }

    private suspend fun submitPackage(backendUrl: String): String {
        val destLatValue = destLat.toDoubleOrNull()
            ?: throw IllegalArgumentException("Destination latitude is invalid.")
        val destLonValue = destLon.toDoubleOrNull()
            ?: throw IllegalArgumentException("Destination longitude is invalid.")
        val body = ApiClient.jsonBody(
            "customerId" to customerId,
            "senderName" to "Sender",
            "recipientName" to "Recipient",
            "origin" to ApiClient.jsonObject(
                "latitude" to coord.lat,
                "longitude" to coord.lon,
                "altitudeMeters" to 0.0,
            ),
            "destination" to ApiClient.jsonObject(
                "latitude" to destLatValue,
                "longitude" to destLonValue,
                "altitudeMeters" to 0.0,
            ),
            "packageSpec" to ApiClient.jsonObject(
                "weightKg" to weightKg.toDouble(),
                "volumeM3" to volumeM3.toDouble(),
                "requiresGroundTransport" to groundTransport,
            ),
        )
        return ApiClient.request(backendUrl, "/api/shipments", "POST", body)
    }
}

internal fun timestamp(): String = (js("Date.now()") as Double).toLong().toString()

fun Double.formatCoord(decimals: Int): String =
    asDynamic().toFixed(decimals) as String
