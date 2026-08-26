// ─── Konfigurasi Aplikasi Express ────────────────────────────────────
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import apiRouter from './routes/index.js';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';
import { corsOrigin, NODE_ENV } from './config/env.js';

const app = express();

// ── Middleware global ──────────────────────────────────────────────
app.use(cors({
  origin: corsOrigin === '*' ? true : corsOrigin.split(',').map((o) => o.trim()),
}));
app.use(express.json());                 // parse body JSON → req.body
app.use(express.urlencoded({ extended: true }));
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));                // logging request di mode dev
}

// ── Health check ───────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Video Belajar API aktif 🚀',
    docs: '/api',
  });
});

app.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok', uptime: process.uptime() });
});

// ── Semua endpoint resource ada di bawah /api ──────────────────────
app.use('/api', apiRouter);

// ── Penanganan 404 & error (harus paling akhir) ────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
