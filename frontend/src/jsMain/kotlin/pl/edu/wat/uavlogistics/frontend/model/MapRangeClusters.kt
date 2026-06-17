package pl.edu.wat.uavlogistics.frontend.model

/** Vehicle classes used for map legend and range styling. */
val MAP_RANGE_VEHICLE_TYPES: List<String> = listOf("UAV", "UGV")

internal fun rangeDiscsOverlap(a: MapRangeDisc, b: MapRangeDisc): Boolean {
    if (a.purpose != b.purpose) return false
    val gap = geoDistanceMeters(a.lat, a.lon, b.lat, b.lon)
    return gap < a.radiusMeters + b.radiusMeters - 0.5
}

/** Group discs that overlap on the ground into one rendered shape. */
internal fun clusterOverlappingRangeDiscs(discs: List<MapRangeDisc>): List<List<MapRangeDisc>> {
    if (discs.isEmpty()) return emptyList()
    if (discs.size == 1) return listOf(discs)

    val parent = IntArray(discs.size) { it }

    fun find(index: Int): Int {
        var root = index
        while (parent[root] != root) {
            root = parent[root]
        }
        var cursor = index
        while (parent[cursor] != cursor) {
            val next = parent[cursor]
            parent[cursor] = root
            cursor = next
        }
        return root
    }

    fun union(left: Int, right: Int) {
        val rootLeft = find(left)
        val rootRight = find(right)
        if (rootLeft != rootRight) {
            parent[rootRight] = rootLeft
        }
    }

    for (i in discs.indices) {
        for (j in i + 1 until discs.size) {
            if (rangeDiscsOverlap(discs[i], discs[j])) {
                union(i, j)
            }
        }
    }

    return discs.indices
        .groupBy { find(it) }
        .values
        .map { indices -> indices.map { discs[it] } }
}

/** SVG subpath for a circle in map world coordinates (fill union when combined). */
internal fun circleWorldPath(cx: Double, cy: Double, radius: Double): String {
    if (radius <= 0.0) return ""
    return "M ${cx - radius} $cy " +
        "a $radius $radius 0 1 0 ${radius * 2} 0 " +
        "a $radius $radius 0 1 0 ${-radius * 2} 0 Z "
}
