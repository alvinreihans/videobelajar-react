// ─── Controller Upload ───────────────────────────────────────────────
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { APP_URL } from '../config/env.js';

// POST /api/upload  → menerima file gambar & mengembalikan URL akses.
export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'File tidak ditemukan. Kirim file pada field "file"');
  }
  const url = `${APP_URL}/uploads/${req.file.filename}`;
  res.status(201).json({
    success: true,
    message: 'File berhasil diunggah',
    data: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url,
    },
  });
});
