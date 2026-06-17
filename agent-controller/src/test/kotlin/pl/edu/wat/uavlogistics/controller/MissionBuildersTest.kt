package pl.edu.wat.uavlogistics.controller

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import pl.edu.wat.uavlogistics.common.AgentType
import pl.edu.wat.uavlogistics.common.GeoPoint

class MissionBuildersTest {
    @Test
    fun `contact mission descends to package altitude`() {
        val contact = GeoPoint(47.397971, 8.5435, 0.8)
        val items = MissionBuilders.forContactPoint(AgentType.UAV, contact, cruiseAltitudeMeters = 20.0)

        assertEquals(2, items.size)
        assertEquals(MavMissionCmd.NAV_WAYPOINT, items[0].command)
        assertEquals(20.0f, items[0].altitudeMeters)
        assertEquals(MavMissionCmd.NAV_LAND, items[1].command)
        assertEquals(0.8f, items[1].altitudeMeters)
    }

    @Test
    fun `uav hub parking mission lands at pad`() {
        val pad = GeoPoint(47.397971, 8.54725, 0.0)
        val items = MissionBuilders.forHubParking(AgentType.UAV, pad, cruiseAltitudeMeters = 20.0)

        assertEquals(MavMissionCmd.NAV_LAND, items.last().command)
        assert(items.none { it.command == MavMissionCmd.DO_SET_HOME })
    }

    @Test
    fun `uav package pickup mission cruises then lands`() {
        val cruise = GeoPoint(47.397971, 8.5435, 20.0)
        val contact = GeoPoint(47.397971, 8.5435, 0.8)
        val items = MissionBuilders.forUavPackagePickupMission(
            cruiseHold = cruise,
            contact = contact,
            cruiseAltitudeMeters = 20.0,
            takeoffFrom = GeoPoint(47.397971, 8.5435, 0.0),
        )
        assertEquals(MavMissionCmd.NAV_TAKEOFF, items.first().command)
        assertEquals(MavMissionCmd.NAV_LAND, items.last().command)
    }

    @Test
    fun `uav package delivery mission cruises then lands without set home`() {
        val cruise = GeoPoint(47.397971, 8.5440, 20.0)
        val contact = GeoPoint(47.397971, 8.5440, 0.8)
        val items = MissionBuilders.forUavPackageDeliveryMission(
            cruiseHold = cruise,
            contact = contact,
            cruiseAltitudeMeters = 20.0,
            takeoffFrom = contact,
        )
        assertEquals(MavMissionCmd.NAV_TAKEOFF, items.first().command)
        assertEquals(MavMissionCmd.NAV_LAND, items.last().command)
        assert(items.none { it.command == MavMissionCmd.DO_SET_HOME })
    }

    @Test
    fun `uav route includes takeoff when starting on the ground`() {
        val waypoint = GeoPoint(47.397971, 8.5435, 0.0)
        val items = MissionBuilders.forRoute(
            AgentType.UAV,
            listOf(waypoint),
            cruiseAltitudeMeters = 20.0,
            takeoffFrom = GeoPoint(47.397971, 8.5435, 0.0),
        )
        assertEquals(MavMissionCmd.NAV_TAKEOFF, items.first().command)
        assertEquals(MavMissionCmd.NAV_WAYPOINT, items.last().command)
    }

    @Test
    fun `ugv package pickup mission is waypoints only without set home`() {
        val contact = GeoPoint(47.397971, 8.549485, 0.0)
        val via = GeoPoint(47.397971, 8.5480, 0.0)
        val items = MissionBuilders.forUgvPackagePickupMission(listOf(via), contact)

        assertEquals(2, items.size)
        assert(items.all { it.command == MavMissionCmd.NAV_WAYPOINT })
        assert(items.none { it.command == MavMissionCmd.DO_SET_HOME })
        assertEquals(contact.latitude, items.last().latitudeDeg, 1e-6)
    }

    @Test
    fun `ugv package return mission ends at pad waypoint`() {
        val pad = GeoPoint(47.397971, 8.54725, 0.0)
        val items = MissionBuilders.forUgvPackageReturnMission(emptyList(), pad)

        assertEquals(MavMissionCmd.NAV_WAYPOINT, items.first().command)
        assertEquals(MavMissionCmd.NAV_WAYPOINT, items.last().command)
        assert(items.none { it.command == MavMissionCmd.DO_SET_HOME })
    }

    @Test
    fun `ugv hub parking mission is waypoints only`() {
        val pad = GeoPoint(47.397971, 8.54725, 0.0)
        val items = MissionBuilders.forHubParking(AgentType.UGV, pad, cruiseAltitudeMeters = 20.0)

        assertEquals(1, items.size)
        assertEquals(MavMissionCmd.NAV_WAYPOINT, items[0].command)
        assert(items.none { it.command == MavMissionCmd.DO_SET_HOME })
    }

    @Test
    fun `cruise route keeps minimum flight altitude`() {
        val waypoint = GeoPoint(47.397971, 8.5435, 0.8)
        val items = MissionBuilders.forRoute(AgentType.UAV, listOf(waypoint), cruiseAltitudeMeters = 20.0)

        val navWaypoint = items.last { it.command == MavMissionCmd.NAV_WAYPOINT }
        assertEquals(20.0f, navWaypoint.altitudeMeters)
    }
}
