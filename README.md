# UAV Logistics System

Kotlin foundation for a simulated package distribution system using UAV/UGV agents, Gazebo Simulator, and PX4 Autopilot.

The backend is a shared state registry. It validates state changes and atomically assigns tasks, but it does not centrally decide which agent should execute a task. Each controller process reads registry state, chooses a feasible task locally, claims it, plans a route, and sends movement commands through a PX4 adapter boundary.

## Modules

- `common` - DTOs, lifecycle enums, geometry helpers, and API messages.
- `backend` - Ktor HTTP API, PostgreSQL registry, Exposed persistence, Flyway migration, domain services.
- `agent-controller` - single-agent UAV/UGV controller loop, route scoring, backend client, MAVSDK/PX4 adapter boundary.
- `frontend` - Compose Multiplatform (Material 3) browser UI on Kotlin/JS for map, network state, and registry operations.

## Local Backend

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Run the backend:

```bash
./gradlew :backend:run
```

Health check:

```bash
curl http://localhost:8080/health
```

## Seed Data

Use the frontend registration overlay or the scenario scripts under `runtime/local/` (for example `run-scenario-1.ps1`) to register stations and create shipments after the backend starts.

## Test Front-End

The UI is a **Compose Multiplatform** web app (not plain HTML/DOM). It is served by the Gradle webpack dev server, **not** by the Ktor backend.

| Service | URL |
|---------|-----|
| Backend API | `http://localhost:8080` |
| Frontend UI | `http://127.0.0.1:8081` |

By default, backend startup also launches the dev server through `runtime/local/start-frontend.ps1`. Control this with:

```bash
FRONTEND_START_ON_BACKEND=true
FRONTEND_DEV_SERVER_HOST=127.0.0.1
FRONTEND_DEV_SERVER_PORT=8081
```

Start or restart the UI manually after code changes:

```bash
./gradlew :frontend:jsBrowserDevelopmentRun
```

Then open `http://127.0.0.1:8081` and hard-refresh (`Ctrl+Shift+R`) if the page looks stale.

The UI provides:

- health check and full network state snapshot
- create and activate a transfer station with latitude, longitude, package capacity, drone parking capacity, and charger count
- create a sample shipment with origin/destination coordinates, weight, volume, and transport constraints
- register and activate a UAV or UGV agent with position, range, payload capacity, PX4 model, PX4 instance, MAVLink port, and optional auto-start
- list available tasks for the selected agent
- claim the first available task
- view an auto-refreshing, pannable map of agents, packages, and transfer stations
- browse package history from the shipment event journal

The backend enables development CORS for this console, including the `X-User-Role: ADMIN` header used by station operations.

## Agent Controller

Controllers always use the PX4 MAVLink adapter. Keep `PX4_CONNECTION` aligned with the PX4 MAVLink UDP endpoint, for example:

```bash
AGENT_ID=uav-1 AGENT_TYPE=UAV BACKEND_URL=http://localhost:8080 PX4_CONNECTION=udp://:14540 ./gradlew :agent-controller:run
```

By default the adapter uploads a PX4 mission (`MISSION_ITEM_INT`), switches to AUTO mission mode, arms, and lets PX4 navigate each route leg. Set `AGENT_NAV_MODE=offboard` to use the legacy Offboard position-setpoint stream instead.

Mission-related environment variables:

```bash
AGENT_NAV_MODE=mission
UAV_MISSION_ACCEPTANCE_RADIUS_M=5
ROVER_MISSION_ACCEPTANCE_RADIUS_M=4
ROVER_MISSION_SPEED_MPS=1.5
MISSION_UPLOAD_TIMEOUT_MS=30000
MISSION_EXECUTION_TIMEOUT_MS=120000
```

Use `udp://:14540` when PX4 sends to the controller port, or `udp://127.0.0.1:14540` when the controller should send to a known PX4 UDP endpoint.

The controller simulates usable agent energy on top of telemetry. Each executed route spends energy based on planned distance/range, with a minimum spend for very short visual test routes. Agents at a transfer station enter `CHARGING` when they need to recover and become available again after timed recharge ticks:

```bash
AGENT_CHARGE_PERCENT_PER_SECOND=1.0
AGENT_MIN_ROUTE_ENERGY_SPEND_PERCENT=0.5
```

## Agent Runtime Auto-Start

Agent registration can automatically start a dedicated runtime for that agent when the request contains:

