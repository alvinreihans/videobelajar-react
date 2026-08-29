// ─── SEED DATA ─────────────────────────────────────────────────────────────
// Array of objects yang menjadi sumber data awal untuk fitur CRUD Kelas.

export const CATEGORIES = [
  { value: 'pemasaran', label: 'Pemasaran' },
  { value: 'desain', label: 'Desain' },
  { value: 'pengembangan-diri', label: 'Pengembangan Diri' },
  { value: 'bisnis', label: 'Bisnis' },
];

// Tab filter (dipakai bersama di Home & Kelola Kelas): "Semua" + semua kategori.
export const TABS = [{ value: 'semua', label: 'Semua Kelas' }, ...CATEGORIES];

export const IMAGE_OPTIONS = Array.from({ length: 9 }, (_, i) => ({
  value: `product-img${i + 1}.png`,
  label: `Gambar ${i + 1}`,
}));

export const AVATAR_OPTIONS = Array.from({ length: 8 }, (_, i) => ({
  value: `avatar${i + 1}.svg`,
  label: `Avatar ${i + 1}`,
}));

export const initialCourses = [
  {
    id: 1,
    title: 'Big 4 Auditor Financial Analyst',
    description:
      'Mulai transformasi dengan instruktur profesional, harga yang terjangkau, dan kurikulum terbaik.',
    instructor: 'Rina Saputra',
    jobTitle: 'Senior Accountant',
    company: 'Gojek',
    rating: 4.0,
    students: '86',
    price: 'Rp 300K',
    originalPrice: null,
    category: 'bisnis',
    image: 'product-img1.png',
    avatar: 'avatar1.svg',
  },
  {
    id: 2,
    title: 'Social Media Ads Mastery',
    description:
      'Optimalkan iklan di Facebook & Instagram untuk meningkatkan penjualan secara signifikan.',
    instructor: 'Kevin Tan',
    jobTitle: 'Digital Marketer',
    company: 'Shopee',
    rating: 4.0,
    students: '1.1k',
    price: 'Rp 250K',
    originalPrice: null,
    category: 'pemasaran',
    image: 'product-img2.png',
    avatar: 'avatar2.svg',
  },
  {
    id: 3,
    title: 'UI/UX Design Fundamentals',
    description:
      'Pelajari prinsip desain modern untuk menciptakan pengalaman pengguna yang luar biasa.',
    instructor: 'Jenna Ortega',
    jobTitle: 'Product Designer',
    company: 'Tokopedia',
    rating: 4.5,
    students: '2.4k',
    price: 'Rp 180K',
    originalPrice: 'Rp 300K',
    category: 'desain',
    image: 'product-img3.png',
    avatar: 'avatar3.svg',
  },
  {
    id: 4,
    title: 'Public Speaking Mastery',
    description:
      'Tingkatkan kepercayaan diri dan kemampuan berbicara di depan umum secara profesional.',
    instructor: 'Budi Santoso',
    jobTitle: 'Communication Coach',
    company: 'Traveloka',
    rating: 3.5,
    students: '900',
    price: 'Rp 150K',
    originalPrice: null,
    category: 'pengembangan-diri',
    image: 'product-img4.png',
    avatar: 'avatar4.svg',
  },
  {
    id: 5,
    title: 'Digital Marketing Strategy',
    description:
      'Kuasai strategi pemasaran digital yang efektif untuk mengembangkan bisnis di era modern.',
    instructor: 'Sari Dewi',
    jobTitle: 'Marketing Lead',
    company: 'Bukalapak',
    rating: 4.0,
    students: '3.2k',
    price: 'Rp 320K',
    originalPrice: 'Rp 500K',
    category: 'pemasaran',
    image: 'product-img5.png',
    avatar: 'avatar5.svg',
  },
  {
    id: 6,
    title: 'Business Development Essentials',
    description:
      'Pahami dasar-dasar pengembangan bisnis untuk membawa perusahaan ke level berikutnya.',
    instructor: 'Ahmad Fauzi',
    jobTitle: 'Business Analyst',
    company: 'Grab',
    rating: 3.5,
    students: '1.5k',
    price: 'Rp 200K',
    originalPrice: null,
    category: 'bisnis',
    image: 'product-img6.png',
    avatar: 'avatar6.svg',
  },
  {
    id: 7,
    title: 'Ilustrasi Digital dengan Procreate',
    description:
      'Ciptakan karya seni digital yang menakjubkan menggunakan Procreate dari nol.',
    instructor: 'Maya Putri',
    jobTitle: 'Illustrator',
    company: 'Kaskus',
    rating: 4.5,
    students: '780',
    price: 'Rp 175K',
    originalPrice: 'Rp 250K',
    category: 'desain',
    image: 'product-img7.png',
    avatar: 'avatar7.svg',
  },
  {
    id: 8,
    title: 'Mindfulness & Produktivitas',
    description:
      'Temukan keseimbangan hidup dan tingkatkan produktivitas dengan teknik mindfulness terbukti.',
    instructor: 'Hana Wijaya',
    jobTitle: 'Life Coach',
    company: 'Welltech',
    rating: 4.0,
    students: '2.1k',
    price: 'Rp 130K',
    originalPrice: null,
    category: 'pengembangan-diri',
    image: 'product-img8.png',
    avatar: 'avatar8.svg',
  },
  {
    id: 9,
    title: 'Advanced Excel for Business',
    description:
      'Pelajari teknik Excel tingkat lanjut untuk analisis data bisnis yang powerful dan efisien.',
    instructor: 'Doni Kusuma',
    jobTitle: 'Finance Analyst',
    company: 'Astra',
    rating: 3.5,
    students: '4.0k',
    price: 'Rp 100K',
    originalPrice: 'Rp 300K',
    category: 'bisnis',
    image: 'product-img9.png',
    avatar: 'avatar3.svg',
  },
];
