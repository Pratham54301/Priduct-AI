@echo off
echo ========================================
echo   Product.AI - Server Restart Script
echo ========================================
echo.
echo This script will help you restart both servers.
echo.
echo IMPORTANT: Make sure to stop any running servers first (Ctrl+C)
echo.
pause

echo.
echo Starting Backend Server...
echo.
cd backend
start "Backend Server" cmd /k "npm start"
timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend Server...
echo.
cd ..
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo   Both servers are starting...
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Check the server windows for startup logs.
echo.
pause

