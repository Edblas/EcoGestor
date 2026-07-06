@echo off
setlocal EnableDelayedExpansion

cd /d "%~dp0\..\.."

if not exist ".env.production" (
    echo Arquivo .env.production nao encontrado.
    echo Copie .env.production.example para .env.production e ajuste as configuracoes.
    pause
    exit /b 1
)

call :load_env

where docker >nul 2>nul
if errorlevel 1 (
    echo Docker nao encontrado. Instale o Docker Desktop antes de iniciar o EcoGestor.
    pause
    exit /b 1
)

echo Iniciando EcoGestor...
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
if errorlevel 1 (
    echo Falha ao iniciar o EcoGestor.
    pause
    exit /b 1
)

if not defined FRONTEND_PORT set "FRONTEND_PORT=80"
if "%FRONTEND_PORT%"=="80" (
    start "" "http://localhost"
) else (
    start "" "http://localhost:%FRONTEND_PORT%"
)

echo EcoGestor iniciado com sucesso.
exit /b 0

:load_env
for /f "usebackq tokens=1,* delims==" %%A in (".env.production") do (
    set "lineKey=%%A"
    if defined lineKey (
        if not "!lineKey:~0,1!"=="#" (
            set "%%A=%%B"
        )
    )
)
exit /b 0
