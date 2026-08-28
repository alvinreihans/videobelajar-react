import { Link } from 'react-router-dom';

// Breadcrumb sederhana. items: [{ label, to }]. Item terakhir jadi teks aktif.
export default function Breadcrumb({ items = [], className = '' }) {
  return (
    <nav
      className={`flex items-center flex-wrap gap-2 text-sm font-sans ${className}`}
      aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-2">
            {isLast || !item.to ? (
              <span
                className={
                  isLast
                    ? 'text-text-dark-primary font-semibold'
                    : 'text-text-dark-secondary'
                }>
                {item.label}
              </span>
            ) : (
              <Link
                to={item.to}
                className="text-text-dark-secondary hover:text-primary transition-colors">
                {item.label}
              </Link>
            )}
            {!isLast && <span className="text-text-dark-disabled">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
