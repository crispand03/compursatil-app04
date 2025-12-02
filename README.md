# 🏢 COMPURSATIL - Sistema de Gestión de Inventarios y Ventas

<div align="center">

![Logo](./public/compursatil_logo.svg)

**Solución integral para la gestión empresarial de tiendas de computación**

[![GitHub](https://img.shields.io/badge/GitHub-crispand03-blue?style=flat-square&logo=github)](https://github.com/crispand03/compursatil-app02)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1-blue?style=flat-square&logo=react)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=flat-square&logo=mysql)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)](LICENSE)

</div>

---

## 📋 ¿Qué es COMPURSATIL?

**COMPURSATIL** es una aplicación web empresarial completa diseñada para gestionar todos los aspectos operativos de una tienda de computación. Proporciona herramientas integradas para:

- ✅ **Gestión de Inventario** - Control de stock y productos
- ✅ **Ventas y Facturación** - Registro de transacciones y reportes
- ✅ **Seguimiento de Envíos** - Rastreo de entregas y logística
- ✅ **Servicio Técnico** - Gestión de garantías y soporte
- ✅ **Reportes y Análisis** - Estadísticas y dashboards
- ✅ **Gestión de Usuarios** - Control de acceso por roles

---

## 🎯 Características Principales

### 📦 Módulo de Inventario
- Registro de productos con categorías
- Control de stock en tiempo real
- Alertas de bajo inventario
- Gestión de proveedores
- Historial de movimientos

### 💳 Módulo de Ventas
- Creación rápida de facturas
- Cálculo automático de totales e impuestos
- Registro de clientes
- Historial de compras
- Impresión de recibos

### 🚚 Módulo de Envíos
- Seguimiento de entregas
- Claves de rastreo
- Modalidades de envío
- Costos de logística
- Estado de paquetes

### 🛠️ Módulo de Soporte Técnico
- Gestión de garantías
- Tickets de soporte
- Historial de reparaciones
- Seguimiento de casos abiertos
- Resolución de problemas

### 📊 Módulo de Reportes
- Estadísticas de ventas
- Análisis de inventario
- Reportes de envíos
- Gráficos personalizables
- Exportación a Excel

### 🔐 Control de Acceso
- 4 roles de usuario: **Admin**, **Gerente**, **Vendedor**, **Soporte**
- Permisos personalizados por módulo
- Autenticación JWT segura
- Contraseñas encriptadas con bcrypt

---

## 🏗️ Arquitectura Técnica

### Frontend
- **React 19.1** - UI interactiva con componentes reutilizables
- **Vite 7** - Build tool moderno y rápido
- **Tailwind CSS** - Estilos responsivos y modernos
- **Lucide React** - Iconografía profesional
- **XLSX** - Exportación de reportes a Excel

### Backend
- **Node.js + Express** - API RESTful escalable
- **MySQL 8** - Base de datos relacional
- **JWT** - Autenticación segura
- **bcryptjs** - Encriptación de contraseñas
- **CORS** - Configuración de seguridad

### Base de Datos
- **18 tablas** con relaciones optimizadas
- **Foreign keys** para integridad referencial
- **Índices** para mejor rendimiento
- **Seed data** con datos de prueba

---

## 🚀 Instalación Rápida

### Requisitos Previos
- Node.js 18.x o superior
- MySQL 8.0 o superior
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/crispand03/compursatil-app02.git
cd compursatil-app02
```

2. **Instalar dependencias**
```bash
npm install
cd server
npm install
cd ..
```

3. **Configurar base de datos**
```bash
cd server
node init-db.js
node insert-test-data.js
cd ..
```

4. **Ejecutar la aplicación**
```bash
# Terminal 1: Backend (puerto 3001)
cd server
npm start

# Terminal 2: Frontend (puerto 5173)
npm run dev
```

5. **Acceder a la aplicación**
```
http://localhost:5173/compursatil-app
```

---

## 🔐 Credenciales de Prueba

| Rol | Usuario | Contraseña | Módulos Accesibles |
|-----|---------|------------|-------------------|
| **Admin** | `admin` | `admin123` | Todos |
| **Gerente** | `gerente` | `gerente123` | Dashboard, Inventario, Ventas, Reportes |
| **Vendedor** | `vendedor` | `venta123` | Inventario, Ventas, Clientes |
| **Soporte** | `soporte` | `sop123` | Soporte Técnico, Garantías |

---

## 📁 Estructura del Proyecto

```
compursatil-app02/
├── src/                          # Código frontend React
│   ├── App.jsx                   # Componente principal (4500+ líneas)
│   ├── main.jsx                  # Entry point
│   ├── App.css                   # Estilos globales
│   └── assets/                   # Imágenes y logos
├── server/                       # Código backend Node.js
│   ├── server.js                 # Servidor Express
│   ├── init-db.js                # Inicialización BD
│   ├── insert-test-data.js       # Datos de prueba
│   ├── routes/                   # Endpoints API
│   │   ├── auth.js               # Autenticación
│   │   ├── inventario.js         # CRUD productos
│   │   ├── ventas.js             # CRUD ventas
│   │   ├── envios.js             # CRUD envíos
│   │   ├── soporte.js            # CRUD soporte
│   │   └── ...                   # Más rutas
│   └── config/                   # Configuración
├── database/                     # Scripts SQL
│   ├── compursatil.sql          # Schema BD
│   └── seed-data.sql            # Datos iniciales
├── package.json                  # Dependencias
├── vite.config.js               # Configuración Vite
└── tailwind.config.js           # Configuración Tailwind
```

---

## 📊 Datos Incluidos

El sistema viene preconfigurado con datos de prueba:
- **5 Productos** en inventario
- **3 Clientes** registrados
- **5 Facturas** de ventas
- **5 Envíos** con seguimiento
- **5 Garantías** activas
- **3 Casos** de soporte técnico

---

## 🔧 Scripts Disponibles

```bash
# Frontend
npm run dev          # Inicia servidor Vite en desarrollo
npm run build        # Compila para producción
npm run preview      # Vista previa del build

# Backend (desde carpeta server/)
npm start            # Inicia servidor Express
node init-db.js      # Crea la base de datos
node insert-test-data.js  # Inserta datos de prueba
```

---

## 🌐 Despliegue

### GitHub Pages (Frontend)
```bash
git push origin main
# El workflow automático publicará en:
# https://crispand03.github.io/compursatil-app02/
```

### Alternativas de Despliegue
- **Vercel** - Para el frontend React
- **Render/Railway** - Para el backend Node.js
- **DigitalOcean** - Stack completo

Ver [WEB_DEPLOYMENT.md](./WEB_DEPLOYMENT.md) para instrucciones detalladas.

---

## 📚 Documentación

- [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) - Guía de configuración
- [WEB_DEPLOYMENT.md](./WEB_DEPLOYMENT.md) - Despliegue en web
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Configuración de BD
- [GITHUB_SETUP.md](./GITHUB_SETUP.md) - Setup de GitHub

---

## 🎨 Tecnologías Utilizadas

<table>
<tr>
<td align="center" width="100">
<b>Frontend</b><br/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="50">
<br/>React 19
</td>
<td align="center" width="100">
<b>Build</b><br/>
<img src="https://vitejs.dev/logo.svg" width="50">
<br/>Vite 7
</td>
<td align="center" width="100">
<b>Estilos</b><br/>
<img src="https://tailwindcss.com/_next/static/media/tailwindcss-mark.3c5441fc7a190fb1800d14c21fb7ee5a.svg" width="50">
<br/>Tailwind CSS
</td>
<td align="center" width="100">
<b>Backend</b><br/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" width="50">
<br/>Node.js
</td>
</tr>
<tr>
<td align="center" width="100">
<b>API</b><br/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg" width="50">
<br/>Express
</td>
<td align="center" width="100">
<b>BD</b><br/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg" width="50">
<br/>MySQL 8
</td>
<td align="center" width="100">
<b>Auth</b><br/>
<img src="https://jwt.io/img/pic_logo.svg" width="50">
<br/>JWT
</td>
<td align="center" width="100">
<b>Seguridad</b><br/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/npm/npm-original-wordmark.svg" width="50">
<br/>bcryptjs
</td>
</tr>
</table>

---

## 📈 Estadísticas del Proyecto

| Métrica | Valor |
|---------|-------|
| Líneas de Código | 4,500+ |
| Componentes React | 11+ módulos |
| Rutas API | 11 endpoints |
| Tablas de BD | 18 |
| Funcionalidades | 50+ |
| Tiempo de Desarrollo | Completo |

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Cristian Pando**
- GitHub: [@crispand03](https://github.com/crispand03)
- Email: cristian@example.com

---

## 🙏 Agradecimientos

- React y Vite por las herramientas increíbles
- Tailwind CSS por los estilos modernos
- MySQL por la base de datos confiable
- La comunidad de código abierto

---

<div align="center">

**¡Hecho con ❤️ para mejorar la gestión de tu negocio!**

[⬆ Volver arriba](#-compursatil---sistema-de-gestión-de-inventarios-y-ventas)

</div>
