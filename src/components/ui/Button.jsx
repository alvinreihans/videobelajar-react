import UnstyledButton from './UnstyledButton';

export default function Button({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  disabled = false,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center rounded-lg transition overflow-hidden';

  const styles = {
    primary: {
      contained: 'bg-[#3ECF4C] text-white hover:bg-green-600',
      outlined: 'border border-[#3ECF4C] text-[#3ECF4C] hover:bg-green-50',
      shadow: 'bg-[rgba(226,252,217,0.8)] text-[#3ECF4C]',
    },
    secondary: {
      contained: 'bg-[#FFBD3A] text-white hover:bg-yellow-500',
      outlined: 'border border-[#FFBD3A] text-[#FFBD3A] hover:bg-yellow-50',
      shadow: 'bg-[rgba(255,247,215,0.8)] text-[#FFBD3A]',
    },
    disabled: {
      contained: 'bg-gray-300 text-gray-500 cursor-not-allowed',
      outlined:
        'border border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed',
      shadow: 'bg-gray-200 text-gray-400 cursor-not-allowed',
    },
  };

  const finalStyle = disabled
    ? styles.disabled[variant]
    : styles[color][variant];

  return (
    <button
      className={`${base} ${finalStyle} ${className}`}
      disabled={disabled}
      {...props}>
      <UnstyledButton as="span" size={size} className="text-inherit">
        {leftIcon && <span>{leftIcon}</span>}
        {children}
        {rightIcon && <span>{rightIcon}</span>}
      </UnstyledButton>
    </button>
  );
}
