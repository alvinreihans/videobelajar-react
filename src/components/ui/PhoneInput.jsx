import { useState } from 'react';
import Select from './Select';
import Input from './Input';

const COUNTRIES = [
  { label: 'Indonesia', value: 'ID', code: '+62', flag: 'flag-id.svg' },
  { label: 'Malaysia', value: 'MY', code: '+60', flag: 'flag-my.svg' },
  { label: 'Singapore', value: 'SG', code: '+65', flag: 'flag-sg.svg' },
  { label: 'Brunei', value: 'BN', code: '+673', flag: 'flag-bn.svg' },
];

export default function PhoneInput({ label, required, value, onChange }) {
  const [country, setCountry] = useState(COUNTRIES[0]);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* LABEL */}
      {label && (
        <p className="text-sm text-text-dark-secondary font-sans leading-[140%]">
          {label}
          {required && <span className="text-tertiary ml-1">*</span>}
        </p>
      )}

      {/* SELECT + INPUT BERDAMPINGAN */}
      <div className="flex gap-2 w-full">
        <Select
          options={COUNTRIES}
          value={country}
          onChange={setCountry}
          wrapperClassName="w-[130px] shrink-0" // ← pakai wrapperClassName
          renderOption={(opt) => (
            <div className="flex items-center gap-2 font-sans">
              <img src={opt.flag} className="w-5 h-4 object-cover rounded-sm" />
              <span>{opt.code}</span>
            </div>
          )}
          renderValue={(opt) => (
            <div className="flex items-center gap-2 font-sans">
              <img src={opt.flag} className="w-5 h-4 object-cover rounded-sm" />
              <span>{opt.code}</span>
            </div>
          )}
        />
        <Input
          className="flex-1 min-w-0" // ← min-w-0 penting agar tidak overflow
          type="tel"
          placeholder="81234567890"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}
