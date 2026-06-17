package pl.edu.wat.uavlogistics.backend.service

import org.jetbrains.exposed.exceptions.ExposedSQLException
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update
import pl.edu.wat.uavlogistics.backend.persistence.ParkingSlotReservationsTable
import pl.edu.wat.uavlogistics.backend.persistence.TransferStationsTable
import pl.edu.wat.uavlogistics.backend.persistence.TransportAgentsTable
import pl.edu.wat.uavlogistics.backend.persistence.toAgentDto
import pl.edu.wat.uavlogistics.backend.persistence.toStationDto
import pl.edu.wat.uavlogistics.common.AgentStatus
import pl.edu.wat.uavlogistics.common.Geo
import pl.edu.wat.uavlogistics.common.GeoPoint
import pl.edu.wat.uavlogistics.common.LogisticsConstants
import pl.edu.wat.uavlogistics.common.ShipmentDto
import pl.edu.wat.uavlogistics.common.ShipmentStatus
import pl.edu.wat.uavlogistics.common.StationSlotDto
import pl.edu.wat.uavlogistics.common.StationSlotKind
import pl.edu.wat.uavlogistics.common.StationSlots
import pl.edu.wat.uavlogistics.common.TransferStationDto
import pl.edu.wat.uavlogistics.common.TransportAgentDto
import pl.edu.wat.uavlogistics.common.parseEntityId
import pl.edu.wat.uavlogistics.common.parseEntityIdOrNull
import java.sql.SQLIntegrityConstraintViolationException

class StationSlotService {
    /**
     * Extra ephemeral reservation per station (virtual slot index = capacity + 1).
     * When a real slot frees, the waiter is promoted to that index (single- or multi-slot).
     */
    val parkingOverbookMargin: Int =
        (System.getenv("STATION_PARKING_OVERBOOK_MARGIN") ?: "1").toIntOrNull()?.coerceAtLeast(0) ?: 1

    fun maxParkingHolders(station: TransferStationDto): Int =
        station.parkingCapacity + if (allowsParkingOverbook()) parkingOverbookMargin else 0

    fun allowsParkingOverbook(): Boolean = parkingOverbookMargin > 0

    private data class Reservation(
        val stationId: String,
        val slotIndex: Int,
        val agentId: String,
        val ephemeral: Boolean = false,
        val expectsVacateBy: String? = null,
    )

    /**
     * Atomically reserves a parking slot (DB transaction + row lock on station + unique index on real slots).
     * Same pattern as [TaskService.claimTask]: read state, decide, insert; concurrent claim loses with conflict.
     */
    fun reserveParkingSlot(
        stationId: String,
        agentId: String,
        allowEphemeral: Boolean = false,
    ): StationSlotDto = transaction { reserveParkingSlotAtomic(stationId, agentId, allowEphemeral) }

    /** Must run inside an existing [transaction] (e.g. agent registration). */
    internal fun reserveParkingSlotAtomic(
        stationId: String,
        agentId: String,
        allowEphemeral: Boolean = false,
    ): StationSlotDto {
        lockStationForUpdate(stationId)
        val station = findStationRow(stationId).toStationDto()
        val agents = TransportAgentsTable.selectAll().map { it.toAgentDto() }
        val reservationsByAgentId = loadReservationsByAgentId()
        return reserveParkingSlot(station, agents, reservationsByAgentId, agentId, allowEphemeral)
    }

    internal fun reserveParkingSlot(
        station: TransferStationDto,
        agents: List<TransportAgentDto>,
        agentId: String,
        allowEphemeral: Boolean = false,
    ): StationSlotDto = transaction {
        lockStationForUpdate(station.id)
        val reservationsByAgentId = loadReservationsByAgentId()
        reserveParkingSlot(station, agents, reservationsByAgentId, agentId, allowEphemeral)
    }

