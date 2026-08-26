# Video Belajar — Backend REST API (Edu Course)

Backend **Express.js + MySQL** untuk aplikasi Video Belajar. Dibangun sebagai implementasi **Mission Intermediate Backend 1A**: menghubungkan database ke Node.js, menerapkan **DML** (SELECT, INSERT, UPDATE, DELETE), membangun **REST API** (GET, POST, PATCH/PUT, DELETE), dan mengujinya dengan **Postman**.

Skema database mengikuti ERD 15 tabel yang sudah dibuat di mission sebelumnya (users, tutors, categories, courses, modules, materials, quiz_questions, pretests, pretest_questions, orders, order_items, payments, enrollments, material_progress, reviews).

---

## 1. Prasyarat

| Kebutuhan | Versi minimal |
|---|---|
| Node.js | 18+ (disarankan 20/22) |
| MySQL   | 8.0+ (atau MariaDB 10.4+) |
| npm     | bawaan Node |

---

## 2. Instalasi (Langkah Pertama: Connecting to Database)

```bash
# 1. Masuk ke folder backend
cd backend

# 2. Unduh/instal library yang dibutuhkan (express, mysql2, cors, dotenv, morgan)
npm install

# 3. Salin file konfigurasi environment lalu sesuaikan
cp .env.example .env      # Windows PowerShell: copy .env.example .env
```

Buka file `.env` dan sesuaikan dengan konfigurasi MySQL kamu:

```env
PORT=4000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=passwordmu
DB_NAME=videobelajar
CORS_ORIGIN=http://localhost:5173
```

> `mysql2` adalah driver MySQL untuk Node.js. Koneksi dibuat sekali sebagai **connection pool** di `src/config/db.js`, lalu dipakai ulang oleh semua service.

---

## 3. Menyiapkan Database (schema + seed)

Script sudah disediakan di `package.json`. Pastikan MySQL server sudah berjalan lalu jalankan:

```bash
# Membuat database "videobelajar" + 15 tabel (schema.sql)
npm run db:schema

# Mengisi data contoh ke semua tabel (seed.sql)
npm run db:seed

# Atau sekaligus keduanya (reset ulang dari nol)
npm run db:reset
```

Alternatif manual (mis. lewat MySQL Workbench / phpMyAdmin / CLI): jalankan isi
`db/schema.sql` lalu `db/seed.sql`.

> Nama database default adalah **`videobelajar`** (didefinisikan di `db/schema.sql`
> dan `DB_NAME` pada `.env` — keduanya harus sama).

---

## 4. Menjalankan Server

```bash
npm run dev     # mode development (auto-restart saat file berubah)
# atau
npm start       # mode biasa
```

Jika berhasil, muncul:

```
✅ Database MySQL terhubung
🚀 Server berjalan di http://localhost:4000
📚 Dokumentasi endpoint: http://localhost:4000/api
```

Cek cepat di browser / curl:

- `http://localhost:4000/health` → status server
- `http://localhost:4000/api` → daftar semua endpoint
- `http://localhost:4000/api/courses` → daftar kelas

---

## 5. Daftar Endpoint (Langkah Ketiga: REST API)

Setiap resource memiliki **6 endpoint CRUD** yang seragam. Base URL: `http://localhost:4000/api`.

| Method | Endpoint | Keterangan | Service DML |
|---|---|---|---|
| GET    | `/{resource}`      | Ambil semua data (+ filter & paginasi) | SELECT |
| GET    | `/{resource}/:id`  | Ambil satu data berdasarkan id | SELECT by id |
| POST   | `/{resource}`      | Tambah data baru | INSERT |
| PUT    | `/{resource}/:id`  | Ubah data (kirim field yang mau diganti) | UPDATE |
| PATCH  | `/{resource}/:id`  | Ubah sebagian data | UPDATE |
| DELETE | `/{resource}/:id`  | Hapus data berdasarkan id | DELETE |

**15 resource yang tersedia:**

`users`, `tutors`, `categories`, `courses`, `modules`, `materials`,
`quiz-questions`, `pretests`, `pretest-questions`, `orders`, `order-items`,
`payments`, `enrollments`, `material-progress`, `reviews`.

