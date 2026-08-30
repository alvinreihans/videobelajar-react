// ─── Router /api/public ──────────────────────────────────────────────
// Endpoint baca-saja (read-only) yang BOLEH diakses tanpa token, dipakai
// oleh halaman katalog publik di frontend (Beranda & Semua Kelas).
//
// Ini melengkapi — bukan menggantikan — `/api/courses` yang tetap dijaga
// `verifyToken` sesuai Langkah Keempat mission. Pembagiannya:
//   GET /api/public/courses  → pengunjung (tanpa login) melihat katalog
//   GET /api/courses         → butuh JWT, dipakai untuk kelola kelas
//
// Service & controller yang dipakai sama persis dengan resource CRUD,
// jadi filter/sort/search dari query params otomatis ikut berlaku.
import { Router } from 'express';
import { createCrudController } from '../controllers/baseController.js';
import { services } from '../services/index.js';

const router = Router();
const courses = createCrudController(services.courses, 'Course');
const categories = createCrudController(services.categories, 'Kategori');

// Hanya GET — tidak ada create/update/delete di jalur publik.
router.get('/courses', courses.list);
router.get('/courses/:id', courses.detail);

// Kategori = data referensi (nama & slug), aman dibuka untuk publik dan
// dibutuhkan frontend untuk memetakan slug kategori → category_id.
router.get('/categories', categories.list);

export default router;
