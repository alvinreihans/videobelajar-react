// ─── Penyelesai URL Aset ─────────────────────────────────────────────────────
// Nilai `avatar` / `image` bisa datang dalam tiga bentuk:
//   1. 'avatar1.svg'                 → berkas bawaan di folder public/
//   2. 'uploads/foto-123.png'        → hasil unggahan, dilayani backend
//   3. 'http://…/uploads/foto.png'   → URL penuh (data lama sebelum ada aturan ini)
// Fungsi ini menyeragamkan ketiganya menjadi src yang siap dipakai <img>.

// Backend melayani berkas unggahan di /uploads, satu tingkat di luar prefiks
// /api — jadi origin-nya diambil dengan membuang '/api' dari base URL.
const API_ORIGIN = String(import.meta.env.VITE_API_BASE_URL || '').replace(/\/api\/?$/, '');

// Awalan yang dipakai saat menyimpan hasil unggahan ke kolom `avatar`.
// Disimpan relatif (bukan URL penuh) supaya data tidak ikut basi kalau host
// backend berubah, dan tetap muat di VARCHAR(100).
export const UPLOAD_PREFIX = 'uploads/';

export function resolveAsset(value, fallback = null) {
  if (!value) return fallback;
  if (/^(https?:)?\/\//.test(value)) return value;
  if (value.startsWith(UPLOAD_PREFIX)) return `${API_ORIGIN}/${value}`;
  return value.startsWith('/') ? value : `/${value}`;
}

// Khusus foto profil — punya gambar cadangan sendiri bila pengguna belum punya.
export const resolveAvatar = (value) => resolveAsset(value, '/avatar-user.svg');
