package pl.edu.wat.uavlogistics.controller

import io.mavsdk.System as DroneSystem
import io.mavsdk.mission_raw.MissionRaw
import io.mavsdk.offboard.Offboard
import io.reactivex.disposables.CompositeDisposable
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.rx2.await
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import kotlinx.coroutines.withTimeout
import pl.edu.wat.uavlogistics.common.AgentType
import pl.edu.wat.uavlogistics.common.Geo
import pl.edu.wat.uavlogistics.common.GeoPoint
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min
import java.util.concurrent.atomic.AtomicBoolean

/**
 * PX4 vehicle access via MAVSDK-Java (gRPC to [mavsdk_server]).
 * Mission upload/execution uses MissionRaw; offboard fallback uses the Offboard plugin.
 */
internal class MavsdkSession(
    private val connectionString: String,
    initialPosition: GeoPoint,
    private val cruiseAltitudeMeters: Double,
    private val agentType: AgentType,
    private val targetSystem: Int = (java.lang.System.getenv("PX4_TARGET_SYSTEM") ?: "1").toInt(),
) {
    private var serverProcess: Process? = null
    private lateinit var drone: DroneSystem
    private val disposables = CompositeDisposable()
    @Volatile private var latestTelemetry = Telemetry(initialPosition, 100.0)
    @Volatile private var missionCurrentSeq: Int = 0
    @Volatile private var safetyArmed = false
    @Volatile private var offboardActive = false
    @Volatile internal var missionNavigationDisabled = false

    suspend fun connect() = withContext(Dispatchers.IO) {
        val grpcPort = (java.lang.System.getenv("MAVSDK_GRPC_PORT") ?: "50051").toInt()
        val mavlinkUrl = toMavsdkListenUrl(connectionString)
        startServer(grpcPort, mavlinkUrl)
        drone = DroneSystem("127.0.0.1", grpcPort)
        waitForFirstTelemetry()
        subscribeTelemetry()
        println("MAVSDK connected (mavlink=$mavlinkUrl, grpc=$grpcPort).")
    }

    fun telemetry(): Telemetry = latestTelemetry

    fun isArmed(): Boolean = safetyArmed

    fun missionCurrentSeq(): Int = missionCurrentSeq

    fun usesMissionNavigation(): Boolean =
        !missionNavigationDisabled &&
            (java.lang.System.getenv("AGENT_NAV_MODE") ?: "mission").equals("mission", ignoreCase = true)

    fun disableMissionNavigation(reason: String) {
        if (missionNavigationDisabled) return
        missionNavigationDisabled = true
        println("PX4 mission navigation disabled: $reason")
    }

    suspend fun ensureArmed(timeoutMillis: Long = 90_000): Boolean {
        val deadline = System.currentTimeMillis() + timeoutMillis
        while (System.currentTimeMillis() < deadline) {
            if (safetyArmed) return true
            try {
                drone.action.arm().await()
                return true
            } catch (e: Exception) {
                println("MAVSDK arm attempt failed: ${e.message}")
            }
            delay(500)
        }
        return safetyArmed
    }

    suspend fun disarm() {
        try {
            stopOffboard()
            drone.action.disarm().await()
        } catch (e: Exception) {
            println("MAVSDK disarm failed: ${e.message}")
        }
    }

    suspend fun setHomeToCurrentPosition() {
        println("PX4 DO_SET_HOME via mavlink COMMAND_LONG (current position).")
        try {
            withContext(Dispatchers.IO) {
                MavlinkDoSetHome.setHomeToCurrentPosition(connectionString, targetSystem)
            }
            delay(300)
        } catch (e: Exception) {
            println("MAVSDK DO_SET_HOME failed: ${e.message}")
        }
    }

    suspend fun executeMission(
        items: List<MissionItem>,
        onTelemetry: suspend (Telemetry) -> Unit,
    ): Boolean {
        if (items.isEmpty()) return true
        println("MAVSDK uploading mission with ${items.size} item(s) for $agentType.")
        val rawItems = items.mapIndexed { index, item -> item.toMissionRaw(index) }
        return try {
            drone.missionRaw.clearMission().await()
            drone.missionRaw.uploadMission(rawItems).await()
            println("MAVSDK mission upload accepted (${items.size} items).")
            armWithRetry()
            awaitPostArmSettle("mission start")
            startMissionWithRetry()
            waitForMissionComplete(items, onTelemetry)
            true
        } catch (e: Exception) {
            println("MAVSDK mission failed: ${e.message}")
            false
        }
    }

    suspend fun startOffboard(raiseToFlightAltitude: Boolean = true) {
        val holdPoint = if (raiseToFlightAltitude) {
            latestTelemetry.position.copy(altitudeMeters = cruiseAltitudeMeters)
        } else {
            latestTelemetry.position
        }
        repeat(25) {
            sendOffboardSetpoint(holdPoint, requireActive = false)
            delay(100)
        }
        if (!offboardActive) {
            drone.offboard.start().await()
            offboardActive = true
        }
        try {
            drone.action.arm().await()
        } catch (e: Exception) {
            println("MAVSDK offboard arm failed: ${e.message}")
        }
        repeat(10) {
            sendOffboardSetpoint(holdPoint)
            delay(100)
        }
    }

    suspend fun sendSetpointHold(point: GeoPoint) {
        sendOffboardSetpoint(point)
    }

    suspend fun flyTo(
        target: GeoPoint,
        onTelemetry: suspend (Telemetry) -> Unit,
        verticalToleranceMeters: Double = 3.0,
        horizontalToleranceDegrees: Double = 0.00003,
    ) {
        if (!offboardActive) {
            startOffboard(raiseToFlightAltitude = target.altitudeMeters >= cruiseAltitudeMeters - 1.5)
        }
        val deadline = System.currentTimeMillis() + max(
            45_000L,
            (Geo.distanceMeters(latestTelemetry.position, target) / 5.0 * 1_000).toLong() * 3,
        )
        while (System.currentTimeMillis() < deadline) {
            sendOffboardSetpoint(target)
            onTelemetry(latestTelemetry)
            val current = latestTelemetry.position
            if (abs(current.latitude - target.latitude) < horizontalToleranceDegrees &&
                abs(current.longitude - target.longitude) < horizontalToleranceDegrees &&
                abs(current.altitudeMeters - target.altitudeMeters) < verticalToleranceMeters
            ) {
                println("MAVSDK reached waypoint $target")
                return
            }
            delay(200)
        }
        println("MAVSDK flyTo timeout for $target")
    }

    suspend fun driveGroundTo(target: GeoPoint, onTelemetry: suspend (Telemetry) -> Unit) {
        if (!offboardActive) {
            startOffboard(raiseToFlightAltitude = false)
        }
        val deadline = System.currentTimeMillis() + max(
            30_000L,
            (Geo.distanceMeters(latestTelemetry.position, target) / 2.0 * 1_000).toLong() * 3,
        )
        while (System.currentTimeMillis() < deadline) {
            sendOffboardSetpoint(target.copy(altitudeMeters = 0.0))
            onTelemetry(latestTelemetry)
            if (Geo.distanceMeters(latestTelemetry.position, target) <= 3.0) {
                println("MAVSDK reached ground waypoint $target")
                return
            }
            delay(200)
        }
        println("MAVSDK driveGroundTo timeout for $target")
    }

    fun shutdown() {
        disposables.dispose()
        serverProcess?.destroyForcibly()
        serverProcess = null
    }

    private suspend fun sendOffboardSetpoint(point: GeoPoint, requireActive: Boolean = true) {
        if (requireActive && !offboardActive) return
        try {
            drone.offboard.setPositionGlobal(
                Offboard.PositionGlobalYaw(
                    point.latitude,
                    point.longitude,
                    point.altitudeMeters.toFloat(),
                    0.0f,
                    Offboard.PositionGlobalYaw.AltitudeType.REL_HOME,
                ),
            ).await()
        } catch (e: Exception) {
            println("MAVSDK offboard setpoint failed: ${e.message}")
        }
    }

    private suspend fun awaitPostArmSettle(context: String) {
        val settleMillis = AgentControllerConstants.PX4_POST_ARM_SETTLE_MILLIS
        if (settleMillis <= 0L) return
        println("PX4 $context: waiting ${settleMillis}ms after arm for flight stack to settle.")
        delay(settleMillis)
    }

    private suspend fun armWithRetry(attempts: Int = 6) {
        repeat(attempts) { attempt ->
            try {
                drone.action.arm().await()
                return
            } catch (e: Exception) {
                if (attempt == attempts - 1) throw e
                println("MAVSDK arm retry ${attempt + 1}/$attempts: ${e.message}")
                delay(1_000)
            }
        }
    }

    private suspend fun startMissionWithRetry(attempts: Int = 6) {
        repeat(attempts) { attempt ->
            try {
                drone.missionRaw.startMission().await()
                return
            } catch (e: Exception) {
                if (attempt == attempts - 1) throw e
                println("MAVSDK startMission retry ${attempt + 1}/$attempts: ${e.message}")
                delay(1_000)
            }
        }
    }

    private suspend fun stopOffboard() {
        if (!offboardActive) return
        try {
            drone.offboard.stop().await()
        } catch (_: Exception) {
        } finally {
            offboardActive = false
        }
    }

    private suspend fun waitForMissionComplete(
        items: List<MissionItem>,
        onTelemetry: suspend (Telemetry) -> Unit,
    ) {
        val finalNavigationItem = items.lastOrNull { it.command == MavMissionCmd.NAV_LAND }
            ?: items.lastOrNull { it.command == MavMissionCmd.NAV_WAYPOINT }
            ?: items.last()
        val target = GeoPoint(
            latitude = finalNavigationItem.latitudeDeg,
            longitude = finalNavigationItem.longitudeDeg,
            altitudeMeters = finalNavigationItem.altitudeMeters.toDouble(),
        )
        val configuredAcceptance = when (agentType) {
            AgentType.UAV -> (java.lang.System.getenv("UAV_MISSION_ACCEPTANCE_RADIUS_M") ?: "5").toDouble()
            AgentType.UGV -> (java.lang.System.getenv("ROVER_MISSION_ACCEPTANCE_RADIUS_M") ?: "4").toDouble()
        }
        val acceptance = min(
            configuredAcceptance,
            AgentControllerConstants.PARKING_SLOT_DOCK_RADIUS_METERS,
        )
        val startedAt = System.currentTimeMillis()
        val timeoutMillis = missionExecutionTimeoutMillis(target)
        val finalSeq = items.size - 1
        val initialSeq = missionCurrentSeq
        val requireSeqAdvance = items.size > 1
        println("MAVSDK mission started; waiting for seq $finalSeq at $target (initialSeq=$initialSeq).")

        while (System.currentTimeMillis() - startedAt < timeoutMillis) {
            onTelemetry(latestTelemetry)
            val currentSeq = missionCurrentSeq
            val seqSatisfied = if (requireSeqAdvance) {
                currentSeq >= finalSeq && currentSeq > initialSeq
            } else {
                false
            }
            val current = latestTelemetry.position
            val reachedPosition = Geo.distanceMeters(current, target) <= acceptance &&
                (agentType == AgentType.UGV || abs(current.altitudeMeters - target.altitudeMeters) <= acceptance)
            if (reachedPosition && (!requireSeqAdvance || seqSatisfied)) {
                println("MAVSDK mission complete at $target ($agentType)")
                return
            }
            delay(200)
        }
        println("MAVSDK mission timeout for $target; continuing.")
    }

    private fun missionExecutionTimeoutMillis(target: GeoPoint): Long {
        val base = (java.lang.System.getenv("MISSION_EXECUTION_TIMEOUT_MS") ?: "120000").toLong()
        val travelMs = (Geo.distanceMeters(latestTelemetry.position, target) / 2.0 * 1_000).toLong() * 3
        return max(base, travelMs)
    }

    private fun startServer(grpcPort: Int, mavlinkUrl: String) {
        val bin = java.lang.System.getenv("MAVSDK_SERVER_BIN") ?: "mavsdk_server"
        println("Starting mavsdk_server: $bin -p $grpcPort $mavlinkUrl")
        serverProcess = ProcessBuilder(bin, "-p", grpcPort.toString(), mavlinkUrl)
            .redirectError(ProcessBuilder.Redirect.INHERIT)
            .redirectOutput(ProcessBuilder.Redirect.INHERIT)
            .start()
        Thread.sleep(2_000)
    }

    private suspend fun waitForFirstTelemetry() {
        withTimeout(30_000) {
            suspendCancellableCoroutine { cont ->
                val done = AtomicBoolean(false)
                val disposable = drone.telemetry.position.subscribe(
                    {
                        if (done.compareAndSet(false, true)) {
                            cont.resume(Unit)
                        }
                    },
                    {
                        if (done.compareAndSet(false, true)) {
                            cont.resumeWithException(it)
                        }
                    },
                )
                cont.invokeOnCancellation { disposable.dispose() }
            }
        }
    }

    private fun subscribeTelemetry() {
        disposables.add(
            drone.telemetry.position.subscribe { position ->
                latestTelemetry = latestTelemetry.copy(
                    position = GeoPoint(
                        latitude = position.latitudeDeg,
                        longitude = position.longitudeDeg,
                        altitudeMeters = position.relativeAltitudeM.toDouble(),
                    ),
                )
            },
        )
        disposables.add(
            drone.telemetry.battery.subscribe { battery ->
                latestTelemetry = latestTelemetry.copy(
                    energyLevelPercent = battery.remainingPercent.toDouble(),
                )
            },
        )
        disposables.add(
            drone.telemetry.armed.subscribe { armed ->
                safetyArmed = armed
            },
        )
        disposables.add(
            drone.missionRaw.missionProgress.subscribe { progress ->
                missionCurrentSeq = progress.current.toInt()
            },
        )
    }

    private fun MissionItem.toMissionRaw(seq: Int): MissionRaw.MissionItem =
        MissionRaw.MissionItem(
            seq,
            frame,
            command,
            if (seq == 0) 1 else 0,
            autocontinue,
            param1,
            param2,
            param3,
            param4,
            (latitudeDeg * 10_000_000).toInt(),
            (longitudeDeg * 10_000_000).toInt(),
            altitudeMeters,
            0,
        )

    private companion object {
        fun toMavsdkListenUrl(connectionString: String): String {
            require(connectionString.startsWith("udp://")) {
                "MAVSDK only supports udp:// PX4 connections (got $connectionString)."
            }
            val address = connectionString.removePrefix("udp://")
            val hostPart = address.substringBefore(":", "")
            val port = address.substringAfter(":", "14540")
            return if (hostPart.isBlank() || hostPart == "0.0.0.0") {
                "udpin://0.0.0.0:$port"
            } else {
                "udpin://$hostPart:$port"
            }
        }
    }
}
