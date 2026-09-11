# Mega Gym — Base del proyecto

Sistema de gestión de rutinas para el gimnasio "Mega Gym" (UTN FRCU - Seminario Integrador).
Backend en **Django + Django REST Framework**, frontend en **React + Vite + Tailwind CSS**
(SPA única, responsive: mobile-first para alumnos, más cómoda en desktop para el profesor).

Cada modelo, endpoint y pantalla está comentado con el RF/CU del informe técnico que cubre,
para que sea fácil auditar contra la matriz de trazabilidad.

---

## 0. Requisitos previos (instalar antes de abrir el proyecto)

Instalá esto en tu máquina, en este orden:

1. **Visual Studio Code** → https://code.visualstudio.com/
2. **Python 3.11 o 3.12** → https://www.python.org/downloads/
   - En Windows, al instalar tildá la opción **"Add python.exe to PATH"**.
3. **Node.js 20 LTS** (incluye npm) → https://nodejs.org/
4. **PostgreSQL 16** → https://www.postgresql.org/download/
   - Durante la instalación te va a pedir una contraseña para el usuario `postgres`. Anotala.
   - Instalá también **pgAdmin** (viene incluido en el instalador) para ver la base gráficamente.
5. **Git** → https://git-scm.com/downloads

Para verificar que todo quedó instalado, abrí una terminal (cmd/PowerShell/terminal) y corré:

```bash
python --version
node --version
npm --version
git --version
```

Todas deberían responder con un número de versión, sin error.

---

## 1. Abrir el proyecto en VS Code

1. Descomprimí este proyecto en una carpeta, por ejemplo `C:\proyectos\mega-gym` o `~/proyectos/mega-gym`.
2. Abrí VS Code → `File > Open Folder...` → seleccioná la carpeta `mega-gym` (la raíz, que
   contiene `backend/` y `frontend/`).
3. VS Code va a sugerir instalar las extensiones recomendadas (Python, Tailwind CSS IntelliSense,
   ESLint, GitLens, etc.) — aceptalas. Si no aparece el aviso, andá a la pestaña de Extensiones
   (`Ctrl+Shift+X`), buscá `@recommended` y aceptá las que faltan.

A partir de acá vas a trabajar con **dos terminales abiertas en simultáneo** dentro de VS Code
(`Ctrl+ñ` o `Terminal > New Terminal`, y el botón de split para tener dos): una para el backend
y otra para el frontend.

---

## 2. Backend (Django) — paso a paso

### 2.1. Crear la base de datos

Abrí pgAdmin (o `psql` desde consola) y creá la base de datos:

```sql
CREATE DATABASE mega_gym;
```

### 2.2. Crear el entorno virtual e instalar dependencias

En la terminal de VS Code, parado en la raíz del proyecto:

```bash
cd backend
python -m venv venv
```

Activar el entorno virtual:

```bash
# Windows (PowerShell)
venv\Scripts\Activate.ps1

# Windows (cmd)
venv\Scripts\activate.bat

# macOS / Linux
source venv/bin/activate
```

Vas a ver `(venv)` al principio de la línea de la terminal cuando esté activo. **Importante:**
tenés que activar el venv cada vez que abras una terminal nueva para trabajar en el backend.

En VS Code, seleccioná ese entorno como intérprete de Python: `Ctrl+Shift+P` →
`Python: Select Interpreter` → elegí el que dice `./backend/venv/...`.

Instalar las librerías:

```bash
pip install -r requirements.txt
```

**Librerías que se instalan y para qué sirve cada una:**

| Librería | Uso |
|---|---|
| `Django` | Framework backend (modelos, ORM, admin, MVC) |
| `djangorestframework` | Construcción de la API REST |
| `djangorestframework-simplejwt` | Autenticación JWT (login alumno/profesor) |
| `django-cors-headers` | Permite que el frontend (otro puerto) consuma la API |
| `psycopg2-binary` | Driver de conexión a PostgreSQL |
| `python-decouple` | Manejo de variables de entorno (`.env`) |
| `reportlab` | Generación del certificado de socio en PDF (RF.31) |

### 2.3. Configurar variables de entorno

Copiá el archivo de ejemplo y completalo con tus datos de PostgreSQL:

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Abrí `backend/.env` y ajustá `DB_PASSWORD` con la contraseña que pusiste al instalar PostgreSQL.

### 2.4. Migraciones y usuario administrador

Con el venv activado y parado en `backend/`:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

Te va a pedir username, email y contraseña — con esto entrás al admin de Django
(`http://localhost:8000/admin`) y también podés usarlo como login de profesor en el frontend,
**siempre que además le asignes `rol = profesor` desde el admin** (el primer superusuario no
tiene rol asignado por defecto, se lo agregás manualmente la primera vez).

### 2.5. Levantar el servidor

```bash
python manage.py runserver
```

Debería quedar corriendo en `http://localhost:8000`. Probá abrir
`http://localhost:8000/admin` en el navegador — si ves el login de Django, el backend está OK.

