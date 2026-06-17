package pl.edu.wat.uavlogistics.frontend.dom

import kotlin.js.JSON
import kotlinx.browser.document
import kotlinx.browser.window
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.w3c.dom.HTMLElement
import org.w3c.dom.HTMLInputElement
import org.w3c.dom.HTMLPreElement
import pl.edu.wat.uavlogistics.frontend.api.ApiClient
import pl.edu.wat.uavlogistics.frontend.model.GeoCoord
import pl.edu.wat.uavlogistics.frontend.model.AgentRangeSettings
import pl.edu.wat.uavlogistics.frontend.model.MapAddMode
import pl.edu.wat.uavlogistics.frontend.model.MapPoint
import pl.edu.wat.uavlogistics.frontend.model.activeShipments
import pl.edu.wat.uavlogistics.frontend.model.activeTasks
import pl.edu.wat.uavlogistics.frontend.model.dynamicArray
import pl.edu.wat.uavlogistics.frontend.model.customerShipments
import pl.edu.wat.uavlogistics.frontend.model.inactivePackageTasks
import pl.edu.wat.uavlogistics.frontend.model.inactiveRebalanceTasks
import pl.edu.wat.uavlogistics.frontend.model.inactiveShipments
import pl.edu.wat.uavlogistics.frontend.model.inactiveStagingTasks
import pl.edu.wat.uavlogistics.frontend.model.networkToStationRangeDiscs
import pl.edu.wat.uavlogistics.frontend.model.networkToMapPoints
import pl.edu.wat.uavlogistics.frontend.model.parseNetworkState
import pl.edu.wat.uavlogistics.frontend.model.shortId
import pl.edu.wat.uavlogistics.frontend.ui.formatCoord
import pl.edu.wat.uavlogistics.frontend.ui.RegisterOverlayState

