param(
    [string]$BackendUrl = "http://localhost:8080",
    [double]$OriginLat = 47.397971,
    [double]$OriginLon = 8.546164,
    [int]$IntervalSeconds = 5,
    [int]$MaxMinutes = 50,
    [string]$LogFile = "",
    [string]$ShipmentId = "",
    [double]$TeleportThresholdMeters = 25.0
)

$ErrorActionPreference = "Continue"
. (Join-Path $PSScriptRoot "runtime-ids.ps1")
if ([string]::IsNullOrWhiteSpace($LogFile)) {
    $LogFile = Join-Path (Resolve-Path "$PSScriptRoot\..\..").Path "build\runtime\scenario-2c-px4-gazebo.log"
}
New-Item -ItemType Directory -Force -Path (Split-Path $LogFile) | Out-Null

$agentModels = @{
    $UavScenario2 = "x500_0"
    $UgvScenario2 = "r1_rover_1"
}

$lastRegistry = @{}
$lastGazebo = @{}

function Write-Log([string]$Message) {
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $Message"
    Add-Content -Path $LogFile -Value $line
    Write-Output $line
}

function ConvertTo-LocalXY([double]$Lat, [double]$Lon) {
    $earth = 6371000.0
    $x = [Math]::PI / 180.0 * ($Lon - $OriginLon) * $earth * [Math]::Cos([Math]::PI / 180.0 * $OriginLat)
    $y = [Math]::PI / 180.0 * ($Lat - $OriginLat) * $earth
    return @{ x = $x; y = $y }
}

function Get-GazeboPoses {
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

function Get-DistanceMeters($a, $b) {
    $dx = $a.x - $b.x
    $dy = $a.y - $b.y
    return [Math]::Sqrt($dx * $dx + $dy * $dy)
}

Write-Log "=== PX4 (registry) vs Gazebo pose monitor (threshold=${TeleportThresholdMeters}m) ==="
$deadline = (Get-Date).AddMinutes($MaxMinutes)

while ((Get-Date) -lt $deadline) {
    try {
        $state = Invoke-RestMethod -Uri "$BackendUrl/api/network/state" -TimeoutSec 15
    } catch {
        Write-Log "network state error: $($_.Exception.Message)"
        Start-Sleep -Seconds $IntervalSeconds
        continue
    }

    $gazebo = Get-GazeboPoses
    $shipment = if ($ShipmentId) {
        $state.shipments | Where-Object { $_.id -eq $ShipmentId } | Select-Object -First 1
    } else {
        $state.shipments | Where-Object { $_.status -notin @("DELIVERED", "CANCELLED") } | Select-Object -First 1
    }

  Write-Log ("SHIPMENT: " + $(if ($shipment) { "$($shipment.id.Substring(0,8))…=$($shipment.status)" } else { "none" }))

    foreach ($agent in $state.agents) {
        $model = $agentModels[$agent.id]
        if (-not $model) { continue }
        $regXY = ConvertTo-LocalXY $agent.position.latitude $agent.position.longitude
        $gz = $gazebo[$model]
        if (-not $gz) {
            Write-Log "$($agent.id) status=$($agent.status) dock=$($agent.currentStationId) | Gazebo model $model missing"
            continue
        }
        $err = Get-DistanceMeters $regXY $gz
        $line = "$($agent.id) status=$($agent.status) dock=$($agent.currentStationId) | PX4_xy=($([math]::Round($regXY.x,1)),$([math]::Round($regXY.y,1))) GZ_xy=($([math]::Round($gz.x,1)),$([math]::Round($gz.y,1))) err=$([math]::Round($err,1))m"
        if ($err -gt 15.0) { $line += " MISMATCH" }
        Write-Log $line

        $key = $agent.id
        if ($lastRegistry.ContainsKey($key)) {
            $jumpReg = Get-DistanceMeters $lastRegistry[$key] $regXY
            if ($jumpReg -gt $TeleportThresholdMeters) {
                Write-Log "ANOMALY REGISTRY_JUMP $key ${jumpReg}m in ${IntervalSeconds}s (possible PX4 teleport or stale sync)"
            }
        }
        if ($lastGazebo.ContainsKey($model)) {
            $jumpGz = Get-DistanceMeters $lastGazebo[$model] $gz
            if ($jumpGz -gt $TeleportThresholdMeters) {
                Write-Log "ANOMALY GAZEBO_JUMP $model ${jumpGz}m in ${IntervalSeconds}s (possible set_pose / sim teleport)"
            }
        }
        $lastRegistry[$key] = $regXY
        $lastGazebo[$model] = @{ x = $gz.x; y = $gz.y }
    }

    if ($shipment -and $shipment.status -eq "DELIVERED") {
        Write-Log "SUCCESS: shipment DELIVERED"
        break
    }

    Start-Sleep -Seconds $IntervalSeconds
}

Write-Log "=== Monitor finished ==="
