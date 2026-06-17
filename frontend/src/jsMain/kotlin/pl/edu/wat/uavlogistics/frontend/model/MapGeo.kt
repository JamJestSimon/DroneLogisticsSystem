package pl.edu.wat.uavlogistics.frontend.model

import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sqrt

private const val METERS_PER_DEGREE_LAT = 111_320.0

fun metersToLatDegrees(meters: Double): Double = meters / METERS_PER_DEGREE_LAT

fun metersToLonDegrees(meters: Double, atLatitude: Double): Double {
    val cosLat = cos(atLatitude * PI / 180.0).coerceAtLeast(0.01)
    return meters / (METERS_PER_DEGREE_LAT * cosLat)
}

/** East offset in meters from [refLon] at [refLat]. */
fun geoEastMeters(lon: Double, refLon: Double, refLat: Double): Double =
    (lon - refLon) * METERS_PER_DEGREE_LAT * cos(refLat * PI / 180.0)

/** North offset in meters from [refLat]. */
fun geoNorthMeters(lat: Double, refLat: Double): Double =
    (lat - refLat) * METERS_PER_DEGREE_LAT

fun geoFromLocalMeters(eastMeters: Double, northMeters: Double, refLat: Double, refLon: Double): GeoCoord {
    val lat = refLat + northMeters / METERS_PER_DEGREE_LAT
    val cosLat = cos(refLat * PI / 180.0).coerceAtLeast(0.01)
    val lon = refLon + eastMeters / (METERS_PER_DEGREE_LAT * cosLat)
    return GeoCoord(lat, lon)
}

fun geoDistanceMeters(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
    val meanLat = (lat1 + lat2) / 2.0
    val dLat = (lat2 - lat1) * METERS_PER_DEGREE_LAT
    val dLon = (lon2 - lon1) * METERS_PER_DEGREE_LAT * cos(meanLat * PI / 180.0)
    return sqrt(dLat * dLat + dLon * dLon)
}
