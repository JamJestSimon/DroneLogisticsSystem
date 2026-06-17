package pl.edu.wat.uavlogistics.backend.service

import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import pl.edu.wat.uavlogistics.backend.persistence.ShipmentsTable
import pl.edu.wat.uavlogistics.backend.persistence.TransferStationsTable
import pl.edu.wat.uavlogistics.backend.persistence.TransportAgentsTable
import pl.edu.wat.uavlogistics.backend.persistence.toAgentDto
import pl.edu.wat.uavlogistics.backend.persistence.toShipmentDto
import pl.edu.wat.uavlogistics.backend.persistence.toStationDto
import pl.edu.wat.uavlogistics.common.GeoPoint
import pl.edu.wat.uavlogistics.common.ShipmentDto
import pl.edu.wat.uavlogistics.common.ShipmentStatus
import pl.edu.wat.uavlogistics.common.StationSlots
import pl.edu.wat.uavlogistics.common.StationStatus
import pl.edu.wat.uavlogistics.common.TransferStationDto
import pl.edu.wat.uavlogistics.common.TransportAgentDto

class SimulationStartupService(
    private val simulation: GazeboSimulationService,
) {
    fun restoreRegistryVisuals() {
        if (simulation.startGazebo()) {
            Thread.sleep((System.getenv("SIMULATION_GAZEBO_STARTUP_DELAY_MS") ?: "7000").toLong())
        }

        val snapshot = transaction {
            StartupSnapshot(
                shipments = ShipmentsTable.selectAll().map { it.toShipmentDto() },
                stations = TransferStationsTable.selectAll().map { it.toStationDto() },
                agents = TransportAgentsTable.selectAll().map { it.toAgentDto() },
            )
        }

        val stationsById = snapshot.stations.associateBy { it.id }
        val agentsById = snapshot.agents.associateBy { it.id }

        snapshot.stations
            .filter { it.status != StationStatus.INACTIVE }
            .forEach { simulation.spawnStation(it.id, it.position, it.parkingCapacity, it.storageCapacity) }

        if ((System.getenv("SIMULATION_RESTORE_AGENT_VISUALS") ?: "false").toBoolean()) {
            snapshot.agents
                .filter { it.status.isSimulationActive() }
                .forEach { simulation.spawnAgentModel(it.id, it.type, it.position) }
        }

        snapshot.shipments.forEach { shipment ->
            when (shipment.status) {
                ShipmentStatus.DELIVERED,
                ShipmentStatus.CANCELLED -> simulation.removePackage(shipment.id)
                ShipmentStatus.IN_TRANSIT -> {
                    val agent = shipment.carryingAgentId?.let { agentsById[it] }
                    if (agent != null) {
                        simulation.pickupVisual(shipment.id, agent.position, agent.type)
                    } else {
                        simulation.spawnPackage(shipment.id, shipment.origin)
                    }
                }
                else -> packagePosition(shipment, snapshot.shipments, stationsById, agentsById)
                    ?.let { simulation.spawnPackage(shipment.id, it) }
            }
        }
    }

    private fun packagePosition(
        shipment: ShipmentDto,
        shipments: List<ShipmentDto>,
        stations: Map<String, TransferStationDto>,
        agents: Map<String, TransportAgentDto>,
    ): GeoPoint? = when (shipment.status) {
        ShipmentStatus.IN_TRANSIT -> null
        ShipmentStatus.AT_STATION -> storagePosition(shipment, shipments, stations) ?: shipment.origin
        ShipmentStatus.CREATED,
        ShipmentStatus.WAITING,
        ShipmentStatus.ASSIGNED -> shipment.origin
        ShipmentStatus.DELIVERED,
        ShipmentStatus.CANCELLED -> null
    }

    private fun storagePosition(
        shipment: ShipmentDto,
        shipments: List<ShipmentDto>,
        stations: Map<String, TransferStationDto>,
    ): GeoPoint? {
        val stationId = shipment.currentStationId ?: return null
        val station = stations[stationId] ?: return null
        val storedShipmentIds = shipments
            .filter { it.status == ShipmentStatus.AT_STATION && it.currentStationId == stationId }
            .map { it.id }
            .sorted()
        val index = storedShipmentIds.indexOf(shipment.id).takeIf { it >= 0 } ?: 0
        return StationSlots.storageSlot(station, index).position
    }

    private data class StartupSnapshot(
        val shipments: List<ShipmentDto>,
        val stations: List<TransferStationDto>,
        val agents: List<TransportAgentDto>,
    )

    private fun pl.edu.wat.uavlogistics.common.AgentStatus.isSimulationActive(): Boolean = when (this) {
        pl.edu.wat.uavlogistics.common.AgentStatus.AVAILABLE,
        pl.edu.wat.uavlogistics.common.AgentStatus.BUSY,
        pl.edu.wat.uavlogistics.common.AgentStatus.CHARGING -> true
        pl.edu.wat.uavlogistics.common.AgentStatus.PENDING_ACTIVATION,
        pl.edu.wat.uavlogistics.common.AgentStatus.ARMING,
        pl.edu.wat.uavlogistics.common.AgentStatus.WITHDRAWING,
        pl.edu.wat.uavlogistics.common.AgentStatus.INACTIVE -> false
    }
}
