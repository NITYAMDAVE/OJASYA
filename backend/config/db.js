const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  uri: process.env.MYSQL_PUBLIC_URL,   // ✅ use full URL
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Connected to Railway MySQL');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL Connection Error:', err.message);
  }
})();

module.exports = pool;
