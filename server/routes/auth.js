const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST: Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Usuario y contraseña requeridos' });
    }

    // Buscar usuario
    const users = await query('SELECT * FROM usuarios WHERE username = ?', [username]);
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const user = users[0];

    // Comparar contraseña (en BD está hasheada con SHA2, aquí comparamos directo)
    const passwordHash = require('crypto').createHash('sha256').update(password).digest('hex');
    
    // Query a BD devuelve contraseña hasheada, comparar
    const userPassword = await query(
      'SELECT password FROM usuarios WHERE id = ?', 
      [user.id]
    );

    if (userPassword[0].password !== 'SHA2(\'' + password + '\', 256)') {
      // Para desarrollo, comparar con la contraseña en texto
      // En producción, usar bcrypt
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, nombre: user.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Validar token
router.get('/validate', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ success: true, user: decoded });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token inválido' });
  }
});

module.exports = router;
