package pl.edu.wat.uavlogistics.common

import kotlin.math.cos
import kotlin.math.max

object StationSlots {
    private const val EARTH_RADIUS_METERS = 6_371_000.0
    private const val SLOTS_PER_ROW = 4
    private const val SLOT_SPACING_METERS = 2.2
    private const val ROW_SPACING_METERS = 2.2
    private const val SECTION_GAP_METERS = 2.0
    private const val MARGIN_METERS = 1.0
    private const val PARKING_FOOTPRINT_METERS = 1.5
    private const val STORAGE_FOOTPRINT_METERS = 0.7
    private fun parkingApproachStandoffMeters(): Double =
        (System.getenv("PARKING_APPROACH_STANDOFF_M") ?: "3.5").toDouble()

    private fun storageApproachStandoffMeters(): Double =
        (System.getenv("STORAGE_APPROACH_STANDOFF_M") ?: "2.8").toDouble()

    fun parkingSlot(station: TransferStationDto, index: Int): StationSlotDto {
        val layout = layoutFor(station.parkingCapacity, station.storageCapacity)
        return StationSlotDto(
            stationId = station.id,
            kind = StationSlotKind.PARKING,
            index = index,
            position = offsetGrid(
                origin = station.position,
                index = index,
                startEastMeters = layout.parkingStartEastMeters,
                startNorthMeters = layout.parkingStartNorthMeters,
            ),
        )
    }

    fun storageSlot(station: TransferStationDto, index: Int): StationSlotDto {
        val layout = layoutFor(station.parkingCapacity, station.storageCapacity)
        return StationSlotDto(
            stationId = station.id,
            kind = StationSlotKind.STORAGE,
            index = index,
            position = offsetGrid(
                origin = station.position,
                index = index,
                startEastMeters = layout.storageStartEastMeters,
                startNorthMeters = layout.storageStartNorthMeters,
            ),
        )
    }

    fun parkingSlots(station: TransferStationDto): List<StationSlotDto> =
        (0 until station.parkingCapacity.coerceAtLeast(0)).map { parkingSlot(station, it) }

    fun storageSlots(station: TransferStationDto): List<StationSlotDto> =
        (0 until station.storageCapacity.coerceAtLeast(0)).map { storageSlot(station, it) }

    /** Ground approach point outside the platform so rovers do not climb slot markers. */
    fun parkingApproachPoint(station: TransferStationDto, index: Int): GeoPoint =
        approachPoint(station, index, isParking = true, parkingApproachStandoffMeters())

    fun storageApproachPoint(station: TransferStationDto, index: Int): GeoPoint =
        approachPoint(station, index, isParking = false, storageApproachStandoffMeters())

    internal fun layoutFor(parkingCapacity: Int, storageCapacity: Int): StationLayout =
        StationLayoutCalculator.compute(
            parkingCapacity = parkingCapacity.coerceAtLeast(0),
            storageCapacity = storageCapacity.coerceAtLeast(0),
        )

    private fun offsetGrid(
        origin: GeoPoint,
        index: Int,
        startEastMeters: Double,
        startNorthMeters: Double,
    ): GeoPoint {
        val row = index / SLOTS_PER_ROW
        val column = index % SLOTS_PER_ROW
        val eastMeters = startEastMeters + column * SLOT_SPACING_METERS
        val northMeters = startNorthMeters + row * ROW_SPACING_METERS
        return offset(origin, eastMeters, northMeters)
    }

    private fun offset(origin: GeoPoint, eastMeters: Double, northMeters: Double): GeoPoint {
        val latRadians = Math.toRadians(origin.latitude)
        val latitude = origin.latitude + Math.toDegrees(northMeters / EARTH_RADIUS_METERS)
        val longitude = origin.longitude + Math.toDegrees(eastMeters / (EARTH_RADIUS_METERS * cos(latRadians)))
        return origin.copy(latitude = latitude, longitude = longitude, altitudeMeters = 0.0)
    }

