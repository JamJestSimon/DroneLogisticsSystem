package pl.edu.wat.uavlogistics.controller

import pl.edu.wat.uavlogistics.common.AgentStatus
import pl.edu.wat.uavlogistics.common.AgentType
import pl.edu.wat.uavlogistics.common.Geo
import pl.edu.wat.uavlogistics.common.GeoPoint
import pl.edu.wat.uavlogistics.common.StationSlots
import pl.edu.wat.uavlogistics.common.StationSlotDto
import pl.edu.wat.uavlogistics.common.StationSlotKind
import pl.edu.wat.uavlogistics.common.TransferStationDto
import pl.edu.wat.uavlogistics.common.TransportAgentDto
import pl.edu.wat.uavlogistics.common.TransportTaskDto
import kotlin.math.max
import kotlin.math.min

/** Slot positions, travel altitudes, and physical proximity checks for hubs. */
internal class AgentStationGeometry(
    private val runtime: AgentRuntime,
) {
    private val config get() = runtime.config

    fun travelPoint(point: GeoPoint): GeoPoint =
        if (config.agentType == AgentType.UGV) {
            point.copy(altitudeMeters = AgentControllerConstants.UGV_TRAVEL_ALTITUDE_METERS)
        } else {
            point.copy(altitudeMeters = max(point.altitudeMeters, AgentControllerConstants.UAV_CRUISE_ALTITUDE_METERS))
        }

    fun contactPoint(point: GeoPoint): GeoPoint =
        if (config.agentType == AgentType.UGV) {
            point.copy(altitudeMeters = AgentControllerConstants.UGV_TRAVEL_ALTITUDE_METERS)
        } else {
            point.copy(altitudeMeters = min(point.altitudeMeters, AgentControllerConstants.PACKAGE_CONTACT_ALTITUDE_METERS))
        }

    fun physicallyAtStation(position: GeoPoint, station: TransferStationDto): Boolean =
        Geo.distanceMeters(position, station.position) <= AgentControllerConstants.STATION_CONTACT_RADIUS_METERS

    fun physicallyAtParkingSlot(
        position: GeoPoint,
        station: TransferStationDto,
        slot: StationSlotDto,
    ): Boolean =
        Geo.distanceMeters(position, slotParkedPosition(station, slot)) <=
            AgentControllerConstants.PARKING_SLOT_DOCK_RADIUS_METERS

    fun physicallyLandedAtParkingSlot(
        position: GeoPoint,
        station: TransferStationDto,
        slot: StationSlotDto,
    ): Boolean {
        if (!physicallyAtParkingSlot(position, station, slot)) {
            return false
        }
        if (config.agentType != AgentType.UAV) {
            return true
        }
        return position.altitudeMeters <= AgentControllerConstants.PACKAGE_CONTACT_ALTITUDE_METERS + 1.5
    }

    fun physicallyDockedAtHub(
        position: GeoPoint,
        station: TransferStationDto,
        stationSlots: List<StationSlotDto>,
    ): Boolean {
        val parkingSlot = stationSlots
            .filter { slot ->
                slot.stationId == station.id && slot.kind == StationSlotKind.PARKING
            }
            .let { parking ->
                parking.firstOrNull { it.occupiedByAgentId == config.agentId }
                    ?: parking.firstOrNull {
                        it.reservedByAgentId == config.agentId && !it.reservationEphemeral
                    }
                    ?: parking.firstOrNull { it.reservedByAgentId == config.agentId }
            }
        if (parkingSlot != null) {
            return physicallyLandedAtParkingSlot(position, station, parkingSlot)
        }
        return stationSlots.any { slot ->
            slot.stationId == station.id &&
                slot.kind == StationSlotKind.PARKING &&
                physicallyLandedAtParkingSlot(position, station, slot)
        }
    }

    fun resolvedDockedStationId(
        agent: TransportAgentDto,
        position: GeoPoint,
        stations: List<TransferStationDto>,
        stationSlots: List<StationSlotDto>,
    ): String? {
        agent.currentStationId
            ?.let { stationId -> stations.firstOrNull { it.id == stationId } }
            ?.takeIf { physicallyDockedAtHub(position, it, stationSlots) }
            ?.let { return it.id }
        return null
    }

    fun effectiveHubId(agent: TransportAgentDto, stationSlots: List<StationSlotDto>): String? =
        agent.currentStationId
            ?: stationSlots.firstOrNull { slot ->
                slot.kind == StationSlotKind.PARKING &&
                    (slot.reservedByAgentId == config.agentId || slot.occupiedByAgentId == config.agentId)
            }?.stationId

    /**
     * Station id to report while idle at a hub: exact pad dock, or assigned hub when still within contact radius.
     */
    fun reportedStationId(
        agent: TransportAgentDto,
        position: GeoPoint,
        stations: List<TransferStationDto>,
        stationSlots: List<StationSlotDto>,
    ): String? {
        resolvedDockedStationId(agent, position, stations, stationSlots)?.let { return it }
        val hubId = effectiveHubId(agent, stationSlots) ?: return null
        val station = stations.firstOrNull { it.id == hubId } ?: return null
        return if (physicallyAtStation(position, station)) hubId else null
    }

    suspend fun reconcileStationRegistry(
        agent: TransportAgentDto,
        telemetry: Telemetry,
        stations: List<TransferStationDto>,
        stationSlots: List<StationSlotDto>,
    ): TransportAgentDto {
        val stationId = agent.currentStationId ?: return agent
        val station = stations.firstOrNull { it.id == stationId } ?: return agent.copy(currentStationId = null)
        if (agent.status == AgentStatus.BUSY) {
            return agent
        }
        if (physicallyDockedAtHub(telemetry.position, station, stationSlots)) {
            return agent
        }
        if (physicallyAtStation(telemetry.position, station) &&
            stationSlots.any { slot ->
                slot.stationId == stationId &&
                    slot.kind == StationSlotKind.PARKING &&
                    (slot.reservedByAgentId == config.agentId || slot.occupiedByAgentId == config.agentId)
            }
        ) {
            return agent
        }
        val dockedSlot = stationSlots.firstOrNull { slot ->
            slot.stationId == stationId &&
                slot.kind == StationSlotKind.PARKING &&
                (slot.occupiedByAgentId == config.agentId || slot.reservedByAgentId == config.agentId)
        }
        val distanceFromPadMeters = dockedSlot?.let { slot ->
            Geo.distanceMeters(telemetry.position, slotParkedPosition(station, slot))
        } ?: Geo.distanceMeters(telemetry.position, station.position)
        println(
            "[${config.agentId}] Registry docked at $stationId but telemetry is " +
                "${distanceFromPadMeters.formatForLog()}m from parking pad; " +
                "clearing dock (keeping parking reservation in backend).",
        )
        runtime.backend.updateAgentState(
            agentId = config.agentId,
            position = telemetry.position,
            energyLevelPercent = runtime.simulatedEnergyPercent,
            status = agent.status,
            currentStationId = null,
        )
        return agent.copy(currentStationId = null, position = telemetry.position)
    }

    suspend fun packagePickupPoint(task: TransportTaskDto): GeoPoint =
        task.startStationId
            ?.let { stationId ->
                runtime.backend.networkState().stationSlots.firstOrNull { slot ->
                    slot.stationId == stationId &&
                        slot.kind == StationSlotKind.STORAGE &&
                        slot.occupiedByShipmentId == task.shipmentId
                }?.position
            }
            ?: task.startPoint

    suspend fun packageStorageDropPoint(stationId: String): GeoPoint =
        runtime.backend.networkState().stationSlots.firstOrNull { slot ->
            slot.stationId == stationId &&
                slot.kind == StationSlotKind.STORAGE &&
                slot.occupiedByShipmentId == null
        }?.position ?: runtime.backend.networkState().stations.first { it.id == stationId }.position

    suspend fun storageDrivePoint(stationId: String): GeoPoint {
        val network = runtime.backend.networkState()
        val station = network.stations.first { it.id == stationId }
        val slot = network.stationSlots.firstOrNull { slot ->
            slot.stationId == stationId &&
                slot.kind == StationSlotKind.STORAGE &&
                slot.occupiedByShipmentId == null
        }
        if (config.agentType != AgentType.UGV || slot == null) {
            return slot?.position?.let { travelPoint(it) } ?: station.position
        }
        return StationSlots.storageApproachPoint(station, slot.index)
    }

    fun slotDrivePoint(station: TransferStationDto, slot: StationSlotDto): GeoPoint =
        when {
            config.agentType == AgentType.UGV && slot.kind == StationSlotKind.PARKING ->
                StationSlots.parkingApproachPoint(station, slot.index)
            config.agentType == AgentType.UGV && slot.kind == StationSlotKind.STORAGE ->
                StationSlots.storageApproachPoint(station, slot.index)
            else -> travelPoint(slot.position)
        }

    fun slotParkedPosition(station: TransferStationDto, slot: StationSlotDto): GeoPoint =
        when {
            config.agentType == AgentType.UGV && slot.kind == StationSlotKind.PARKING ->
                slotDockPoint(slot)
            config.agentType == AgentType.UGV ->
                slotDrivePoint(station, slot)
            else -> slotDockPoint(slot)
        }

    fun slotDockPoint(slot: StationSlotDto): GeoPoint =
        if (config.agentType == AgentType.UGV) {
            slot.position.copy(altitudeMeters = AgentControllerConstants.UGV_TRAVEL_ALTITUDE_METERS)
        } else {
            slot.position.copy(altitudeMeters = AgentControllerConstants.PACKAGE_CONTACT_ALTITUDE_METERS)
        }
}
