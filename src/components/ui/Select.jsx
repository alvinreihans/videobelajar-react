import { useState, useRef, useEffect } from 'react';

export default function Select({
  options = [],
  value,
  onChange,
  renderOption,
  renderValue,
  label,
  helperText,
  required,
  wrapperClassName = '',
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((opt) => opt.value === value?.value) || value;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`} ref={ref}>
      {/* LABEL */}
      {label && (
        <p className="text-sm text-text-dark-secondary">
          {label}
          {required && <span className="text-tertiary ml-1">*</span>}
        </p>
      )}

      <div className="relative">
        {/* TRIGGER */}
        <div
          onClick={() => setOpen(!open)}
          className={`h-12 px-3 flex items-center justify-between cursor-pointer border rounded-md bg-background-primary shadow-sm transition-colors text-sm ${
            open ? 'border-primary' : 'border-border'
          } ${className}`}>
          {renderValue ? (
            renderValue(selected)
          ) : (
            <span className="text-text-dark-primary">{selected?.label}</span>
          )}
          <span
            className={`text-[10px] text-text-dark-secondary ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>

        {/* DROPDOWN */}
        {open && (
          <div
            className="absolute left-0 top-full mt-1 bg-background-primary border border-border rounded-md shadow-lg z-50 overflow-hidden"
            style={{ minWidth: '100%' }}>
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`px-3 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors text-sm text-text-dark-primary ${
                  selected?.value === option.value ? 'bg-primary/5' : ''
                }`}>
                {renderOption ? (
                  renderOption(option)
                ) : (
                  <span>{option.label}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* HELPER TEXT */}
      {helperText && (
        <p className="text-xs text-text-dark-secondary">{helperText}</p>
      )}
    </div>
  );
}
