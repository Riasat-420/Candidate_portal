@echo off
echo ==========================================
echo HARD RESET: Clearing Cache & Restarting
echo ==========================================

echo [1/3] Stopping existing node processes...
taskkill /F /IM node.exe >nul 2>&1

echo [2/3] Clearing Vite Cache...
rmdir /s /q "C:\WORK- SPACE\antigravity\3 percent\frontend\node_modules\.vite" >nul 2>&1

echo [3/3] Starting Servers...
echo.
echo Starting Backend...
cd /d "C:\WORK- SPACE\antigravity\3 percent\backend\backend"
start "Backend Server" cmd /k "npm run dev"

echo Waiting 5 seconds...
timeout /t 5

echo Starting Frontend (with --force)...
cd /d "C:\WORK- SPACE\antigravity\3 percent\frontend"
start "Frontend Server" cmd /k "npx vite --force"

echo.
echo ==========================================
echo DONE! Please wait for the browser to open.
echo If it does not auto-open, go to http://localhost:5173
echo ==========================================
pause
