package pl.edu.wat.uavlogistics.controller

import pl.edu.wat.uavlogistics.common.AgentType
import pl.edu.wat.uavlogistics.common.Geo
import pl.edu.wat.uavlogistics.common.GeoPoint
import kotlin.math.max
import kotlin.math.min

data class MissionItem(
    val command: Int,
    val frame: Int,
    val latitudeDeg: Double,
    val longitudeDeg: Double,
    val altitudeMeters: Float,
    val param1: Float = 0f,
    val param2: Float = 0f,
    val param3: Float = 0f,
    val param4: Float = 0f,
    val autocontinue: Int = 1,
    val current: Int = 0,
)

object MavMissionCmd {
    const val NAV_WAYPOINT = 16
    const val NAV_LAND = 21
    const val NAV_TAKEOFF = 22
    const val DO_CHANGE_SPEED = 178
    const val MISSION_CLEAR_ALL = 45
    const val DO_SET_MODE = 176
    const val COMPONENT_ARM_DISARM = 400
    const val MISSION_START = 300
    /** PX4: param1=1 uses the vehicle position at execution time as the new home/RTL point. */
    const val DO_SET_HOME = 179
}

object MavFrame {
    const val GLOBAL = 0
    const val GLOBAL_RELATIVE_ALT = 3
    const val GLOBAL_RELATIVE_ALT_INT = 6
}

object MavMissionAck {
    const val ACCEPTED = 0
}

object MissionBuilders {
    fun forRoute(
        agentType: AgentType,
        waypoints: List<GeoPoint>,
        cruiseAltitudeMeters: Double,
        takeoffFrom: GeoPoint? = null,
    ): List<MissionItem> =
        when (agentType) {
            AgentType.UAV -> uavRoute(waypoints, cruiseAltitudeMeters, takeoffFrom)
            AgentType.UGV -> ugvRoute(waypoints)
        }

    fun forPoint(
        agentType: AgentType,
        point: GeoPoint,
        cruiseAltitudeMeters: Double,
        takeoffFrom: GeoPoint? = null,
    ): List<MissionItem> =
        when (agentType) {
            AgentType.UAV -> forRoute(agentType, listOf(point), cruiseAltitudeMeters, takeoffFrom)
            AgentType.UGV -> ugvParkingMission(listOf(point))
        }

    fun forClimb(agentType: AgentType, position: GeoPoint, cruiseAltitudeMeters: Double): List<MissionItem> =
        when (agentType) {
            AgentType.UAV -> listOf(
                MissionItem(
                    command = MavMissionCmd.NAV_TAKEOFF,
                    frame = MavFrame.GLOBAL_RELATIVE_ALT_INT,
                    latitudeDeg = position.latitude,
                    longitudeDeg = position.longitude,
                    altitudeMeters = cruiseAltitudeMeters.toFloat(),
                ),
            )
            AgentType.UGV -> emptyList()
        }

    /** Descend to package/station contact; takeoff is included in-mission when [takeoffFrom] is still on the ground. */
    fun forContactPoint(
        agentType: AgentType,
        point: GeoPoint,
        cruiseAltitudeMeters: Double,
        takeoffFrom: GeoPoint? = null,
    ): List<MissionItem> =
        when (agentType) {
            AgentType.UAV -> uavContactApproach(point, cruiseAltitudeMeters, takeoffFrom)
            AgentType.UGV -> ugvRoute(listOf(point))
        }

    /** Cruise to pad, land, and set home so RTL/failsafe stays at the docked pad. */
    fun forHubParking(agentType: AgentType, padContact: GeoPoint, cruiseAltitudeMeters: Double): List<MissionItem> =
        when (agentType) {
            AgentType.UAV -> uavTerminalParkingMission(padContact, cruiseAltitudeMeters, takeoffFrom = null)
            AgentType.UGV -> ugvParkingMission(listOf(padContact))
        }

