import { NavLink } from 'react-router-dom';

// ─── IKON SIDEBAR ────────────────────────────────────────────────────────────
function Icon({ name }) {
  const p = {
    width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  const shapes = {
    person: (<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>),
    book: (<><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5Z" /><path d="M4 19a2 2 0 0 1 2-2h12" /></>),
    basket: (<><path d="M5 8h14l-1.5 11a2 2 0 0 1-2 1.8H8.5a2 2 0 0 1-2-1.8L5 8Z" /><path d="M9 8 12 3l3 5" /></>),
  };
  return <svg {...p}>{shapes[name]}</svg>;
}

const NAV = [
  { to: '/profile', label: 'Profil Saya', icon: 'person' },
  { to: '/class', label: 'Kelas Saya', icon: 'book' },
  { to: '/orders', label: 'Pesanan Saya', icon: 'basket' },
];

export default function AccountLayout({ title, subtitle, children }) {
  return (
    <div className="px-4 md:px-8 lg:px-[120px] py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* LEFT: judul + nav */}
        <aside className="lg:w-[300px] shrink-0 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h1 className="text-h5 md:text-h4 font-bold text-text-dark-primary">{title}</h1>
            {subtitle && (
              <p className="text-md font-medium text-text-dark-secondary leading-[140%]">
                {subtitle}
              </p>
            )}
          </div>

          <nav
            aria-label="Menu akun"
            className="border border-border rounded-[12px] bg-background-primary p-3 flex flex-col gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-[10px] font-semibold font-sans transition-colors ${
                    isActive
                      ? 'bg-secondary-100 text-secondary'
                      : 'text-text-dark-secondary hover:bg-grey-50'
                  }`
                }>
                <Icon name={item.icon} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* RIGHT: konten dalam kartu putih */}
        <main className="flex-1 min-w-0">
          <div className="border border-border rounded-[14px] bg-background-primary p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
