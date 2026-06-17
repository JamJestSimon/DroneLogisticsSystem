package pl.edu.wat.uavlogistics.frontend.model

data class MapPoint(
    val id: String,
    val label: String,
    val details: String,
    val lat: Double,
    val lon: Double,
    val kind: MapPointKind,
    val agentType: String? = null,
)

enum class MapRangePurpose {
    /** Hub → package origin with energy reserved for return (matches task pickup / staging checks). */
    PACKAGE_PICKUP,
    /** Hub → hub relocation at full charge (rebalance; one-hop, no merged union). */
    INTER_STATION,
}

/** Hub-centered disc: global per-class range for a given operational purpose. */
data class MapRangeDisc(
    val stationId: String,
    val vehicleType: String,
    val purpose: MapRangePurpose,
    val lat: Double,
    val lon: Double,
    val radiusMeters: Double,
) {
    val id: String = "$stationId-$vehicleType-${purpose.name}"
}

enum class MapPointKind {
    STATION,
    AGENT,
    PACKAGE,
}

/**
 * Viewport fit in local meters (uniform scale preserves ground distances and circular range discs).
 */
data class MapBounds(
    val refLat: Double,
    val refLon: Double,
    val halfSpanEastMeters: Double,
    val halfSpanNorthMeters: Double,
    val metersPerUnit: Double,
    val width: Double,
    val height: Double,
    val padding: Double,
) {
    val centerWorldX: Double get() = width / 2.0
    val centerWorldY: Double get() = height / 2.0
}

data class GeoCoord(val lat: Double, val lon: Double)

fun String.shortId(): String =
    if (length <= 14) this else "${take(6)}…${takeLast(4)}"
