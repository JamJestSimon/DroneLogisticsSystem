package pl.edu.wat.uavlogistics.frontend.dom

import kotlinx.browser.document
import org.w3c.dom.HTMLElement
import org.w3c.dom.svg.SVGCircleElement
import org.w3c.dom.svg.SVGGElement
import org.w3c.dom.svg.SVGSVGElement
import pl.edu.wat.uavlogistics.frontend.model.GeoCoord
import pl.edu.wat.uavlogistics.frontend.model.MapAddMode
import pl.edu.wat.uavlogistics.frontend.model.MAP_RANGE_VEHICLE_TYPES
import pl.edu.wat.uavlogistics.frontend.model.MapRangeDisc
import pl.edu.wat.uavlogistics.frontend.model.MapRangePurpose
import pl.edu.wat.uavlogistics.frontend.model.circleWorldPath
import pl.edu.wat.uavlogistics.frontend.model.clusterOverlappingRangeDiscs
import pl.edu.wat.uavlogistics.frontend.model.MapBounds
import pl.edu.wat.uavlogistics.frontend.model.MapPoint
import pl.edu.wat.uavlogistics.frontend.model.MapPointKind
import pl.edu.wat.uavlogistics.frontend.model.geoEastMeters
import pl.edu.wat.uavlogistics.frontend.model.geoFromLocalMeters
import pl.edu.wat.uavlogistics.frontend.model.geoNorthMeters
import kotlin.math.abs
import kotlin.math.floor
import kotlin.math.hypot
import kotlin.math.log10
import kotlin.math.max
import kotlin.math.min
import kotlin.math.pow

private const val DEFAULT_LAT = 47.397971
private const val DEFAULT_LON = 8.546164
private const val DEFAULT_HALF_SPAN_METERS = 400.0
private const val MIN_HALF_SPAN_METERS = 150.0
private const val VIEW_W = 960.0
private const val VIEW_H = 520.0
private const val PADDING = 48.0
private const val SCREEN_GRID_SPACING = 80.0
private const val MARKER_RADIUS = 10.0
private const val MARKER_HIT_RADIUS = 14.0

