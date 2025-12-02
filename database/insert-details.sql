-- Insertar detalles de ventas (con los IDs correctos de ventas creadas: 6, 7, 8, 9, 10)
INSERT INTO detalle_ventas (venta_id, inventario_id, cantidad, precio_equipamiento, precio_extras, precio_unitario, subtotal, igv, total, extras) VALUES
(6, 1, 1, 1101.69, 0, 1299.99, 1101.69, 198.30, 1299.99, NULL),
(7, 2, 1, 593.72, 0, 699.99, 593.72, 106.27, 699.99, NULL),
(8, 3, 1, 1610.67, 0, 1899.99, 1610.67, 289.32, 1899.99, NULL),
(9, 4, 1, 763.38, 0, 899.99, 763.38, 136.61, 899.99, NULL),
(10, 5, 1, 678.98, 0, 799.99, 678.98, 121.01, 799.99, NULL);