    private fun reserveParkingSlot(
        station: TransferStationDto,
        agents: List<TransportAgentDto>,
        reservationsByAgentId: MutableMap<String, Reservation>,
        agentId: String,
        allowEphemeral: Boolean,
    ): StationSlotDto {
        repeat(MAX_RESERVE_ATTEMPTS) { attempt ->
            val result = tryReserveParkingSlot(station, agents, reservationsByAgentId, agentId, allowEphemeral)
            if (result != null) {
                return result
            }
            if (attempt == MAX_RESERVE_ATTEMPTS - 1) {
                throw ConflictException("No parking/charging slot is available at station ${station.id}.")
            }
            reservationsByAgentId.clear()
            reservationsByAgentId.putAll(loadReservationsByAgentId())
        }
        throw ConflictException("No parking/charging slot is available at station ${station.id}.")
    }

    private fun tryReserveParkingSlot(
        station: TransferStationDto,
        agents: List<TransportAgentDto>,
        reservationsByAgentId: MutableMap<String, Reservation>,
        agentId: String,
        allowEphemeral: Boolean,
    ): StationSlotDto? {
        val stationId = station.id
        reconcileReservations(agents, reservationsByAgentId)
        promoteEphemeralReservations(station, agents, reservationsByAgentId)
        reservationsByAgentId[agentId]
            ?.takeIf { it.stationId == stationId }
            ?.let { existing ->
                if (existing.ephemeral) {
                    promoteEphemeralReservations(station, agents, reservationsByAgentId)
                }
                val refreshed = reservationsByAgentId[agentId]
                    ?.takeIf { it.stationId == stationId }
                    ?: existing
                return toParkingSlotDto(station, refreshed)
            }

        if (reservationsByAgentId[agentId]?.stationId != stationId) {
            deleteReservation(agentId)
            reservationsByAgentId.remove(agentId)
        }

        val occupiedByIndex = occupiedParkingByIndex(station, agents, reservationsByAgentId)
        val ownParkingIndex = occupiedByIndex.entries.firstOrNull { it.value == agentId }?.key
        val occupiedIndexes = occupiedByIndex.filter { it.value != agentId }.keys
        val reservedIndexes = reservationsByAgentId.values
            .filter { it.stationId == stationId && it.agentId != agentId && !it.ephemeral }
            .map { it.slotIndex }
            .toSet()
        val holderIds = buildSet {
            occupiedByIndex.values.filter { it != agentId }.forEach { add(it) }
            reservationsByAgentId.values
                .filter { it.stationId == stationId && it.agentId != agentId }
                .forEach { add(it.agentId) }
        }
        val ephemeralWaiters = reservationsByAgentId.values.count {
            it.stationId == stationId && it.ephemeral && it.agentId != agentId
        }
        val holdersAtStation = holderIds.size
        val maxHolders = maxParkingHolders(station)
        val blockingOccupant = occupiedIndexes.minOrNull()?.let { occupiedByIndex[it] }

        val reservation = when {
            ownParkingIndex != null && ownParkingIndex !in reservedIndexes -> {
                Reservation(stationId, ownParkingIndex, agentId)
            }
            (0 until station.parkingCapacity).firstOrNull { index ->
                index !in occupiedIndexes && index !in reservedIndexes
            } != null -> {
                val index = (0 until station.parkingCapacity)
                    .first { index -> index !in occupiedIndexes && index !in reservedIndexes }
                Reservation(stationId, index, agentId)
            }
            allowEphemeral &&
                allowsParkingOverbook() &&
                holdersAtStation < maxHolders &&
                ephemeralWaiters < parkingOverbookMargin -> {
                println(
                    "[PARKING][backend] ephemeral overbook agent=$agentId station=$stationId " +
                        "virtualSlot=${station.parkingCapacity + 1} expectsVacateBy=${blockingOccupant ?: "none"}",
                )
                Reservation(
                    stationId = stationId,
                    slotIndex = station.parkingCapacity + ephemeralWaiters,
                    agentId = agentId,
                    ephemeral = true,
                    expectsVacateBy = blockingOccupant,
                )
            }
            else -> null
        } ?: return null

        return try {
            persistReservation(reservation)
            reservationsByAgentId[agentId] = reservation
            val overbooked = reservation.ephemeral || holdersAtStation >= station.parkingCapacity
            println(
                "[PARKING][backend] reserve agent=$agentId station=${station.id} slot=${reservation.slotIndex} " +
                    "(occupied=${occupiedIndexes.sorted()}, reserved=${reservedIndexes.sorted()}" +
                    (if (overbooked) ", overbooked" else "") +
                    (if (reservation.ephemeral) ", ephemeral" else "") +
                    ")",
            )
            toParkingSlotDto(station, reservation)
        } catch (exception: ConflictException) {
            if (exception.message?.contains("another agent") == true) {
                null
            } else {
                throw exception
            }
        }
    }

