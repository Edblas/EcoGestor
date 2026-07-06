@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File ".\criar-atalho-real-ecogestor.ps1"
