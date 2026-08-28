import { useState, useMemo, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AccountLayout from '../components/account/AccountLayout';
import Button from '../components/ui/Button';
import { getOrders, formatRupiah } from '../data/account';

const TABS = [
  { value: 'all', label: 'Semua Pesanan' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'paid', label: 'Berhasil' },
  { value: 'failed', label: 'Gagal' },
];
const STATUS_META = {
  paid: { label: 'Berhasil', cls: 'bg-success-bg text-success' },
  pending: { label: 'Belum Bayar', cls: 'bg-secondary-100 text-secondary' },
  failed: { label: 'Gagal', cls: 'bg-error-bg text-error' },
};
const SORTS = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'price-desc', label: 'Harga Tertinggi' },
  { value: 'price-asc', label: 'Harga Terendah' },
];

function SearchIcon() {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" /><path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>);
}
function Chevron({ open }) {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>);
}

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
      <button onClick={() => setOpen((v) => !v)}
        className="h-11 px-4 flex items-center gap-4 border border-border rounded-md bg-background-primary text-md font-sans text-text-dark-primary">
        Urutkan <span className="text-text-dark-secondary"><Chevron open={open} /></span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 min-w-[170px] bg-background-primary border border-border rounded-md shadow-lg z-50 overflow-hidden">
          {SORTS.map((s) => (
            <button key={s.value} onClick={() => { onChange(s.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-grey-50 ${value === s.value ? 'text-primary font-semibold' : 'text-text-dark-primary'}`}>{s.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  const { items: courses, loading } = useSelector((state) => state.courses);
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');

  const orders = useMemo(() => getOrders(courses), [courses]);

  const filtered = orders
    .filter((o) => {
      const matchTab = tab === 'all' || o.status === tab;
      const matchQuery = !query.trim() ||
        o.course.title.toLowerCase().includes(query.toLowerCase()) ||
        o.invoice.toLowerCase().includes(query.toLowerCase());
      return matchTab && matchQuery;
    })
    .sort((a, b) => {
      if (sort === 'price-desc') return b.total - a.total;
      if (sort === 'price-asc') return a.total - b.total;
      return 0;
    });

  return (
    <AccountLayout title="Daftar Pesanan" subtitle="Informasi terperinci mengenai pembelian">
      {/* TOOLBAR: tabs + search + sort */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:justify-between border-b border-border pb-3 mb-5">
        <div role="tablist" className="flex items-center gap-6 overflow-x-auto">
          {TABS.map((t) => {
            const active = tab === t.value;
            return (
              <button key={t.value} role="tab" aria-selected={active} onClick={() => setTab(t.value)}
                className="relative py-1 whitespace-nowrap">
                <span className={`text-md font-medium ${active ? 'text-tertiary' : 'text-text-dark-secondary hover:text-text-dark-primary'}`}>{t.label}</span>
                {active && <span className="absolute -bottom-3 left-0 h-[3px] w-full rounded-full bg-tertiary" />}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-border rounded-md h-11 px-3 bg-background-primary focus-within:border-primary transition-colors w-[180px] sm:w-[220px]">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari Kelas" aria-label="Cari pesanan"
              className="flex-1 min-w-0 outline-none bg-transparent text-md text-text-dark-primary placeholder:text-text-dark-disabled font-sans" />
            <span className="text-text-dark-secondary shrink-0"><SearchIcon /></span>
          </div>
          <SortMenu value={sort} onChange={setSort} />
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-center py-16 text-text-dark-secondary font-medium">Memuat pesanan…</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 text-center py-16">
          <p className="text-md font-medium text-text-dark-secondary">Belum ada pesanan pada kategori ini.</p>
          <Link to="/products"><Button variant="outlined" color="primary" className="rounded-[10px]">Jelajahi Kelas</Button></Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((order) => {
            const meta = STATUS_META[order.status];
            return (
              <div key={order.id} className="border border-border rounded-[10px] overflow-hidden">
                {/* HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-success-bg/30">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-text-dark-secondary">
                    <span>No. Invoice: <span className="font-semibold text-info">{order.invoice}</span></span>
                    <span>Waktu Pembayaran: <span className="font-medium text-text-dark-primary">{order.date}</span></span>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${meta.cls}`}>{meta.label}</span>
                </div>
                {/* BODY */}
                <div className="flex items-center gap-4 px-4 py-4">
                  <img src={`/${order.course.image}`} alt={order.course.title} className="w-14 h-14 rounded-[10px] object-cover shrink-0" />
                  <p className="flex-1 min-w-0 font-semibold text-text-dark-primary line-clamp-2">{order.course.title}</p>
                  <div className="pl-4 border-l border-border shrink-0 min-w-[120px]">
                    <p className="text-sm text-text-dark-secondary">Harga</p>
                    <p className="font-bold text-text-dark-primary">{formatRupiah(order.price)}</p>
                  </div>
                </div>
                {/* FOOTER */}
                <div className="flex items-center justify-between px-4 py-3 bg-success-bg/30">
                  <span className="text-md text-text-dark-secondary">Total Pembayaran</span>
                  <span className="text-md font-bold text-success">{formatRupiah(order.total)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AccountLayout>
  );
}
