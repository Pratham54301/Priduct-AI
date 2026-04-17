# Product.AI - Server Restart Script (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Product.AI - Server Restart Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: Make sure to stop any running servers first (Ctrl+C)" -ForegroundColor Yellow
Write-Host ""
$null = Read-Host "Press Enter to continue"

Write-Host ""
Write-Host "Starting Backend Server..." -ForegroundColor Green
Write-Host ""
Set-Location backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start" -WindowStyle Normal
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Starting Frontend Server..." -ForegroundColor Green
Write-Host ""
Set-Location ..
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Both servers are starting..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend: http://localhost:5000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Check the server windows for startup logs." -ForegroundColor Green
Write-Host ""

