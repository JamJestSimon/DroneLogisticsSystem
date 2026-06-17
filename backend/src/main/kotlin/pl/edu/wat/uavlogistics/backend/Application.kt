package pl.edu.wat.uavlogistics.backend

import io.ktor.http.HttpStatusCode
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.Application
import io.ktor.server.application.ApplicationCall
import io.ktor.server.application.call
import io.ktor.server.application.install
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.server.plugins.callloging.CallLogging
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.plugins.cors.routing.CORS
import io.ktor.server.plugins.statuspages.StatusPages
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.response.respondText
import io.ktor.server.routing.delete
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.put
import io.ktor.server.routing.route
import io.ktor.server.routing.routing
import kotlinx.serialization.json.Json
import pl.edu.wat.uavlogistics.backend.persistence.DatabaseFactory
import pl.edu.wat.uavlogistics.backend.persistence.DatabaseConfig
import pl.edu.wat.uavlogistics.backend.service.AgentService
import pl.edu.wat.uavlogistics.backend.service.AgentRuntimeLauncher
import pl.edu.wat.uavlogistics.backend.service.AuthorizationService
import pl.edu.wat.uavlogistics.backend.service.ConflictException
import pl.edu.wat.uavlogistics.backend.service.FrontendStartupService
import pl.edu.wat.uavlogistics.backend.service.GazeboSimulationService
import pl.edu.wat.uavlogistics.backend.service.NetworkStateService
import pl.edu.wat.uavlogistics.backend.service.NotFoundException
import pl.edu.wat.uavlogistics.backend.service.ServiceException
import pl.edu.wat.uavlogistics.backend.service.ShipmentService
import pl.edu.wat.uavlogistics.backend.service.SimulationStartupService
import pl.edu.wat.uavlogistics.backend.service.StationSlotService
import pl.edu.wat.uavlogistics.backend.service.StationService
import pl.edu.wat.uavlogistics.backend.service.TaskService
import pl.edu.wat.uavlogistics.backend.service.ValidationException
import pl.edu.wat.uavlogistics.common.ClaimTaskRequest
import pl.edu.wat.uavlogistics.common.AbandonRelocationClaimRequest
import pl.edu.wat.uavlogistics.common.CompleteRebalanceTaskRequest
import pl.edu.wat.uavlogistics.common.CompleteStagingTaskRequest
import pl.edu.wat.uavlogistics.common.CompleteTaskRequest
import pl.edu.wat.uavlogistics.common.EnsureRebalanceTaskRequest
import pl.edu.wat.uavlogistics.common.EnsureStagingTaskRequest
import pl.edu.wat.uavlogistics.common.CreateShipmentRequest
import pl.edu.wat.uavlogistics.common.ErrorResponse
import pl.edu.wat.uavlogistics.common.AttachPackageRequest
import pl.edu.wat.uavlogistics.common.PackagePoseRequest
import pl.edu.wat.uavlogistics.common.PickupTaskRequest
import pl.edu.wat.uavlogistics.common.RegisterAgentRequest
import pl.edu.wat.uavlogistics.common.RegisterStationRequest
import pl.edu.wat.uavlogistics.common.ReserveStationSlotRequest
import pl.edu.wat.uavlogistics.common.UpdateAgentStateRequest
import pl.edu.wat.uavlogistics.common.FleetRangeSettingsDto
import pl.edu.wat.uavlogistics.common.UpdateStationStateRequest
import pl.edu.wat.uavlogistics.backend.service.FleetRangeSettingsService

fun main() {
    embeddedServer(
        Netty,
        port = System.getenv("PORT")?.toIntOrNull() ?: 8080,
        host = "0.0.0.0",
        module = Application::module,
    ).start(wait = true)
}

fun Application.module() {
    DatabaseFactory.init()
    configureHttpApi()
}

fun Application.moduleWithDatabase(config: DatabaseConfig) {
    DatabaseFactory.init(config)
    configureHttpApi()
}

