@echo off
REM Navigate to backend directory and run migration
cd /d "%~dp0"
call npx sequelize-cli db:migrate
pause