### Contoh untuk resource utama `courses` (Edu Course)

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/courses` | List semua kelas (JOIN tutor & kategori) |
| GET | `/api/courses/:id` | Satu kelas berdasarkan id |
| GET | `/api/courses?category_id=1&status=published` | Filter berdasarkan atribut |
| POST | `/api/courses` | Tambah kelas |
| PATCH | `/api/courses/:id` | Ubah sebagian data kelas |
| DELETE | `/api/courses/:id` | Hapus kelas |

**Query param yang didukung pada GET list:** filter berdasarkan kolom tertentu
(mis. `?status=published`, `?category_id=1`, `?user_id=5`), plus `?limit=` &
`?offset=` untuk paginasi.

### Contoh request body POST `/api/courses`

```json
{
  "category_id": 2,
  "tutor_id": 3,
  "title": "Belajar Node.js REST API",
  "slug": "belajar-nodejs-rest-api",
  "description": "Kelas backend Express + MySQL",
  "price": 150000,
  "status": "published"
}
```

### Bentuk response

Sukses:

```json
{ "success": true, "count": 9, "data": [ ... ] }
{ "success": true, "message": "Course berhasil ditambahkan", "data": { ... } }
```

Error (contoh 404 / 400 / 409):

```json
{ "success": false, "message": "Course dengan id 99 tidak ditemukan" }
```

---

## 6. Pengujian dengan Postman (Langkah Keempat: Testing)

1. Buka Postman → **Import** → pilih file **`postman_collection.json`** (ada di
   folder ini).
2. Collection **"Video Belajar API (Edu Course)"** berisi 16 folder (Root/Health
   + 15 resource) dengan total ±94 request siap pakai.
3. Variable `{{baseUrl}}` sudah diset ke `http://localhost:4000/api`. Ubah bila
   port/host berbeda (Collection → Variables).
4. Jalankan request per folder untuk menguji GET / POST / PUT / PATCH / DELETE.

> Tip: jalankan `POST` dulu untuk membuat data, catat `id` dari response, lalu
> pakai id itu pada request `GET by id` / `PATCH` / `DELETE`.

---

## 7. Struktur Proyek

```
backend/
├── db/
│   ├── schema.sql          # DDL 15 tabel (Langkah Pertama)
│   └── seed.sql            # data contoh
├── scripts/
│   └── runSql.js           # runner untuk mengeksekusi file .sql
├── src/
│   ├── config/
│   │   ├── env.js          # memuat variabel .env
│   │   └── db.js           # koneksi mysql2 (connection pool)
│   ├── services/           # LANGKAH KEDUA: DML (SELECT/INSERT/UPDATE/DELETE)
│   │   ├── baseService.js  # factory CRUD (query SQL parameterized)
│   │   ├── courses.service.js  # service courses + JOIN
│   │   └── index.js        # registry 15 resource
│   ├── controllers/
│   │   └── baseController.js    # handler HTTP (bentuk response)
│   ├── routes/             # LANGKAH KETIGA: REST API
│   │   ├── crudRouter.js   # 6 endpoint CRUD per resource
│   │   └── index.js        # memasang semua resource ke /api
│   ├── middlewares/
│   │   ├── notFound.js     # 404
│   │   └── errorHandler.js # penanganan error terpusat (termasuk error MySQL)
│   ├── utils/
│   │   ├── ApiError.js
│   │   └── asyncHandler.js
│   ├── app.js              # konfigurasi Express + middleware
│   └── server.js           # titik masuk (start server)
├── postman_collection.json # koleksi Postman untuk testing
├── .env.example
└── package.json
```

---

## 8. Catatan Keamanan & Praktik Baik

- Semua query memakai **prepared statement** (`?`) sehingga aman dari **SQL Injection**.
- Kredensial database disimpan di **`.env`** (tidak di-hardcode, dan `.env` diabaikan git).
- Error database umum (duplikat unik, foreign key, kolom wajib kosong, nilai ENUM salah)
  diterjemahkan otomatis ke HTTP status yang sesuai (409 / 400) oleh `errorHandler`.
- `password_hash` pada seed hanya contoh — di produksi gunakan hashing (mis. bcrypt).

---

## 9. Menghubungkan ke Frontend (opsional)

Frontend React saat ini memakai `VITE_API_BASE_URL`. Untuk memakai backend ini,
ubah `.env` frontend menjadi:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Endpoint `/courses` pada backend kompatibel dengan pola pemanggilan di
`src/services/api/courseService.js` (GET, GET by id, POST, PUT, DELETE).

---

*Dibuat untuk Mission Intermediate Backend 1A — Aplikasi Video Belajar (Edu Course).*
