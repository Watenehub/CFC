Write-Host "Starting Cornerstone Family Chapel Application..." -ForegroundColor Green
Write-Host ""

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
$backend = Start-Process -FilePath "python" -ArgumentList "run.py" -WorkingDirectory "backend" -PassThru -NoNewWindow

Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
$frontend = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory "frontend" -PassThru -NoNewWindow

Write-Host ""
Write-Host "Both servers are running..." -ForegroundColor Green
Write-Host "Backend: http://127.0.0.1:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow

try {
    Wait-Process -Id $frontend.Id
} finally {
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    Stop-Process -Id $backend.Id -Force
    Stop-Process -Id $frontend.Id -Force
    Write-Host "Servers stopped." -ForegroundColor Green
}
