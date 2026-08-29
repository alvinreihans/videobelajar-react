import { Link } from 'react-router-dom';

// Pastikan path aset selalu absolut (mulai dari root) supaya gambar tetap
// termuat di rute bertingkat seperti /product/:id, bukan hanya di "/".
const asset = (p) =>
  !p || /^(https?:)?\/\//.test(p) || p.startsWith('/') ? p : `/${p}`;

// ─── STARS ────────────────────────────────────────────────────────────────────

const StarFull = () => (
  <img src="/star-full.svg" alt="" width={18} height={18} />
);

const StarHalf = () => (
  <img src="/star-half.svg" alt="" width={18} height={18} />
);

const StarEmpty = () => (
  <img src="/star-empty.svg" alt="" width={18} height={18} />
);

function StarRating({ rating }) {
  const floored = Math.floor(rating * 2) / 2;
  const fullStars = Math.floor(floored);
  const hasHalf = floored % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-[2px]">
      {Array.from({ length: fullStars }).map((_, i) => (
        <StarFull key={`f-${i}`} />
      ))}
      {hasHalf && <StarHalf />}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <StarEmpty key={`e-${i}`} />
      ))}
    </div>
  );
}

// ─── PRICE ────────────────────────────────────────────────────────────────────

function PriceSection({ price, originalPrice, isMobile = false }) {
  return (
    <div className="flex items-center gap-2">
      {originalPrice && (
        <span
          className={`line-through text-tertiary font-normal tracking-[0.2px] ${
            isMobile ? 'text-xs' : 'text-sm'
          }`}>
          {originalPrice}
        </span>
      )}
      <span
        className={`font-semibold text-primary leading-[120%] ${
          isMobile ? 'text-xl' : 'text-2xl'
        }`}>
        {price}
      </span>
    </div>
  );
}

// ─── INSTRUCTOR ───────────────────────────────────────────────────────────────

function Instructor({
  avatar,
  instructor,
  jobTitle,
  company,
  isMobile = false,
}) {
  return (
    <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-2.5'}`}>
      <img
        src={asset(avatar)}
        alt={instructor}
        className={`rounded-[10px] object-cover shrink-0 ${
          isMobile ? 'w-9 h-9' : 'w-10 h-10'
        }`}
      />

      <div className="flex flex-col">
        {/* NAME */}
        <span
          className={`font-medium text-text-dark-primary tracking-[0.2px] leading-[140%] ${
            isMobile ? 'text-sm' : 'text-base'
          }`}>
          {instructor}
        </span>

        {/* TITLE */}
        <div
          className={`flex items-center gap-1 text-text-dark-secondary tracking-[0.2px] leading-[140%] ${
            isMobile ? 'text-[12px]' : 'text-sm'
          }`}>
          <span className="font-normal">{jobTitle}</span>

          {!isMobile && company && (
            <>
              <span className="font-normal">di</span>
              <span className="font-bold">{company}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

export default function ProductCard({
  id,
  title,
  description,
  instructor,
  jobTitle,
  company,
  rating,
  students,
  price,
  originalPrice = null,
  image,
  avatar,
  className = '',
  to,
  actions,
}) {
  // `to === null` disables navigation (dipakai di halaman kelola kelas).
  const resolvedTo = to === undefined ? `/product/${id}` : to;
  const clickable = resolvedTo !== null;

  const Wrapper = clickable ? Link : 'div';
  const wrapperProps = clickable
    ? { to: resolvedTo, className: 'block' }
    : { className: 'block' };

  return (
    <Wrapper {...wrapperProps}>
      <div
        className={`bg-background-primary border border-border rounded-[10px] ${className}`}>
        {/* MOBILE */}
        <div className="flex flex-col gap-2 p-4 md:hidden">
          <div className="flex gap-3">
            <img
              src={asset(image)}
              alt={title}
              className="w-[82px] h-[82px] rounded-[10px] object-cover shrink-0"
            />
            <div className="flex flex-col gap-2 flex-1 min-w-0 font-sans">
              <h3 className="font-semibold text-text-dark-primary text-xl leading-[120%] line-clamp-2">
                {title}
              </h3>
              <Instructor
                avatar={avatar}
                instructor={instructor}
                jobTitle={jobTitle}
                company={company}
                isMobile
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StarRating rating={rating} />
              <span className="text-[12px] font-medium text-text-dark-secondary underline tracking-[0.2px]">
                {rating} ({students})
              </span>
            </div>
            <PriceSection
              price={price}
              originalPrice={originalPrice}
              isMobile
            />
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:flex flex-col gap-4 p-5">
          <img
            src={asset(image)}
            alt={title}
            className="w-full h-[193px] rounded-[10px] object-cover"
          />
          <div className="flex flex-col gap-2 font-sans">
            <h3 className="font-semibold text-xl text-text-dark-primary leading-[120%] line-clamp-1">
              {title}
            </h3>
            <p className="text-md font-medium text-text-dark-secondary leading-[140%] tracking-[0.2px] line-clamp-2">
              {description}
            </p>
          </div>
          <Instructor
            avatar={avatar}
            instructor={instructor}
            jobTitle={jobTitle}
            company={company}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StarRating rating={rating} />
              <span className="text-sm font-medium text-text-dark-secondary underline tracking-[0.2px]">
                {rating} ({students})
              </span>
            </div>
            <PriceSection price={price} originalPrice={originalPrice} />
          </div>
        </div>

        {/* ACTIONS (Edit / Hapus) — hanya muncul di halaman kelola kelas */}
        {actions && (
          <div className="flex items-center gap-2 px-4 pb-4 md:px-5 md:pb-5">
            {actions}
          </div>
        )}
      </div>
    </Wrapper>
  );
}
