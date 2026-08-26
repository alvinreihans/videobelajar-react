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

export function crudRouter(service, label) {
  const router = Router();
  const c = createCrudController(service, label);

  router.get('/', c.list);
  router.get('/:id', c.detail);
  router.post('/', c.create);
  router.put('/:id', c.update);
  router.patch('/:id', c.update);
  router.delete('/:id', c.remove);

  return router;
}
