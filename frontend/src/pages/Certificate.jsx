import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import Breadcrumb from '../components/ui/Breadcrumb';
import Button from '../components/ui/Button';
import StarRating from '../components/ui/StarRating';
import { CATEGORIES } from '../data/courses';

function todayLong() {
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const d = new Date();
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// Ornamen sudut hijau-kuning (dekoratif).
function CornerBlob({ className }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <circle cx="30" cy="30" r="30" fill="#3ecf4c" />
      <circle cx="78" cy="20" r="16" fill="#ffbd3a" />
      <circle cx="20" cy="78" r="14" fill="#ffbd3a" />
      <circle cx="70" cy="70" r="24" fill="#6be26b" />
    </svg>
  );
}

export default function Certificate() {
  const { id } = useParams();
  const { user } = useAuth();
  const { items: courses, loading } = useSelector((state) => state.courses);
  const course = courses.find((c) => String(c.id) === String(id));
  const date = useMemo(() => todayLong(), []);

  if (loading && !course) return <div className="text-center py-24 text-text-dark-secondary">Memuat…</div>;
  if (!course) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center px-4">
        <h1 className="text-h4 font-bold text-text-dark-primary">Sertifikat tidak ditemukan</h1>
        <Link to="/class"><Button variant="contained">Ke Kelas Saya</Button></Link>
      </div>
    );
  }

  const name = user?.name || 'Peserta Videobelajar';
  const categoryLabel = CATEGORIES.find((c) => c.value === course.category)?.label || 'Kelas';

  return (
    <div className="px-4 md:px-8 lg:px-[120px] py-6 md:py-8 flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: 'Beranda', to: '/' },
          { label: categoryLabel, to: '/products' },
          { label: course.title, to: `/learn/${course.id}` },
          { label: 'Sertifikat' },
        ]}
      />

      {/* KARTU */}
      <div className="border border-border rounded-[14px] bg-background-primary p-4 md:p-6 flex flex-col gap-6">
        {/* PANEL SERTIFIKAT */}
        <div className="rounded-[12px] bg-primary-100 p-4 md:p-10 flex justify-center">
          <div id="certificate" className="relative w-full max-w-[720px] aspect-[1.5/1] bg-white rounded-[8px] overflow-hidden shadow-sm">
            <CornerBlob className="absolute top-0 right-0 w-28 h-28" />
            <CornerBlob className="absolute bottom-0 left-0 w-24 h-24 rotate-180" />

            <div className="relative h-full flex flex-col items-center justify-center text-center px-6 md:px-12 gap-1.5 md:gap-2">
              <span className="font-bold text-sm md:text-base">
                <span className="text-primary">video</span><span className="text-tertiary">belajar</span>
              </span>
              <h2 className="text-h5 md:text-h2 font-bold text-primary leading-none">Certificate</h2>
              <p className="text-md md:text-h5 font-semibold text-text-dark-primary">of Completion</p>
              <p className="text-xs md:text-sm text-text-dark-secondary mt-1">Proudly presented to</p>
              <p className="text-h6 md:text-h3 text-secondary" style={{ fontFamily: 'cursive' }}>{name}</p>
              <p className="text-xs md:text-sm text-text-dark-primary border-t border-border pt-1.5 mt-1">
                For successfully completing “{course.title}”
              </p>
              <p className="text-[10px] md:text-xs text-text-dark-secondary">Given this {date} at videobelajar.id</p>

              {/* SIGNATURES + SEAL */}
              <div className="flex items-end justify-between w-full max-w-[440px] mt-2 md:mt-4">
                <div className="text-center">
                  <p className="text-xs md:text-sm font-semibold text-text-dark-primary">{course.instructor}</p>
                  <div className="h-[1px] bg-border w-24 md:w-32 mx-auto my-1" />
                  <p className="text-[10px] md:text-xs text-text-dark-secondary">{course.jobTitle}</p>
                </div>
                <div className="shrink-0 mx-2 mb-2">
                  <svg width="44" height="44" viewBox="0 0 48 48" aria-hidden="true">
                    <circle cx="24" cy="24" r="16" fill="#38d189" />
                    <circle cx="24" cy="24" r="11" fill="none" stroke="#fff" strokeWidth="1.5" />
                    <path d="M24 17l2 4 4 .5-3 3 .8 4L24 26.5 20.2 28.5l.8-4-3-3 4-.5 2-4Z" fill="#ffbd3a" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-xs md:text-sm font-semibold text-text-dark-primary">Videobelajar</p>
                  <div className="h-[1px] bg-border w-24 md:w-32 mx-auto my-1" />
                  <p className="text-[10px] md:text-xs text-text-dark-secondary">Chief Executive</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INFO + DOWNLOAD */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 no-print">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-text-dark-primary">{course.title}</h3>
            <p className="text-sm text-text-dark-secondary max-w-[560px]">{course.description}</p>
            <div className="flex items-center gap-2.5">
              <img src={`/${course.avatar}`} alt={course.instructor} className="w-8 h-8 rounded-[8px] object-cover" />
              <div className="text-sm">
                <p className="font-semibold text-text-dark-primary leading-tight">{course.instructor}</p>
                <p className="text-text-dark-secondary leading-tight">{course.jobTitle}{course.company ? ` di ${course.company}` : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StarRating rating={course.rating} size={15} />
              <span className="text-sm text-text-dark-secondary underline">{course.rating} ({course.students})</span>
            </div>
          </div>
          <Button color="primary" variant="outlined" onClick={() => window.print()} className="rounded-[10px] px-6 whitespace-nowrap flex items-center gap-2 self-start md:self-auto">
            ⬇ Download Sertifikat
          </Button>
        </div>
      </div>
    </div>
  );
}
