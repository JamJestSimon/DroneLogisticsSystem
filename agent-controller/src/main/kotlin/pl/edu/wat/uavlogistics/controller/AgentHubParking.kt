package pl.edu.wat.uavlogistics.controller

import kotlinx.coroutines.delay
import pl.edu.wat.uavlogistics.common.AgentStatus
import pl.edu.wat.uavlogistics.common.AgentType
import pl.edu.wat.uavlogistics.common.Geo
import pl.edu.wat.uavlogistics.common.GeoPoint
import pl.edu.wat.uavlogistics.common.StationSlotDto
import pl.edu.wat.uavlogistics.common.TransferStationDto
import pl.edu.wat.uavlogistics.common.TransportAgentDto

/** Cruise, land, and dock at hub parking pads (rebalance, return, staging). */
internal class AgentHubParking(
    private val runtime: AgentRuntime,
    private val stations: AgentStationGeometry,
) {
    private val config get() = runtime.config

    /** Waits for PX4/telemetry to settle after a land mission before dock checks. */
    suspend fun waitForPhysicalDockAtSlot(
        station: TransferStationDto,
        slot: StationSlotDto,
        timeoutMillis: Long = 12_000,
    ): GeoPoint? {
        val deadline = System.currentTimeMillis() + timeoutMillis
        while (System.currentTimeMillis() < deadline) {
            val position = runtime.vehicle.telemetry().position
            if (stations.physicallyLandedAtParkingSlot(position, station, slot)) {
                return position
            }
            delay(250)
        }
        val last = runtime.vehicle.telemetry().position
        return if (stations.physicallyLandedAtParkingSlot(last, station, slot)) last else null
    }

    suspend fun flyHubParkingCruise(
        station: TransferStationDto,
        slot: StationSlotDto,
        routeAgent: TransportAgentDto,
        groundObstacles: List<GroundObstacle>,
        onTelemetry: suspend (Telemetry) -> Unit,
    ) {
        val parkingApproach = stations.slotDrivePoint(station, slot)
        val route = runtime.planRouteToPoint(routeAgent, parkingApproach, groundObstacles)
        if (route.distanceMeters > AgentControllerConstants.PARKING_SLOT_DOCK_RADIUS_METERS) {
            runtime.vehicle.executeRoute(route, onTelemetry)
            runtime.consumeEnergy(route)
        }
    }

    /**
     * Fly/drive to a reserved hub pad and dock. Uses one AUTO mission per vehicle type when possible.
     */
    suspend fun flyAndDockAtHubParkingSlot(
        station: TransferStationDto,
        slot: StationSlotDto,
        routeAgent: TransportAgentDto,
        groundObstacles: List<GroundObstacle>,
        onTelemetry: suspend (Telemetry) -> Unit,
    ): GeoPoint? {
        if (config.agentType == AgentType.UAV) {
            val approach = stations.slotDrivePoint(station, slot)
            val padContact = stations.slotParkedPosition(station, slot)
            val distanceMeters = Geo.distanceMeters(routeAgent.position, approach)
            if (distanceMeters > AgentControllerConstants.PARKING_SLOT_DOCK_RADIUS_METERS) {
                val cruiseHold = stations.travelPoint(approach)
                val items = MissionBuilders.forUavPackageReturnMission(
                    cruiseHold = cruiseHold,
                    padContact = padContact,
                    cruiseAltitudeMeters = AgentControllerConstants.UAV_CRUISE_ALTITUDE_METERS,
                    takeoffFrom = routeAgent.position,
                )
                if (runtime.vehicle.executeMissionItems(items, onTelemetry)) {
                    var position = waitForPhysicalDockAtSlot(station, slot, timeoutMillis = 4_000)
                    if (position == null) {
                        position = runtime.vehicle.telemetry().position
                        println(
                            "[${config.agentId}] Mission ended ${Geo.distanceMeters(position, padContact).formatForLog()}m " +
                                "from ${station.id} slot ${slot.index}; fine-tuning landing.",
                        )
                        runtime.vehicle.landAtHubParkingPad(padContact, onTelemetry)
                        position = waitForPhysicalDockAtSlot(station, slot)
                    }
                    if (position != null) {
                        runtime.vehicle.disarm()
                        runtime.vehicle.resetHomeAtCurrentPosition()
                        return position
                    }
                } else if (
                    runtime.vehicle.executeUavHubRelocateMission(approach, padContact, onTelemetry)
                ) {
                    var position = waitForPhysicalDockAtSlot(station, slot, timeoutMillis = 4_000)
                    if (position == null) {
                        runtime.vehicle.landAtHubParkingPad(padContact, onTelemetry)
                        position = waitForPhysicalDockAtSlot(station, slot)
                    }
                    if (position != null) {
                        runtime.vehicle.disarm()
                        runtime.vehicle.resetHomeAtCurrentPosition()
                        return position
                    }
                }
            }
            flyHubParkingCruise(station, slot, routeAgent, groundObstacles, onTelemetry)
            return landAndDockAtHubParkingSlot(station, slot, onTelemetry)
        }
        return driveUgvHubParkingMission(station, slot, routeAgent, groundObstacles, onTelemetry)
    }

    /** UGV: one AUTO mission (route waypoints + terminal waypoint at reserved pad). */
    private suspend fun driveUgvHubParkingMission(
        station: TransferStationDto,
        slot: StationSlotDto,
        routeAgent: TransportAgentDto,
        groundObstacles: List<GroundObstacle>,
        onTelemetry: suspend (Telemetry) -> Unit,
    ): GeoPoint? {
        val padContact = stations.slotParkedPosition(station, slot)
        println(
            "[${config.agentId}] AUTO hub parking mission to ${station.id} slot ${slot.index} " +
                "(${padContact.latitude.formatForLog()}, ${padContact.longitude.formatForLog()}).",
        )
        val route = runtime.planRouteToPoint(routeAgent, padContact, groundObstacles)
        val items = MissionBuilders.forUgvHubParkingMission(
            plannedWaypoints = route.waypoints,
            padContact = padContact,
        )
        if (!runtime.vehicle.executeMissionItems(items, onTelemetry)) {
            println("[${config.agentId}] UGV hub parking mission failed (no offboard dock fallback).")
            return null
        }
        runtime.consumeEnergy(route)
        var position = runtime.vehicle.telemetry().position
        if (!stations.physicallyLandedAtParkingSlot(position, station, slot)) {
            val distMeters = Geo.distanceMeters(position, padContact)
            if (distMeters <= 8.0) {
                println(
                    "[${config.agentId}] Mission ended ${distMeters.formatForLog()}m from ${station.id} " +
                        "slot ${slot.index}; fine-tuning drive to pad.",
                )
                runtime.vehicle.moveTo(padContact, onTelemetry)
                position = runtime.vehicle.telemetry().position
            }
        }
        if (!stations.physicallyLandedAtParkingSlot(position, station, slot)) {
            println(
                "[${config.agentId}] Mission ended but not on ${station.id} slot ${slot.index} pad " +
                    "(dist=${Geo.distanceMeters(position, padContact).formatForLog()}m).",
            )
            return null
        }
        runtime.vehicle.resetHomeAtCurrentPosition()
        return position
    }

    suspend fun landAndDockAtHubParkingSlot(
        station: TransferStationDto,
        slot: StationSlotDto,
        onTelemetry: suspend (Telemetry) -> Unit,
    ): GeoPoint? {
        if (config.agentType == AgentType.UGV) {
            return driveUgvHubParkingMission(
                station,
                slot,
                runtime.routingAgent(runtime.backend.getAgent(config.agentId), runtime.vehicle.telemetry()),
                runtime.groundObstacles(runtime.backend.networkState()),
                onTelemetry,
            )
        }
        println(
            "[${config.agentId}] Landing at ${station.id} slot ${slot.index} " +
                "(${slot.position.latitude.formatForLog()}, ${slot.position.longitude.formatForLog()}).",
        )
        val padContact = stations.slotParkedPosition(station, slot)
        repeat(3) { attempt ->
            runtime.vehicle.landAtHubParkingPad(padContact, onTelemetry)
            val position = waitForPhysicalDockAtSlot(station, slot, timeoutMillis = 8_000)
            if (position != null) {
                runtime.vehicle.disarm()
                runtime.vehicle.resetHomeAtCurrentPosition()
                return position
            }
            val telemetry = runtime.vehicle.telemetry().position
            println(
                "[${config.agentId}] Landing incomplete at ${station.id} slot ${slot.index} " +
                    "(attempt ${attempt + 1}/3): alt=${telemetry.altitudeMeters.formatForLog()}m " +
                    "dist=${Geo.distanceMeters(telemetry, stations.slotParkedPosition(station, slot)).formatForLog()}m",
            )
        }
        return waitForPhysicalDockAtSlot(station, slot)?.also {
            runtime.vehicle.disarm()
            runtime.vehicle.resetHomeAtCurrentPosition()
        }
    }

    suspend fun driveToHubParkingSlot(
        agent: TransportAgentDto,
        targetStation: TransferStationDto,
        slot: StationSlotDto,
        routeAgent: TransportAgentDto,
        groundObstacles: List<GroundObstacle>,
        reason: String,
        fromStationId: String?,
        stationSlots: List<StationSlotDto>,
        applyStagingMemory: Boolean,
        releaseReservationOnFailure: Boolean = true,
    ): Boolean {
        val routeToSlot = runtime.planRouteToPoint(
            routeAgent,
            stations.slotDrivePoint(targetStation, slot),
            groundObstacles,
        )
        if (routeToSlot.estimatedEnergyPercent + AgentControllerConstants.TASK_ROUTE_RESERVE_PERCENT >
            runtime.simulatedEnergyPercent
        ) {
            runtime.backend.releaseParkingSlot(slot.stationId, slot.index, config.agentId)
            ParkingDiagnostics.log(
                agentId = config.agentId,
                decision = "relocate-blocked",
                details = "insufficient energy for ${targetStation.id} ($reason)",
                agent = agent,
                stationSlots = stationSlots,
            )
            return false
        }

        ParkingDiagnostics.log(
            agentId = config.agentId,
            decision = "relocate-start",
            details = "$reason → ${targetStation.id} slot=${slot.index} dist=${routeToSlot.distanceMeters.formatForLog()}m",
            agent = agent,
            stationSlots = stationSlots,
        )
        val onDriveTelemetry = runtime.transitTelemetryCallback()
        val parkedPosition = flyAndDockAtHubParkingSlot(
            station = targetStation,
            slot = slot,
            routeAgent = routeAgent,
            groundObstacles = groundObstacles,
            onTelemetry = onDriveTelemetry,
        )
        if (parkedPosition == null) {
            val recovered = waitForPhysicalDockAtSlot(targetStation, slot)
            if (recovered != null) {
                runtime.vehicle.disarm()
                runtime.vehicle.resetHomeAtCurrentPosition()
                if (finalizeParkedAtHub(recovered, targetStation, slot)) {
                    if (applyStagingMemory) {
                        runtime.lastPackageStagingFromStationId = fromStationId
                        runtime.lastPackageStagingTargetStationId = targetStation.id
                        runtime.lastPackageStagingAtMs = System.currentTimeMillis()
                    }
                    ParkingDiagnostics.log(
                        agentId = config.agentId,
                        decision = "relocate-done",
                        details = "$reason at ${targetStation.id} (post-land recovery)",
                        agent = runtime.backend.getAgent(config.agentId),
                        stationSlots = stationSlots,
                    )
                    return true
                }
            }
            val telemetryPosition = runtime.vehicle.telemetry().position
            if (releaseReservationOnFailure &&
                !stations.physicallyLandedAtParkingSlot(telemetryPosition, targetStation, slot)
            ) {
                runtime.backend.releaseParkingSlot(slot.stationId, slot.index, config.agentId)
            }
            runtime.backend.updateAgentState(
                agentId = config.agentId,
                position = telemetryPosition,
                energyLevelPercent = runtime.simulatedEnergyPercent,
                status = AgentStatus.AVAILABLE,
                currentStationId = null,
            )
            ParkingDiagnostics.log(
                agentId = config.agentId,
                decision = if (releaseReservationOnFailure) "relocate-incomplete" else "rebalance-mission-incomplete",
                details = "${targetStation.id} slot ${slot.index} " +
                    "${Geo.distanceMeters(telemetryPosition, stations.slotParkedPosition(targetStation, slot)).formatForLog()}m " +
                    "from pad ($reason)" +
                    if (releaseReservationOnFailure) "" else "; reservation kept for retry",
                agent = agent,
                stationSlots = stationSlots,
            )
            return false
        }
        if (!finalizeParkedAtHub(parkedPosition, targetStation, slot)) {
            if (releaseReservationOnFailure &&
                !stations.physicallyLandedAtParkingSlot(parkedPosition, targetStation, slot)
            ) {
                runtime.backend.releaseParkingSlot(slot.stationId, slot.index, config.agentId)
            }
            runtime.backend.updateAgentState(
                agentId = config.agentId,
                position = parkedPosition,
                energyLevelPercent = runtime.simulatedEnergyPercent,
                status = AgentStatus.AVAILABLE,
                currentStationId = null,
            )
            ParkingDiagnostics.log(
                agentId = config.agentId,
                decision = "relocate-occupy-failed",
                details = "confirmParkingOccupancy failed at ${targetStation.id} slot ${slot.index} ($reason)",
                agent = agent,
                stationSlots = stationSlots,
            )
            return false
        }
        if (applyStagingMemory) {
            runtime.lastPackageStagingFromStationId = fromStationId
            runtime.lastPackageStagingTargetStationId = targetStation.id
            runtime.lastPackageStagingAtMs = System.currentTimeMillis()
        }
        ParkingDiagnostics.log(
            agentId = config.agentId,
            decision = "relocate-done",
            details = "$reason at ${targetStation.id}",
            agent = runtime.backend.getAgent(config.agentId),
            stationSlots = stationSlots,
        )
        return true
    }

    /**
     * After landing on a reserved pad: confirm occupancy in the backend (reservation → parking),
     * then sync telemetry. Relocation/package flows pass [stayBusy] while the task is still in progress.
     */
    suspend fun finalizeParkedAtHub(
        position: GeoPoint,
        station: TransferStationDto,
        slot: StationSlotDto,
        stayBusy: Boolean = false,
    ): Boolean {
        runtime.backend.updateAgentState(
            agentId = config.agentId,
            position = position,
            energyLevelPercent = runtime.simulatedEnergyPercent,
            status = if (stayBusy) AgentStatus.BUSY else AgentStatus.AVAILABLE,
            currentStationId = null,
        )
        val occupied = runCatching {
            runtime.backend.confirmParkingOccupancy(station.id, slot.index, config.agentId)
        }.onFailure { error ->
            println(
                "[${config.agentId}] confirmParkingOccupancy at ${station.id} slot ${slot.index} failed: " +
                    "${error.message}",
            )
        }.isSuccess
        if (!occupied) {
            return false
        }
        runtime.backend.updateAgentState(
            agentId = config.agentId,
            position = position,
            energyLevelPercent = runtime.simulatedEnergyPercent,
            status = if (stayBusy) AgentStatus.BUSY else AgentStatus.AVAILABLE,
            currentStationId = station.id,
        )
        if (!stayBusy &&
            runtime.simulatedEnergyPercent < AgentControllerConstants.FULL_ENERGY_PERCENT
        ) {
            runtime.chargeAtStation(position, station.id, stations)
        }
        println(
            "[${config.agentId}] Parked at ${station.id} slot ${slot.index}; " +
                "reservation converted to occupancy.",
        )
        return true
    }
}
