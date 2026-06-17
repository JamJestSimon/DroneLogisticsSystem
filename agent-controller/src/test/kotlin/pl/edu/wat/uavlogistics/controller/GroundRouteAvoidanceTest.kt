package pl.edu.wat.uavlogistics.controller

import org.junit.jupiter.api.Test
import pl.edu.wat.uavlogistics.common.AgentStatus
import pl.edu.wat.uavlogistics.common.AgentType
import pl.edu.wat.uavlogistics.common.Geo
import pl.edu.wat.uavlogistics.common.GeoPoint
import pl.edu.wat.uavlogistics.common.TransportAgentDto
import kotlin.test.assertEquals
import kotlin.math.cos
import kotlin.test.assertTrue

class GroundRouteAvoidanceTest {
    private val originLat = 47.397971
    private val originLon = 8.546164

    @Test
    fun `path with no obstacles is direct`() {
        val from = point(0.0, 0.0)
        val to = point(0.0, 30.0)
        val waypoints = GroundRouteAvoidance.pathWaypoints(from, to, emptyList())
        assertEquals(listOf(to), waypoints)
    }

    @Test
    fun `fromAgents can include docked uav and ugv obstacles`() {
        val uav = TransportAgentDto(
            id = "uav-1",
            type = AgentType.UAV,
            position = point(10.0, 0.0),
            energyLevelPercent = 100.0,
            maxRangeMeters = 1_000.0,
            payloadCapacityKg = 5.0,
            status = AgentStatus.AVAILABLE,
        )
        val ugv = TransportAgentDto(
            id = "ugv-1",
            type = AgentType.UGV,
            position = point(20.0, 0.0),
            energyLevelPercent = 100.0,
            maxRangeMeters = 1_000.0,
            payloadCapacityKg = 20.0,
            status = AgentStatus.BUSY,
        )
        val obstacles = GroundRouteAvoidance.fromAgents("self", listOf(uav, ugv), excludeDocked = false)
        assertEquals(2, obstacles.size)
    }

    @Test
    fun `path inserts detour around obstacle on segment`() {
        val from = point(0.0, 0.0)
        val to = point(0.0, 40.0)
        val obstacle = GroundObstacle(point(0.0, 20.0), radiusMeters = 3.0)
        val waypoints = GroundRouteAvoidance.pathWaypoints(from, to, listOf(obstacle))
        assertEquals(2, waypoints.size)
        val detour = waypoints.first()
        assertTrue(Geo.distanceMeters(detour, obstacle.center) > 4.0)
        assertEquals(to, waypoints.last())
    }

    private fun point(eastMeters: Double, northMeters: Double): GeoPoint {
        val earthRadiusMeters = 6_371_000.0
        val latRadians = Math.toRadians(originLat)
        val latitude = originLat + Math.toDegrees(northMeters / earthRadiusMeters)
        val longitude = originLon + Math.toDegrees(eastMeters / (earthRadiusMeters * cos(latRadians)))
        return GeoPoint(latitude, longitude, 0.0)
    }
}
