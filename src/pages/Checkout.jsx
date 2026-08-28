import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../components/ui/Button';
import { getCourseDetail, parsePrice } from '../data/courseDetails';
import { formatRupiah } from '../data/account';

// ─── METODE ──────────────────────────────────────────────────────────────────
const METHOD_GROUPS = [
  { key: 'bank', label: 'Transfer Bank', methods: [
    { id: 'bca', name: 'Bank BCA', color: '#0066AE' },
    { id: 'bni', name: 'Bank BNI', color: '#F15A22' },
    { id: 'bri', name: 'Bank BRI', color: '#00529C' },
    { id: 'mandiri', name: 'Bank Mandiri', color: '#003D79' },
  ] },
  { key: 'ewallet', label: 'E-Wallet', methods: [
    { id: 'dana', name: 'DANA', color: '#118EEA' },
    { id: 'ovo', name: 'OVO', color: '#4C2A86' },
    { id: 'linkaja', name: 'LinkAja', color: '#E82128' },
    { id: 'shopeepay', name: 'ShopeePay', color: '#EE4D2D' },
  ] },
  { key: 'card', label: 'Kartu Kredit/Debit', methods: [
    { id: 'card', name: 'Kartu Kredit / Debit', color: '#222325', hint: 'Visa · Mastercard · JCB' },
  ] },
];
const ADMIN_FEE = 7000;
const ALL_METHODS = METHOD_GROUPS.flatMap((g) => g.methods.map((m) => ({ ...m, group: g.label })));

