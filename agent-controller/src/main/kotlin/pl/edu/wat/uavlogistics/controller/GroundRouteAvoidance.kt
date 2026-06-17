package pl.edu.wat.uavlogistics.controller

import pl.edu.wat.uavlogistics.common.AgentStatus
import pl.edu.wat.uavlogistics.common.AgentType
import pl.edu.wat.uavlogistics.common.Geo
import pl.edu.wat.uavlogistics.common.GeoPoint
import pl.edu.wat.uavlogistics.common.TransportAgentDto
import kotlin.math.cos
import kotlin.math.max
import kotlin.math.sqrt

data class GroundObstacle(
    val center: GeoPoint,
    val radiusMeters: Double,
)

object GroundRouteAvoidance {
    fun enabled(): Boolean =
        (System.getenv("GROUND_OBSTACLE_AVOIDANCE") ?: "true").equals("true", ignoreCase = true)

    fun clearanceMeters(): Double =
        (System.getenv("GROUND_OBSTACLE_CLEARANCE_M") ?: "1.5").toDouble()

    fun uavObstacleRadiusMeters(): Double =
        (System.getenv("GROUND_OBSTACLE_UAV_RADIUS_M") ?: "4.0").toDouble()

    fun ugvObstacleRadiusMeters(): Double =
        (System.getenv("GROUND_OBSTACLE_UGV_RADIUS_M") ?: "2.5").toDouble()

    fun minDetourOffsetMeters(): Double =
        (System.getenv("GROUND_OBSTACLE_MIN_DETOUR_M") ?: "5.0").toDouble()

    fun excludeDockedAgents(): Boolean =
        (System.getenv("GROUND_OBSTACLE_EXCLUDE_DOCKED") ?: "true").equals("true", ignoreCase = true)

    fun fromAgents(
        selfId: String,
        agents: List<TransportAgentDto>,
        excludeDocked: Boolean = excludeDockedAgents(),
    ): List<GroundObstacle> =
        agents
            .asSequence()
            .filter { it.id != selfId }
            .filter { it.status in BLOCKING_STATUSES }
            .filter { agent -> !excludeDocked || agent.currentStationId == null }
            .map { agent ->
                GroundObstacle(
                    center = agent.position.copy(altitudeMeters = 0.0),
                    radiusMeters = when (agent.type) {
                        AgentType.UAV -> uavObstacleRadiusMeters()
                        AgentType.UGV -> ugvObstacleRadiusMeters()
                    },
                )
            }
            .toList()

    /**
     * Returns intermediate waypoints between [from] and [to] (excluding [from], including [to]).
     */
    fun pathWaypoints(from: GeoPoint, to: GeoPoint, obstacles: List<GroundObstacle>): List<GeoPoint> {
        if (obstacles.isEmpty()) return listOf(to)

        var segments = listOf(from to to)
        val clearance = clearanceMeters()
        val minDetour = minDetourOffsetMeters()

        for (obstacle in obstacles.sortedBy { Geo.distanceMeters(from, it.center) }) {
            val expanded = mutableListOf<Pair<GeoPoint, GeoPoint>>()
            for ((start, end) in segments) {
                if (segmentBlocked(start, end, obstacle, clearance)) {
                    val detour = detourPoint(start, end, obstacle, clearance, minDetour)
                    expanded += start to detour
                    expanded += detour to end
                } else {
                    expanded += start to end
                }
            }
            segments = expanded
        }

        val waypoints = mutableListOf<GeoPoint>()
        for ((_, end) in segments) {
            if (waypoints.isEmpty() || waypoints.last() != end) {
                waypoints += end
            }
        }
        return if (waypoints.isEmpty()) listOf(to) else waypoints
    }

    private fun segmentBlocked(
        from: GeoPoint,
        to: GeoPoint,
        obstacle: GroundObstacle,
        clearanceMeters: Double,
    ): Boolean {
        val frame = LocalEnuFrame(from.latitude, from.longitude)
        val start = frame.toLocal(from)
        val end = frame.toLocal(to)
        val center = frame.toLocal(obstacle.center)
        val combinedRadius = obstacle.radiusMeters + clearanceMeters
        return distancePointToSegmentMeters(center, start, end) < combinedRadius
    }

    private fun detourPoint(
        from: GeoPoint,
        to: GeoPoint,
        obstacle: GroundObstacle,
        clearanceMeters: Double,
        minDetourMeters: Double,
    ): GeoPoint {
        val frame = LocalEnuFrame(from.latitude, from.longitude)
        val start = frame.toLocal(from)
        val end = frame.toLocal(to)
        val center = frame.toLocal(obstacle.center)
        val delta = end - start
        val length = delta.length().coerceAtLeast(0.5)
        val along = ((center.east - start.east) * delta.east + (center.north - start.north) * delta.north) / (length * length)
        val t = along.coerceIn(0.05, 0.95)
        val closest = start + delta * t
        val toCenter = center - closest
        val combinedRadius = obstacle.radiusMeters + clearanceMeters
        val offset = max(minDetourMeters, combinedRadius + 1.0)
        val perp = if (toCenter.length() > 0.2) {
            val right = LocalEnu(-delta.north, delta.east).normalized()
            val side = if (right.dot(toCenter) >= 0.0) 1.0 else -1.0
            right * side
        } else {
            LocalEnu(-delta.north, delta.east).normalized()
        }
        val detour = closest + perp * offset
        return frame.toGeo(detour.east, detour.north)
    }

    private fun distancePointToSegmentMeters(point: LocalEnu, start: LocalEnu, end: LocalEnu): Double {
        val delta = end - start
        val lengthSq = delta.length().let { it * it }
        val t = if (lengthSq < 1e-6) {
            0.0
        } else {
            ((point.east - start.east) * delta.east + (point.north - start.north) * delta.north) / lengthSq
        }.coerceIn(0.0, 1.0)
        val closest = start + delta * t
        return (point - closest).length()
    }

    private val BLOCKING_STATUSES = setOf(
        AgentStatus.ARMING,
        AgentStatus.AVAILABLE,
        AgentStatus.BUSY,
        AgentStatus.CHARGING,
    )
}

private data class LocalEnu(val east: Double, val north: Double) {
    fun length(): Double = sqrt(east * east + north * north)

    fun normalized(): LocalEnu {
        val len = length()
        return if (len < 1e-6) this else LocalEnu(east / len, north / len)
    }

    fun dot(other: LocalEnu): Double = east * other.east + north * other.north

    operator fun plus(other: LocalEnu): LocalEnu = LocalEnu(east + other.east, north + other.north)

    operator fun minus(other: LocalEnu): LocalEnu = LocalEnu(east - other.east, north - other.north)

    operator fun times(scale: Double): LocalEnu = LocalEnu(east * scale, north * scale)
}

private class LocalEnuFrame(
    private val originLat: Double,
    private val originLon: Double,
) {
    private val earthRadiusMeters = 6_371_000.0
    private val latRadians = Math.toRadians(originLat)

    fun toLocal(point: GeoPoint): LocalEnu {
        val east = Math.toRadians(point.longitude - originLon) * earthRadiusMeters * cos(latRadians)
        val north = Math.toRadians(point.latitude - originLat) * earthRadiusMeters
        return LocalEnu(east, north)
    }

    fun toGeo(east: Double, north: Double): GeoPoint {
        val latitude = originLat + Math.toDegrees(north / earthRadiusMeters)
        val longitude = originLon + Math.toDegrees(east / (earthRadiusMeters * cos(latRadians)))
        return GeoPoint(latitude, longitude, 0.0)
    }
}
