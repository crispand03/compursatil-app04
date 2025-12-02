const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// GET: Todas las categorías
router.get('/', async (req, res) => {
  try {
    const categorias = await query(
      'SELECT * FROM categorias WHERE estado = "Activo" ORDER BY nombre ASC',
      []
    );
    res.json({ success: true, data: categorias });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: Crear categoría
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ success: false, message: 'Nombre requerido' });
    }

    const result = await query(
      'INSERT INTO categorias (nombre, descripcion, estado) VALUES (?, ?, "Activo")',
      [nombre, descripcion]
    );

    res.status(201).json({
      success: true,
      message: 'Categoría creada',
      id: result.insertId
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'La categoría ya existe' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT: Actualizar categoría
router.put('/:id', async (req, res) => {
  try {
    const { nombre, descripcion, estado } = req.body;

    await query(
      'UPDATE categorias SET nombre = ?, descripcion = ?, estado = ? WHERE id = ?',
      [nombre, descripcion, estado, req.params.id]
    );

    res.json({ success: true, message: 'Categoría actualizada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE: Eliminar categoría
router.delete('/:id', async (req, res) => {
  try {
    await query(
      'UPDATE categorias SET estado = "Inactivo" WHERE id = ?',
      [req.params.id]
    );

    res.json({ success: true, message: 'Categoría desactivada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
