# Runtime layout

Simulation and PX4 agents run in **Docker**. Scripts on the Windows host only orchestrate Compose, Gradle, and API seeding.

## `runtime/docker/` (inside containers)

| File | Role |
|------|------|
| `docker-compose.agent.yml` | `gazebo-sim`, `gazebo-gui`, `agent-runtime` services |
| `Dockerfile.agent-runtime` | PX4, Gazebo, JDK, project copy |
| `gazebo-sim.sh` | Package/station/cargo CRUD via `gz` (single source of truth) |
| `start-gazebo-sim.sh` | Headless Gazebo server entrypoint |
| `start-gazebo-gui.sh` | noVNC GUI (`http://localhost:6080/vnc.html`) |
| `start-agent-runtime.sh` | PX4 SITL + Kotlin controller per agent container |
| `prepare-x500-cargo-models.sh` | Patches x500 SDF with DetachableJoint plugins (run from `start-gazebo-sim.sh`) |

After changing `gazebo-sim.sh`, rebuild images:

```powershell
.\runtime\local\reset-runtime-environment.ps1 -StartSimulation
```

## `runtime/local/` (Windows host)

| File | Role |
|------|------|
| `reset-runtime-environment.ps1` | Stop agents/backend/sim, wipe DB, rebuild & start stack |
| `run-scenario-1.ps1` | Full reset + scenario 1 API seeding |
| `run-scenario-3.ps1` | Full reset + scenario 3 (triangle, 3 UAVs, idle rebalance) |
| `run-scenario-3-line.ps1` | Full reset + scenario 3b (line, 3 UAVs at west edge) |
| `run-scenario-2-single-parking.ps1` | Scenario 2c: UAV+UGV, 1 parking slot per station |
| `start-frontend.ps1` | Webpack dev server for the UI |
| `monitor-gazebo-positions.ps1` | Optional pose logging during scenarios |

Typical dev flow:

```powershell
.\runtime\local\run-scenario-1.ps1
```

The backend uses `docker compose exec …/gazebo-sim.sh` for world setup (stations, ground `package-*`, restore). **Agents** run the same script in-process for **Option A** cargo (`pickup-visual`, `move-cargo`, `drop-visual`). See `docs/cargo-simulation-design.md`.
