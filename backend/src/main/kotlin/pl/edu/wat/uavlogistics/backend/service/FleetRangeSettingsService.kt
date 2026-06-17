package pl.edu.wat.uavlogistics.backend.service

import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update
import pl.edu.wat.uavlogistics.backend.persistence.TransportAgentsTable
import pl.edu.wat.uavlogistics.common.AgentType
import pl.edu.wat.uavlogistics.common.FleetRangeSettingsDto

class FleetRangeSettingsService {
    @Volatile
    private var settings: FleetRangeSettingsDto = fleetRangeSettingsFromEnv()

    fun current(): FleetRangeSettingsDto = settings

    fun update(request: FleetRangeSettingsDto): FleetRangeSettingsDto {
        validate(request)
        settings = request
        transaction {
            TransportAgentsTable.selectAll().forEach { row ->
                val agentType = row[TransportAgentsTable.type]
                val maxRange = when (agentType) {
                    AgentType.UAV -> request.uavMaxRangeMeters
                    AgentType.UGV -> request.ugvMaxRangeMeters
                }
                TransportAgentsTable.update({ TransportAgentsTable.id eq row[TransportAgentsTable.id] }) {
                    it[maxRangeMeters] = maxRange
                }
            }
        }
        return settings
    }

    private fun validate(request: FleetRangeSettingsDto) {
        if (request.uavMaxRangeMeters <= 0.0 || request.ugvMaxRangeMeters <= 0.0) {
            throw ValidationException("Max range must be positive.")
        }
        if (request.routeReservePercent < 0.0 || request.routeReservePercent >= 100.0) {
            throw ValidationException("Route reserve must be between 0 and 100 (exclusive).")
        }
    }
}

private fun fleetRangeSettingsFromEnv(): FleetRangeSettingsDto =
    FleetRangeSettingsDto(
        uavMaxRangeMeters = envDouble("FLEET_UAV_MAX_RANGE_METERS", 650.0),
        ugvMaxRangeMeters = envDouble("FLEET_UGV_MAX_RANGE_METERS", 600.0),
        routeReservePercent = envDouble("FLEET_ROUTE_RESERVE_PERCENT", 15.0),
    )

private fun envDouble(name: String, default: Double): Double =
    (System.getenv(name) ?: default.toString()).toDouble()