    fun releaseParkingSlot(stationId: String, slotIndex: Int, agentId: String?) {
        transaction {
            lockStationForUpdate(stationId)
            val reservationsByAgentId = loadReservationsByAgentId()
            releaseParkingSlot(stationId, slotIndex, agentId, reservationsByAgentId)
        }
    }

    private fun releaseParkingSlot(
        stationId: String,
        slotIndex: Int,
        agentId: String?,
        reservationsByAgentId: MutableMap<String, Reservation>,
    ) {
        
        val matching = reservationsByAgentId.values.firstOrNull {
            it.stationId == stationId &&
                (it.slotIndex == slotIndex || it.ephemeral) &&
                (agentId == null || it.agentId == agentId)
        }
        val releasedRealSlot = matching != null && !matching.ephemeral && slotIndex >= 0
        if (matching != null) {
            println(
                "[PARKING][backend] release agent=${matching.agentId} station=${matching.stationId} " +
                    "slot=${matching.slotIndex} ephemeral=${matching.ephemeral}",
            )
            deleteReservation(matching.agentId)
            reservationsByAgentId.remove(matching.agentId)
        }
        if (releasedRealSlot) {
            promoteEphemeralToSlot(stationId, slotIndex, reservationsByAgentId)
        }
    }

    fun releaseAgent(agentId: String) {
        transaction {
            deleteReservation(agentId)
        }
    }

