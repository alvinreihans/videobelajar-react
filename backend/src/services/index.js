// ─── Registry Service (Kamus Data) ───────────────────────────────────
// Satu tempat yang mendefinisikan seluruh 15 resource beserta kolom yang
// boleh diisi (fillable) dan kolom yang boleh dijadikan filter (searchable).
// Ini membuat penambahan/perubahan resource jadi mudah dan konsisten.
import { createCrudService } from './baseService.js';
import coursesService from './courses.service.js';

export const services = {
  // 1. USERS — akun pengguna
  users: createCrudService({
    table: 'users',
    fillable: ['full_name', 'username', 'email', 'password_hash', 'phone', 'avatar', 'role'],
    searchable: ['role', 'email', 'username'],
    sortable: ['id', 'full_name', 'created_at'],
    likeable: ['full_name', 'email', 'username'],
  }),

  // 2. TUTORS — profil pengajar
  tutors: createCrudService({
    table: 'tutors',
    fillable: ['user_id', 'name', 'job_title', 'company', 'bio', 'avatar'],
    searchable: ['user_id'],
  }),

  // 3. CATEGORIES — kategori kelas
  categories: createCrudService({
    table: 'categories',
    fillable: ['slug', 'name'],
    searchable: ['slug'],
    sortable: ['id', 'name'],
    likeable: ['name', 'slug'],
  }),

  // 4. COURSES — produk/kelas (resource utama, pakai service ber-JOIN)
  courses: coursesService,

  // 5. MODULES — modul/bab kelas
  modules: createCrudService({
    table: 'modules',
    fillable: ['course_id', 'title', 'position'],
    searchable: ['course_id'],
    defaultOrder: 'position ASC, id ASC',
  }),

  // 6. MATERIALS — material belajar (video/summary/quiz)
  materials: createCrudService({
    table: 'materials',
    fillable: ['module_id', 'type', 'title', 'content_url', 'duration_minutes', 'position'],
    searchable: ['module_id', 'type'],
    defaultOrder: 'position ASC, id ASC',
  }),

  // 7. QUIZ_QUESTIONS — bank soal quiz
  'quiz-questions': createCrudService({
    table: 'quiz_questions',
    fillable: ['material_id', 'question', 'options', 'answer_index'],
    searchable: ['material_id'],
    jsonColumns: ['options'],
  }),

  // 8. PRETESTS — pretest kelas
  pretests: createCrudService({
    table: 'pretests',
    fillable: ['course_id', 'title', 'passing_score'],
    searchable: ['course_id'],
  }),

  // 9. PRETEST_QUESTIONS — bank soal pretest
  'pretest-questions': createCrudService({
    table: 'pretest_questions',
    fillable: ['pretest_id', 'question', 'options', 'answer_index'],
    searchable: ['pretest_id'],
    jsonColumns: ['options'],
  }),

  // 10. ORDERS — pesanan
  orders: createCrudService({
    table: 'orders',
    fillable: ['user_id', 'invoice_number', 'status', 'subtotal', 'admin_fee', 'total'],
    searchable: ['user_id', 'status', 'invoice_number'],
  }),

  // 11. ORDER_ITEMS — detail item pesanan
  'order-items': createCrudService({
    table: 'order_items',
    fillable: ['order_id', 'course_id', 'price'],
    searchable: ['order_id', 'course_id'],
  }),

  // 12. PAYMENTS — pembayaran
  payments: createCrudService({
    table: 'payments',
    fillable: ['order_id', 'method', 'method_group', 'amount', 'va_number', 'status', 'paid_at', 'expired_at'],
    searchable: ['order_id', 'status', 'method_group'],
  }),

  // 13. ENROLLMENTS — Kelas Saya
  enrollments: createCrudService({
    table: 'enrollments',
    fillable: ['user_id', 'course_id', 'order_id', 'progress', 'done_modules', 'total_modules', 'status'],
    searchable: ['user_id', 'course_id', 'status'],
  }),

  // 14. MATERIAL_PROGRESS — progres per material
  'material-progress': createCrudService({
    table: 'material_progress',
    fillable: ['enrollment_id', 'material_id', 'is_completed', 'completed_at'],
    searchable: ['enrollment_id', 'material_id'],
  }),

  // 15. REVIEWS — ulasan
  reviews: createCrudService({
    table: 'reviews',
    fillable: ['user_id', 'course_id', 'rating', 'comment'],
    searchable: ['user_id', 'course_id'],
  }),
};

// Label ramah untuk tiap resource (dipakai di pesan response/error).
export const labels = {
  users: 'User',
  tutors: 'Tutor',
  categories: 'Kategori',
  courses: 'Course',
  modules: 'Modul',
  materials: 'Material',
  'quiz-questions': 'Soal Quiz',
  pretests: 'Pretest',
  'pretest-questions': 'Soal Pretest',
  orders: 'Order',
  'order-items': 'Item Order',
  payments: 'Pembayaran',
  enrollments: 'Enrollment',
  'material-progress': 'Progres Material',
  reviews: 'Review',
};
