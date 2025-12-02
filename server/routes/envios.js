const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// GET: Todos los envíos
router.get('/', async (req, res) => {
  try {
    const { estado, documento } = req.query;
    let sql = 'SELECT * FROM envios WHERE 1=1';
    const params = [];

    if (estado) {
      sql += ' AND estado = ?';
      params.push(estado);
    }
    if (documento) {
      sql += ' AND numero_documento = ?';
      params.push(documento);
    }

    sql += ' ORDER BY fecha_creacion DESC';
    const envios = await query(sql, params);
    res.json({ success: true, data: envios });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Envío por ID o clave de seguimiento
router.get('/:id', async (req, res) => {
  try {
    let envios = await query(
      'SELECT * FROM envios WHERE id = ? OR clave_seguimiento = ?',
      [req.params.id, req.params.id]
    );

    if (envios.length === 0) {
      return res.status(404).json({ success: false, message: 'Envío no encontrado' });
    }

    res.json({ success: true, data: envios[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: Crear envío
router.post('/', async (req, res) => {
  try {
    const {
      nombre_cliente, tipo_documento, numero_documento, telefono,
      departamento, provincia, distrito, agencia, modalidad_envio,
      costo_envio, clave_seguimiento, razon_envio, estado
    } = req.body;

    if (!nombre_cliente || !clave_seguimiento) {
      return res.status(400).json({ success: false, message: 'Datos incompletos' });
    }

    const result = await query(
      `INSERT INTO envios 
      (nombre_cliente, tipo_documento, numero_documento, telefono,
       departamento, provincia, distrito, agencia, modalidad_envio,
       costo_envio, clave_seguimiento, razon_envio, estado, fecha_envio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
      [nombre_cliente, tipo_documento, numero_documento, telefono,
       departamento, provincia, distrito, agencia, modalidad_envio,
       costo_envio, clave_seguimiento, razon_envio, estado || 'Pendiente']
    );

    res.status(201).json({
      success: true,
      message: 'Envío registrado exitosamente',
      id: result.insertId,
      clave: clave_seguimiento
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'La clave de seguimiento ya existe' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT: Actualizar envío
router.put('/:id', async (req, res) => {
  try {
    const { estado, fecha_entrega, agencia, observaciones } = req.body;

    await query(
      `UPDATE envios SET 
      estado = ?, fecha_entrega = ?, agencia = ?
      WHERE id = ?`,
      [estado, fecha_entrega, agencia, req.params.id]
    );

    res.json({ success: true, message: 'Envío actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Buscar por clave de seguimiento
router.get('/buscar/clave/:clave', async (req, res) => {
  try {
    const envios = await query(
      'SELECT * FROM envios WHERE clave_seguimiento = ?',
      [req.params.clave]
    );

    if (envios.length === 0) {
      return res.status(404).json({ success: false, message: 'Envío no encontrado' });
    }

    res.json({ success: true, data: envios[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
