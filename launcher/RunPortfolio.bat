@echo off
setlocal

set "PROJECT_ROOT=%~1"
if "%PROJECT_ROOT%"=="" (
  set "SCRIPT_DIR=%~dp0"
  for %%I in ("%SCRIPT_DIR%..") do set "PROJECT_ROOT=%%~fI"
)

if not exist "%PROJECT_ROOT%\package.json" (
  echo Could not find package.json in "%PROJECT_ROOT%".
  pause
  exit /b 1
)

cd /d "%PROJECT_ROOT%"
title Portfolio Dev Server
echo Starting frontend only...
call npm --prefix frontend run start
