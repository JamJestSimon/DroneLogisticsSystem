package pl.edu.wat.uavlogistics.controller

import pl.edu.wat.uavlogistics.common.GeoPoint

/**
 * Option A cargo visuals in the **gazebo-sim** Docker world (via backend → docker compose exec).
 * Agents must not call [gazebo-sim.sh] in-process: that targets a different GZ transport peer than
 * backend-spawned ground packages.
 */
class CargoVisualClient(
    private val enabled: Boolean,
    private val backend: BackendClient,
    private val agentId: String,
) {
    private var carriedShipmentId: String? = null
    private var lastMoveAtMs = 0L
    private val followMinIntervalMs =
        (System.getenv("SIMULATION_POSE_FOLLOW_MIN_INTERVAL_MS") ?: "400").toLong()

    suspend fun acquire(shipmentId: String, carrierPosition: GeoPoint): Boolean {
        if (!enabled) return true
        carriedShipmentId = shipmentId
        return runCatching {
            backend.attachPackageVisual(shipmentId, agentId, carrierPosition)
            true
        }.onFailure {
            println("CargoVisualClient: pickup-visual failed for $shipmentId: ${it.message}")
        }.getOrDefault(false)
    }

    suspend fun followCarrier(shipmentId: String, carrierPosition: GeoPoint) {
        if (!enabled || carriedShipmentId != shipmentId) return
        val now = System.currentTimeMillis()
        if (now - lastMoveAtMs < followMinIntervalMs) return
        lastMoveAtMs = now
        runCatching {
            backend.moveCargoVisual(shipmentId, carrierPosition)
        }.onFailure {
            println("CargoVisualClient: move-cargo failed for $shipmentId: ${it.message}")
        }
    }

    suspend fun release(shipmentId: String, dropPosition: GeoPoint): Boolean {
        if (!enabled) return true
        carriedShipmentId = null
        return runCatching {
            backend.releasePackageVisual(shipmentId, dropPosition)
            true
        }.onFailure {
            println("CargoVisualClient: drop-visual failed for $shipmentId: ${it.message}")
        }.getOrDefault(false)
    }

    fun clearCarryState() {
        carriedShipmentId = null
    }

    companion object {
        fun fromEnv(backend: BackendClient, agentId: String): CargoVisualClient =
            CargoVisualClient(
                enabled = (System.getenv("SIMULATION_GAZEBO_ENABLED") ?: "true").toBoolean(),
                backend = backend,
                agentId = agentId,
            )
    }
}
