package pl.edu.wat.uavlogistics.backend

import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import pl.edu.wat.uavlogistics.backend.persistence.DatabaseFactory
import pl.edu.wat.uavlogistics.backend.persistence.TransportAgentsTable
import pl.edu.wat.uavlogistics.backend.persistence.TransferStationsTable
import pl.edu.wat.uavlogistics.backend.persistence.toAgentDto
import pl.edu.wat.uavlogistics.backend.service.ConflictException
import pl.edu.wat.uavlogistics.backend.service.StationSlotService
import pl.edu.wat.uavlogistics.common.AgentStatus
import pl.edu.wat.uavlogistics.common.AgentType
import pl.edu.wat.uavlogistics.common.GeoPoint
import pl.edu.wat.uavlogistics.common.StationSlotKind
import pl.edu.wat.uavlogistics.common.StationSlots
import pl.edu.wat.uavlogistics.common.StationStatus
import pl.edu.wat.uavlogistics.common.TransferStationDto
import pl.edu.wat.uavlogistics.common.TransportAgentDto
import java.util.UUID

class StationSlotServiceTest {
    private val station = TransferStationDto(
        id = TestIds.str(TestIds.STATION_TRANSFER),
        name = "Transfer",
        position = GeoPoint(47.397971, 8.546164, 0.0),
        storageCapacity = 4,
        occupiedStorage = 0,
        parkingCapacity = 2,
        occupiedParking = 2,
        status = StationStatus.ACTIVE,
    )

    private fun agent(
        agentId: UUID,
        slotOffsetLon: Double,
        stationId: UUID = TestIds.STATION_TRANSFER,
    ) = TransportAgentDto(
        id = TestIds.str(agentId),
        type = AgentType.UAV,
        position = GeoPoint(47.397971, 8.546164 + slotOffsetLon, 0.0),
        energyLevelPercent = 100.0,
        maxRangeMeters = 650.0,
        payloadCapacityKg = 5.0,
        status = AgentStatus.AVAILABLE,
        currentStationId = TestIds.str(stationId),
    )

    private fun prepareDatabase(stationDto: TransferStationDto = station, agents: List<TransportAgentDto>) {
        DatabaseFactory.init(h2Config())
        transaction {
            TransferStationsTable.insert {
                it[id] = UUID.fromString(stationDto.id)
                it[name] = stationDto.name
                it[lat] = stationDto.position.latitude
                it[lon] = stationDto.position.longitude
                it[alt] = stationDto.position.altitudeMeters
                it[storageCapacity] = stationDto.storageCapacity
                it[occupiedStorage] = stationDto.occupiedStorage
                it[parkingCapacity] = stationDto.parkingCapacity
                it[occupiedParking] = stationDto.occupiedParking
                it[status] = stationDto.status
            }
            agents.forEach { a ->
                TransportAgentsTable.insert {
                    it[id] = UUID.fromString(a.id)
                    it[type] = a.type
                    it[lat] = a.position.latitude
                    it[lon] = a.position.longitude
                    it[alt] = a.position.altitudeMeters
                    it[energyLevelPercent] = a.energyLevelPercent
                    it[maxRangeMeters] = a.maxRangeMeters
                    it[payloadCapacityKg] = a.payloadCapacityKg
                    it[status] = a.status
                    it[currentStationId] = a.currentStationId?.let(UUID::fromString)
                }
            }
        }
    }

