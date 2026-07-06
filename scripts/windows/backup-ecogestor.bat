@echo off
setlocal EnableDelayedExpansion

cd /d "%~dp0\..\.."

if not exist ".env.production" (
    echo Arquivo .env.production nao encontrado.
    pause
    exit /b 1
)

for /f "usebackq tokens=1,* delims==" %%A in (".env.production") do (
    set "lineKey=%%A"
    if defined lineKey (
        if not "!lineKey:~0,1!"=="#" (
            set "%%A=%%B"
        )
    )
)

if not defined POSTGRES_USER (
    echo POSTGRES_USER nao definido no .env.production.
    pause
    exit /b 1
)

if not defined POSTGRES_DB (
    echo POSTGRES_DB nao definido no .env.production.
    pause
    exit /b 1
)

set "BACKUP_DIR=%CD%\backups"
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

for /f %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd-HHmmss"') do set "TIMESTAMP=%%I"
set "BACKUP_FILE=%BACKUP_DIR%\ecogestor-%TIMESTAMP%.sql"

echo Gerando backup em "%BACKUP_FILE%"...
docker compose -f docker-compose.prod.yml --env-file .env.production exec -T postgres pg_dump -U %POSTGRES_USER% -d %POSTGRES_DB% > "%BACKUP_FILE%"
if errorlevel 1 (
    echo Falha ao gerar backup.
    if exist "%BACKUP_FILE%" del "%BACKUP_FILE%"
    pause
    exit /b 1
)

echo Backup gerado com sucesso.
