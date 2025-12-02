-- ============================================
-- DATOS DE PRUEBA COHERENTES
-- ============================================

-- Insertar inventario (productos)
INSERT INTO inventario (categoria_id, marca, modelo, numero_serie, especificaciones_ram, especificaciones_almacenamiento, especificaciones_procesador, especificaciones_gpu, especificaciones_pantalla, especificaciones_so, costo_unitario, precio_venta, stock, stock_minimo, estado, proveedor_id, imagen, fecha_ingreso) VALUES

-- Dell XPS 13
(1, 'Dell', 'XPS 13', 'DELL-XPS-001', '16GB DDR5', '512GB SSD NVMe', 'Intel Core i7-1365U', 'Intel Iris Xe Graphics', '13.4 pulgadas FHD+', 'Windows 11 Pro', 850.00, 1299.99, 3, 1, 'Nuevo', 1, NULL, '2025-10-01'),

-- HP Pavilion 15
(1, 'HP', 'Pavilion 15', 'HP-PAV-001', '8GB DDR4', '256GB SSD', 'AMD Ryzen 5 5500U', 'Radeon Graphics', '15.6 pulgadas HD', 'Windows 11 Home', 450.00, 699.99, 2, 1, 'Nuevo', 2, NULL, '2025-10-02'),

-- Lenovo ThinkPad
(1, 'Lenovo', 'ThinkPad E16', 'LENOVO-TP-001', '32GB DDR4', '1TB SSD', 'Intel Core i9-13900H', 'NVIDIA RTX 4060', '16 pulgadas FHD', 'Windows 11 Pro', 1200.00, 1899.99, 1, 1, 'Nuevo', 3, NULL, '2025-10-03'),

-- ASUS VivoBook
(1, 'ASUS', 'VivoBook 15', 'ASUS-VB-001', '16GB DDR4', '512GB SSD', 'AMD Ryzen 7 5700U', 'Radeon Graphics', '15.6 pulgadas FHD', 'Windows 11 Home', 600.00, 899.99, 4, 1, 'Nuevo', 4, NULL, '2025-10-04'),

-- Desktop HP Pavilion
(2, 'HP', 'Pavilion Desktop', 'HP-DESK-001', '16GB DDR4', '256GB SSD', 'Intel Core i5-12400', 'Intel UHD Graphics', 'Monitor no incluido', 'Windows 11 Home', 500.00, 799.99, 2, 1, 'Nuevo', 2, NULL, '2025-10-05');

-- Insertar clientes adicionales
INSERT INTO clientes (nombre, numero_documento, tipo_documento, telefono, email, direccion, ciudad, estado) VALUES
('Carlos Mendez', '12345678', 'DNI', '987654321', 'carlos@example.com', 'Av. Principal 123', 'Lima', 'Activo'),
('Sofia Rodriguez', '87654321', 'DNI', '912345678', 'sofia@example.com', 'Calle Secundaria 456', 'Arequipa', 'Activo'),
('Juan Perez Empresa', '20123456789', 'RUC', '014445555', 'empresa@example.com', 'Av. Empresarial 789', 'Lima', 'Activo');

-- Insertar ventas coherentes
INSERT INTO ventas (cliente_id, vendedor_id, fecha, hora, numero_documento, tipo_documento, metodo_pago, subtotal, igv, total, observaciones, estado) VALUES

-- Venta 1: Dell XPS a Carlos Mendez
(1, 2, '2025-11-10', '10:30', 'B001-000001', 'Boleta', 'Efectivo', 1101.69, 198.30, 1299.99, 'Venta exitosa. Cliente satisfecho', 'Completada'),

-- Venta 2: HP Pavilion a Sofia Rodriguez
(2, 3, '2025-11-15', '14:00', 'B001-000002', 'Boleta', 'Tarjeta', 593.72, 106.27, 699.99, 'Pago con tarjeta de crédito', 'Completada'),

-- Venta 3: Lenovo ThinkPad a Juan Perez Empresa
(3, 4, '2025-11-18', '09:15', 'F001-000001', 'Factura', 'Transferencia', 1610.67, 289.32, 1899.99, 'Compra corporativa', 'Completada'),

-- Venta 4: ASUS VivoBook a Carlos Mendez
(1, 2, '2025-11-20', '15:45', 'B001-000003', 'Boleta', 'Efectivo', 763.38, 136.61, 899.99, 'Segunda compra del cliente', 'Completada'),

-- Venta 5: Desktop HP a Sofia Rodriguez
(2, 3, '2025-11-22', '11:00', 'F001-000002', 'Factura', 'Tarjeta', 678.98, 121.01, 799.99, 'Venta de desktop', 'Completada');

