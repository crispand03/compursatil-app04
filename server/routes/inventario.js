const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// GET: Todo el inventario
router.get('/', async (req, res) => {
  try {
    const { marca, estado, stock } = req.query;
    let sql = `
      SELECT 
        i.*, 
        c.nombre as categoria_nombre,
        p.nombre as proveedor_nombre
      FROM inventario i
      LEFT JOIN categorias c ON i.categoria_id = c.id
      LEFT JOIN proveedores p ON i.proveedor_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (marca) {
      sql += ' AND i.marca = ?';
      params.push(marca);
    }
    if (estado) {
      sql += ' AND i.estado = ?';
      params.push(estado);
    }
    if (stock) {
      sql += ' AND i.stock > 0';
    }

    const items = await query(sql, params);
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Equipo por ID
router.get('/:id', async (req, res) => {
  try {
    const items = await query(
      `SELECT 
        i.*, 
        c.nombre as categoria_nombre,
        p.nombre as proveedor_nombre
      FROM inventario i
      LEFT JOIN categorias c ON i.categoria_id = c.id
      LEFT JOIN proveedores p ON i.proveedor_id = p.id
      WHERE i.id = ?`,
      [req.params.id]
    );

    if (items.length === 0) {
      return res.status(404).json({ success: false, message: 'Equipo no encontrado' });
    }

    res.json({ success: true, data: items[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: Crear equipo
router.post('/', async (req, res) => {
  try {
    const {
      marca, modelo, numero_serie, categoria_id, proveedor_id,
      especificaciones_ram, especificaciones_almacenamiento, especificaciones_procesador,
      especificaciones_gpu, especificaciones_pantalla, especificaciones_so,
      estado, stock, costo_unitario, precio_venta, fecha_ingreso
    } = req.body;

    const result = await query(
      `INSERT INTO inventario 
      (marca, modelo, numero_serie, categoria_id, proveedor_id, 
       especificaciones_ram, especificaciones_almacenamiento, especificaciones_procesador,
       especificaciones_gpu, especificaciones_pantalla, especificaciones_so,
       estado, stock, costo_unitario, precio_venta, fecha_ingreso)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [marca, modelo, numero_serie, categoria_id, proveedor_id,
       especificaciones_ram, especificaciones_almacenamiento, especificaciones_procesador,
       especificaciones_gpu, especificaciones_pantalla, especificaciones_so,
       estado, stock, costo_unitario, precio_venta, fecha_ingreso]
    );

    res.status(201).json({
      success: true,
      message: 'Equipo creado exitosamente',
      id: result.insertId
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'El número de serie ya existe' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT: Actualizar equipo
router.put('/:id', async (req, res) => {
  try {
    const {
      marca, modelo, categoria_id, proveedor_id,
      especificaciones_ram, especificaciones_almacenamiento, especificaciones_procesador,
      especificaciones_gpu, especificaciones_pantalla, especificaciones_so,
      estado, stock, costo_unitario, precio_venta
    } = req.body;

    await query(
      `UPDATE inventario SET
      marca = ?, modelo = ?, categoria_id = ?, proveedor_id = ?,
      especificaciones_ram = ?, especificaciones_almacenamiento = ?, especificaciones_procesador = ?,
      especificaciones_gpu = ?, especificaciones_pantalla = ?, especificaciones_so = ?,
      estado = ?, stock = ?, costo_unitario = ?, precio_venta = ?
      WHERE id = ?`,
      [marca, modelo, categoria_id, proveedor_id,
       especificaciones_ram, especificaciones_almacenamiento, especificaciones_procesador,
       especificaciones_gpu, especificaciones_pantalla, especificaciones_so,
       estado, stock, costo_unitario, precio_venta, req.params.id]
    );

    res.json({ success: true, message: 'Equipo actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE: Eliminar equipo
router.delete('/:id', async (req, res) => {
  try {
    await query('DELETE FROM inventario WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Equipo eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Stock bajo
router.get('/stock/bajo', async (req, res) => {
  try {
    const items = await query(
      `SELECT * FROM inventario 
       WHERE stock <= stock_minimo * 1.5
       ORDER BY stock ASC`,
      []
    );
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
