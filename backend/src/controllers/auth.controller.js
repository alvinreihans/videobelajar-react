// ─── Controller Autentikasi ──────────────────────────────────────────
// Lapisan HTTP untuk register / login / verifikasi email. Hanya membaca
// request & membentuk response JSON; logika bisnis ada di auth.service.
import asyncHandler from '../utils/asyncHandler.js';
import authService from '../services/auth.service.js';

// POST /api/auth/register  → daftar user baru
export const register = asyncHandler(async (req, res) => {
  const { user, emailPreviewUrl } = await authService.register(req.body);
  res.status(201).json({
    success: true,
    message: 'Registrasi berhasil. Silakan cek email untuk verifikasi.',
    data: user,
    ...(emailPreviewUrl ? { emailPreviewUrl } : {}),
  });
});

// GET /api/auth/verify-email?token=...  → verifikasi email via token
export const verifyEmail = asyncHandler(async (req, res) => {
  const result = await authService.verifyEmail(req.query.token);
  res.json({ success: true, message: result.message });
});

// POST /api/auth/login  → login & dapatkan token JWT
export const login = asyncHandler(async (req, res) => {
  const { token, user } = await authService.login(req.body);
  res.json({
    success: true,
    message: 'Login berhasil',
    token,
    data: user,
  });
});
