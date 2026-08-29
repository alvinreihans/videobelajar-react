// ─── Middleware Autentikasi (verifikasi JWT) ─────────────────────────
// Memeriksa token pada header `Authorization` di setiap permintaan ke
// endpoint yang dilindungi. Bila token valid, permintaan diteruskan
// (next()); bila tidak, dibalas 401 (autentikasi gagal).
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/env.js';
import ApiError from '../utils/ApiError.js';

// Ambil token dari header "Authorization: Bearer <token>" (atau token polos).
function extractToken(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7).trim();
  return header.trim();
}

export function verifyToken(req, res, next) {
  const token = extractToken(req);

  // 1. Tidak ada token → autentikasi gagal.
  if (!token) {
    return next(new ApiError(401, 'Autentikasi gagal: token tidak ditemukan'));
  }

  // 2. Verifikasi validitas token dengan secret yang sama seperti saat login.
  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded;            // identitas user tersedia di controller berikutnya
    return next();                 // token valid → lanjut
  } catch (err) {
    return next(new ApiError(401, 'Autentikasi gagal: token tidak valid'));
  }
}

export default { verifyToken };
