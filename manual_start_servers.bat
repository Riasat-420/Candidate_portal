@echo off
echo ==========================================
echo Starting Backend Server (Port 5000)...
echo ==========================================
cd /d "C:\WORK- SPACE\antigravity\3 percent\backend\backend"
start "Backend Server" cmd /k "npm run dev || pause"

echo Waiting 5 seconds...
timeout /t 5

echo ==========================================
echo Starting Frontend Server (Port 5173)...
echo ==========================================
cd /d "C:\WORK- SPACE\antigravity\3 percent\frontend"
start "Frontend Server" cmd /k "npm run dev || pause"

echo.
echo ==========================================
echo Done! windows should have opened.
echo If you see errors, please read the text in the new windows.
echo ==========================================
pause
