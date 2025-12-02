const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// GET: Todos los casos de soporte
router.get('/', async (req, res) => {
  try {
    const { estado, prioridad, cliente_id } = req.query;
    let sql = `
      SELECT 
        st.*,
        c.nombre as cliente_nombre,
        u.nombre as usuario_soporte_nombre
      FROM soporte_tecnico st
      JOIN clientes c ON st.cliente_id = c.id
      LEFT JOIN usuarios u ON st.usuario_soporte_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (estado) {
      sql += ' AND st.estado = ?';
      params.push(estado);
    }
    if (prioridad) {
      sql += ' AND st.prioridad = ?';
      params.push(prioridad);
    }
    if (cliente_id) {
      sql += ' AND st.cliente_id = ?';
      params.push(cliente_id);
    }

    sql += ' ORDER BY st.prioridad DESC, st.fecha_apertura ASC';
    const casos = await query(sql, params);
    res.json({ success: true, data: casos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Caso por ID con seguimiento
router.get('/:id', async (req, res) => {
  try {
    const casos = await query(
      `SELECT 
        st.*,
        c.nombre as cliente_nombre,
        u.nombre as usuario_soporte_nombre
      FROM soporte_tecnico st
      JOIN clientes c ON st.cliente_id = c.id
      LEFT JOIN usuarios u ON st.usuario_soporte_id = u.id
      WHERE st.id = ?`,
      [req.params.id]
    );

    if (casos.length === 0) {
      return res.status(404).json({ success: false, message: 'Caso no encontrado' });
    }

    // Obtener seguimiento
    const seguimiento = await query(
      `SELECT 
        ss.*,
        u.nombre as usuario_nombre
      FROM seguimiento_soporte ss
      LEFT JOIN usuarios u ON ss.usuario_id = u.id
      WHERE ss.soporte_tecnico_id = ?
      ORDER BY ss.fecha_evento DESC`,
      [req.params.id]
    );

    res.json({
      success: true,
      data: {
        ...casos[0],
        seguimiento
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: Crear caso de soporte
router.post('/', async (req, res) => {
  try {
    const {
      cliente_id, numero_serie, modelo_equipo, descripcion_problema,
      prioridad, usuario_soporte_id
    } = req.body;

    if (!cliente_id || !numero_serie || !descripcion_problema) {
      return res.status(400).json({ success: false, message: 'Datos incompletos' });
    }

    const result = await query(
      `INSERT INTO soporte_tecnico 
      (cliente_id, numero_serie, modelo_equipo, descripcion_problema, 
       prioridad, usuario_soporte_id, estado)
      VALUES (?, ?, ?, ?, ?, ?, 'Abierto')`,
      [cliente_id, numero_serie, modelo_equipo, descripcion_problema, prioridad, usuario_soporte_id || null]
    );

    const caso_id = result.insertId;

    // Agregar entrada en seguimiento
    await query(
      `INSERT INTO seguimiento_soporte 
      (soporte_tecnico_id, descripcion, usuario_id, tipo_evento)
      VALUES (?, ?, ?, 'Creación')`,
      [caso_id, 'Caso creado: ' + descripcion_problema, usuario_soporte_id || null]
    );

    res.status(201).json({
      success: true,
      message: 'Caso de soporte creado',
      id: caso_id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT: Actualizar caso de soporte
router.put('/:id', async (req, res) => {
  try {
    const {
      estado, prioridad, usuario_soporte_id, notas_tecnicas, 
      componentes_reemplazados, calificacion_cliente
    } = req.body;

    const fecha_resolucion = estado === 'Resuelto' ? new Date() : null;

    await query(
      `UPDATE soporte_tecnico SET 
      estado = ?, prioridad = ?, usuario_soporte_id = ?, 
      notas_tecnicas = ?, componentes_reemplazados = ?,
      calificacion_cliente = ?, fecha_resolucion = ?
      WHERE id = ?`,
      [estado, prioridad, usuario_soporte_id, notas_tecnicas,
       JSON.stringify(componentes_reemplazados || []), calificacion_cliente,
       fecha_resolucion, req.params.id]
    );

    // Agregar entrada en seguimiento
    await query(
      `INSERT INTO seguimiento_soporte 
      (soporte_tecnico_id, descripcion, usuario_id, tipo_evento)
      VALUES (?, ?, ?, ?)`,
      [req.params.id, `Estado: ${estado}, Prioridad: ${prioridad}`, usuario_soporte_id, 'Actualización']
    );

    res.json({ success: true, message: 'Caso actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Casos pendientes
router.get('/pendientes/todos', async (req, res) => {
  try {
    const casos = await query(
      `SELECT 
        st.*,
        c.nombre as cliente_nombre,
        DATEDIFF(NOW(), st.fecha_apertura) as dias_abierto
      FROM soporte_tecnico st
      JOIN clientes c ON st.cliente_id = c.id
      WHERE st.estado IN ('Abierto', 'En Progreso')
      ORDER BY st.prioridad DESC, st.fecha_apertura ASC`,
      []
    );

    res.json({ success: true, data: casos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