```json
{
  "runtime": {
    "autoStart": true,
    "px4Model": "x500",
    "px4Instance": 0,
    "mavlinkPort": 14580,
    "spawnInGazebo": true
  }
}
```

The backend runtime launcher is configured with environment variables:

```bash
AGENT_RUNTIME_MODE=docker
PROJECT_ROOT=C:\Users\Szymon\Documents\Magisterka\Projekt
BACKEND_PUBLIC_URL=http://host.docker.internal:8080
```

Each agent runs in its own `agent-runtime` container (isolated MAVLink ports). A shared `gazebo-sim` container hosts the world; the backend drives it with `docker compose exec …/runtime/docker/gazebo-sim.sh`. See `runtime/README.md` for script layout.

For a clean Windows dev stack (wipe DB, rebuild images, start sim + backend + frontend):

```powershell
.\runtime\local\reset-runtime-environment.ps1 -StartSimulation -StartBackend -StartFrontend
.\runtime\local\run-scenario-1.ps1 -SkipReset
```

For UGV simulation, register an `UGV` agent with `px4Model` set to one of the PX4 Gazebo rover models, for example `r1_rover`, `rover_ackermann`, `rover_differential`, or `rover_mecanum`. The frontend switches to `r1_rover` automatically when `UGV` is selected.

Package visualization in Gazebo is controlled by:

```bash
SIMULATION_GAZEBO_ENABLED=true
SIMULATION_GAZEBO_START_ON_BACKEND=false
SIMULATION_GAZEBO_STARTUP_DELAY_MS=7000
SIMULATION_RESTORE_AGENT_VISUALS=false
SIMULATION_COMPLETED_PACKAGE_DESPAWN_DELAY_MS=5000
SIM_ORIGIN_LAT=47.397971
SIM_ORIGIN_LON=8.546164
GZ_WORLD=default
GZ_PARTITION=uav-logistics
```

When enabled, the backend restores visual state from the registry (stations and non-terminal packages). Agent models are not respawned by default because PX4 runtimes create their own Gazebo models (`x500_0`, rover names, etc.); set `SIMULATION_RESTORE_AGENT_VISUALS=true` only for non-runtime visualization.

The backend creates a `package-<shipment-id>` box when a shipment is created and a `station-<station-id>` marker when a transfer station is registered. Pickup uses a rigid `cargo_x500_N` payload with DetachableJoint (pose-follow fallback if attach fails). Final-delivery visuals are removed after `SIMULATION_COMPLETED_PACKAGE_DESPAWN_DELAY_MS`. Keep scenario coordinates near `SIM_ORIGIN_LAT` / `SIM_ORIGIN_LON`.

The frontend **Open Gazebo GUI** button starts the `gazebo-gui` Compose service (noVNC at `http://localhost:6080/vnc.html`). On Windows, enable Docker Desktop WSL integration for your Ubuntu distro so the GUI container can use WSLg display sockets.

The container runtime in `runtime/docker` defines a `gazebo-sim` service and one `agent-runtime` service containing PX4-Autopilot and the Kotlin controller. Use them through:

```bash
docker compose -f runtime/docker/docker-compose.agent.yml up -d --build gazebo-sim
AGENT_ID=uav-2 AGENT_TYPE=UAV PX4_MODEL=x500 PX4_INSTANCE=2 MAVLINK_PORT=14582 docker compose -f runtime/docker/docker-compose.agent.yml run -d agent-runtime
```

## Main API

- `POST /api/shipments` creates a shipment and exposes its initial transport task.
- `GET /api/shipments/{id}/history` returns the timestamped package event timeline stored in `shipment_events`.
- `GET /api/tasks/available?agentId=...` returns tasks visible to an agent.
- `POST /api/tasks/{id}/claim` atomically assigns a task to one agent.
- `POST /api/tasks/{id}/pickup` marks package pickup after the assigned agent reaches the pickup point.
- `POST /api/tasks/{id}/complete` completes a delivery or station handoff.
- `POST /api/agents`, `POST /api/agents/{id}/activate`, `PUT /api/agents/{id}/state` manage agent lifecycle.
- `POST /api/stations`, `POST /api/stations/{id}/activate`, `PUT /api/stations/{id}/state` manage transfer stations.
- `GET /api/network/state` returns a registry snapshot for monitoring.

Administrative station and withdrawal operations require the simple development header:

```bash
X-User-Role: ADMIN
```

## Tests

```bash
./gradlew test
```

Manual Gazebo/PX4 behavior scenarios are documented in `docs/behavior-test-scenarios.md`.
