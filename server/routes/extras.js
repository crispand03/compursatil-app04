const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// GET: Todos los extras
router.get('/', async (req, res) => {
  try {
    const extras = await query(
      'SELECT * FROM extras WHERE estado = "Activo" ORDER BY categoria, nombre ASC',
      []
    );
    res.json({ success: true, data: extras });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: Crear extra
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria } = req.body;

    if (!nombre || !precio) {
      return res.status(400).json({ success: false, message: 'Datos incompletos' });
    }

    const result = await query(
      'INSERT INTO extras (nombre, descripcion, precio, categoria, estado) VALUES (?, ?, ?, ?, "Activo")',
      [nombre, descripcion, precio, categoria]
    );

    res.status(201).json({
      success: true,
      message: 'Extra creado',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT: Actualizar extra
router.put('/:id', async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, estado } = req.body;

    await query(
      'UPDATE extras SET nombre = ?, descripcion = ?, precio = ?, categoria = ?, estado = ? WHERE id = ?',
      [nombre, descripcion, precio, categoria, estado, req.params.id]
    );

    res.json({ success: true, message: 'Extra actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE: Eliminar extra
router.delete('/:id', async (req, res) => {
  try {
    await query(
      'UPDATE extras SET estado = "Inactivo" WHERE id = ?',
      [req.params.id]
    );

    res.json({ success: true, message: 'Extra desactivado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
