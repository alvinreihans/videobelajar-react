// ─── Runner SQL ──────────────────────────────────────────────────────
// Menjalankan file .sql (schema / seed) ke database. Memakai koneksi dengan
// `multipleStatements: true` agar seluruh perintah dalam satu file bisa
// dieksekusi sekaligus.
//
// Pemakaian:  node scripts/runSql.js db/schema.sql
import fs from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';
import { dbConfig } from '../src/config/env.js';

async function main() {
  const fileArg = process.argv[2];
  if (!fileArg) {
    console.error('Pemakaian: node scripts/runSql.js <path-file.sql>');
    process.exit(1);
  }

  const filePath = path.resolve(process.cwd(), fileArg);
  const sql = await fs.readFile(filePath, 'utf8');

  // Koneksi TANPA memilih database dulu (schema.sql yang akan CREATE DATABASE
  // & USE). multipleStatements diaktifkan khusus untuk runner ini.
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    multipleStatements: true,
  });

  try {
    console.log(`▶  Menjalankan ${fileArg} ...`);
    await connection.query(sql);
    console.log(`✅ Selesai: ${fileArg}`);
  } catch (err) {
    console.error(`❌ Gagal menjalankan ${fileArg}:`, err.message);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

main();
