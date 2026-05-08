# 🏗️ Manos a la Obra

Plataforma web que conecta clientes que necesitan servicios de construcción con trabajadores especializados (albañiles, plomeros, electricistas, pintores, etc.).

---

## ¿Qué puede hacer cada usuario?

| Rol | Funciones |
|-----|-----------|
| **Cliente** | Publicar trabajos, ver trabajadores disponibles, chatear |
| **Trabajador** | Ver trabajos publicados, postularse con una propuesta, chatear |
| **Admin** | Ver estadísticas, gestionar usuarios, trabajos y postulaciones |

---

## Tecnologías usadas

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Base de datos:** Supabase (PostgreSQL)

---

## Cómo correr el proyecto

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
```

### 2. Configurar el backend

```bash
cd backend
npm install
```

Crear el archivo `.env` dentro de la carpeta `backend` con las credenciales de Supabase:

```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
PORT=3000
```

Iniciar el servidor:

```bash
npm run dev
```

El backend corre en `http://localhost:3000`

### 3. Configurar el frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend corre en `http://localhost:5173`

---

## Estructura del proyecto

```
manos-a-la-obra/
├── backend/
│   ├── middleware/
│   │   └── verificarAdmin.js   # Protege las rutas de admin
│   ├── routes/
│   │   ├── admin.js            # Rutas del panel admin
│   │   ├── jobs.js             # Rutas de trabajos
│   │   ├── mensajes.js         # Rutas del chat
│   │   ├── postulaciones.js    # Rutas de postulaciones
│   │   └── users.js            # Rutas de usuarios
│   ├── index.js                # Servidor principal
│   └── supabase.js             # Conexión a Supabase
│
└── frontend/
    └── src/
        └── components/
            ├── Chat.jsx
            ├── Login.jsx
            ├── PanelAdmin.jsx
            ├── PanelCliente.jsx
            └── PanelTrabajador.jsx
```

---

## Tablas en Supabase

- `users` — usuarios registrados (id, nombre, rol, especialidad)
- `jobs` — trabajos publicados por clientes
- `postulaciones` — propuestas de trabajadores a trabajos
- `mensajes` — mensajes del chat entre cliente y trabajador

---

## Integrantes

Miguel Pulido - Alejandro Morales
