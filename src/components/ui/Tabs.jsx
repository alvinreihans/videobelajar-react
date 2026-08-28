// Tab bar dengan indikator garis tertiary — mengikuti pola yang sudah dipakai
// di Home & Kelola Kelas, dijadikan komponen agar konsisten & mudah dipakai ulang.
export default function Tabs({ tabs = [], value, onChange, className = '' }) {
  return (
    <div
      role="tablist"
      className={`flex items-start overflow-x-auto border-b border-border ${className}`}>
      {tabs.map((tab) => {
        const isActive = value === tab.value;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className="flex flex-col items-start shrink-0 pr-9 focus:outline-none">
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
  );
}
