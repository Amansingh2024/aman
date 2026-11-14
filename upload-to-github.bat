@echo off
setlocal enabledelayedexpansion
title Sen Diagnostics - Upload to GitHub (Aman)

echo ========================================================
echo   Sen Diagnostics - 1-Click GitHub Repository & Pages
echo   Target Repository: aman  (Author: Aman)
echo ========================================================
echo.

:: Check if GitHub CLI is already logged in
"C:\Program Files\GitHub CLI\gh.exe" auth status >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [OK] Detected GitHub CLI login!
    echo Starting upload to repository 'aman'...
    node deploy-to-github.js
    goto :end
)

echo [1] Login via Browser (1-Click - Recommended)
echo [2] Enter GitHub Personal Access Token (PAT)
echo.
set /p CHOICE="Choose an option [1 or 2]: "

if "%CHOICE%"=="1" (
    echo.
    echo Opening GitHub authorization in your browser...
    "C:\Program Files\GitHub CLI\gh.exe" auth login -w -p https -s repo
    echo.
    echo Uploading all files to repo 'aman' and activating Pages...
    node deploy-to-github.js
    goto :end
)

if "%CHOICE%"=="2" (
    echo.
    set /p USER_TOKEN="Paste your GitHub Personal Access Token: "
    echo Uploading all files to repo 'aman' and activating Pages...
    node deploy-to-github.js !USER_TOKEN! aman
    goto :end
)

:end
echo.
pause
