param(
    [string]$ProjectRoot = (Resolve-Path "$PSScriptRoot\..\..").Path,
    [string]$BackendUrl = "http://localhost:8080",
    [switch]$SkipReset,
    [switch]$StartMonitor
)

$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "runtime-ids.ps1")
$runtimeDir = Join-Path $ProjectRoot "build\runtime"

$originLat = 47.397971
$originLon = 8.546164

$metersPerDegLat = 111320.0
$metersPerDegLon = $metersPerDegLat * [Math]::Cos($originLat * [Math]::PI / 180.0)
$spacingM = 300.0
$dLonStep = $spacingM / $metersPerDegLon
$endToEndSpanM = 2.0 * $spacingM
# Adjacent hops (west↔mid, mid↔east) must fit in one leg; west↔east must not.
$uavMaxRangeMeters = 500.0
if ($uavMaxRangeMeters -le $spacingM -or $uavMaxRangeMeters -ge $endToEndSpanM) {
    throw "uavMaxRangeMeters must be > $spacingM and < $endToEndSpanM (got $uavMaxRangeMeters)."
}

$stationWest = $StationLineWest
$stationMid = $StationLineMid
$stationEast = $StationLineEast

$posWest = @{ latitude = $originLat; longitude = $originLon; altitudeMeters = 0.0 }
$posMid = @{ latitude = $originLat; longitude = $originLon + $dLonStep; altitudeMeters = 0.0 }
$posEast = @{ latitude = $originLat; longitude = $originLon + (2.0 * $dLonStep); altitudeMeters = 0.0 }

function Invoke-Api {
    param(
        [string]$Method,
        [string]$Path,
        [object]$Body = $null,
        [switch]$Admin
    )
    $headers = @{ "Content-Type" = "application/json" }
    if ($Admin) { $headers["X-User-Role"] = "ADMIN" }
    $uri = "$BackendUrl$Path"
    if ($Body) {
        return Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers -Body ($Body | ConvertTo-Json -Depth 8)
    }
    return Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers
}

function Register-Uav {
    param(
        [string]$Id,
        [int]$Px4Instance,
        [int]$MavlinkPort,
        [string]$StationId,
        [hashtable]$Position
    )
    Invoke-Api -Method POST -Path "/api/agents" -Body @{
        id = $Id
        type = "UAV"
        position = $Position
        energyLevelPercent = 100.0
        maxRangeMeters = $uavMaxRangeMeters
        payloadCapacityKg = 5.0
        currentStationId = $StationId
        runtime = @{
            autoStart = $true
            px4Model = "x500"
            px4Instance = $Px4Instance
            mavlinkPort = $MavlinkPort
            spawnInGazebo = $true
        }
    } | Out-Null
    Invoke-Api -Method POST -Path "/api/agents/$Id/activate" | Out-Null
}

if (-not $SkipReset) {
    & (Join-Path $PSScriptRoot "reset-runtime-environment.ps1") `
        -ProjectRoot $ProjectRoot `
        -BackendUrl $BackendUrl `
        -StartSimulation `
        -StartBackend `
        -StartFrontend
    Start-Sleep -Seconds 8
}

Write-Output "Registering scenario 3b (line) network..."

$parkingCapacity = 3
$storageCapacity = 4

Invoke-Api -Method POST -Path "/api/stations" -Admin -Body @{
    id = $stationWest
    name = "Line West (edge hub)"
    position = $posWest
    storageCapacity = $storageCapacity
    parkingCapacity = $parkingCapacity
} | Out-Null
Invoke-Api -Method POST -Path "/api/stations/$stationWest/activate" -Admin | Out-Null

Invoke-Api -Method POST -Path "/api/stations" -Admin -Body @{
    id = $stationMid
    name = "Line Mid"
    position = $posMid
    storageCapacity = $storageCapacity
    parkingCapacity = $parkingCapacity
} | Out-Null
Invoke-Api -Method POST -Path "/api/stations/$stationMid/activate" -Admin | Out-Null

Invoke-Api -Method POST -Path "/api/stations" -Admin -Body @{
    id = $stationEast
    name = "Line East (far edge)"
    position = $posEast
    storageCapacity = $storageCapacity
    parkingCapacity = $parkingCapacity
} | Out-Null
Invoke-Api -Method POST -Path "/api/stations/$stationEast/activate" -Admin | Out-Null

Write-Output "Registering three UAVs at $stationWest (west edge)..."
Register-Uav -Id $UavLine1 -Px4Instance 0 -MavlinkPort 14580 -StationId $stationWest -Position $posWest
Register-Uav -Id $UavLine2 -Px4Instance 1 -MavlinkPort 14581 -StationId $stationWest -Position $posWest
Register-Uav -Id $UavLine3 -Px4Instance 2 -MavlinkPort 14582 -StationId $stationWest -Position $posWest

Write-Output "Scenario 3b started (no package tasks; idle rebalancing only)."
Write-Output "Geometry: stations every ${spacingM}m (west-east span ${endToEndSpanM}m); UAV range ${uavMaxRangeMeters}m (mid-hop relay required)."
Write-Output "Expected: one UAV at $stationWest; one at $stationMid; one at $stationEast."
Write-Output "Monitor log: $(Join-Path $runtimeDir 'scenario-3-line-gazebo-monitor.log')"

if ($StartMonitor) {
    Start-Process `
        -FilePath "powershell.exe" `
        -ArgumentList @(
            "-NoProfile",
            "-ExecutionPolicy", "Bypass",
            "-File", (Join-Path $PSScriptRoot "monitor-gazebo-positions.ps1"),
            "-ProjectRoot", $ProjectRoot,
            "-BackendUrl", $BackendUrl,
            "-LogFile", (Join-Path $runtimeDir "scenario-3-line-gazebo-monitor.log"),
            "-StopWhenUavsDistributed"
        ) `
        -WindowStyle Hidden
}
