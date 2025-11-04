#  Dashboard de Ética Legal

Sistema de gestión integral para bufetes de abogados y profesionales legales. Permite gestionar clientes, casos, documentos, citas y generar reportes estadísticos.

##  Características Principales

- **Gestión de Clientes**: Registro completo de información de clientes
- **Casos Legales**: Seguimiento detallado de casos con estados y tipos
- **Documentos**: Subida y organización de archivos por cliente/caso
- **Citas**: Programación y gestión de reuniones
- **Dashboard**: Estadísticas en tiempo real
- **Portal del Cliente**: Acceso limitado para clientes

##  Tecnologías Utilizadas

### Backend
- **Python 3.8+**
- **FastAPI** - Framework web moderno
- **MongoDB** - Base de datos NoSQL
- **PyMongo** - Driver de MongoDB para Python
- **Uvicorn** - Servidor ASGI

### Frontend
- **React 18**
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconos
- **React Hook Form** - Gestión de formularios

##  Requisitos Previos

Antes de instalar, asegúrate de tener:

1. **Python 3.8 o superior**
   - Descargar desde: https://www.python.org/downloads/
   
2. **Node.js 16 o superior**
   - Descargar desde: https://nodejs.org/
   
3. **MongoDB 6.0 o superior**
   - Descargar desde: https://www.mongodb.com/try/download/community

##  Instalación

### 1. Clonar el Repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd dashboard-etica
```

### 2. Configurar MongoDB
```bash
# Windows
# Crear directorio para datos
mkdir C:\data\db

# Iniciar MongoDB (en una terminal separada)
"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"
```

### 3. Configurar Backend
```bash
# Navegar al directorio backend
cd backend

# Crear entorno virtual (recomendado)
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

### 4. Configurar Frontend
```bash
# Navegar al directorio frontend
cd frontend

# Instalar dependencias
npm install
```

##  Ejecución

### 1. Iniciar MongoDB
```bash
# En una terminal separada
"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"
```

### 2. Iniciar Backend
```bash
# En el directorio backend
cd backend
python -m uvicorn server:app --reload
```
El backend estará disponible en: `http://localhost:8000`

### 3. Iniciar Frontend
```bash
# En el directorio frontend
cd frontend

# Para sistemas con Node.js más reciente
$env:NODE_OPTIONS="--openssl-legacy-provider"  # Windows PowerShell
export NODE_OPTIONS="--openssl-legacy-provider"  # Linux/Mac

# Iniciar en puerto específico
$env:PORT=3002  # Windows PowerShell
export PORT=3002  # Linux/Mac

npm start
```
La aplicación estará disponible en: `http://localhost:3002`

##  Estructura del Proyecto

```
dashboard-etica/
├── backend/
│   ├── server.py          # Servidor FastAPI principal
│   ├── requirements.txt   # Dependencias Python
│   └── uploads/          # Archivos subidos
├── frontend/
│   ├── src/
│   │   ├── App.js        # Componente principal
│   │   ├── App.css       # Estilos principales
│   │   └── components/   # Componentes UI
│   ├── public/           # Archivos estáticos
│   └── package.json      # Dependencias Node.js
└── README.md             # Este archivo
```

## 🔌 API Endpoints

### Clientes
- `GET /api/clients` - Obtener todos los clientes
- `POST /api/clients` - Crear nuevo cliente
- `PUT /api/clients/{id}` - Actualizar cliente
- `DELETE /api/clients/{id}` - Eliminar cliente

### Casos
- `GET /api/cases` - Obtener todos los casos
- `POST /api/cases` - Crear nuevo caso
- `PUT /api/cases/{id}` - Actualizar caso
- `DELETE /api/cases/{id}` - Eliminar caso

### Documentos
- `POST /api/documents` - Subir documento
- `GET /api/documents` - Obtener documentos
- `DELETE /api/documents/{id}` - Eliminar documento

### Citas
- `GET /api/appointments` - Obtener citas
- `POST /api/appointments` - Crear cita
- `PUT /api/appointments/{id}` - Actualizar cita
- `DELETE /api/appointments/{id}` - Eliminar cita

## 🗄️ Base de Datos

La aplicación utiliza MongoDB con las siguientes colecciones:

- **clients** - Información de clientes
- **cases** - Casos legales
- **documents** - Metadata de documentos
- **appointments** - Citas programadas
- **case_updates** - Actualizaciones de casos

##  Configuración

### Variables de Entorno (Opcional)
Puedes crear un archivo `.env` en el directorio backend:

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=dashboard_etica
PORT=8000
```

### Configuración de MongoDB
La aplicación se conecta automáticamente a:
- **Host**: localhost
- **Puerto**: 27017
- **Base de datos**: dashboard_etica

##  Solución de Problemas

### Error: "Module not found"
```bash
# Reinstalar dependencias
cd frontend
npm install
```

### Error: "MongoDB connection failed"
```bash
# Verificar que MongoDB esté ejecutándose
# Windows:
tasklist | findstr mongod
```

### Error: "Port already in use"
```bash
# Cambiar puerto en package.json o usar variable de entorno
$env:PORT=3003
npm start
```

##  Uso de la Aplicación

1. **Dashboard**: Vista general con estadísticas
2. **Clientes**: Agregar y gestionar información de clientes
3. **Casos**: Crear y seguir casos legales
4. **Documentos**: Subir archivos relacionados con casos
5. **Citas**: Programar reuniones con clientes

##  Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Soporte

Si tienes problemas o preguntas:
1. Revisa la sección de solución de problemas
2. Verifica que todos los servicios estén ejecutándose
3. Consulta los logs en las terminales

---

## 🧪 Pruebas

### Backend (pytest)
- Requisitos: `pip install -r backend/requirements.txt` (incluye `httpx` requerido por `TestClient`).
- Ejecutar:
  ```bash
  cd backend
  py -3 -m pytest -q
  ```
- Notas:
  - Se ha añadido `backend/pytest.ini` para silenciar un `PendingDeprecationWarning` de Starlette.
  - Las pruebas usan `TestClient` y `monkeypatch` para evitar acceso a MongoDB real.

### Frontend (Jest + Testing Library)
- Instalar dependencias de test:
  ```bash
  cd frontend
  npm install
  ```
- Ejecutar:
  ```bash
  npm test -- --watchAll=false
  ```
- Notas:
  - Existe `src/setupTests.js` que importa `@testing-library/jest-dom`.
  - Se incluye un mock manual de `axios` en `src/__mocks__/axios.js` para compatibilidad con Jest.
  - `App.jsx` evita usar `import.meta` en tiempo de carga para no romper en entorno de Jest.

## 🔄 Migración a Lifespan Events (FastAPI)

Para cumplir con las recomendaciones modernas de FastAPI, se migró el manejador de `shutdown` a la API de **lifespan**.

### Antes
```python
@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
```

### Después
```python
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup (si se requiere)
    try:
        yield
    finally:
        # Shutdown
        client.close()

app = FastAPI(lifespan=lifespan)
```

- Ubicación: `backend/server.py`.
- Beneficios: unifica startup/shutdown, elimina warnings por deprecación y facilita gestión de recursos.
