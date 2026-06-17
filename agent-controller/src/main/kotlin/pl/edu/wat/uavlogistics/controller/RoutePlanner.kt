package pl.edu.wat.uavlogistics.controller

import pl.edu.wat.uavlogistics.common.AgentType
import pl.edu.wat.uavlogistics.common.Geo
import pl.edu.wat.uavlogistics.common.GeoPoint
import pl.edu.wat.uavlogistics.common.LogisticsConstants
import pl.edu.wat.uavlogistics.common.StationStatus
import pl.edu.wat.uavlogistics.common.TransferStationDto
import pl.edu.wat.uavlogistics.common.TransportAgentDto
import pl.edu.wat.uavlogistics.common.ShipmentDto
import pl.edu.wat.uavlogistics.common.TransportTaskDto
import pl.edu.wat.uavlogistics.common.matchesAgentType

data class PlannedRoute(
    val waypoints: List<GeoPoint>,
    val distanceMeters: Double,
    val estimatedEnergyPercent: Double,
)

data class TaskCandidate(
    val task: TransportTaskDto,
    val route: PlannedRoute,
    val score: Double,
)

class RoutePlanner {
    fun plan(
        agent: TransportAgentDto,
        task: TransportTaskDto,
        stations: List<TransferStationDto> = emptyList(),
        groundObstacles: List<GroundObstacle> = emptyList(),
    ): PlannedRoute {
        val routeOrigin = routeOrigin(agent, stations)
        val waypoints = buildGroundWaypoints(agent, routeOrigin, task.startPoint, groundObstacles) +
            buildGroundWaypoints(agent, task.startPoint, task.endPoint, groundObstacles).drop(1)
        val pathDistance = pathDistanceMeters(routeOrigin, waypoints.ifEmpty { listOf(task.startPoint, task.endPoint) })
        val typeMultiplier = if (agent.type == AgentType.UGV) 1.35 else 1.0
        val distance = pathDistance * typeMultiplier
        val energy = (distance / agent.maxRangeMeters) * 100.0

        return PlannedRoute(
            waypoints = waypoints.ifEmpty { listOf(task.startPoint, task.endPoint) },
            distanceMeters = distance,
            estimatedEnergyPercent = energy,
        )
    }

    fun planToPoint(
        agent: TransportAgentDto,
        target: GeoPoint,
        groundObstacles: List<GroundObstacle> = emptyList(),
    ): PlannedRoute {
        val waypoints = buildGroundWaypoints(agent, agent.position, target, groundObstacles)
        val pathDistance = pathDistanceMeters(agent.position, waypoints.ifEmpty { listOf(target) })
        val typeMultiplier = if (agent.type == AgentType.UGV) 1.35 else 1.0
        val distance = pathDistance * typeMultiplier
        val energy = (distance / agent.maxRangeMeters) * 100.0

        return PlannedRoute(
            waypoints = waypoints.ifEmpty { listOf(target) },
            distanceMeters = distance,
            estimatedEnergyPercent = energy,
        )
    }

    private fun buildGroundWaypoints(
        agent: TransportAgentDto,
        from: GeoPoint,
        to: GeoPoint,
        groundObstacles: List<GroundObstacle>,
    ): List<GeoPoint> {
        if (!GroundRouteAvoidance.enabled() || groundObstacles.isEmpty()) {
            return listOf(to)
        }
        if (agent.type != AgentType.UGV && agent.type != AgentType.UAV) {
            return listOf(to)
        }
        return GroundRouteAvoidance.pathWaypoints(from, to, groundObstacles)
    }

    private fun pathDistanceMeters(from: GeoPoint, waypoints: List<GeoPoint>): Double {
        var total = 0.0
        var cursor = from
        for (waypoint in waypoints) {
            total += Geo.distanceMeters(cursor, waypoint)
            cursor = waypoint
        }
        return total
    }

    fun feasibleCandidate(
        agent: TransportAgentDto,
        task: TransportTaskDto,
        activeStations: List<TransferStationDto> = emptyList(),
        groundObstacles: List<GroundObstacle> = emptyList(),
        shipment: ShipmentDto? = null,
    ): TaskCandidate? {
        if (!task.matchesAgentType(agent.type, shipment)) return null
        val route = plan(agent, task, activeStations, groundObstacles)
        val reservePercent = LogisticsConstants.TASK_ROUTE_RESERVE_PERCENT
        if (route.estimatedEnergyPercent + reservePercent > agent.energyLevelPercent) {
            return transferCandidate(agent, task, activeStations, reservePercent, groundObstacles)
        }

        val score = route.distanceMeters + route.estimatedEnergyPercent * 100.0
        return TaskCandidate(task, route, score)
    }

    private fun transferCandidate(
        agent: TransportAgentDto,
        task: TransportTaskDto,
        stations: List<TransferStationDto>,
        reservePercent: Double,
        groundObstacles: List<GroundObstacle>,
    ): TaskCandidate? {
        if (task.endStationId != null) return null
        val routeOrigin = routeOrigin(agent, stations)
        val typeMultiplier = if (agent.type == AgentType.UGV) 1.35 else 1.0
        val directDistance = Geo.distanceMeters(task.startPoint, task.endPoint)
        val stationOptions = stations
            .filter { it.status == StationStatus.ACTIVE && it.occupiedStorage < it.storageCapacity }
            .filter { it.id != task.startStationId }
            .filter { Geo.distanceMeters(it.position, task.endPoint) < directDistance }
            .sortedByDescending { Geo.routeProgress(task.startPoint, task.endPoint, it.position) }

        val station = stationOptions.firstOrNull { station ->
            val route = plan(
                agent,
                task.copy(endPoint = station.position, endStationId = station.id),
                stations,
                groundObstacles,
            )
            route.estimatedEnergyPercent + reservePercent <= agent.energyLevelPercent
        } ?: return null

        val route = plan(
            agent,
            task.copy(endPoint = station.position, endStationId = station.id),
            stations,
            groundObstacles,
        )

        return TaskCandidate(
            task = task,
            route = route,
            score = route.distanceMeters + route.estimatedEnergyPercent * 100.0,
        )
    }

    private fun routeOrigin(agent: TransportAgentDto, stations: List<TransferStationDto>): GeoPoint =
        agent.currentStationId
            ?.let { stationId -> stations.firstOrNull { it.id == stationId }?.position }
            ?: agent.position
}
