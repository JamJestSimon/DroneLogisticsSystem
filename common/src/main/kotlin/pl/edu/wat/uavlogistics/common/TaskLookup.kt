package pl.edu.wat.uavlogistics.common

/** In-progress task owned by [agentId] (source of truth: task.assignedAgentId). */
fun Iterable<TransportTaskDto>.inProgressTaskFor(agentId: String): TransportTaskDto? =
    firstOrNull { it.assignedAgentId == agentId && it.status == TransportTaskStatus.IN_PROGRESS }

fun Iterable<TransportTaskDto>.inProgressTaskIdFor(agentId: String): String? =
    inProgressTaskFor(agentId)?.id

/** Package delivered/handoff-complete but agent may still be returning to hub parking. */
fun Iterable<TransportTaskDto>.packageReturnPendingFor(agentId: String): TransportTaskDto? =
    firstOrNull {
        it.kind == TransportTaskKind.PACKAGE &&
            it.status == TransportTaskStatus.COMPLETED &&
            it.assignedAgentId == agentId
    }
