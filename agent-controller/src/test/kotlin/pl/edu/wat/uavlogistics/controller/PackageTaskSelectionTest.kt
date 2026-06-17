package pl.edu.wat.uavlogistics.controller

import org.junit.jupiter.api.Test
import pl.edu.wat.uavlogistics.common.AgentStatus
import pl.edu.wat.uavlogistics.common.AgentType
import pl.edu.wat.uavlogistics.common.GeoPoint
import pl.edu.wat.uavlogistics.common.TransportAgentDto
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class PackageTaskSelectionTest {
    private companion object {
        const val UAV_FAR = "20000000-0000-4000-8000-000000000101"
        const val UAV_NEAR = "20000000-0000-4000-8000-000000000102"
        const val UAV_1 = "20000000-0000-4000-8000-000000000001"
        const val UGV_1 = "21000000-0000-4000-8000-000000000001"
    }

    @Test
    fun `closer eligible peer blocks task`() {
        val pickup = GeoPoint(52.0, 21.0, 0.0)
        val me = agent(UAV_FAR, AgentType.UAV, 52.1, 21.0)
        val peer = agent(UAV_NEAR, AgentType.UAV, 52.001, 21.0)
        assertFalse(isClosestEligibleForPickup(me, pickup, requiredAgentType = null, peers = listOf(me, peer)))
    }

    @Test
    fun `ugv-only task ignores uav peers`() {
        val pickup = GeoPoint(52.0, 21.0, 0.0)
        val me = agent(UGV_1, AgentType.UGV, 52.1, 21.0)
        val uav = agent(UAV_1, AgentType.UAV, 52.0, 21.0)
        assertTrue(isClosestEligibleForPickup(me, pickup, requiredAgentType = AgentType.UGV, peers = listOf(me, uav)))
    }

    @Test
    fun `ugv yields open package to equidistant uav`() {
        val pickup = GeoPoint(52.0, 21.0, 0.0)
        val ugv = agent(UGV_1, AgentType.UGV, 52.01, 21.0)
        val uav = agent(UAV_1, AgentType.UAV, 52.01, 21.0)
        assertFalse(isClosestEligibleForPickup(ugv, pickup, requiredAgentType = null, peers = listOf(ugv, uav)))
        assertTrue(isClosestEligibleForPickup(uav, pickup, requiredAgentType = null, peers = listOf(ugv, uav)))
    }

    @Test
    fun `ugv yields open package to closer uav`() {
        val pickup = GeoPoint(52.0, 21.0, 0.0)
        val ugv = agent(UGV_1, AgentType.UGV, 52.05, 21.0)
        val uav = agent(UAV_1, AgentType.UAV, 52.01, 21.0)
        assertFalse(isClosestEligibleForPickup(ugv, pickup, requiredAgentType = null, peers = listOf(ugv, uav)))
    }

    private fun agent(id: String, type: AgentType, lat: Double, lon: Double) = TransportAgentDto(
        id = id,
        type = type,
        position = GeoPoint(lat, lon, 0.0),
        energyLevelPercent = 100.0,
        maxRangeMeters = 10_000.0,
        payloadCapacityKg = 5.0,
        status = AgentStatus.AVAILABLE,
    )
}
