-- MySQL dump 10.13  Distrib 9.5.0, for Win64 (x86_64)
--
-- Host: localhost    Database: compursatil
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'e8f0764a-c88e-11f0-a2fc-b06ebf2e5ef0:1-263';

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `estado` enum('Activo','Inactivo') COLLATE utf8mb4_unicode_ci DEFAULT 'Activo',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  KEY `idx_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Laptops','Computadoras port├ítiles','Activo','2025-11-23 21:41:17','2025-11-23 21:41:17'),(2,'Desktops','Computadoras de escritorio','Activo','2025-11-23 21:41:17','2025-11-23 21:41:17'),(3,'Tablets','Tabletas y dispositivos m├│viles','Activo','2025-11-23 21:41:17','2025-11-23 21:41:17'),(4,'Perif├®ricos','Accesorios y perif├®ricos','Activo','2025-11-23 21:41:17','2025-11-23 21:41:17'),(5,'Servidores','Servidores y equipos de red','Activo','2025-11-23 21:41:17','2025-11-23 21:41:17');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_documento` enum('DNI','RUC') COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero_documento` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` text COLLATE utf8mb4_unicode_ci,
  `ciudad` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provincia` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `distrito` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pais` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Peru',
  `estado` enum('Activo','Inactivo') COLLATE utf8mb4_unicode_ci DEFAULT 'Activo',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_documento` (`numero_documento`),
  KEY `idx_numero_documento` (`numero_documento`),
  KEY `idx_nombre` (`nombre`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Carlos Mendez','DNI','12345678','carlos@example.com','987654321','Av. Principal 123','Lima',NULL,NULL,'Peru','Activo','2025-11-24 00:16:54','2025-11-24 00:16:54'),(2,'Sofia Rodriguez','DNI','87654321','sofia@example.com','912345678','Calle Secundaria 456','Arequipa',NULL,NULL,'Peru','Activo','2025-11-24 00:16:54','2025-11-24 00:16:54'),(3,'Juan Perez Empresa','RUC','20123456789','empresa@example.com','014445555','Av. Empresarial 789','Lima',NULL,NULL,'Peru','Activo','2025-11-24 00:16:54','2025-11-24 00:16:54');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_ventas`
--

DROP TABLE IF EXISTS `detalle_ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_ventas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `venta_id` int NOT NULL,
  `inventario_id` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_equipamiento` decimal(10,2) NOT NULL,
  `precio_extras` decimal(10,2) DEFAULT '0.00',
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `igv` decimal(12,2) NOT NULL,
  `total` decimal(12,2) NOT NULL,
  `extras` json DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_venta_id` (`venta_id`),
  KEY `idx_inventario_id` (`inventario_id`),
  CONSTRAINT `detalle_ventas_ibfk_1` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `detalle_ventas_ibfk_2` FOREIGN KEY (`inventario_id`) REFERENCES `inventario` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_ventas`
--

