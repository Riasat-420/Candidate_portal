@echo off
echo ===================================================
echo      Creating Production Deployment Package
echo ===================================================

set TARGET_DIR=deployment_package
if exist "%TARGET_DIR%" rmdir /s /q "%TARGET_DIR%"
mkdir "%TARGET_DIR%"

echo.
echo 1. Copying Backend...
mkdir "%TARGET_DIR%\backend"
robocopy "backend" "%TARGET_DIR%\backend" /E /XD node_modules .git /XF .env .DS_Store
echo    (Excluded node_modules and .env)

echo.
echo 2. Copying Frontend...
mkdir "%TARGET_DIR%\frontend"
robocopy "frontend" "%TARGET_DIR%\frontend" /E /XD node_modules .git dist /XF .DS_Store
echo    (Excluded node_modules and dist)

echo.
echo 3. Copying Root Files...
copy "README.md" "%TARGET_DIR%\"
copy "start_servers.bat" "%TARGET_DIR%\"

echo.
echo 4. Creating Setup Instructions...
(
echo ==========================================
echo   3%% GENERATION - CANDIDATE PORTAL SETUP
echo ==========================================
echo.
echo PREREQUISITES:
echo 1. Install Node.js (v18 or higher^) -> https://nodejs.org/
echo 2. Install MySQL Database
echo.
echo INSTALLATION:
echo 1. Open the "backend" folder.
echo 2. Rename ".env.example" to ".env" and fill in your database details.
echo 3. Open a terminal in the "backend" folder and run: npm install
echo 4. Open a terminal in the "frontend" folder and run: npm install
echo.
echo RUNNING THE APP:
echo Double-click "start_servers.bat" to start both servers.
) > "%TARGET_DIR%\HOW_TO_INSTALL.txt"

echo.
echo ===================================================
echo    SUCCESS! Package created in: %TARGET_DIR%
echo ===================================================
echo You can now ZIP the "%TARGET_DIR%" folder and send it.
pause
