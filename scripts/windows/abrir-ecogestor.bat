@echo off
setlocal EnableDelayedExpansion

cd /d "%~dp0\..\.."

if exist ".env.production" (
    for /f "usebackq tokens=1,* delims==" %%A in (".env.production") do (
        set "lineKey=%%A"
        if defined lineKey (
            if not "!lineKey:~0,1!"=="#" (
                set "%%A=%%B"
            )
        )
    )
)

if not defined FRONTEND_PORT set "FRONTEND_PORT=80"

if "%FRONTEND_PORT%"=="80" (
    start "" "http://localhost"
) else (
    start "" "http://localhost:%FRONTEND_PORT%"
)
