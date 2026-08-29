// ─── MOCK DATA AKUN ──────────────────────────────────────────────────────────
// Membangun daftar Pesanan & Kelas Saya (mock) dari data course yang ada di
// Redux, supaya halaman Akun punya konten realistis tanpa backend baru.
// Semua deterministik agar konsisten antar-render.

import { parsePrice, getCourseMeta } from './courseDetails';

function seeded(id, mod, offset = 0) {
  const n = Math.abs(Number(id) || String(id).length);
  return ((n * 9301 + 49297) % mod) + offset;
}

// Format angka → "Rp 300.000"
export function formatRupiah(value) {
  return 'Rp ' + Math.round(value).toLocaleString('id-ID');
}

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

function mockDate(id) {
  const day = seeded(id, 27) + 1;
  const month = seeded(id, 12);
  return `${day} ${MONTHS[month]} 2024, ${String(seeded(id, 12, 8)).padStart(2, '0')}.${String(seeded(id, 59)).padStart(2, '0')}`;
}

// ─── PESANAN ─────────────────────────────────────────────────────────────────
// Ambil sebagian course sebagai "pesanan" dengan status bervariasi.
export function getOrders(courses = []) {
  const statuses = ['paid', 'failed', 'pending', 'paid', 'paid'];
  return courses.slice(0, 5).map((c, i) => {
    const price = parsePrice(c.price);
    return {
      id: c.id,
      invoice: `HEL/VI/${String(seeded(c.id, 90000, 10000))}`,
      date: mockDate(c.id),
      status: statuses[i % statuses.length],
      course: c,
      price,
      total: price,
    };
  });
}

// ─── KELAS SAYA ──────────────────────────────────────────────────────────────
// Course yang "dibeli" + progres belajar (mock).
export function getEnrolledClasses(courses = []) {
  return courses.slice(0, 6).map((c, i) => {
    const totalModules = getCourseMeta(c).totalVideos > 30 ? 12 : 8;
    const done = [totalModules, totalModules, 6, 3, 9, 0][i % 6];
    const progress = Math.round((done / totalModules) * 100);
    return {
      id: c.id,
      course: c,
      totalModules,
      doneModules: done,
      progress,
      status: progress === 100 ? 'done' : progress === 0 ? 'not-started' : 'ongoing',
      totalMinutes: totalModules * 30,
    };
  });
}
