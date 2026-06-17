package pl.edu.wat.uavlogistics.backend.service

import pl.edu.wat.uavlogistics.common.AgentType
import pl.edu.wat.uavlogistics.common.GeoPoint
import java.io.File
import java.lang.ProcessBuilder.Redirect
import java.nio.file.Path
import java.util.concurrent.TimeUnit
import kotlin.io.path.absolutePathString
import kotlin.concurrent.thread

/** Backend-driven Gazebo visuals: world setup, ground packages, station restore. Carried cargo is agent-local (Option A). */
class GazeboSimulationService(
    private val enabled: Boolean,
    private val projectRoot: Path,
    private val startOnBackend: Boolean,
) {
    private val composeFile = projectRoot.resolve("runtime/docker/docker-compose.agent.yml")
    private val commandLock = Any()

    fun startGazebo(): Boolean {
        if (!enabled || !startOnBackend) return false
        return runDockerComposeUp("gazebo-sim", "build/runtime/gazebo-start.log", "Gazebo Docker startup")
    }

    fun startGazeboGui(): Boolean {
        if (!enabled) return false
        return runDockerComposeUp("gazebo-gui", "build/runtime/gazebo-gui-start.log", "Gazebo Docker GUI startup")
    }

    private fun runDockerComposeUp(service: String, logRelative: String, label: String): Boolean {
        return runCatching {
            val logFile = projectRoot.resolve(logRelative).toFile()
            logFile.parentFile.mkdirs()
            val process = ProcessBuilder(
                "docker",
                "compose",
                "-f",
                composeFile.absolutePathString(),
                "up",
                "-d",
                service,
            )
                .directory(projectRoot.toFile())
                .redirectOutput(Redirect.appendTo(logFile))
                .redirectError(Redirect.appendTo(logFile))
                .start()
            if (!process.waitFor(120, TimeUnit.SECONDS)) {
                process.destroyForcibly()
                println("$label command timed out.")
                false
            } else {
                process.exitValue() == 0
            }
        }.onFailure {
            println("$label command failed: ${it.message}")
        }.getOrDefault(false)
    }

    fun spawnPackage(shipmentId: String, position: GeoPoint) {
        runGazebo("create-package", packageName(shipmentId), position)
    }

    fun movePackage(shipmentId: String, position: GeoPoint) {
        runGazebo("move-package", packageName(shipmentId), position)
    }

    /** Carried package follow (kinematic model); same world as [spawnPackage] via gazebo-sim container. */
    fun moveCargo(shipmentId: String, position: GeoPoint, agentType: AgentType) {
        runGazebo("move-cargo", packageName(shipmentId), position, agentType = agentType)
    }

    /** Restore after backend restart when shipment was in transit (agent may re-acquire on next telemetry). */
    fun pickupVisual(shipmentId: String, position: GeoPoint, agentType: AgentType) {
        runGazebo("pickup-visual", packageName(shipmentId), position, agentType = agentType)
    }

    fun dropVisual(shipmentId: String, position: GeoPoint, agentType: AgentType) {
        runGazebo("drop-visual", packageName(shipmentId), position, agentType = agentType)
    }

    fun removePackage(shipmentId: String, delayMillis: Long = 0L) {
        if (delayMillis <= 0L) {
            runGazebo("remove-model", packageName(shipmentId), GeoPoint(0.0, 0.0, 0.0))
            return
        }
        thread(name = "gazebo-package-removal-$shipmentId", isDaemon = true) {
            Thread.sleep(delayMillis)
            runGazebo("remove-model", packageName(shipmentId), GeoPoint(0.0, 0.0, 0.0))
        }
    }

    fun spawnAgentModel(agentId: String, type: AgentType, position: GeoPoint, model: String? = null) {
        runGazebo(
            action = "create-agent",
            name = agentId,
            position = position,
            model = model ?: defaultAgentModel(type),
        )
    }

    private fun defaultAgentModel(type: AgentType): String =
        when (type) {
            AgentType.UAV -> "x500"
            AgentType.UGV -> "r1_rover"
        }

    fun spawnStation(stationId: String, position: GeoPoint, parkingCapacity: Int = 1, storageCapacity: Int = 1) {
        runGazebo(
            action = "create-station",
            name = stationName(stationId),
            position = position,
            model = "$parkingCapacity,$storageCapacity",
        )
    }

    private fun runGazebo(
        action: String,
        name: String,
        position: GeoPoint,
        model: String = "r1_rover",
        agentType: AgentType? = null,
        waitForCompletion: Boolean = false,
    ) {
        if (!enabled) return

        runCatching {
            val logFile = projectRoot.resolve("build/runtime/gazebo-sim.log").toFile()
            logFile.parentFile.mkdirs()
            val command = mutableListOf(
                "docker",
                "compose",
                "-f",
                composeFile.absolutePathString(),
                "exec",
                "-T",
                "-e",
                "SIM_ORIGIN_LAT=${simOriginLat()}",
                "-e",
                "SIM_ORIGIN_LON=${simOriginLon()}",
                "-e",
                "GZ_WORLD=${gzWorld()}",
                "-e",
                "GZ_PARTITION=${gzPartition()}",
                "gazebo-sim",
                "/workspace/runtime/docker/gazebo-sim.sh",
                action,
                name,
                position.latitude.toString(),
                position.longitude.toString(),
                position.altitudeMeters.toString(),
                model,
            )
            agentType?.let { command.add(it.name) }
            val processBuilder = ProcessBuilder(command)
                .directory(projectRoot.toFile())
                .redirectOutput(Redirect.appendTo(logFile))
                .redirectError(Redirect.appendTo(logFile))

            if (action == "move-package" || action == "move-cargo" ||
                (action == "move-agent" && !waitForCompletion)
            ) {
                processBuilder.start()
            } else {
                synchronized(commandLock) {
                    val process = processBuilder.start()
                    if (!process.waitFor(20, TimeUnit.SECONDS)) {
                        process.destroyForcibly()
                        println("Gazebo simulation command timed out for $action/$name.")
                    }
                }
            }
        }.onFailure {
            println("Gazebo simulation command failed for $action/$name: ${it.message}")
        }
    }

    companion object {
        fun packageName(shipmentId: String): String = "package-${shipmentId.replace(Regex("[^A-Za-z0-9_]"), "_")}"

        fun stationName(stationId: String): String = "station-${stationId.replace(Regex("[^A-Za-z0-9_]"), "_")}"

        fun simOriginLat(): String = System.getenv("SIM_ORIGIN_LAT") ?: "47.397971"
        fun simOriginLon(): String = System.getenv("SIM_ORIGIN_LON") ?: "8.546164"
        fun gzWorld(): String = System.getenv("GZ_WORLD") ?: "default"
        fun gzPartition(): String = System.getenv("GZ_PARTITION") ?: "uav-logistics"

        fun fromEnv(): GazeboSimulationService {
            val projectRoot = Path.of(System.getenv("PROJECT_ROOT") ?: File(".").canonicalPath)
            return GazeboSimulationService(
                enabled = (System.getenv("SIMULATION_GAZEBO_ENABLED") ?: "false").toBoolean(),
                projectRoot = projectRoot,
                startOnBackend = (System.getenv("SIMULATION_GAZEBO_START_ON_BACKEND") ?: "true").toBoolean(),
            )
        }
    }
}