// ─── IKON ────────────────────────────────────────────────────────────────────
function Chevron({ open }) {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>);
}
function IncludeIcon({ name }) {
  const c = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    exam: (<><path d="M9 3h6l1 3H8l1-3Z" /><rect x="4" y="6" width="16" height="15" rx="2" /><path d="M9 13l2 2 4-4" /></>),
    doc: (<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M8 13h8M8 17h5" /></>),
    edit: (<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" /></>),
    video: (<><rect x="3" y="6" width="12" height="12" rx="2" /><path d="M15 10l6-3v10l-6-3" /></>),
    certificate: (<><circle cx="12" cy="9" r="5" /><path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5" /></>),
    world: (<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" /></>),
  };
  return <svg {...c}>{paths[name]}</svg>;
}
function Monogram({ method }) {
  const initials = method.name.replace(/Bank |Kartu.*/g, '').trim().slice(0, 2).toUpperCase();
  return (
    <span className="w-8 h-6 rounded-[4px] flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: method.color }}>
      {initials || 'CC'}
    </span>
  );
}

// ─── STEPPER (di header) ─────────────────────────────────────────────────────
const STEPS = ['Pilih Metode', 'Bayar', 'Selesai'];
function Stepper({ current }) {
  return (
    <div className="flex items-center">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 ${done || active ? 'border-primary' : 'border-grey-300'} ${done ? 'bg-primary' : active ? 'bg-white' : 'bg-white'}`}>
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : (
                  <span className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-primary' : 'bg-grey-300'}`} />
                )}
              </span>
              <span className={`text-sm font-semibold hidden sm:block ${done || active ? 'text-text-dark-primary' : 'text-text-dark-secondary'}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`w-8 md:w-16 h-[2px] mx-2 ${i < current ? 'bg-primary' : 'bg-grey-300'}`} />}
          </div>
        );
      })}
    </div>
  );
}

// ─── ACCORDION METODE ────────────────────────────────────────────────────────
function MethodGroup({ group, selected, onSelect, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="flex flex-col gap-3">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 border border-border rounded-[10px] font-bold text-text-dark-primary">
        {group.label}
        <span className="text-text-dark-secondary"><Chevron open={open} /></span>
      </button>
      {open && group.methods.map((m) => {
        const isSel = selected === m.id;
        return (
          <label key={m.id} className={`flex items-center gap-3 px-4 py-3 border rounded-[10px] cursor-pointer transition ${isSel ? 'border-primary' : 'border-border hover:bg-grey-50'}`}>
            <Monogram method={m} />
            <span className="flex-1 min-w-0">
              <span className="text-md text-text-dark-primary font-sans">{m.name}</span>
              {m.hint && <span className="block text-xs text-text-dark-secondary">{m.hint}</span>}
            </span>
            <input type="radio" name="pay" checked={isSel} onChange={() => onSelect(m.id)} className="sr-only peer" />
            {isSel ? (
              <span className="w-5 h-5 rounded-full bg-tertiary flex items-center justify-center shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            ) : (
              <span className="w-5 h-5 rounded-full border-2 border-grey-300 shrink-0" />
            )}
          </label>
        );
      })}
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────
export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: courses, loading } = useSelector((state) => state.courses);
  const course = courses.find((c) => String(c.id) === String(id));

  const [step, setStep] = useState(0);
  const [method, setMethod] = useState('bca');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(50 * 60 + 55);
  const [instrOpen, setInstrOpen] = useState('bank');

  useEffect(() => {
    if (step !== 1) return;
    if (secondsLeft <= 0) { setResult('pending'); setStep(2); return; }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, secondsLeft]);

  const detail = useMemo(() => (course ? getCourseDetail(course) : null), [course]);

  const Header = ({ current }) => (
    <header className="bg-white border-b border-border">
      <div className="px-4 md:px-8 lg:px-[120px] h-16 md:h-20 flex items-center justify-between gap-4">
        <Link to="/"><img src="/logo.svg" alt="videobelajar" className="h-6 md:h-8" /></Link>
        <Stepper current={current} />
      </div>
    </header>
  );

  if (loading && !course) {
    return (<><Header current={0} /><div className="text-center py-24 text-text-dark-secondary">Memuat…</div></>);
  }
  if (!course) {
    return (
      <>
        <Header current={0} />
        <div className="flex flex-col items-center gap-4 py-24 text-center px-4">
          <h1 className="text-h4 font-bold text-text-dark-primary">Kelas tidak ditemukan</h1>
          <Link to="/products"><Button variant="contained">Lihat Semua Kelas</Button></Link>
        </div>
      </>
    );
  }

  const price = parsePrice(course.price);
  const total = price + ADMIN_FEE;
  const sel = ALL_METHODS.find((m) => m.id === method);
  const discount = detail.originalValue ? Math.round((1 - detail.priceValue / detail.originalValue) * 100) : 0;
  const includes = [
    { icon: 'exam', label: 'Ujian Akhir' }, { icon: 'video', label: `${detail.totalVideos} Video` },
    { icon: 'doc', label: `${detail.totalDocs} Dokumen` }, { icon: 'certificate', label: 'Sertifikat' },
    { icon: 'edit', label: 'Pretest' },
  ];

  const fmtTime = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return [h, m, sec].map((n) => String(n).padStart(2, '0'));
  };
  const copyVA = async () => {
    try { await navigator.clipboard.writeText('117390812345678890'); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* ignore */ }
  };

  // KARTU INFO KELAS (kanan)
  const courseCard = (
    <div className="border border-border rounded-[14px] p-5 bg-background-primary flex flex-col gap-4 lg:sticky lg:top-6">
      <img src={`/${course.image}`} alt={course.title} className="w-full h-[180px] rounded-[10px] object-cover" />
      <h3 className="font-bold text-text-dark-primary leading-[130%]">{course.title}</h3>
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-h5 font-bold text-primary">{course.price}</span>
        {course.originalPrice && <span className="text-md line-through text-text-dark-disabled font-medium">{course.originalPrice}</span>}
        {discount > 0 && <span className="ml-auto rounded-md bg-secondary px-2 py-1 text-xs font-bold text-text-light-primary">Diskon {discount}%</span>}
      </div>
      <div className="flex flex-col gap-3">
        <p className="font-bold text-text-dark-primary">Kelas Ini Sudah Termasuk</p>
        <div className="grid grid-cols-2 gap-3">
          {includes.map((it, i) => (
            <div key={i} className="flex items-center gap-2 text-text-dark-secondary"><span className="shrink-0"><IncludeIcon name={it.icon} /></span><span className="text-sm font-sans">{it.label}</span></div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-bold text-text-dark-primary">Bahasa Pengantar</p>
        <div className="flex items-center gap-2 text-text-dark-secondary"><span className="shrink-0"><IncludeIcon name="world" /></span><span className="text-sm font-sans">{detail.language}</span></div>
      </div>
    </div>
  );

  // RINGKASAN (line items + total)
  const summaryLines = (
    <div className="flex flex-col gap-3">
      <p className="font-bold text-text-dark-primary text-h6">Ringkasan Pesanan</p>
      <div className="flex justify-between gap-4 text-md text-text-dark-secondary">
        <span className="flex-1">Video Learning: {course.title}</span>
        <span className="text-text-dark-primary whitespace-nowrap">{formatRupiah(price)}</span>
      </div>
      <div className="flex justify-between text-md text-text-dark-secondary">
        <span>Biaya Admin</span><span className="text-text-dark-primary">{formatRupiah(ADMIN_FEE)}</span>
      </div>
      <div className="h-[1px] bg-border" />
      <div className="flex justify-between items-center">
        <span className="font-bold text-text-dark-primary">Total Pembayaran</span>
        <span className="text-h6 font-bold text-primary">{formatRupiah(total)}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-base">
      <Header current={step} />

      {/* COUNTDOWN BANNER (step Bayar) */}
      {step === 1 && (
        <div className="bg-tertiary-100 py-3">
          <div className="px-4 md:px-8 lg:px-[120px] flex items-center justify-center gap-3">
            <span className="text-md font-medium text-text-dark-secondary">Selesaikan pemesanan dalam</span>
            <div className="flex items-center gap-1">
              {fmtTime(secondsLeft).map((n, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <span className="text-tertiary font-bold">:</span>}
                  <span className="bg-tertiary text-white font-bold rounded-[6px] px-2 py-1 tabular-nums">{n}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RESULT */}
      {step === 2 ? (
        <div className="px-4 py-12 md:py-16 flex justify-center">
          <div className="w-full max-w-[560px] border border-border rounded-[16px] bg-background-primary p-8 flex flex-col items-center text-center gap-4">
            <span className={result === 'success' ? 'text-success' : 'text-warning-pressed'}>
              <svg width="88" height="88" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" fill="currentColor" opacity="0.12" />
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.4" />
                {result === 'success'
                  ? <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  : <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
              </svg>
            </span>
            <h1 className="text-h4 font-bold text-text-dark-primary">
              {result === 'success' ? 'Pembayaran Berhasil!' : 'Pembayaran Tertunda!'}
            </h1>
            <p className="text-md text-text-dark-secondary max-w-[420px]">
              Silakan cek email kamu untuk informasi lebih lanjut. Hubungi kami jika ada kendala.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button color="primary" variant="contained" onClick={() => navigate('/orders')} className="rounded-[10px] px-6">
                Lihat Detail Pesanan
              </Button>
              {result === 'success' && (
                <Button color="info" variant="outlined" onClick={() => navigate(`/learn/${course.id}`)} className="rounded-[10px] px-6">
                  Mulai Belajar
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 md:px-8 lg:px-[120px] py-6 md:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* LEFT */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">
            {step === 0 ? (
              <>
                <div className="border border-border rounded-[14px] bg-background-primary p-5 md:p-6 flex flex-col gap-4">
                  <h2 className="text-h6 font-bold text-text-dark-primary">Metode Pembayaran</h2>
                  {METHOD_GROUPS.map((g, i) => (
                    <MethodGroup key={g.key} group={g} selected={method} onSelect={setMethod} defaultOpen={i === 0} />
                  ))}
                </div>
                <div className="border border-border rounded-[14px] bg-background-primary p-5 md:p-6 flex flex-col gap-4">
                  {summaryLines}
                  <Button color="primary" variant="contained" onClick={() => { setSecondsLeft(50 * 60 + 55); setStep(1); }} className="w-full rounded-[10px] py-3">
                    Beli Sekarang
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="border border-border rounded-[14px] bg-background-primary p-5 md:p-6 flex flex-col gap-5">
                  <h2 className="text-h6 font-bold text-text-dark-primary">Metode Pembayaran</h2>
                  <div className="border border-border rounded-[10px] p-5 flex flex-col items-center gap-2 text-center">
                    <Monogram method={sel} />
                    <p className="font-semibold text-text-dark-primary">Bayar Melalui {sel.group === 'Transfer Bank' ? `Virtual Account ${sel.name.replace('Bank ', '')}` : sel.name}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-h6 font-bold text-text-dark-primary tracking-wide">1173 9081 2345 6789</span>
                      <button onClick={copyVA} className="text-sm font-semibold text-tertiary hover:underline">{copied ? 'Tersalin!' : 'Salin'}</button>
                    </div>
                  </div>
                  {summaryLines}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button color="primary" variant="outlined" onClick={() => setStep(0)} className="rounded-[10px] flex-1">Ganti Metode Pembayaran</Button>
                    <Button color="primary" variant="contained" onClick={() => { setResult('success'); setStep(2); }} className="rounded-[10px] flex-1">Bayar Sekarang</Button>
                  </div>
                </div>

                {/* TATA CARA PEMBAYARAN */}
                <div className="border border-border rounded-[14px] bg-background-primary p-5 md:p-6 flex flex-col gap-3">
                  <h2 className="text-h6 font-bold text-text-dark-primary">Tata Cara Pembayaran</h2>
                  {METHOD_GROUPS.map((g) => {
                    const open = instrOpen === g.key;
                    return (
                      <div key={g.key} className="border border-border rounded-[10px] overflow-hidden">
                        <button onClick={() => setInstrOpen(open ? null : g.key)} className="w-full flex items-center justify-between px-4 py-3.5 font-bold text-text-dark-primary">
                          {g.label}<span className="text-text-dark-secondary"><Chevron open={open} /></span>
                        </button>
                        {open && (
                          <ol className="px-5 pb-4 pt-1 list-decimal text-md text-text-dark-secondary flex flex-col gap-1.5 marker:text-text-dark-secondary">
                            <li>Pilih {g.label} sebagai metode pembayaran.</li>
                            <li>Salin nomor Virtual Account / tujuan pembayaran di atas.</li>
                            <li>Buka aplikasi {g.label.toLowerCase()} kamu dan masukkan nomor tersebut.</li>
                            <li>Periksa nominal lalu konfirmasi pembayaran.</li>
                            <li>Pembayaran otomatis terverifikasi dalam beberapa menit.</li>
                          </ol>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* RIGHT */}
          <aside className="w-full lg:w-[360px] shrink-0">{courseCard}</aside>
        </div>
      )}
    </div>
  );
}
