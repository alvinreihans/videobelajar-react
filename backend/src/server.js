// ─── Titik Masuk Server ──────────────────────────────────────────────
import app from './app.js';
import { PORT } from './config/env.js';
import { assertDatabaseConnection } from './config/db.js';

async function start() {
  try {
    // Pastikan database terhubung sebelum menerima request.
    await assertDatabaseConnection();
    console.log('✅ Database MySQL terhubung');

    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
      console.log(`📚 Dokumentasi endpoint: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('❌ Gagal terhubung ke database:', err.message);
    console.error('   Cek kembali konfigurasi di file .env (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME).');
    process.exit(1);
  }
}

start();
