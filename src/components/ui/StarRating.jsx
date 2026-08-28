// Bintang rating reusable — memakai aset SVG di /public (star-full/half/empty).
// Logika sama dengan yang ada di ProductCard, tapi bisa dipakai lintas halaman
// (hero Detail Produk, kartu review, dll) dengan ukuran yang bisa diatur.

function Star({ src, size }) {
  return <img src={src} alt="" width={size} height={size} />;
}

export default function StarRating({ rating = 0, size = 18, className = '' }) {
  const floored = Math.floor(rating * 2) / 2;
  const fullStars = Math.floor(floored);
  const hasHalf = floored % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className={`flex items-center gap-[2px] ${className}`}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`f-${i}`} src="/star-full.svg" size={size} />
      ))}
      {hasHalf && <Star src="/star-half.svg" size={size} />}
      {Array.from({ length: Math.max(emptyStars, 0) }).map((_, i) => (
        <Star key={`e-${i}`} src="/star-empty.svg" size={size} />
      ))}
    </div>
  );
}
