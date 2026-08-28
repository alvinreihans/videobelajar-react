// Chip / badge kecil dengan varian warna dari design token.
// Dipakai mis. label promo di Detail Produk & status pesanan nanti.

export default function Chip({
  children,
  color = 'secondary',
  className = '',
  leftIcon,
}) {
  const colors = {
    primary: 'bg-primary-100 text-primary',
    secondary: 'bg-secondary-100 text-secondary',
    tertiary: 'bg-tertiary-100 text-tertiary',
    info: 'bg-info-bg text-info',
    success: 'bg-success-bg text-success',
    warning: 'bg-warning-bg text-warning-pressed',
    error: 'bg-error-bg text-error',
    grey: 'bg-grey-100 text-text-dark-secondary',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold font-sans whitespace-nowrap ${colors[color]} ${className}`}>
      {leftIcon}
      {children}
    </span>
  );
}
