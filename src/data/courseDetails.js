// ─── MOCK DETAIL DATA ────────────────────────────────────────────────────────
// Data kelas dari API hanya berisi field ringkas (judul, harga, rating, dll).
// Modul ini MELENGKAPI-nya dengan konten detail (deskripsi, kurikulum, review,
// dsb) secara deterministik berdasarkan course, khusus untuk halaman
// Detail Produk & Semua Produk. Semua bersifat mock (frontend-only) dan bisa
// diganti data API sungguhan nanti.

export const HERO_SUBTITLE =
  'Belajar bersama tutor profesional di Video Course. Kapanpun, di manapun.';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sem dignissim mattis tristique elementum. Sit consequat turpis orci vel. Diam aenean mattis hac vitae, orci sed pretium pretium. Sit ut cursus adipiscing vestibulum, ac nibh. Viverra quis at quis suscipit. Fermentum duis duis porttitor amet diam sed ultrices condimentum dolor. Imperdiet dictum sapien porta faucibus viverra cum massa nec. Eget risus turpis viverra massa ullamcorper.';

// Ubah "Rp 300K" / "Rp 1.2jt" → angka rupiah (untuk filter & sort harga).
export function parsePrice(price) {
  if (typeof price === 'number') return price;
  if (!price) return 0;
  const cleaned = String(price).toLowerCase().replace(/rp|\s/g, '');
  const num = parseFloat(cleaned.replace(/[^0-9.,]/g, '').replace(',', '.'));
  if (Number.isNaN(num)) return 0;
  if (cleaned.includes('jt') || cleaned.includes('m')) return num * 1_000_000;
  if (cleaned.includes('k')) return num * 1_000;
  return num;
}

// Angka "acak" tapi stabil dari sebuah id (agar konten mock konsisten).
function seeded(id, mod, offset = 0) {
  const n = Math.abs(Number(id) || String(id).length);
  return ((n * 9301 + 49297) % mod) + offset;
}

// Meta ringan yang dipakai halaman katalog (filter durasi & harga).
export function getCourseMeta(course) {
  const durationHours = seeded(course.id, 6) + 1; // 1–6 jam
  const totalVideos = seeded(course.id, 40) + 12; // 12–51 video
  const totalDocs = seeded(course.id, 8) + 3; // 3–10 dokumen
  return {
    priceValue: parsePrice(course.price),
    originalValue: course.originalPrice ? parsePrice(course.originalPrice) : null,
    durationHours,
    totalVideos,
    totalDocs,
  };
}

// Ikon dipakai di blok "Kelas Ini Sudah Termasuk" (nama ikon inline di page).
function buildIncludes(meta) {
  return [
    { icon: 'exam', label: 'Ujian Akhir' },
    { icon: 'doc', label: `${meta.totalDocs} Dokumen` },
    { icon: 'edit', label: 'Pretest' },
    { icon: 'video', label: `${meta.totalVideos} Video` },
    { icon: 'chat', label: 'Diskusi' },
    { icon: 'certificate', label: 'Sertifikat' },
  ];
}

// Kurikulum: beberapa bab, tiap bab berisi daftar materi video.
function buildCurriculum(course, meta) {
  const lessonPool = [
    'The basics of user experience design',
    'Jobs in the field of user experience',
    'The product development life cycle',
    'Introduction to UX research',
    'Universal & inclusive design',
    'Wireframing dan prototyping',
    'Design thinking dalam praktik',
    'Membangun design system',
  ];
  const chapters = [
    'Introduction to Course: Foundations',
    'Universal, inclusive, & equity-focused design',
    'Introduction to UX research',
  ];
  return chapters.map((title, ci) => ({
    id: `${course.id}-ch${ci}`,
    title,
    lessons: Array.from({ length: 3 }).map((_, li) => ({
      title: lessonPool[(seeded(course.id, lessonPool.length, ci + li) + li) % lessonPool.length],
      duration: `${seeded(course.id, 8, li + 8)} Menit`,
    })),
  }));
}

// Review: beberapa alumni dengan rating & komentar.
function buildReviews(course) {
  const names = [
    'Gregorius Edrik Lawanto',
    'Ayu Kartika',
    'Rendra Wibowo',
    'Siti Nurhaliza',
  ];
  return names.slice(0, 3).map((name, i) => ({
    id: `${course.id}-rv${i}`,
    name,
    batch: `Alumni Batch ${seeded(course.id, 6, i + 1)}`,
    avatar: `avatar${((seeded(course.id, 8, i) % 8) + 1)}.svg`,
    rating: [4, 5, 4.5, 3.5][i % 4],
    text:
      'Materinya jelas dan aplikatif. Tutor sangat berpengalaman dan penjelasannya mudah diikuti bahkan untuk pemula. Sangat direkomendasikan!',
  }));
}

// Gabungan lengkap untuk halaman Detail Produk.
export function getCourseDetail(course) {
  if (!course) return null;
  const meta = getCourseMeta(course);
  return {
    ...course,
    ...meta,
    subtitle: HERO_SUBTITLE,
    language: 'Bahasa Indonesia',
    promoDays: seeded(course.id, 5) + 1,
    description: LOREM,
    tutorBio: `Berkarier di bidang ${course.jobTitle || 'profesional'} selama lebih dari 3 tahun. Saat ini bekerja sebagai ${course.jobTitle || 'Specialist'} di ${course.company || 'perusahaan ternama'}.`,
    includes: buildIncludes(meta),
    curriculum: buildCurriculum(course, meta),
    reviews: buildReviews(course),
  };
}
