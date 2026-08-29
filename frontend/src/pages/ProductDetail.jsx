import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../components/ui/Button';
import Breadcrumb from '../components/ui/Breadcrumb';
import StarRating from '../components/ui/StarRating';
import ProductCard from '../components/ui/ProductCard';
import { getCourseDetail } from '../data/courseDetails';
import { CATEGORIES } from '../data/courses';

// ─── IKON INLINE ─────────────────────────────────────────────────────────────
function IncludeIcon({ name, size = 18 }) {
  const common = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  const paths = {
    exam: (<><path d="M9 3h6l1 3H8l1-3Z" /><rect x="4" y="6" width="16" height="15" rx="2" /><path d="M9 13l2 2 4-4" /></>),
    doc: (<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M8 13h8M8 17h5" /></>),
    edit: (<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" /></>),
    video: (<><rect x="3" y="6" width="12" height="12" rx="2" /><path d="M15 10l6-3v10l-6-3" /></>),
    certificate: (<><circle cx="12" cy="9" r="5" /><path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5" /></>),
    world: (<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" /></>),
  };
  return <svg {...common}>{paths[name] || paths.doc}</svg>;
}
function PlayIcon() {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" /><path d="M10 8.5v7l5-3.5-5-3.5Z" fill="currentColor" /></svg>);
}
function ClockIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>);
}
function ChevronIcon({ open }) {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>);
}

// ─── KURIKULUM ───────────────────────────────────────────────────────────────
function CurriculumItem({ chapter, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="flex flex-col">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 py-3 text-left">
        <span className="font-bold text-primary font-sans">{chapter.title}</span>
        <span className="text-primary shrink-0"><ChevronIcon open={open} /></span>
      </button>
      {open && (
        <div className="flex flex-col gap-3 pb-2">
          {chapter.lessons.map((lesson, i) => (
            <div key={i} className="flex items-center justify-between gap-3 border border-border rounded-[10px] px-4 py-3">
              <span className="text-md text-text-dark-primary font-sans truncate">{lesson.title}</span>
              <div className="flex items-center gap-4 shrink-0 text-text-dark-secondary">
                <span className="flex items-center gap-1.5 text-sm"><PlayIcon /> Video</span>
                <span className="flex items-center gap-1.5 text-sm"><ClockIcon /> {lesson.duration}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Kartu putih pembungkus tiap section.
function Card({ title, children }) {
  return (
    <section className="border border-border rounded-[12px] bg-background-primary p-5 md:p-6 flex flex-col gap-4">
      {title && <h2 className="text-h6 md:text-h5 font-bold text-text-dark-primary">{title}</h2>}
      {children}
    </section>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: courses, loading } = useSelector((state) => state.courses);
  const course = courses.find((c) => String(c.id) === String(id));

  if (loading && !course) {
    return <div className="text-center py-24 text-text-dark-secondary text-md font-medium">Memuat kelas…</div>;
  }
  if (!course) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-24 px-4">
        <h1 className="text-h4 font-bold text-text-dark-primary">Kelas tidak ditemukan</h1>
        <p className="text-md text-text-dark-secondary">Kelas yang kamu cari tidak tersedia atau sudah dihapus.</p>
        <Link to="/products"><Button variant="contained">Lihat Semua Kelas</Button></Link>
      </div>
    );
  }

  const detail = getCourseDetail(course);
  const related = courses.filter((c) => c.id !== course.id).slice(0, 3);
  const categoryLabel = CATEGORIES.find((c) => c.value === course.category)?.label || 'Kelas';
  const discount = detail.originalValue
    ? Math.round((1 - detail.priceValue / detail.originalValue) * 100)
    : 0;

  const includes = [
    { icon: 'exam', label: 'Ujian Akhir' },
    { icon: 'video', label: `${detail.totalVideos} Video` },
    { icon: 'doc', label: `${detail.totalDocs} Dokumen` },
    { icon: 'certificate', label: 'Sertifikat' },
    { icon: 'edit', label: 'Pretest' },
  ];

  return (
    <div className="px-4 md:px-8 lg:px-[120px] py-6 md:py-8 flex flex-col gap-6">
      {/* BREADCRUMB (light bg, di atas hero) */}
      <Breadcrumb
        items={[
          { label: 'Beranda', to: '/' },
          { label: categoryLabel, to: '/products' },
          { label: course.title },
        ]}
      />

      {/* HERO (rounded inset dark banner) */}
      <div
        className="rounded-[16px] overflow-hidden"
        style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.78), rgba(0,0,0,0.78)), url(/hero-bg.png) center/cover no-repeat' }}>
        <div className="px-6 md:px-12 py-12 md:py-16 flex flex-col gap-4 max-w-[640px]">
          <h1 className="text-h4 md:text-h2 font-bold text-text-light-primary leading-[115%]">
            {course.title}
          </h1>
          <p className="text-md md:text-xl text-text-light-primary/85 font-medium leading-[140%]">
            {detail.subtitle}
          </p>
          <div className="flex items-center gap-2">
            <StarRating rating={course.rating} size={18} />
            <span className="text-sm text-secondary font-semibold underline">{course.rating} ({course.students})</span>
          </div>
        </div>
      </div>

      {/* BODY: main + sidebar (sidebar tampil dulu di mobile) */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* MAIN */}
        <div className="order-2 lg:order-1 flex-1 min-w-0 flex flex-col gap-6">
          <Card title="Deskripsi">
            <p className="text-md text-text-dark-secondary leading-[165%] font-sans whitespace-pre-line">
              {detail.description}
            </p>
          </Card>

          <Card title="Belajar bersama Tutor Profesional">
            <div className="flex items-start gap-4">
              <img src={`/${course.avatar}`} alt={course.instructor} className="w-12 h-12 rounded-[10px] object-cover shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="font-bold text-text-dark-primary">{course.instructor}</span>
                <span className="text-sm text-text-dark-secondary">
                  {course.jobTitle}{course.company ? ` di ${course.company}` : ''}
                </span>
                <p className="text-md text-text-dark-secondary leading-[150%] pt-1">{detail.tutorBio}</p>
              </div>
            </div>
          </Card>

          <Card title="Kamu akan Mempelajari">
            <div className="flex flex-col divide-y divide-border">
              {detail.curriculum.map((chapter, i) => (
                <CurriculumItem key={chapter.id} chapter={chapter} defaultOpen={i === 0} />
              ))}
            </div>
          </Card>

          <Card title="Rating dan Review">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {detail.reviews.map((rv) => (
                <div key={rv.id} className="flex flex-col gap-3 border border-border rounded-[10px] p-4">
                  <div className="flex items-center gap-3">
                    <img src={`/${rv.avatar}`} alt={rv.name} className="w-10 h-10 rounded-[10px] object-cover" />
                    <div>
                      <p className="font-semibold text-text-dark-primary">{rv.name}</p>
                      <p className="text-sm text-text-dark-secondary">{rv.batch}</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-dark-secondary leading-[150%]">{rv.text}</p>
                  <div className="flex items-center gap-2">
                    <StarRating rating={rv.rating} size={15} />
                    <span className="text-sm font-semibold text-text-dark-primary">{rv.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* SIDEBAR PEMBELIAN */}
        <aside className="order-1 lg:order-2 w-full lg:w-[360px] shrink-0">
          <div className="lg:sticky lg:top-24 flex flex-col gap-4 border border-border rounded-[14px] p-5 bg-background-primary">
            <h3 className="font-bold text-text-dark-primary leading-[130%]">{course.title}</h3>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-h5 font-bold text-primary">{course.price}</span>
              {course.originalPrice && (
                <span className="text-md line-through text-text-dark-disabled font-medium">{course.originalPrice}</span>
              )}
              {discount > 0 && (
                <span className="ml-auto inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-bold text-text-light-primary">
                  Diskon {discount}%
                </span>
              )}
            </div>

            <p className="text-sm font-medium text-info">
              Penawaran spesial tersisa {detail.promoDays} hari lagi!
            </p>

            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/checkout/${course.id}`)}
              className="w-full rounded-[10px] text-md py-3">
              Beli Sekarang
            </Button>

            {/* KELAS INI SUDAH TERMASUK */}
            <div className="flex flex-col gap-3 pt-1">
              <p className="font-bold text-text-dark-primary">Kelas Ini Sudah Termasuk</p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                {includes.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-text-dark-secondary">
                    <span className="shrink-0"><IncludeIcon name={item.icon} /></span>
                    <span className="text-sm font-sans">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* BAHASA PENGANTAR */}
            <div className="flex flex-col gap-2 pt-1">
              <p className="font-bold text-text-dark-primary">Bahasa Pengantar</p>
              <div className="flex items-center gap-2 text-text-dark-secondary">
                <span className="shrink-0"><IncludeIcon name="world" /></span>
                <span className="text-sm font-sans">{detail.language}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <div className="flex flex-col gap-6 pt-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h5 md:text-h3 font-bold text-text-dark-primary">
              Video Pembelajaran Terkait Lainnya
            </h2>
            <p className="text-md font-medium text-text-dark-secondary">
              Ekspansi Pengetahuan Anda dengan Rekomendasi Spesial Kami!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {related.map((c) => (<ProductCard key={c.id} {...c} />))}
          </div>
        </div>
      )}
    </div>
  );
}
