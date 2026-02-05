@echo off
title Starting 3 Percent Servers
echo Starting Backend Server...

cd /d "C:\WORK- SPACE\antigravity\3 percent\backend"
start "Backend Server - Port 5000" cmd /k "npm run dev"

timeout /t 3

echo Starting Frontend Server...
cd /d "C:\WORK- SPACE\antigravity\3 percent\frontend"
start "Frontend Server - Port 5173" cmd /k "npm run dev"

echo.
echo Servers are starting in separate windows.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo You can close this window now.
timeout /t 5
