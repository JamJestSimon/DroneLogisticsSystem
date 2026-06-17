param(
    [string]$ProjectRoot = (Resolve-Path "$PSScriptRoot\..\..").Path,
    [switch]$StartSimulation,
    [switch]$StartBackend,
    [switch]$StartFrontend,
    [string]$BackendUrl = "http://localhost:8080",
    [string]$FrontendUrl = "http://localhost:8081"
)

$ErrorActionPreference = "Stop"
$runtimeDir = Join-Path $ProjectRoot "build\runtime"
$composeFile = Join-Path $ProjectRoot "runtime\docker\docker-compose.agent.yml"
$dbBasePath = Join-Path $runtimeDir "uav-logistics-fresh"
New-Item -ItemType Directory -Force -Path $runtimeDir | Out-Null

function Stop-PortListener([int]$Port) {
    Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
        ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}

function Wait-Backend {
    param([int]$Seconds = 120)
    $deadline = (Get-Date).AddSeconds($Seconds)
    while ((Get-Date) -lt $deadline) {
        try {
            $health = Invoke-RestMethod -Uri "$BackendUrl/health" -TimeoutSec 3
            if ($health.status -eq "ok") { return }
        } catch { }
        Start-Sleep -Seconds 2
    }
    throw "Backend did not become healthy within $Seconds seconds."
}

function Wait-Frontend {
    param([int]$Seconds = 180)
    $deadline = (Get-Date).AddSeconds($Seconds)
    while ((Get-Date) -lt $deadline) {
        try {
            $response = Invoke-WebRequest -Uri $FrontendUrl -TimeoutSec 3 -UseBasicParsing
            if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) { return }
        } catch { }
        Start-Sleep -Seconds 3
    }
    throw "Frontend did not become reachable at $FrontendUrl within $Seconds seconds."
}

Write-Output "1/6 Stopping and removing all agent containers (fresh PX4/controller on next activate)..."
$removedAgents = @(
    docker ps -a --format "{{.Names}}" |
        Where-Object { $_ -like "uav-agent-*" }
)
foreach ($name in $removedAgents) {
    docker rm -f $name 2>$null | Out-Null
}
if ($removedAgents.Count -gt 0) {
    Write-Output "   Removed agents: $($removedAgents -join ', ')"
} else {
    Write-Output "   No agent containers were running."
}

Write-Output "2/6 Stopping backend and frontend..."
Stop-PortListener 8080
Stop-PortListener 8081
Start-Sleep -Seconds 2

Write-Output "3/6 Stopping simulation environment (clears Gazebo world: drones, packages, stations)..."
$prevErrorAction = $ErrorActionPreference
$ErrorActionPreference = "Continue"
docker compose -f $composeFile stop gazebo-gui gazebo-sim *>$null
docker compose -f $composeFile rm -f gazebo-gui gazebo-sim *>$null
$ErrorActionPreference = $prevErrorAction
Write-Output "   gazebo-sim and gazebo-gui removed (empty world on next start)."

Write-Output "4/6 Wiping runtime database (before backend start)..."
Get-ChildItem $runtimeDir -Filter "uav-logistics-fresh*" -ErrorAction SilentlyContinue |
    Remove-Item -Force -ErrorAction SilentlyContinue
if (Test-Path "$dbBasePath.mv.db") {
    throw "Failed to remove H2 database at $dbBasePath.mv.db (is the backend still running?)."
}
Write-Output "   H2 database cleared: $dbBasePath"

$rootComposeFile = Join-Path $ProjectRoot "docker-compose.yml"
if (Test-Path $rootComposeFile) {
    $prevErrorAction = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    docker compose -f $rootComposeFile down -v *>$null
    $ErrorActionPreference = $prevErrorAction
    Write-Output "   PostgreSQL volume removed (docker compose down -v)."
}

