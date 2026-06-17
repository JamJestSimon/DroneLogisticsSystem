package pl.edu.wat.uavlogistics.frontend.model

import kotlinx.browser.localStorage
import kotlin.js.JSON

/**
 * Fleet-wide UAV/UGV range for map discs and tooltips.
 * Synced from backend [fleetRangeSettings] on each network refresh; edits persist in localStorage
 * until applied to the fleet via PUT /api/settings/fleet-range.
 */
object AgentRangeSettings {
    private const val STORAGE_KEY = "uavlogistics.fleetRangeSettings"

    const val DEFAULT_UAV_MAX_RANGE_METERS = 650.0
    const val DEFAULT_UGV_MAX_RANGE_METERS = 600.0
    const val DEFAULT_ROUTE_RESERVE_PERCENT = 15.0
    const val UGV_ROUTE_DISTANCE_MULTIPLIER = 1.35

    var uavMaxRangeMeters: Double = DEFAULT_UAV_MAX_RANGE_METERS
        private set
    var ugvMaxRangeMeters: Double = DEFAULT_UGV_MAX_RANGE_METERS
        private set
    var routeReservePercent: Double = DEFAULT_ROUTE_RESERVE_PERCENT
        private set

    init {
        loadFromLocalStorage()
    }

    fun syncFromNetwork(state: dynamic?) {
        val settings = state?.fleetRangeSettings ?: return
        applyValues(
            uav = optionalNumber(settings.uavMaxRangeMeters, DEFAULT_UAV_MAX_RANGE_METERS),
            ugv = optionalNumber(settings.ugvMaxRangeMeters, DEFAULT_UGV_MAX_RANGE_METERS),
            reserve = optionalNumber(settings.routeReservePercent, DEFAULT_ROUTE_RESERVE_PERCENT),
            persistLocally = true,
        )
    }

    fun applyValues(uav: Double, ugv: Double, reserve: Double, persistLocally: Boolean = false) {
        uavMaxRangeMeters = uav.coerceAtLeast(1.0)
        ugvMaxRangeMeters = ugv.coerceAtLeast(1.0)
        routeReservePercent = reserve.coerceIn(0.0, 99.0)
        if (persistLocally) saveToLocalStorage()
    }

    fun maxRangeMetersForType(vehicleType: String): Double =
        when (vehicleType.uppercase()) {
            "UGV" -> ugvMaxRangeMeters
            else -> uavMaxRangeMeters
        }

    fun routeDistanceMultiplier(vehicleType: String): Double =
        if (vehicleType.uppercase() == "UGV") UGV_ROUTE_DISTANCE_MULTIPLIER else 1.0

    private fun usableRangeFraction(): Double = 1.0 - routeReservePercent / 100.0

    /**
     * One-hop hub relocation at 100% charge (matches [RebalanceTaskService.rebalanceLegFeasible]).
     */
    fun rebalanceHopRadiusMeters(maxRangeMeters: Double): Double =
        maxRangeMeters.coerceAtLeast(0.0)

    /**
     * Furthest hub→hub distance at full charge (one leg + [routeReservePercent], UGV path factor).
     * Used for staging / hub-drive energy checks — not for rebalance hop visualization.
     */
    fun interStationRadiusMeters(vehicleType: String, maxRangeMeters: Double = maxRangeMetersForType(vehicleType)): Double {
        return maxRangeMeters * usableRangeFraction() / routeDistanceMultiplier(vehicleType)
    }

    /** @deprecated Prefer [interStationRadiusMeters] with an explicit max range. */
    fun interStationRadiusMeters(vehicleType: String): Double =
        interStationRadiusMeters(vehicleType, maxRangeMetersForType(vehicleType))

    /**
     * Conservative package pickup reach from a hub (out & back budget + reserve).
     * Used for staging / coarse task reachability from a docked hub.
     */
    fun packagePickupRadiusMeters(vehicleType: String, maxRangeMeters: Double = maxRangeMetersForType(vehicleType)): Double {
        return maxRangeMeters * usableRangeFraction() / (2.0 * routeDistanceMultiplier(vehicleType))
    }

    fun maxRangeMetersFromAgents(agents: dynamic, vehicleType: String): Double? {
        val type = vehicleType.uppercase()
        var maxRange: Double? = null
        dynamicArray(agents).forEach { agent ->
            if ((agent.type as String).uppercase() != type) return@forEach
            val range = runCatching { (agent.maxRangeMeters as Number).toDouble() }.getOrNull() ?: return@forEach
            maxRange = if (maxRange == null) range else maxOf(maxRange!!, range)
        }
        return maxRange
    }

    /** Agent types present in the network (map range discs are drawn only for these). */
    fun registeredVehicleTypes(agents: dynamic?): List<String> {
        if (agents == null) return emptyList()
        val types = mutableSetOf<String>()
        dynamicArray(agents).forEach { agent ->
            types.add((agent.type as String).uppercase())
        }
        return types.sorted()
    }

    fun displayMaxRangeMeters(vehicleType: String, agents: dynamic?): Double {
        if (agents == null) return maxRangeMetersForType(vehicleType)
        maxRangeMetersFromAgents(agents, vehicleType)?.let { registeredMax -> return registeredMax }
        return maxRangeMetersForType(vehicleType)
    }

    /** @deprecated Use [packagePickupRadiusMeters]; kept for older call sites. */
    fun effectiveServiceRadiusMeters(vehicleType: String): Double =
        packagePickupRadiusMeters(vehicleType)

    fun toApiBody(): String {
        val body = js("{}")
        body.uavMaxRangeMeters = uavMaxRangeMeters
        body.ugvMaxRangeMeters = ugvMaxRangeMeters
        body.routeReservePercent = routeReservePercent
        return JSON.stringify(body)
    }

    private fun loadFromLocalStorage() {
        val raw = localStorage.getItem(STORAGE_KEY) ?: return
        runCatching {
            val parsed = JSON.parse<dynamic>(raw)
            applyValues(
                uav = optionalNumber(parsed.uavMaxRangeMeters, DEFAULT_UAV_MAX_RANGE_METERS),
                ugv = optionalNumber(parsed.ugvMaxRangeMeters, DEFAULT_UGV_MAX_RANGE_METERS),
                reserve = optionalNumber(parsed.routeReservePercent, DEFAULT_ROUTE_RESERVE_PERCENT),
                persistLocally = false,
            )
        }
    }

    private fun saveToLocalStorage() {
        localStorage.setItem(STORAGE_KEY, toApiBody())
    }

    private fun optionalNumber(value: dynamic, default: Double): Double =
        runCatching { (value as Number).toDouble() }.getOrElse { default }
}
