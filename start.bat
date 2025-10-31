@echo off
echo ========================================
echo   Dashboard de Etica Legal - Iniciador
echo ========================================
echo.

echo Verificando MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✓ MongoDB ya esta ejecutandose
) else (
    echo Iniciando MongoDB...
    echo NOTA: Asegurate de que MongoDB este instalado en la ruta por defecto
    start "MongoDB" cmd /k "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"
    timeout /t 3 >nul
)

echo.
echo Iniciando Backend...
start "Backend API" cmd /k "cd /d %~dp0backend && call venv\Scripts\activate.bat && python -m uvicorn server:app --reload"

echo.
echo Esperando que el backend se inicie...
timeout /t 5 >nul

echo.
echo Iniciando Frontend...
start "Frontend React" cmd /k "cd /d %~dp0frontend && set NODE_OPTIONS=--openssl-legacy-provider && set PORT=3002 && npm start"

echo.
echo ========================================
echo   ¡APLICACION INICIADA!
echo ========================================
echo.
echo La aplicacion se abrira automaticamente en:
echo http://localhost:3002
echo.
echo Backend API disponible en:
echo http://localhost:8000
echo.
echo Para detener la aplicacion, cierra todas las ventanas de terminal.
echo.

timeout /t 10 >nul
start http://localhost:3002

pause