---

## 3. Frontend (React) — paso a paso

Abrí una **segunda terminal** en VS Code (no cierres la del backend, tiene que seguir corriendo).

```bash
cd frontend
npm install
```

**Librerías que se instalan y para qué sirve cada una:**

| Librería | Uso |
|---|---|
| `react` / `react-dom` | Librería base de UI |
| `react-router-dom` | Ruteo entre pantallas (login, rutinas, admin, etc.) |
| `axios` | Cliente HTTP para consumir la API Django |
| `@tanstack/react-query` | Manejo de estado de datos remotos (cache, loading, refetch) |
| `vite` | Bundler/dev server (arranque rápido, hot reload) |
| `tailwindcss` + `postcss` + `autoprefixer` | Estilos utilitarios y responsive |
| `typescript` | Tipado estático |

Configurá la variable de entorno del frontend:

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Por defecto ya apunta a `http://localhost:8000/api`, no hace falta tocarla si seguiste los pasos
anteriores tal cual.

Levantar el servidor de desarrollo:

```bash
npm run dev
```

Te va a abrir en `http://localhost:5173`. Ahí ya deberías ver la pantalla de login de Mega Gym.

---

## 4. Probar que todo esté conectado

1. Con **ambos servidores corriendo** (backend en :8000, frontend en :5173):
2. Entrá a `http://localhost:8000/admin`, logueate con el superusuario, y:
   - Abrí **Usuarios** → editá tu superusuario → poné `Rol = Profesor` y `Estado = Activo`.
   - Creá un usuario de prueba con `Rol = Alumno`, cargale un DNI.
3. Andá a `http://localhost:5173`, elegí "Soy profesor", entrá con tu usuario/contraseña →
   deberías caer en el panel de gestión de alumnos.
4. Cerrá sesión, elegí "Soy alumno", ingresá el DNI del alumno de prueba → deberías caer en
   "Mis rutinas" (vacío al principio, es esperado — todavía no le asignaste ninguna).

Si los cuatro pasos funcionan, la base está andando de punta a punta.

---

## 5. Estructura del proyecto

```
mega-gym/
├── backend/
│   ├── config/              # settings, urls raíz, wsgi/asgi
│   └── apps/
│       ├── usuarios/        # Usuario, Alumno/Profesor, Comentario, login (RF.1-4, 24-26, 29)
│       ├── ejercicios/      # Ejercicio, Accesorio, Peso, Serie, Repetición (RF.8-11)
│       ├── maquinas/        # Maquina, EstadoMaquina (RF.22-23)
│       ├── rutinas/         # Rutina, TipoRutina, Cronograma (RF.12-20)
│       ├── seguimiento/     # Seguimiento, LineaSeguimiento (RF.5-7)
│       └── socios/          # Socio, Descuento, certificado PDF (RF.21, 27-28, 30-31)
└── frontend/
    └── src/
        ├── api/              # clientes axios por dominio
        ├── context/          # AuthContext (sesión + rol)
        ├── routes/           # RutaProtegida (guard por rol, RNF.4)
        ├── components/
        │   ├── layout/       # Layout responsive (sidebar desktop / bottom-nav mobile)
        │   └── ui/           # componentes reutilizables (TablaResponsive)
        └── pages/
            ├── auth/         # Login (alumno por DNI, profesor por usuario/clave)
            ├── alumno/       # Rutinas, detalle de ejercicio, seguimiento
            └── profesor/     # Gestión de alumnos, rutinas, ejercicios, máquinas
```

## 6. Qué falta desarrollar (próximos pasos sugeridos)

La base ya cubre el flujo completo de auth + CRUD principal. Para completar el 100% de la
matriz de trazabilidad del informe, quedan pendientes (en orden sugerido):

1. **Detalle de rutina por alumno desde el panel del profesor** (CU12 completo: hoy
   `RutinasAdminPage` lista alumnos, falta el detalle/edición de la rutina seleccionada — el
   endpoint `GET /api/rutinas/?usuario=<id>` ya existe en el backend).
2. **Cronograma**: CRUD de días/enfoques dentro de una rutina (RF.16-17).
3. **Asociación de accesorios y máquinas al crear un ejercicio** desde el form del profesor
   (el modelo y el serializer ya soportan `accesorio_ids`, falta el selector en la UI).
4. **Gestión de socios y descuentos** en el panel profesor (RF.21, RF.27-28) — mismo patrón que
   `MaquinasAdminPage`.
5. **Historial de líneas de seguimiento** (gráfico de evolución de peso) en `SeguimientoPage`.
6. Reemplazar el filtro `GET /rutinas/?usuario=<id>` real en el backend (agregar
   `django_filters` o un query param manual en `RutinaViewSet.get_queryset`) para que el admin
   pueda filtrar rutinas por alumno.

Cada uno de estos puntos ya tiene el modelo, serializer y permisos armados en el backend —
el trabajo restante es mayormente de frontend (pantallas) y algún endpoint de filtrado puntual.
