package pl.edu.wat.uavlogistics.backend

import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import pl.edu.wat.uavlogistics.backend.persistence.DatabaseFactory
import pl.edu.wat.uavlogistics.backend.persistence.TransportAgentsTable
import pl.edu.wat.uavlogistics.backend.service.FleetRangeSettingsService
import pl.edu.wat.uavlogistics.common.AgentStatus
import pl.edu.wat.uavlogistics.common.AgentType
import pl.edu.wat.uavlogistics.common.FleetRangeSettingsDto
import kotlin.test.assertEquals

class FleetRangeSettingsServiceTest {
    private val service = FleetRangeSettingsService()

    @BeforeEach
    fun setUp() {
        DatabaseFactory.init(h2Config())
        transaction {
            TransportAgentsTable.insert {
                it[id] = TestIds.UAV_1
                it[type] = AgentType.UAV
                it[lat] = 0.0
                it[lon] = 0.0
                it[alt] = 0.0
                it[energyLevelPercent] = 100.0
                it[maxRangeMeters] = 500.0
                it[payloadCapacityKg] = 5.0
                it[status] = AgentStatus.AVAILABLE
                it[currentStationId] = null
            }
            TransportAgentsTable.insert {
                it[id] = TestIds.UGV_1
                it[type] = AgentType.UGV
                it[lat] = 0.0
                it[lon] = 0.0
                it[alt] = 0.0
                it[energyLevelPercent] = 100.0
                it[maxRangeMeters] = 400.0
                it[payloadCapacityKg] = 20.0
                it[status] = AgentStatus.AVAILABLE
                it[currentStationId] = null
            }
        }
    }

    @Test
    fun `update applies per-type max range to all agents`() {
        val updated = service.update(
            FleetRangeSettingsDto(
                uavMaxRangeMeters = 700.0,
                ugvMaxRangeMeters = 550.0,
                routeReservePercent = 12.0,
            ),
        )

        assertEquals(700.0, updated.uavMaxRangeMeters)
        transaction {
            val uav = TransportAgentsTable.selectAll().first { it[TransportAgentsTable.id] == TestIds.UAV_1 }
            val ugv = TransportAgentsTable.selectAll().first { it[TransportAgentsTable.id] == TestIds.UGV_1 }
            assertEquals(700.0, uav[TransportAgentsTable.maxRangeMeters])
            assertEquals(550.0, ugv[TransportAgentsTable.maxRangeMeters])
        }
    }
}
