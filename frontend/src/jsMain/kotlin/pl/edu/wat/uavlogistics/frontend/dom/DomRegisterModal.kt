package pl.edu.wat.uavlogistics.frontend.dom

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch
import org.w3c.dom.HTMLElement
import pl.edu.wat.uavlogistics.frontend.model.MapAddMode
import pl.edu.wat.uavlogistics.frontend.ui.formatCoord
import pl.edu.wat.uavlogistics.frontend.ui.RegisterOverlayState

internal class DomRegisterModal(
    private val scope: CoroutineScope,
    private val backendUrl: () -> String,
    private val onDismiss: () -> Unit,
    private val onSuccess: (String) -> Unit,
    private val onError: (String) -> Unit,
    private val onPickDestinationOnMap: (RegisterOverlayState) -> Unit,
) {
    private val overlay = el("div", "overlay hidden")
    private val formHost = el("div", "overlay-form")
    private val titleEl = el("h2")
    private var draft: RegisterOverlayState? = null

    init {
        val backdrop = el("div", "overlay-backdrop")
        backdrop.onclick = { dismiss(); null }
        val card = el("div", "overlay-card")
        val header = el("header")
        header.appendChild(titleEl)
        header.appendChild(button("×", "secondary") { dismiss() })
        card.appendChild(header)
        card.appendChild(formHost)
        val actions = el("div", "overlay-actions")
        actions.appendChild(button("Submit") { submit() })
        actions.appendChild(button("Cancel", "secondary") { dismiss() })
        card.appendChild(actions)
        overlay.appendChild(backdrop)
        overlay.appendChild(card)
    }

    fun element(): HTMLElement = overlay

    fun show(state: RegisterOverlayState) {
        draft = state
        overlay.classList.remove("hidden")
        renderForm()
    }

    fun updateDraft(state: RegisterOverlayState) {
        draft = state
        overlay.classList.remove("hidden")
        renderForm()
    }

    fun hideForMapPick() {
        overlay.classList.add("hidden")
    }

    private fun renderForm() {
        val state = draft ?: return
        titleEl.textContent = when (state.mode) {
            MapAddMode.STATION -> "Register transfer station"
            MapAddMode.AGENT -> "Register agent"
            MapAddMode.PACKAGE -> "Create shipment"
        }
        formHost.replaceChildren()
        when (state.mode) {
            MapAddMode.PACKAGE -> {
                formHost.appendChild(
                    el(
                        "p",
                        "hint",
                        "Origin: ${state.coord.lat.formatCoord(5)}, ${state.coord.lon.formatCoord(5)}",
                    ),
                )
            }
            else -> {
                formHost.appendChild(
                    el("p", "hint", "Location: ${state.coord.lat.formatCoord(5)}, ${state.coord.lon.formatCoord(5)}"),
                )
            }
        }
        when (state.mode) {
            MapAddMode.STATION -> renderStationFields(state)
            MapAddMode.AGENT -> renderAgentFields(state)
            MapAddMode.PACKAGE -> renderPackageFields(state)
        }
    }

    private fun renderStationFields(state: RegisterOverlayState) {
        field("Station ID", state.stationId) { draft = draft!!.copy(stationId = it) }
        field("Name", state.stationName) { draft = draft!!.copy(stationName = it) }
        field("Storage capacity", state.storageCapacity) { draft = draft!!.copy(storageCapacity = it) }
        field("Parking capacity", state.parkingCapacity) { draft = draft!!.copy(parkingCapacity = it) }
        formHost.appendChild(labeledCheckbox("Activate after create", state.activateStation) {
            draft = draft!!.copy(activateStation = it)
        })
    }

    private fun renderAgentFields(state: RegisterOverlayState) {
        field("Agent ID", state.agentId) { draft = draft!!.copy(agentId = it) }
        field("Type (UAV/UGV)", state.agentType) { value ->
            val type = value.uppercase()
            draft = draft!!.copy(
                agentType = type,
                agentPx4Model = if (type == "UGV") "r1_rover" else "x500",
                agentPayload = if (type == "UGV") "20" else "5",
                agentRange = if (type == "UGV") "8000" else "650",
            )
        }
        field("Altitude m", state.agentAlt) { draft = draft!!.copy(agentAlt = it) }
        field("Range m", state.agentRange) { draft = draft!!.copy(agentRange = it) }
        field("Payload kg", state.agentPayload) { draft = draft!!.copy(agentPayload = it) }
        field("Station ID (optional)", state.agentStationId) { draft = draft!!.copy(agentStationId = it) }
        field("PX4 instance", state.agentPx4Instance) { draft = draft!!.copy(agentPx4Instance = it) }
        field("MAVLink port", state.agentMavlinkPort) { draft = draft!!.copy(agentMavlinkPort = it) }
        formHost.appendChild(labeledCheckbox("Auto-start runtime", state.agentAutoStart) { draft = draft!!.copy(agentAutoStart = it) })
        formHost.appendChild(labeledCheckbox("Activate after register", state.activateAgent) { draft = draft!!.copy(activateAgent = it) })
    }

    private fun renderPackageFields(state: RegisterOverlayState) {
        field("Customer ID", state.customerId) { draft = draft!!.copy(customerId = it) }
        field("Weight kg", state.weightKg) { draft = draft!!.copy(weightKg = it) }
        field("Volume m³", state.volumeM3) { draft = draft!!.copy(volumeM3 = it) }
        formHost.appendChild(el("p", "hint", "Destination (map or coordinates)"))
        val destHint = if (state.destLat.isNotBlank() && state.destLon.isNotBlank()) {
            "Destination: ${state.destLat}, ${state.destLon}"
        } else {
            "Destination: not set — pick on map or enter coordinates below"
        }
        formHost.appendChild(el("p", "hint", destHint))
        formHost.appendChild(
            button("Pick destination on map", "secondary") {
                val current = draft ?: return@button
                hideForMapPick()
                onPickDestinationOnMap(current)
            },
        )
        field("Destination lat", state.destLat) { draft = draft!!.copy(destLat = it) }
        field("Destination lon", state.destLon) { draft = draft!!.copy(destLon = it) }
        formHost.appendChild(labeledCheckbox("Requires ground transport", state.groundTransport) {
            draft = draft!!.copy(groundTransport = it)
        })
    }

    private fun field(label: String, value: String, onChange: (String) -> Unit) {
        val (labelEl, input) = labeledInput(label, value, onChange = onChange)
        formHost.appendChild(labelEl)
        formHost.appendChild(input)
    }

    private fun dismiss() {
        overlay.classList.add("hidden")
        draft = null
        onDismiss()
    }

    private fun submit() {
        val state = draft ?: return
        if (state.mode == MapAddMode.PACKAGE &&
            (state.destLat.isBlank() || state.destLon.isBlank())
        ) {
            onError("Set the destination on the map or enter latitude and longitude.")
            return
        }
        scope.launch {
            runCatching { state.submit(backendUrl()) }
                .onSuccess {
                    dismiss()
                    onSuccess(it)
                }
                .onFailure { onError(it.message ?: "Request failed") }
        }
    }
}

private fun HTMLElement.replaceChildren() {
    while (firstChild != null) removeChild(firstChild!!)
}
