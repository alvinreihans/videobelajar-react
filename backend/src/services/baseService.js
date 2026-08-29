// ─── Data Manipulation Language (DML) — Factory Service ──────────────
// Factory yang menghasilkan satu set service DML (SELECT, INSERT, UPDATE,
// DELETE) untuk sebuah tabel. Semua query memakai prepared statement (`?`)
// sehingga aman dari SQL Injection.
//
// Logika bangun-query untuk daftar data (filter, sort, search, paginasi)
// dipusatkan di utils/queryBuilder.js agar tidak diulang di tiap service.
import pool, { query } from '../config/db.js';
import ApiError from '../utils/ApiError.js';
import { buildListClauses } from '../utils/queryBuilder.js';

// Ubah object/array menjadi string JSON untuk kolom bertipe JSON.
function normalizeValue(value, isJson) {
  if (value === undefined) return null;
  if (isJson && value !== null && typeof value === 'object') {
    return JSON.stringify(value);
  }
  return value;
}

export function createCrudService({
  table,
  fillable = [],
  searchable = [],        // kolom untuk FILTER (WHERE `col` = ?)
  sortable = ['id'],      // kolom yang boleh dipakai SORT (?sortBy=)
  likeable = [],          // kolom teks untuk SEARCH (?search=, memakai LIKE)
  jsonColumns = [],
  defaultOrder = 'id DESC',
}) {
  const jsonSet = new Set(jsonColumns);
  const quote = (c) => `\`${c}\``;

  // ── SELECT (semua data) — mendukung filter, sort, search, & paginasi ──
  async function getAll(filters = {}) {
    const { whereSql, params, orderSql, limitSql } = buildListClauses(filters, {
      columns: Object.fromEntries(searchable.map((c) => [c, quote(c)])),
      filterKeys: searchable,
      sortable: Object.fromEntries(sortable.map((c) => [c, quote(c)])),
      likeColumns: likeable.map(quote),
      defaultOrder,
    });
    const sql = `SELECT * FROM ${quote(table)} ${whereSql} ${orderSql} ${limitSql}`;
    return query(sql, params);
  }

  // ── SELECT by id ──
  async function getById(id) {
    const rows = await query(
      `SELECT * FROM ${quote(table)} WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  }

  // ── SELECT by atribut lain (mis. by email, by slug) ──
  async function getBy(column, value) {
    if (!searchable.includes(column) && column !== 'id') {
      throw new ApiError(400, `Kolom '${column}' tidak bisa dijadikan filter`);
    }
    return query(`SELECT * FROM ${quote(table)} WHERE ${quote(column)} = ?`, [value]);
  }

  // ── INSERT ──
  async function create(data) {
    const columns = fillable.filter((c) => data[c] !== undefined);
    if (columns.length === 0) {
      throw new ApiError(400, 'Tidak ada field valid yang dikirim untuk disimpan');
    }
    const placeholders = columns.map(() => '?').join(', ');
    const values = columns.map((c) => normalizeValue(data[c], jsonSet.has(c)));
    const columnList = columns.map(quote).join(', ');

    const [result] = await pool.execute(
      `INSERT INTO ${quote(table)} (${columnList}) VALUES (${placeholders})`,
      values
    );
    return getById(result.insertId);
  }

  // ── UPDATE ──
  async function update(id, data) {
    const columns = fillable.filter((c) => data[c] !== undefined);
    if (columns.length === 0) {
      throw new ApiError(400, 'Tidak ada field valid yang dikirim untuk diperbarui');
    }
    const setSql = columns.map((c) => `${quote(c)} = ?`).join(', ');
    const values = columns.map((c) => normalizeValue(data[c], jsonSet.has(c)));

    const [result] = await pool.execute(
      `UPDATE ${quote(table)} SET ${setSql} WHERE id = ?`,
      [...values, id]
    );
    if (result.affectedRows === 0) return null;
    return getById(id);
  }

  // ── DELETE ──
  async function remove(id) {
    const [result] = await pool.execute(
      `DELETE FROM ${quote(table)} WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }

  return {
    table, fillable, searchable, sortable, likeable,
    getAll, getById, getBy, create, update, remove,
  };
}
