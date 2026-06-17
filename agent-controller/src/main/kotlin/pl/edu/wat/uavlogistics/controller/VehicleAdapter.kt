package pl.edu.wat.uavlogistics.controller

import kotlinx.coroutines.delay
import pl.edu.wat.uavlogistics.common.AgentType
import pl.edu.wat.uavlogistics.common.GeoPoint
import kotlin.math.max

data class Telemetry(
    val position: GeoPoint,
    val energyLevelPercent: Double,
)

interface VehicleAdapter {
    suspend fun connect()
    suspend fun telemetry(): Telemetry
    suspend fun ensureArmed(): Boolean
    suspend fun executeRoute(route: PlannedRoute, onTelemetry: suspend (Telemetry) -> Unit = {})
    suspend fun moveTo(point: GeoPoint, onTelemetry: suspend (Telemetry) -> Unit = {})
    suspend fun holdOffboardAt(point: GeoPoint, holdMillis: Long, onTelemetry: suspend (Telemetry) -> Unit = {})
    suspend fun disarm()
    suspend fun resetHomeAtCurrentPosition() {}
    suspend fun launch(onTelemetry: suspend (Telemetry) -> Unit = {})
    suspend fun landAtHubParkingPad(padContact: GeoPoint, onTelemetry: suspend (Telemetry) -> Unit = {})
    suspend fun executeUavHubRelocateMission(
        approach: GeoPoint,
        padContact: GeoPoint,
        onTelemetry: suspend (Telemetry) -> Unit = {},
    ): Boolean = false

    suspend fun executeMissionItems(
        items: List<MissionItem>,
        onTelemetry: suspend (Telemetry) -> Unit = {},
    ): Boolean = false
}

