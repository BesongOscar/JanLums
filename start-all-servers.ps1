# JanLunMS Server Startup Script
# Run this in PowerShell as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  JanLunMS Server Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$rootDir = "D:\Projects\janlums"
Set-Location $rootDir

# Function to check if port is in use
function Test-PortInUse {
    param($Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $null -ne $connection
}

# Function to kill process on port
function Kill-Port {
    param($Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($connection) {
        $process = Get-Process -Id $connection.OwningProcess -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "Killing process on port $Port (PID: $($process.Id))" -ForegroundColor Yellow
            Stop-Process -Id $process.Id -Force
        }
    }
}

# Kill any existing processes on our ports
Write-Host "Cleaning up ports..." -ForegroundColor Yellow
Kill-Port -Port 3015
Kill-Port -Port 3025
Kill-Port -Port 3035
Kill-Port -Port 3085
Start-Sleep -Seconds 2

# Check dependencies
Write-Host "Checking dependencies..." -ForegroundColor Yellow
$apiModules = Join-Path $rootDir "apps\api\node_modules"
$pressingModules = Join-Path $rootDir "apps\pressing-web\node_modules"
$customerModules = Join-Path $rootDir "apps\customer-web\node_modules"
$adminModules = Join-Path $rootDir "apps\admin-web\node_modules"

$needsInstall = $false

if (-not (Test-Path (Join-Path $apiModules "@nestjs\common"))) {
    Write-Host "API dependencies missing!" -ForegroundColor Red
    $needsInstall = $true
}

if (-not (Test-Path $pressingModules)) {
    Write-Host "Pressing Web dependencies missing!" -ForegroundColor Red
    $needsInstall = $true
}

if ($needsInstall) {
    Write-Host ""
    Write-Host "ERROR: Dependencies are not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run the following commands in separate PowerShell windows:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Install API dependencies:" -ForegroundColor Cyan
    Write-Host "   cd D:\Projects\janlums\apps\api" -ForegroundColor White
    Write-Host "   npm install" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Install Pressing Web dependencies:" -ForegroundColor Cyan
    Write-Host "   cd D:\Projects\janlums\apps\pressing-web" -ForegroundColor White
    Write-Host "   npm install" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Install Customer Web dependencies:" -ForegroundColor Cyan
    Write-Host "   cd D:\Projects\janlums\apps\customer-web" -ForegroundColor White
    Write-Host "   npm install" -ForegroundColor White
    Write-Host ""
    Write-Host "4. Install Admin Web dependencies:" -ForegroundColor Cyan
    Write-Host "   cd D:\Projects\janlums\apps\admin-web" -ForegroundColor White
    Write-Host "   npm install" -ForegroundColor White
    Write-Host ""
    Write-Host "After all installs complete, run this script again." -ForegroundColor Yellow
    exit 1
}

# Start API Server
Write-Host "Starting API Server on port 3015..." -ForegroundColor Green
$apiProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd /d $rootDir\apps\api && npm run dev" -PassThru -WindowStyle Normal

Start-Sleep -Seconds 5

# Check if API started
if (Test-PortInUse -Port 3015) {
    Write-Host "✓ API Server running on http://localhost:3015" -ForegroundColor Green
} else {
    Write-Host "✗ API Server failed to start" -ForegroundColor Red
}

# Start Pressing Web
Write-Host "Starting Pressing Web on port 3025..." -ForegroundColor Green
$pressingProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd /d $rootDir\apps\pressing-web && npm run dev" -PassThru -WindowStyle Normal

Start-Sleep -Seconds 3

# Start Customer Web
Write-Host "Starting Customer Web on port 3035..." -ForegroundColor Green
$customerProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd /d $rootDir\apps\customer-web && npm run dev" -PassThru -WindowStyle Normal

Start-Sleep -Seconds 3

# Start Admin Web
Write-Host "Starting Admin Web on port 3085..." -ForegroundColor Green
$adminProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd /d $rootDir\apps\admin-web && npm run dev" -PassThru -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  All servers started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "API Docs:     http://localhost:3015/api/docs" -ForegroundColor White
Write-Host "Pressing Web: http://localhost:3025" -ForegroundColor White
Write-Host "Customer Web: http://localhost:3035" -ForegroundColor White
Write-Host "Admin Web:    http://localhost:3085" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow
Write-Host ""

# Keep script running
Write-Host "Monitoring servers... (Press Enter to stop)" -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Cleanup
Write-Host ""
Write-Host "Stopping servers..." -ForegroundColor Red
if ($apiProcess) { Stop-Process -Id $apiProcess.Id -Force -ErrorAction SilentlyContinue }
if ($pressingProcess) { Stop-Process -Id $pressingProcess.Id -Force -ErrorAction SilentlyContinue }
if ($customerProcess) { Stop-Process -Id $customerProcess.Id -Force -ErrorAction SilentlyContinue }
if ($adminProcess) { Stop-Process -Id $adminProcess.Id -Force -ErrorAction SilentlyContinue }

Write-Host "All servers stopped." -ForegroundColor Green
