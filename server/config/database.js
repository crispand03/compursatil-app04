const mysql = require('mysql2/promise');
require('dotenv').config();

// Pool de conexiones a MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función auxiliar para ejecutar queries
async function query(sql, values) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute(sql, values);
    return results;
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  pool,
  query
};