    /**
     * After the vehicle has landed on a reserved pad: dock at the station, drop the reservation row,
     * and expose the agent as [StationSlotDto.occupiedByAgentId] on that index.
     */
    fun confirmParkingOccupancy(stationId: String, slotIndex: Int, agentId: String): StationSlotDto =
        transaction {
            
            lockStationForUpdate(stationId)
            val station = findStationRow(stationId).toStationDto()
            val agent = findAgentRow(agentId).toAgentDto()
            val reservationsByAgentId = loadReservationsByAgentId()
            val reservation = reservationsByAgentId[agentId]
                ?: throw ConflictException("Agent $agentId has no parking reservation to confirm at $stationId.")
            if (reservation.stationId != stationId) {
                throw ConflictException(
                    "Agent $agentId reservation is at ${reservation.stationId}, not $stationId.",
                )
            }
            if (reservation.ephemeral) {
                throw ConflictException(
                    "Ephemeral reservation at $stationId cannot be confirmed as parking occupancy.",
                )
            }
            if (reservation.slotIndex != slotIndex) {
                throw ConflictException(
                    "Agent $agentId reserved slot ${reservation.slotIndex} at $stationId, not $slotIndex.",
                )
            }
            val padPosition = StationSlots.parkingSlot(station, slotIndex).position
            val distanceFromPadMeters = Geo.distanceMeters(agent.position, padPosition)
            if (distanceFromPadMeters > PARKING_DOCK_RADIUS_METERS) {
                throw ConflictException(
                    "Agent $agentId must be on parking pad $stationId/$slotIndex to confirm occupancy " +
                        "(${"%.1f".format(distanceFromPadMeters)}m from pad, " +
                        "max $PARKING_DOCK_RADIUS_METERS m).",
                )
            }
            TransportAgentsTable.update({ TransportAgentsTable.id eq parseEntityId(agentId) }) {
                it[currentStationId] = parseEntityId(stationId)
            }
            deleteReservation(agentId)
            reservationsByAgentId.remove(agentId)
            recomputeStationParking()
            val agents = TransportAgentsTable.selectAll().map { it.toAgentDto() }
            val slot = parkingSlots(station, agents, reservationsByAgentId)
                .firstOrNull { it.index == slotIndex && it.kind == StationSlotKind.PARKING }
                ?: throw ConflictException("Parking slot $stationId/$slotIndex not found.")
            if (slot.occupiedByAgentId != agentId) {
                if (distanceFromPadMeters > PARKING_DOCK_RADIUS_METERS) {
                    throw ConflictException(
                        "Parking occupancy not assigned to $agentId at $stationId/$slotIndex " +
                            "(occupant=${slot.occupiedByAgentId}).",
                    )
                }
                println(
                    "[PARKING][backend] occupy-heuristic-miss agent=$agentId station=$stationId " +
                        "slot=$slotIndex occupant=${slot.occupiedByAgentId} dist=" +
                        "${"%.1f".format(distanceFromPadMeters)}m (physical pad check passed)",
                )
            }
            if (slot.reservedByAgentId != null) {
                throw ConflictException(
                    "Parking slot $stationId/$slotIndex still has reservation ${slot.reservedByAgentId} after occupy.",
                )
            }
            println(
                "[PARKING][backend] occupy agent=$agentId station=$stationId slot=$slotIndex " +
                    "(reservation cleared)",
            )
            slot
        }

    /**
     * Package/relocation tasks may complete only after [confirmParkingOccupancy].
     * Must run inside an existing transaction.
     */
    internal fun requireOccupiedParkingForTaskComplete(agentId: String, stationId: String) {
        
        val agent = findAgentRow(agentId).toAgentDto()
        val reservationsByAgentId = loadReservationsByAgentId()
        val openReservation = reservationsByAgentId[agentId]?.takeIf { it.stationId == stationId }
        if (openReservation != null) {
            throw ConflictException(
                "Agent $agentId must confirm parking occupancy at $stationId " +
                    "(slot ${openReservation.slotIndex}) before completing the task.",
            )
        }
        if (agent.currentStationId != stationId) {
            throw ConflictException(
                "Agent $agentId must be docked at $stationId before completing the task " +
                    "(at ${agent.currentStationId}).",
            )
        }
        val station = findStationRow(stationId).toStationDto()
        val agents = TransportAgentsTable.selectAll().map { it.toAgentDto() }
        val occupiedSlot = parkingSlots(station, agents, reservationsByAgentId)
            .firstOrNull { it.kind == StationSlotKind.PARKING && it.occupiedByAgentId == agentId }
            ?: throw ConflictException(
                "Agent $agentId must occupy a parking slot at $stationId before completing the task.",
            )
        val padPosition = StationSlots.parkingSlot(station, occupiedSlot.index).position
        val distanceFromPadMeters = Geo.distanceMeters(agent.position, padPosition)
        if (distanceFromPadMeters > PARKING_DOCK_RADIUS_METERS) {
            throw ConflictException(
                "Agent $agentId must remain on parking pad $stationId/${occupiedSlot.index} " +
                    "(${"%.1f".format(distanceFromPadMeters)}m from pad).",
            )
        }
    }

    fun reconcileAgent(agent: TransportAgentDto) {
        transaction {
            val reservationsByAgentId = loadReservationsByAgentId()
            reconcileReservation(agent, reservationsByAgentId)
        }
    }

