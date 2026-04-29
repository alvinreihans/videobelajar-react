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
    'inline-flex items-center justify-center rounded-lg transition overflow-hidden font-sans';

  const styles = {
    primary: {
      contained: 'bg-primary text-text-light-primary hover:bg-primary-400',
      outlined: 'border border-primary text-primary hover:bg-primary-100',
      shadow: 'bg-primary-100 text-primary',
      gradient: 'bg-[var(--gradient-success)] text-text-light-primary',
    },

    secondary: {
      contained: 'bg-secondary text-text-light-primary hover:bg-secondary-400',
      outlined: 'border border-secondary text-secondary hover:bg-secondary-100',
      shadow: 'bg-secondary-100 text-secondary',
      gradient: 'bg-[var(--gradient-warning)] text-text-dark-primary',
    },

    tertiary: {
      contained: 'bg-tertiary text-text-light-primary hover:bg-tertiary-400',
      outlined: 'border border-tertiary text-tertiary hover:bg-tertiary-100',
      shadow: 'bg-tertiary-100 text-tertiary',
      gradient: 'bg-[var(--gradient-error)] text-text-light-primary',
    },

    info: {
      contained: 'bg-info text-text-light-primary hover:bg-info-hover',
      outlined: 'border border-info text-info hover:bg-info-bg',
      shadow: 'bg-info-bg text-info',
      gradient: 'bg-[var(--gradient-info)] text-text-light-primary',
    },
  };

  const disabledStyle = {
    contained: 'bg-grey-300 text-grey-500 cursor-not-allowed',
    outlined:
      'border border-grey-300 text-grey-400 bg-grey-100 cursor-not-allowed',
    shadow: 'bg-grey-200 text-grey-400 cursor-not-allowed',
    gradient: 'bg-grey-300 text-grey-500 cursor-not-allowed',
  };

  const finalStyle = disabled
    ? disabledStyle[variant]
    : styles[color]?.[variant];

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
