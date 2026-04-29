export default function UnstyledButton({
  children,
  icon = 'none',
  size = 'md',
  variantStyle = '',
  className = '',
  as: Component = 'button',
  ...props
}) {
  const sizes = {
    md: 'text-md px-4 py-1.5',
    lg: 'text-xl px-6 py-2',
  };

  const base = 'inline-flex items-center gap-2 font-sans font-bold';

  return (
    <Component
      className={`${base} ${sizes[size]} ${variantStyle} ${className}`}
      {...props}>
      {(icon === 'left' || icon === 'both') && <span>←</span>}
      {children}
      {(icon === 'right' || icon === 'both') && <span>→</span>}
    </Component>
  );
}
