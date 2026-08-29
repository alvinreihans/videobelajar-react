// ─── Router /api/upload ──────────────────────────────────────────────
import { Router } from 'express';
import { uploadImage } from '../middlewares/upload.middleware.js';
import * as uploadController from '../controllers/upload.controller.js';

const router = Router();

// Terima payload file (field "file") lalu proses lewat controller.
router.post('/', uploadImage, uploadController.uploadFile);

export default router;
