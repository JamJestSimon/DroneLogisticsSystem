package pl.edu.wat.uavlogistics.common

/** Agent type required to execute a shipment (UGV when ground transport is mandatory). */
fun PackageSpec.requiredAgentType(): AgentType? =
    if (requiresGroundTransport) AgentType.UGV else null

fun ShipmentDto.requiredAgentType(): AgentType? = packageSpec.requiredAgentType()

fun Iterable<ShipmentDto>.shipmentById(): Map<String, ShipmentDto> = associateBy { it.id }

fun NetworkStateDto.shipmentFor(task: TransportTaskDto): ShipmentDto? =
    shipments.firstOrNull { it.id == task.shipmentId }

fun NetworkStateDto.shipmentsById(): Map<String, ShipmentDto> = shipments.shipmentById()

fun TransportTaskDto.requiredAgentType(shipment: ShipmentDto?): AgentType? = when (kind) {
    TransportTaskKind.REBALANCE -> null
    else -> shipment?.requiredAgentType()
}

fun TransportTaskDto.requiredAgentType(shipmentsById: Map<String, ShipmentDto>): AgentType? =
    requiredAgentType(shipmentsById[shipmentId])

fun TransportTaskDto.matchesAgentType(agentType: AgentType, shipment: ShipmentDto?): Boolean {
    val required = requiredAgentType(shipment)
    return required == null || required == agentType
}

fun TransportTaskDto.matchesAgentType(agentType: AgentType, shipmentsById: Map<String, ShipmentDto>): Boolean =
    matchesAgentType(agentType, shipmentsById[shipmentId])