    private fun approachPoint(
        station: TransferStationDto,
        index: Int,
        isParking: Boolean,
        standoffMeters: Double,
    ): GeoPoint {
        val layout = layoutFor(station.parkingCapacity, station.storageCapacity)
        val row = index / SLOTS_PER_ROW
        val column = index % SLOTS_PER_ROW
        val (startEast, startNorth) = if (isParking) {
            layout.parkingStartEastMeters to layout.parkingStartNorthMeters
        } else {
            layout.storageStartEastMeters to layout.storageStartNorthMeters
        }
        val slotEast = startEast + column * SLOT_SPACING_METERS
        val slotNorth = startNorth + row * ROW_SPACING_METERS
        val approachEast = slotEast + standoffAwayFromCenter(slotEast, standoffMeters)
        val approachNorth = slotNorth + standoffAwayFromCenter(slotNorth, standoffMeters)
        return offset(station.position, approachEast, approachNorth)
    }

    private fun standoffAwayFromCenter(componentMeters: Double, standoffMeters: Double): Double =
        when {
            componentMeters < 0.0 -> -standoffMeters
            componentMeters > 0.0 -> standoffMeters
            else -> 0.0
        }
}

data class StationLayout(
    val platformWidthMeters: Double,
    val platformDepthMeters: Double,
    val parkingStartEastMeters: Double,
    val parkingStartNorthMeters: Double,
    val storageStartEastMeters: Double,
    val storageStartNorthMeters: Double,
)

private object StationLayoutCalculator {
    private const val SLOTS_PER_ROW = 4
    private const val SLOT_SPACING_METERS = 2.2
    private const val ROW_SPACING_METERS = 2.2
    private const val SECTION_GAP_METERS = 2.0
    private const val MARGIN_METERS = 1.0
    private const val PARKING_FOOTPRINT_METERS = 1.5
    private const val STORAGE_FOOTPRINT_METERS = 0.7

    fun compute(parkingCapacity: Int, storageCapacity: Int): StationLayout {
        val parkingBlock = blockMetrics(parkingCapacity, PARKING_FOOTPRINT_METERS)
        val storageBlock = blockMetrics(storageCapacity, STORAGE_FOOTPRINT_METERS)
        val sectionGap = if (parkingCapacity > 0 && storageCapacity > 0) SECTION_GAP_METERS else 0.0
        val platformWidth = MARGIN_METERS + parkingBlock.widthMeters + sectionGap + storageBlock.widthMeters + MARGIN_METERS
        val contentDepth = max(parkingBlock.depthMeters, storageBlock.depthMeters)
        val platformDepth = if (parkingCapacity + storageCapacity > 0) {
            contentDepth + 2 * MARGIN_METERS
        } else {
            2.0
        }

        val parkingStartEast = -platformWidth / 2.0 + MARGIN_METERS + PARKING_FOOTPRINT_METERS / 2.0
        val parkingStartNorth = -contentDepth / 2.0 + PARKING_FOOTPRINT_METERS / 2.0
        val storageStartEast =
            -platformWidth / 2.0 + MARGIN_METERS + parkingBlock.widthMeters + sectionGap + STORAGE_FOOTPRINT_METERS / 2.0
        val storageStartNorth = -contentDepth / 2.0 + STORAGE_FOOTPRINT_METERS / 2.0

        return StationLayout(
            platformWidthMeters = platformWidth,
            platformDepthMeters = platformDepth,
            parkingStartEastMeters = parkingStartEast,
            parkingStartNorthMeters = parkingStartNorth,
            storageStartEastMeters = storageStartEast,
            storageStartNorthMeters = storageStartNorth,
        )
    }

    private data class BlockMetrics(val widthMeters: Double, val depthMeters: Double)

    private fun blockMetrics(capacity: Int, footprintMeters: Double): BlockMetrics {
        if (capacity <= 0) return BlockMetrics(0.0, 0.0)

        val rows = (capacity + SLOTS_PER_ROW - 1) / SLOTS_PER_ROW
        val lastRowCount = (capacity - 1) % SLOTS_PER_ROW + 1
        val columns = if (rows > 1) SLOTS_PER_ROW else lastRowCount
        val widthMeters = (columns - 1) * SLOT_SPACING_METERS + footprintMeters
        val depthMeters = (rows - 1) * ROW_SPACING_METERS + footprintMeters
        return BlockMetrics(widthMeters, depthMeters)
    }
}
