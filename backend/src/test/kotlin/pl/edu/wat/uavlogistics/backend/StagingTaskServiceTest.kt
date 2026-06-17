package pl.edu.wat.uavlogistics.backend



import org.junit.jupiter.api.Test

import pl.edu.wat.uavlogistics.backend.persistence.DatabaseFactory

import pl.edu.wat.uavlogistics.backend.service.AgentService

import pl.edu.wat.uavlogistics.backend.service.ShipmentService

import pl.edu.wat.uavlogistics.backend.service.StagingTaskService

import pl.edu.wat.uavlogistics.backend.service.StationService

import pl.edu.wat.uavlogistics.backend.service.TaskService

import pl.edu.wat.uavlogistics.common.AgentStatus

import pl.edu.wat.uavlogistics.common.AgentType

import pl.edu.wat.uavlogistics.common.CreateShipmentRequest

import pl.edu.wat.uavlogistics.common.GeoPoint

import pl.edu.wat.uavlogistics.common.PackageSpec

import pl.edu.wat.uavlogistics.common.RegisterAgentRequest

import pl.edu.wat.uavlogistics.common.RegisterStationRequest

import pl.edu.wat.uavlogistics.common.StagingTaskIds

import pl.edu.wat.uavlogistics.common.TransportTaskKind

import pl.edu.wat.uavlogistics.common.TransportTaskStatus

import pl.edu.wat.uavlogistics.common.UpdateAgentStateRequest

import kotlin.test.assertEquals

import kotlin.test.assertNotNull

import kotlin.test.assertTrue



class StagingTaskServiceTest {

    @Test

    fun `ensure staging task is deterministic and only visible to intended agent`() {

        DatabaseFactory.init(h2Config())

        val stations = StationService()

        val agents = AgentService()

        val staging = StagingTaskService()

        val tasks = TaskService(stagingTasks = staging)

        val shipments = ShipmentService()



        val hubWest = TestIds.str(TestIds.HUB_WEST)

        val hubEast = TestIds.str(TestIds.HUB_EAST)

        val ugv1 = TestIds.str(TestIds.UGV_1)

        val ugv2 = TestIds.str(TestIds.UGV_2)



        stations.register(

            RegisterStationRequest(hubWest, "West", GeoPoint(52.0, 21.0), storageCapacity = 4, parkingCapacity = 3),

        )

        stations.register(

            RegisterStationRequest(hubEast, "East", GeoPoint(52.01, 21.0), storageCapacity = 4, parkingCapacity = 3),

        )

        stations.activate(hubWest)

        stations.activate(hubEast)



        val created = shipments.createShipment(

            CreateShipmentRequest(

                customerId = TestIds.str(TestIds.CUSTOMER_1),

                senderName = "Sender",

                recipientName = "Recipient",

                origin = GeoPoint(52.0, 21.01, 0.0),

                destination = GeoPoint(52.0, 21.02, 0.0),

                packageSpec = PackageSpec(weightKg = 1.0, volumeM3 = 0.01, requiresGroundTransport = true),

            ),

        )

        val packageTask = created.initialTask



        agents.register(

            RegisterAgentRequest(

                id = ugv1,

                type = AgentType.UGV,

                position = GeoPoint(52.0, 21.0, 0.0),

                energyLevelPercent = 100.0,

                maxRangeMeters = 10_000.0,

                payloadCapacityKg = 5.0,

                currentStationId = hubWest,

            ),

        )

        agents.activate(ugv1)

        agents.updateState(

            ugv1,

            UpdateAgentStateRequest(

                position = GeoPoint(52.0, 21.0, 0.0),

                energyLevelPercent = 100.0,

                status = AgentStatus.AVAILABLE,

                currentStationId = hubWest,

            ),

        )



        val first = staging.ensureStagingTask(ugv1, packageTask.id, hubWest, hubEast)

        val second = staging.ensureStagingTask(ugv1, packageTask.id, hubWest, hubEast)

        assertNotNull(first)

        assertEquals(first.id, second?.id)

        assertEquals(StagingTaskIds.deterministicId(packageTask.id, hubEast).toString(), first.id)

        assertEquals(TransportTaskKind.STAGING, first.kind)

        assertTrue(tasks.listAvailableTasks(ugv1).any { it.id == first.id })



        agents.register(

            RegisterAgentRequest(

                id = ugv2,

                type = AgentType.UGV,

                position = GeoPoint(52.0, 21.0, 0.0),

                energyLevelPercent = 100.0,

                maxRangeMeters = 10_000.0,

                payloadCapacityKg = 5.0,

                currentStationId = hubWest,

            ),

        )

        agents.activate(ugv2)

        agents.updateState(

            ugv2,

            UpdateAgentStateRequest(

                position = GeoPoint(52.0, 21.0, 0.0),

                energyLevelPercent = 100.0,

                status = AgentStatus.AVAILABLE,

                currentStationId = hubWest,

            ),

        )

        assertTrue(tasks.listAvailableTasks(ugv2).any { it.id == first.id })



        val claim = tasks.claimTask(first.id, ugv1)

        assertTrue(claim.claimed)

        agents.updateState(

            ugv1,

            UpdateAgentStateRequest(

                position = GeoPoint(52.01, 21.0, 0.0),

                energyLevelPercent = 100.0,

                status = AgentStatus.BUSY,

                currentStationId = hubEast,

            ),

        )

        val completed = staging.completeStagingTask(first.id, ugv1)

        assertEquals(TransportTaskStatus.COMPLETED, completed.status)

        assertTrue(tasks.listAvailableTasks(ugv1).none { it.id == first.id })

    }

}


