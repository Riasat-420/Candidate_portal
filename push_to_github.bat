@echo off
echo ========================================================
echo  Pushing Candidates Portal to GitHub...
echo ========================================================
echo.

REM Try using the absolute path found earlier
"C:\Program Files\Git\cmd\git.exe" push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo ========================================================
    echo  ERROR: Push failed.
    echo ========================================================
    echo  Possible reasons:
    echo  1. You need to log in (look for a browser popup or terminal prompt).
    echo  2. The repository URL might be incorrect.
    echo  3. You might need to generate a Personal Access Token.
    echo.
) else (
    echo.
    echo ========================================================
    echo  SUCCESS: Code pushed to GitHub!
    echo ========================================================
)

pause
