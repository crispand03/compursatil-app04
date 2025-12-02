const mysql = require('mysql2/promise');

async function insertDetails() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'compursatil',
      port: 3306
    });

    console.log('✓ Conectado a compursatil');

    // Insertar detalles de ventas
    await connection.query(`
      INSERT INTO detalle_ventas (venta_id, inventario_id, cantidad, precio_equipamiento, precio_extras, precio_unitario, subtotal, igv, total, extras) VALUES
      (6, 1, 1, 1101.69, 0, 1299.99, 1101.69, 198.30, 1299.99, NULL),
      (7, 2, 1, 593.72, 0, 699.99, 593.72, 106.27, 699.99, NULL),
      (8, 3, 1, 1610.67, 0, 1899.99, 1610.67, 289.32, 1899.99, NULL),
      (9, 4, 1, 763.38, 0, 899.99, 763.38, 136.61, 899.99, NULL),
      (10, 5, 1, 678.98, 0, 799.99, 678.98, 121.01, 799.99, NULL)
    `);
    console.log('✓ Detalles de ventas insertados');

    // Obtener IDs de detalle_ventas creados
    const [detalles] = await connection.query('SELECT id FROM detalle_ventas ORDER BY id DESC LIMIT 5');
    const detailIds = detalles.reverse().map(d => d.id);
    console.log('IDs de detalles:', detailIds);

    // Insertar garantías
    const garantias = [
      { detalle_venta_id: detailIds[0], cliente_id: 1, numero_serie: 'DELL-XPS-001', modelo: 'Dell XPS 13', fecha_inicio: '2025-11-10', fecha_venc: '2026-11-10' },
      { detalle_venta_id: detailIds[1], cliente_id: 2, numero_serie: 'HP-PAV-001', modelo: 'HP Pavilion 15', fecha_inicio: '2025-11-15', fecha_venc: '2026-11-15' },
      { detalle_venta_id: detailIds[2], cliente_id: 3, numero_serie: 'LENOVO-TP-001', modelo: 'Lenovo ThinkPad E16', fecha_inicio: '2025-11-18', fecha_venc: '2026-11-18' },
      { detalle_venta_id: detailIds[3], cliente_id: 1, numero_serie: 'ASUS-VB-001', modelo: 'ASUS VivoBook 15', fecha_inicio: '2025-11-20', fecha_venc: '2026-11-20' },
      { detalle_venta_id: detailIds[4], cliente_id: 2, numero_serie: 'HP-DESK-001', modelo: 'HP Pavilion Desktop', fecha_inicio: '2025-11-22', fecha_venc: '2026-11-22' }
    ];

    for (const g of garantias) {
      await connection.query(
        'INSERT INTO garantias (detalle_venta_id, cliente_id, numero_serie, modelo_equipo, fecha_inicio, fecha_vencimiento, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [g.detalle_venta_id, g.cliente_id, g.numero_serie, g.modelo, g.fecha_inicio, g.fecha_venc, 'Vigente']
      );
    }
    console.log('✓ Garantías insertadas');

    // Insertar soporte técnico
    const [gar] = await connection.query('SELECT id FROM garantias WHERE estado = "Vigente" ORDER BY id DESC LIMIT 4');
    const garIds = gar.reverse().map(g => g.id);

    const soportes = [
      { cliente_id: 1, garantia_id: garIds[0], numero_serie: 'DELL-XPS-001', modelo: 'Dell XPS 13', problema: 'Pantalla con líneas horizontales', estado: 'Resuelto', prioridad: 'Media', usuario_id: 4, notas: 'Se reemplazó cable de conexión del panel.' },
      { cliente_id: 2, garantia_id: garIds[1], numero_serie: 'HP-PAV-001', modelo: 'HP Pavilion 15', problema: 'Batería no carga correctamente', estado: 'En Progreso', prioridad: 'Alta', usuario_id: 2, notas: 'Batería defectuosa. Se solicitó reemplazo.' },
      { cliente_id: 3, garantia_id: garIds[2], numero_serie: 'LENOVO-TP-001', modelo: 'Lenovo ThinkPad E16', problema: 'Equipo no enciende', estado: 'Resuelto', prioridad: 'Crítica', usuario_id: 4, notas: 'Fuente de alimentación defectuosa. Reemplazada.' }
    ];

    for (const s of soportes) {
      await connection.query(
        'INSERT INTO soporte_tecnico (cliente_id, garantia_id, numero_serie, modelo_equipo, descripcion_problema, estado, prioridad, usuario_soporte_id, notas_tecnicas, fecha_apertura) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        [s.cliente_id, s.garantia_id, s.numero_serie, s.modelo, s.problema, s.estado, s.prioridad, s.usuario_id, s.notas]
      );
    }
    console.log('✓ Casos de soporte técnico insertados');

    // Verificar datos
    const [dv] = await connection.query('SELECT COUNT(*) as count FROM detalle_ventas');
    const [g] = await connection.query('SELECT COUNT(*) as count FROM garantias');
    const [s] = await connection.query('SELECT COUNT(*) as count FROM soporte_tecnico');

    console.log('\n✅ Datos relacionados insertados:');
    console.log(`   Detalles de ventas: ${dv[0].count}`);
    console.log(`   Garantías: ${g[0].count}`);
    console.log(`   Soporte Técnico: ${s[0].count}`);

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

insertDetails();
