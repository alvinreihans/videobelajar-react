import { useState } from 'react';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { useCourses } from '../context/CoursesContext';
import { TABS } from '../data/courses';

export default function Home() {
  const { courses, loading, error } = useCourses();
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
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
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
        {loading ? (
          <div className="text-center py-16 text-text-dark-secondary text-md font-normal">
            Memuat kelas…
          </div>
        ) : error ? (
          <div className="text-center py-16 text-error text-md font-medium">
            Gagal memuat kelas: {error}
          </div>
        ) : filtered.length > 0 ? (
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