private fun Application.configureHttpApi() {
    FrontendStartupService.fromEnv().startFrontend()
    val simulation = GazeboSimulationService.fromEnv()
    SimulationStartupService(simulation).restoreRegistryVisuals()
    val stationSlots = StationSlotService()
    val shipments = ShipmentService(simulation)
    val tasks = TaskService(simulation)
    val agents = AgentService(AgentRuntimeLauncher.fromEnv(), stationSlots)
    val stations = StationService(simulation)
    val fleetRangeSettings = FleetRangeSettingsService()
    val network = NetworkStateService(stationSlots, fleetRangeSettings)
    val auth = AuthorizationService()

    install(ContentNegotiation) {
        json(
            Json {
                prettyPrint = true
                ignoreUnknownKeys = true
                encodeDefaults = true
            },
        )
    }
    install(CallLogging)
    install(CORS) {
        anyHost()
        allowHeader(HttpHeaders.ContentType)
        allowHeader("X-User-Role")
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
    }
    install(StatusPages) {
        exception<NotFoundException> { call, cause ->
            call.respond(HttpStatusCode.NotFound, ErrorResponse(cause.message ?: "Not found."))
        }
        exception<ConflictException> { call, cause ->
            call.respond(HttpStatusCode.Conflict, ErrorResponse(cause.message ?: "Conflict."))
        }
        exception<ValidationException> { call, cause ->
            call.respond(HttpStatusCode.BadRequest, ErrorResponse(cause.message ?: "Validation failed."))
        }
        exception<ServiceException> { call, cause ->
            call.respond(HttpStatusCode.BadRequest, ErrorResponse(cause.message ?: "Service error."))
        }
    }

    routing {
        get("/health") {
            call.respond(mapOf("status" to "ok"))
        }

        route("/api/shipments") {
            get {
                call.respond(shipments.listShipments())
            }
            post {
                call.respond(HttpStatusCode.Created, shipments.createShipment(call.receive<CreateShipmentRequest>()))
            }
            get("{id}") {
                call.respond(shipments.getShipment(call.requiredPath("id")))
            }
            delete("{id}") {
                call.respond(shipments.cancelShipment(call.requiredPath("id")))
            }
            get("{id}/history") {
                call.respond(shipments.history(call.requiredPath("id")))
            }
        }

        route("/api/tasks") {
            get("available") {
                call.respond(tasks.listAvailableTasks(call.request.queryParameters["agentId"]))
            }
            post("{id}/claim") {
                val body = call.receive<ClaimTaskRequest>()
                call.respond(tasks.claimTask(call.requiredPath("id"), body.agentId))
            }
            post("{id}/pickup") {
                call.respond(tasks.pickUpTask(call.requiredPath("id"), call.receive<PickupTaskRequest>()))
            }
            post("{id}/complete") {
                call.respond(tasks.completeTask(call.requiredPath("id"), call.receive<CompleteTaskRequest>()))
            }
            post("{id}/complete-rebalance") {
                val body = call.receive<CompleteRebalanceTaskRequest>()
                call.respond(tasks.completeRebalanceTask(call.requiredPath("id"), body.agentId))
            }
            post("{id}/abandon-relocation") {
                val body = call.receive<AbandonRelocationClaimRequest>()
                tasks.abandonRelocationClaim(call.requiredPath("id"), body.agentId)
                call.respond(HttpStatusCode.NoContent)
            }
            post("rebalance/ensure") {
                val body = call.receive<EnsureRebalanceTaskRequest>()
                val task = tasks.ensureRebalanceTask(body.fromStationId, body.toStationId)
                if (task == null) {
                    call.respond(HttpStatusCode.NoContent)
                } else {
                    call.respond(task)
                }
            }
            post("staging/ensure") {
                val body = call.receive<EnsureStagingTaskRequest>()
                val task = tasks.ensureStagingTask(
                    agentId = body.agentId,
                    packageTaskId = body.packageTaskId,
                    fromStationId = body.fromStationId,
                    toStationId = body.toStationId,
                )
                if (task == null) {
                    call.respond(HttpStatusCode.NoContent)
                } else {
                    call.respond(task)
                }
            }
            post("{id}/complete-staging") {
                val body = call.receive<CompleteStagingTaskRequest>()
                call.respond(tasks.completeStagingTask(call.requiredPath("id"), body.agentId))
            }
            post("staging/cancel-for-package/{packageTaskId}") {
                tasks.cancelAvailableStagingForPackage(call.requiredPath("packageTaskId"))
                call.respond(HttpStatusCode.NoContent)
            }
        }

        route("/api/agents") {
            get {
                call.respond(agents.list())
            }
            post {
                call.respond(HttpStatusCode.Created, agents.register(call.receive<RegisterAgentRequest>()))
            }
            get("{id}") {
                call.respond(agents.get(call.requiredPath("id")))
            }
            post("{id}/activate") {
                call.respond(agents.activate(call.requiredPath("id")))
            }
            put("{id}/state") {
                call.respond(agents.updateState(call.requiredPath("id"), call.receive<UpdateAgentStateRequest>()))
            }
            delete("{id}") {
                auth.requireAdmin(call)
                call.respond(agents.withdraw(call.requiredPath("id")))
            }
            delete("{id}/purge") {
                auth.requireAdmin(call)
                agents.purge(call.requiredPath("id"))
                call.respond(HttpStatusCode.NoContent)
            }
        }

        route("/api/stations") {
            get {
                call.respond(stations.list())
            }
            post {
                auth.requireAdmin(call)
                call.respond(HttpStatusCode.Created, stations.register(call.receive<RegisterStationRequest>()))
            }
            get("{id}") {
                call.respond(stations.get(call.requiredPath("id")))
            }
            post("{id}/activate") {
                auth.requireAdmin(call)
                call.respond(stations.activate(call.requiredPath("id")))
            }
            put("{id}/state") {
                auth.requireAdmin(call)
                call.respond(stations.updateState(call.requiredPath("id"), call.receive<UpdateStationStateRequest>()))
            }
            post("{id}/parking-slots/reserve") {
                val request = call.receive<ReserveStationSlotRequest>()
                call.respond(
                    stationSlots.reserveParkingSlot(
                        call.requiredPath("id"),
                        request.agentId,
                        request.allowEphemeral,
                    ),
                )
            }
            delete("{id}/parking-slots/{slotIndex}/reservation") {
                stationSlots.releaseParkingSlot(
                    stationId = call.requiredPath("id"),
                    slotIndex = call.requiredPath("slotIndex").toIntOrNull()
                        ?: throw ValidationException("Invalid parking slot index."),
                    agentId = call.request.queryParameters["agentId"],
                )
                call.respond(HttpStatusCode.NoContent)
            }
            post("{id}/parking-slots/{slotIndex}/confirm-occupancy") {
                val request = call.receive<pl.edu.wat.uavlogistics.common.ConfirmParkingOccupancyRequest>()
                call.respond(
                    stationSlots.confirmParkingOccupancy(
                        stationId = call.requiredPath("id"),
                        slotIndex = call.requiredPath("slotIndex").toIntOrNull()
                            ?: throw ValidationException("Invalid parking slot index."),
                        agentId = request.agentId,
                    ),
                )
            }
            delete("{id}") {
                auth.requireAdmin(call)
                call.respond(stations.withdraw(call.requiredPath("id")))
            }
        }

        get("/api/network/state") {
            call.respond(network.snapshot())
        }

        route("/api/settings/fleet-range") {
            get {
                call.respond(fleetRangeSettings.current())
            }
            put {
                call.respond(fleetRangeSettings.update(call.receive<FleetRangeSettingsDto>()))
            }
        }

        route("/api/simulation") {
            // Agents call these during flight (CargoVisualClient → docker exec gazebo-sim, same world as spawnPackage).
            post("gazebo/gui") {
                if (simulation.startGazeboGui()) {
                    call.respondText(
                        "Gazebo GUI launch requested. Browser GUI is available at http://localhost:6080/vnc.html. If it does not load, check build/runtime/gazebo-gui-start.log.",
                        status = HttpStatusCode.Accepted,
                    )
                } else {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponse("Gazebo simulation is disabled."))
                }
            }
            post("packages/{shipmentId}/attach") {
                val shipment = shipments.getShipment(call.requiredPath("shipmentId"))
                val request = call.receive<AttachPackageRequest>()
                val agent = agents.get(shipment.carryingAgentId ?: request.agentId)
                simulation.pickupVisual(shipment.id, request.position, agent.type)
                call.respond(HttpStatusCode.Accepted)
            }
            put("packages/{shipmentId}/cargo-pose") {
                val shipment = shipments.getShipment(call.requiredPath("shipmentId"))
                val request = call.receive<PackagePoseRequest>()
                val agentType = shipment.carryingAgentId
                    ?.let { agents.get(it).type }
                    ?: pl.edu.wat.uavlogistics.common.AgentType.UAV
                simulation.moveCargo(shipment.id, request.position, agentType)
                call.respond(HttpStatusCode.Accepted)
            }
            post("packages/{shipmentId}/release") {
                val shipment = shipments.getShipment(call.requiredPath("shipmentId"))
                val agentType = shipment.carryingAgentId
                    ?.let { agents.get(it).type }
                    ?: pl.edu.wat.uavlogistics.common.AgentType.UAV
                simulation.dropVisual(
                    shipmentId = shipment.id,
                    position = call.receive<PackagePoseRequest>().position,
                    agentType = agentType,
                )
                call.respond(HttpStatusCode.Accepted)
            }
        }
    }
}

private fun ApplicationCall.requiredPath(name: String): String =
    parameters[name] ?: throw ValidationException("Missing path parameter: $name")
