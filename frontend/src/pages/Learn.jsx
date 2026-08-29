import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../components/ui/Button';
import StarRating from '../components/ui/StarRating';
import { getModuleGroups, getQuiz } from '../data/learning';

// ─── IKON ────────────────────────────────────────────────────────────────────
const svg = (p) => ({ width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', ...p });
const PlayIco = () => (<svg {...svg({ width: 18, height: 18 })}><circle cx="12" cy="12" r="9" /><path d="M10 8.5v7l5-3.5-5-3.5Z" fill="currentColor" stroke="none" /></svg>);
const BookIco = () => (<svg {...svg({ width: 18, height: 18 })}><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5Z" /><path d="M4 19a2 2 0 0 1 2-2h12" /></svg>);
const QuizIco = () => (<svg {...svg({ width: 18, height: 18 })}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M9 13l2 2 4-4" /></svg>);
const CheckCircleIco = () => (<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><circle cx="12" cy="12" r="10" fill="var(--success-default)" /><path d="M8 12.5l2.5 2.5 5-5.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>);
const BackIco = () => (<svg {...svg()}><path d="M15 6l-6 6 6 6" /></svg>);
const StarIco = () => (<svg {...svg({ width: 18, height: 18 })}><path d="M12 3l2.9 5.9 6.1.9-4.5 4.4 1 6.1L12 17.8 6.5 20.3l1-6.1L3 9.8l6.1-.9L12 3Z" /></svg>);
const iconFor = (t) => (t === 'video' ? <PlayIco /> : t === 'summary' ? <BookIco /> : <QuizIco />);

function Chevron({ open }) {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>);
}

// ─── BANNER DEKORATIF (Aturan / Congrats / Try Again) ────────────────────────
const BANNERS = {
  rules: { text: 'RULES', bg: 'linear-gradient(160deg,#8fd3e8 0%,#57b894 55%,#2f8f79 100%)' },
  congrats: { text: 'CONGRATS', bg: 'linear-gradient(160deg,#bfe9f5 0%,#54cfe0 55%,#2f8f79 100%)' },
  tryagain: { text: 'TRY AGAIN', bg: 'linear-gradient(160deg,#f3e2c7 0%,#f7a63b 60%,#6b4f3a 100%)' },
};
function Banner({ variant }) {
  const b = BANNERS[variant];
  return (
    <div className="w-full rounded-[12px] overflow-hidden flex items-center justify-center h-[220px] md:h-[300px]" style={{ background: b.bg }}>
      <span
        className="font-black text-[15vw] md:text-[90px] leading-none tracking-tight text-white select-none"
        style={{ WebkitTextStroke: '3px #222325', textShadow: '6px 6px 0 rgba(0,0,0,0.18)' }}>
        {b.text}
      </span>
    </div>
  );
}

// ─── STATS BAR HASIL ─────────────────────────────────────────────────────────
function StatsBar({ score, total, correct, passed }) {
  return (
    <div className="grid grid-cols-4 border border-border rounded-[8px] overflow-hidden max-w-[640px]">
      <div className={`px-4 py-3 ${passed ? 'bg-success-default' : 'bg-tertiary'}`}>
        <p className="text-sm text-white/90">Nilai</p>
        <p className="text-h5 font-bold text-white">{score}</p>
      </div>
      <div className="px-4 py-3 border-l border-border">
        <p className="text-sm text-text-dark-secondary">Soal</p>
        <p className="text-h5 font-bold text-text-dark-primary">{total}</p>
      </div>
      <div className="px-4 py-3 border-l border-border">
        <p className="text-sm text-text-dark-secondary">Benar</p>
        <p className="text-h5 font-bold text-text-dark-primary flex items-center gap-1.5"><CheckCircleIco /> {correct}</p>
      </div>
      <div className="px-4 py-3 border-l border-border">
        <p className="text-sm text-text-dark-secondary">Salah</p>
        <p className="text-h5 font-bold text-text-dark-primary flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none"><circle cx="12" cy="12" r="10" fill="var(--error-default)" /><path d="M9 9l6 6M15 9l-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
          {total - correct}
        </p>
      </div>
    </div>
  );
}

// ─── SIDEBAR DAFTAR MODUL ────────────────────────────────────────────────────
function ModuleSidebar({ groups, currentId, completed, onPick, onReview }) {
  const [openGroups, setOpenGroups] = useState(() => new Set(groups.map((g) => g.id)));
  const toggle = (gid) => setOpenGroups((prev) => {
    const n = new Set(prev); n.has(gid) ? n.delete(gid) : n.add(gid); return n;
  });
  return (
    <div className="border border-border rounded-[12px] bg-background-primary overflow-hidden flex flex-col">
      <div className="px-4 py-3.5 border-b border-border font-bold text-text-dark-primary">Daftar Modul</div>
      <div className="flex-1 overflow-y-auto max-h-[60vh] lg:max-h-[70vh] p-3 flex flex-col gap-3">
        {groups.map((g) => {
          const open = openGroups.has(g.id);
          return (
            <div key={g.id} className="flex flex-col gap-3">
              <button onClick={() => toggle(g.id)} className="flex items-center justify-between font-bold text-text-dark-primary">
                {g.title}<span className="text-text-dark-secondary"><Chevron open={open} /></span>
              </button>
              {open && g.items.map((it) => {
                const active = it.uid === currentId;
                const done = completed.has(it.uid);
                return (
                  <button key={it.uid} onClick={() => onPick(it.uid)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-[10px] border text-left transition-colors ${active ? 'border-primary bg-primary-100' : 'border-border hover:bg-grey-50'}`}>
                    <span className={done ? '' : active ? 'text-primary' : 'text-text-dark-secondary'}>
                      {done ? <CheckCircleIco /> : iconFor(it.type)}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className={`block text-sm truncate ${active ? 'font-bold text-text-dark-primary' : 'font-semibold text-text-dark-primary'}`}>{it.title}</span>
                      <span className="block text-xs text-text-dark-secondary">{it.subtitle}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
      <button onClick={onReview} className="flex items-center justify-center gap-2 bg-secondary text-white font-bold py-3.5 hover:bg-secondary-400 transition-colors">
        <StarIco /> Beri Review &amp; Rating
      </button>
    </div>
  );
}

// ─── KONTEN VIDEO ────────────────────────────────────────────────────────────
function VideoContent({ course, lesson }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="relative w-full aspect-video rounded-[12px] overflow-hidden bg-grey-900 flex items-center justify-center">
        <img src={`/${course.image}`} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <button aria-label="Putar video" className="relative w-16 h-16 rounded-full bg-white/95 flex items-center justify-center hover:scale-105 transition">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M8 6v12l10-6-10-6Z" fill="var(--primary)" /></svg>
        </button>
      </div>
      <h1 className="text-h5 md:text-h4 font-bold text-text-dark-primary">{lesson.title}</h1>
      <p className="text-md text-text-dark-secondary leading-[150%]">
        Pelajari dan praktikkan skill teknis dalam berbagai industri dengan Technical Book Riselearn.
      </p>
      <div className="flex items-center gap-3">
        <img src={`/${course.avatar}`} alt={course.instructor} className="w-11 h-11 rounded-[10px] object-cover" />
        <div>
          <p className="font-bold text-text-dark-primary">{course.instructor}</p>
          <p className="text-sm text-text-dark-secondary">{course.jobTitle}{course.company ? ` di ${course.company}` : ''}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StarRating rating={course.rating} size={16} />
        <span className="text-sm text-text-dark-secondary underline">{course.rating} ({course.students})</span>
      </div>
    </div>
  );
}

// ─── KONTEN RANGKUMAN ────────────────────────────────────────────────────────
function SummaryContent({ lesson }) {
  const [downloaded, setDownloaded] = useState(false);
  return (
    <div className="flex flex-col items-center text-center gap-4 py-12 border border-border rounded-[12px] bg-background-primary px-6">
      <span className="text-primary">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0 4-4m-4 4-4-4" /><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></svg>
      </span>
      <h1 className="text-h5 font-bold text-text-dark-primary">Download Rangkuman Modul</h1>
      <p className="text-md text-text-dark-secondary max-w-[440px]">
        Silakan download rangkuman modul dari materi yang telah kamu pelajari: <span className="font-semibold">{lesson.title.replace('Rangkuman: ', '')}</span>.
      </p>
      <Button color="primary" variant="contained" onClick={() => setDownloaded(true)} className="rounded-[10px] px-6">
        {downloaded ? 'Tersimpan ✓' : 'Download Rangkuman'}
      </Button>
    </div>
  );
}

// ─── KONTEN KUIS ─────────────────────────────────────────────────────────────
function QuizContent({ course, lesson, sidebar }) {
  const isPretest = /pre-?test/i.test(lesson.title);
  const questions = useMemo(() => getQuiz(course, 10), [course]);
  const [phase, setPhase] = useState('rules');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  const answeredCount = answers.filter((a) => a !== null).length;
  const correct = answers.filter((a, i) => a === questions[i].answer).length;
  const score = Math.round((correct / questions.length) * 100);
  const passed = isPretest || score >= 60;
  const today = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date());

  // RULES / ATURAN
  if (phase === 'rules') {
    return (
      <div className="flex flex-col gap-6">
        <Banner variant="rules" />
        <div className="flex flex-col gap-3">
          <h1 className="text-h5 font-bold text-text-dark-primary">Aturan</h1>
          <p className="text-md text-text-dark-secondary leading-[150%]">
            Kerjakan {isPretest ? 'pretest' : 'kuis'} dengan sebaik mungkin untuk mengukur pemahamanmu terkait materi yang kamu pelajari.
          </p>
          <p className="text-md text-text-dark-secondary">Syarat Nilai Kelulusan: {isPretest ? '–' : '60'}</p>
          <p className="text-md text-text-dark-secondary">Durasi Ujian: 5 Menit</p>
          <p className="text-md text-text-dark-secondary leading-[150%]">
            {isPretest
              ? 'Jangan khawatir, total skor tidak akan memengaruhi kelulusan dan penilaian akhirmu dalam rangkaian kelas ini.'
              : 'Pastikan kamu sudah mempelajari seluruh materi sebelum memulai kuis ini.'}
          </p>
          <Button color="primary" variant="contained" onClick={() => setPhase('questions')} className="rounded-[10px] self-start px-6 mt-1">
            {isPretest ? 'Mulai Pre-Test' : 'Mulai Kuis'}
          </Button>
        </div>
      </div>
    );
  }

  // RESULT
  if (phase === 'result') {
    return (
      <div className="flex flex-col gap-6">
        <Banner variant={passed ? 'congrats' : 'tryagain'} />
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-bold text-text-dark-primary">Tanggal {isPretest ? 'Pretest' : 'Quiz'}:</p>
            <p className="text-md text-text-dark-secondary">{today}</p>
          </div>
          <StatsBar score={score} total={questions.length} correct={correct} passed={passed} />
          <div className="flex flex-col gap-1">
            <h1 className="text-h5 font-bold text-text-dark-primary">{passed ? 'Selesai!' : 'Sedikit Lagi!'}</h1>
            <p className="text-md text-text-dark-secondary leading-[150%]">
              {passed
                ? `${isPretest ? 'Pretest' : 'Kuis'} sudah selesai dan kami sudah mengetahui progresmu. Saatnya ${isPretest ? 'memulai' : 'melanjutkan'} kelas!`
                : 'Kamu sudah menyelesaikan quiz dengan baik namun nilaimu belum cukup untuk melanjutkan materi.'}
            </p>
            {!passed && <p className="text-md text-text-dark-secondary">Pelajari kembali modul sebelumnya dan kerjakan kembali quiz ini!</p>}
          </div>
          {!passed && (
            <Button color="primary" variant="outlined"
              onClick={() => { setAnswers(Array(questions.length).fill(null)); setCurrent(0); setPhase('questions'); }}
              className="rounded-[10px] self-start px-6 flex items-center gap-2">
              ↻ Ulangi Quiz
            </Button>
          )}
        </div>
      </div>
    );
  }

  // QUESTIONS
  const q = questions[current];
  const isLast = current === questions.length - 1;
  const select = (oi) => setAnswers((prev) => prev.map((a, i) => (i === current ? oi : a)));
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      {/* LIST SOAL */}
      <div className="lg:w-[240px] shrink-0 flex flex-col gap-4">
        <p className="font-bold text-text-dark-primary">List Soal</p>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((_, i) => {
            const isCur = i === current, isAns = answers[i] !== null;
            return (
              <button key={i} onClick={() => setCurrent(i)} aria-label={`Soal ${i + 1}`}
                className={`h-11 rounded-[8px] text-md font-semibold border transition ${isCur ? 'bg-tertiary-100 border-tertiary text-tertiary' : isAns ? 'border-tertiary text-tertiary' : 'border-border text-text-dark-secondary hover:bg-grey-50'}`}>
                {i + 1}
              </button>
            );
          })}
        </div>
        <div className="rounded-[10px] border border-info bg-info-bg px-4 py-3 text-sm text-info">
          Selesaikan semua soal untuk mengakhiri quiz
        </div>
      </div>

      {/* QUESTION */}
      <div className="flex-1 min-w-0 flex flex-col gap-5 lg:border-l lg:border-border lg:pl-8">
        <h1 className="text-h5 font-bold text-text-dark-primary">Pertanyaan {current + 1}</h1>
        <p className="text-md md:text-xl text-text-dark-secondary leading-[150%]">{q.q}</p>
        <div className="flex flex-col gap-3">
          {q.options.map((opt, oi) => {
            const seld = answers[current] === oi;
            return (
              <label key={oi} className={`flex items-center gap-3 px-4 py-3.5 rounded-[10px] border cursor-pointer transition ${seld ? 'border-primary' : 'border-border hover:bg-grey-50'}`}>
                <input type="radio" name={`q-${current}`} checked={seld} onChange={() => select(oi)} className="sr-only peer" />
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${seld ? 'border-primary' : 'border-grey-300'}`}>
                  {seld && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </span>
                <span className={`text-md ${seld ? 'text-primary font-semibold' : 'text-text-dark-primary'}`}>{opt}</span>
              </label>
            );
          })}
        </div>
        <div className="flex items-center justify-between gap-3 mt-2">
          <Button color="info" variant="outlined" disabled={current === 0} onClick={() => setCurrent((c) => Math.max(0, c - 1))} className="rounded-[10px]">← Sebelumnya</Button>
          {isLast ? (
            <Button color="primary" variant="contained" disabled={answeredCount < questions.length} onClick={() => setPhase('result')} className="rounded-[10px] px-6">
              Kumpulkan ({answeredCount}/{questions.length})
            </Button>
          ) : (
            <Button color="primary" variant="contained" onClick={() => setCurrent((c) => c + 1)} className="rounded-[10px] px-6">Selanjutnya →</Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────
export default function Learn() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: courses, loading } = useSelector((state) => state.courses);
  const course = courses.find((c) => String(c.id) === String(id));

  const { groups, flat } = useMemo(() => {
    if (!course) return { groups: [], flat: [] };
    const g = getModuleGroups(course).map((grp) => ({
      ...grp,
      items: grp.items.map((it) => ({
        ...it,
        uid: `${grp.id}:${it.id}`,
        subtitle: it.type === 'quiz' ? '10 Pertanyaan' : it.duration,
      })),
    }));
    const f = [];
    g.forEach((grp) => grp.items.forEach((it) => f.push(it)));
    return { groups: g, flat: f };
  }, [course]);

  const [currentUid, setCurrentUid] = useState(null);
  const [completed, setCompleted] = useState(() => new Set());
  const [showModulesMobile, setShowModulesMobile] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);

  const activeUid = currentUid || flat[0]?.uid;
  const index = flat.findIndex((l) => l.uid === activeUid);
  const lesson = flat[index];
  const total = flat.length;
  const doneCount = completed.size;
  const percent = total ? Math.round((doneCount / total) * 100) : 0;

  if (loading && !course) return <div className="text-center py-24 text-text-dark-secondary">Memuat…</div>;
  if (!course || !lesson) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center px-4">
        <h1 className="text-h4 font-bold text-text-dark-primary">Kelas tidak ditemukan</h1>
        <Link to="/class"><Button variant="contained">Ke Kelas Saya</Button></Link>
      </div>
    );
  }

  const goto = (uid) => { setCurrentUid(uid); setShowModulesMobile(false); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const markDone = (uid) => setCompleted((prev) => new Set(prev).add(uid));
  const goPrev = () => index > 0 && goto(flat[index - 1].uid);
  const goNext = () => {
    markDone(activeUid);
    if (index < flat.length - 1) goto(flat[index + 1].uid);
    else navigate(`/certificate/${course.id}`);
  };
  const prevLesson = flat[index - 1];
  const nextLesson = flat[index + 1];

  return (
    <div className="min-h-screen bg-background-base flex flex-col">
      {/* TOP BAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="px-4 md:px-8 lg:px-[120px] h-16 flex items-center justify-between gap-3">
          <button onClick={() => navigate('/class')} className="flex items-center gap-2 text-text-dark-primary min-w-0">
            <BackIco /><span className="font-semibold truncate">{course.title}</span>
          </button>
          <div className="flex items-center gap-4">
            {/* PROGRESS METER */}
            <div className="relative hidden sm:block">
              <button onClick={() => setProgressOpen((v) => !v)} className="flex items-center gap-2">
                <span className="w-24 h-2 rounded-full bg-secondary-200 overflow-hidden"><span className="block h-full bg-secondary" style={{ width: `${percent}%` }} /></span>
                <span className="text-sm font-bold text-primary">{doneCount}/{total}</span>
                <span className="text-text-dark-secondary"><Chevron open={progressOpen} /></span>
              </button>
              {progressOpen && (
                <div className="absolute right-0 top-full mt-2 w-[300px] bg-white border border-border rounded-[10px] shadow-lg p-4 flex flex-col gap-2 z-50">
                  <p className="font-bold text-text-dark-primary">{percent}% Modul Telah Selesai</p>
                  <p className="text-sm text-text-dark-secondary">Selesaikan Semua Modul Untuk Mendapatkan Sertifikat</p>
                  <Button color="primary" variant="contained" disabled={percent < 100}
                    onClick={() => navigate(`/certificate/${course.id}`)} className="rounded-[10px] mt-1">
                    Ambil Sertifikat
                  </Button>
                </div>
              )}
            </div>
            <img src={`/avatar-user.svg`} alt="" className="w-9 h-9 rounded-lg border border-border object-cover" />
            <button onClick={() => setShowModulesMobile((v) => !v)} className="lg:hidden text-sm font-semibold text-primary">Modul</button>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="flex-1 px-4 md:px-8 lg:px-[120px] py-6 md:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1 min-w-0">
          {lesson.type === 'video' && <VideoContent course={course} lesson={lesson} />}
          {lesson.type === 'summary' && <SummaryContent lesson={lesson} />}
          {lesson.type === 'quiz' && <QuizContent course={course} lesson={lesson} />}
        </div>
        <aside className={`w-full lg:w-[340px] shrink-0 ${showModulesMobile ? 'block' : 'hidden lg:block'}`}>
          <ModuleSidebar groups={groups} currentId={activeUid} completed={completed} onPick={goto} onReview={() => navigate(`/product/${course.id}`)} />
        </aside>
      </div>

      {/* BOTTOM NAV BAR (hijau, full width) */}
      <div className="sticky bottom-0 z-30 bg-primary text-white">
        <div className="px-4 md:px-8 lg:px-[120px] h-16 flex items-center justify-between gap-3">
          <button onClick={goPrev} disabled={!prevLesson} className="flex items-center gap-2 min-w-0 disabled:opacity-50">
            <BackIco /><span className="font-semibold truncate hidden sm:block max-w-[35vw]">{prevLesson ? prevLesson.title : 'Awal Modul'}</span>
            <span className="font-semibold sm:hidden">Sebelumnya</span>
          </button>
          <button onClick={goNext} className="flex items-center gap-2 min-w-0">
            <span className="font-semibold truncate hidden sm:block max-w-[35vw]">{nextLesson ? nextLesson.title : 'Selesai & Ambil Sertifikat'}</span>
            <span className="font-semibold sm:hidden">Selanjutnya</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
