// ─── Pemuatan Variabel Lingkungan (.env) ─────────────────────────────
// Semua konfigurasi sensitif (kredensial DB, port) diambil dari file .env
// supaya tidak di-hardcode di dalam kode sumber.
import dotenv from 'dotenv';

dotenv.config();

export const PORT = Number(process.env.PORT) || 4000;
export const NODE_ENV = process.env.NODE_ENV || 'development';

// Konfigurasi koneksi database — dipakai oleh mysql2 pool.
export const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'videobelajar',
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
};

// Daftar origin yang diizinkan untuk CORS.
export const corsOrigin = process.env.CORS_ORIGIN || '*';
