// ─── Service Autentikasi ─────────────────────────────────────────────
// Berisi logika REGISTER (bcrypt), LOGIN (JWT), dan verifikasi email.
// Memanfaatkan kembali service `users` (dari registry) untuk operasi DB,
// sehingga query INSERT/SELECT tetap konsisten dengan resource lain.
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import { v4 as uuidv4 } from 'uuid';
import { jwtConfig } from '../config/env.js';
import { services } from './index.js';
import { sendVerificationEmail } from './mail.service.js';

const users = services.users;
const SALT_ROUNDS = 10;

// Buang password_hash (& token) sebelum data user dikirim sebagai response.
function sanitize(user) {
  if (!user) return user;
  const { password_hash, verification_token, ...safe } = user;
  return safe;
}

// Bentuk kandidat username dari bagian lokal email (sebelum '@').
function usernameFromEmail(email) {
  const base = String(email)
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, '');
  return base || 'user';
}

// Pastikan username unik. Bila `strict` true (user mengirim username sendiri)
// dan sudah dipakai → error. Bila false (auto-generate) → tambahkan sufiks angka.
async function ensureUniqueUsername(base, strict) {
  const taken = async (u) => (await users.getBy('username', u)).length > 0;
  if (!(await taken(base))) return base;
  if (strict) throw new ApiError(409, `Username '${base}' sudah dipakai`);
  for (let i = 1; i <= 1000; i += 1) {
    const candidate = `${base}${i}`;
    if (!(await taken(candidate))) return candidate;
  }
  return `${base}${Date.now()}`;
}

// ── REGISTER ─────────────────────────────────────────────────────────
async function register(payload = {}) {
  // Terima beberapa variasi nama field agar cocok dengan form frontend
  // (name / fullname / full_name) maupun contoh payload mission.
  const full_name = payload.fullname ?? payload.full_name ?? payload.name;
  const email = payload.email;
  const password = payload.password;
  const phone = payload.phone ?? null;

  if (!full_name || !email || !password) {
    throw new ApiError(400, 'Field fullname, email, dan password wajib diisi');
  }

  // Email harus unik.
  const existing = await users.getBy('email', email);
  if (existing.length > 0) {
    throw new ApiError(409, 'Email sudah terdaftar');
  }

  // Username: pakai kiriman user, atau auto-generate dari email.
  const providedUsername =
    typeof payload.username === 'string' && payload.username.trim() !== '';
  const usernameBase = providedUsername
    ? payload.username.trim()
    : usernameFromEmail(email);
  const username = await ensureUniqueUsername(usernameBase, providedUsername);

  // Enkripsi password SEBELUM disimpan (tidak pernah simpan password mentah).
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  // Token verifikasi email (uuid) disimpan bersama user; is_verified default 0.
  const verification_token = uuidv4();
  const created = await users.create({
    full_name,
    username,
    email,
    password_hash,
    phone,
    is_verified: 0,
    verification_token,
  });

  // Kirim email verifikasi (best-effort: kegagalan email tidak membatalkan
  // registrasi, hanya dicatat di log).
  let emailPreviewUrl = null;
  try {
    const info = await sendVerificationEmail(email, verification_token);
    emailPreviewUrl = info.previewUrl;
  } catch (err) {
    console.error('[mail] Gagal mengirim email verifikasi:', err.message);
  }

  return { user: sanitize(created), emailPreviewUrl };
}

// ── LOGIN ──────────────────────────────────────────────────
async function login(payload = {}) {
  const { email, password } = payload;
  if (!email || !password) {
    throw new ApiError(400, 'Email dan password wajib diisi');
  }

  const rows = await users.getBy('email', email);
  const user = rows[0];

  // Pesan sengaja disamakan untuk user tidak ada / password salah,
  // supaya tidak membocorkan email mana yang terdaftar.
  if (!user) {
    throw new ApiError(401, 'Email atau password salah');
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw new ApiError(401, 'Email atau password salah');
  }

  // Buat token JWT berisi identitas ringkas (jangan taruh data sensitif).
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  return { token, user: sanitize(user) };
}

// ── VERIFIKASI EMAIL ─────────────────────────────────────────
async function verifyEmail(token) {
  if (!token) {
    throw new ApiError(400, 'Invalid Verification Token');
  }
  const rows = await users.getBy('verification_token', token);
  const user = rows[0];
  if (!user) {
    throw new ApiError(400, 'Invalid Verification Token');
  }
  // Tandai terverifikasi & hapus token agar tidak bisa dipakai ulang.
  await users.update(user.id, { is_verified: 1, verification_token: null });
  return { message: 'Email Verified Successfully' };
}

export default { register, login, verifyEmail, sanitize };
