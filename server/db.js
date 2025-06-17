import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create pool
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// OPTIONAL: Ping MySQL to keep connection alive
const keepConnectionAlive = () => {
  setInterval(async () => {
    try {
      await db.query('SELECT 1');
      console.log('✅ MySQL keep-alive ping success');
    } catch (err) {
      console.error('❌ MySQL keep-alive ping failed:', err);
    }
  }, 300000);
};


keepConnectionAlive();