    /**
     * UAV relocation/staging/rebalance: takeoff (if needed), cruise waypoint(s), land at pad, set home.
     * [takeoffFrom] and first cruise leg may be the same point when already airborne at cruise.
     */
    fun forUavHubRelocate(
        cruiseWaypoints: List<GeoPoint>,
        padContact: GeoPoint,
        cruiseAltitudeMeters: Double,
        takeoffFrom: GeoPoint?,
    ): List<MissionItem> =
        mergeUavCruiseAndContact(
            uavRoute(cruiseWaypoints, cruiseAltitudeMeters, takeoffFrom),
            uavContactApproach(padContact, cruiseAltitudeMeters, takeoffFrom = null),
        )

    /** Mission 1: takeoff (if needed), cruise over pickup, descend to package. */
    fun forUavPackagePickupMission(
        cruiseHold: GeoPoint,
        contact: GeoPoint,
        cruiseAltitudeMeters: Double,
        takeoffFrom: GeoPoint?,
    ): List<MissionItem> =
        mergeUavCruiseAndContact(
            uavRoute(listOf(cruiseHold), cruiseAltitudeMeters, takeoffFrom),
            uavContactApproach(contact, cruiseAltitudeMeters, takeoffFrom = null),
        )

    /** Mission 2: takeoff from ground, cruise to storage approach, descend to drop slot. */
    fun forUavPackageDeliveryMission(
        cruiseHold: GeoPoint,
        contact: GeoPoint,
        cruiseAltitudeMeters: Double,
        takeoffFrom: GeoPoint?,
    ): List<MissionItem> =
        mergeUavCruiseAndContact(
            uavRoute(listOf(cruiseHold), cruiseAltitudeMeters, takeoffFrom),
            uavContactApproach(contact, cruiseAltitudeMeters, takeoffFrom = null),
        )

    /** Mission 3: takeoff, cruise to parking approach, land, set home. */
    fun forUavPackageReturnMission(
        cruiseHold: GeoPoint,
        padContact: GeoPoint,
        cruiseAltitudeMeters: Double,
        takeoffFrom: GeoPoint?,
    ): List<MissionItem> = forUavHubRelocate(
        cruiseWaypoints = listOf(cruiseHold),
        padContact = padContact,
        cruiseAltitudeMeters = cruiseAltitudeMeters,
        takeoffFrom = takeoffFrom,
    )

    /** Mission 1: planner route to package contact (no set home). */
    fun forUgvPackagePickupMission(plannedWaypoints: List<GeoPoint>, contact: GeoPoint): List<MissionItem> =
        ugvPackageLegMission(plannedWaypoints, contact)

    /** Mission 2: planner route to storage drop contact (no set home). */
    fun forUgvPackageDeliveryMission(plannedWaypoints: List<GeoPoint>, contact: GeoPoint): List<MissionItem> =
        ugvPackageLegMission(plannedWaypoints, contact)

    /** Mission 3: planner route to parking pad, then set home. */
    fun forUgvPackageReturnMission(plannedWaypoints: List<GeoPoint>, padContact: GeoPoint): List<MissionItem> =
        forUgvHubParkingMission(plannedWaypoints, padContact)

    /**
     * UGV hub staging/rebalance/return: planner waypoints then terminal NAV_WAYPOINT at [padContact]
     * (reserved slot geolocation) and DO_SET_HOME.
     */
    fun forUgvHubParkingMission(plannedWaypoints: List<GeoPoint>, padContact: GeoPoint): List<MissionItem> =
        ugvParkingMission(ugvPackageLegWaypoints(plannedWaypoints, padContact))

    private fun ugvPackageLegMission(plannedWaypoints: List<GeoPoint>, contact: GeoPoint): List<MissionItem> {
        val leg = ugvPackageLegWaypoints(plannedWaypoints, contact)
        return if (leg.isEmpty()) emptyList() else ugvRoute(leg)
    }

