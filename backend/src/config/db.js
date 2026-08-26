// ─── Koneksi Database (Connection Pool) ──────────────────────────────
// LANGKAH PERTAMA misi: "Connecting to Database".
// Kita memakai library `mysql2` (driver MySQL untuk Node.js) dan membuat
// sebuah connection pool. Pool menyimpan sekumpulan koneksi yang bisa
// dipakai ulang, jauh lebih efisien daripada membuka-tutup koneksi tiap query.
import mysql from 'mysql2/promise';
import { dbConfig } from './env.js';

const pool = mysql.createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: dbConfig.connectionLimit,
  queueLimit: 0,
  charset: 'utf8mb4',
  // Kembalikan TIMESTAMP/DATETIME sebagai string apa adanya (tanpa konversi zona
  // waktu otomatis) supaya response JSON konsisten & mudah dibaca.
  dateStrings: true,
});

/**
 * Helper query terpusat.
 * Semua service memanggil fungsi ini agar cara mengeksekusi SQL seragam.
 * Parameter selalu di-bind lewat tanda `?` (prepared statement) untuk
 * mencegah SQL Injection.
 *
 * @param {string} sql   Perintah SQL dengan placeholder `?`
 * @param {Array}  params Nilai yang menggantikan placeholder
 * @returns {Promise<Array>} baris hasil query
 */
export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

/**
 * Cek koneksi database saat server dinyalakan. Melempar error bila gagal
 * supaya masalah konfigurasi ketahuan lebih awal.
 */
export async function assertDatabaseConnection() {
  const conn = await pool.getConnection();
  try {
    await conn.query('SELECT 1');
  } finally {
    conn.release();
  }
}

export default pool;
