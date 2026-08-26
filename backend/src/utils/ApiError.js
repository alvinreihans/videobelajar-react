// ─── Kelas Error Kustom ──────────────────────────────────────────────
// Membungkus HTTP status code bersama pesan error, sehingga controller
// bisa `throw new ApiError(404, 'Data tidak ditemukan')` dan middleware
// error mengubahnya menjadi response JSON yang rapi.
export default class ApiError extends Error {
  constructor(statusCode, message, details = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