    private fun ugvPackageLegWaypoints(plannedWaypoints: List<GeoPoint>, contact: GeoPoint): List<GeoPoint> {
        if (plannedWaypoints.isEmpty()) {
            return listOf(contact)
        }
        val last = plannedWaypoints.last()
        return if (Geo.distanceMeters(last, contact) <= 2.0) {
            plannedWaypoints.dropLast(1) + contact
        } else {
            plannedWaypoints + contact
        }
    }

    private fun uavContactApproach(
        point: GeoPoint,
        cruiseAltitudeMeters: Double,
        takeoffFrom: GeoPoint?,
    ): List<MissionItem> {
        val acceptance = waypointAcceptanceMeters(AgentType.UAV)
        val landRadius = landAcceptanceMeters(AgentType.UAV)
        val cruiseAlt = cruiseAltitudeMeters.toFloat()
        val contactAlt = point.altitudeMeters
            .coerceIn(MIN_PACKAGE_CONTACT_ALTITUDE_METERS, cruiseAltitudeMeters)
            .toFloat()
        val items = mutableListOf<MissionItem>()
        appendUavTakeoffIfNeeded(items, takeoffFrom, cruiseAltitudeMeters)
        if (contactAlt < cruiseAlt - 0.5f) {
            items.add(
                MissionItem(
                    command = MavMissionCmd.NAV_WAYPOINT,
                    frame = MavFrame.GLOBAL_RELATIVE_ALT_INT,
                    latitudeDeg = point.latitude,
                    longitudeDeg = point.longitude,
                    altitudeMeters = cruiseAlt,
                    param2 = acceptance,
                ),
            )
        }
        if (precisionLandingEnabled(AgentType.UAV)) {
            items.add(
                MissionItem(
                    command = MavMissionCmd.NAV_LAND,
                    frame = MavFrame.GLOBAL_RELATIVE_ALT_INT,
                    latitudeDeg = point.latitude,
                    longitudeDeg = point.longitude,
                    altitudeMeters = contactAlt,
                    param2 = landRadius,
                ),
            )
        } else {
            items.add(
                MissionItem(
                    command = MavMissionCmd.NAV_WAYPOINT,
                    frame = MavFrame.GLOBAL_RELATIVE_ALT_INT,
                    latitudeDeg = point.latitude,
                    longitudeDeg = point.longitude,
                    altitudeMeters = contactAlt,
                    param2 = acceptance,
                ),
            )
        }
        return items
    }

    private fun uavRoute(
        waypoints: List<GeoPoint>,
        cruiseAltitudeMeters: Double,
        takeoffFrom: GeoPoint?,
    ): List<MissionItem> {
        if (waypoints.isEmpty()) return emptyList()
        val acceptance = waypointAcceptanceMeters(AgentType.UAV)
        val cruiseAlt = cruiseAltitudeMeters.toFloat()
        val items = mutableListOf<MissionItem>()
        appendUavTakeoffIfNeeded(items, takeoffFrom ?: waypoints.first(), cruiseAltitudeMeters)
        for (waypoint in waypoints) {
            val altitude = max(waypoint.altitudeMeters, cruiseAltitudeMeters).toFloat()
            items.add(
                MissionItem(
                    command = MavMissionCmd.NAV_WAYPOINT,
                    frame = MavFrame.GLOBAL_RELATIVE_ALT_INT,
                    latitudeDeg = waypoint.latitude,
                    longitudeDeg = waypoint.longitude,
                    altitudeMeters = altitude,
                    param2 = acceptance,
                ),
            )
        }
        return items
    }

    private fun ugvRoute(waypoints: List<GeoPoint>): List<MissionItem> {
        val acceptance = waypointAcceptanceMeters(AgentType.UGV)
        val terminalAcceptance = min(
            acceptance,
            AgentControllerConstants.PARKING_SLOT_DOCK_RADIUS_METERS.toFloat() - 0.25f,
        )
        val speed = (System.getenv("ROVER_MISSION_SPEED_MPS") ?: "1.5").toFloat()
        return waypoints.mapIndexed { index, waypoint ->
            MissionItem(
                command = MavMissionCmd.NAV_WAYPOINT,
                frame = MavFrame.GLOBAL_RELATIVE_ALT_INT,
                latitudeDeg = waypoint.latitude,
                longitudeDeg = waypoint.longitude,
                altitudeMeters = 0f,
                param2 = if (index == waypoints.lastIndex) terminalAcceptance else acceptance,
                param4 = if (index == 0) speed else 0f,
            )
        }
    }

