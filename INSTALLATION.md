# COMPURSATIL - Guía de Instalación en Nueva Laptop

## 📋 Requisitos previos

- **Git** instalado: https://git-scm.com
- **Node.js** (v18+): https://nodejs.org
- **MySQL** instalado y corriendo en puerto 3306
- **npm** (viene con Node.js)

## 🚀 Instalación Paso a Paso

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/crispand03/compursatil-app04.git
cd compursatil-app04
```

### Paso 2: Instalar dependencias del frontend
```bash
npm install
```

### Paso 3: Instalar dependencias del backend
```bash
cd server
npm install
cd ..
```

### Paso 4: Configurar la base de datos

#### Paso 4A: Crear la base de datos
```bash
mysql -u root -p
```
Luego en MySQL Command Line ejecuta:
```sql
CREATE DATABASE compursatil;
EXIT;
```

#### Paso 4B: Importar los datos (ARCHIVO PRINCIPAL)
```bash
mysql -u root -p compursatil < database/compursatil.sql
```

Esto importa:
- ✅ Esquema completo (todas las tablas)
- ✅ Estructura de base de datos
- ✅ Datos iniciales

#### Paso 4C: Agregar datos adicionales (OPCIONAL)
```bash
# Datos de ejemplo adicionales
mysql -u root -p compursatil < database/seed-data.sql

# Detalles adicionales
mysql -u root -p compursatil < database/insert-details.sql
```

### Paso 5: Configurar variables de entorno

#### Backend (.env)
Crea archivo `server/.env`:
```
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_PORT=3306
DB_NAME=compursatil
JWT_SECRET=compursatil_secret_key_2025_segura
NODE_ENV=development
```

#### Frontend (ya está configurado)
El archivo `.env.production` está listo para GitHub Pages.

### Paso 6: Iniciar la aplicación

#### Terminal 1 - Backend (API):
```bash
cd server
npm start
# O: node server.js
```

#### Terminal 2 - Frontend (Vite):
```bash
npm run dev
```

### Paso 7: Acceder a la aplicación

- **Frontend**: http://localhost:5173/compursatil-app04
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

### Credenciales de acceso:
- **Usuario**: `admin`
- **Contraseña**: `admin123`

## 📁 Estructura del Proyecto

```
compursatil-app04/
├── src/                          # Frontend React
│   ├── App.jsx                  # Componente principal
│   ├── App.css                  # Estilos
│   ├── main.jsx
│   └── assets/
├── server/                       # Backend Node.js
│   ├── server.js               # Servidor Express
│   ├── package.json
│   ├── config/
│   │   └── database.js         # Configuración MySQL
│   └── routes/
│       ├── auth.js
│       ├── inventario.js
│       ├── ventas.js
│       ├── clientes.js
│       └── ... (otras rutas)
├── database/                     # Scripts SQL
│   ├── compursatil.sql         # Estructura principal
│   ├── seed-data.sql           # Datos de ejemplo
│   └── insert-details.sql
├── public/
├── package.json
├── vite.config.js
└── README.md
```

## 🗄️ Base de Datos

### Estructura
La base de datos incluye las siguientes tablas:
- `usuarios` - Usuarios del sistema
- `inventario` - Productos/equipos
- `ventas` - Registro de ventas
- `clientes` - Información de clientes
- `categorias` - Categorías de productos
- `proveedores` - Datos de proveedores
- `garantias` - Garantías de productos
- `soporte` - Tickets de soporte
- Y más...

### Restaurar BD
```bash
mysql -u root -p compursatil < database/compursatil.sql
mysql -u root -p compursatil < database/seed-data.sql
```

## 🔧 Configuración avanzada

### Cambiar puerto del backend
Edita `server/.env`:
```
PORT=3001  # Cambiar a otro puerto si es necesario
```

### Cambiar URL API en desarrollo
Edita `src/App.jsx` línea ~54:
```javascript
const API_BASE = 'http://localhost:3001/api';
```

### Usar base de datos remota
En `server/.env`:
```
DB_HOST=tu_host_remoto.com
DB_USER=usuario
DB_PASSWORD=contraseña
DB_PORT=3306
DB_NAME=compursatil
```

## 📊 Comandos útiles

```bash
# Frontend
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye para producción
npm run preview      # Vista previa de build
npm run deploy       # Deploy a GitHub Pages

# Backend
cd server
npm start            # Inicia servidor
npm install          # Instala dependencias
```

## 🆘 Solución de problemas

### "Cannot find module 'express'"
```bash
cd server
npm install
```

### "Error: connect ECONNREFUSED 127.0.0.1:3306"
- Verifica que MySQL esté corriendo
- Verifica las credenciales en `server/.env`
- Verifica que la BD existe: `mysql -u root -p -e "SHOW DATABASES;"`

### "Port 5173 is already in use"
```bash
# En Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# En macOS/Linux
lsof -i :5173
kill -9 <PID>
```

### "Port 3001 is already in use"
```bash
Get-Process node | Stop-Process -Force
```

### "CORS error"
- Verifica que el backend esté corriendo en puerto 3001
- Verifica la URL en `src/App.jsx`

## 📝 Notas importantes

1. **No modificar `.env`** - Cada computadora necesita su propia configuración
2. **`.env` no se sube a Git** - Por seguridad
3. **Base de datos local** - Necesita MySQL instalado y corriendo
4. **Puerto 5173** - Cambiar en vite.config.js si es necesario
5. **Puerto 3001** - Cambiar en server/.env si es necesario

## 🔐 Seguridad en Producción

Antes de desplegar a producción:
1. Cambiar `JWT_SECRET` en `.env`
2. Usar contraseñas seguras en BD
3. Configurar HTTPS
4. Actualizar `API_BASE` a URL de producción
5. Configurar variables de entorno en el servidor

## 📚 Documentación adicional

- Frontend: `README.md`
- Deployment: `DEPLOYMENT_GUIDE.md`
- Quick Start: `QUICK_DEPLOY.md`

## ✅ Verificación post-instalación

1. ✅ Clonar repositorio
2. ✅ Instalar dependencias
3. ✅ Configurar variables de entorno
4. ✅ Base de datos creada y poblada
5. ✅ Backend corriendo en puerto 3001
6. ✅ Frontend corriendo en puerto 5173
7. ✅ Poder hacer login con admin/admin123
8. ✅ Acceder a todos los módulos

Si todo funciona, ¡estás listo! 🚀

---

**Versión**: v1.0  
**Última actualización**: Diciembre 2025  
**Repositorio**: https://github.com/crispand03/compursatil-app03