class MavsdkVehicleAdapter(
    private val connectionString: String,
    initialPosition: GeoPoint,
    private val agentType: AgentType,
) : VehicleAdapter {
    private val cruiseAltitudeMeters = if (agentType == AgentType.UAV) MIN_UAV_FLIGHT_ALTITUDE_METERS else 0.0
    private val session = MavsdkSession(connectionString, initialPosition, cruiseAltitudeMeters, agentType)

    private suspend fun publishTelemetry(
        onTelemetry: suspend (Telemetry) -> Unit,
        telemetry: Telemetry = session.telemetry(),
    ) {
        onTelemetry(telemetry)
    }

    override suspend fun connect() {
        session.connect()
        val offboardOnly = (System.getenv("SIMULATION_OFFBOARD_ONLY") ?: "false").toBoolean()
        if (offboardOnly) {
            session.disableMissionNavigation("${agentType.name} offboard-only (set SIMULATION_OFFBOARD_ONLY=false for missions)")
        }
        println(
            "PX4 MAVSDK adapter connected through $connectionString " +
                "(nav=${if (session.usesMissionNavigation()) "mission" else "offboard"}).",
        )
    }

    override suspend fun telemetry(): Telemetry = session.telemetry()

    override suspend fun ensureArmed(): Boolean = session.ensureArmed()

    override suspend fun executeRoute(route: PlannedRoute, onTelemetry: suspend (Telemetry) -> Unit) {
        val waypoints = route.waypoints.map { it.withTravelAltitude() }
        if (session.usesMissionNavigation()) {
            val items = MissionBuilders.forRoute(
                agentType,
                waypoints,
                cruiseAltitudeMeters,
                takeoffFrom = session.telemetry().position,
            )
            if (session.executeMission(items) { publishTelemetry(onTelemetry, it) }) return
            println("[${agentType}] Mission execution failed; falling back to offboard setpoints.")
        }
        ensureAtCruiseAltitude(onTelemetry)
        executeRouteOffboard(waypoints, onTelemetry)
    }

    override suspend fun moveTo(point: GeoPoint, onTelemetry: suspend (Telemetry) -> Unit) {
        val contactMove = isPackageContactMove(point)
        val target = if (contactMove) point else point.withTravelAltitude()
        val takeoffFrom = session.telemetry().position
        if (session.usesMissionNavigation()) {
            val items = if (contactMove) {
                MissionBuilders.forContactPoint(
                    agentType,
                    target,
                    cruiseAltitudeMeters,
                    takeoffFrom = takeoffFrom,
                )
            } else {
                MissionBuilders.forPoint(
                    agentType,
                    target,
                    cruiseAltitudeMeters,
                    takeoffFrom = takeoffFrom,
                )
            }
            if (session.executeMission(items) { publishTelemetry(onTelemetry, it) }) return
            println("[${agentType}] Mission execution failed; falling back to offboard setpoints.")
        }
        if (!contactMove) {
            ensureAtCruiseAltitude(onTelemetry)
        }
        moveToOffboard(target, onTelemetry, contactMove)
    }

    private fun isPackageContactMove(point: GeoPoint): Boolean =
        agentType == AgentType.UAV && point.altitudeMeters < cruiseAltitudeMeters

    override suspend fun holdOffboardAt(
        point: GeoPoint,
        holdMillis: Long,
        onTelemetry: suspend (Telemetry) -> Unit,
    ) {
        val holdPoint = point.withTravelAltitude()
        if (agentType == AgentType.UAV) {
            session.startOffboard()
        } else {
            session.startOffboard(raiseToFlightAltitude = false)
        }
        val deadline = System.currentTimeMillis() + holdMillis
        while (System.currentTimeMillis() < deadline) {
            session.sendSetpointHold(holdPoint)
            publishTelemetry(onTelemetry, session.telemetry())
            delay(200)
        }
    }

    override suspend fun disarm() {
        session.disarm()
    }

    override suspend fun resetHomeAtCurrentPosition() {
        session.setHomeToCurrentPosition()
    }

    override suspend fun launch(onTelemetry: suspend (Telemetry) -> Unit) {
        if (agentType != AgentType.UAV) return
        if (!ensureArmed()) {
            println("[${agentType}] Launch aborted: could not arm.")
            return
        }
        if (!session.usesMissionNavigation()) {
            ensureAtCruiseAltitude(onTelemetry)
        }
    }

    override suspend fun landAtHubParkingPad(padContact: GeoPoint, onTelemetry: suspend (Telemetry) -> Unit) {
        if (agentType == AgentType.UGV) {
            if (session.usesMissionNavigation()) {
                val items = MissionBuilders.forHubParking(agentType, padContact, cruiseAltitudeMeters)
                if (session.executeMission(items) { publishTelemetry(onTelemetry, it) }) {
                    return
                }
                println("[${agentType}] Hub parking mission failed (no offboard dock fallback).")
            }
            moveToOffboard(padContact, onTelemetry, contactMove = false)
            resetHomeAtCurrentPosition()
            return
        }
        if (session.usesMissionNavigation()) {
            val items = MissionBuilders.forHubParking(agentType, padContact, cruiseAltitudeMeters)
            if (session.executeMission(items) { publishTelemetry(onTelemetry, it) }) {
                resetHomeAtCurrentPosition()
                return
            }
            println("[${agentType}] Hub parking mission failed; falling back to offboard landing.")
        }
        session.startOffboard(raiseToFlightAltitude = false)
        val cruiseHold = padContact.copy(altitudeMeters = cruiseAltitudeMeters)
        val publish: suspend (Telemetry) -> Unit = { publishTelemetry(onTelemetry, it) }
        if (session.telemetry().position.altitudeMeters > cruiseAltitudeMeters - 1.5) {
            session.flyTo(cruiseHold, publish)
        }
        session.flyTo(
            target = padContact,
            onTelemetry = publish,
            verticalToleranceMeters = 0.6,
            horizontalToleranceDegrees = 0.000015,
        )
        resetHomeAtCurrentPosition()
    }

    override suspend fun executeMissionItems(
        items: List<MissionItem>,
        onTelemetry: suspend (Telemetry) -> Unit,
    ): Boolean {
        if (items.isEmpty()) return true
        if (!session.usesMissionNavigation()) return false
        return session.executeMission(items) { publishTelemetry(onTelemetry, it) }
    }

    override suspend fun executeUavHubRelocateMission(
        approach: GeoPoint,
        padContact: GeoPoint,
        onTelemetry: suspend (Telemetry) -> Unit,
    ): Boolean {
        if (agentType != AgentType.UAV) return false
        val items = MissionBuilders.forUavHubRelocate(
            cruiseWaypoints = listOf(approach.withTravelAltitude()),
            padContact = padContact,
            cruiseAltitudeMeters = cruiseAltitudeMeters,
            takeoffFrom = session.telemetry().position,
        )
        if (!executeMissionItems(items, onTelemetry)) return false
        resetHomeAtCurrentPosition()
        return true
    }

    private suspend fun executeRouteOffboard(waypoints: List<GeoPoint>, onTelemetry: suspend (Telemetry) -> Unit) {
        val publish: suspend (Telemetry) -> Unit = { publishTelemetry(onTelemetry, it) }
        if (agentType == AgentType.UGV) {
            session.startOffboard(raiseToFlightAltitude = false)
            for (waypoint in waypoints) {
                session.driveGroundTo(waypoint, publish)
            }
            return
        }
        session.startOffboard()
        for (waypoint in waypoints) {
            session.flyTo(waypoint, publish)
        }
    }

    private suspend fun moveToOffboard(
        point: GeoPoint,
        onTelemetry: suspend (Telemetry) -> Unit,
        contactMove: Boolean = isPackageContactMove(point),
    ) {
        val publish: suspend (Telemetry) -> Unit = { publishTelemetry(onTelemetry, it) }
        if (agentType == AgentType.UGV) {
            session.startOffboard(raiseToFlightAltitude = false)
            session.driveGroundTo(point, publish)
            return
        }
        if (contactMove) {
            session.startOffboard(raiseToFlightAltitude = false)
            session.flyTo(point, publish)
        } else {
            ensureAtCruiseAltitude(onTelemetry)
            session.startOffboard()
            session.flyTo(point, publish)
        }
    }

    private suspend fun ensureAtCruiseAltitude(onTelemetry: suspend (Telemetry) -> Unit) {
        if (agentType != AgentType.UAV) return
        val current = session.telemetry().position
        if (current.altitudeMeters >= cruiseAltitudeMeters - 1.5) return
        val climbTarget = current.copy(altitudeMeters = cruiseAltitudeMeters)
        println("[${agentType}] Climbing to ${cruiseAltitudeMeters}m before horizontal movement.")
        if (session.usesMissionNavigation()) {
            val items = MissionBuilders.forClimb(agentType, current, cruiseAltitudeMeters)
            if (session.executeMission(items) { publishTelemetry(onTelemetry, it) }) return
            println("[${agentType}] Climb mission failed; falling back to offboard climb.")
        }
        session.startOffboard()
        session.flyTo(climbTarget, onTelemetry = { publishTelemetry(onTelemetry, it) })
    }

    private fun GeoPoint.withTravelAltitude(): GeoPoint =
        if (agentType == AgentType.UGV) {
            copy(altitudeMeters = 0.0)
        } else {
            copy(altitudeMeters = max(altitudeMeters, cruiseAltitudeMeters))
        }

    private companion object {
        const val MIN_UAV_FLIGHT_ALTITUDE_METERS = 20.0
    }
}
