import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AccountLayout from '../components/account/AccountLayout';
import Button from '../components/ui/Button';
import { getEnrolledClasses } from '../data/account';

const TABS = [
  { value: 'all', label: 'Semua Kelas' },
  { value: 'ongoing', label: 'Sedang Berjalan' },
  { value: 'done', label: 'Selesai' },
];
const STATUS_META = {
  done: { label: 'Selesai', cls: 'bg-success-bg text-success' },
  ongoing: { label: 'Sedang Berjalan', cls: 'bg-secondary-100 text-secondary' },
  'not-started': { label: 'Belum Dimulai', cls: 'bg-grey-100 text-text-dark-secondary' },
};

function SearchIcon() {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" /><path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>);
}
function MetaIcon({ name }) {
  const p = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return name === 'module'
    ? <svg {...p}><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5Z" /><path d="M4 19a2 2 0 0 1 2-2h12" /></svg>
    : <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
}

export default function MyClasses() {
  const { items: courses, loading } = useSelector((state) => state.courses);
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');

  const classes = useMemo(() => getEnrolledClasses(courses), [courses]);
  const filtered = classes.filter((c) => {
    const matchTab = tab === 'all' || c.status === tab;
    const matchQuery = !query.trim() || c.course.title.toLowerCase().includes(query.toLowerCase());
    return matchTab && matchQuery;
  });

  return (
    <AccountLayout title="Daftar Kelas" subtitle="Akses Materi Belajar dan Mulailah Meningkatkan Pengetahuan Anda!">
      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:justify-between border-b border-border pb-3 mb-5">
        <div role="tablist" className="flex items-center gap-6 overflow-x-auto">
          {TABS.map((t) => {
            const active = tab === t.value;
            return (
              <button key={t.value} role="tab" aria-selected={active} onClick={() => setTab(t.value)} className="relative py-1 whitespace-nowrap">
                <span className={`text-md font-medium ${active ? 'text-tertiary' : 'text-text-dark-secondary hover:text-text-dark-primary'}`}>{t.label}</span>
                {active && <span className="absolute -bottom-3 left-0 h-[3px] w-full rounded-full bg-tertiary" />}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 border border-border rounded-md h-11 px-3 bg-background-primary focus-within:border-primary transition-colors w-[180px] sm:w-[240px]">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari Kelas" aria-label="Cari kelas"
            className="flex-1 min-w-0 outline-none bg-transparent text-md text-text-dark-primary placeholder:text-text-dark-disabled font-sans" />
          <span className="text-text-dark-secondary shrink-0"><SearchIcon /></span>
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-center py-16 text-text-dark-secondary font-medium">Memuat kelas…</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 text-center py-16">
          <p className="text-md font-medium text-text-dark-secondary">Belum ada kelas pada kategori ini.</p>
          <Link to="/products"><Button variant="outlined" color="primary" className="rounded-[10px]">Cari Kelas</Button></Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((cls) => {
            const meta = STATUS_META[cls.status];
            const done = cls.status === 'done';
            const started = cls.status !== 'not-started';
            return (
              <div key={cls.id} className="border border-border rounded-[10px] overflow-hidden">
                {/* HEADER */}
                <div className="flex items-center justify-between gap-2 px-4 py-3 bg-success-bg/30">
                  <span className="text-md font-medium text-text-dark-primary">
                    {cls.doneModules} / {cls.totalModules} Modul Terselesaikan
                  </span>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${meta.cls}`}>{meta.label}</span>
                </div>

                {/* BODY */}
                <div className="flex flex-col sm:flex-row gap-4 px-4 py-4">
                  <img src={`/${cls.course.image}`} alt={cls.course.title} className="w-full sm:w-28 h-40 sm:h-28 rounded-[10px] object-cover shrink-0" />
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <h3 className="font-bold text-text-dark-primary leading-[130%]">{cls.course.title}</h3>
                    <p className="text-sm text-text-dark-secondary line-clamp-2">{cls.course.description}</p>
                    <div className="flex items-center gap-2.5">
                      <img src={`/${cls.course.avatar}`} alt={cls.course.instructor} className="w-8 h-8 rounded-[8px] object-cover" />
                      <div className="text-sm">
                        <p className="font-medium text-text-dark-primary leading-tight">{cls.course.instructor}</p>
                        <p className="text-text-dark-secondary leading-tight">{cls.course.jobTitle}{cls.course.company ? ` di ${cls.course.company}` : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 text-sm text-text-dark-secondary">
                      <span className="flex items-center gap-1.5"><MetaIcon name="module" /> {cls.totalModules} Modul</span>
                      <span className="flex items-center gap-1.5"><MetaIcon name="clock" /> {cls.totalMinutes} Menit</span>
                    </div>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5 px-4 py-3 bg-success-bg/30">
                  <div className="flex-1 flex items-center gap-3 min-w-0">
                    <span className="text-sm text-text-dark-secondary whitespace-nowrap">
                      Progres Kelas: <span className="font-bold text-text-dark-primary">{cls.progress}%</span>
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-grey-200 overflow-hidden" role="progressbar" aria-valuenow={cls.progress} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-full rounded-full bg-tertiary transition-all" style={{ width: `${cls.progress}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {done && (
                      <Link to={`/certificate/${cls.id}`}>
                        <Button color="primary" variant="outlined" className="rounded-[10px] whitespace-nowrap">Unduh Sertifikat</Button>
                      </Link>
                    )}
                    <Link to={`/learn/${cls.id}`}>
                      <Button color="primary" variant="contained" className="rounded-[10px] whitespace-nowrap">
                        {done ? 'Lihat Detail Kelas' : started ? 'Lanjutkan Pembelajaran' : 'Mulai Belajar'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AccountLayout>
  );
}