    fun snapshot(
        stations: List<TransferStationDto>,
        agents: List<TransportAgentDto>,
        shipments: List<ShipmentDto>,
    ): List<StationSlotDto> = transaction {
        val reservationsByAgentId = loadReservationsByAgentId()
        reconcileReservations(agents, reservationsByAgentId)
        stations.forEach { station -> promoteEphemeralReservations(station, agents, reservationsByAgentId) }
        stations.flatMap { station ->
            parkingSlots(station, agents, reservationsByAgentId) + storageSlots(station, shipments)
        }
    }

    private fun lockStationForUpdate(stationId: String) {
        findStationRow(stationId)
        TransferStationsTable
            .selectAll()
            .where { TransferStationsTable.id eq parseEntityId(stationId) }
            .forUpdate()
            .firstOrNull()
            ?: throw NotFoundException("Station $stationId was not found.")
    }

    private fun loadReservationsByAgentId(): MutableMap<String, Reservation> =
        ParkingSlotReservationsTable.selectAll()
            .associate { row ->
                val agentId = row[ParkingSlotReservationsTable.agentId].toString()
                agentId to Reservation(
                    stationId = row[ParkingSlotReservationsTable.stationId].toString(),
                    slotIndex = row[ParkingSlotReservationsTable.slotIndex],
                    agentId = agentId,
                    ephemeral = row[ParkingSlotReservationsTable.ephemeral],
                    expectsVacateBy = row[ParkingSlotReservationsTable.expectsVacateBy]?.toString(),
                )
            }
            .toMutableMap()

    private fun persistReservation(reservation: Reservation) {
        deleteReservation(reservation.agentId)
        try {
            ParkingSlotReservationsTable.insert {
                it[agentId] = parseEntityId(reservation.agentId)
                it[stationId] = parseEntityId(reservation.stationId)
                it[slotIndex] = reservation.slotIndex
                it[ephemeral] = reservation.ephemeral
                it[expectsVacateBy] = parseEntityIdOrNull(reservation.expectsVacateBy)
            }
        } catch (exception: ExposedSQLException) {
            if (isUniqueConstraintViolation(exception)) {
                throw ConflictException(
                    "Parking slot at station ${reservation.stationId} was reserved by another agent.",
                )
            }
            throw exception
        }
    }

    private fun deleteReservation(agentId: String) {
        ParkingSlotReservationsTable.deleteWhere { ParkingSlotReservationsTable.agentId eq parseEntityId(agentId) }
    }

    private fun isUniqueConstraintViolation(exception: ExposedSQLException): Boolean {
        var cause: Throwable? = exception
        while (cause != null) {
            if (cause is SQLIntegrityConstraintViolationException) {
                return true
            }
            val message = cause.message.orEmpty()
            if (message.contains("unique", ignoreCase = true) ||
                message.contains("duplicate", ignoreCase = true)
            ) {
                return true
            }
            cause = cause.cause
        }
        return false
    }

    private fun toParkingSlotDto(station: TransferStationDto, reservation: Reservation): StationSlotDto {
        val displayIndex = when {
            reservation.ephemeral -> (station.parkingCapacity - 1).coerceAtLeast(0)
            else -> reservation.slotIndex
        }
        return StationSlots.parkingSlot(station, displayIndex).copy(
            reservedByAgentId = reservation.agentId,
            reservationEphemeral = reservation.ephemeral,
            expectsVacateByAgentId = reservation.expectsVacateBy,
            ephemeralWaiterAgentId = reservation.agentId.takeIf { reservation.ephemeral },
        )
    }

    private fun promoteEphemeralReservations(
        station: TransferStationDto,
        agents: List<TransportAgentDto>,
        reservationsByAgentId: MutableMap<String, Reservation>,
    ) {
        if (!allowsParkingOverbook()) {
            return
        }
        (0 until station.parkingCapacity).forEach { index ->
            if (isRealSlotFree(station, agents, reservationsByAgentId, index)) {
                promoteEphemeralToSlot(station.id, index, reservationsByAgentId)
            }
        }
    }

