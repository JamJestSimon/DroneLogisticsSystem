package pl.edu.wat.uavlogistics.backend



import org.junit.jupiter.api.Test

import pl.edu.wat.uavlogistics.backend.persistence.DatabaseFactory

import org.junit.jupiter.api.assertThrows

import pl.edu.wat.uavlogistics.backend.service.AgentService

import pl.edu.wat.uavlogistics.backend.service.ConflictException

import pl.edu.wat.uavlogistics.backend.service.RebalanceTaskService

import pl.edu.wat.uavlogistics.backend.service.StationService

import pl.edu.wat.uavlogistics.backend.service.StationSlotService

import pl.edu.wat.uavlogistics.backend.service.TaskService

import pl.edu.wat.uavlogistics.common.AgentType

import pl.edu.wat.uavlogistics.common.GeoPoint

import pl.edu.wat.uavlogistics.common.RebalanceTaskIds

import pl.edu.wat.uavlogistics.common.AgentStatus

import pl.edu.wat.uavlogistics.common.RegisterAgentRequest

import pl.edu.wat.uavlogistics.common.RegisterStationRequest

import pl.edu.wat.uavlogistics.common.UpdateAgentStateRequest

import pl.edu.wat.uavlogistics.common.StationSlots

import pl.edu.wat.uavlogistics.common.TransportTaskKind

import pl.edu.wat.uavlogistics.common.TransportTaskStatus

import kotlin.test.assertEquals

import kotlin.test.assertFalse

import kotlin.test.assertNotNull

import kotlin.test.assertTrue



class RebalanceTaskServiceTest {

    @Test

    fun `ensure rebalance task is idempotent and claim is atomic`() {

        DatabaseFactory.init(h2Config())

        val stations = StationService()

        val agents = AgentService()

        val rebalance = RebalanceTaskService()

        val tasks = TaskService(rebalanceTasks = rebalance)



        val hubA = TestIds.str(TestIds.HUB_A)

        val hubB = TestIds.str(TestIds.HUB_B)

        val uav1 = TestIds.str(TestIds.UAV_1)



        stations.register(

            RegisterStationRequest(hubA, "A", GeoPoint(52.0, 21.0), storageCapacity = 4, parkingCapacity = 3),

        )

        stations.register(

            RegisterStationRequest(hubB, "B", GeoPoint(52.01, 21.0), storageCapacity = 4, parkingCapacity = 3),

        )

        stations.activate(hubA)

        stations.activate(hubB)



        val first = rebalance.ensureRebalanceTask(hubA, hubB)

        val second = rebalance.ensureRebalanceTask(hubA, hubB)

        assertNotNull(first)

        assertEquals(first.id, second?.id)

        assertEquals(RebalanceTaskIds.deterministicId(hubA, hubB).toString(), first.id)

        assertEquals(TransportTaskKind.REBALANCE, first.kind)



        agents.register(

            RegisterAgentRequest(

                id = uav1,

                type = AgentType.UAV,

                position = GeoPoint(52.0, 21.0, 0.0),

                energyLevelPercent = 100.0,

                maxRangeMeters = 10_000.0,

                payloadCapacityKg = 5.0,

                currentStationId = hubA,

            ),

        )

        agents.activate(uav1)

        agents.updateState(

            uav1,

            UpdateAgentStateRequest(

                position = GeoPoint(52.0, 21.0, 0.0),

                energyLevelPercent = 100.0,

                status = AgentStatus.AVAILABLE,

                currentStationId = hubA,

            ),

        )



        val claim1 = tasks.claimTask(first.id, uav1)

        val claim2 = tasks.claimTask(first.id, uav1)

        assertTrue(claim1.claimed)

        assertFalse(claim2.claimed)

        assertEquals(TransportTaskStatus.IN_PROGRESS, claim1.task?.status)

    }



    @Test

