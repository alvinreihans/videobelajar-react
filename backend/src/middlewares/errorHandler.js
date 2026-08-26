// ─── Middleware Penanganan Error Terpusat ────────────────────────────
// Semua error (dari controller, service, maupun database) berakhir di sini
// dan diubah menjadi response JSON yang seragam. Error MySQL yang umum
// diterjemahkan ke HTTP status yang sesuai agar pesan lebih ramah.
import { NODE_ENV } from '../config/env.js';

// Peta kode error MySQL → { status, message }
function mapMysqlError(err) {
  switch (err.code) {
    case 'ER_DUP_ENTRY':
      return { status: 409, message: 'Data sudah ada (nilai unik terduplikasi)' };
    case 'ER_NO_REFERENCED_ROW':
    case 'ER_NO_REFERENCED_ROW_2':
      return { status: 400, message: 'Referensi foreign key tidak valid (data induk tidak ada)' };
    case 'ER_ROW_IS_REFERENCED':
    case 'ER_ROW_IS_REFERENCED_2':
      return { status: 409, message: 'Data tidak bisa dihapus karena masih dipakai tabel lain' };
    case 'ER_BAD_NULL_ERROR':
    case 'ER_NO_DEFAULT_FOR_FIELD':
      return { status: 400, message: 'Ada kolom wajib yang belum diisi' };
    case 'ER_BAD_FIELD_ERROR':
      return { status: 400, message: 'Ada nama kolom yang tidak dikenal' };
    case 'ER_DATA_TOO_LONG':
      return { status: 400, message: 'Nilai terlalu panjang untuk kolomnya' };
    case 'WARN_DATA_TRUNCATED':
      return { status: 400, message: 'Nilai tidak sesuai dengan tipe kolom (mis. nilai ENUM salah)' };
    default:
      return null;
  }
}

// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Terjadi kesalahan pada server';
  let details = err.details;

  // Terjemahkan error khas MySQL bila ada (kode error MySQL berupa string,
  // mis. 'ER_DUP_ENTRY' atau 'WARN_DATA_TRUNCATED').
  if (err.code && typeof err.code === 'string') {
    const mapped = mapMysqlError(err);
    if (mapped) {
      statusCode = mapped.status;
      message = mapped.message;
      details = NODE_ENV === 'development' ? err.sqlMessage : undefined;
    }
  }

  if (statusCode >= 500) {
    console.error('[ERROR]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(NODE_ENV === 'development' && statusCode >= 500 ? { stack: err.stack } : {}),
  });
}