class DomMapView(
    private val container: HTMLElement,
    private val onMapClick: (GeoCoord) -> Unit,
) {
    private val svg = document.createElementNS("http://www.w3.org/2000/svg", "svg") as SVGSVGElement
    private val worldLayer = document.createElementNS("http://www.w3.org/2000/svg", "g") as SVGGElement
    private val gridLayer = document.createElementNS("http://www.w3.org/2000/svg", "g") as SVGGElement
    private val rangesLayer = document.createElementNS("http://www.w3.org/2000/svg", "g") as SVGGElement
    private val markersLayer = document.createElementNS("http://www.w3.org/2000/svg", "g") as SVGGElement
    private val tooltip = el("div", "map-tooltip hidden")

    private var points: List<MapPoint> = emptyList()
    private var rangeDiscs: List<MapRangeDisc> = emptyList()
    private var geoBounds: MapBounds = defaultBounds(emptyList())
    private var addMode: MapAddMode? = null
    private var panX = 0.0
    private var panY = 0.0
    private var zoom = 1.0
    private var dragging = false
    private var dragStartX = 0.0
    private var dragStartY = 0.0
    private var panStartX = 0.0
    private var panStartY = 0.0
    private var hoveredPoint: MapPoint? = null
    private var focusAfterNextDisplay: GeoCoord? = null

    init {
        container.className = "map"
        svg.setAttribute("viewBox", "0 0 $VIEW_W $VIEW_H")
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet")
        rangesLayer.setAttribute("class", "map-agent-ranges")
        worldLayer.appendChild(gridLayer)
        worldLayer.appendChild(rangesLayer)
        worldLayer.appendChild(markersLayer)
        svg.appendChild(worldLayer)
        container.appendChild(svg)
        container.appendChild(tooltip)

        container.onmousedown = { event ->
            if (addMode == null) {
                dragging = true
                container.classList.add("map-dragging")
                hideTooltip()
                dragStartX = event.clientX.toDouble()
                dragStartY = event.clientY.toDouble()
                panStartX = panX
                panStartY = panY
            }
            null
        }
        container.onmousemove = { event ->
            val (sx, sy) = clientToViewBox(event.clientX.toDouble(), event.clientY.toDouble())
            if (dragging) {
                panX = panStartX + (event.clientX - dragStartX)
                panY = panStartY + (event.clientY - dragStartY)
                updateView()
            } else {
                updateHover(sx, sy)
            }
            null
        }
        container.onmouseup = {
            dragging = false
            container.classList.remove("map-dragging")
            null
        }
        container.onmouseleave = {
            dragging = false
            container.classList.remove("map-dragging")
            hideTooltip()
            null
        }
        container.onwheel = { event ->
            event.preventDefault()
            val (sx, sy) = clientToViewBox(event.clientX.toDouble(), event.clientY.toDouble())
            val factor = if (event.deltaY < 0) 1.12 else 1.0 / 1.12
            zoomAt(sx, sy, factor)
            null
        }
        svg.onclick = { event ->
            if (addMode != null) {
                geoAt(event.clientX.toDouble(), event.clientY.toDouble())?.let(onMapClick)
            }
            null
        }
    }

    fun setDisplay(newPoints: List<MapPoint>, newRangeDiscs: List<MapRangeDisc>) {
        points = newPoints
        rangeDiscs = newRangeDiscs
        geoBounds = computeBounds(points)
        focusAfterNextDisplay?.let { focus ->
            focusAfterNextDisplay = null
            centerViewOn(focus.lat, focus.lon)
        }
        updateView()
    }

    /** Keep the map centered on a newly placed entity after bounds refit. */
    fun focusAfterPlacement(coord: GeoCoord) {
        focusAfterNextDisplay = coord
    }

    fun setAddMode(mode: MapAddMode?) {
        addMode = mode
        container.classList.toggle("map-add-mode", mode != null)
    }

    fun resetView() {
        panX = 0.0
        panY = 0.0
        zoom = 1.0
        updateView()
    }

    fun zoomIn() {
        zoomAt(VIEW_W / 2.0, VIEW_H / 2.0, 1.2)
    }

    fun zoomOut() {
        zoomAt(VIEW_W / 2.0, VIEW_H / 2.0, 1.0 / 1.2)
    }

    private fun zoomAt(screenX: Double, screenY: Double, factor: Double) {
        val (wx, wy) = screenToWorld(screenX, screenY)
        val newZoom = (zoom * factor).coerceIn(0.35, 12.0)
        zoom = newZoom
        panX = screenX - wx * zoom
        panY = screenY - wy * zoom
        updateView()
    }

    private fun updateView() {
        worldLayer.setAttribute("transform", "translate($panX $panY) scale($zoom)")
        renderGrid()
        renderRangeDiscs()
        renderMarkers()
        hoveredPoint?.let { point ->
            val (sx, sy) = pointScreenPosition(point)
            showTooltip(point, sx, sy)
        }
    }

    private fun renderGrid() {
        while (gridLayer.firstChild != null) {
            gridLayer.removeChild(gridLayer.firstChild!!)
        }
        val bounds = geoBounds

        val (wx0, wy0) = screenToWorld(0.0, 0.0)
        val (wx1, wy1) = screenToWorld(VIEW_W, VIEW_H)
        val minWx = min(wx0, wx1)
        val maxWx = max(wx0, wx1)
        val minWy = min(wy0, wy1)
        val maxWy = max(wy0, wy1)
        val worldW = maxWx - minWx
        val worldH = maxWy - minWy
        if (worldW <= 0.0 || worldH <= 0.0) return

        val geoCorners = listOf(
            worldToGeo(minWx, minWy, bounds),
            worldToGeo(maxWx, minWy, bounds),
            worldToGeo(minWx, maxWy, bounds),
            worldToGeo(maxWx, maxWy, bounds),
        ).filterNotNull()
        if (geoCorners.isEmpty()) return

        val visMinLon = geoCorners.minOf { it.lon }
        val visMaxLon = geoCorners.maxOf { it.lon }
        val visMinLat = geoCorners.minOf { it.lat }
        val visMaxLat = geoCorners.maxOf { it.lat }
        val visLonRange = (visMaxLon - visMinLon).takeIf { it > 0.0 } ?: return
        val visLatRange = (visMaxLat - visMinLat).takeIf { it > 0.0 } ?: return

        val lonStep = niceGeoStep((SCREEN_GRID_SPACING / zoom) * visLonRange / worldW)
        val latStep = niceGeoStep((SCREEN_GRID_SPACING / zoom) * visLatRange / worldH)

        val lineMinWx = minWx - worldW * 0.01
        val lineMaxWx = maxWx + worldW * 0.01
        val lineMinWy = minWy - worldH * 0.01
        val lineMaxWy = maxWy + worldH * 0.01

        drawGridMeridians(visMinLon, visMaxLon, lonStep, lineMinWy, lineMaxWy, minWx, maxWx, major = true)
        drawGridParallels(visMinLat, visMaxLat, latStep, lineMinWx, lineMaxWx, minWy, maxWy, major = true)

        val minorLonStep = lonStep / 5.0
        val minorLatStep = latStep / 5.0
        if (minorLonStep * worldW / visLonRange * zoom >= 24.0) {
            drawGridMeridians(visMinLon, visMaxLon, minorLonStep, lineMinWy, lineMaxWy, minWx, maxWx, major = false, skipMultipleOf = lonStep)
        }
        if (minorLatStep * worldH / visLatRange * zoom >= 24.0) {
            drawGridParallels(visMinLat, visMaxLat, minorLatStep, lineMinWx, lineMaxWx, minWy, maxWy, major = false, skipMultipleOf = latStep)
        }
    }

    private fun drawGridMeridians(
        visMinLon: Double,
        visMaxLon: Double,
        step: Double,
        lineMinWy: Double,
        lineMaxWy: Double,
        minWx: Double,
        maxWx: Double,
        major: Boolean,
        skipMultipleOf: Double? = null,
    ) {
        if (step <= 0.0) return
        var lon = snapDown(visMinLon - step, step)
        val lonEnd = visMaxLon + step
        while (lon <= lonEnd) {
            if (skipMultipleOf == null || !isNearMultiple(lon, skipMultipleOf)) {
                val x = lonToViewportX(lon, visMinLon, visMaxLon, minWx, maxWx)
                gridLayer.appendChild(gridLine(x, lineMinWy, x, lineMaxWy, major))
            }
            lon += step
        }
    }

    private fun drawGridParallels(
        visMinLat: Double,
        visMaxLat: Double,
        step: Double,
        lineMinWx: Double,
        lineMaxWx: Double,
        minWy: Double,
        maxWy: Double,
        major: Boolean,
        skipMultipleOf: Double? = null,
    ) {
        if (step <= 0.0) return
        var lat = snapDown(visMinLat - step, step)
        val latEnd = visMaxLat + step
        while (lat <= latEnd) {
            if (skipMultipleOf == null || !isNearMultiple(lat, skipMultipleOf)) {
                val y = latToViewportY(lat, visMinLat, visMaxLat, minWy, maxWy)
                gridLayer.appendChild(gridLine(lineMinWx, y, lineMaxWx, y, major))
            }
            lat += step
        }
    }

    /** Maps visible longitude range to the current viewport world width. */
    private fun lonToViewportX(lon: Double, minLon: Double, maxLon: Double, minWx: Double, maxWx: Double): Double {
        val range = (maxLon - minLon).takeIf { it > 0.0 } ?: return minWx
        return minWx + ((lon - minLon) / range) * (maxWx - minWx)
    }

    /** Maps visible latitude range to the current viewport world height (north at top). */
    private fun latToViewportY(lat: Double, minLat: Double, maxLat: Double, minWy: Double, maxWy: Double): Double {
        val range = (maxLat - minLat).takeIf { it > 0.0 } ?: return maxWy
        return maxWy - ((lat - minLat) / range) * (maxWy - minWy)
    }

    private fun renderRangeDiscs() {
        while (rangesLayer.firstChild != null) {
            rangesLayer.removeChild(rangesLayer.firstChild!!)
        }
        // Outer (inter-station) discs first, then inner (pickup) so both remain visible.
        listOf(MapRangePurpose.INTER_STATION, MapRangePurpose.PACKAGE_PICKUP).forEach { purpose ->
            MAP_RANGE_VEHICLE_TYPES.forEach { vehicleType ->
                val typeDiscs = rangeDiscs.filter {
                    it.vehicleType.equals(vehicleType, ignoreCase = true) && it.purpose == purpose
                }
                val style = vehicleRangeStyle(vehicleType, purpose)
                val strokeWidth = (1.5 / zoom).coerceIn(0.75, 2.5)
                val renderClusters = if (purpose == MapRangePurpose.INTER_STATION) {
                    typeDiscs.map { listOf(it) }
                } else {
                    clusterOverlappingRangeDiscs(typeDiscs)
                }
                renderClusters.forEach { cluster ->
                    val pathData = buildString {
                        cluster.forEach { disc ->
                            val (wx, wy) = project(disc.lat, disc.lon, geoBounds)
                            val radiusWorld = rangeWorldRadius(disc)
                            if (!radiusWorld.isFinite() || radiusWorld <= 0.0) return@forEach
                            append(circleWorldPath(wx, wy, radiusWorld))
                        }
                    }
                    if (pathData.isBlank()) return@forEach

                    val shape = document.createElementNS("http://www.w3.org/2000/svg", "path")
                        as org.w3c.dom.svg.SVGPathElement
                    shape.setAttribute("d", pathData.trim())
                    shape.setAttribute("fill", style.fill)
                    shape.setAttribute("fill-rule", "nonzero")
                    shape.setAttribute("stroke", style.stroke)
                    shape.setAttribute("stroke-width", strokeWidth.toString())
                    if (purpose == MapRangePurpose.INTER_STATION) {
                        val dash = (8.0 / zoom).coerceIn(4.0, 14.0)
                        shape.setAttribute("stroke-dasharray", "$dash $dash")
                    }
                    val shapeClass = buildString {
                        append("map-range-${purpose.name.lowercase()}")
                        if (cluster.size > 1) {
                            append(" map-range-merged")
                        }
                    }
                    shape.setAttribute("class", shapeClass)
                    if (cluster.size > 1) {
                        shape.setAttribute("stroke-linejoin", "round")
                    }
                    rangesLayer.appendChild(shape)
                }
            }
        }
    }

    private fun renderMarkers() {
        while (markersLayer.firstChild != null) {
            markersLayer.removeChild(markersLayer.firstChild!!)
        }
        val markerRadius = MARKER_RADIUS / zoom
        val hitRadius = MARKER_HIT_RADIUS / zoom
        points.forEach { point ->
            val (wx, wy) = project(point.lat, point.lon, geoBounds)
            val color = when (point.kind) {
                MapPointKind.STATION -> "#34d399"
                MapPointKind.AGENT -> agentMarkerColor(point.agentType)
                MapPointKind.PACKAGE -> "#f59e0b"
            }
            val group = document.createElementNS("http://www.w3.org/2000/svg", "g") as SVGGElement
            group.setAttribute("class", "map-marker")
            group.asDynamic().mapPoint = point

            val hit = circle(wx, wy, hitRadius, "transparent", "0")
            val dot = circle(wx, wy, markerRadius, color, (2.0 / zoom).coerceIn(0.75, 3.0).toString())
            group.appendChild(hit)
            group.appendChild(dot)
            markersLayer.appendChild(group)
        }
    }

    private fun updateHover(screenX: Double, screenY: Double) {
        val hit = points.minByOrNull { point ->
            val (px, py) = pointScreenPosition(point)
            hypot(px - screenX, py - screenY)
        }?.takeIf { point ->
            val (px, py) = pointScreenPosition(point)
            hypot(px - screenX, py - screenY) <= MARKER_HIT_RADIUS
        }

        if (hit?.id != hoveredPoint?.id) {
            hoveredPoint = hit
            if (hit != null) {
                showTooltip(hit, screenX, screenY)
            } else {
                hideTooltip()
            }
        } else if (hit != null) {
            moveTooltip(screenX, screenY)
        }
    }

    private fun showTooltip(point: MapPoint, screenX: Double, screenY: Double) {
        tooltip.classList.remove("hidden")
        tooltip.clearChildren()
        val kind = when (point.kind) {
            MapPointKind.STATION -> "Station"
            MapPointKind.AGENT -> "Agent"
            MapPointKind.PACKAGE -> "Package"
        }
        tooltip.appendChild(el("strong", "map-tooltip-title", "$kind · ${point.label}"))
        point.details.split("\n").forEach { line ->
            if (line.isNotBlank()) {
                tooltip.appendChild(el("div", "map-tooltip-line", line))
            }
        }
        moveTooltip(screenX, screenY)
    }

    private fun moveTooltip(screenX: Double, screenY: Double) {
        val rect = container.getBoundingClientRect()
        val scaleX = rect.width / VIEW_W
        val scaleY = rect.height / VIEW_H
        val left = screenX * scaleX + 14.0
        val top = screenY * scaleY - 12.0
        tooltip.asDynamic().style.left = "${left}px"
        tooltip.asDynamic().style.top = "${top}px"
    }

    private fun hideTooltip() {
        tooltip.classList.add("hidden")
        hoveredPoint = null
    }

    private fun pointScreenPosition(point: MapPoint): Pair<Double, Double> {
        val (wx, wy) = project(point.lat, point.lon, geoBounds)
        return worldToScreen(wx, wy)
    }

    /** Ground-distance radius in world/viewBox units (uniform meters scale). */
    private fun rangeWorldRadius(disc: MapRangeDisc): Double {
        val scale = geoBounds.metersPerUnit
        if (!scale.isFinite() || scale <= 0.0) return 0.0
        return disc.radiusMeters * scale
    }

    private data class VehicleRangeStyle(val fill: String, val stroke: String)

    private fun vehicleRangeStyle(vehicleType: String, purpose: MapRangePurpose): VehicleRangeStyle =
        when (vehicleType.uppercase()) {
            "UGV" -> when (purpose) {
                MapRangePurpose.INTER_STATION -> VehicleRangeStyle(
                    fill = "rgba(192, 132, 252, 0.10)",
                    stroke = "rgba(192, 132, 252, 0.40)",
                )
                MapRangePurpose.PACKAGE_PICKUP -> VehicleRangeStyle(
                    fill = "rgba(192, 132, 252, 0.22)",
                    stroke = "rgba(192, 132, 252, 0.65)",
                )
            }
            else -> when (purpose) {
                MapRangePurpose.INTER_STATION -> VehicleRangeStyle(
                    fill = "rgba(96, 165, 250, 0.10)",
                    stroke = "rgba(96, 165, 250, 0.40)",
                )
                MapRangePurpose.PACKAGE_PICKUP -> VehicleRangeStyle(
                    fill = "rgba(96, 165, 250, 0.22)",
                    stroke = "rgba(96, 165, 250, 0.65)",
                )
            }
        }

    private fun agentMarkerColor(agentType: String?): String =
        when (agentType?.uppercase()) {
            "UGV" -> "#c084fc"
            else -> "#60a5fa"
        }

    private fun centerViewOn(lat: Double, lon: Double) {
        val (wx, wy) = project(lat, lon, geoBounds)
        panX = VIEW_W / 2.0 - wx * zoom
        panY = VIEW_H / 2.0 - wy * zoom
    }

    private fun worldToScreen(wx: Double, wy: Double): Pair<Double, Double> =
        panX + wx * zoom to panY + wy * zoom

    private fun screenToWorld(sx: Double, sy: Double): Pair<Double, Double> =
        (sx - panX) / zoom to (sy - panY) / zoom

    private fun geoAt(clientX: Double, clientY: Double): GeoCoord? {
        val (viewX, viewY) = clientToViewBox(clientX, clientY)
        val (wx, wy) = screenToWorld(viewX, viewY)
        return worldToGeo(wx, wy, geoBounds)
    }

    /** Map browser client coordinates to SVG viewBox space (handles letterboxing and non-uniform scale). */
    private fun clientToViewBox(clientX: Double, clientY: Double): Pair<Double, Double> {
        val point = svg.createSVGPoint()
        point.x = clientX
        point.y = clientY
        val inverse = svg.getScreenCTM()?.inverse()
        if (inverse != null) {
            val local = point.matrixTransform(inverse)
            return local.x to local.y
        }
        return svgOffsetX(clientX) to svgOffsetY(clientY)
    }

    private fun worldToGeo(wx: Double, wy: Double, bounds: MapBounds): GeoCoord? {
        val scale = bounds.metersPerUnit
        if (!scale.isFinite() || scale <= 0.0) return null
        val east = (wx - bounds.centerWorldX) / scale
        val north = (bounds.centerWorldY - wy) / scale
        return geoFromLocalMeters(east, north, bounds.refLat, bounds.refLon)
    }

    private fun svgOffsetX(clientX: Double): Double {
        val rect = svg.getBoundingClientRect()
        return (clientX - rect.left) * (VIEW_W / rect.width)
    }

    private fun svgOffsetY(clientY: Double): Double {
        val rect = svg.getBoundingClientRect()
        return (clientY - rect.top) * (VIEW_H / rect.height)
    }

    private fun niceGeoStep(approxDegrees: Double): Double {
        if (!approxDegrees.isFinite() || approxDegrees <= 0.0) return 1e-6
        val exponent = floor(log10(approxDegrees))
        val magnitude = 10.0.pow(exponent)
        val normalized = approxDegrees / magnitude
        val nice = when {
            normalized <= 1.0 -> 1.0
            normalized <= 2.0 -> 2.0
            normalized <= 5.0 -> 5.0
            else -> 10.0
        }
        return nice * magnitude
    }

    private fun snapDown(value: Double, step: Double): Double {
        if (step <= 0.0) return value
        return floor(value / step) * step
    }

    private fun isNearMultiple(value: Double, step: Double): Boolean {
        if (step <= 0.0) return false
        val remainder = value % step
        return remainder < step * 1e-6 || step - remainder < step * 1e-6
    }

    private fun circle(cx: Double, cy: Double, r: Double, fill: String, strokeWidth: String): SVGCircleElement {
        val circle = document.createElementNS("http://www.w3.org/2000/svg", "circle") as SVGCircleElement
        circle.setAttribute("cx", cx.toString())
        circle.setAttribute("cy", cy.toString())
        circle.setAttribute("r", r.toString())
        circle.setAttribute("fill", fill)
        if (strokeWidth != "0") {
            circle.setAttribute("stroke", "#0f172a")
            circle.setAttribute("stroke-width", strokeWidth)
        }
        return circle
    }

    private fun gridLine(
        x1: Double,
        y1: Double,
        x2: Double,
        y2: Double,
        major: Boolean,
    ): org.w3c.dom.svg.SVGLineElement {
        val line = document.createElementNS("http://www.w3.org/2000/svg", "line") as org.w3c.dom.svg.SVGLineElement
        line.setAttribute("x1", x1.toString())
        line.setAttribute("y1", y1.toString())
        line.setAttribute("x2", x2.toString())
        line.setAttribute("y2", y2.toString())
        line.setAttribute("stroke", if (major) "#334155" else "#1e293b")
        val width = if (major) 1.0 else 0.6
        line.setAttribute("stroke-width", (width / zoom).coerceIn(0.35, 2.0).toString())
        return line
    }

    private fun defaultBounds(points: List<MapPoint>): MapBounds = computeBounds(points)

    /** Fit to stations/agents/packages with uniform ground scale; range discs may extend past the edge. */
    private fun computeBounds(points: List<MapPoint>): MapBounds {
        if (points.isEmpty()) {
            return boundsFromHalfSpans(
                refLat = DEFAULT_LAT,
                refLon = DEFAULT_LON,
                halfSpanEastMeters = DEFAULT_HALF_SPAN_METERS,
                halfSpanNorthMeters = DEFAULT_HALF_SPAN_METERS,
            )
        }
        val refLat = points.map { it.lat }.average()
        val refLon = points.map { it.lon }.average()
        val eastOffsets = points.map { geoEastMeters(it.lon, refLon, refLat) }
        val northOffsets = points.map { geoNorthMeters(it.lat, refLat) }
        val eastExtent = max(abs(eastOffsets.minOrNull() ?: 0.0), abs(eastOffsets.maxOrNull() ?: 0.0))
        val northExtent = max(abs(northOffsets.minOrNull() ?: 0.0), abs(northOffsets.maxOrNull() ?: 0.0))
        val paddedEast = max(eastExtent * 1.15, MIN_HALF_SPAN_METERS)
        val paddedNorth = max(northExtent * 1.15, MIN_HALF_SPAN_METERS)
        return boundsFromHalfSpans(refLat, refLon, paddedEast, paddedNorth)
    }

    private fun boundsFromHalfSpans(
        refLat: Double,
        refLon: Double,
        halfSpanEastMeters: Double,
        halfSpanNorthMeters: Double,
    ): MapBounds {
        val innerW = VIEW_W - PADDING * 2
        val innerH = VIEW_H - PADDING * 2
        val halfEast = halfSpanEastMeters.coerceAtLeast(MIN_HALF_SPAN_METERS)
        val halfNorth = halfSpanNorthMeters.coerceAtLeast(MIN_HALF_SPAN_METERS)
        val metersPerUnit = min(innerW / (2.0 * halfEast), innerH / (2.0 * halfNorth))
        return MapBounds(
            refLat = refLat,
            refLon = refLon,
            halfSpanEastMeters = halfEast,
            halfSpanNorthMeters = halfNorth,
            metersPerUnit = metersPerUnit,
            width = VIEW_W,
            height = VIEW_H,
            padding = PADDING,
        )
    }

    private fun project(lat: Double, lon: Double, bounds: MapBounds): Pair<Double, Double> {
        val east = geoEastMeters(lon, bounds.refLon, bounds.refLat)
        val north = geoNorthMeters(lat, bounds.refLat)
        val x = bounds.centerWorldX + east * bounds.metersPerUnit
        val y = bounds.centerWorldY - north * bounds.metersPerUnit
        return x to y
    }
}