    @Test
    fun `snapshot keeps return reservation on correct index when dock registry is cleared`() {
        prepareDatabase(agents = listOf(agent(TestIds.UAV_1, 0.0), agent(TestIds.UAV_2, 0.00003)))
        val service = StationSlotService()
        service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_1))
        service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_2))
        val uav2InFlight = agent(TestIds.UAV_2, 0.00003).copy(
            currentStationId = null,
            status = AgentStatus.BUSY,
        )
        transaction {
            TransportAgentsTable.update({ TransportAgentsTable.id eq TestIds.UAV_2 }) {
                it[currentStationId] = null
                it[status] = AgentStatus.BUSY
            }
        }
        val slots = service.snapshot(listOf(station), listOf(agent(TestIds.UAV_1, 0.0), uav2InFlight), emptyList())
        val parking = slots.filter { it.kind == StationSlotKind.PARKING }
        assertEquals(TestIds.str(TestIds.UAV_1), parking.first { it.reservedByAgentId == TestIds.str(TestIds.UAV_1) }.reservedByAgentId)
        assertEquals(TestIds.str(TestIds.UAV_2), parking.first { it.reservedByAgentId == TestIds.str(TestIds.UAV_2) }.reservedByAgentId)
    }

    @Test
    fun `agent can reserve its own parking slot when station parking is full`() {
        prepareDatabase(agents = listOf(agent(TestIds.UAV_1, 0.0), agent(TestIds.UAV_2, 0.00003)))
        val service = StationSlotService()

        val slotForUav1 = service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_1))
        val slotForUav2 = service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_2))

        org.junit.jupiter.api.Assertions.assertNotEquals(slotForUav1.index, slotForUav2.index)
        org.junit.jupiter.api.Assertions.assertTrue(slotForUav1.index in 0..1)
        org.junit.jupiter.api.Assertions.assertTrue(slotForUav2.index in 0..1)
    }

    @Test
    fun `reserve is exclusive per slot index like task claim`() {
        prepareDatabase(agents = emptyList())
        val service = StationSlotService()
        val first = service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_1))
        val second = service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_2))
        assertEquals(0, first.index)
        assertEquals(1, second.index)
        assertEquals(false, first.reservationEphemeral)
        assertEquals(false, second.reservationEphemeral)
        val third = service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_3), allowEphemeral = true)
        assertEquals(true, third.reservationEphemeral)
        assertThrows<ConflictException> {
            service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_4), allowEphemeral = true)
        }
    }

    @Test
    fun `reservation is kept while agent is busy in flight to reserved hub`() {
        val west = station.copy(id = TestIds.str(TestIds.STATION_WEST), parkingCapacity = 1)
        val uav = agent(TestIds.UAV_1, 0.0, TestIds.STATION_EAST).copy(
            currentStationId = null,
            status = AgentStatus.BUSY,
        )
        prepareDatabase(west, agents = listOf(uav))
        val service = StationSlotService()
        service.reserveParkingSlot(west.id, TestIds.str(TestIds.UAV_1))
        val slots = service.snapshot(listOf(west), listOf(uav), emptyList())
        val parking = slots.first { it.kind == StationSlotKind.PARKING }
        assertEquals(TestIds.str(TestIds.UAV_1), parking.reservedByAgentId)
    }

    @Test
    fun `reservation is released when agent leaves hub with null current station`() {
        prepareDatabase(agents = listOf(agent(TestIds.UAV_1, 0.0)))
        val service = StationSlotService()
        service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_1))
        transaction {
            TransportAgentsTable.update({ TransportAgentsTable.id eq TestIds.UAV_1 }) {
                it[currentStationId] = null
                it[lat] = 0.0
                it[lon] = 0.0
            }
        }
        val cleared = transaction {
            TransportAgentsTable.selectAll().map { row -> row.toAgentDto() }
        }.first { dto -> dto.id == TestIds.str(TestIds.UAV_1) }
        val slots = service.snapshot(listOf(station), listOf(cleared), emptyList())
        val parking = slots.filter { it.kind == StationSlotKind.PARKING }
        org.junit.jupiter.api.Assertions.assertTrue(parking.all { it.reservedByAgentId == null })
    }

    @Test
    fun `overbook allows ephemeral reservation when capacity is full`() {
        val singleSlotStation = station.copy(parkingCapacity = 1, occupiedParking = 1)
        prepareDatabase(singleSlotStation, listOf(agent(TestIds.UAV_1, 0.0, TestIds.STATION_TRANSFER)))
        val service = StationSlotService()
        service.reserveParkingSlot(singleSlotStation.id, TestIds.str(TestIds.UAV_1))
        val slotForUgv = service.reserveParkingSlot(singleSlotStation.id, TestIds.str(TestIds.UGV_1), allowEphemeral = true)
        assertEquals(0, slotForUgv.index)
        assertEquals(true, slotForUgv.reservationEphemeral)
        assertEquals(TestIds.str(TestIds.UAV_1), slotForUgv.expectsVacateByAgentId)
    }

    @Test
    fun `snapshot exposes ephemeral waiter for parking load`() {
        val singleSlotStation = station.copy(parkingCapacity = 1, occupiedParking = 1)
        val docked = agent(TestIds.UAV_1, 0.0, TestIds.STATION_TRANSFER)
        val ugvWaiter = agent(TestIds.UGV_1, 0.00003, TestIds.STATION_OTHER)
        prepareDatabase(singleSlotStation, listOf(docked, ugvWaiter))
        val service = StationSlotService()
        service.reserveParkingSlot(singleSlotStation.id, TestIds.str(TestIds.UAV_1))
        service.reserveParkingSlot(singleSlotStation.id, TestIds.str(TestIds.UGV_1), allowEphemeral = true)
        val slots = service.snapshot(listOf(singleSlotStation), listOf(docked, ugvWaiter), emptyList())
        val parking = slots.first { it.kind == StationSlotKind.PARKING && it.index == 0 }
        assertEquals(TestIds.str(TestIds.UAV_1), parking.occupiedByAgentId)
        assertEquals(TestIds.str(TestIds.UGV_1), parking.ephemeralWaiterAgentId)
        assertEquals(true, parking.reservationEphemeral)
    }

    @Test
    fun `ephemeral reservation promotes when occupant leaves hub`() {
        val singleSlotStation = station.copy(parkingCapacity = 1, occupiedParking = 1)
        val docked = agent(TestIds.UAV_1, 0.0, TestIds.STATION_TRANSFER)
        val ugvAtOtherHub = agent(TestIds.UGV_1, 0.00003, TestIds.STATION_OTHER)
        prepareDatabase(singleSlotStation, listOf(docked, ugvAtOtherHub))
        val service = StationSlotService()
        service.reserveParkingSlot(singleSlotStation.id, TestIds.str(TestIds.UAV_1))
        service.reserveParkingSlot(singleSlotStation.id, TestIds.str(TestIds.UGV_1), allowEphemeral = true)
        val uavGone = docked.copy(currentStationId = null, position = GeoPoint(0.0, 0.0, 0.0))
        transaction {
            TransportAgentsTable.update({ TransportAgentsTable.id eq TestIds.UAV_1 }) {
                it[currentStationId] = null
                it[lat] = 0.0
                it[lon] = 0.0
            }
        }
        val slots = service.snapshot(listOf(singleSlotStation), listOf(uavGone, ugvAtOtherHub), emptyList())
        val ugvSlot = slots.first { it.kind == StationSlotKind.PARKING }
        assertEquals(false, ugvSlot.reservationEphemeral)
        assertEquals(TestIds.str(TestIds.UGV_1), ugvSlot.reservedByAgentId)
    }

    @Test
    fun `multi-slot station allows one ephemeral when real slots are full`() {
        val docked = listOf(agent(TestIds.UAV_1, 0.0), agent(TestIds.UAV_2, 0.00003))
        val thirdWaiter = agent(TestIds.UAV_3, 0.00006, TestIds.STATION_OTHER)
        prepareDatabase(agents = docked + thirdWaiter)
        val service = StationSlotService()
        service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_1))
        service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_2))
        val slotForThird = service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_3), allowEphemeral = true)
        assertEquals(true, slotForThird.reservationEphemeral)
        org.junit.jupiter.api.Assertions.assertTrue(
            slotForThird.expectsVacateByAgentId in setOf(TestIds.str(TestIds.UAV_1), TestIds.str(TestIds.UAV_2)),
        )
    }

    @Test
    fun `multi-slot cannot exceed capacity plus overbook margin`() {
        val docked = listOf(agent(TestIds.UAV_1, 0.0), agent(TestIds.UAV_2, 0.00003))
        val thirdWaiter = agent(TestIds.UAV_3, 0.00006, TestIds.STATION_OTHER)
        val fourthWaiter = agent(TestIds.UAV_4, 0.00009, TestIds.STATION_OTHER)
        prepareDatabase(agents = docked + thirdWaiter + fourthWaiter)
        val service = StationSlotService()
        service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_1))
        service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_2))
        service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_3), allowEphemeral = true)
        assertThrows<ConflictException> {
            service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_4), allowEphemeral = true)
        }
    }

    @Test
    fun `ephemeral promotes to freed slot index on multi-slot station`() {
        val threeSlotStation = station.copy(parkingCapacity = 3, occupiedParking = 3)
        val docked = listOf(
            agent(TestIds.UAV_1, 0.0, TestIds.STATION_TRANSFER),
            agent(TestIds.UAV_2, 0.00003, TestIds.STATION_TRANSFER),
            agent(TestIds.UAV_3, 0.00006, TestIds.STATION_TRANSFER),
        )
        val fourthWaiter = agent(TestIds.UAV_4, 0.00009, TestIds.STATION_OTHER)
        prepareDatabase(threeSlotStation, docked + fourthWaiter)
        val service = StationSlotService()
        service.reserveParkingSlot(threeSlotStation.id, TestIds.str(TestIds.UAV_1))
        val slotUav2 = service.reserveParkingSlot(threeSlotStation.id, TestIds.str(TestIds.UAV_2))
        service.reserveParkingSlot(threeSlotStation.id, TestIds.str(TestIds.UAV_3))
        service.reserveParkingSlot(threeSlotStation.id, TestIds.str(TestIds.UAV_4), allowEphemeral = true)
        service.releaseParkingSlot(threeSlotStation.id, slotUav2.index, TestIds.str(TestIds.UAV_2))
        val uav2Id = TestIds.str(TestIds.UAV_2)
        val slots = service.snapshot(
            listOf(threeSlotStation),
            docked.filter { it.id != uav2Id } + fourthWaiter,
            emptyList(),
        )
        val promotedSlot = slots.first { it.kind == StationSlotKind.PARKING && it.index == slotUav2.index }
        assertEquals(false, promotedSlot.reservationEphemeral)
        assertEquals(TestIds.str(TestIds.UAV_4), promotedSlot.reservedByAgentId)
    }

    @Test
    fun `reconcile keeps reservation while agent is busy in transit to reserved hub`() {
        val ugv = agent(TestIds.UGV_1, 0.0, TestIds.STATION_OTHER).copy(
            type = AgentType.UGV,
            status = AgentStatus.BUSY,
            currentStationId = null,
        )
        prepareDatabase(agents = listOf(ugv))
        val service = StationSlotService()
        service.reserveParkingSlot(station.id, TestIds.str(TestIds.UGV_1))
        val slots = service.snapshot(listOf(station), listOf(ugv), emptyList())
        val parking = slots.first { it.kind == StationSlotKind.PARKING && it.reservedByAgentId == TestIds.str(TestIds.UGV_1) }
        assertEquals(TestIds.str(TestIds.UGV_1), parking.reservedByAgentId)
        assertEquals(false, parking.reservationEphemeral)
    }

    @Test
    fun `single-slot cannot exceed capacity plus overbook margin`() {
        val singleSlotStation = station.copy(parkingCapacity = 1, occupiedParking = 1)
        val docked = agent(TestIds.UAV_1, 0.0, TestIds.STATION_TRANSFER)
        val withPeer = agent(TestIds.UGV_1, 0.00003, TestIds.STATION_OTHER)
        val thirdWaiter = agent(TestIds.UAV_2, 0.00006, TestIds.STATION_OTHER)
        prepareDatabase(singleSlotStation, listOf(docked, withPeer, thirdWaiter))
        val service = StationSlotService()
        service.reserveParkingSlot(singleSlotStation.id, TestIds.str(TestIds.UAV_1))
        service.reserveParkingSlot(singleSlotStation.id, TestIds.str(TestIds.UGV_1), allowEphemeral = true)
        assertThrows<ConflictException> {
            service.reserveParkingSlot(singleSlotStation.id, TestIds.str(TestIds.UAV_2), allowEphemeral = true)
        }
    }

    @Test
    fun `full station rejects reserve when ephemeral is not allowed`() {
        prepareDatabase(agents = listOf(agent(TestIds.UAV_1, 0.0), agent(TestIds.UAV_2, 0.00003)))
        val service = StationSlotService()
        service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_1))
        service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_2))
        assertThrows<ConflictException> {
            service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_3), allowEphemeral = false)
        }
    }

    @Test
    fun `confirm occupancy on second pad while peer occupies first pad`() {
        val uav = agent(TestIds.UAV_SCENARIO_2, 0.0)
        val ugv = agent(TestIds.UGV_SCENARIO_2, 0.0).copy(type = AgentType.UGV)
        prepareDatabase(agents = listOf(uav, ugv))
        val service = StationSlotService()
        service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_SCENARIO_2))
        service.reserveParkingSlot(station.id, TestIds.str(TestIds.UGV_SCENARIO_2))
        val pad1 = StationSlots.parkingSlot(station, 1).position
        transaction {
            TransportAgentsTable.update({ TransportAgentsTable.id eq TestIds.UGV_SCENARIO_2 }) {
                it[lat] = pad1.latitude
                it[lon] = pad1.longitude
                it[currentStationId] = null
                it[status] = AgentStatus.BUSY
            }
        }
        val confirmed = service.confirmParkingOccupancy(station.id, 1, TestIds.str(TestIds.UGV_SCENARIO_2))
        assertEquals(1, confirmed.index)
        assertEquals(TestIds.str(TestIds.UGV_SCENARIO_2), confirmed.occupiedByAgentId)
        val slots = service.snapshot(
            listOf(station),
            listOf(uav, ugv.copy(position = pad1, currentStationId = station.id, status = AgentStatus.AVAILABLE)),
            emptyList(),
        )
        assertEquals(TestIds.str(TestIds.UAV_SCENARIO_2), slots.first { it.index == 0 }.reservedByAgentId)
        assertEquals(TestIds.str(TestIds.UGV_SCENARIO_2), slots.first { it.index == 1 }.occupiedByAgentId)
    }

    @Test
    fun `re-reserve switches ephemeral waiter to a freed real slot`() {
        prepareDatabase(agents = listOf(agent(TestIds.UAV_1, 0.0), agent(TestIds.UAV_2, 0.00003), agent(TestIds.UAV_3, 0.00006)))
        val service = StationSlotService()
        val slotUav1 = service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_1))
        service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_2))
        val waiting = service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_3), allowEphemeral = true)
        assertEquals(true, waiting.reservationEphemeral)
        service.releaseParkingSlot(station.id, slotUav1.index, TestIds.str(TestIds.UAV_1))
        val promoted = service.reserveParkingSlot(station.id, TestIds.str(TestIds.UAV_3), allowEphemeral = true)
        assertEquals(false, promoted.reservationEphemeral)
        assertEquals(slotUav1.index, promoted.index)
    }
}
