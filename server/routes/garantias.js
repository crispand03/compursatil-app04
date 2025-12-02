const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// GET: Todas las garantías
router.get('/', async (req, res) => {
  try {
    const { estado, cliente_id } = req.query;
    let sql = `
      SELECT 
        g.*,
        c.nombre as cliente_nombre
      FROM garantias g
      JOIN clientes c ON g.cliente_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (estado) {
      sql += ' AND g.estado = ?';
      params.push(estado);
    }
    if (cliente_id) {
      sql += ' AND g.cliente_id = ?';
      params.push(cliente_id);
    }

    sql += ' ORDER BY g.fecha_vencimiento ASC';
    const garantias = await query(sql, params);
    res.json({ success: true, data: garantias });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Garantías próximas a vencer
router.get('/proximas/vencer', async (req, res) => {
  try {
    const garantias = await query(
      `SELECT 
        g.*,
        c.nombre as cliente_nombre,
        DATEDIFF(g.fecha_vencimiento, CURDATE()) as dias_para_vencer
      FROM garantias g
      JOIN clientes c ON g.cliente_id = c.id
      WHERE g.estado = 'Vigente' 
        AND g.fecha_vencimiento <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
      ORDER BY g.fecha_vencimiento ASC`,
      []
    );

    res.json({ success: true, data: garantias });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Garantía por número de serie
router.get('/serie/:numero_serie', async (req, res) => {
  try {
    const garantias = await query(
      `SELECT 
        g.*,
        c.nombre as cliente_nombre
      FROM garantias g
      JOIN clientes c ON g.cliente_id = c.id
      WHERE g.numero_serie = ?
      ORDER BY g.fecha_inicio DESC`,
      [req.params.numero_serie]
    );

    res.json({ success: true, data: garantias });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: Crear garantía (se crea automáticamente en venta)
router.post('/', async (req, res) => {
  try {
    const {
      detalle_venta_id, cliente_id, numero_serie, modelo_equipo,
      fecha_inicio, fecha_vencimiento
    } = req.body;

    if (!detalle_venta_id || !cliente_id || !numero_serie) {
      return res.status(400).json({ success: false, message: 'Datos incompletos' });
    }

    const result = await query(
      `INSERT INTO garantias 
      (detalle_venta_id, cliente_id, numero_serie, modelo_equipo, 
       fecha_inicio, fecha_vencimiento, estado)
      VALUES (?, ?, ?, ?, ?, ?, 'Vigente')`,
      [detalle_venta_id, cliente_id, numero_serie, modelo_equipo, fecha_inicio, fecha_vencimiento]
    );

    res.status(201).json({
      success: true,
      message: 'Garantía registrada',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT: Actualizar estado de garantía
router.put('/:id', async (req, res) => {
  try {
    const { estado, observaciones } = req.body;

    await query(
      `UPDATE garantias SET 
      estado = ?, observaciones = ?
      WHERE id = ?`,
      [estado, observaciones, req.params.id]
    );

    res.json({ success: true, message: 'Garantía actualizada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
