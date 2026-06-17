package pl.edu.wat.uavlogistics.backend.service

import pl.edu.wat.uavlogistics.common.AgentRuntimeRequest
import pl.edu.wat.uavlogistics.common.AgentType
import pl.edu.wat.uavlogistics.common.GeoPoint
import java.io.File
import java.lang.ProcessBuilder.Redirect
import java.nio.file.Path
import kotlin.io.path.absolutePathString

data class AgentRuntimeLaunch(
    val agentId: String,
    val agentType: AgentType,
    val position: GeoPoint,
    val maxRangeMeters: Double,
    val payloadCapacityKg: Double,
    val runtime: AgentRuntimeRequest,
)

class AgentRuntimeLauncher(
    private val mode: RuntimeMode,
    private val projectRoot: Path,
    private val backendUrl: String,
) {
    enum class RuntimeMode {
        NONE,
        DOCKER,
    }

    private val composeFile = projectRoot.resolve("runtime/docker/docker-compose.agent.yml")

    fun launchIfRequested(request: AgentRuntimeLaunch) {
        if (!request.runtime.autoStart || mode != RuntimeMode.DOCKER) return

        val model = request.runtime.px4Model ?: defaultModel(request.agentType)
        val instance = request.runtime.px4Instance ?: defaultInstance(request.agentId)
        val mavlinkPort = request.runtime.mavlinkPort ?: (14580 + instance)

        runCatching {
            val logFile = projectRoot.resolve("build/runtime/${request.agentId}.log").toFile()
            logFile.parentFile.mkdirs()
            ProcessBuilder(dockerCommand(request, model, instance, mavlinkPort))
                .directory(projectRoot.toFile())
                .redirectOutput(Redirect.appendTo(logFile))
                .redirectError(Redirect.appendTo(logFile))
                .start()
            println("Started runtime for agent ${request.agentId}; log: ${logFile.absolutePath}")
        }.onFailure {
            println("Failed to start runtime for agent ${request.agentId}: ${it.message}")
        }
    }

    private fun dockerCommand(
        request: AgentRuntimeLaunch,
        model: String,
        instance: Int,
        mavlinkPort: Int,
    ): List<String> = listOf(
        "docker",
        "compose",
        "-f",
        composeFile.absolutePathString(),
        "run",
        "-d",
        "--name",
        "uav-agent-${request.agentId}",
        "-e",
        "AGENT_ID=${request.agentId}",
        "-e",
        "AGENT_TYPE=${request.agentType.name}",
        "-e",
        "BACKEND_URL=$backendUrl",
        "-e",
        "PX4_MODEL=$model",
        "-e",
        "PX4_INSTANCE=$instance",
        "-e",
        "MAVLINK_PORT=$mavlinkPort",
        "-e",
        "AGENT_MAX_RANGE_METERS=${request.maxRangeMeters}",
        "-e",
        "AGENT_PAYLOAD_CAPACITY_KG=${request.payloadCapacityKg}",
        "-e",
        "INITIAL_LATITUDE=${request.position.latitude}",
        "-e",
        "INITIAL_LONGITUDE=${request.position.longitude}",
        "-e",
        "INITIAL_ALTITUDE=${gazeboSpawnAltitude(request.agentType, request.position)}",
        "-e",
        "SIM_ORIGIN_LAT=${GazeboSimulationService.simOriginLat()}",
        "-e",
        "SIM_ORIGIN_LON=${GazeboSimulationService.simOriginLon()}",
        "-e",
        "GZ_PARTITION=${GazeboSimulationService.gzPartition()}",
        "-e",
        "SIMULATION_GAZEBO_ENABLED=true",
        "-e",
        "SIMULATION_OFFBOARD_ONLY=${System.getenv("SIMULATION_OFFBOARD_ONLY") ?: "false"}",
        "-e",
        "AGENT_NAV_MODE=${System.getenv("AGENT_NAV_MODE") ?: "mission"}",
        "-e",
        "ROVER_MISSION_ACCEPTANCE_RADIUS_M=${System.getenv("ROVER_MISSION_ACCEPTANCE_RADIUS_M") ?: "1.5"}",
        "-e",
        "GROUND_OBSTACLE_AVOIDANCE=${System.getenv("GROUND_OBSTACLE_AVOIDANCE") ?: "true"}",
        "-e",
        "PX4_GZ_MODEL=$model",
        "agent-runtime",
    )

    private fun defaultModel(type: AgentType): String = when (type) {
        AgentType.UAV -> "x500"
        AgentType.UGV -> "r1_rover"
    }

    private fun defaultInstance(agentId: String): Int =
        agentId.filter(Char::isDigit).toIntOrNull()?.coerceIn(0, 99) ?: 0

    /** PX4 x500 at z=0 spawns half inside the ground plane and tips over. */
    private fun gazeboSpawnAltitude(type: AgentType, position: GeoPoint): Double =
        when (type) {
            AgentType.UAV -> maxOf(position.altitudeMeters, 2.0)
            else -> position.altitudeMeters
        }

    companion object {
        fun fromEnv(): AgentRuntimeLauncher {
            val projectRoot = Path.of(System.getenv("PROJECT_ROOT") ?: File(".").canonicalPath)
            val rawMode = (System.getenv("AGENT_RUNTIME_MODE") ?: "docker").lowercase()
            val mode = when (rawMode) {
                "docker" -> RuntimeMode.DOCKER
                "none", "disabled" -> RuntimeMode.NONE
                else -> {
                    println(
                        "Unknown AGENT_RUNTIME_MODE='$rawMode'; agent auto-start disabled. Use 'docker' or 'none'.",
                    )
                    RuntimeMode.NONE
                }
            }
            val defaultBackendUrl = "http://host.docker.internal:8080"
            val configuredBackendUrl = System.getenv("BACKEND_PUBLIC_URL") ?: defaultBackendUrl
            val backendUrl = if (
                mode == RuntimeMode.DOCKER &&
                (configuredBackendUrl.contains("localhost") || configuredBackendUrl.contains("127.0.0.1"))
            ) {
                defaultBackendUrl
            } else {
                configuredBackendUrl
            }

            return AgentRuntimeLauncher(
                mode = mode,
                projectRoot = projectRoot,
                backendUrl = backendUrl,
            )
        }
    }
}
