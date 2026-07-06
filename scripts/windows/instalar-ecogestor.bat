@echo off
setlocal EnableDelayedExpansion

cd /d "%~dp0\..\.."

echo ==========================================
echo        Instalador do EcoGestor
echo ==========================================
echo.

where docker >nul 2>nul
if errorlevel 1 (
    echo Docker nao encontrado.
    echo Instale e abra o Docker Desktop antes de continuar.
    pause
    exit /b 1
)

if not exist ".env.production" (
    echo Arquivo .env.production nao encontrado.
    echo Vamos criar uma configuracao inicial para o cliente.
    echo.

    set /p POSTGRES_PASSWORD_INPUT=Digite a senha do banco de dados: 
    if "!POSTGRES_PASSWORD_INPUT!"=="" (
        echo A senha do banco nao pode ficar vazia.
        pause
        exit /b 1
    )

    set /p FRONTEND_PORT_INPUT=Digite a porta de acesso do sistema ^(padrao 80^): 
    if "!FRONTEND_PORT_INPUT!"=="" set "FRONTEND_PORT_INPUT=80"

    for /f %%I in ('powershell -NoProfile -Command "[Convert]::ToBase64String((1..32 ^| ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))"') do set "JWT_SECRET_GENERATED=%%I"

    (
        echo # Porta publicada para acesso dos usuarios no navegador
        echo FRONTEND_PORT=!FRONTEND_PORT_INPUT!
        echo.
        echo # Banco de dados PostgreSQL
        echo POSTGRES_DB=ecogestor
        echo POSTGRES_USER=ecogestor
        echo POSTGRES_PASSWORD=!POSTGRES_PASSWORD_INPUT!
        echo.
        echo # JWT base64 gerado automaticamente
        echo JWT_SECRET=!JWT_SECRET_GENERATED!
        echo JWT_EXPIRATION=86400000
        echo.
        echo # Memoria da JVM do backend
        echo JAVA_OPTS=-Xms256m -Xmx1024m
    ) > ".env.production"

    echo.
    echo Arquivo .env.production criado com sucesso.
) else (
    echo Arquivo .env.production encontrado. Usando configuracao existente.
)

echo.
echo Gerando icone do EcoGestor...
powershell -ExecutionPolicy Bypass -File "scripts\windows\gerar-icone-ecogestor.ps1"
if errorlevel 1 (
    echo Nao foi possivel gerar o icone personalizado. O sistema continuara com icone padrao.
)

echo.
call "scripts\windows\iniciar-ecogestor.bat"
if errorlevel 1 (
    echo A instalacao nao foi concluida.
    pause
    exit /b 1
)

echo.
call "scripts\windows\criar-atalho-ecogestor.bat"
if errorlevel 1 (
    echo O sistema foi iniciado, mas houve falha ao criar o atalho.
    pause
    exit /b 1
)

echo.
echo Instalacao concluida com sucesso.
echo O cliente ja pode abrir o EcoGestor pelo atalho da area de trabalho.
pause