object DomApp {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)

    private lateinit var backendInput: HTMLInputElement
    private lateinit var refreshStatus: HTMLElement
    private lateinit var logPre: HTMLPreElement
    private lateinit var pageMap: HTMLElement
    private lateinit var pageState: HTMLElement
    private lateinit var pageHistory: HTMLElement
    private lateinit var pageSettings: HTMLElement
    private lateinit var agentSettings: DomAgentSettings
    private lateinit var mapView: DomMapView
    private lateinit var stateHost: HTMLElement
    private lateinit var historyHost: HTMLElement
    private var historyShipmentsHost: HTMLElement? = null
    private var historyPackageTasksHost: HTMLElement? = null
    private var historyStagingTasksHost: HTMLElement? = null
    private var historyRebalanceTasksHost: HTMLElement? = null
    private var historyTimelineHost: HTMLElement? = null
    private var historyShipmentInput: HTMLInputElement? = null
    private lateinit var modal: DomRegisterModal

    private var backendUrl = "http://localhost:8080"
    private var networkState: dynamic? = null
    private var mapAddMode: MapAddMode? = null
    private var packageDraft: RegisterOverlayState? = null
    private var packagePickDestination = false
    private val modeButtons = mutableMapOf<MapAddMode, HTMLElement>()
    private val navButtons = mutableListOf<HTMLElement>()

    fun mount(root: HTMLElement) {
        root.replaceChildren()

        root.appendChild(el("h1", null, "UAV Logistics Console"))
        root.appendChild(el("p", "subtitle", "Open http://127.0.0.1:8081 · backend API on port 8080"))

        val toolbar = el("section", "toolbar")
        val grow = el("div", "toolbar-grow")
        grow.appendChild(el("label", null, "Backend URL"))
        backendInput = document.createElement("input") as HTMLInputElement
        backendInput.value = backendUrl
        backendInput.oninput = {
            backendUrl = backendInput.value
            null
        }
        grow.appendChild(backendInput)
        toolbar.appendChild(grow)
        toolbar.appendChild(button("Health check") {
            scope.launch {
                runCatching {
                    setLog(ApiClient.request(backendUrl, "/health"))
                    refresh(false)
                }.onFailure { setLog("ERROR: ${failureMessage(it)}") }
            }
        })
        toolbar.appendChild(button("Refresh now", "secondary") {
            scope.launch { runCatching { refresh(true) }.onFailure { setLog("ERROR: ${failureMessage(it)}") } }
        })
        refreshStatus = el("span", "refresh-status", "—")
        toolbar.appendChild(refreshStatus)
        root.appendChild(toolbar)

        val nav = el("nav", "nav")
        navButtons.clear()
        navButtons += tabButton("Map", 0, true) { showPage(0) }
        navButtons += tabButton("Network state", 1, false) { showPage(1) }
        navButtons += tabButton("History", 2, false) { showPage(2) }
        navButtons += tabButton("Agent settings", 3, false) { showPage(3) }
        navButtons.forEach { nav.appendChild(it) }
        root.appendChild(nav)

        pageMap = el("section", "page panel active-page")
        buildMapPage(pageMap)
        root.appendChild(pageMap)

        pageState = el("section", "page panel")
        stateHost = el("div")
        pageState.appendChild(stateHost)
        root.appendChild(pageState)

        pageHistory = el("section", "page panel")
        historyHost = el("div")
        pageHistory.appendChild(buildHistoryPage(historyHost))
        root.appendChild(pageHistory)

        pageSettings = el("section", "page panel")
        agentSettings = DomAgentSettings(
            scope = scope,
            backendUrl = { backendUrl },
            onLog = { setLog(it) },
            onApplied = { scope.launch { refresh(false) } },
        )
        pageSettings.appendChild(agentSettings.element())
        root.appendChild(pageSettings)

        val logPanel = el("section", "panel output-panel")
        logPanel.appendChild(el("h3", null, "Log"))
        logPre = logPre()
        logPre.textContent = "Ready."
        logPanel.appendChild(logPre)
        root.appendChild(logPanel)

        modal = DomRegisterModal(
            scope = scope,
            backendUrl = { backendUrl },
            onDismiss = {
                mapAddMode = null
                packageDraft = null
                packagePickDestination = false
                updateModeButtons()
                mapView.setAddMode(null)
            },
            onPickDestinationOnMap = { state ->
                packageDraft = state
                packagePickDestination = true
                updateModeButtons()
            },
            onSuccess = {
                setLog(ApiClient.pretty(it))
                scope.launch { refresh(false) }
            },
            onError = { setLog("ERROR: $it") },
        )
        root.appendChild(modal.element())

        scope.launch {
            while (true) {
                runCatching { refresh(false) }
                    .onFailure { setLog("ERROR: ${failureMessage(it)}") }
                delay(3_000)
            }
        }
    }

    private fun buildMapPage(host: HTMLElement) {
        val toolbar = el("div", "map-toolbar")
        val modes = el("div", "map-actions")
        MapAddMode.entries.forEach { mode ->
            val btn = button(mode.name.lowercase().replaceFirstChar { it.uppercase() }, "secondary") {
                mapAddMode = if (mapAddMode == mode) null else mode
                updateModeButtons()
                mapView.setAddMode(mapAddMode)
            }
            modeButtons[mode] = btn
            modes.appendChild(btn)
        }
        modes.appendChild(button("Zoom +", "secondary") { mapView.zoomIn() })
        modes.appendChild(button("Zoom −", "secondary") { mapView.zoomOut() })
        modes.appendChild(button("Reset", "secondary") { mapView.resetView() })
        modes.appendChild(button("Gazebo", "secondary") {
            scope.launch {
                runCatching {
                    ApiClient.request(backendUrl, "/api/simulation/gazebo/gui", "POST")
                }.onSuccess {
                    window.open("http://localhost:6080/vnc.html?autoconnect=true&resize=scale", "_blank")
                    setLog(ApiClient.pretty(it))
                }.onFailure { setLog("ERROR: ${failureMessage(it)}") }
            }
        })
        toolbar.appendChild(modes)
        val legend = el("div", "legend")
        legend.appendChild(legendItem("station", "Stations"))
        legend.appendChild(legendItem("agent-uav", "UAV"))
        legend.appendChild(legendItem("agent-ugv", "UGV"))
        legend.appendChild(legendItem("range-uav-travel", "UAV inter-station (dashed)"))
        legend.appendChild(legendItem("range-uav-pickup", "UAV package pickup (solid)"))
        legend.appendChild(legendItem("range-ugv-travel", "UGV inter-station (dashed)"))
        legend.appendChild(legendItem("range-ugv-pickup", "UGV package pickup (solid)"))
        legend.appendChild(legendItem("package", "Packages"))
        toolbar.appendChild(legend)
        host.appendChild(toolbar)

        val hint = el("p", "map-hint hint", "Drag to pan · scroll to zoom (toward cursor) · hover markers for details")
        host.appendChild(hint)

        val mapContainer = el("div")
        mapView = DomMapView(mapContainer) { coord -> onMapClick(coord) }
        host.appendChild(mapContainer)
    }

    private fun buildHistoryPage(host: HTMLElement): HTMLElement {
        val wrap = el("div")
        var shipmentId = ""
        val shipmentInput = document.createElement("input") as HTMLInputElement
        shipmentInput.placeholder = "Shipment ID"
        shipmentInput.oninput = { shipmentId = shipmentInput.value; null }
        historyShipmentInput = shipmentInput
        wrap.appendChild(el("label", null, "Shipment ID"))
        wrap.appendChild(shipmentInput)

        val listHost = el("div", "list-panel")
        val timelineHost = el("div", "timeline")
        historyTimelineHost = timelineHost

        wrap.appendChild(button("Load all shipments") {
            scope.launch {
                runCatching {
                    val json = ApiClient.request(backendUrl, "/api/shipments")
                    val shipments = customerShipments(dynamicArray(JSON.parse(json)))
                    setLog(ApiClient.pretty(json))
                    listHost.replaceChildren()
                    shipments.forEach { shipment ->
                        val id = shipment.id as String
                        val row = button("${id.shortId()} · ${shipment.status}", "shipment-row") {
                            shipmentId = id
                            shipmentInput.value = id
                            scope.launch { loadHistory(id, timelineHost) }
                        }
                        listHost.appendChild(row)
                    }
                }.onFailure { setLog("ERROR: ${failureMessage(it)}") }
            }
        })
        wrap.appendChild(button("Load history", "secondary") {
            if (shipmentId.isBlank()) {
                setLog("Enter a shipment ID first.")
                return@button
            }
            scope.launch { loadHistory(shipmentId, timelineHost) }
        })
        wrap.appendChild(listHost)

        wrap.appendChild(el("h3", "state-section-title", "Inactive shipments"))
        historyShipmentsHost = el("div", "state-list")
        wrap.appendChild(historyShipmentsHost!!)

        wrap.appendChild(el("h3", "state-section-title", "Package tasks"))
        historyPackageTasksHost = el("div", "state-list")
        wrap.appendChild(historyPackageTasksHost!!)

        wrap.appendChild(el("h3", "state-section-title", "Staging tasks"))
        historyStagingTasksHost = el("div", "state-list")
        wrap.appendChild(historyStagingTasksHost!!)

        wrap.appendChild(el("h3", "state-section-title", "Rebalancing tasks"))
        historyRebalanceTasksHost = el("div", "state-list")
        wrap.appendChild(historyRebalanceTasksHost!!)

        wrap.appendChild(el("h3", "state-section-title", "Shipment timeline"))
        wrap.appendChild(timelineHost)
        host.appendChild(wrap)
        renderHistoryArchive()
        return host
    }

    private suspend fun loadHistory(shipmentId: String, timelineHost: HTMLElement) {
        runCatching {
            val json = ApiClient.request(backendUrl, "/api/shipments/${ApiClient.pathSegment(shipmentId)}/history")
            val events = JSON.parse<Array<dynamic>>(json)
            setLog(ApiClient.pretty(json))
            timelineHost.replaceChildren()
            events.forEach { event ->
                val block = el("div", "timeline-event")
                block.appendChild(el("div", "timeline-type", event.type as String))
                block.appendChild(el("div", "timeline-time", event.occurredAt as String))
                block.appendChild(el("p", null, event.description as String))
                timelineHost.appendChild(block)
            }
        }.onFailure { setLog("ERROR: ${failureMessage(it)}") }
    }

    private fun onMapClick(coord: GeoCoord) {
        val mode = mapAddMode ?: return
        if (mode == MapAddMode.PACKAGE) {
            if (packagePickDestination) {
                val draft = packageDraft ?: return
                val updated = draft.copy(
                    destLat = coord.lat.formatCoord(5),
                    destLon = coord.lon.formatCoord(5),
                )
                packageDraft = updated
                packagePickDestination = false
                modal.updateDraft(updated)
                updateModeButtons()
                return
            }
            val draft = RegisterOverlayState(mode, coord)
            packageDraft = draft
            mapView.focusAfterPlacement(coord)
            modal.show(draft)
            return
        }
        mapView.focusAfterPlacement(coord)
        modal.show(RegisterOverlayState(mode, coord))
    }

    private fun updateModeButtons() {
        modeButtons.forEach { (mode, btn) ->
            btn.classList.toggle("active-mode", mapAddMode == mode)
        }
        val hint = pageMap.querySelector(".map-hint")
        hint?.textContent = when {
            packagePickDestination -> "Click the map to set the package destination."
            mapAddMode == MapAddMode.PACKAGE ->
                "Click the map to set the package origin (pick destination in the dialog)."
            mapAddMode != null ->
                "Click the map to place a ${mapAddMode!!.name.lowercase()}."
            else ->
                "Drag to pan · scroll to zoom (toward cursor) · hover markers for details"
        }
    }

    private fun showPage(index: Int) {
        listOf(pageMap, pageState, pageHistory, pageSettings).forEachIndexed { i, page ->
            page.classList.toggle("active-page", i == index)
        }
        navButtons.forEachIndexed { i, btn ->
            btn.classList.toggle("secondary", i != index)
        }
        when (index) {
            2 -> renderHistoryArchive()
            3 -> agentSettings.refreshFromSettings()
        }
    }

    private fun tabButton(label: String, pageIndex: Int, selected: Boolean, onClick: () -> Unit): HTMLElement {
        val btn = button(label, if (selected) null else "secondary", onClick)
        btn.asDynamic().tabIndex = pageIndex
        return btn
    }

    private suspend fun refresh(showInLog: Boolean) {
        val json = ApiClient.request(backendUrl, "/api/network/state")
        networkState = parseNetworkState(json)
        AgentRangeSettings.syncFromNetwork(networkState)
        refreshStatus.textContent = "Updated ${js("new Date().toLocaleTimeString()") as String}"
        if (showInLog) setLog(ApiClient.pretty(json))
        val state = networkState
        val points = if (state != null) networkToMapPoints(state) else emptyList()
        val ranges = if (state != null) networkToStationRangeDiscs(state) else emptyList()
        mapView.setDisplay(points, ranges)
        renderState()
        renderHistoryArchive()
    }

    private fun renderState() {
        stateHost.replaceChildren()
        val state = networkState
        if (state == null) {
            stateHost.appendChild(el("p", "empty-state", "Waiting for network state…"))
            return
        }
        val stations = dynamicArray(state.stations)
        val agents = dynamicArray(state.agents)
        val allShipments = dynamicArray(state.shipments)
        val allTasks = dynamicArray(state.tasks)
        val shipments = activeShipments(allShipments)
        val tasks = activeTasks(allTasks, allShipments)

        val summary = el("div", "state-summary")
        summary.appendChild(statCard(stations.size.toString(), "Stations"))
        summary.appendChild(statCard(agents.size.toString(), "Agents"))
        summary.appendChild(statCard(shipments.size.toString(), "Active shipments"))
        summary.appendChild(statCard(tasks.size.toString(), "Active tasks"))
        stateHost.appendChild(summary)

        stateHost.appendChild(el("h3", "state-section-title", "Stations"))
        val stationGrid = el("div", "state-grid")
        stations.forEach { s ->
            stationGrid.appendChild(entityCard("station-card", s.id as String, s.name as String, s.status as String, stationDetails(s)))
        }
        stateHost.appendChild(stationGrid)

        stateHost.appendChild(el("h3", "state-section-title", "Agents"))
        val agentGrid = el("div", "state-grid")
        agents.forEach { agentGrid.appendChild(entityCard("agent-card", it.id as String, it.type as String, it.status as String, agentDetails(it))) }
        stateHost.appendChild(agentGrid)

        stateHost.appendChild(el("h3", "state-section-title", "Shipments"))
        val shipmentGrid = el("div", "state-grid")
        shipments.forEach { shipmentGrid.appendChild(entityCard("package-card", (it.id as String).shortId(), it.customerId as String, it.status as String, shipmentDetails(it))) }
        stateHost.appendChild(shipmentGrid)

        stateHost.appendChild(el("h3", "state-section-title", "Tasks"))
        val taskList = el("div", "state-list")
        tasks.forEach { appendTaskRow(taskList, it, allShipments) }
        stateHost.appendChild(taskList)
    }

    private fun renderHistoryArchive() {
        val shipmentsHost = historyShipmentsHost ?: return
        val packageTasksHost = historyPackageTasksHost ?: return
        val stagingTasksHost = historyStagingTasksHost ?: return
        val rebalanceTasksHost = historyRebalanceTasksHost ?: return
        shipmentsHost.replaceChildren()
        packageTasksHost.replaceChildren()
        stagingTasksHost.replaceChildren()
        rebalanceTasksHost.replaceChildren()

        val state = networkState
        if (state == null) {
            val waiting = el("p", "empty-state", "Waiting for network state…")
            shipmentsHost.appendChild(waiting)
            packageTasksHost.appendChild(el("p", "empty-state", "Waiting for network state…"))
            stagingTasksHost.appendChild(el("p", "empty-state", "Waiting for network state…"))
            rebalanceTasksHost.appendChild(el("p", "empty-state", "Waiting for network state…"))
            return
        }

        val allShipments = dynamicArray(state.shipments)
        val allTasks = dynamicArray(state.tasks)
        val inactiveShipmentList = inactiveShipments(allShipments)
        val inactivePackageTaskList = inactivePackageTasks(allTasks, allShipments)
        val inactiveStagingTaskList = inactiveStagingTasks(allTasks)
        val inactiveRebalanceTaskList = inactiveRebalanceTasks(allTasks)

        if (inactiveShipmentList.isEmpty()) {
            shipmentsHost.appendChild(el("p", "empty-state", "No delivered or cancelled shipments."))
        } else {
            inactiveShipmentList.forEach { shipment ->
                val id = shipment.id as String
                val row = button("${id.shortId()} · ${shipment.status}", "shipment-row") {
                    historyShipmentInput?.value = id
                    val timeline = historyTimelineHost
                    if (timeline != null) {
                        scope.launch { loadHistory(id, timeline) }
                    }
                }
                shipmentsHost.appendChild(row)
            }
        }

        renderInactiveTaskSection(
            packageTasksHost,
            inactivePackageTaskList,
            allShipments,
            "No completed or cancelled package tasks.",
        )
        renderInactiveTaskSection(
            stagingTasksHost,
            inactiveStagingTaskList,
            allShipments,
            "No completed or cancelled staging tasks.",
        )
        renderInactiveTaskSection(
            rebalanceTasksHost,
            inactiveRebalanceTaskList,
            allShipments,
            "No completed or cancelled rebalancing tasks.",
        )
    }

    private fun renderInactiveTaskSection(
        host: HTMLElement,
        tasks: List<dynamic>,
        shipments: Array<dynamic>,
        emptyMessage: String,
    ) {
        if (tasks.isEmpty()) {
            host.appendChild(el("p", "empty-state", emptyMessage))
        } else {
            tasks.forEach { appendTaskRow(host, it, shipments) }
        }
    }

    private fun appendTaskRow(host: HTMLElement, task: dynamic, shipments: dynamic) {
        val row = el("div", "task-row")
        val kind = (task.kind as? String)?.uppercase() ?: "PACKAGE"
        row.appendChild(el("strong", null, "${(task.id as String).shortId()} · $kind · ${task.status}"))
        val agent = task.assignedAgentId as String?
        val details = when (kind) {
            "STAGING" -> {
                val packageShipment = (task.shipmentId as String).shortId()
                val from = task.startStationId as String? ?: "—"
                val to = task.endStationId as String? ?: "—"
                "for shipment $packageShipment · agent ${agent?.shortId() ?: "—"} · $from → $to"
            }
            "REBALANCE" -> {
                val from = task.startStationId as String? ?: "—"
                val to = task.endStationId as String? ?: "—"
                "agent ${agent?.shortId() ?: "—"} · $from → $to"
            }
            else -> {
                val shipment = dynamicArray(shipments).firstOrNull { (it.id as String) == task.shipmentId }
                val required = if (shipment != null && shipment.packageSpec.requiresGroundTransport == true) "UGV" else "any"
                "shipment ${(task.shipmentId as String).shortId()} · agent ${agent?.shortId() ?: "—"} · " +
                    "requires $required · ${coord(task.startPoint)} → ${coord(task.endPoint)}"
            }
        }
        row.appendChild(el("small", null, details))
        host.appendChild(row)
    }

    private fun statCard(value: String, label: String): HTMLElement {
        val card = el("div", "stat-card")
        card.appendChild(el("span", "stat-value", value))
        card.appendChild(el("span", "stat-label", label))
        return card
    }

    private fun entityCard(className: String, id: String, subtitle: String, status: String, details: String): HTMLElement {
        val card = el("article", "entity-card $className")
        val header = el("header")
        header.appendChild(el("strong", null, id))
        header.appendChild(el("span", "status-badge status-${status.lowercase()}", status))
        card.appendChild(header)
        card.appendChild(el("p", null, subtitle))
        card.appendChild(el("p", null, details))
        return card
    }

    private fun legendItem(dotClass: String, label: String): HTMLElement {
        val item = el("span", "legend-item")
        item.appendChild(el("span", "dot $dotClass"))
        item.append(" $label")
        return item
    }

    private fun stationDetails(station: dynamic): String {
        val p = station.position
        return "${coord(p)} · storage ${station.occupiedStorage}/${station.storageCapacity} · parking ${station.occupiedParking}/${station.parkingCapacity}"
    }

    private fun agentDetails(agent: dynamic): String {
        val p = agent.position
        return "${coord(p)} · ${agent.energyLevelPercent}% · station ${agent.currentStationId ?: "—"}"
    }

    private fun shipmentDetails(shipment: dynamic): String =
        "${coord(shipment.origin)} → ${coord(shipment.destination)} · carrier ${shipment.carryingAgentId ?: "—"}"

    private fun coord(point: dynamic): String =
        "${(point.latitude as Double).formatCoord(5)}, ${(point.longitude as Double).formatCoord(5)}"

    private fun setLog(text: String) {
        logPre.textContent = text
    }
}

private fun HTMLElement.replaceChildren() = clearChildren()
