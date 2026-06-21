# Start all JanLunMS servers
# Run this in the project root directory

Write-Host "Starting JanLunMS servers..." -ForegroundColor Green
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path node_modules)) {
    Write-Host "Installing dependencies first..." -ForegroundColor Yellow
    pnpm install
}

# Start API in background
Write-Host "Starting API on port 3015..." -ForegroundColor Cyan
$apiJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    pnpm --filter @janlums/api dev
}

# Wait a moment for API to start
Start-Sleep -Seconds 3

# Start pressing-web in background
Write-Host "Starting Pressing Web on port 3025..." -ForegroundColor Cyan
$pressingJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    pnpm --filter @janlums/pressing-web dev
}

# Start customer-web in background
Write-Host "Starting Customer Web on port 3035..." -ForegroundColor Cyan
$customerJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    pnpm --filter @janlums/customer-web dev
}

# Start admin-web in background
Write-Host "Starting Admin Web on port 3085..." -ForegroundColor Cyan
$adminJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    pnpm --filter @janlums/admin-web dev
}

Write-Host ""
Write-Host "All servers started!" -ForegroundColor Green
Write-Host ""
Write-Host "API:          http://localhost:3015/api/docs" -ForegroundColor White
Write-Host "Pressing Web: http://localhost:3025" -ForegroundColor White
Write-Host "Customer Web: http://localhost:3035" -ForegroundColor White
Write-Host "Admin Web:    http://localhost:3085" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow
Write-Host ""

# Keep the script running and show logs
try {
    while ($true) {
        Receive-Job -Job $apiJob -Keep | ForEach-Object { Write-Host "[API] $_" -ForegroundColor Blue }
        Receive-Job -Job $pressingJob -Keep | ForEach-Object { Write-Host "[PRESSING] $_" -ForegroundColor Magenta }
        Receive-Job -Job $customerJob -Keep | ForEach-Object { Write-Host "[CUSTOMER] $_" -ForegroundColor Green }
        Receive-Job -Job $adminJob -Keep | ForEach-Object { Write-Host "[ADMIN] $_" -ForegroundColor Cyan }
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host "Stopping all servers..." -ForegroundColor Red
    Stop-Job -Job $apiJob, $pressingJob, $customerJob, $adminJob
    Remove-Job -Job $apiJob, $pressingJob, $customerJob, $adminJob
}
