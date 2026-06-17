package pl.edu.wat.uavlogistics.backend

import org.junit.jupiter.api.Test
import pl.edu.wat.uavlogistics.backend.persistence.DatabaseConfig
import pl.edu.wat.uavlogistics.backend.persistence.DatabaseFactory
import pl.edu.wat.uavlogistics.backend.service.AgentService
import pl.edu.wat.uavlogistics.backend.service.ConflictException
import pl.edu.wat.uavlogistics.backend.service.ShipmentService
import pl.edu.wat.uavlogistics.backend.service.TaskService
import pl.edu.wat.uavlogistics.common.AgentStatus
import pl.edu.wat.uavlogistics.common.AgentType
import pl.edu.wat.uavlogistics.common.CompleteTaskRequest
import pl.edu.wat.uavlogistics.common.CreateShipmentRequest
import pl.edu.wat.uavlogistics.common.GeoPoint
import pl.edu.wat.uavlogistics.common.PackageSpec
import pl.edu.wat.uavlogistics.common.PickupTaskRequest
import pl.edu.wat.uavlogistics.common.RegisterAgentRequest
import pl.edu.wat.uavlogistics.common.UpdateAgentStateRequest
import kotlin.test.assertFailsWith
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class TaskServiceTest {
    @Test
    fun `claiming a task is atomic and only succeeds once`() {
        DatabaseFactory.init(h2Config())
        val shipments = ShipmentService()
        val agents = AgentService()
        val tasks = TaskService()
        val uav1 = TestIds.str(TestIds.UAV_1)

        val shipment = shipments.createShipment(
            CreateShipmentRequest(
                customerId = TestIds.str(TestIds.CUSTOMER_1),
                senderName = "Sender",
                recipientName = "Recipient",
                origin = GeoPoint(52.253, 21.034),
                destination = GeoPoint(52.254, 21.035),
                packageSpec = PackageSpec(weightKg = 1.0, volumeM3 = 0.01),
            ),
        )

        agents.register(
            RegisterAgentRequest(
                id = uav1,
                type = AgentType.UAV,
                position = GeoPoint(52.253, 21.034, 80.0),
                energyLevelPercent = 100.0,
                maxRangeMeters = 10_000.0,
                payloadCapacityKg = 5.0,
            ),
        )
        agents.activate(uav1)
        agents.markAvailableForClaim(uav1, GeoPoint(52.253, 21.034, 80.0))

        val first = tasks.claimTask(shipment.initialTask.id, uav1)
        val second = tasks.claimTask(shipment.initialTask.id, uav1)

        assertTrue(first.claimed)
        assertFalse(second.claimed)
    }

    @Test
    fun `only assigned carrying agent can complete task once`() {
        DatabaseFactory.init(h2Config())
        val shipments = ShipmentService()
        val agents = AgentService()
        val tasks = TaskService()
        val uav1 = TestIds.str(TestIds.UAV_1)
        val uav2 = TestIds.str(TestIds.UAV_2)

        val shipment = shipments.createShipment(
            CreateShipmentRequest(
                customerId = TestIds.str(TestIds.CUSTOMER_1),
                senderName = "Sender",
                recipientName = "Recipient",
                origin = GeoPoint(52.253, 21.034),
                destination = GeoPoint(52.254, 21.035),
                packageSpec = PackageSpec(weightKg = 1.0, volumeM3 = 0.01),
            ),
        )

        listOf(uav1, uav2).forEach { agentId ->
            agents.register(
                RegisterAgentRequest(
                    id = agentId,
                    type = AgentType.UAV,
                    position = GeoPoint(52.253, 21.034, 0.0),
                    energyLevelPercent = 100.0,
                    maxRangeMeters = 10_000.0,
                    payloadCapacityKg = 5.0,
                ),
            )
            agents.activate(agentId)
            agents.markAvailableForClaim(agentId, GeoPoint(52.253, 21.034, 0.0))
        }

        val claim = tasks.claimTask(shipment.initialTask.id, uav1)
        assertTrue(claim.claimed)

        assertFailsWith<ConflictException> {
            tasks.completeTask(shipment.initialTask.id, CompleteTaskRequest(agentId = uav2, finalDelivery = true))
        }
        assertFailsWith<ConflictException> {
            tasks.completeTask(shipment.initialTask.id, CompleteTaskRequest(agentId = uav1, finalDelivery = true))
        }

        tasks.pickUpTask(shipment.initialTask.id, PickupTaskRequest(agentId = uav1))
        agents.updateState(
            uav1,
            UpdateAgentStateRequest(
                position = GeoPoint(52.254, 21.035, 0.0),
                energyLevelPercent = 100.0,
                status = AgentStatus.BUSY,
                currentStationId = null,
            ),
        )
        tasks.completeTask(shipment.initialTask.id, CompleteTaskRequest(agentId = uav1, finalDelivery = true))

        assertFailsWith<ConflictException> {
            tasks.completeTask(shipment.initialTask.id, CompleteTaskRequest(agentId = uav1, finalDelivery = true))
        }
    }
}

private fun AgentService.markAvailableForClaim(agentId: String, position: GeoPoint) {
    updateState(
        agentId,
        UpdateAgentStateRequest(
            position = position,
            energyLevelPercent = 100.0,
            status = AgentStatus.AVAILABLE,
            currentStationId = null,
        ),
    )
}

fun h2Config(): DatabaseConfig {
    val dbName = "uav_${System.nanoTime()}"
    return DatabaseConfig(
        url = "jdbc:h2:mem:$dbName;MODE=PostgreSQL;DATABASE_TO_UPPER=false;DB_CLOSE_DELAY=-1",
        driver = "org.h2.Driver",
        user = "sa",
        password = "",
    )
}
