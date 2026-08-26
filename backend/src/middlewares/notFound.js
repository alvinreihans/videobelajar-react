// ─── Middleware 404 ──────────────────────────────────────────────────
// Dipanggil bila tidak ada route yang cocok dengan URL request.
import ApiError from '../utils/ApiError.js';

export default function notFound(req, res, next) {
  next(new ApiError(404, `Endpoint tidak ditemukan: ${req.method} ${req.originalUrl}`));
}
