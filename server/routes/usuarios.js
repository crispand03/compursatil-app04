const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// GET: Todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await query(
      'SELECT id, username, nombre, role, email, telefono, estado FROM usuarios',
      []
    );
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const users = await query(
      'SELECT id, username, nombre, role, email, telefono, estado FROM usuarios WHERE id = ?',
      [req.params.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    
    res.json({ success: true, data: users[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: Crear usuario
router.post('/', async (req, res) => {
  try {
    const { username, password, nombre, role, email, telefono } = req.body;
    
    // Validaciones
    if (!username || !password || !nombre || !role) {
      return res.status(400).json({ success: false, message: 'Datos incompletos' });
    }

    const result = await query(
      'INSERT INTO usuarios (username, password, nombre, role, email, telefono, estado) VALUES (?, SHA2(?, 256), ?, ?, ?, ?, "Activo")',
      [username, password, nombre, role, email, telefono]
    );

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      id: result.insertId
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'El usuario ya existe' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT: Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const { nombre, email, telefono, estado } = req.body;
    
    await query(
      'UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, estado = ? WHERE id = ?',
      [nombre, email, telefono, estado, req.params.id]
    );

    res.json({ success: true, message: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE: Desactivar usuario
router.delete('/:id', async (req, res) => {
  try {
    await query(
      'UPDATE usuarios SET estado = "Inactivo" WHERE id = ?',
      [req.params.id]
    );

    res.json({ success: true, message: 'Usuario desactivado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
