package pl.edu.wat.uavlogistics.backend.service

import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import pl.edu.wat.uavlogistics.backend.persistence.TransportTasksTable
import pl.edu.wat.uavlogistics.common.TransportTaskStatus
import pl.edu.wat.uavlogistics.common.parseEntityId

internal fun hasInProgressTask(agentId: String): Boolean = transaction {
    TransportTasksTable.selectAll()
        .where {
            (TransportTasksTable.assignedAgentId eq parseEntityId(agentId)) and
                (TransportTasksTable.status eq TransportTaskStatus.IN_PROGRESS)
        }
        .any()
}
