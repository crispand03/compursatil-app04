const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function insertTestData() {
  try {
    // Crear conexión a la base de datos
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'compursatil',
      port: 3306
    });

    console.log('✓ Conectado a la base de datos compursatil');

    // Leer el archivo SQL
    const sqlFile = path.join(__dirname, '../database/seed-data.sql');
    let sql = fs.readFileSync(sqlFile, 'utf8');

    // Separar las queries por ; y filtrar las vacías
    const queries = sql.split(';').filter(q => q.trim().length > 0);

    console.log(`Ejecutando ${queries.length} queries...`);
    
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i].trim();
      if (query.length > 0) {
        try {
          await connection.query(query);
          console.log(`✓ Query ${i + 1}/${queries.length} ejecutada`);
        } catch (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            console.log(`⚠ Query ${i + 1}/${queries.length} - Registro duplicado (ignorado)`);
          } else {
            console.warn(`✗ Query ${i + 1}/${queries.length} - Error:`, err.message.substring(0, 100));
          }
        }
      }
    }

    // Verificar datos insertados
    const [inventario] = await connection.execute("SELECT COUNT(*) as count FROM inventario");
    const [ventas] = await connection.execute("SELECT COUNT(*) as count FROM ventas");
    const [envios] = await connection.execute("SELECT COUNT(*) as count FROM envios");
    const [soporte] = await connection.execute("SELECT COUNT(*) as count FROM soporte_tecnico");
    const [garantias] = await connection.execute("SELECT COUNT(*) as count FROM garantias");
    const [clientes] = await connection.execute("SELECT COUNT(*) as count FROM clientes");

    console.log('\n✅ Datos de prueba insertados:');
    console.log(`   Inventario: ${inventario[0].count} productos`);
    console.log(`   Clientes: ${clientes[0].count} clientes`);
    console.log(`   Ventas: ${ventas[0].count} ventas`);
    console.log(`   Garantías: ${garantias[0].count} garantías`);
    console.log(`   Envíos: ${envios[0].count} envíos`);
    console.log(`   Soporte Técnico: ${soporte[0].count} casos`);

    await connection.end();
    console.log('\n✅ Base de datos actualizada exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

insertTestData();
