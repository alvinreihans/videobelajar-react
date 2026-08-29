// ─── Pemuatan Variabel Lingkungan (.env) ─────────────────────────────
// Semua konfigurasi sensitif (kredensial DB, JWT, email, port) diambil dari
// file .env supaya tidak di-hardcode di dalam kode sumber.
import dotenv from 'dotenv';

dotenv.config();

export const PORT = Number(process.env.PORT) || 4000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

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

// ─── Konfigurasi Autentikasi (JWT) ───────────────────────────────────
export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'dev-secret-change-me',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
};

// ─── Konfigurasi Email (nodemailer) ──────────────────────────────────
// Bila MAIL_HOST kosong, service email akan otomatis memakai akun uji
// Ethereal (email tidak benar-benar terkirim, hanya menghasilkan preview URL).
export const mailConfig = {
  host: process.env.MAIL_HOST || '',
  port: Number(process.env.MAIL_PORT) || 587,
  secure: String(process.env.MAIL_SECURE).toLowerCase() === 'true',
  user: process.env.MAIL_USER || '',
  pass: process.env.MAIL_PASS || '',
  from: process.env.MAIL_FROM || 'Video Belajar <no-reply@videobelajar.test>',
};

// ─── Konfigurasi Upload (multer) ─────────────────────────────────────
export const uploadConfig = {
  dir: process.env.UPLOAD_DIR || 'uploads',
  maxSize: Number(process.env.UPLOAD_MAX_SIZE) || 2 * 1024 * 1024,
};
