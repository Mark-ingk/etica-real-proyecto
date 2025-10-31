@echo off
echo ========================================
echo   Dashboard de Etica Legal - Instalador
echo ========================================
echo.

echo [1/4] Verificando Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python no esta instalado. Descarga desde https://www.python.org/downloads/
    pause
    exit /b 1
)
echo ✓ Python encontrado

echo.
echo [2/4] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado. Descarga desde https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js encontrado

echo.
echo [3/4] Instalando dependencias del Backend...
cd backend
echo Creando entorno virtual...
python -m venv venv
echo Activando entorno virtual...
call venv\Scripts\activate.bat
echo Instalando dependencias Python...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Fallo al instalar dependencias del backend
    pause
    exit /b 1
)
echo ✓ Backend configurado
cd ..

echo.
echo [4/4] Instalando dependencias del Frontend...
cd frontend
echo Instalando dependencias Node.js...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo al instalar dependencias del frontend
    pause
    exit /b 1
)
echo ✓ Frontend configurado
cd ..

echo.
echo ========================================
echo   ¡INSTALACION COMPLETADA!
echo ========================================
echo.
echo Para ejecutar la aplicacion:
echo 1. Asegurate de que MongoDB este ejecutandose
echo 2. Ejecuta: start.bat
echo.
echo Para mas informacion, consulta README.md
echo.
pause