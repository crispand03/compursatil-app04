-- COMPURSATIL Database Structure
-- Sistema de Gestión de Inventarios y Ventas

CREATE DATABASE IF NOT EXISTS compursatil;
USE compursatil;

-- ============================================
-- TABLA: usuarios (Login & Roles)
-- ============================================
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  role ENUM('Gerente', 'Administrador', 'Vendedor', 'Soporte') NOT NULL,
  email VARCHAR(100),
  telefono VARCHAR(15),
  estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: categorias (Categorías de Equipos)
-- ============================================
CREATE TABLE categorias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: proveedores (Gestión de Proveedores)
-- ============================================
CREATE TABLE proveedores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  contacto VARCHAR(100),
  email VARCHAR(100),
  telefono VARCHAR(15),
  direccion TEXT,
  ciudad VARCHAR(50),
  pais VARCHAR(50),
  estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: inventario (Gestión de Equipos)
-- ============================================
CREATE TABLE inventario (
  id INT PRIMARY KEY AUTO_INCREMENT,
  marca VARCHAR(50) NOT NULL,
  modelo VARCHAR(100) NOT NULL,
  numero_serie VARCHAR(100) UNIQUE NOT NULL,
  categoria_id INT,
  proveedor_id INT,
  especificaciones_ram VARCHAR(50),
  especificaciones_almacenamiento VARCHAR(50),
  especificaciones_procesador VARCHAR(100),
  especificaciones_gpu VARCHAR(100),
  especificaciones_pantalla VARCHAR(100),
  especificaciones_so VARCHAR(50),
  estado ENUM('Nuevo', 'Reacondicionado', 'Defectuoso') DEFAULT 'Nuevo',
  stock INT NOT NULL DEFAULT 0,
  stock_minimo INT DEFAULT 5,
  costo_unitario DECIMAL(10, 2) NOT NULL,
  precio_venta DECIMAL(10, 2) NOT NULL,
  imagen LONGBLOB,
  fecha_ingreso DATE NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL,
  FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL,
  INDEX idx_numero_serie (numero_serie),
  INDEX idx_marca (marca),
  INDEX idx_modelo (modelo),
  INDEX idx_estado (estado),
  INDEX idx_stock (stock)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: clientes (Gestión de Clientes)
-- ============================================
CREATE TABLE clientes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(150) NOT NULL,
  tipo_documento ENUM('DNI', 'RUC') NOT NULL,
  numero_documento VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(100),
  telefono VARCHAR(15),
  direccion TEXT,
  ciudad VARCHAR(50),
  provincia VARCHAR(50),
  distrito VARCHAR(50),
  pais VARCHAR(50) DEFAULT 'Peru',
  estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_numero_documento (numero_documento),
  INDEX idx_nombre (nombre),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: ventas (Registro de Ventas)
-- ============================================
CREATE TABLE ventas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cliente_id INT NOT NULL,
  vendedor_id INT NOT NULL,
  tipo_documento ENUM('Boleta', 'Factura', 'Proforma', 'Ticket') NOT NULL DEFAULT 'Boleta',
  numero_documento VARCHAR(20) NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  igv DECIMAL(12, 2) NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  metodo_pago ENUM('Efectivo', 'Tarjeta', 'Cheque', 'Transferencia', 'Otro') NOT NULL DEFAULT 'Efectivo',
  observaciones TEXT,
  estado ENUM('Completada', 'Pendiente', 'Cancelada') DEFAULT 'Completada',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT,
  FOREIGN KEY (vendedor_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
  UNIQUE KEY uk_documento (tipo_documento, numero_documento),
  INDEX idx_fecha (fecha),
  INDEX idx_cliente_id (cliente_id),
  INDEX idx_vendedor_id (vendedor_id),
  INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: detalle_ventas (Productos en cada venta)
-- ============================================
CREATE TABLE detalle_ventas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  venta_id INT NOT NULL,
  inventario_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_equipamiento DECIMAL(10, 2) NOT NULL,
  precio_extras DECIMAL(10, 2) DEFAULT 0,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  igv DECIMAL(12, 2) NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  extras JSON,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
  FOREIGN KEY (inventario_id) REFERENCES inventario(id) ON DELETE RESTRICT,
  INDEX idx_venta_id (venta_id),
  INDEX idx_inventario_id (inventario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: garantias (Gestión de Garantías)
-- ============================================
CREATE TABLE garantias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  detalle_venta_id INT NOT NULL,
  cliente_id INT NOT NULL,
  numero_serie VARCHAR(100) NOT NULL,
  modelo_equipo VARCHAR(150) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  estado ENUM('Vigente', 'Vencida', 'Cancelada') DEFAULT 'Vigente',
  observaciones TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (detalle_venta_id) REFERENCES detalle_ventas(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT,
  INDEX idx_numero_serie (numero_serie),
  INDEX idx_estado (estado),
  INDEX idx_fecha_vencimiento (fecha_vencimiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: soporte_tecnico (Casos de Soporte Técnico)
-- ============================================
CREATE TABLE soporte_tecnico (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cliente_id INT NOT NULL,
  garantia_id INT,
  numero_serie VARCHAR(100) NOT NULL,
  modelo_equipo VARCHAR(150) NOT NULL,
  descripcion_problema TEXT NOT NULL,
  estado ENUM('Abierto', 'En Progreso', 'Resuelto', 'Cerrado') DEFAULT 'Abierto',
  prioridad ENUM('Baja', 'Media', 'Alta', 'Crítica') DEFAULT 'Media',
  usuario_soporte_id INT,
  notas_tecnicas TEXT,
  componentes_reemplazados JSON,
  fecha_apertura DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_resolucion DATETIME,
  calificacion_cliente INT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT,
  FOREIGN KEY (garantia_id) REFERENCES garantias(id) ON DELETE SET NULL,
  FOREIGN KEY (usuario_soporte_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_estado (estado),
  INDEX idx_prioridad (prioridad),
  INDEX idx_cliente_id (cliente_id),
  INDEX idx_numero_serie (numero_serie)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: seguimiento_soporte (Historial de Casos)
-- ============================================
CREATE TABLE seguimiento_soporte (
  id INT PRIMARY KEY AUTO_INCREMENT,
  soporte_tecnico_id INT NOT NULL,
  descripcion TEXT NOT NULL,
  usuario_id INT,
  tipo_evento ENUM('Creación', 'Actualización', 'Asignación', 'Resolución', 'Cierre', 'Nota') DEFAULT 'Actualización',
  fecha_evento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (soporte_tecnico_id) REFERENCES soporte_tecnico(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_soporte_tecnico_id (soporte_tecnico_id),
  INDEX idx_fecha_evento (fecha_evento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: envios (Gestión de Envíos y Seguimiento)
-- ============================================
CREATE TABLE envios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre_cliente VARCHAR(150) NOT NULL,
  tipo_documento VARCHAR(50),
  numero_documento VARCHAR(20),
  telefono VARCHAR(15),
  departamento VARCHAR(50),
  provincia VARCHAR(50),
  distrito VARCHAR(50),
  agencia VARCHAR(100),
  modalidad_envio ENUM('Express', 'Standard', 'Pickup') DEFAULT 'Standard',
  costo_envio DECIMAL(10, 2),
  clave_seguimiento VARCHAR(20) UNIQUE,
  razon_envio TEXT,
  estado ENUM('Pendiente', 'Enviado', 'En Tránsito', 'Entregado', 'Cancelado') DEFAULT 'Pendiente',
  fecha_envio DATE,
  fecha_entrega DATE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_clave_seguimiento (clave_seguimiento),
  INDEX idx_numero_documento (numero_documento),
  INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: recibos_config (Configuración de Recibos)
-- ============================================
CREATE TABLE recibos_config (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre_empresa VARCHAR(150) NOT NULL,
  ruc VARCHAR(20),
  direccion TEXT,
  telefono VARCHAR(15),
  email VARCHAR(100),
  logo LONGBLOB,
  mensaje_personalizado TEXT,
  numero_serie_boleta VARCHAR(10),
  numero_serie_factura VARCHAR(10),
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: extras (Accesorios y Servicios Adicionales)
-- ============================================
CREATE TABLE extras (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  categoria VARCHAR(50),
  estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nombre (nombre),
  INDEX idx_categoria (categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: reportes (Auditoría y Logs)
-- ============================================
CREATE TABLE reportes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  tipo_accion VARCHAR(50),
  tabla_afectada VARCHAR(50),
  registro_id INT,
  descripcion TEXT,
  ip_usuario VARCHAR(45),
  user_agent TEXT,
  fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_usuario_id (usuario_id),
  INDEX idx_fecha_accion (fecha_accion),
  INDEX idx_tipo_accion (tipo_accion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERCIONES INICIALES
-- ============================================

-- Insertar usuarios
INSERT INTO usuarios (username, password, nombre, role, email, telefono, estado) VALUES
('gerente', SHA2('gerente123', 256), 'Gerente', 'Gerente', 'gerente@compursatil.com', '999999999', 'Activo'),
('admin', SHA2('admin123', 256), 'Administrador', 'Administrador', 'admin@compursatil.com', '998888888', 'Activo'),
('vendedor', SHA2('venta123', 256), 'Vendedor', 'Vendedor', 'vendedor@compursatil.com', '997777777', 'Activo'),
('soporte', SHA2('sop123', 256), 'Soporte Técnico', 'Soporte', 'soporte@compursatil.com', '996666666', 'Activo');

-- Insertar categorías
INSERT INTO categorias (nombre, descripcion, estado) VALUES
('Laptops', 'Computadoras portátiles', 'Activo'),
('Desktops', 'Computadoras de escritorio', 'Activo'),
('Tablets', 'Tabletas y dispositivos móviles', 'Activo'),
('Periféricos', 'Accesorios y periféricos', 'Activo'),
('Servidores', 'Servidores y equipos de red', 'Activo');

-- Insertar proveedores
INSERT INTO proveedores (nombre, contacto, email, telefono, direccion, ciudad, pais, estado) VALUES
('Dell Perú', 'Contacto Dell', 'contacto@dell.com.pe', '987654321', 'Lima', 'Lima', 'Perú', 'Activo'),
('HP Perú', 'Contacto HP', 'contacto@hp.com.pe', '987654322', 'Lima', 'Lima', 'Perú', 'Activo'),
('Lenovo Perú', 'Contacto Lenovo', 'contacto@lenovo.com.pe', '987654323', 'Lima', 'Lima', 'Perú', 'Activo'),
('ASUS Perú', 'Contacto ASUS', 'contacto@asus.com.pe', '987654324', 'Lima', 'Lima', 'Perú', 'Activo');

-- Insertar extras
INSERT INTO extras (nombre, descripcion, precio, categoria, estado) VALUES
('Bolsa Protectora', 'Bolsa de transporte para laptops', 89.90, 'Accesorios', 'Activo'),
('Mouse Inalámbrico', 'Mouse USB inalámbrico', 45.00, 'Periféricos', 'Activo'),
('Teclado Externo', 'Teclado USB externo', 120.00, 'Periféricos', 'Activo'),
('Hub USB', 'Hub USB tipo C multi-puerto', 150.00, 'Accesorios', 'Activo'),
('Protector de Pantalla', 'Protector de vidrio templado', 35.00, 'Accesorios', 'Activo'),
('Instalación SO', 'Instalación y configuración de sistema operativo', 100.00, 'Servicios', 'Activo'),
('Antivirus 1 Año', 'Licencia de antivirus por 1 año', 150.00, 'Software', 'Activo');

-- Insertar configuración de recibos
INSERT INTO recibos_config (nombre_empresa, ruc, direccion, telefono, email, numero_serie_boleta, numero_serie_factura, mensaje_personalizado) VALUES
('COMPURSATIL - Gestión de Inventarios', '20123456789', 'Lima, Perú', '01-555-0000', 'info@compursatil.com', '001', '001', 'Gracias por su compra. Garantía vigente por 12 meses');

-- Crear índices adicionales para optimización
CREATE INDEX idx_ventas_cliente_fecha ON ventas(cliente_id, fecha);
CREATE INDEX idx_inventario_categoria_estado ON inventario(categoria_id, estado, stock);
CREATE INDEX idx_soporte_cliente_estado ON soporte_tecnico(cliente_id, estado);

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: Resumen de Ventas por Vendedor
CREATE VIEW vw_ventas_por_vendedor AS
SELECT 
  u.nombre as vendedor,
  COUNT(v.id) as total_ventas,
  SUM(v.total) as monto_total,
  AVG(v.total) as ticket_promedio,
  DATE(v.fecha) as fecha
FROM ventas v
JOIN usuarios u ON v.vendedor_id = u.id
GROUP BY u.id, u.nombre, DATE(v.fecha)
ORDER BY fecha DESC, monto_total DESC;

-- Vista: Inventario Bajo Stock
CREATE VIEW vw_inventario_bajo_stock AS
SELECT 
  id,
  marca,
  modelo,
  numero_serie,
  stock,
  stock_minimo,
  precio_venta,
  CASE 
    WHEN stock <= stock_minimo THEN 'CRÍTICO'
    WHEN stock <= stock_minimo * 1.5 THEN 'BAJO'
    ELSE 'NORMAL'
  END as nivel_stock
FROM inventario
WHERE stock <= stock_minimo * 1.5
ORDER BY stock ASC;

-- Vista: Casos de Soporte Pendientes
CREATE VIEW vw_soporte_pendiente AS
SELECT 
  st.id,
  c.nombre as cliente,
  st.modelo_equipo,
  st.numero_serie,
  st.descripcion_problema,
  st.prioridad,
  st.estado,
  u.nombre as usuario_soporte,
  st.fecha_apertura,
  DATEDIFF(NOW(), st.fecha_apertura) as dias_abierto
FROM soporte_tecnico st
JOIN clientes c ON st.cliente_id = c.id
LEFT JOIN usuarios u ON st.usuario_soporte_id = u.id
WHERE st.estado IN ('Abierto', 'En Progreso')
ORDER BY st.prioridad DESC, st.fecha_apertura ASC;

-- Vista: Garantías Próximas a Vencer
CREATE VIEW vw_garantias_por_vencer AS
SELECT 
  g.id,
  c.nombre as cliente,
  g.numero_serie,
  g.modelo_equipo,
  g.fecha_vencimiento,
  DATEDIFF(g.fecha_vencimiento, CURDATE()) as dias_para_vencer,
  g.estado
FROM garantias g
JOIN clientes c ON g.cliente_id = c.id
WHERE g.estado = 'Vigente' 
  AND g.fecha_vencimiento <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
ORDER BY g.fecha_vencimiento ASC;