    private fun promoteEphemeralToSlot(
        stationId: String,
        slotIndex: Int,
        reservationsByAgentId: MutableMap<String, Reservation>,
    ) {
        if (slotIndex < 0) {
            return
        }
        val waiter = reservationsByAgentId.values
            .filter { it.stationId == stationId && it.ephemeral }
            .minByOrNull { it.agentId }
            ?: return
        val promoted = waiter.copy(ephemeral = false, slotIndex = slotIndex)
        try {
            ParkingSlotReservationsTable.update({ ParkingSlotReservationsTable.agentId eq parseEntityId(waiter.agentId) }) {
                it[ParkingSlotReservationsTable.ephemeral] = false
                it[ParkingSlotReservationsTable.slotIndex] = slotIndex
            }
        } catch (exception: ExposedSQLException) {
            if (isUniqueConstraintViolation(exception)) {
                return
            }
            throw exception
        }
        reservationsByAgentId[waiter.agentId] = promoted
        println(
            "[PARKING][backend] promote ephemeral agent=${waiter.agentId} station=$stationId slot=$slotIndex",
        )
    }

    private fun isRealSlotFree(
        station: TransferStationDto,
        agents: List<TransportAgentDto>,
        reservationsByAgentId: Map<String, Reservation>,
        index: Int,
    ): Boolean {
        if (index !in 0 until station.parkingCapacity) {
            return false
        }
        val occupiedByIndex = occupiedParkingByIndex(station, agents, reservationsByAgentId)
        if (occupiedByIndex[index] != null) {
            return false
        }
        return reservationsByAgentId.values.none {
            it.stationId == station.id && !it.ephemeral && it.slotIndex == index
        }
    }

    private fun occupiedParkingByIndex(
        station: TransferStationDto,
        agents: List<TransportAgentDto>,
        reservationsByAgentId: Map<String, Reservation>,
    ): Map<Int, String> {
        val stationId = station.id
        val occupiedAgents = agents
            .filter { it.currentStationId == stationId }
            .sortedBy { it.id }
        val occupiedByIndex = mutableMapOf<Int, String>()
        occupiedAgents.forEach { agent ->
            val agentMapKey = agent.id
            val reservedIndex = reservationsByAgentId[agentMapKey]
                ?.takeIf { it.stationId == stationId && !it.ephemeral }
                ?.slotIndex
            val index = reservedIndex
                ?: parkingIndexFromPosition(station, agent.position)
                ?: (0 until station.parkingCapacity).firstOrNull { it !in occupiedByIndex }
            if (index != null) {
                if (index !in occupiedByIndex) {
                    occupiedByIndex[index] = agentMapKey
                } else {
                    (0 until station.parkingCapacity)
                        .firstOrNull { it !in occupiedByIndex }
                        ?.let { occupiedByIndex[it] = agentMapKey }
                }
            }
        }
        reservationsByAgentId.values
            .filter { it.stationId == stationId && !it.ephemeral }
            .forEach { reservation ->
                val index = reservation.slotIndex
                if (index in 0 until station.parkingCapacity && index !in occupiedByIndex) {
                    occupiedByIndex[index] = reservation.agentId
                }
            }
        return occupiedByIndex
    }

