param(
    [string]$ProjectRoot = (Resolve-Path "$PSScriptRoot\..\..").Path
)

$ErrorActionPreference = "Stop"

$runtimeDir = Join-Path $ProjectRoot "build\runtime"
New-Item -ItemType Directory -Force -Path $runtimeDir | Out-Null

$stdoutLog = Join-Path $runtimeDir "frontend.out.log"
$stderrLog = Join-Path $runtimeDir "frontend.err.log"
$gradle = Join-Path $ProjectRoot "gradlew.bat"

# Stop a stale webpack dev server so the browser does not keep the old bundle.
$port = 8081
Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }

Start-Process `
    -FilePath $gradle `
    -ArgumentList @(":frontend:jsBrowserDevelopmentRun") `
    -WorkingDirectory $ProjectRoot `
    -RedirectStandardOutput $stdoutLog `
    -RedirectStandardError $stderrLog `
    -WindowStyle Hidden

Write-Output "Frontend dev server launch requested. Logs: $stdoutLog $stderrLog"
