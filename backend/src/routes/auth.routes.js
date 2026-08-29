// ─── Router /api/auth ────────────────────────────────────────────────
// Endpoint autentikasi: register (dan menyusul login & verify-email).
import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify-email', authController.verifyEmail);

export default router;