-- Insertar detalles de ventas (deben ir ANTES de garantías porque garantías referencia detalle_venta_id)
INSERT INTO detalle_ventas (venta_id, inventario_id, cantidad, precio_equipamiento, precio_extras, precio_unitario, subtotal, igv, total, extras) VALUES
(1, 1, 1, 1101.69, 0, 1299.99, 1101.69, 198.30, 1299.99, NULL),
(2, 2, 1, 593.72, 0, 699.99, 593.72, 106.27, 699.99, NULL),
(3, 3, 1, 1610.67, 0, 1899.99, 1610.67, 289.32, 1899.99, NULL),
(4, 4, 1, 763.38, 0, 899.99, 763.38, 136.61, 899.99, NULL),
(5, 5, 1, 678.98, 0, 799.99, 678.98, 121.01, 799.99, NULL);

-- Insertar garantías coherentes (usando detalle_venta_id)
INSERT INTO garantias (detalle_venta_id, cliente_id, numero_serie, modelo_equipo, fecha_inicio, fecha_vencimiento, estado, observaciones) VALUES
(1, 1, 'DELL-XPS-001', 'Dell XPS 13', '2025-11-10', '2026-11-10', 'Vigente', 'Garantía de 1 año'),
(2, 2, 'HP-PAV-001', 'HP Pavilion 15', '2025-11-15', '2026-11-15', 'Vigente', 'Garantía de 1 año'),
(3, 3, 'LENOVO-TP-001', 'Lenovo ThinkPad E16', '2025-11-18', '2026-11-18', 'Vigente', 'Garantía de 1 año'),
(4, 1, 'ASUS-VB-001', 'ASUS VivoBook 15', '2025-11-20', '2026-11-20', 'Vigente', 'Garantía de 1 año'),
(5, 2, 'HP-DESK-001', 'HP Pavilion Desktop', '2025-11-22', '2026-11-22', 'Vigente', 'Garantía de 1 año');

-- Insertar envíos coherentes
INSERT INTO envios (nombre_cliente, numero_documento, telefono, departamento, provincia, distrito, agencia, modalidad_envio, costo_envio, clave_seguimiento, razon_envio, estado, fecha_envio) VALUES
('Carlos Mendez', '12345678', '987654321', 'Lima', 'Lima', 'San Isidro', 'COMPURSATIL Centro', 'Express', 50.00, '1001', 'Envío de venta', 'Entregado', '2025-11-10'),
('Sofia Rodriguez', '87654321', '912345678', 'Arequipa', 'Arequipa', 'Yanahuara', 'COMPURSATIL Arequipa', 'Standard', 85.00, '1002', 'Envío de venta', 'En Tránsito', '2025-11-16'),
('Juan Perez Empresa', '20123456789', '014445555', 'Lima', 'Lima', 'Miraflores', 'COMPURSATIL Centro', 'Express', 60.00, '1003', 'Envío de venta', 'Entregado', '2025-11-18'),
('Carlos Mendez', '12345678', '987654321', 'Lima', 'Lima', 'San Isidro', 'COMPURSATIL Centro', 'Express', 50.00, '1004', 'Envío de venta', 'Entregado', '2025-11-21'),
('Sofia Rodriguez', '87654321', '912345678', 'Arequipa', 'Arequipa', 'Yanahuara', 'COMPURSATIL Arequipa', 'Pickup', 0.00, '1005', 'Recojo en agencia', 'Pendiente', '2025-11-23');

-- Insertar casos de soporte técnico coherentes
INSERT INTO soporte_tecnico (cliente_id, garantia_id, numero_serie, modelo_equipo, descripcion_problema, estado, prioridad, usuario_soporte_id, notas_tecnicas, fecha_apertura) VALUES

-- Caso para Dell XPS (problema resuelto)
(1, 1, 'DELL-XPS-001', 'Dell XPS 13', 'Pantalla con líneas horizontales', 'Resuelto', 'Media', 4, 'Se reemplazó cable de conexión del panel. Equipo funcionando correctamente.', '2025-11-12 10:30:00'),

-- Caso para HP Pavilion (problema en progreso)
(2, 2, 'HP-PAV-001', 'HP Pavilion 15', 'Batería no carga correctamente', 'En Progreso', 'Alta', 2, 'Batería defectuosa en fábrica. Se solicitó batería de reemplazo al proveedor.', '2025-11-17 14:00:00'),

-- Caso para Lenovo (problema crítico resuelto)
(3, 3, 'LENOVO-TP-001', 'Lenovo ThinkPad E16', 'Equipo no enciende', 'Resuelto', 'Crítica', 4, 'Fuente de alimentación defectuosa. Se reemplazó con pieza original. Equipo 100% funcional.', '2025-11-19 09:15:00'),

-- Caso para ASUS (mantenimiento preventivo)
(1, 4, 'ASUS-VB-001', 'ASUS VivoBook 15', 'Mantenimiento preventivo y optimización', 'Resuelto', 'Baja', 2, 'Se realizó limpieza interna, actualización de BIOS y drivers. Sistema optimizado.', '2025-11-21 15:45:00');
