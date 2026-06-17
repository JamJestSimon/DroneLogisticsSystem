package pl.edu.wat.uavlogistics.frontend.model

import kotlin.js.JSON

fun parseNetworkState(json: String): dynamic = JSON.parse(json)

fun networkToMapPoints(state: dynamic): List<MapPoint> {
    val points = mutableListOf<MapPoint>()
    val stations = dynamicArray(state.stations)
    val agents = dynamicArray(state.agents)
    val shipments = dynamicArray(state.shipments)
    stations.forEach { station ->
        val lat = number(station.position.latitude)
        val lon = number(station.position.longitude)
        val stationId = station.id as String
        val serviceTypes = AgentRangeSettings.registeredVehicleTypes(state.agents)
        points += MapPoint(
            id = stationId,
            label = station.name as String,
            details = buildString {
                appendLine(station.name as String)
                appendLine("Status: ${station.status}")
                appendLine("Storage: ${station.occupiedStorage}/${station.storageCapacity}")
                appendLine("Parking: ${station.occupiedParking}/${station.parkingCapacity}")
                serviceTypes.forEach { type ->
                    val maxRange = AgentRangeSettings.displayMaxRangeMeters(type, state.agents).toInt()
                    val pickup = AgentRangeSettings.packagePickupRadiusMeters(type, maxRange.toDouble()).toInt()
                    val rebalanceHop = AgentRangeSettings.rebalanceHopRadiusMeters(maxRange.toDouble()).toInt()
                    val hubDrive = AgentRangeSettings.interStationRadiusMeters(type, maxRange.toDouble()).toInt()
                    appendLine("$type package pickup radius: ${pickup} m")
                    appendLine("$type one-hop rebalance reach: ${rebalanceHop} m")
                    appendLine("$type hub-drive radius (with reserve): ${hubDrive} m")
                    appendLine("$type max range (registered fleet): ${maxRange} m")
                }
                append("Position: ${lat.formatCoord()}, ${lon.formatCoord()}")
            },
            lat = lat,
            lon = lon,
            kind = MapPointKind.STATION,
        )
    }
    agents.forEach { agent ->
        val lat = number(agent.position.latitude)
        val lon = number(agent.position.longitude)
        points += MapPoint(
            id = agent.id as String,
            label = "${agent.id as String} · ${agent.type}",
            details = buildString {
                appendLine(agent.id as String)
                appendLine("Type: ${agent.type} · Status: ${agent.status}")
                appendLine("Energy: ${number(agent.energyLevelPercent)}%")
                val agentType = agent.type as String
                val agentMaxRange = number(agent.maxRangeMeters)
                val agentMax = agentMaxRange.toInt()
                val pickup = AgentRangeSettings.packagePickupRadiusMeters(agentType, agentMaxRange).toInt()
                val rebalanceHop = AgentRangeSettings.rebalanceHopRadiusMeters(agentMaxRange).toInt()
                val hubDrive = AgentRangeSettings.interStationRadiusMeters(agentType, agentMaxRange).toInt()
                appendLine("$agentType package pickup radius: ${pickup} m")
                appendLine("$agentType one-hop rebalance reach: ${rebalanceHop} m")
                appendLine("$agentType hub-drive radius (with reserve): ${hubDrive} m")
                appendLine("$agentType max range: ${agentMax} m")
                appendLine("Station: ${agent.currentStationId ?: "—"}")
                append("Position: ${lat.formatCoord()}, ${lon.formatCoord()}")
            },
            lat = lat,
            lon = lon,
            kind = MapPointKind.AGENT,
            agentType = agent.type as String,
        )
    }
    shipments.forEach { shipment ->
        if (!isCustomerShipment(shipment)) return@forEach
        if (isInactiveShipment(shipment)) return@forEach
        val status = statusString(shipment.status)
        val (lat, lon) = shipmentPosition(shipment, stations, agents)
        points += MapPoint(
            id = shipment.id as String,
            label = "${(shipment.id as String).shortId()} · $status",
            details = packageDetails(shipment, lat, lon),
            lat = lat,
            lon = lon,
            kind = MapPointKind.PACKAGE,
        )
    }
    return points
}

/** Per-hub range discs for registered agent types (dashed = one-hop rebalance reach). */
fun networkToStationRangeDiscs(state: dynamic): List<MapRangeDisc> {
    val discs = mutableListOf<MapRangeDisc>()
    val agents = state.agents
    val vehicleTypes = AgentRangeSettings.registeredVehicleTypes(agents)
    dynamicArray(state.stations).forEach { station ->
        if (station.status as String != "ACTIVE") return@forEach
        val stationId = station.id as String
        val lat = number(station.position.latitude)
        val lon = number(station.position.longitude)
        vehicleTypes.forEach { vehicleType ->
            val maxRange = AgentRangeSettings.maxRangeMetersFromAgents(agents, vehicleType) ?: return@forEach
            listOf(
                MapRangePurpose.INTER_STATION to AgentRangeSettings.rebalanceHopRadiusMeters(maxRange),
                MapRangePurpose.PACKAGE_PICKUP to AgentRangeSettings.packagePickupRadiusMeters(vehicleType, maxRange),
            ).forEach { (purpose, radiusMeters) ->
                if (radiusMeters <= 0.0) return@forEach
                discs += MapRangeDisc(
                    stationId = stationId,
                    vehicleType = vehicleType,
                    purpose = purpose,
                    lat = lat,
                    lon = lon,
                    radiusMeters = radiusMeters,
                )
            }
        }
    }
    return discs
}

private fun packageDetails(shipment: dynamic, lat: Double, lon: Double): String = buildString {
    appendLine((shipment.id as String).shortId())
    appendLine("Status: ${shipment.status}")
    appendLine("Customer: ${shipment.customerId}")
    val carrier = shipment.carryingAgentId as String?
    if (carrier != null) appendLine("Carrier: $carrier")
    val stationId = shipment.currentStationId as String?
    if (stationId != null) appendLine("At station: $stationId")
    appendLine("Origin: ${coord(shipment.origin)}")
    appendLine("Destination: ${coord(shipment.destination)}")
    append("Shown at: ${lat.formatCoord()}, ${lon.formatCoord()}")
}

private fun shipmentPosition(
    shipment: dynamic,
    stations: Array<dynamic>,
    agents: Array<dynamic>,
): Pair<Double, Double> {
    val carryingAgentId = shipment.carryingAgentId as String?
    if (carryingAgentId != null) {
        val agent = agents.firstOrNull { it.id as String == carryingAgentId }
        if (agent != null) {
            return number(agent.position.latitude) to number(agent.position.longitude)
        }
    }
    val currentStationId = shipment.currentStationId as String?
    if (currentStationId != null) {
        val station = stations.firstOrNull { it.id as String == currentStationId }
        if (station != null) {
            return number(station.position.latitude) to number(station.position.longitude)
        }
    }
    return number(shipment.origin.latitude) to number(shipment.origin.longitude)
}

private fun coord(point: dynamic): String =
    "${number(point.latitude).formatCoord()}, ${number(point.longitude).formatCoord()}"

private fun Double.formatCoord(): String =
    asDynamic().toFixed(5) as String

private fun number(value: dynamic): Double = value as Double
