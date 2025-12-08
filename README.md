# 🏢 COMPURSATIL - Sistema de Gestión de Inventarios y Ventas

> **Una solución completa y profesional para gestionar tu negocio de forma eficiente**

![React](https://img.shields.io/badge/React-19.1.1-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1-purple?style=flat-square&logo=vite)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=flat-square&logo=mysql)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## 📋 Descripción del Software

**COMPURSATIL** es un sistema web integral diseñado para pequeñas y medianas empresas de comercio electrónico y venta de productos. Proporciona herramientas profesionales para gestionar inventarios, ventas, clientes, envíos, garantías y soporte técnico desde una plataforma centralizada.

### 🎯 Objetivo Principal
Optimizar y automatizar todos los procesos comerciales, reduciendo errores, mejorando la eficiencia operativa y ofreciendo una experiencia superior al cliente.

---

## ✨ Características Principales

### 📦 **Gestión de Inventario**
- Control completo de productos y stock
- Categorización de artículos
- Seguimiento de niveles de existencia
- Alertas de productos agotados
- Historial de movimientos

### 💳 **Sistema de Ventas**
- Generación de facturas automáticas
- Cotizaciones personalizadas
- Registro de transacciones completo
- Cálculo automático de impuestos
- Descuentos y promociones configurables

### 👥 **Gestión de Clientes**
- Base de datos centralizada de clientes
- Historial de compras por cliente
- Información de contacto y dirección
- Clasificación de clientes
- Seguimiento de preferencias

### 🚚 **Seguimiento de Envíos**
- Rastreo en tiempo real de entregas
- Múltiples modalidades de envío
- Códigos de seguimiento únicos
- Historial de logística
- Notificaciones de estado

### 🛠️ **Soporte Técnico**
- Gestión de casos de soporte
- Seguimiento de garantías
- Resolución de problemas
- Historial de interacciones
- Priorización de tickets

### 📊 **Reportes y Análisis**
- Dashboard con métricas clave
- Gráficos estadísticos
- Reportes por período
- Análisis de ventas y tendencias
- Exportación a Excel (XLSX)

### 🔐 **Control de Acceso**
- Sistema de autenticación JWT
- 4 roles de usuario configurable (Admin, Gerente, Vendedor, Soporte)
- Permisos granulares por módulo
- Contraseñas encriptadas
- Auditoría de accesos

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 19.1.1** - Interfaz de usuario dinámica
- **Vite 7.1** - Compilador y bundler ultrarrápido
- **Tailwind CSS** - Diseño responsivo y moderno
- **Lucide React** - Iconografía profesional
- **XLSX** - Exportación de datos

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web robusto
- **MySQL2** - Base de datos relacional
- **JWT** - Autenticación segura
- **bcryptjs** - Encriptación de contraseñas

### Base de Datos
- **MySQL 8.0+** - 18 tablas con relaciones
- **Integridad referencial** - Validación automática
- **Índices optimizados** - Rendimiento rápido

---

## 🚀 Guía de Instalación

### Requisitos Previos
- **Node.js** v18 o superior
- **npm** o **yarn**
- **MySQL** v8.0 o superior

### Pasos de Instalación

#### 1. Clonar el Repositorio
```bash
git clone https://github.com/crispand03/compursatil-app02.git
cd compursatil-app02
```

#### 2. Instalar Dependencias del Frontend
```bash
npm install
```

#### 3. Instalar Dependencias del Backend
```bash
cd server
npm install
cd ..
```

#### 4. Configurar Base de Datos
```bash
# Desde la carpeta raíz
node server/init-db.js
```

#### 5. Insertar Datos de Prueba (Opcional)
```bash
node server/insert-test-data.js
node server/insert-related.js
```

#### 6. Iniciar el Sistema

**Terminal 1 - Backend (Puerto 3001)**
```bash
cd server
npm start
```

**Terminal 2 - Frontend (Puerto 5173)**
```bash
npm run dev
```

#### 7. Acceder a la Aplicación
```
http://localhost:5173/compursatil-app
```

---

## 👤 Credenciales de Prueba

| Rol | Usuario | Contraseña | Acceso |
|-----|---------|------------|--------|
| **Administrador** | `admin` | `admin123` | Acceso total al sistema |
| **Gerente** | `gerente` | `gerente123` | Gestión y reportes |
| **Vendedor** | `vendedor` | `venta123` | Ventas e inventario |
| **Soporte** | `soporte` | `sop123` | Casos y garantías |

---

## 📊 Estructura del Proyecto

```
compursatil-app02/
├── src/
│   ├── App.jsx                 # Componente principal
│   ├── App.css                 # Estilos globales
│   ├── main.jsx                # Punto de entrada
│   ├── index.css               # Estilos de índice
│   └── assets/                 # Recursos estáticos
├── server/
│   ├── server.js               # Servidor Express
│   ├── init-db.js              # Inicializar base de datos
│   ├── insert-test-data.js     # Insertar datos de prueba
│   ├── config/
│   │   └── database.js         # Configuración MySQL
│   └── routes/
│       ├── auth.js             # Autenticación
│       ├── inventario.js       # Gestión de productos
│       ├── clientes.js         # Gestión de clientes
│       ├── ventas.js           # Gestión de ventas
│       ├── envios.js           # Seguimiento de envíos
│       ├── garantias.js        # Garantías
│       ├── soporte.js          # Casos técnicos
│       └── ...más rutas
├── database/
│   ├── compursatil.sql        # Schema completo
│   ├── insert-details.sql     # Datos adicionales
│   └── seed-data.sql          # Datos de prueba
├── vite.config.js             # Configuración Vite
├── tailwind.config.js         # Configuración Tailwind
└── package.json               # Dependencias
```

---

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión

### Inventario
- `GET /api/inventario` - Listar productos
- `POST /api/inventario` - Crear producto
- `PUT /api/inventario/:id` - Actualizar producto
- `DELETE /api/inventario/:id` - Eliminar producto

### Ventas
- `GET /api/ventas` - Listar ventas
- `POST /api/ventas` - Crear venta
- `GET /api/ventas/:id` - Detalle de venta

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/:id` - Actualizar cliente

### Envíos
- `GET /api/envios` - Listar envíos
- `POST /api/envios` - Crear envío
- `GET /api/envios/:id` - Detalles de envío

### Soporte
- `GET /api/soporte` - Listar casos
- `POST /api/soporte` - Crear caso
- `PUT /api/soporte/:id` - Actualizar caso

*Ver documentación completa de API en `/server/routes`*

---

## 🎨 Módulos Disponibles

1. **Dashboard** - Resumen y métricas principales
2. **Inventario** - Gestión de productos
3. **Ventas** - Registro de transacciones
4. **Clientes** - Base de datos de clientes
5. **Soporte Técnico** - Casos y tickets
6. **Seguimiento de Envíos** - Logística
7. **Garantías** - Gestión de garantías
8. **Reportes** - Análisis y estadísticas
9. **Usuarios** - Gestión de cuentas
10. **Categorías** - Clasificación de productos
11. **Configuración de Recibos** - Personalización

---

## 🔧 Configuración Avanzada

### Variables de Entorno
Crear archivo `.env` en la carpeta `server/`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=compursatil
PORT=3001
JWT_SECRET=tu_secreto_super_seguro
```

### Personalización
- Modificar roles y permisos en `src/App.jsx`
- Ajustar estilos Tailwind en `tailwind.config.js`
- Configurar base de datos en `server/config/database.js`

---

## 📦 Datos de Prueba Incluidos

- ✅ 5 productos en inventario
- ✅ 3 clientes registrados
- ✅ 5 registros de ventas
- ✅ 5 envíos con seguimiento
- ✅ 5 garantías activas
- ✅ 3 casos de soporte técnico

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'mysql2'"
```bash
cd server && npm install && cd ..
```

### Error: "Port 3001 already in use"
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3001
kill -9 <PID>
```

### Base de datos no conecta
- Verificar MySQL está ejecutándose
- Revisar credenciales en `server/config/database.js`
- Ejecutar `node server/init-db.js` nuevamente

---

## 📖 Documentación Adicional

- [Guía de Despliegue Web](./WEB_DEPLOYMENT.md)
- [Setup de GitHub](./GITHUB_SETUP.md)
- [Setup de Base de Datos](./DATABASE_SETUP.md)

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios mayores, abre un issue primero para discutir los cambios propuestos.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

Desarrollado por **[crispand03](https://github.com/crispand03)**

---

## 📞 Soporte

Para reportar problemas, abre un [Issue en GitHub](https://github.com/crispand03/compursatil-app02/issues)

---

## 🎉 ¡Gracias por usar COMPURSATIL!

**Optimiza tu negocio hoy mismo.** 🚀
