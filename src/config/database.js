import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3307),
  user: process.env.DB_USER ?? process.env.MYSQL_USER ?? 'usuario',
  password: process.env.DB_PASSWORD ?? process.env.MYSQL_PASSWORD ?? 'tecnica123',
  database: process.env.DB_NAME ?? process.env.MYSQL_DATABASE ?? 'tecnica',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_SIZE ?? 10),
  queueLimit: 0,
  dateStrings: true
});

export async function checkDatabase() {
  await pool.query('SELECT 1');
}

export default pool;
