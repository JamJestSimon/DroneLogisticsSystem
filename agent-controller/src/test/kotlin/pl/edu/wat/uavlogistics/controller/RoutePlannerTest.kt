package pl.edu.wat.uavlogistics.controller

import org.junit.jupiter.api.Test
import pl.edu.wat.uavlogistics.common.AgentStatus
import pl.edu.wat.uavlogistics.common.AgentType
import pl.edu.wat.uavlogistics.common.GeoPoint
import pl.edu.wat.uavlogistics.common.TransportAgentDto
import pl.edu.wat.uavlogistics.common.TransportTaskDto
import pl.edu.wat.uavlogistics.common.TransportTaskStatus
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue

class RoutePlannerTest {
    @Test
    fun `planner rejects tasks outside energy reserve`() {
        val planner = RoutePlanner()
        val agent = agent(energy = 5.0)
        val task = task()

        assertNull(planner.feasibleCandidate(agent, task))
    }

    @Test
    fun `uav planToPoint inserts detour around peer obstacle`() {
        val planner = RoutePlanner()
        val agent = agent(energy = 100.0).copy(
            position = GeoPoint(47.397971, 8.546164, 20.0),
        )
        val target = GeoPoint(47.397971, 8.546664, 20.0)
        val peer = GroundObstacle(
            center = GeoPoint(47.397971, 8.546414, 0.0),
            radiusMeters = 4.0,
        )
        val route = planner.planToPoint(agent, target, listOf(peer))
        assertTrue(route.waypoints.size >= 2)
        assertEquals(target, route.waypoints.last())
    }

    @Test
    fun `planner accepts feasible task`() {
        val planner = RoutePlanner()
        val agent = agent(energy = 100.0)
        val task = task()

        assertNotNull(planner.feasibleCandidate(agent, task))
    }

    private fun agent(energy: Double) = TransportAgentDto(
        id = "uav-1",
        type = AgentType.UAV,
        position = GeoPoint(52.253, 21.034, 80.0),
        energyLevelPercent = energy,
        maxRangeMeters = 10_000.0,
        payloadCapacityKg = 5.0,
        status = AgentStatus.AVAILABLE,
    )

    private fun task() = TransportTaskDto(
        id = "task-1",
        shipmentId = "shipment-1",
        startPoint = GeoPoint(52.253, 21.034, 80.0),
        endPoint = GeoPoint(52.254, 21.035, 80.0),
        status = TransportTaskStatus.AVAILABLE,
    )
}
