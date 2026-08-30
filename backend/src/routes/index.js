// ─── Router Utama /api ───────────────────────────────────────────────
// Memasang seluruh 15 resource ke dalam satu router. Setiap resource
// otomatis mendapat 6 endpoint CRUD dari crudRouter().
import { Router } from 'express';
import { crudRouter } from './crudRouter.js';
import authRouter from './auth.routes.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import uploadRouter from './upload.routes.js';
import publicRouter from './public.routes.js';
import { services, labels } from '../services/index.js';

const router = Router();

// Daftar resource beserta path URL-nya (path = key pada registry service).
const resourcePaths = Object.keys(services);

// Endpoint index /api → daftar semua endpoint yang tersedia (dokumentasi ringan).
router.get('/', (req, res) => {
  const base = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
  res.json({
    success: true,
    message: 'Video Belajar REST API — Edu Course',
    resources: resourcePaths.map((p) => `${base}/${p}`),
  });
});

// Endpoint autentikasi (register/login/verify-email) — di luar pola CRUD.
router.use('/auth', authRouter);
router.use('/upload', uploadRouter);

// Endpoint publik (baca-saja, tanpa token) untuk halaman katalog frontend.
router.use('/public', publicRouter);

// Guard (proteksi token) per resource. Contoh sesuai mission: GET /courses
// hanya bisa diakses bila membawa token yang valid.
const guards = {
  courses: { list: [verifyToken] },
};

// Pasang router CRUD untuk tiap resource.
for (const path of resourcePaths) {
  router.use(`/${path}`, crudRouter(services[path], labels[path] || path, guards[path]));
}

export default router;
