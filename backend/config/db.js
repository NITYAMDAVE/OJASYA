const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,   // ✅ FIXED (consistent name)
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+05:30'
});

// 🔹 Test connection
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
