// ─── Pembungkus Async Handler ────────────────────────────────────────
// Menghindari try/catch berulang di setiap controller. Semua error dari
// fungsi async otomatis diteruskan ke middleware error lewat next().
export default function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
