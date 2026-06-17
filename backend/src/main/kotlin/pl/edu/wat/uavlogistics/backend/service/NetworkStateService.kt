package pl.edu.wat.uavlogistics.backend.service

import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import pl.edu.wat.uavlogistics.backend.persistence.ShipmentsTable
import pl.edu.wat.uavlogistics.backend.persistence.TransferStationsTable
import pl.edu.wat.uavlogistics.backend.persistence.TransportAgentsTable
import pl.edu.wat.uavlogistics.backend.persistence.TransportTasksTable
import pl.edu.wat.uavlogistics.backend.persistence.toAgentDto
import pl.edu.wat.uavlogistics.backend.persistence.toShipmentDto
import pl.edu.wat.uavlogistics.backend.persistence.toStationDto
import pl.edu.wat.uavlogistics.backend.persistence.toTaskDto
import pl.edu.wat.uavlogistics.common.NetworkStateDto
import pl.edu.wat.uavlogistics.common.ShipmentStatus
import pl.edu.wat.uavlogistics.common.StationSlotKind
import kotlin.math.min

class NetworkStateService(
    private val stationSlots: StationSlotService = StationSlotService(),
    private val fleetRangeSettings: FleetRangeSettingsService = FleetRangeSettingsService(),
) {
    fun snapshot(): NetworkStateDto = transaction {
        val shipments = ShipmentsTable.selectAll().map { it.toShipmentDto() }
        val tasks = TransportTasksTable.selectAll().map { it.toTaskDto() }
        val agents = TransportAgentsTable.selectAll().map { it.toAgentDto() }
        val storageCounts = shipments
            .filter { it.status == ShipmentStatus.AT_STATION }
            .mapNotNull { it.currentStationId }
            .groupingBy { it }
            .eachCount()
        val stations = TransferStationsTable.selectAll().map { it.toStationDto() }
        val slots = stationSlots.snapshot(stations, agents, shipments)
        val stationsWithCounts = stations.map { station ->
            val parkingHolderIds = slots
                .filter { slot ->
                    slot.stationId == station.id && slot.kind == StationSlotKind.PARKING
                }
                .flatMap { slot ->
                    listOfNotNull(
                        slot.occupiedByAgentId,
                        slot.reservedByAgentId,
                        slot.ephemeralWaiterAgentId,
                    )
                }
                .toSet()
            station.copy(
                occupiedStorage = storageCounts[station.id] ?: 0,
                occupiedParking = min(
                    stationSlots.maxParkingHolders(station),
                    parkingHolderIds.size,
                ),
            )
        }
        NetworkStateDto(
            shipments = shipments,
            tasks = tasks,
            agents = agents,
            stations = stationsWithCounts,
            stationSlots = slots,
            fleetRangeSettings = fleetRangeSettings.current(),
        )
    }
}
