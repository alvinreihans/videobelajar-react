// ─── Controller Autentikasi ──────────────────────────────────────────
// Lapisan HTTP untuk register / login / verifikasi email. Hanya membaca
// request & membentuk response JSON; logika bisnis ada di auth.service.
import asyncHandler from '../utils/asyncHandler.js';
import authService from '../services/auth.service.js';

// POST /api/auth/register  → daftar user baru
export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  res.status(201).json({
    success: true,
    message: 'Registrasi berhasil',
    data: user,
  });
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
