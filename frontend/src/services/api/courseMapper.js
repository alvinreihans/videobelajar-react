// ─── Adapter Bentuk Data Course ──────────────────────────────────────────────
// Backend (Express + MySQL) memakai snake_case sesuai kolom database, sedangkan
// komponen UI (ProductCard, CourseFormModal) memakai bentuk camelCase warisan
// data mock. Modul ini menjadi SATU-SATUNYA tempat penerjemahan dua arah,
// supaya backend tetap murni REST dan komponen tidak perlu tahu bentuk DB.
import { parsePrice } from '../../data/courseDetails';

// ─── HARGA ───────────────────────────────────────────────────────────────────
// Angka rupiah → string ringkas ala katalog: 300000 → "Rp 300K", 1200000 → "Rp 1.2jt".
// Format ini WAJIB bisa dibaca balik oleh parsePrice() di data/courseDetails.js,
// karena filter & sort harga di halaman Semua Kelas mem-parse string ini.
export function formatRupiah(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  if (Number.isNaN(n)) return null;

  // Buang angka nol di belakang koma: 1.50 → "1.5", 2.00 → "2".
  const trim = (num) => String(Number(num.toFixed(1)));

  if (n >= 1_000_000) return `Rp ${trim(n / 1_000_000)}jt`;
  if (n >= 1_000) return `Rp ${trim(n / 1_000)}K`;
  return `Rp ${n}`;
}

// ─── API → UI ────────────────────────────────────────────────────────────────
// Satu baris dari GET /public/courses (hasil JOIN courses+categories+tutors)
// diubah menjadi props yang dipakai ProductCard.
export function toCard(row) {
  if (!row) return row;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    instructor: row.tutor_name,
    jobTitle: row.tutor_job_title,
    company: row.tutor_company,
    avatar: row.tutor_avatar,
    rating: Number(row.rating) || 0,
    students: String(row.students_count ?? 0),
    price: formatRupiah(row.price),
    originalPrice: formatRupiah(row.original_price),
    category: row.category_slug,
    image: row.image,
    // Disimpan diam-diam supaya form Kelola Kelas tahu baris tutor/kategori
    // mana yang harus diperbarui saat mengedit kelas ini.
    categoryId: row.category_id,
    tutorId: row.tutor_id,
  };
}

// ─── UI → API ────────────────────────────────────────────────────────────────
// Field profil tutor (instructor/jobTitle/company/avatar) TIDAK ikut di sini
// karena miliknya tabel `tutors`, bukan `courses` — pemisahannya ditangani
// courseService lewat toTutorPayload().
export function toApi(form = {}) {
  const payload = {
    title: form.title,
    description: form.description,
    price: parsePrice(form.price),
    original_price: form.originalPrice ? parsePrice(form.originalPrice) : null,
    rating: Number(form.rating) || 0,
    students_count: parseInt(String(form.students).replace(/\D/g, ''), 10) || 0,
    image: form.image,
    // Kelas yang dibuat lewat UI langsung tayang, bukan draft (default DB),
    // supaya pengunjung publik bisa langsung melihatnya.
    status: 'published',
  };
  if (form.title) payload.slug = slugify(form.title);
  return payload;
}

// Data profil tutor yang dikirim ke resource /tutors.
export function toTutorPayload(form = {}) {
  return {
    name: form.instructor,
    job_title: form.jobTitle || null,
    company: form.company || null,
    avatar: form.avatar || null,
  };
}

// "UI/UX Design Fundamentals" → "ui-ux-design-fundamentals"
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 170);
}