LOCK TABLES `detalle_ventas` WRITE;
/*!40000 ALTER TABLE `detalle_ventas` DISABLE KEYS */;
INSERT INTO `detalle_ventas` VALUES (23,17,3,1,2034.89,0.00,2034.89,1724.48,310.41,1899.99,NULL,'2025-12-08 01:59:50');
/*!40000 ALTER TABLE `detalle_ventas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `envios`
--

DROP TABLE IF EXISTS `envios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `envios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_cliente` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_documento` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero_documento` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `departamento` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provincia` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `distrito` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agencia` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modalidad_envio` enum('Express','Standard','Pickup') COLLATE utf8mb4_unicode_ci DEFAULT 'Standard',
  `costo_envio` decimal(10,2) DEFAULT NULL,
  `clave_seguimiento` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `razon_envio` text COLLATE utf8mb4_unicode_ci,
  `estado` enum('Pendiente','Enviado','En Tr├ínsito','Entregado','Cancelado') COLLATE utf8mb4_unicode_ci DEFAULT 'Pendiente',
  `fecha_envio` date DEFAULT NULL,
  `fecha_entrega` date DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clave_seguimiento` (`clave_seguimiento`),
  KEY `idx_clave_seguimiento` (`clave_seguimiento`),
  KEY `idx_numero_documento` (`numero_documento`),
  KEY `idx_estado` (`estado`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `envios`
--

LOCK TABLES `envios` WRITE;
/*!40000 ALTER TABLE `envios` DISABLE KEYS */;
INSERT INTO `envios` VALUES (1,'Carlos Mendez',NULL,'12345678','987654321','Lima','Lima','San Isidro','COMPURSATIL Centro','Express',50.00,'1001','Env├¡o de venta','Entregado','2025-11-10',NULL,'2025-11-24 00:18:04','2025-11-24 00:18:04'),(2,'Sofia Rodriguez',NULL,'87654321','912345678','Arequipa','Arequipa','Yanahuara','COMPURSATIL Arequipa','Standard',85.00,'1002','Env├¡o de venta','En Tr├ínsito','2025-11-16',NULL,'2025-11-24 00:18:04','2025-11-24 00:18:04'),(3,'Juan Perez Empresa',NULL,'20123456789','014445555','Lima','Lima','Miraflores','COMPURSATIL Centro','Express',60.00,'1003','Env├¡o de venta','Entregado','2025-11-18',NULL,'2025-11-24 00:18:04','2025-11-24 00:18:04'),(4,'Carlos Mendez',NULL,'12345678','987654321','Lima','Lima','San Isidro','COMPURSATIL Centro','Express',50.00,'1004','Env├¡o de venta','Entregado','2025-11-21',NULL,'2025-11-24 00:18:04','2025-11-24 00:18:04'),(5,'Sofia Rodriguez',NULL,'87654321','912345678','Arequipa','Arequipa','Yanahuara','COMPURSATIL Arequipa','Pickup',0.00,'1005','Recojo en agencia','Pendiente','2025-11-23',NULL,'2025-11-24 00:18:04','2025-11-24 00:18:04');
/*!40000 ALTER TABLE `envios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `extras`
--

DROP TABLE IF EXISTS `extras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `extras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `precio` decimal(10,2) NOT NULL,
  `categoria` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` enum('Activo','Inactivo') COLLATE utf8mb4_unicode_ci DEFAULT 'Activo',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_nombre` (`nombre`),
  KEY `idx_categoria` (`categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `extras`
--

LOCK TABLES `extras` WRITE;
/*!40000 ALTER TABLE `extras` DISABLE KEYS */;
INSERT INTO `extras` VALUES (1,'Bolsa Protectora','Bolsa de transporte para laptops',89.90,'Accesorios','Activo','2025-11-23 21:41:17','2025-11-23 21:41:17'),(2,'Mouse Inal├ímbrico','Mouse USB inal├ímbrico',45.00,'Perif├®ricos','Activo','2025-11-23 21:41:17','2025-11-23 21:41:17'),(3,'Teclado Externo','Teclado USB externo',120.00,'Perif├®ricos','Activo','2025-11-23 21:41:17','2025-11-23 21:41:17'),(4,'Hub USB','Hub USB tipo C multi-puerto',150.00,'Accesorios','Activo','2025-11-23 21:41:17','2025-11-23 21:41:17'),(5,'Protector de Pantalla','Protector de vidrio templado',35.00,'Accesorios','Activo','2025-11-23 21:41:17','2025-11-23 21:41:17'),(6,'Instalaci├│n SO','Instalaci├│n y configuraci├│n de sistema operativo',100.00,'Servicios','Activo','2025-11-23 21:41:17','2025-11-23 21:41:17'),(7,'Antivirus 1 A├▒o','Licencia de antivirus por 1 a├▒o',150.00,'Software','Activo','2025-11-23 21:41:17','2025-11-23 21:41:17');
/*!40000 ALTER TABLE `extras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `garantias`
--

DROP TABLE IF EXISTS `garantias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `garantias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `detalle_venta_id` int NOT NULL,
  `cliente_id` int NOT NULL,
  `numero_serie` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modelo_equipo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `estado` enum('Vigente','Vencida','Cancelada') COLLATE utf8mb4_unicode_ci DEFAULT 'Vigente',
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `detalle_venta_id` (`detalle_venta_id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `idx_numero_serie` (`numero_serie`),
  KEY `idx_estado` (`estado`),
  KEY `idx_fecha_vencimiento` (`fecha_vencimiento`),
  CONSTRAINT `garantias_ibfk_1` FOREIGN KEY (`detalle_venta_id`) REFERENCES `detalle_ventas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `garantias_ibfk_2` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `garantias`
--

LOCK TABLES `garantias` WRITE;
/*!40000 ALTER TABLE `garantias` DISABLE KEYS */;
/*!40000 ALTER TABLE `garantias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventario`
--

DROP TABLE IF EXISTS `inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `marca` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modelo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero_serie` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoria_id` int DEFAULT NULL,
  `proveedor_id` int DEFAULT NULL,
  `especificaciones_ram` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `especificaciones_almacenamiento` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `especificaciones_procesador` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `especificaciones_gpu` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `especificaciones_pantalla` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `especificaciones_so` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` enum('Nuevo','Reacondicionado','Defectuoso') COLLATE utf8mb4_unicode_ci DEFAULT 'Nuevo',
  `stock` int NOT NULL DEFAULT '0',
  `stock_minimo` int DEFAULT '5',
  `costo_unitario` decimal(10,2) NOT NULL,
  `precio_venta` decimal(10,2) NOT NULL,
  `imagen` longblob,
  `fecha_ingreso` date NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_serie` (`numero_serie`),
  KEY `proveedor_id` (`proveedor_id`),
  KEY `idx_numero_serie` (`numero_serie`),
  KEY `idx_marca` (`marca`),
  KEY `idx_modelo` (`modelo`),
  KEY `idx_estado` (`estado`),
  KEY `idx_stock` (`stock`),
  KEY `idx_inventario_categoria_estado` (`categoria_id`,`estado`,`stock`),
  CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE SET NULL,
  CONSTRAINT `inventario_ibfk_2` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario`
--

LOCK TABLES `inventario` WRITE;
/*!40000 ALTER TABLE `inventario` DISABLE KEYS */;
INSERT INTO `inventario` VALUES (1,'Dell','XPS 13','DELL-XPS-001',1,1,'16GB DDR5','512GB SSD NVMe','Intel Core i7-1365U','Intel Iris Xe Graphics','13.4 pulgadas FHD+','Windows 11 Pro','Nuevo',3,1,850.00,1299.99,NULL,'2025-10-01','2025-11-24 00:18:03','2025-11-24 00:18:03'),(2,'HP','Pavilion 15','HP-PAV-001',1,2,'8GB DDR4','256GB SSD','AMD Ryzen 5 5500U','Radeon Graphics','15.6 pulgadas HD','Windows 11 Home','Nuevo',1,1,450.00,699.99,NULL,'2025-10-02','2025-11-24 00:18:03','2025-12-08 01:44:10'),(3,'Lenovo','ThinkPad E16','LENOVO-TP-001',1,3,'32GB DDR4','1TB SSD','Intel Core i9-13900H','NVIDIA RTX 4060','16 pulgadas FHD','Windows 11 Pro','Nuevo',1,1,1200.00,1899.99,NULL,'2025-10-03','2025-11-24 00:18:03','2025-11-24 00:18:03');
/*!40000 ALTER TABLE `inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contacto` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` text COLLATE utf8mb4_unicode_ci,
  `ciudad` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pais` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` enum('Activo','Inactivo') COLLATE utf8mb4_unicode_ci DEFAULT 'Activo',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
INSERT INTO `proveedores` VALUES (1,'Dell Per├║','Contacto Dell','contacto@dell.com.pe','987654321','Lima','Lima','Per├║','Activo','2025-11-23 21:41:17','2025-11-23 21:41:17'),(2,'HP Per├║','Contacto HP','contacto@hp.com.pe','987654322','Lima','Lima','Per├║','Activo','2025-11-23 21:41:17','2025-11-23 21:41:17'),(3,'Lenovo Per├║','Contacto Lenovo','contacto@lenovo.com.pe','987654323','Lima','Lima','Per├║','Activo','2025-11-23 21:41:17','2025-11-23 21:41:17'),(4,'ASUS Per├║','Contacto ASUS','contacto@asus.com.pe','987654324','Lima','Lima','Per├║','Activo','2025-11-23 21:41:17','2025-11-23 21:41:17');
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recibos_config`
--

DROP TABLE IF EXISTS `recibos_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recibos_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_empresa` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ruc` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` text COLLATE utf8mb4_unicode_ci,
  `telefono` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` longblob,
  `mensaje_personalizado` text COLLATE utf8mb4_unicode_ci,
  `numero_serie_boleta` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero_serie_factura` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recibos_config`
--

LOCK TABLES `recibos_config` WRITE;
/*!40000 ALTER TABLE `recibos_config` DISABLE KEYS */;
INSERT INTO `recibos_config` VALUES (1,'COMPURSATIL - Gesti├│n de Inventarios','20123456789','Lima, Per├║','01-555-0000','info@compursatil.com',NULL,'Gracias por su compra. Garant├¡a vigente por 12 meses','001','001','2025-11-23 21:41:17');
/*!40000 ALTER TABLE `recibos_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reportes`
--

DROP TABLE IF EXISTS `reportes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reportes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `tipo_accion` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tabla_afectada` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registro_id` int DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `ip_usuario` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `fecha_accion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_usuario_id` (`usuario_id`),
  KEY `idx_fecha_accion` (`fecha_accion`),
  KEY `idx_tipo_accion` (`tipo_accion`),
  CONSTRAINT `reportes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reportes`
--

LOCK TABLES `reportes` WRITE;
/*!40000 ALTER TABLE `reportes` DISABLE KEYS */;
/*!40000 ALTER TABLE `reportes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seguimiento_soporte`
--

DROP TABLE IF EXISTS `seguimiento_soporte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seguimiento_soporte` (
  `id` int NOT NULL AUTO_INCREMENT,
  `soporte_tecnico_id` int NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuario_id` int DEFAULT NULL,
  `tipo_evento` enum('Creaci├│n','Actualizaci├│n','Asignaci├│n','Resoluci├│n','Cierre','Nota') COLLATE utf8mb4_unicode_ci DEFAULT 'Actualizaci├│n',
  `fecha_evento` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `idx_soporte_tecnico_id` (`soporte_tecnico_id`),
  KEY `idx_fecha_evento` (`fecha_evento`),
  CONSTRAINT `seguimiento_soporte_ibfk_1` FOREIGN KEY (`soporte_tecnico_id`) REFERENCES `soporte_tecnico` (`id`) ON DELETE CASCADE,
  CONSTRAINT `seguimiento_soporte_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seguimiento_soporte`
--

LOCK TABLES `seguimiento_soporte` WRITE;
/*!40000 ALTER TABLE `seguimiento_soporte` DISABLE KEYS */;
/*!40000 ALTER TABLE `seguimiento_soporte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `soporte_tecnico`
--

DROP TABLE IF EXISTS `soporte_tecnico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `soporte_tecnico` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int NOT NULL,
  `garantia_id` int DEFAULT NULL,
  `numero_serie` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modelo_equipo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion_problema` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` enum('Abierto','En Progreso','Resuelto','Cerrado') COLLATE utf8mb4_unicode_ci DEFAULT 'Abierto',
  `prioridad` enum('Baja','Media','Alta','Cr├¡tica') COLLATE utf8mb4_unicode_ci DEFAULT 'Media',
  `usuario_soporte_id` int DEFAULT NULL,
  `notas_tecnicas` text COLLATE utf8mb4_unicode_ci,
  `componentes_reemplazados` json DEFAULT NULL,
  `fecha_apertura` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_resolucion` datetime DEFAULT NULL,
  `calificacion_cliente` int DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `garantia_id` (`garantia_id`),
  KEY `usuario_soporte_id` (`usuario_soporte_id`),
  KEY `idx_estado` (`estado`),
  KEY `idx_prioridad` (`prioridad`),
  KEY `idx_cliente_id` (`cliente_id`),
  KEY `idx_numero_serie` (`numero_serie`),
  KEY `idx_soporte_cliente_estado` (`cliente_id`,`estado`),
  CONSTRAINT `soporte_tecnico_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `soporte_tecnico_ibfk_2` FOREIGN KEY (`garantia_id`) REFERENCES `garantias` (`id`) ON DELETE SET NULL,
  CONSTRAINT `soporte_tecnico_ibfk_3` FOREIGN KEY (`usuario_soporte_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `soporte_tecnico`
--

LOCK TABLES `soporte_tecnico` WRITE;
/*!40000 ALTER TABLE `soporte_tecnico` DISABLE KEYS */;
INSERT INTO `soporte_tecnico` VALUES (9,1,NULL,'DELL-XPS-001','Dell XPS 13','Pantalla con l├¡neas horizontales','Resuelto','Media',4,'Se reemplaz├│ cable de conexi├│n del panel.',NULL,'2025-11-23 19:38:17',NULL,NULL,'2025-11-24 00:38:17','2025-11-24 00:38:17'),(10,2,NULL,'HP-PAV-001','HP Pavilion 15','Bater├¡a no carga correctamente','En Progreso','Alta',2,'Bater├¡a defectuosa. Se solicit├│ reemplazo.',NULL,'2025-11-23 19:38:17',NULL,NULL,'2025-11-24 00:38:17','2025-11-24 00:38:17'),(11,3,NULL,'LENOVO-TP-001','Lenovo ThinkPad E16','Equipo no enciende','Resuelto','Cr├¡tica',4,'Fuente de alimentaci├│n defectuosa. Reemplazada.',NULL,'2025-11-23 19:38:17',NULL,NULL,'2025-11-24 00:38:17','2025-11-24 00:38:17');
/*!40000 ALTER TABLE `soporte_tecnico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('Gerente','Administrador','Vendedor','Soporte') COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` enum('Activo','Inactivo') COLLATE utf8mb4_unicode_ci DEFAULT 'Activo',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `idx_username` (`username`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'gerente','ecfba551324356e5bd27b548adf36b728783f60d9b573d142caac7baad62be49','Gerente','Gerente','gerente@compursatil.com','999999999','Activo','2025-11-23 21:41:17','2025-11-23 21:41:17'),(2,'admin','240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9','Administrador','Administrador','admin@compursatil.com','998888888','Activo','2025-11-23 21:41:17','2025-11-23 21:41:17'),(3,'vendedor','bc431c22f966ff587d08bec8f58b97425d05c402e54c9052888b3a3ab1b7f7a3','Vendedor','Vendedor','vendedor@compursatil.com','997777777','Activo','2025-11-23 21:41:17','2025-11-23 21:41:17'),(4,'soporte','431ffa0b2f9c6c82bbe3f931632425bcbf369cc6f6bb52f644b363479e1b4dca','Soporte T├®cnico','Soporte','soporte@compursatil.com','996666666','Activo','2025-11-23 21:41:17','2025-11-23 21:41:17');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int NOT NULL,
  `vendedor_id` int NOT NULL,
  `tipo_documento` enum('Boleta','Factura','Proforma','Ticket') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Boleta',
  `numero_documento` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `igv` decimal(12,2) NOT NULL,
  `total` decimal(12,2) NOT NULL,
  `metodo_pago` enum('Efectivo','Tarjeta','Cheque','Transferencia','Otro') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Efectivo',
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `estado` enum('Completada','Pendiente','Cancelada') COLLATE utf8mb4_unicode_ci DEFAULT 'Completada',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_documento` (`tipo_documento`,`numero_documento`),
  KEY `idx_fecha` (`fecha`),
  KEY `idx_cliente_id` (`cliente_id`),
  KEY `idx_vendedor_id` (`vendedor_id`),
  KEY `idx_estado` (`estado`),
  KEY `idx_ventas_cliente_fecha` (`cliente_id`,`fecha`),
  CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`vendedor_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas`
--

LOCK TABLES `ventas` WRITE;
/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;
INSERT INTO `ventas` VALUES (17,1,1,'Boleta','B001-000001','2025-12-08','20:44:00',1724.48,310.41,2034.89,'Efectivo','','Completada','2025-12-08 01:44:10','2025-12-08 01:59:50');
/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vw_garantias_por_vencer`
--

DROP TABLE IF EXISTS `vw_garantias_por_vencer`;
/*!50001 DROP VIEW IF EXISTS `vw_garantias_por_vencer`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_garantias_por_vencer` AS SELECT 
 1 AS `id`,
 1 AS `cliente`,
 1 AS `numero_serie`,
 1 AS `modelo_equipo`,
 1 AS `fecha_vencimiento`,
 1 AS `dias_para_vencer`,
 1 AS `estado`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_inventario_bajo_stock`
--

DROP TABLE IF EXISTS `vw_inventario_bajo_stock`;
/*!50001 DROP VIEW IF EXISTS `vw_inventario_bajo_stock`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_inventario_bajo_stock` AS SELECT 
 1 AS `id`,
 1 AS `marca`,
 1 AS `modelo`,
 1 AS `numero_serie`,
 1 AS `stock`,
 1 AS `stock_minimo`,
 1 AS `precio_venta`,
 1 AS `nivel_stock`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_soporte_pendiente`
--

DROP TABLE IF EXISTS `vw_soporte_pendiente`;
/*!50001 DROP VIEW IF EXISTS `vw_soporte_pendiente`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_soporte_pendiente` AS SELECT 
 1 AS `id`,
 1 AS `cliente`,
 1 AS `modelo_equipo`,
 1 AS `numero_serie`,
 1 AS `descripcion_problema`,
 1 AS `prioridad`,
 1 AS `estado`,
 1 AS `usuario_soporte`,
 1 AS `fecha_apertura`,
 1 AS `dias_abierto`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_ventas_por_vendedor`
--

DROP TABLE IF EXISTS `vw_ventas_por_vendedor`;
/*!50001 DROP VIEW IF EXISTS `vw_ventas_por_vendedor`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_ventas_por_vendedor` AS SELECT 
 1 AS `vendedor`,
 1 AS `total_ventas`,
 1 AS `monto_total`,
 1 AS `ticket_promedio`,
 1 AS `fecha`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `vw_garantias_por_vencer`
--

/*!50001 DROP VIEW IF EXISTS `vw_garantias_por_vencer`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_garantias_por_vencer` AS select `g`.`id` AS `id`,`c`.`nombre` AS `cliente`,`g`.`numero_serie` AS `numero_serie`,`g`.`modelo_equipo` AS `modelo_equipo`,`g`.`fecha_vencimiento` AS `fecha_vencimiento`,(to_days(`g`.`fecha_vencimiento`) - to_days(curdate())) AS `dias_para_vencer`,`g`.`estado` AS `estado` from (`garantias` `g` join `clientes` `c` on((`g`.`cliente_id` = `c`.`id`))) where ((`g`.`estado` = 'Vigente') and (`g`.`fecha_vencimiento` <= (curdate() + interval 30 day))) order by `g`.`fecha_vencimiento` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_inventario_bajo_stock`
--

/*!50001 DROP VIEW IF EXISTS `vw_inventario_bajo_stock`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_inventario_bajo_stock` AS select `inventario`.`id` AS `id`,`inventario`.`marca` AS `marca`,`inventario`.`modelo` AS `modelo`,`inventario`.`numero_serie` AS `numero_serie`,`inventario`.`stock` AS `stock`,`inventario`.`stock_minimo` AS `stock_minimo`,`inventario`.`precio_venta` AS `precio_venta`,(case when (`inventario`.`stock` <= `inventario`.`stock_minimo`) then 'CR├ìTICO' when (`inventario`.`stock` <= (`inventario`.`stock_minimo` * 1.5)) then 'BAJO' else 'NORMAL' end) AS `nivel_stock` from `inventario` where (`inventario`.`stock` <= (`inventario`.`stock_minimo` * 1.5)) order by `inventario`.`stock` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_soporte_pendiente`
--

/*!50001 DROP VIEW IF EXISTS `vw_soporte_pendiente`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_soporte_pendiente` AS select `st`.`id` AS `id`,`c`.`nombre` AS `cliente`,`st`.`modelo_equipo` AS `modelo_equipo`,`st`.`numero_serie` AS `numero_serie`,`st`.`descripcion_problema` AS `descripcion_problema`,`st`.`prioridad` AS `prioridad`,`st`.`estado` AS `estado`,`u`.`nombre` AS `usuario_soporte`,`st`.`fecha_apertura` AS `fecha_apertura`,(to_days(now()) - to_days(`st`.`fecha_apertura`)) AS `dias_abierto` from ((`soporte_tecnico` `st` join `clientes` `c` on((`st`.`cliente_id` = `c`.`id`))) left join `usuarios` `u` on((`st`.`usuario_soporte_id` = `u`.`id`))) where (`st`.`estado` in ('Abierto','En Progreso')) order by `st`.`prioridad` desc,`st`.`fecha_apertura` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_ventas_por_vendedor`
--

/*!50001 DROP VIEW IF EXISTS `vw_ventas_por_vendedor`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_ventas_por_vendedor` AS select `u`.`nombre` AS `vendedor`,count(`v`.`id`) AS `total_ventas`,sum(`v`.`total`) AS `monto_total`,avg(`v`.`total`) AS `ticket_promedio`,cast(`v`.`fecha` as date) AS `fecha` from (`ventas` `v` join `usuarios` `u` on((`v`.`vendedor_id` = `u`.`id`))) group by `u`.`id`,`u`.`nombre`,cast(`v`.`fecha` as date) order by `fecha` desc,`monto_total` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-07 23:52:07
