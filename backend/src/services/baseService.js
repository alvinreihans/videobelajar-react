// ─── LANGKAH KEDUA: Implementing Data Manipulation Language (DML) ─────
// Factory yang menghasilkan satu set service DML (SELECT, INSERT, UPDATE,
// DELETE) untuk sebuah tabel. Semua query memakai prepared statement (`?`)
// sehingga aman dari SQL Injection.
//
// Dengan pola factory ini, setiap tabel cukup memberi "konfigurasi" (nama
// tabel, kolom yang boleh diisi, kolom yang boleh difilter) tanpa menulis
// ulang query yang sama berkali-kali — tetapi SQL mentahnya tetap terlihat
// jelas di sini untuk tujuan pembelajaran.
import pool, { query } from '../config/db.js';
import ApiError from '../utils/ApiError.js';

// Mengubah nilai object/array menjadi string JSON untuk kolom bertipe JSON,
// dan Date menjadi string. Nilai lain dibiarkan apa adanya.
function normalizeValue(value, isJson) {
  if (value === undefined) return null;
  if (isJson && value !== null && typeof value === 'object') {
    return JSON.stringify(value);
  }
  return value;
}

// Membersihkan angka untuk LIMIT/OFFSET (di-inline sebagai integer, bukan
// placeholder, karena sebagian versi MySQL menolak `?` pada LIMIT).
function toInt(value, fallback, max) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n) || n < 0) return fallback;
  return max ? Math.min(n, max) : n;
}

export function createCrudService({
  table,
  fillable = [],
  searchable = [],
  jsonColumns = [],
  defaultOrder = 'id DESC',
}) {
  const jsonSet = new Set(jsonColumns);

  // ── SELECT (semua data) ───────────────────────────────────────────
  // Mendukung filter dinamis lewat query-param (mis. ?status=published),
  // serta paginasi lewat ?limit= & ?offset=.
  async function getAll(filters = {}) {
    const conditions = [];
    const params = [];

    for (const column of searchable) {
      const value = filters[column];
      if (value !== undefined && value !== '') {
        conditions.push(`\`${column}\` = ?`);
        params.push(value);
      }
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = toInt(filters.limit, 100, 200);
    const offset = toInt(filters.offset, 0);

    const sql =
      `SELECT * FROM \`${table}\` ${whereSql} ` +
      `ORDER BY ${defaultOrder} LIMIT ${limit} OFFSET ${offset}`;
    return query(sql, params);
  }

  // ── SELECT by id (satu data berdasarkan primary key) ──────────────
  async function getById(id) {
    const rows = await query(
      `SELECT * FROM \`${table}\` WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  }

  // ── SELECT by atribut lain (mis. by email, by slug) ───────────────
  async function getBy(column, value) {
    if (!searchable.includes(column) && column !== 'id') {
      throw new ApiError(400, `Kolom '${column}' tidak bisa dijadikan filter`);
    }
    return query(
      `SELECT * FROM \`${table}\` WHERE \`${column}\` = ?`,
      [value]
    );
  }

  // ── INSERT (menambahkan data baru) ────────────────────────────────
  async function create(data) {
    const columns = fillable.filter((c) => data[c] !== undefined);
    if (columns.length === 0) {
      throw new ApiError(400, 'Tidak ada field valid yang dikirim untuk disimpan');
    }
    const placeholders = columns.map(() => '?').join(', ');
    const values = columns.map((c) => normalizeValue(data[c], jsonSet.has(c)));
    const columnList = columns.map((c) => `\`${c}\``).join(', ');

    const [result] = await pool.execute(
      `INSERT INTO \`${table}\` (${columnList}) VALUES (${placeholders})`,
      values
    );
    return getById(result.insertId);
  }

  // ── UPDATE (mengubah data spesifik by id) ─────────────────────────
  async function update(id, data) {
    const columns = fillable.filter((c) => data[c] !== undefined);
    if (columns.length === 0) {
      throw new ApiError(400, 'Tidak ada field valid yang dikirim untuk diperbarui');
    }
    const setSql = columns.map((c) => `\`${c}\` = ?`).join(', ');
    const values = columns.map((c) => normalizeValue(data[c], jsonSet.has(c)));

    const [result] = await pool.execute(
      `UPDATE \`${table}\` SET ${setSql} WHERE id = ?`,
      [...values, id]
    );
    if (result.affectedRows === 0) return null;
    return getById(id);
  }

  // ── DELETE (menghapus data spesifik by id) ────────────────────────
  async function remove(id) {
    const [result] = await pool.execute(
      `DELETE FROM \`${table}\` WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }

  return { table, fillable, searchable, getAll, getById, getBy, create, update, remove };
}
