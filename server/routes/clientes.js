const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// GET: Todos los clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await query(
      'SELECT * FROM clientes WHERE estado = "Activo" ORDER BY nombre ASC',
      []
    );
    res.json({ success: true, data: clientes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const clientes = await query(
      'SELECT * FROM clientes WHERE id = ?',
      [req.params.id]
    );

    if (clientes.length === 0) {
      return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    }

    res.json({ success: true, data: clientes[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: Crear cliente
router.post('/', async (req, res) => {
  try {
    const {
      nombre, tipo_documento, numero_documento, email, telefono,
      direccion, ciudad, provincia, distrito, pais
    } = req.body;

    if (!nombre || !tipo_documento || !numero_documento) {
      return res.status(400).json({ success: false, message: 'Datos incompletos' });
    }

    const result = await query(
      `INSERT INTO clientes 
      (nombre, tipo_documento, numero_documento, email, telefono, 
       direccion, ciudad, provincia, distrito, pais, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Activo')`,
      [nombre, tipo_documento, numero_documento, email, telefono,
       direccion, ciudad, provincia, distrito, pais]
    );

    res.status(201).json({
      success: true,
      message: 'Cliente creado exitosamente',
      id: result.insertId
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'El cliente ya existe' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT: Actualizar cliente
router.put('/:id', async (req, res) => {
  try {
    const {
      nombre, email, telefono, direccion, ciudad, provincia, distrito
    } = req.body;

    await query(
      `UPDATE clientes SET 
      nombre = ?, email = ?, telefono = ?, 
      direccion = ?, ciudad = ?, provincia = ?, distrito = ?
      WHERE id = ?`,
      [nombre, email, telefono, direccion, ciudad, provincia, distrito, req.params.id]
    );

    res.json({ success: true, message: 'Cliente actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE: Desactivar cliente
router.delete('/:id', async (req, res) => {
  try {
    await query(
      'UPDATE clientes SET estado = "Inactivo" WHERE id = ?',
      [req.params.id]
    );

    res.json({ success: true, message: 'Cliente desactivado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Buscar por documento
router.get('/documento/:documento', async (req, res) => {
  try {
    const clientes = await query(
      'SELECT * FROM clientes WHERE numero_documento = ?',
      [req.params.documento]
    );

    res.json({ success: true, data: clientes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
