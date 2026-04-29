import { useState } from 'react';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const TABS = [
  { id: 'semua', label: 'Semua Kelas' },
  { id: 'pemasaran', label: 'Pemasaran' },
  { id: 'desain', label: 'Desain' },
  { id: 'pengembangan-diri', label: 'Pengembangan Diri' },
  { id: 'bisnis', label: 'Bisnis' },
];

const courses = [
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

export default function Home() {
  const [activeTab, setActiveTab] = useState('semua');
  const [email, setEmail] = useState('');

  const filtered =
    activeTab === 'semua'
      ? courses
      : courses.filter((c) => c.category === activeTab);

  return (
    <div className="flex flex-col items-center gap-16 px-4 md:px-8 lg:px-[120px] py-16">
      {/* HERO */}
      <div
        className="
    w-full rounded-[10px]
    flex flex-col items-center justify-center text-center
    px-5 py-16
    md:px-16 md:py-20
    gap-6
  "
        style={{
          minHeight: '400px',
          background:
            'linear-gradient(0deg, rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(hero-bg.png) center/cover no-repeat',
        }}>
        <div className="flex flex-col items-center gap-3 w-full max-w-[280px] md:max-w-[720px]">
          {/* TITLE */}
          <h1 className="text-text-light-primary text-h1 font-bold">
            Revolusi Pembelajaran: Temukan Ilmu Baru melalui Platform Video
            Interaktif!
          </h1>

          {/* DESC */}
          <p className="text-text-light-primary text-xl font-medium leading-[140%] tracking-[0.2px]">
            Temukan ilmu baru yang menarik dan mendalam melalui koleksi video
            pembelajaran berkualitas tinggi. Tidak hanya itu, Anda juga dapat
            berpartisipasi dalam latihan interaktif yang akan meningkatkan
            pemahaman Anda.
          </p>
        </div>

        {/* BUTTON */}
        <Link to="/products">
          <Button
            color="primary"
            variant="contained"
            className="
      w-full max-w-[280px]
      md:w-auto md:max-w-none
      rounded-[10px]
      text-md
    ">
            Temukan Video Course untuk Dipelajari!
          </Button>
        </Link>
      </div>

      {/* CARD SECTION */}
      <div className="w-full flex flex-col gap-8">
        <div className="flex flex-col gap-2.5">
          <h2 className="text-text-dark-primary text-h3 font-bold">
            Koleksi Video Pembelajaran Unggulan
          </h2>
          <p className="text-text-dark-secondary text-md font-medium leading-[140%] tracking-[0.2px]">
            Jelajahi Dunia Pengetahuan Melalui Pilihan Kami!
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-start overflow-x-auto border-b border-border">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-start shrink-0 pr-9">
                <span
                  className={`py-3 text-md font-medium leading-[140%] tracking-[0.2px] transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-tertiary'
                      : 'text-text-dark-secondary hover:text-text-dark-primary'
                  }`}>
                  {tab.label}
                </span>
                <div
                  className={`h-[6px] rounded-[10px] transition-all duration-200 bg-tertiary ${
                    isActive ? 'w-[52px]' : 'w-0'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <ProductCard key={course.id} {...course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-text-dark-secondary text-md font-normal">
            Belum ada kelas untuk kategori ini.
          </div>
        )}
      </div>

      {/* NEWSLETTER */}
      <div
        className="
    w-full rounded-[4px] flex justify-center
    px-5 py-10
    md:px-8 md:py-20
  "
        style={{
          background:
            'linear-gradient(0deg, rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(newsletter-bg.png) center/cover no-repeat',
          boxShadow: '0px 12px 45px -10px rgba(0, 59, 222, 0.2)',
        }}>
        <div className="flex flex-col items-center gap-8 md:gap-10 w-full max-w-[525px]">
          {/* TEXT */}
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-text-light-secondary text-md font-semibold tracking-[0.2px]">
              NEWSLETTER
            </span>

            <div className="flex flex-col items-center gap-2 md:gap-2.5">
              <h2 className="text-text-light-primary text-h3 font-bold leading-[110%]">
                Mau Belajar Lebih Banyak?
              </h2>

              <p className="text-text-light-primary text-md font-medium leading-[140%] tracking-[0.2px] opacity-90 max-w-[280px] md:max-w-none">
                Daftarkan dirimu untuk mendapatkan informasi terbaru dan
                penawaran spesial dari program-program terbaik hariesok.id
              </p>
            </div>
          </div>

          {/* FORM */}
          <div className="w-full flex flex-col gap-4">
            {/* INPUT */}
            <div
              className="
        flex items-center
        bg-background-primary
        rounded-[10px]
        px-4 py-2
        md:px-8
      ">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan Emailmu"
                className="
            w-full outline-none bg-transparent
            text-md
            text-text-dark-secondary
            tracking-[0.2px]
          "
              />
            </div>

            {/* BUTTON */}
            <Button
              color="secondary"
              variant="contained"
              className="
          w-full
          rounded-[10px]
          text-md
        ">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
