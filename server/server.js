const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/inventario', require('./routes/inventario'));
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/ventas', require('./routes/ventas'));
app.use('/api/soporte', require('./routes/soporte'));
app.use('/api/envios', require('./routes/envios'));
app.use('/api/garantias', require('./routes/garantias'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/extras', require('./routes/extras'));
app.use('/api/reportes', require('./routes/reportes'));

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'API working', timestamp: new Date() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor COMPURSATIL ejecutándose en puerto ${PORT}`);
  console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
});
