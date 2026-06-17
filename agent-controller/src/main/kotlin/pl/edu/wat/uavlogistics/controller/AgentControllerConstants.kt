package pl.edu.wat.uavlogistics.controller

import pl.edu.wat.uavlogistics.common.AgentStatus
import pl.edu.wat.uavlogistics.common.LogisticsConstants

internal object AgentControllerConstants {
    const val STATION_CONTACT_RADIUS_METERS = LogisticsConstants.STATION_CONTACT_RADIUS_METERS
    /** Horizontal tolerance for “docked on this parking index” (not whole-station proximity). */
    const val PARKING_SLOT_DOCK_RADIUS_METERS = 3.0
    const val MIN_ENERGY_BEFORE_TASK_PERCENT = 25.0
    const val TASK_ROUTE_RESERVE_PERCENT = LogisticsConstants.TASK_ROUTE_RESERVE_PERCENT
    const val FULL_ENERGY_PERCENT = 100.0
    const val CHARGE_TICK_MILLIS = 1_000L
    const val REBALANCE_MIN_LOAD_IMPROVEMENT = 2
    const val PACKAGE_STAGING_MIN_INTERVAL_MS = 60_000L
    const val PACKAGE_STAGING_PING_PONG_COOLDOWN_MS = 120_000L
    const val SAME_STATION_RETURN_MAX_METERS = 40.0
    const val SAME_STATION_RETURN_MAX_ENERGY_PERCENT = 8.0
    const val UGV_TRAVEL_ALTITUDE_METERS = 0.0
    const val UAV_CRUISE_ALTITUDE_METERS = 20.0
    const val PACKAGE_CONTACT_ALTITUDE_METERS = 0.8

    /** Pause after a UGV/UAV package mission leg before pick-up or drop registry/visual work. */
    val PACKAGE_WORK_DWELL_MILLIS =
        (System.getenv("PACKAGE_WORK_DWELL_MILLIS") ?: "4000").toLong()

    /** Let PX4 finish arming / mode transitions before mission start or going AVAILABLE on pad. */
    val PX4_POST_ARM_SETTLE_MILLIS =
        (System.getenv("PX4_POST_ARM_SETTLE_MILLIS") ?: "4000").toLong()

    /** Ground distance treated as equal when comparing pickup proximity. */
    const val PICKUP_DISTANCE_TIE_EPSILON_METERS = 0.5

    /** Idle peers that compete for the same package by ground distance to pickup. */
    val COMPETING_FOR_TASK_STATUSES = setOf(
        AgentStatus.ARMING,
        AgentStatus.AVAILABLE,
        AgentStatus.CHARGING,
    )

    val PEER_OCCUPIES_STATION_STATUSES = setOf(
        AgentStatus.ARMING,
        AgentStatus.AVAILABLE,
        AgentStatus.BUSY,
        AgentStatus.CHARGING,
    )

    val CHARGE_PERCENT_PER_SECOND =
        (System.getenv("AGENT_CHARGE_PERCENT_PER_SECOND") ?: "1.0").toDouble()
    val MIN_ROUTE_ENERGY_SPEND_PERCENT =
        (System.getenv("AGENT_MIN_ROUTE_ENERGY_SPEND_PERCENT") ?: "0.5").toDouble()
}

internal fun Double.formatForLog(): String = "%.1f".format(this)
