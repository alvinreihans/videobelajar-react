import { useState } from 'react';

export default function Input({
  label,
  required = false,
  helperText,
  type = 'text',
  placeholder,
  isPassword = false,
  className = '',
  ...props
}) {
  const [show, setShow] = useState(false);
  const inputType = isPassword ? (show ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {/* LABEL */}
      {label && (
        <p className="text-sm text-text-dark-secondary font-sans">
          {label}
          {required && <span className="text-tertiary ml-1">*</span>}
        </p>
      )}

      {/* INPUT FIELD */}
      <div className="flex items-center border border-border rounded-md h-12 px-3 bg-background-primary shadow-sm transition-colors focus-within:border-primary">
        <input
          type={inputType}
          placeholder={placeholder}
          className="flex-1 outline-none text-text-dark-primary placeholder:text-text-dark-disabled bg-transparent text-md leading-[140%] font-sans"
          {...props}
        />
        {/* PASSWORD TOGGLE */}
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)} className="ml-2">
            <img
              src={show ? '/icon-eye-on.svg' : '/icon-eye-off.svg'}
              className="w-5 h-5"
            />
          </button>
        )}
      </div>

      {/* HELPER TEXT */}
      {helperText && (
        <p className="text-sm text-text-dark-secondary font-sans leading-[140%]">
          {helperText}
        </p>
      )}
    </div>
  );
}
