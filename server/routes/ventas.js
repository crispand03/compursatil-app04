const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// GET: Reporte de ventas por rango de fechas (ANTES de /:id para evitar conflictos)
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
      LEFT JOIN clientes c ON v.cliente_id = c.id
      LEFT JOIN usuarios u ON v.vendedor_id = u.id
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
    console.log('GET /ventas - Fetched sales:', ventas.length);
    
    // Obtener detalles para cada venta
    const ventasConDetalles = await Promise.all(
      ventas.map(async (venta) => {
        const detalles = await query(
          `SELECT 
            dv.*,
            i.marca, i.modelo, i.numero_serie
          FROM detalle_ventas dv
          JOIN inventario i ON dv.inventario_id = i.id
          WHERE dv.venta_id = ?`,
          [venta.id]
        );
        return {
          ...venta,
          detalles: detalles || []
        };
      })
    );
    
    res.json({ success: true, data: ventasConDetalles });
  } catch (error) {
    console.error('Error in GET /ventas:', error);
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
    console.log('PUT /ventas/:id - ID:', req.params.id);
    console.log('Request body:', req.body);
    
    const { subtotal, igv, total, metodo_pago, observaciones, estado, items } = req.body;

    const result = await query(
      `UPDATE ventas SET 
      subtotal = ?, igv = ?, total = ?, metodo_pago = ?, observaciones = ?, estado = ?
      WHERE id = ?`,
      [subtotal, igv, total, metodo_pago, observaciones, estado, req.params.id]
    );

    console.log('Update result:', result);

    // Si hay items/detalles, actualizar detalle_ventas
    if (items && Array.isArray(items) && items.length > 0) {
      console.log('Updating items/detalles...');
      
      // Eliminar los detalles antiguos
      await query('DELETE FROM detalle_ventas WHERE venta_id = ?', [req.params.id]);
      
      // Insertar los nuevos detalles
      for (const item of items) {
        // item.id es el inventario_id
        const inventarioId = item.id;
        const cantidad = item.quantity || 1;
        const precioUnitario = item.price || 0;
        const subtotalItem = item.subtotal || (cantidad * precioUnitario);
        const igvItem = item.igv || 0;
        const totalItem = item.total || (subtotalItem + igvItem);
        
        await query(
          `INSERT INTO detalle_ventas (venta_id, inventario_id, cantidad, precio_equipamiento, precio_unitario, subtotal, igv, total)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [req.params.id, inventarioId, cantidad, precioUnitario, precioUnitario, subtotalItem, igvItem, totalItem]
        );
      }
      console.log('Items updated successfully');
    }
    
    // Obtener la venta actualizada
    const ventaActualizada = await query(
      `SELECT 
        v.*,
        c.nombre as cliente_nombre,
        u.nombre as vendedor_nombre
      FROM ventas v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      LEFT JOIN usuarios u ON v.vendedor_id = u.id
      WHERE v.id = ?`,
      [req.params.id]
    );

    if (ventaActualizada.length === 0) {
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
    
    const ventaConDetalles = {
      ...ventaActualizada[0],
      detalles: detalles || []
    };

    res.json({ success: true, message: 'Venta actualizada', data: ventaConDetalles });
  } catch (error) {
    console.error('Error in PUT /ventas/:id:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE: Eliminar venta completamente
router.delete('/:id', async (req, res) => {
  try {
    console.log('DELETE /ventas/:id - ID:', req.params.id);
    
    // Primero eliminar los detalles de la venta
    await query(
      'DELETE FROM detalle_ventas WHERE venta_id = ?',
      [req.params.id]
    );
    
    // Luego eliminar la venta
    const result = await query(
      'DELETE FROM ventas WHERE id = ?',
      [req.params.id]
    );

    console.log('Delete result:', result);
    res.json({ success: true, message: 'Venta eliminada completamente' });
  } catch (error) {
    console.error('Error in DELETE /ventas/:id:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