    private fun parkingSlots(
        station: TransferStationDto,
        agents: List<TransportAgentDto>,
        reservationsByAgentId: Map<String, Reservation>,
    ): List<StationSlotDto> {
        val occupiedByIndex = occupiedParkingByIndex(station, agents, reservationsByAgentId)
        val stationId = station.id
        val ephemeralWaiters = reservationsByAgentId.values
            .filter { it.stationId == stationId && it.ephemeral }
            .sortedBy { it.agentId }

        return StationSlots.parkingSlots(station).map { slot ->
            val reservation = reservationsByAgentId.values.firstOrNull {
                it.stationId == stationId && it.slotIndex == slot.index && !it.ephemeral
            }
            val occupant = occupiedByIndex[slot.index]
            val waiterForOccupant = ephemeralWaiters.firstOrNull { it.expectsVacateBy == occupant }
            val waiterHoldingEphemeral = ephemeralWaiters.firstOrNull { waiter ->
                reservation?.agentId != waiter.agentId &&
                    waiterForOccupant?.agentId == waiter.agentId
            }
            val ephemeralWaiterId = waiterHoldingEphemeral
                ?.agentId
                ?.takeUnless { it == occupant }
            slot.copy(
                reservedByAgentId = reservation?.agentId,
                reservationEphemeral = ephemeralWaiterId != null,
                expectsVacateByAgentId = waiterForOccupant?.expectsVacateBy ?: waiterHoldingEphemeral?.expectsVacateBy,
                occupiedByAgentId = occupant,
                ephemeralWaiterAgentId = ephemeralWaiterId,
            )
        }
    }

    private fun storageSlots(station: TransferStationDto, shipments: List<ShipmentDto>): List<StationSlotDto> {
        val storedShipments = shipments
            .filter { it.status == ShipmentStatus.AT_STATION && it.currentStationId == station.id }
            .sortedBy { it.id }

        return StationSlots.storageSlots(station).map { slot ->
            slot.copy(occupiedByShipmentId = storedShipments.getOrNull(slot.index)?.id)
        }
    }

    private fun reconcileReservations(
        agents: List<TransportAgentDto>,
        reservationsByAgentId: MutableMap<String, Reservation>,
    ) {
        agents.forEach { reconcileReservation(it, reservationsByAgentId) }
    }

    private fun reconcileReservation(
        agent: TransportAgentDto,
        reservationsByAgentId: MutableMap<String, Reservation>,
    ) {
        val agentMapKey = agent.id
        val reservation = reservationsByAgentId[agentMapKey] ?: return
        val nearReservedStation = runCatching {
            val station = findStationRow(reservation.stationId).toStationDto()
            Geo.distanceMeters(agent.position, station.position) <= LogisticsConstants.STATION_CONTACT_RADIUS_METERS
        }.getOrDefault(false)
        val keep = when {
            reservation.ephemeral -> true
            agent.currentStationId == reservation.stationId -> true
            agent.status == AgentStatus.BUSY -> true
            agent.status == AgentStatus.CHARGING -> true
            agent.status == AgentStatus.ARMING -> true
            agent.currentStationId == null &&
                agent.status == AgentStatus.AVAILABLE &&
                nearReservedStation -> true
            agent.currentStationId == null && agent.status == AgentStatus.AVAILABLE -> false
            agent.currentStationId != reservation.stationId -> true
            else -> true
        }
        if (!keep) {
            println(
                "[PARKING][backend] reconcile-drop agent=${agent.id} reservation=${reservation.stationId}/${reservation.slotIndex} " +
                    "status=${agent.status} dock=${agent.currentStationId}",
            )
            deleteReservation(agentMapKey)
            reservationsByAgentId.remove(agentMapKey)
        }
    }

    private fun parkingIndexFromPosition(station: TransferStationDto, position: GeoPoint): Int? =
        StationSlots.parkingSlots(station)
            .map { slot -> slot.index to Geo.distanceMeters(position, slot.position) }
            .filter { (_, distanceMeters) -> distanceMeters <= PARKING_DOCK_RADIUS_METERS }
            .minByOrNull { (_, distanceMeters) -> distanceMeters }
            ?.first

    private companion object {
        const val MAX_RESERVE_ATTEMPTS = 5
        const val PARKING_DOCK_RADIUS_METERS = 3.0
    }
}