if ($StartSimulation) {
    Write-Output "5/6 Rebuilding simulation and agent-runtime images (latest scripts + controller)..."
    $simLog = Join-Path $runtimeDir "gazebo-start.log"
    $prevErrorAction = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    docker compose -f $composeFile build gazebo-sim agent-runtime *>> $simLog
    Write-Output "6/6 Starting simulation environment..."
    docker compose -f $composeFile up -d --remove-orphans gazebo-sim *>> $simLog
    $ErrorActionPreference = $prevErrorAction
    Start-Sleep -Seconds 5
    $simStatus = docker inspect -f "{{.State.Status}}" uav-gazebo-sim 2>$null
    if ($simStatus -ne "running") {
        throw "gazebo-sim did not reach running state (status=$simStatus). See $simLog"
    }
    $scriptPath = "/workspace/runtime/docker/gazebo-sim.sh"
    $hasNewStationLayout = docker exec uav-gazebo-sim grep -c "parking_charging_slot" $scriptPath 2>$null
    $hasOldStationLayout = docker exec uav-gazebo-sim grep -c "landing_pad_visual" $scriptPath 2>$null
    if ([int]$hasOldStationLayout -gt 0) {
        Write-Output "   WARNING: gazebo-sim still has the old landing-pad station script. Recreate the container (reset script does this) so /workspace is mounted."
    } elseif ([int]$hasNewStationLayout -gt 0) {
        Write-Output "   gazebo-sim is running with the slot-grid station layout script."
    } else {
        Write-Output "   gazebo-sim is running."
    }
} else {
    Write-Output "5/6 Simulation not started (pass -StartSimulation to bring it up)."
    Write-Output "6/6 Skipped."
}

if ($StartBackend) {
    if (-not $StartSimulation) {
        throw "StartBackend requires -StartSimulation so Gazebo is up before the registry starts."
    }

    $backendLog = Join-Path $runtimeDir "backend.out.log"
    $backendErr = Join-Path $runtimeDir "backend.err.log"
    $h2Url = "jdbc:h2:file:$($dbBasePath -replace '\\', '/');MODE=PostgreSQL;DATABASE_TO_UPPER=false"

    $env:DB_URL = $h2Url
    $env:DB_DRIVER = "org.h2.Driver"
    $env:DB_USER = "sa"
    $env:DB_PASSWORD = ""
    $env:SIMULATION_GAZEBO_ENABLED = "true"
    $env:SIMULATION_GAZEBO_START_ON_BACKEND = "false"
    $env:AGENT_RUNTIME_MODE = "docker"
    $env:PROJECT_ROOT = $ProjectRoot
    # Docker agent containers must reach the host backend, not localhost inside the container.
    $env:BACKEND_PUBLIC_URL = "http://host.docker.internal:8080"
    $env:SIM_ORIGIN_LAT = "47.397971"
    $env:SIM_ORIGIN_LON = "8.546164"
    $env:GZ_WORLD = "default"
    $env:GZ_PARTITION = "uav-logistics"
    $env:FRONTEND_START_ON_BACKEND = "false"

    Write-Output "Starting backend (empty database)..."
    Start-Process `
        -FilePath (Join-Path $ProjectRoot "gradlew.bat") `
        -ArgumentList @(":backend:run", "--no-daemon") `
        -WorkingDirectory $ProjectRoot `
        -RedirectStandardOutput $backendLog `
        -RedirectStandardError $backendErr `
        -WindowStyle Hidden
    Wait-Backend
    Write-Output "Backend is healthy at $BackendUrl (agents use $($env:BACKEND_PUBLIC_URL))."
}

if ($StartFrontend) {
    if (-not $StartBackend) {
        throw "StartFrontend requires -StartBackend so the API is available to the UI."
    }
    Write-Output "Starting frontend dev server..."
    & (Join-Path $PSScriptRoot "start-frontend.ps1") -ProjectRoot $ProjectRoot
    Wait-Frontend
    Write-Output "Frontend is reachable at $FrontendUrl"
}

Write-Output "Runtime reset complete."
