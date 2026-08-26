// ─── Controller Factory ──────────────────────────────────────────────
// Menghasilkan handler REST (list, detail, create, update, remove) untuk
// sebuah service. Controller hanya mengurus lapisan HTTP: membaca request,
// memanggil service (DML), lalu membentuk response JSON yang konsisten.
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

export function createCrudController(service, label = 'Data') {
  // GET /  → menampilkan semua data (memakai service SELECT)
  const list = asyncHandler(async (req, res) => {
    const data = await service.getAll(req.query);
    res.json({ success: true, count: data.length, data });
  });

  // GET /:id  → menampilkan satu data (SELECT by id)
  const detail = asyncHandler(async (req, res) => {
    const item = await service.getById(req.params.id);
    if (!item) {
      throw new ApiError(404, `${label} dengan id ${req.params.id} tidak ditemukan`);
    }
    res.json({ success: true, data: item });
  });

  // POST /  → menambah data (INSERT)
  const create = asyncHandler(async (req, res) => {
    const item = await service.create(req.body);
    res.status(201).json({
      success: true,
      message: `${label} berhasil ditambahkan`,
      data: item,
    });
  });

  // PUT/PATCH /:id  → mengubah data (UPDATE)
  const update = asyncHandler(async (req, res) => {
    const item = await service.update(req.params.id, req.body);
    if (!item) {
      throw new ApiError(404, `${label} dengan id ${req.params.id} tidak ditemukan`);
    }
    res.json({
      success: true,
      message: `${label} berhasil diperbarui`,
      data: item,
    });
  });

  // DELETE /:id  → menghapus data (DELETE)
  const remove = asyncHandler(async (req, res) => {
    const ok = await service.remove(req.params.id);
    if (!ok) {
      throw new ApiError(404, `${label} dengan id ${req.params.id} tidak ditemukan`);
    }
    res.json({ success: true, message: `${label} berhasil dihapus` });
  });

  return { list, detail, create, update, remove };
}
