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
$pickupLon = 8.5435
$destLon = 8.548828
$stationId = $StationTransfer

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

if (-not $SkipReset) {
    & (Join-Path $PSScriptRoot "reset-runtime-environment.ps1") `
        -ProjectRoot $ProjectRoot `
        -BackendUrl $BackendUrl `
        -StartSimulation `
        -StartBackend `
        -StartFrontend
    Start-Sleep -Seconds 8
}

Write-Output "Registering scenario 1 network..."
Invoke-Api -Method POST -Path "/api/stations" -Admin -Body @{
    id = $stationId
    name = "Transfer Station"
    position = @{ latitude = $originLat; longitude = $originLon; altitudeMeters = 0.0 }
    storageCapacity = 4
    parkingCapacity = 2
} | Out-Null
Invoke-Api -Method POST -Path "/api/stations/$stationId/activate" -Admin | Out-Null

Invoke-Api -Method POST -Path "/api/agents" -Body @{
    id = $UavScenario1
    type = "UAV"
    position = @{ latitude = $originLat; longitude = $originLon; altitudeMeters = 0.0 }
    energyLevelPercent = 100.0
    maxRangeMeters = 650.0
    payloadCapacityKg = 5.0
    currentStationId = $stationId
    runtime = @{ autoStart = $true; px4Model = "x500"; px4Instance = 0; mavlinkPort = 14580; spawnInGazebo = $true }
} | Out-Null
Invoke-Api -Method POST -Path "/api/agents/$UavScenario1/activate" | Out-Null

Invoke-Api -Method POST -Path "/api/agents" -Body @{
    id = $UavScenario2
    type = "UAV"
    position = @{ latitude = $originLat; longitude = $originLon; altitudeMeters = 0.0 }
    energyLevelPercent = 100.0
    maxRangeMeters = 650.0
    payloadCapacityKg = 5.0
    currentStationId = $stationId
    runtime = @{ autoStart = $true; px4Model = "x500"; px4Instance = 1; mavlinkPort = 14581; spawnInGazebo = $true }
} | Out-Null
Invoke-Api -Method POST -Path "/api/agents/$UavScenario2/activate" | Out-Null

$shipment = Invoke-Api -Method POST -Path "/api/shipments" -Body @{
    customerId = $CustomerScenario1
    senderName = "Scenario1 Sender"
    recipientName = "Scenario1 Recipient"
    origin = @{ latitude = $originLat; longitude = $pickupLon; altitudeMeters = 0.0 }
    destination = @{ latitude = $originLat; longitude = $destLon; altitudeMeters = 0.0 }
    packageSpec = @{ weightKg = 2.0; volumeM3 = 0.02; requiresGroundTransport = $false }
}
$shipmentId = if ($shipment.shipment) { [string]$shipment.shipment.id } else { [string]$shipment.id }
if ([string]::IsNullOrWhiteSpace($shipmentId)) {
    throw "Shipment creation did not return an id. Response: $($shipment | ConvertTo-Json -Depth 6)"
}

Write-Output "Scenario 1 started. Shipment ID: $shipmentId"
Write-Output "Monitor log: $(Join-Path $runtimeDir 'scenario-1-gazebo-monitor.log')"

if ($StartMonitor -and -not [string]::IsNullOrWhiteSpace($shipmentId)) {
    Start-Process `
        -FilePath "powershell.exe" `
        -ArgumentList @(
            "-NoProfile",
            "-ExecutionPolicy", "Bypass",
            "-File", (Join-Path $PSScriptRoot "monitor-gazebo-positions.ps1"),
            "-ProjectRoot", $ProjectRoot,
            "-BackendUrl", $BackendUrl,
            "-ShipmentId", $shipmentId
        ) `
        -WindowStyle Hidden
}

Write-Output $shipmentId
