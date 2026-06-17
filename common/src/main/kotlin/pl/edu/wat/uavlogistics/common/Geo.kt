package pl.edu.wat.uavlogistics.common

import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.pow
import kotlin.math.sin
import kotlin.math.sqrt

object Geo {
    private const val EarthRadiusMeters = 6_371_000.0

    fun distanceMeters(from: GeoPoint, to: GeoPoint): Double {
        val lat1 = Math.toRadians(from.latitude)
        val lat2 = Math.toRadians(to.latitude)
        val dLat = Math.toRadians(to.latitude - from.latitude)
        val dLon = Math.toRadians(to.longitude - from.longitude)

        val horizontal = 2 * EarthRadiusMeters * atan2(
            sqrt(
                sin(dLat / 2).pow(2) +
                    cos(lat1) * cos(lat2) * sin(dLon / 2).pow(2),
            ),
            sqrt(
                1 - (
                    sin(dLat / 2).pow(2) +
                        cos(lat1) * cos(lat2) * sin(dLon / 2).pow(2)
                    ),
            ),
        )

        val vertical = to.altitudeMeters - from.altitudeMeters
        return sqrt(horizontal.pow(2) + vertical.pow(2))
    }

    /** How far [point] lies along the segment from [start] to [end] (0 = at start, 1 = at end). */
    fun routeProgress(start: GeoPoint, end: GeoPoint, point: GeoPoint): Double {
        val total = distanceMeters(start, end)
        if (total == 0.0) return 0.0
        val fromStart = distanceMeters(start, point)
        val fromEnd = distanceMeters(point, end)
        return (total + fromStart - fromEnd) / (2.0 * total)
    }
}
