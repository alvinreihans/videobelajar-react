// ─── Middleware Upload (multer) ──────────────────────────────────────
// Mengonfigurasi multer untuk menerima satu file gambar pada field "file",
// menyimpannya ke folder uploads/, membatasi tipe (hanya gambar) & ukuran.
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadConfig } from '../config/env.js';
import ApiError from '../utils/ApiError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Folder tujuan penyimpanan file (dibuat otomatis bila belum ada).
export const uploadDir = path.resolve(__dirname, '../../', uploadConfig.dir);
fs.mkdirSync(uploadDir, { recursive: true });

// Simpan ke disk dengan nama unik: <nama-asli-disanitasi>-<timestamp>.<ext>
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base =
      path
        .basename(file.originalname, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40) || 'image';
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

// Hanya izinkan berkas gambar.
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
function fileFilter(req, file, cb) {
  if (ALLOWED.includes(file.mimetype)) return cb(null, true);
  cb(new ApiError(400, 'Hanya file gambar (jpg, png, webp, gif) yang diperbolehkan'));
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: uploadConfig.maxSize },
});

// Bungkus multer agar error (tipe/ukuran) diubah menjadi ApiError 400 yang rapi.
export function uploadImage(req, res, next) {
  upload.single('file')(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      const msg =
        err.code === 'LIMIT_FILE_SIZE'
          ? `Ukuran file melebihi batas ${Math.round(uploadConfig.maxSize / 1024 / 1024)}MB`
          : err.message;
      return next(new ApiError(400, msg));
    }
    return next(err.statusCode ? err : new ApiError(400, err.message));
  });
}

export default { uploadImage };
