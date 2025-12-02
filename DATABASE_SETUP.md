# COMPURSATIL - Sistema de Gestión de Inventarios y Ventas

## 📋 Tabla de Contenidos
- [Instalación](#instalación)
- [Configuración Base de Datos](#configuración-base-de-datos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Credenciales de Prueba](#credenciales-de-prueba)

---

## 🚀 Instalación

### Requisitos Previos
- **Node.js** v16+ 
- **MySQL** 8.0+
- **MySQL Workbench** (opcional, para gestionar BD)
- **npm** o **yarn**

### Paso 1: Clonar o descargar el proyecto

```bash
cd compursatil-app
```

### Paso 2: Instalar dependencias del Frontend

```bash
npm install
```

### Paso 3: Instalar dependencias del Backend

```bash
cd server
npm install
```

---

## 🗄️ Configuración Base de Datos

### Paso 1: Crear la base de datos en MySQL

1. Abre **MySQL Workbench**
2. Conéctate a tu servidor MySQL local
3. Ve a **File → Open SQL Script** 
4. Selecciona el archivo: `database/compursatil.sql`
5. Haz clic en **Execute All** (Ctrl + Shift + Enter)

O desde la línea de comandos:

```bash
mysql -u root -p < database/compursatil.sql
```

### Paso 2: Configurar variables de entorno

Edita el archivo `server/.env`:

```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=compursatil
JWT_SECRET=tu_clave_secreta_super_segura
NODE_ENV=development
```

---

## 📁 Estructura del Proyecto

```
compursatil-app/
├── src/
│   ├── App.jsx              # Aplicación principal React
│   ├── App.css              # Estilos
│   └── main.jsx             # Punto de entrada
├── server/
│   ├── config/
│   │   └── database.js      # Configuración de conexión MySQL
│   ├── routes/
│   │   ├── auth.js          # Autenticación y login
│   │   ├── usuarios.js      # Gestión de usuarios
│   │   ├── inventario.js    # Gestión de inventario
│   │   ├── clientes.js      # Gestión de clientes
│   │   ├── ventas.js        # Gestión de ventas
│   │   ├── soporte.js       # Casos de soporte técnico
│   │   ├── envios.js        # Gestión de envíos
│   │   ├── garantias.js     # Gestión de garantías
│   │   ├── categorias.js    # Gestión de categorías
│   │   ├── extras.js        # Gestión de extras/accesorios
│   │   └── reportes.js      # Reportes y análisis
│   ├── server.js            # Servidor Express
│   ├── package.json         # Dependencias del backend
│   └── .env                 # Variables de entorno
├── database/
│   └── compursatil.sql      # Script SQL de base de datos
├── package.json             # Dependencias del frontend
└── README.md                # Este archivo
```

---

## 🔌 API Endpoints

### Autenticación
- **POST** `/api/auth/login` - Login de usuario
- **GET** `/api/auth/validate` - Validar token JWT

### Usuarios (Solo Gerente)
- **GET** `/api/usuarios` - Listar usuarios
- **POST** `/api/usuarios` - Crear usuario
- **PUT** `/api/usuarios/:id` - Actualizar usuario
- **DELETE** `/api/usuarios/:id` - Desactivar usuario

### Inventario
- **GET** `/api/inventario` - Listar equipos
- **GET** `/api/inventario/:id` - Obtener equipo
- **POST** `/api/inventario` - Crear equipo (Admin/Gerente)
- **PUT** `/api/inventario/:id` - Actualizar equipo (Admin/Gerente)
- **DELETE** `/api/inventario/:id` - Eliminar equipo (Admin/Gerente)
- **GET** `/api/inventario/stock/bajo` - Equipos con bajo stock

### Clientes
- **GET** `/api/clientes` - Listar clientes
- **POST** `/api/clientes` - Crear cliente
- **PUT** `/api/clientes/:id` - Actualizar cliente
- **DELETE** `/api/clientes/:id` - Desactivar cliente
- **GET** `/api/clientes/documento/:documento` - Buscar por documento

### Ventas
- **GET** `/api/ventas` - Listar ventas
- **POST** `/api/ventas` - Registrar venta
- **PUT** `/api/ventas/:id` - Actualizar venta (Admin/Gerente)
- **DELETE** `/api/ventas/:id` - Cancelar venta (Admin/Gerente)
- **GET** `/api/ventas/reporte/periodo` - Reporte por período

### Soporte Técnico
- **GET** `/api/soporte` - Listar casos
- **POST** `/api/soporte` - Crear caso
- **PUT** `/api/soporte/:id` - Actualizar caso
- **GET** `/api/soporte/pendientes/todos` - Casos pendientes

### Envíos
- **GET** `/api/envios` - Listar envíos
- **POST** `/api/envios` - Registrar envío
- **PUT** `/api/envios/:id` - Actualizar envío
- **GET** `/api/envios/buscar/clave/:clave` - Buscar por clave de seguimiento

### Garantías
- **GET** `/api/garantias` - Listar garantías
- **GET** `/api/garantias/proximas/vencer` - Garantías por vencer
- **GET** `/api/garantias/serie/:numero_serie` - Buscar por serie

### Reportes
- **GET** `/api/reportes/dashboard/general` - Dashboard general
- **GET** `/api/reportes/ventas/periodo` - Reporte de ventas
- **GET** `/api/reportes/inventario/resumen` - Resumen de inventario
- **GET** `/api/reportes/clientes/resumen` - Resumen de clientes
- **GET** `/api/reportes/soporte/resumen` - Resumen de soporte

---

## 🚀 Ejecutar la Aplicación

### Terminal 1: Frontend React

```bash
npm run dev
```

Accede a: `http://localhost:5176`

### Terminal 2: Backend Node.js/Express

```bash
cd server
npm run dev
```

El servidor estará en: `http://localhost:3001`

---

## 📊 Credenciales de Prueba

| Rol | Usuario | Contraseña | Acceso |
|-----|---------|-----------|--------|
| Gerente | `gerente` | `gerente123` | ✅ Acceso total |
| Administrador | `admin` | `admin123` | ✅ Inventario, Ventas, Clientes, Envíos |
| Vendedor | `vendedor` | `venta123` | ✅ Solo lectura en inventario |
| Soporte | `soporte` | `sop123` | ✅ Solo Soporte Técnico |

---

## 📈 Vistas (Views) Disponibles

La base de datos incluye varias vistas útiles para análisis:

1. **vw_ventas_por_vendedor** - Resumen de ventas por vendedor y fecha
2. **vw_inventario_bajo_stock** - Equipos con stock bajo o crítico
3. **vw_soporte_pendiente** - Casos de soporte abiertos y en progreso
4. **vw_garantias_por_vencer** - Garantías próximas a vencer

---

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con SHA2 en la base de datos
- ✅ Autenticación con JWT
- ✅ Control de roles granular
- ✅ Validación de permisos en backend
- ✅ CORS habilitado para desarrollo

**En Producción:**
- Cambiar `JWT_SECRET` por una cadena segura
- Usar HTTPS
- Configurar CORS con dominios específicos
- Usar bcrypt en lugar de SHA2 para contraseñas
- Implementar rate limiting
- Agregar logs de auditoria

---

## 🛠️ Troubleshooting

### Error: "Cannot connect to database"
- Verifica que MySQL está corriendo
- Comprueba credenciales en `.env`
- Asegúrate de que la base de datos `compursatil` existe

### Error: "Port 3001 already in use"
- Cambia el puerto en `.env` a otro disponible
- O detén el proceso que usa ese puerto

### Error: "Token inválido"
- Vuelve a iniciar sesión
- Limpia cookies del navegador

---

## 📞 Soporte

Para problemas o sugerencias, contacta al equipo de desarrollo.

---

**Versión:** 1.0.0  
**Última actualización:** Noviembre 2025
