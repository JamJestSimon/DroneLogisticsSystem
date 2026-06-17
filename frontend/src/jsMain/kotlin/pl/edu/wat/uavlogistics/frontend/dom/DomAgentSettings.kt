package pl.edu.wat.uavlogistics.frontend.dom

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch
import org.w3c.dom.HTMLInputElement
import org.w3c.dom.HTMLElement
import pl.edu.wat.uavlogistics.frontend.api.ApiClient
import pl.edu.wat.uavlogistics.frontend.model.AgentRangeSettings

internal class DomAgentSettings(
    private val scope: CoroutineScope,
    private val backendUrl: () -> String,
    private val onLog: (String) -> Unit,
    private val onApplied: () -> Unit,
) {
    private val host = el("div", "settings-page")
    private val uavInput: HTMLInputElement
    private val ugvInput: HTMLInputElement
    private val reserveInput: HTMLInputElement
    private val previewHost = el("div", "settings-preview")

    init {
        val panel = el("section", "panel settings-form")
        panel.appendChild(el("h2", null, "Agent range settings"))
        panel.appendChild(
            el(
                "p",
                "hint",
                "Global max range per vehicle class. Map shows two radii per class at each station: " +
                    "inter-station travel (one-way + reserve) and package pickup (out & back + reserve, ÷2). " +
                    "UGV paths use factor 1.35. Apply updates every registered agent in the backend.",
            ),
        )

        val (uavLabel, uavField) = labeledInput("UAV max range (m)", uavMaxText(), "number") { draft ->
            AgentRangeSettings.applyValues(
                uav = draft.toDoubleOrNull() ?: AgentRangeSettings.uavMaxRangeMeters,
                ugv = AgentRangeSettings.ugvMaxRangeMeters,
                reserve = AgentRangeSettings.routeReservePercent,
            )
            renderPreview()
        }
        uavInput = uavField
        panel.appendChild(uavLabel)
        panel.appendChild(uavInput)

        val (ugvLabel, ugvField) = labeledInput("UGV max range (m)", ugvMaxText(), "number") { draft ->
            AgentRangeSettings.applyValues(
                uav = AgentRangeSettings.uavMaxRangeMeters,
                ugv = draft.toDoubleOrNull() ?: AgentRangeSettings.ugvMaxRangeMeters,
                reserve = AgentRangeSettings.routeReservePercent,
            )
            renderPreview()
        }
        ugvInput = ugvField
        panel.appendChild(ugvLabel)
        panel.appendChild(ugvInput)

        val (reserveLabel, reserveField) = labeledInput(
            "Route energy reserve (%)",
            reserveText(),
            "number",
        ) { draft ->
            AgentRangeSettings.applyValues(
                uav = AgentRangeSettings.uavMaxRangeMeters,
                ugv = AgentRangeSettings.ugvMaxRangeMeters,
                reserve = draft.toDoubleOrNull() ?: AgentRangeSettings.routeReservePercent,
            )
            renderPreview()
        }
        reserveInput = reserveField
        panel.appendChild(reserveLabel)
        panel.appendChild(reserveInput)

        panel.appendChild(previewHost)
        renderPreview()

        val actions = el("div", "settings-actions")
        actions.appendChild(
            button("Apply to fleet") {
                scope.launch { applyToFleet() }
            },
        )
        actions.appendChild(
            button("Reset defaults", "secondary") {
                AgentRangeSettings.applyValues(
                    uav = AgentRangeSettings.DEFAULT_UAV_MAX_RANGE_METERS,
                    ugv = AgentRangeSettings.DEFAULT_UGV_MAX_RANGE_METERS,
                    reserve = AgentRangeSettings.DEFAULT_ROUTE_RESERVE_PERCENT,
                    persistLocally = true,
                )
                refreshFields()
                renderPreview()
            },
        )
        panel.appendChild(actions)
        host.appendChild(panel)
    }

    fun element(): HTMLElement = host

    fun refreshFromSettings() {
        refreshFields()
        renderPreview()
    }

    private fun refreshFields() {
        uavInput.value = uavMaxText()
        ugvInput.value = ugvMaxText()
        reserveInput.value = reserveText()
    }

    private suspend fun applyToFleet() {
        AgentRangeSettings.applyValues(
            uav = uavInput.value.toDoubleOrNull() ?: AgentRangeSettings.uavMaxRangeMeters,
            ugv = ugvInput.value.toDoubleOrNull() ?: AgentRangeSettings.ugvMaxRangeMeters,
            reserve = reserveInput.value.toDoubleOrNull() ?: AgentRangeSettings.routeReservePercent,
            persistLocally = true,
        )
        runCatching {
            val response = ApiClient.request(
                backendUrl(),
                "/api/settings/fleet-range",
                "PUT",
                AgentRangeSettings.toApiBody(),
            )
            onLog("Fleet range updated.\n\n${ApiClient.pretty(response)}")
            onApplied()
        }.onFailure {
            onLog("ERROR: ${failureMessage(it)}")
        }
    }

    private fun renderPreview() {
        previewHost.clearChildren()
        previewHost.appendChild(el("h3", "state-section-title", "Computed map radii"))
        listOf("UAV", "UGV").forEach { type ->
            val max = AgentRangeSettings.maxRangeMetersForType(type).toInt()
            val travel = AgentRangeSettings.interStationRadiusMeters(type).toInt()
            val pickup = AgentRangeSettings.packagePickupRadiusMeters(type).toInt()
            val reserve = AgentRangeSettings.routeReservePercent.toInt()
            previewHost.appendChild(
                el("p", null, "$type · max ${max} m · reserve ${reserve}%"),
            )
            previewHost.appendChild(
                el("p", null, "  Inter-station travel (one-way): ${travel} m"),
            )
            previewHost.appendChild(
                el("p", null, "  Package pickup (out & back): ${pickup} m"),
            )
        }
    }

    private fun uavMaxText(): String = AgentRangeSettings.uavMaxRangeMeters.toString()
    private fun ugvMaxText(): String = AgentRangeSettings.ugvMaxRangeMeters.toString()
    private fun reserveText(): String = AgentRangeSettings.routeReservePercent.toString()
}
