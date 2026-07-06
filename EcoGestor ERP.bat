@echo off
set "PROJECT_DIR=%~dp0"
if "%PROJECT_DIR:~-1%"=="\" set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

if not exist "%PROJECT_DIR%\scripts\windows\iniciar-ecogestor.bat" (
    if exist "C:\EcoGestor\scripts\windows\iniciar-ecogestor.bat" (
        set "PROJECT_DIR=C:\EcoGestor"
    )
)

if not exist "%PROJECT_DIR%\scripts\windows\iniciar-ecogestor.bat" (
    echo Pasta do EcoGestor nao encontrada.
    echo Instale o sistema em C:\EcoGestor ou execute este arquivo dentro da pasta do projeto.
    pause
    exit /b 1
)

cd /d "%PROJECT_DIR%"

if exist "%PROJECT_DIR%\.env.production" (
    call "%PROJECT_DIR%\scripts\windows\iniciar-ecogestor.bat"
) else (
    call "%PROJECT_DIR%\scripts\windows\instalar-ecogestor.bat"
)
