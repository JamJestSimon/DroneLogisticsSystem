package pl.edu.wat.uavlogistics.controller

import kotlinx.coroutines.runBlocking
import pl.edu.wat.uavlogistics.common.AgentType
import pl.edu.wat.uavlogistics.common.ControllerConfig
import pl.edu.wat.uavlogistics.common.GeoPoint

fun main() = runBlocking {
    val config = ControllerConfig(
        agentId = env("AGENT_ID", "20000000-0000-4000-8000-000000000001"),
        agentType = AgentType.valueOf(env("AGENT_TYPE", "UAV")),
        backendUrl = env("BACKEND_URL", "http://localhost:8080"),
        px4Connection = env("PX4_CONNECTION", "udp://:14540"),
        telemetryPeriodMillis = env("TELEMETRY_PERIOD_MS", "1000").toLong(),
        pollingPeriodMillis = env("POLLING_PERIOD_MS", "2000").toLong(),
    )

    val backend = BackendClient(config.backendUrl)
    val vehicle = MavsdkVehicleAdapter(
        config.px4Connection,
        initialPosition(),
        config.agentType,
    )
    val cargoVisual = CargoVisualClient.fromEnv(backend, config.agentId)

    AgentController(config, backend, vehicle, cargoVisual, RoutePlanner()).run()
}

private fun env(name: String, default: String): String = System.getenv(name) ?: default

private fun initialPosition(): GeoPoint = GeoPoint(
    latitude = env("AGENT_INITIAL_LAT", "47.397971").toDouble(),
    longitude = env("AGENT_INITIAL_LON", "8.546164").toDouble(),
    altitudeMeters = env("AGENT_INITIAL_ALT", "0.0").toDouble(),
)
