// ─── MOCK DATA BELAJAR ───────────────────────────────────────────────────────
// Struktur modul (video, rangkuman, kuis) & soal kuis untuk pengalaman belajar
// di /learn/:id. Semua mock & deterministik.

import { getCourseDetail } from './courseDetails';

function seeded(id, mod, offset = 0) {
  const n = Math.abs(Number(id) || String(id).length);
  return ((n * 9301 + 49297) % mod) + offset;
}

// Bangun daftar grup modul dari kurikulum course.
// Tiap grup: { title, items: [{type:'video'|'summary'|'quiz', ...}] }
export function getModuleGroups(course) {
  const detail = getCourseDetail(course);
  return detail.curriculum.map((chapter, ci) => {
    const items = [];
    // Pre-Test di awal bab pertama (sesuai mockup Aturan).
    if (ci === 0) {
      items.push({ id: `${ci}-pretest`, type: 'quiz', title: `Pre-Test: ${chapter.title}`, duration: '10 Soal' });
    }
    chapter.lessons.forEach((lesson, li) => items.push({
      id: `${ci}-v${li}`,
      type: 'video',
      title: lesson.title,
      duration: lesson.duration,
    }));
    items.push({
      id: `${ci}-sum`,
      type: 'summary',
      title: `Rangkuman: ${chapter.title}`,
      duration: '5 Menit',
    });
    items.push({
      id: `${ci}-quiz`,
      type: 'quiz',
      title: `Quiz: ${chapter.title}`,
      duration: '10 Soal',
    });
    return { id: `g${ci}`, title: chapter.title, items };
  });
}

// Ratakan grup jadi satu urutan linear (untuk navigasi Sebelumnya/Selanjutnya).
export function getFlatLessons(course) {
  const groups = getModuleGroups(course);
  const flat = [];
  groups.forEach((g) => {
    g.items.forEach((it) => flat.push({ ...it, groupId: g.id, groupTitle: g.title }));
  });
  return flat;
}

// ─── SOAL KUIS ───────────────────────────────────────────────────────────────
const QUESTION_BANK = [
  {
    q: 'Memikirkan dan mengantisipasi secara teliti adanya user yang secara tidak sengaja mengutak-atik produk disebut?',
    options: [
      'Memikirkan tentang default',
      'Mendesain untuk error',
      'Menyediakan feedback',
      'Konsistensi antarmuka',
    ],
    answer: 1,
  },
  {
    q: 'Proses membuat kerangka low-fidelity dari sebuah antarmuka disebut?',
    options: ['Prototyping', 'Wireframing', 'User testing', 'Benchmarking'],
    answer: 1,
  },
  {
    q: 'Prinsip desain yang memastikan produk dapat digunakan semua orang termasuk penyandang disabilitas?',
    options: ['Aesthetic design', 'Accessibility', 'Minimalism', 'Skeuomorphism'],
    answer: 1,
  },
  {
    q: 'Metode riset untuk memahami kebutuhan pengguna lewat wawancara langsung disebut?',
    options: ['A/B testing', 'Analytics', 'User interview', 'Heatmap'],
    answer: 2,
  },
  {
    q: 'Dokumen yang merepresentasikan pengguna ideal berdasarkan riset disebut?',
    options: ['User persona', 'Sitemap', 'Style guide', 'Journey log'],
    answer: 0,
  },
  {
    q: 'Tahapan design thinking yang benar adalah?',
    options: [
      'Empathize → Define → Ideate → Prototype → Test',
      'Test → Ideate → Define → Empathize → Prototype',
      'Define → Test → Empathize → Ideate → Prototype',
      'Ideate → Empathize → Test → Define → Prototype',
    ],
    answer: 0,
  },
  {
    q: 'Kumpulan komponen UI yang konsisten dan dapat dipakai ulang disebut?',
    options: ['Moodboard', 'Design system', 'Wireframe kit', 'Grid layout'],
    answer: 1,
  },
  {
    q: 'Warna, tipografi, dan spacing termasuk dalam elemen?',
    options: ['Riset', 'Visual design', 'Copywriting', 'Deployment'],
    answer: 1,
  },
  {
    q: 'Feedback visual saat tombol ditekan bertujuan untuk?',
    options: [
      'Memperindah tampilan saja',
      'Memberi kepastian aksi pengguna diterima',
      'Menambah waktu muat',
      'Mengurangi aksesibilitas',
    ],
    answer: 1,
  },
  {
    q: 'Prinsip "jangan membuat pengguna berpikir" dipopulerkan oleh?',
    options: ['Don Norman', 'Steve Krug', 'Jakob Nielsen', 'Dieter Rams'],
    answer: 1,
  },
];

export function getQuiz(course, count = 10) {
  const start = seeded(course.id, QUESTION_BANK.length);
  const questions = [];
  for (let i = 0; i < count; i++) {
    questions.push(QUESTION_BANK[(start + i) % QUESTION_BANK.length]);
  }
  return questions;
}
