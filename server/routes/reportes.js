const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// GET: Reporte de ventas por período
router.get('/ventas/periodo', async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    const ventas = await query(
      `SELECT 
        DATE(v.fecha) as fecha,
        u.nombre as vendedor,
        COUNT(v.id) as total_ventas,
        SUM(v.total) as monto_total,
        AVG(v.total) as ticket_promedio
      FROM ventas v
      JOIN usuarios u ON v.vendedor_id = u.id
      WHERE DATE(v.fecha) BETWEEN ? AND ?
      GROUP BY DATE(v.fecha), u.id
      ORDER BY v.fecha DESC`,
      [fecha_inicio, fecha_fin]
    );

    res.json({ success: true, data: ventas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Reporte de inventario
router.get('/inventario/resumen', async (req, res) => {
  try {
    const resumen = await query(
      `SELECT 
        c.nombre as categoria,
        COUNT(i.id) as total_equipos,
        SUM(i.stock) as stock_total,
        AVG(i.precio_venta) as precio_promedio,
        SUM(i.stock * i.precio_venta) as valor_inventario
      FROM inventario i
      LEFT JOIN categorias c ON i.categoria_id = c.id
      GROUP BY i.categoria_id, c.nombre
      ORDER BY valor_inventario DESC`,
      []
    );

    res.json({ success: true, data: resumen });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Reporte de clientes
router.get('/clientes/resumen', async (req, res) => {
  try {
    const resumen = await query(
      `SELECT 
        c.id,
        c.nombre,
        COUNT(v.id) as total_compras,
        SUM(v.total) as monto_total,
        MAX(v.fecha) as ultima_compra
      FROM clientes c
      LEFT JOIN ventas v ON c.id = v.cliente_id
      WHERE c.estado = 'Activo'
      GROUP BY c.id, c.nombre
      ORDER BY monto_total DESC`,
      []
    );

    res.json({ success: true, data: resumen });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Reporte de soporte técnico
router.get('/soporte/resumen', async (req, res) => {
  try {
    const resumen = await query(
      `SELECT 
        u.nombre as usuario_soporte,
        COUNT(st.id) as total_casos,
        SUM(CASE WHEN st.estado = 'Resuelto' THEN 1 ELSE 0 END) as casos_resueltos,
        SUM(CASE WHEN st.estado = 'Abierto' THEN 1 ELSE 0 END) as casos_abiertos,
        AVG(st.calificacion_cliente) as calificacion_promedio
      FROM soporte_tecnico st
      LEFT JOIN usuarios u ON st.usuario_soporte_id = u.id
      GROUP BY st.usuario_soporte_id, u.nombre
      ORDER BY total_casos DESC`,
      []
    );

    res.json({ success: true, data: resumen });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Reporte de auditoria
router.get('/auditoria/logs', async (req, res) => {
  try {
    const { dias = 7, tipo_accion = null } = req.query;

    let sql = `
      SELECT 
        r.*,
        u.nombre as usuario_nombre
      FROM reportes r
      LEFT JOIN usuarios u ON r.usuario_id = u.id
      WHERE DATE(r.fecha_accion) >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    `;
    const params = [dias];

    if (tipo_accion) {
      sql += ' AND r.tipo_accion = ?';
      params.push(tipo_accion);
    }

    sql += ' ORDER BY r.fecha_accion DESC LIMIT 1000';

    const logs = await query(sql, params);
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Dashboard general
router.get('/dashboard/general', async (req, res) => {
  try {
    // Total de ventas hoy
    const ventasHoy = await query(
      `SELECT COUNT(id) as total, SUM(total) as monto FROM ventas WHERE DATE(fecha) = CURDATE()`,
      []
    );

    // Inventario bajo stock
    const stockBajo = await query(
      `SELECT COUNT(id) as total FROM inventario WHERE stock <= stock_minimo * 1.5`,
      []
    );

    // Casos de soporte pendientes
    const soportePendiente = await query(
      `SELECT COUNT(id) as total FROM soporte_tecnico WHERE estado IN ('Abierto', 'En Progreso')`,
      []
    );

    // Garantías por vencer (próximos 30 días)
    const garantiasPorVencer = await query(
      `SELECT COUNT(id) as total FROM garantias WHERE estado = 'Vigente' AND fecha_vencimiento <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)`,
      []
    );

    res.json({
      success: true,
      data: {
        ventasHoy: ventasHoy[0],
        inventarioBajoStock: stockBajo[0],
        soportePendiente: soportePendiente[0],
        garantiasPorVencer: garantiasPorVencer[0],
        fecha_reporte: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
