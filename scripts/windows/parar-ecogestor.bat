@echo off
cd /d "%~dp0\..\.."

if not exist ".env.production" (
    echo Arquivo .env.production nao encontrado.
    pause
    exit /b 1
)

echo Parando EcoGestor...
docker compose -f docker-compose.prod.yml --env-file .env.production down
if errorlevel 1 (
    echo Falha ao parar o EcoGestor.
    pause
    exit /b 1
)

echo EcoGestor parado com sucesso.
