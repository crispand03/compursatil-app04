const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    // Crear conexión directa (sin base de datos aún)
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      port: 3306,
      multipleStatements: true
    });

    console.log('✓ Conectado a MySQL');

    // Crear la base de datos si no existe
    await connection.execute('CREATE DATABASE IF NOT EXISTS compursatil');
    console.log('✓ Base de datos creada');

    // Usar la base de datos
    await connection.changeUser({ database: 'compursatil' });
    console.log('✓ Usando base de datos compursatil');

    // Leer el archivo SQL
    const sqlFile = path.join(__dirname, '../database/compursatil.sql');
    let sql = fs.readFileSync(sqlFile, 'utf8');

    // Remover comandos que no son soportados
    sql = sql.replace(/CREATE DATABASE.*?;/gs, '');
    sql = sql.replace(/USE compursatil;/g, '');

    // Ejecutar todo el SQL de una vez
    try {
      await connection.query(sql);
      console.log('✓ Queries SQL ejecutadas correctamente');
    } catch (err) {
      console.warn('⚠ Algunas queries tuvieron problemas (pueden ser duplicadas):', err.message.substring(0, 100));
    }

    // Verificar que las tablas existan
    const [tables] = await connection.execute("SHOW TABLES");
    console.log(`✓ Tablas en la base de datos: ${tables.length}`);
    
    const tableNames = tables.map(t => Object.values(t)[0]).join(', ');
    console.log(`  Tablas: ${tableNames.substring(0, 100)}...`);

    // Verificar datos iniciales
    const [users] = await connection.execute("SELECT COUNT(*) as count FROM usuarios");
    const [categories] = await connection.execute("SELECT COUNT(*) as count FROM categorias");
    
    console.log(`✓ Usuarios iniciales: ${users[0].count}`);
    console.log(`✓ Categorías iniciales: ${categories[0].count}`);

    await connection.end();
    console.log(`\n✅ Base de datos inicializada exitosamente!`);
    process.exit(0);
  } catch (error) {
    console.error('✗ Error al inicializar base de datos:', error.message);
    process.exit(1);
  }
}

initializeDatabase();

