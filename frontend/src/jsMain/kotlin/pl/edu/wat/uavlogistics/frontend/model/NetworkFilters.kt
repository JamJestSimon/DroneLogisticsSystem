package pl.edu.wat.uavlogistics.frontend.model

/** Synthetic registry row for [TransportTaskKind.REBALANCE]; not a customer package. */
const val REBALANCE_SYSTEM_SHIPMENT_ID = "00000000-0000-4000-8000-000000000001"

private val INACTIVE_SHIPMENT_STATUSES = setOf(
    "DELIVERED",
    "CANCELLED",
)

private val INACTIVE_TASK_STATUSES = setOf(
    "COMPLETED",
    "CANCELLED",
)

fun dynamicArray(value: dynamic): Array<dynamic> {
    if (value == null) return emptyArray()
    val isArray = js("Array.isArray")(value) as Boolean
    return if (isArray) value.unsafeCast<Array<dynamic>>() else emptyArray()
}

fun statusString(value: dynamic): String =
    if (value == null) "" else value.toString().trim().uppercase()

fun isCustomerShipment(shipment: dynamic): Boolean =
    (shipment.id as? String) != REBALANCE_SYSTEM_SHIPMENT_ID

fun customerShipments(shipments: Array<dynamic>): List<dynamic> =
    dynamicArray(shipments).filter { isCustomerShipment(it) }

fun taskKind(task: dynamic): String {
    val kind = statusString(task.kind)
    return kind.ifEmpty { "PACKAGE" }
}

fun isPackageTask(task: dynamic): Boolean = taskKind(task) == "PACKAGE"

fun isStagingTask(task: dynamic): Boolean = taskKind(task) == "STAGING"

fun isRebalanceTask(task: dynamic): Boolean = taskKind(task) == "REBALANCE"

fun isInactiveShipment(shipment: dynamic): Boolean =
    statusString(shipment.status) in INACTIVE_SHIPMENT_STATUSES

fun isInactiveTask(task: dynamic, shipments: Array<dynamic>): Boolean {
    if (statusString(task.status) in INACTIVE_TASK_STATUSES) return true
    if (!isPackageTask(task)) return false
    val shipmentId = task.shipmentId as? String ?: return false
    val shipment = shipments.firstOrNull { (it.id as? String) == shipmentId } ?: return false
    return isInactiveShipment(shipment)
}

fun activeShipments(shipments: Array<dynamic>): List<dynamic> =
    customerShipments(shipments).filter { !isInactiveShipment(it) }

fun inactiveShipments(shipments: Array<dynamic>): List<dynamic> =
    customerShipments(shipments).filter { isInactiveShipment(it) }

fun activeTasks(tasks: Array<dynamic>, shipments: Array<dynamic>): List<dynamic> {
    val shipmentList = dynamicArray(shipments)
    return dynamicArray(tasks).filter { !isInactiveTask(it, shipmentList) }
}

fun inactiveTasks(tasks: Array<dynamic>, shipments: Array<dynamic>): List<dynamic> {
    val shipmentList = dynamicArray(shipments)
    return dynamicArray(tasks).filter { isInactiveTask(it, shipmentList) }
}

fun inactivePackageTasks(tasks: Array<dynamic>, shipments: Array<dynamic>): List<dynamic> {
    val shipmentList = dynamicArray(shipments)
    return dynamicArray(tasks).filter { isPackageTask(it) && isInactiveTask(it, shipmentList) }
}

fun inactiveStagingTasks(tasks: Array<dynamic>): List<dynamic> =
    dynamicArray(tasks).filter { isStagingTask(it) && statusString(it.status) in INACTIVE_TASK_STATUSES }

fun inactiveRebalanceTasks(tasks: Array<dynamic>): List<dynamic> =
    dynamicArray(tasks).filter { isRebalanceTask(it) && statusString(it.status) in INACTIVE_TASK_STATUSES }
