// ─── Service khusus COURSES (dengan JOIN) ────────────────────────────
// Resource utama "Edu Course". Selain CRUD standar dari baseService, fungsi
// baca (getAll & getById) di-override agar sekaligus mengambil nama tutor &
// kategori lewat JOIN — sehingga response API kaya informasi (tidak sekadar
// menampilkan tutor_id / category_id).
import { createCrudService } from './baseService.js';
import { query } from '../config/db.js';

const base = createCrudService({
  table: 'courses',
  fillable: [
    'category_id', 'tutor_id', 'title', 'slug', 'description',
    'price', 'original_price', 'rating', 'students_count',
    'image', 'language', 'status',
  ],
  searchable: ['category_id', 'tutor_id', 'status', 'slug'],
});

// Query dasar dengan JOIN ke categories & tutors.
const SELECT_WITH_JOIN = `
  SELECT
    c.*,
    cat.name  AS category_name,
    cat.slug  AS category_slug,
    t.name    AS tutor_name,
    t.job_title AS tutor_job_title,
    t.company AS tutor_company,
    t.avatar  AS tutor_avatar
  FROM courses c
  LEFT JOIN categories cat ON cat.id = c.category_id
  LEFT JOIN tutors t       ON t.id  = c.tutor_id
`;

function toInt(value, fallback, max) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n) || n < 0) return fallback;
  return max ? Math.min(n, max) : n;
}

async function getAll(filters = {}) {
  const conditions = [];
  const params = [];
  const map = {
    category_id: 'c.category_id',
    tutor_id: 'c.tutor_id',
    status: 'c.status',
    slug: 'c.slug',
  };
  for (const [key, col] of Object.entries(map)) {
    if (filters[key] !== undefined && filters[key] !== '') {
      conditions.push(`${col} = ?`);
      params.push(filters[key]);
    }
  }
  const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const limit = toInt(filters.limit, 100, 200);
  const offset = toInt(filters.offset, 0);
  const sql = `${SELECT_WITH_JOIN} ${whereSql} ORDER BY c.id DESC LIMIT ${limit} OFFSET ${offset}`;
  return query(sql, params);
}

async function getById(id) {
  const rows = await query(`${SELECT_WITH_JOIN} WHERE c.id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

export default { ...base, getAll, getById };
