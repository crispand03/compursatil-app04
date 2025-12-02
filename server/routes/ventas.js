const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// GET: Todas las ventas
router.get('/', async (req, res) => {
  try {
    const { fecha, cliente_id } = req.query;
    let sql = `
      SELECT 
        v.*,
        c.nombre as cliente_nombre,
        u.nombre as vendedor_nombre
      FROM ventas v
      JOIN clientes c ON v.cliente_id = c.id
      JOIN usuarios u ON v.vendedor_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (fecha) {
      sql += ' AND DATE(v.fecha) = ?';
      params.push(fecha);
    }
    if (cliente_id) {
      sql += ' AND v.cliente_id = ?';
      params.push(cliente_id);
    }

    sql += ' ORDER BY v.fecha DESC, v.hora DESC';
    const ventas = await query(sql, params);
    res.json({ success: true, data: ventas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Venta por ID con detalles
router.get('/:id', async (req, res) => {
  try {
    const ventas = await query(
      `SELECT 
        v.*,
        c.nombre as cliente_nombre,
        u.nombre as vendedor_nombre
      FROM ventas v
      JOIN clientes c ON v.cliente_id = c.id
      JOIN usuarios u ON v.vendedor_id = u.id
      WHERE v.id = ?`,
      [req.params.id]
    );

    if (ventas.length === 0) {
      return res.status(404).json({ success: false, message: 'Venta no encontrada' });
    }

    // Obtener detalles de la venta
    const detalles = await query(
      `SELECT 
        dv.*,
        i.marca, i.modelo, i.numero_serie
      FROM detalle_ventas dv
      JOIN inventario i ON dv.inventario_id = i.id
      WHERE dv.venta_id = ?`,
      [req.params.id]
    );

    res.json({
      success: true,
      data: {
        ...ventas[0],
        detalles
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: Crear venta
router.post('/', async (req, res) => {
  try {
    const {
      cliente_id, vendedor_id, tipo_documento, numero_documento,
      fecha, hora, subtotal, igv, total, metodo_pago, observaciones, detalles
    } = req.body;

    if (!cliente_id || !vendedor_id || !detalles || detalles.length === 0) {
      return res.status(400).json({ success: false, message: 'Datos incompletos' });
    }

    // Insertar venta
    const ventaResult = await query(
      `INSERT INTO ventas 
      (cliente_id, vendedor_id, tipo_documento, numero_documento, 
       fecha, hora, subtotal, igv, total, metodo_pago, observaciones)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [cliente_id, vendedor_id, tipo_documento, numero_documento,
       fecha, hora, subtotal, igv, total, metodo_pago, observaciones]
    );

    const venta_id = ventaResult.insertId;

    // Insertar detalles y actualizar stock
    for (const detalle of detalles) {
      await query(
        `INSERT INTO detalle_ventas
        (venta_id, inventario_id, cantidad, precio_equipamiento, precio_extras, 
         precio_unitario, subtotal, igv, total, extras)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [venta_id, detalle.id, detalle.quantity, detalle.equipmentBasePrice,
         detalle.extrasPrice, detalle.price, detalle.subtotal, detalle.igv,
         detalle.total, JSON.stringify(detalle.extras || [])]
      );

      // Reducir stock
      await query(
        'UPDATE inventario SET stock = stock - ? WHERE id = ?',
        [detalle.quantity, detalle.id]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Venta registrada exitosamente',
      id: venta_id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT: Actualizar venta
router.put('/:id', async (req, res) => {
  try {
    const { subtotal, igv, total, metodo_pago, observaciones, estado } = req.body;

    await query(
      `UPDATE ventas SET 
      subtotal = ?, igv = ?, total = ?, metodo_pago = ?, observaciones = ?, estado = ?
      WHERE id = ?`,
      [subtotal, igv, total, metodo_pago, observaciones, estado, req.params.id]
    );

    res.json({ success: true, message: 'Venta actualizada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE: Cancelar venta
router.delete('/:id', async (req, res) => {
  try {
    await query(
      'UPDATE ventas SET estado = "Cancelada" WHERE id = ?',
      [req.params.id]
    );

    res.json({ success: true, message: 'Venta cancelada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Reporte de ventas por rango de fechas
router.get('/reporte/periodo', async (req, res) => {
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

module.exports = router;
