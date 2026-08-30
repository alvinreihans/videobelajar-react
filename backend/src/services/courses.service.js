// ─── Service khusus COURSES (dengan JOIN) ────────────────────────────
// Resource utama "Edu Course". Fungsi baca (getAll & getById) di-override
// agar sekaligus mengambil nama tutor & kategori lewat JOIN. Logika filter,
// sort, dan search memakai buildListClauses yang sama dengan baseService,
// sehingga tidak ada duplikasi kode query.
import { createCrudService } from './baseService.js';
import { query } from '../config/db.js';
import { buildListClauses } from '../utils/queryBuilder.js';

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

// Konfigurasi filter / sort / search untuk daftar course.
const LIST_CONFIG = {
  columns: {
    category_id: 'c.category_id',
    tutor_id: 'c.tutor_id',
    status: 'c.status',
    slug: 'c.slug',
    topic: 'cat.slug',          // ?topic=<slug-kategori> → filter berdasarkan kategori
  },
  filterKeys: ['category_id', 'tutor_id', 'status', 'slug'],
  // Kategori boleh lebih dari satu sekaligus: ?topic=desain,bisnis
  inKeys: ['topic'],
  sortable: {
    price: 'c.price',
    rating: 'c.rating',
    students: 'c.students_count',
    title: 'c.title',
    newest: 'c.created_at',
    id: 'c.id',
  },
  likeColumns: ['c.title', 'c.description', 't.name'],  // ?search= mencari di sini
  defaultOrder: 'c.id DESC',
};

async function getAll(filters = {}) {
  const { whereSql, params, orderSql, limitSql } = buildListClauses(filters, LIST_CONFIG);
  return query(`${SELECT_WITH_JOIN} ${whereSql} ${orderSql} ${limitSql}`, params);
}

async function getById(id) {
  const rows = await query(`${SELECT_WITH_JOIN} WHERE c.id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

export default { ...base, getAll, getById };
