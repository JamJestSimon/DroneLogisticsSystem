param(
    [string]$ProjectRoot = (Resolve-Path "$PSScriptRoot\..\..").Path,
    [string]$BackendUrl = "http://localhost:8080",
    [int]$IntervalSeconds = 5,
    [int]$MaxMinutes = 45,
    [string]$ShipmentId = "",
    [string]$LogFile = "",
    [switch]$StopWhenUavsDistributed
)

$ErrorActionPreference = "Continue"
if ([string]::IsNullOrWhiteSpace($LogFile)) {
    $LogFile = Join-Path $ProjectRoot "build\runtime\scenario-1-gazebo-monitor.log"
}
$logFile = $LogFile
New-Item -ItemType Directory -Force -Path (Split-Path $logFile) | Out-Null

function Write-Log([string]$Message) {
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $Message"
    Add-Content -Path $logFile -Value $line
    Write-Output $line
}

function Get-PoseSnapshot {
    $raw = docker exec uav-gazebo-sim sh -c "gz topic -e -t '/world/default/pose/info' -n 1 2>/dev/null" 2>$null
    if (-not $raw) { return @{} }
    $poses = @{}
    $pattern = 'name:\s*"([^"]+)".*?position\s*\{\s*x:\s*([-+0-9.eE]+)\s*y:\s*([-+0-9.eE]+)\s*z:\s*([-+0-9.eE]+)'
    [regex]::Matches($raw, $pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline) | ForEach-Object {
        $poses[$_.Groups[1].Value] = @{
            x = [double]$_.Groups[2].Value
            y = [double]$_.Groups[3].Value
            z = [double]$_.Groups[4].Value
        }
    }
    return $poses
}

function Format-ModelLine([hashtable]$Poses, [string]$Pattern) {
    $matches = $Poses.Keys | Where-Object { $_ -like $Pattern } | Sort-Object
    if (-not $matches) { return "$Pattern (none)" }
    ($matches | ForEach-Object {
        $p = $Poses[$_]
        "{0}: x={1:F2} y={2:F2} z={3:F2}" -f $_, $p.x, $p.y, $p.z
    }) -join " | "
}

function Get-NetworkSummary {
    try {
        $state = Invoke-RestMethod -Uri "$BackendUrl/api/network/state" -TimeoutSec 10
    } catch {
        return "network state unavailable: $($_.Exception.Message)"
    }
    $activeShipment = $state.shipments | Where-Object {
        $_.status -notin @("DELIVERED", "CANCELLED")
    } | Select-Object -First 1
    $activeTasks = $state.tasks | Where-Object {
        $_.status -notin @("COMPLETED", "CANCELLED")
    }
    $agents = $state.agents | ForEach-Object {
        "$($_.id)=$($_.status) station=$($_.currentStationId)"
    }
    $tasks = $activeTasks | ForEach-Object { "$($_.id.Substring(0,8))…=$($_.status) agent=$($_.assignedAgentId)" }
    $ship = if ($activeShipment) {
        "$($activeShipment.id.Substring(0,8))…=$($activeShipment.status) station=$($activeShipment.currentStationId) carrier=$($activeShipment.carryingAgentId)"
    } else {
        "no active shipment"
    }
    return "shipment: $ship | tasks: $(($tasks) -join '; ') | agents: $(($agents) -join '; ')"
}

Write-Log "=== Gazebo position monitor started (interval=${IntervalSeconds}s, max=${MaxMinutes}m) ==="
$deadline = (Get-Date).AddMinutes($MaxMinutes)
$delivered = $false
$distributed = $false

function Test-UavsDistributedOnePerStation([object]$State) {
    $uavs = @($State.agents | Where-Object { $_.type -eq "UAV" })
    if ($uavs.Count -lt 3) { return $false }
    $stations = @($uavs | ForEach-Object { $_.currentStationId } | Where-Object { $_ } | Select-Object -Unique)
    if ($stations.Count -ne 3) { return $false }
    $grouped = $uavs | Group-Object -Property currentStationId
    return ($grouped.Count -eq 3) -and ($grouped | Where-Object { $_.Count -ne 1 }).Count -eq 0
}

while ((Get-Date) -lt $deadline) {
    $poses = Get-PoseSnapshot
    Write-Log ("NETWORK: " + (Get-NetworkSummary))
    Write-Log ("DRONES: " + (Format-ModelLine $poses "x500*"))
    Write-Log ("PACKAGES: " + (Format-ModelLine $poses "package*"))
    Write-Log ("CARGO: " + (Format-ModelLine $poses "cargo*"))
    Write-Log ("STATIONS: " + (Format-ModelLine $poses "station*"))

    try {
        $state = Invoke-RestMethod -Uri "$BackendUrl/api/network/state" -TimeoutSec 10
        $target = if ($ShipmentId) {
            $state.shipments | Where-Object { $_.id -eq $ShipmentId } | Select-Object -First 1
        } else {
            $state.shipments | Where-Object { $_.status -notin @("DELIVERED", "CANCELLED") } | Select-Object -First 1
        }
        if ($target -and $target.status -eq "DELIVERED") {
            $delivered = $true
            Write-Log "Shipment $($target.id) reached DELIVERED."
            break
        }
        if ($StopWhenUavsDistributed -and (Test-UavsDistributedOnePerStation $state)) {
            $distributed = $true
            Write-Log "UAVs distributed one per station (scenario 3 success criterion)."
            break
        }
    } catch {
        Write-Log "Failed to poll shipment status: $($_.Exception.Message)"
    }

    Start-Sleep -Seconds $IntervalSeconds
}

if (-not $delivered -and -not $distributed) {
    if ($StopWhenUavsDistributed) {
        Write-Log "Monitor stopped before UAVs reached one-per-station distribution (timeout or error)."
    } else {
        Write-Log "Monitor stopped before DELIVERED (timeout or error)."
    }
}
Write-Log "=== Gazebo position monitor finished ==="
