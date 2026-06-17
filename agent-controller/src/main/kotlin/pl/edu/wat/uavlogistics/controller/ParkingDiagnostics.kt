package pl.edu.wat.uavlogistics.controller

import pl.edu.wat.uavlogistics.common.StationSlotDto
import pl.edu.wat.uavlogistics.common.StationSlotKind
import pl.edu.wat.uavlogistics.common.TransportAgentDto

/** Structured parking logging for agent containers (`docker logs`). */
internal object ParkingDiagnostics {
    fun log(
        agentId: String,
        decision: String,
        details: String,
        agent: TransportAgentDto? = null,
        stationSlots: List<StationSlotDto>? = null,
    ) {
        val status = agent?.let { "status=${it.status} dock=${it.currentStationId}" } ?: ""
        val slots = stationSlots?.let { formatSlots(it) } ?: ""
        println(
            "[PARKING][$agentId] $decision | $details" +
                (if (status.isNotEmpty()) " | $status" else "") +
                (if (slots.isNotEmpty()) " | $slots" else ""),
        )
    }

    fun formatSlots(stationSlots: List<StationSlotDto>): String =
        stationSlots
            .filter { it.kind == StationSlotKind.PARKING }
            .joinToString { slot ->
                val occ = slot.occupiedByAgentId ?: "-"
                val res = slot.reservedByAgentId ?: "-"
                val ephemeral = slot.ephemeralWaiterAgentId ?: "-"
                "${slot.stationId}[${slot.index}]:occ=$occ,res=$res,ephemeral=$ephemeral"
            }
}
