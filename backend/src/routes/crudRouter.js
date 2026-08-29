// ─── LANGKAH KETIGA: Implementing REST API (Router Factory) ──────────
// Membangun sebuah Express Router lengkap dengan 6 endpoint standar untuk
// satu resource, mengikuti konvensi RESTful:
//
//   GET    /            → semua data
//   GET    /:id         → satu data berdasarkan id
//   POST   /            → tambah data           (service INSERT / ADD)
//   PUT    /:id         → ganti data (by id)    (service UPDATE)
//   PATCH  /:id         → ubah sebagian (by id) (service UPDATE)
//   DELETE /:id         → hapus data (by id)    (service DELETE)
import { Router } from 'express';
import { createCrudController } from '../controllers/baseController.js';

// `guards` opsional: { list, detail, create, update, remove } berisi array
// middleware yang dijalankan SEBELUM controller pada aksi terkait — dipakai
// untuk memasang authMiddleware.verifyToken pada endpoint yang butuh login.
export function crudRouter(service, label, guards = {}) {
  const router = Router();
  const c = createCrudController(service, label);
  const g = (name) => guards[name] || [];

  router.get('/', ...g('list'), c.list);
  router.get('/:id', ...g('detail'), c.detail);
  router.post('/', ...g('create'), c.create);
  router.put('/:id', ...g('update'), c.update);
  router.patch('/:id', ...g('update'), c.update);
  router.delete('/:id', ...g('remove'), c.remove);

  return router;
}