    /** Terminal hub parking: drive to pad(s). Home is set after the mission via mavlink command. */
    private fun ugvParkingMission(waypoints: List<GeoPoint>): List<MissionItem> {
        if (waypoints.isEmpty()) return emptyList()
        return ugvRoute(waypoints)
    }

    private fun uavTerminalParkingMission(
        padContact: GeoPoint,
        cruiseAltitudeMeters: Double,
        takeoffFrom: GeoPoint?,
    ): List<MissionItem> =
        uavContactApproach(padContact, cruiseAltitudeMeters, takeoffFrom)

    private fun appendUavTakeoffIfNeeded(
        items: MutableList<MissionItem>,
        takeoffFrom: GeoPoint?,
        cruiseAltitudeMeters: Double,
    ) {
        val from = takeoffFrom ?: return
        if (from.altitudeMeters >= cruiseAltitudeMeters - 1.5) return
        items.add(
            MissionItem(
                command = MavMissionCmd.NAV_TAKEOFF,
                frame = MavFrame.GLOBAL_RELATIVE_ALT_INT,
                latitudeDeg = from.latitude,
                longitudeDeg = from.longitude,
                altitudeMeters = cruiseAltitudeMeters.toFloat(),
            ),
        )
    }

    private fun mergeUavCruiseAndContact(
        cruiseItems: List<MissionItem>,
        contactItems: List<MissionItem>,
    ): List<MissionItem> {
        if (cruiseItems.isEmpty()) return contactItems
        if (contactItems.isEmpty()) return cruiseItems
        val merged = cruiseItems.toMutableList()
        val firstContactNav = contactItems.firstOrNull { it.command == MavMissionCmd.NAV_WAYPOINT }
        val lastCruiseNav = merged.lastOrNull { it.command == MavMissionCmd.NAV_WAYPOINT }
        if (firstContactNav != null && lastCruiseNav != null &&
            lastCruiseNav.latitudeDeg == firstContactNav.latitudeDeg &&
            lastCruiseNav.longitudeDeg == firstContactNav.longitudeDeg
        ) {
            val dropIndex = merged.indexOfLast { it.command == MavMissionCmd.NAV_WAYPOINT }
            if (dropIndex >= 0) merged.removeAt(dropIndex)
        }
        val contactWithoutDuplicateTakeoff = contactItems.dropWhile { it.command == MavMissionCmd.NAV_TAKEOFF }
        merged.addAll(contactWithoutDuplicateTakeoff)
        return merged
    }

    private fun waypointAcceptanceMeters(agentType: AgentType): Float =
        when (agentType) {
            AgentType.UAV -> (System.getenv("UAV_MISSION_ACCEPTANCE_RADIUS_M") ?: "5").toFloat()
            AgentType.UGV -> (System.getenv("ROVER_MISSION_ACCEPTANCE_RADIUS_M") ?: "4").toFloat()
        }

    private fun landAcceptanceMeters(agentType: AgentType): Float =
        when (agentType) {
            AgentType.UAV -> (System.getenv("UAV_LAND_ACCEPTANCE_RADIUS_M") ?: "2").toFloat()
            AgentType.UGV -> (System.getenv("ROVER_MISSION_ACCEPTANCE_RADIUS_M") ?: "4").toFloat()
        }

    private fun precisionLandingEnabled(agentType: AgentType): Boolean =
        agentType == AgentType.UAV &&
            (System.getenv("UAV_PRECISION_LANDING") ?: "true").toBoolean()

    const val MIN_PACKAGE_CONTACT_ALTITUDE_METERS = 0.5
}
