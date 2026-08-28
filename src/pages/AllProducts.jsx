import { useState, useMemo, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ui/ProductCard';
import { CATEGORIES } from '../data/courses';
import { getCourseMeta } from '../data/courseDetails';

// ─── OPSI FILTER ─────────────────────────────────────────────────────────────
const PRICE_RANGES = [
  { value: 'lt150', label: 'Di bawah Rp 150K', test: (v) => v < 150_000 },
  { value: '150-300', label: 'Rp 150K – Rp 300K', test: (v) => v >= 150_000 && v <= 300_000 },
  { value: 'gt300', label: 'Di atas Rp 300K', test: (v) => v > 300_000 },
];
const DURATIONS = [
  { value: 'lt4', label: 'Kurang dari 4 Jam', test: (h) => h < 4 },
  { value: '4-8', label: '4 – 8 Jam', test: (h) => h >= 4 && h <= 8 },
  { value: 'gt8', label: 'Lebih dari 8 Jam', test: (h) => h > 8 },
];
const SORTS = [
  { value: 'price-asc', label: 'Harga Rendah' },
  { value: 'price-desc', label: 'Harga Tinggi' },
  { value: 'az', label: 'A to Z' },
  { value: 'za', label: 'Z to A' },
  { value: 'rating-desc', label: 'Rating Tertinggi' },
  { value: 'rating-asc', label: 'Rating Terendah' },
];
const PER_PAGE = 6;

// ─── IKON ────────────────────────────────────────────────────────────────────
function GroupIcon({ name }) {
  const p = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const shapes = {
    study: (<><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5Z" /><path d="M4 19a2 2 0 0 1 2-2h12" /></>),
    price: (<><path d="M5 8h14l-1.5 11a2 2 0 0 1-2 1.8H8.5a2 2 0 0 1-2-1.8L5 8Z" /><path d="M9 8 12 3l3 5" /></>),
    duration: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  };
  return <svg {...p}>{shapes[name]}</svg>;
}
function Chevron({ open }) {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>);
}
function SearchIcon() {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" /><path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>);
}

// ─── FILTER GROUP (dalam kartu Filter) ───────────────────────────────────────
function FilterGroup({ icon, title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-[10px] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3.5 py-3 text-primary font-semibold font-sans">
        <span className="flex items-center gap-2"><GroupIcon name={icon} />{title}</span>
        <Chevron open={open} />
      </button>
      {open && <div className="px-3.5 pb-3.5 flex flex-col gap-3">{children}</div>}
    </div>
  );
}
function CheckRow({ type = 'checkbox', checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
      <input type={type} checked={checked} onChange={onChange} className="peer sr-only" />
      <span className={`w-5 h-5 shrink-0 border-2 flex items-center justify-center transition-colors ${type === 'radio' ? 'rounded-full' : 'rounded-[6px]'} ${checked ? 'border-primary bg-primary' : 'border-grey-300 bg-white'}`}>
        {checked && type === 'checkbox' && (<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>)}
        {checked && type === 'radio' && <span className="w-2 h-2 rounded-full bg-white" />}
      </span>
      <span className="text-md text-text-dark-secondary font-sans group-hover:text-text-dark-primary transition-colors">{label}</span>
    </label>
  );
}

// ─── SORT DROPDOWN ("Urutkan") ───────────────────────────────────────────────
function SortMenu({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-12 px-4 flex items-center gap-6 border border-border rounded-md bg-background-primary text-md font-sans text-text-dark-primary">
        Urutkan
        <span className="text-text-dark-secondary"><Chevron open={open} /></span>
      </button>
      {open && (
        <div className="absolute right-0 lg:left-0 top-full mt-1 min-w-[190px] bg-background-primary border border-border rounded-md shadow-lg z-50 overflow-hidden">
          {SORTS.map((s) => (
            <button
              key={s.value}
              onClick={() => { onChange(s.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm font-sans hover:bg-grey-50 ${value === s.value ? 'text-primary font-semibold bg-primary/5' : 'text-text-dark-primary'}`}>
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PAGINATION ──────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center lg:justify-end gap-2 pt-2">
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-[8px] bg-background-base text-text-dark-primary disabled:opacity-40 hover:bg-grey-200 transition">‹</button>
      {pages.map((p) => (
        <button key={p} onClick={() => onChange(p)}
          className={`w-9 h-9 flex items-center justify-center rounded-[8px] text-sm font-semibold font-sans transition ${p === page ? 'bg-secondary text-text-light-primary' : 'text-text-dark-secondary hover:bg-grey-100'}`}>{p}</button>
      ))}
      <button onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-[8px] bg-background-base text-text-dark-primary disabled:opacity-40 hover:bg-grey-200 transition">›</button>
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────
export default function AllProducts() {
  const { items: courses, loading, error } = useSelector((state) => state.courses);

  const [categories, setCategories] = useState([]);
  const [prices, setPrices] = useState([]);
  const [duration, setDuration] = useState(null);
  const [sort, setSort] = useState(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const toggle = (list, setList, value) => {
    setPage(1);
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };
  const resetFilters = () => {
    setCategories([]); setPrices([]); setDuration(null); setQuery(''); setPage(1);
  };

  const filtered = useMemo(() => {
    let result = [...courses];
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((c) =>
        c.title?.toLowerCase().includes(q) ||
        c.instructor?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q));
    }
    if (categories.length) result = result.filter((c) => categories.includes(c.category));
    if (prices.length) {
      const ranges = PRICE_RANGES.filter((r) => prices.includes(r.value));
      result = result.filter((c) => ranges.some((r) => r.test(getCourseMeta(c).priceValue)));
    }
    if (duration) {
      const d = DURATIONS.find((x) => x.value === duration);
      result = result.filter((c) => d.test(getCourseMeta(c).durationHours));
    }
    switch (sort) {
      case 'price-asc': result.sort((a, b) => getCourseMeta(a).priceValue - getCourseMeta(b).priceValue); break;
      case 'price-desc': result.sort((a, b) => getCourseMeta(b).priceValue - getCourseMeta(a).priceValue); break;
      case 'az': result.sort((a, b) => (a.title || '').localeCompare(b.title || '')); break;
      case 'za': result.sort((a, b) => (b.title || '').localeCompare(a.title || '')); break;
      case 'rating-desc': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case 'rating-asc': result.sort((a, b) => (a.rating || 0) - (b.rating || 0)); break;
      default: break;
    }
    return result;
  }, [courses, query, categories, prices, duration, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <div className="flex flex-col gap-6 md:gap-8 px-4 md:px-8 lg:px-[120px] py-8 md:py-12">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-h4 md:text-h3 font-bold text-text-dark-primary">
          Koleksi Video Pembelajaran Unggulan
        </h1>
        <p className="text-md font-medium text-text-dark-secondary leading-[140%] tracking-[0.2px]">
          Jelajahi Dunia Pengetahuan Melalui Pilihan Kami!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* SIDEBAR FILTER (inline di mobile, aside di desktop) */}
        <aside className="w-full lg:w-[290px] shrink-0">
          <div className="border border-border rounded-[12px] bg-background-primary p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-text-dark-secondary font-semibold font-sans">Filter</span>
              <button onClick={resetFilters} className="text-tertiary text-sm font-semibold font-sans hover:underline">Reset</button>
            </div>
            <FilterGroup icon="study" title="Bidang Studi">
              {CATEGORIES.map((cat) => (
                <CheckRow key={cat.value} checked={categories.includes(cat.value)} onChange={() => toggle(categories, setCategories, cat.value)} label={cat.label} />
              ))}
            </FilterGroup>
            <FilterGroup icon="price" title="Harga">
              {PRICE_RANGES.map((r) => (
                <CheckRow key={r.value} checked={prices.includes(r.value)} onChange={() => toggle(prices, setPrices, r.value)} label={r.label} />
              ))}
            </FilterGroup>
            <FilterGroup icon="duration" title="Durasi">
              {DURATIONS.map((d) => (
                <CheckRow key={d.value} type="radio" checked={duration === d.value}
                  onChange={() => { setDuration(duration === d.value ? null : d.value); setPage(1); }} label={d.label} />
              ))}
            </FilterGroup>
          </div>
        </aside>

        {/* CONTENT */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {/* TOOLBAR: Urutkan + Cari (kanan atas) */}
          <div className="flex items-center justify-between lg:justify-end gap-3">
            <SortMenu value={sort} onChange={(v) => { setSort(v); setPage(1); }} />
            <div className="flex items-center gap-2 border border-border rounded-md h-12 px-3 bg-background-primary focus-within:border-primary transition-colors w-[200px] sm:w-[260px]">
              <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Cari Kelas" aria-label="Cari kelas"
                className="flex-1 min-w-0 outline-none bg-transparent text-md text-text-dark-primary placeholder:text-text-dark-disabled font-sans" />
              <span className="text-text-dark-secondary shrink-0"><SearchIcon /></span>
            </div>
          </div>

          {/* GRID */}
          {loading ? (
            <div className="text-center py-16 text-text-dark-secondary text-md font-medium">Memuat kelas…</div>
          ) : error ? (
            <div className="text-center py-16 text-error text-md font-medium">Gagal memuat kelas: {error}</div>
          ) : paged.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paged.map((course) => (<ProductCard key={course.id} {...course} />))}
              </div>
              <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center py-16">
              <p className="text-md font-medium text-text-dark-secondary">Tidak ada kelas yang cocok dengan filter kamu.</p>
              <button onClick={resetFilters} className="text-primary font-semibold font-sans hover:underline">Reset filter</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
