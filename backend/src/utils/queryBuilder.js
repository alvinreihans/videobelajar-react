// ─── Query Builder (filter, sort, search) ────────────────────────────
// Satu tempat untuk membangun klausa SQL dinamis dari query-param frontend,
// dipakai bersama oleh baseService (tabel biasa) maupun courses.service
// (tabel ber-JOIN). Semua nilai memakai prepared statement (`?`) → aman
// dari SQL Injection; sedangkan nama kolom untuk SORT dibatasi whitelist.

// Bersihkan angka untuk LIMIT/OFFSET (di-inline sebagai integer, bukan `?`,
// karena sebagian versi MySQL menolak placeholder pada LIMIT).
export function toInt(value, fallback, max) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n) || n < 0) return fallback;
  return max ? Math.min(n, max) : n;
}

// Bangun klausa WHERE (filter + search), ORDER BY (sort), dan LIMIT/OFFSET.
//
// config:
//   columns      { paramKey: 'sql.column' }  → pemetaan kolom untuk FILTER
//   filterKeys   ['status', ...]             → param yang boleh jadi filter (WHERE =)
//   sortable     { sortByValue: 'sql.column' }→ whitelist kolom untuk SORT
//   likeColumns  ['sql.col', ...]            → kolom yang dicari saat SEARCH (LIKE)
//   defaultOrder 'id DESC'                   → urutan default bila sortBy kosong
export function buildListClauses(filters = {}, config = {}) {
  const {
    columns = {},
    filterKeys = [],
    sortable = {},
    likeColumns = [],
    defaultOrder = 'id DESC',
  } = config;

  const conditions = [];
  const params = [];

  // ── FILTER: pencocokan tepat → WHERE `col` = ? ──
  for (const key of filterKeys) {
    const value = filters[key];
    if (value !== undefined && value !== '') {
      conditions.push(`${columns[key] || key} = ?`);
      params.push(value);
    }
  }

  // ── SEARCH: pencarian karakter → WHERE (colA LIKE ? OR colB LIKE ?) ──
  const term = filters.search;
  if (term !== undefined && String(term).trim() !== '' && likeColumns.length > 0) {
    const like = `%${String(term).trim()}%`;
    conditions.push(`(${likeColumns.map((c) => `${c} LIKE ?`).join(' OR ')})`);
    likeColumns.forEach(() => params.push(like));
  }

  const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  // ── SORT: ORDER BY dari ?sortBy= (hanya kolom di whitelist) + arah ?order= ──
  let orderSql = `ORDER BY ${defaultOrder}`;
  if (filters.sortBy && sortable[filters.sortBy]) {
    const dir = String(filters.order).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    orderSql = `ORDER BY ${sortable[filters.sortBy]} ${dir}`;
  }

  // ── PAGINATION ──
  const limitSql = `LIMIT ${toInt(filters.limit, 100, 200)} OFFSET ${toInt(filters.offset, 0)}`;

  return { whereSql, params, orderSql, limitSql };
}