    fun `complete rebalance rejects hub proximity without parking pad dock`() {

        DatabaseFactory.init(h2Config())

        val stations = StationService()

        val agents = AgentService()

        val slots = StationSlotService()

        val rebalance = RebalanceTaskService()

        val tasks = TaskService(rebalanceTasks = rebalance)



        val hubA = TestIds.str(TestIds.HUB_A)

        val hubB = TestIds.str(TestIds.HUB_B)

        val uav1 = TestIds.str(TestIds.UAV_1)



        stations.register(

            RegisterStationRequest(hubA, "A", GeoPoint(52.0, 21.0), storageCapacity = 4, parkingCapacity = 3),

        )

        stations.register(

            RegisterStationRequest(hubB, "B", GeoPoint(52.01, 21.0), storageCapacity = 4, parkingCapacity = 3),

        )

        stations.activate(hubA)

        stations.activate(hubB)



        val task = rebalance.ensureRebalanceTask(hubA, hubB)!!

        agents.register(

            RegisterAgentRequest(

                id = uav1,

                type = AgentType.UAV,

                position = GeoPoint(52.0, 21.0, 0.0),

                energyLevelPercent = 100.0,

                maxRangeMeters = 10_000.0,

                payloadCapacityKg = 5.0,

                currentStationId = hubA,

            ),

        )

        agents.activate(uav1)

        tasks.claimTask(task.id, uav1)

        slots.reserveParkingSlot(hubB, uav1)



        agents.updateState(

            uav1,

            UpdateAgentStateRequest(

                position = GeoPoint(52.01, 21.0, 0.0),

                energyLevelPercent = 100.0,

                status = AgentStatus.BUSY,

                currentStationId = hubB,

            ),

        )



        assertThrows<ConflictException> {

            rebalance.completeRebalanceTask(task.id, uav1)

        }

    }



    @Test

    fun `complete rebalance requires confirmed parking occupancy not open reservation`() {

        DatabaseFactory.init(h2Config())

        val stations = StationService()

        val agents = AgentService()

        val slots = StationSlotService()

        val rebalance = RebalanceTaskService(stationSlots = slots)

        val tasks = TaskService(rebalanceTasks = rebalance)



        val hubA = TestIds.str(TestIds.HUB_A)

        val hubB = TestIds.str(TestIds.HUB_B)

        val uav1 = TestIds.str(TestIds.UAV_1)



        val hubAStation = stations.register(

            RegisterStationRequest(hubA, "A", GeoPoint(52.0, 21.0), storageCapacity = 4, parkingCapacity = 3),

        )

        val hubBStation = stations.register(

            RegisterStationRequest(hubB, "B", GeoPoint(52.01, 21.0), storageCapacity = 4, parkingCapacity = 3),

        )

        stations.activate(hubA)

        stations.activate(hubB)



        val task = rebalance.ensureRebalanceTask(hubA, hubB)!!

        agents.register(

            RegisterAgentRequest(

                id = uav1,

                type = AgentType.UAV,

                position = GeoPoint(52.0, 21.0, 0.0),

                energyLevelPercent = 100.0,

                maxRangeMeters = 10_000.0,

                payloadCapacityKg = 5.0,

                currentStationId = hubA,

            ),

        )

        agents.activate(uav1)

        agents.updateState(

            uav1,

            UpdateAgentStateRequest(

                position = GeoPoint(52.0, 21.0, 0.0),

                energyLevelPercent = 100.0,

                status = AgentStatus.AVAILABLE,

                currentStationId = hubA,

            ),

        )

        val claim = tasks.claimTask(task.id, uav1)

        assertTrue(claim.claimed, claim.reason)

        val reserved = slots.reserveParkingSlot(hubB, uav1)

        val pad = StationSlots.parkingSlot(hubBStation, reserved.index).position



        agents.updateState(

            uav1,

            UpdateAgentStateRequest(

                position = pad,

                energyLevelPercent = 100.0,

                status = AgentStatus.BUSY,

                currentStationId = null,

            ),

        )



        val premature = assertThrows<ConflictException> {

            rebalance.completeRebalanceTask(task.id, uav1)

        }

        assertTrue(

            premature.message.orEmpty().contains("confirm parking occupancy"),

            premature.message,

        )



        slots.confirmParkingOccupancy(hubB, reserved.index, uav1)

        val completed = rebalance.completeRebalanceTask(task.id, uav1)

        assertEquals(TransportTaskStatus.COMPLETED, completed.status)

    }

}


