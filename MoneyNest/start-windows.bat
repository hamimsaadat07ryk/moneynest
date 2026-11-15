@echo off
cd /d "%~dp0"
title MoneyNest server
set PY=
where python >nul 2>nul && set PY=python
if "%PY%"=="" where py >nul 2>nul && set PY=py
if "%PY%"=="" goto nopython
start "" http://localhost:8765
%PY% server.py
pause
goto :eof
:nopython
echo Python was not found. Install it from https://www.python.org/downloads/
echo (tick "Add python.exe to PATH" during install), then double-click this file again.
pause
