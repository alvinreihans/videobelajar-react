# Video Belajar — Backend REST API (Edu Course)

Backend **Express.js + MySQL** untuk aplikasi Video Belajar. Selain CRUD 15 resource (ERD), backend ini melengkapi **Mission Intermediate Backend** dengan: **autentikasi** (register + login), **JWT middleware**, **query params** (filter, sort, search), **verifikasi email**, dan **upload gambar**.

> Bagian dari monorepo: frontend (React) ada di `../frontend`, backend ini di `backend/`.

---

## 1. Prasyarat

| Kebutuhan | Versi |
|---|---|
| Node.js | 18+ (disarankan 20/22) |
| MySQL / MariaDB | MySQL 8.0+ atau MariaDB 10.1+ |
| npm | bawaan Node |

> Kolom `options` pada `quiz_questions` & `pretest_questions` memakai tipe **`LONGTEXT`** (menyimpan string JSON) agar kompatibel dengan MariaDB 10.1 yang belum mendukung tipe `JSON` native.

---

## 2. Instalasi

```bash
cd backend
npm install                 # express, mysql2, cors, dotenv, morgan,
                            # bcryptjs, jsonwebtoken, nodemailer, uuid, multer
cp .env.example .env        # Windows PowerShell: copy .env.example .env
```

Sesuaikan `.env`:

```env
# Server
PORT=4000
NODE_ENV=development
APP_URL=http://localhost:4000        # dipakai untuk link verifikasi email

# Database MySQL
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=videobelajar

# CORS (asal frontend)
CORS_ORIGIN=http://localhost:5173

# Autentikasi (JWT)
JWT_SECRET=ganti-dengan-string-acak-yang-panjang
JWT_EXPIRES_IN=1d

# Email (nodemailer) — kosongkan MAIL_HOST untuk memakai akun uji Ethereal
MAIL_HOST=
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=
MAIL_PASS=
MAIL_FROM="Video Belajar <no-reply@videobelajar.test>"

# Upload
UPLOAD_DIR=uploads
UPLOAD_MAX_SIZE=2097152               # 2 MB
```

---

## 3. Menyiapkan Database (schema + seed)

Pastikan MySQL berjalan, lalu:

```bash
npm run db:schema     # buat database "videobelajar" + tabel (schema.sql)
npm run db:seed       # isi data contoh (seed.sql)
npm run db:reset      # keduanya sekaligus (reset dari nol)
```

> `npm run db:reset` **menghapus (TRUNCATE) lalu mengisi ulang** semua tabel — akun yang kamu daftarkan lewat aplikasi akan ikut terhapus.

---

## 4. Menjalankan Server

```bash
npm run dev     # development (auto-restart)
npm start       # biasa
```

Berhasil bila muncul:

```
✅ Database MySQL terhubung
🚀 Server berjalan di http://localhost:4000
📚 Dokumentasi endpoint: http://localhost:4000/api
```

---

## 5. Autentikasi

Base URL: `http://localhost:4000/api`.

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/auth/register` | Daftar user baru (password di-hash `bcrypt`, kirim email verifikasi) |
| POST | `/auth/login` | Login → mengembalikan **token JWT** |
| GET  | `/auth/verify-email?token=...` | Verifikasi email via token |

### Register — `POST /api/auth/register`

Body (`username` opsional; bila kosong dibuat otomatis dari email):

```json
{ "fullname": "Test User", "email": "test@mail.com", "phone": "0812", "password": "rahasia123" }
```

Respons `201`:

```json
{
  "success": true,
  "message": "Registrasi berhasil. Silakan cek email untuk verifikasi.",
  "data": { "id": 8, "full_name": "Test User", "username": "test", "email": "test@mail.com", "role": "student" },
  "emailPreviewUrl": "https://ethereal.email/message/..."
}
```

`password_hash` & `verification_token` tidak pernah ikut di respons. Email duplikat → `409`.

### Login — `POST /api/auth/login`

```json
{ "email": "test@mail.com", "password": "rahasia123" }
```

Respons `200`:

```json
{ "success": true, "message": "Login berhasil", "token": "<JWT>", "data": { ... } }
```

Email tidak ditemukan **atau** password salah → `401` dengan pesan generik `"Email atau password salah"` (tidak membocorkan email mana yang terdaftar).

---

## 6. Endpoint Terproteksi (JWT Middleware)

Endpoint tertentu memerlukan token pada header:

```
Authorization: Bearer <token>
```

Middleware `verifyToken` memeriksa token dengan `jwt.verify`. Token tidak ada / tidak valid → `401` (`"Autentikasi gagal ..."`); valid → request diteruskan.

Contoh yang diproteksi (sesuai mission): **`GET /api/courses`**.

```bash
curl http://localhost:4000/api/courses -H "Authorization: Bearer <TOKEN>"
```

> Proteksi diatur per-resource di `src/routes/index.js` (objek `guards`), mis. `{ courses: { list: [verifyToken] } }` — mudah dipindah/ditambah ke endpoint lain.

### Pendamping publik — `/api/public`

Karena `GET /api/courses` dijaga JWT, halaman katalog frontend (Beranda & Semua Kelas)
yang boleh dibuka pengunjung **tanpa login** memakai jalur baca-saja berikut:

| Method | Endpoint | Token | Keterangan |
|---|---|---|---|
| GET | `/api/public/courses` | — | Daftar kelas untuk katalog publik (query params tetap berlaku) |
| GET | `/api/public/courses/:id` | — | Detail satu kelas |
| GET | `/api/public/categories` | — | Data referensi kategori (nama & slug) |

```bash
curl http://localhost:4000/api/public/courses    # 200, tanpa token
curl http://localhost:4000/api/courses           # 401, butuh token
```

Jadi `/api/public/*` melayani pembacaan publik, sementara `/api/courses` tetap
terproteksi sebagai bukti penerapan middleware (Langkah Keempat). Jalur publik
sengaja **hanya** menyediakan `GET` — semua tambah/ubah/hapus tetap lewat
resource terproteksi.

---

## 7. CRUD 15 Resource

Setiap resource punya 6 endpoint seragam (base `/api`):

| Method | Endpoint | DML |
|---|---|---|
| GET | `/{resource}` | SELECT (list) |
| GET | `/{resource}/:id` | SELECT by id |
| POST | `/{resource}` | INSERT |
| PUT / PATCH | `/{resource}/:id` | UPDATE |
| DELETE | `/{resource}/:id` | DELETE |

Resource: `users`, `tutors`, `categories`, `courses`, `modules`, `materials`, `quiz-questions`, `pretests`, `pretest-questions`, `orders`, `order-items`, `payments`, `enrollments`, `material-progress`, `reviews`.

---

## 8. Query Params: Filter, Sort, Search

Pada endpoint list (mis. `GET /api/courses`):

| Jenis | Param | Contoh | SQL |
|---|---|---|---|
| **Filter** | nama kolom | `?status=published&category_id=2` | `WHERE col = ?` |
| **Filter (courses)** | `topic` | `?topic=desain,bisnis` | `WHERE cat.slug IN (?, ?)` |
| **Sort** | `sortBy` + `order` | `?sortBy=price&order=asc` | `ORDER BY col ASC/DESC` |
| **Search** | `search` | `?search=react` | `WHERE (colA LIKE ? OR ...)` |
| **Paginasi** | `limit`, `offset` | `?limit=10&offset=0` | `LIMIT ? OFFSET ?` |

Contoh gabungan:

```
GET /api/courses?topic=desain,bisnis&search=ui&sortBy=rating&order=desc&limit=6
```

- Kolom untuk **sort** dibatasi *whitelist* per-resource (aman dari SQL injection).
- `topic` menerima beberapa slug dipisah koma. Satu nilai tetap sah (`?topic=desain`),
  jumlah placeholder `?` mengikuti jumlah nilai sehingga tetap prepared statement.
- `courses` mendukung sort: `price`, `rating`, `students`, `title`, `newest`, `id`; search di judul/deskripsi/nama tutor.

---

## 9. Verifikasi Email (nodemailer + uuid)

Saat register, sebuah token `uuid` dibuat & disimpan, lalu email verifikasi dikirim.

- **Tanpa konfigurasi SMTP** (`MAIL_HOST` kosong): otomatis memakai **akun uji Ethereal** — email tidak benar-benar terkirim, tapi muncul **preview URL** di console backend (dan pada field `emailPreviewUrl` respons register).
- **Email sungguhan:** isi `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS` (mis. SMTP Gmail) di `.env` — kode otomatis memakainya.

Verifikasi: `GET /api/auth/verify-email?token=<token>`
- token tidak ditemukan → `"Invalid Verification Token"`
- berhasil → `"Email Verified Successfully"` (kolom `is_verified` di-set & token dihapus)

---

## 10. Upload Gambar (multer)

| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/upload` | `form-data`, field **`file`** (gambar) |

- File disimpan ke folder `uploads/` dengan nama unik.
- Hanya menerima gambar (`jpg/png/webp/gif`), maksimal `UPLOAD_MAX_SIZE` (default 2 MB) — selain itu `400`.
- Respons `201` memuat `url` file, dan file dapat diakses via `GET /uploads/<nama-file>`.

```json
{ "success": true, "message": "File berhasil diunggah",
  "data": { "filename": "foto-1699....png", "size": 12345, "url": "http://localhost:4000/uploads/foto-1699....png" } }
```

---

## 11. Pengujian dengan Postman

1. **Import** `postman_collection.json`.
2. Folder **Auth** (Register, Login, Verify Email) & **Upload** sudah tersedia, selain 15 resource CRUD.
3. Request **Login** punya *test-script* yang otomatis menyimpan `token` ke variable `{{token}}`.
4. Request yang terproteksi (mis. `GET /courses`) sudah memakai header `Authorization: Bearer {{token}}` — jalankan **Login** dulu, lalu request lain.

---

## 12. Struktur Proyek

```
backend/
├── db/
│   ├── schema.sql              # DDL 15 tabel (users + kolom username, is_verified, verification_token)
│   └── seed.sql                # data contoh
├── scripts/runSql.js           # runner file .sql
├── src/
│   ├── config/{env.js, db.js}  # env & koneksi mysql2 (pool)
│   ├── services/
│   │   ├── baseService.js       # factory CRUD (parameterized)
│   │   ├── courses.service.js   # courses + JOIN
│   │   ├── auth.service.js      # register / login / verifyEmail
│   │   ├── mail.service.js      # nodemailer (Ethereal fallback)
│   │   └── index.js             # registry 15 resource
│   ├── controllers/{baseController.js, auth.controller.js, upload.controller.js}
│   ├── routes/
│   │   ├── crudRouter.js        # 6 endpoint CRUD + guard opsional
│   │   ├── auth.routes.js       # /auth/*
│   │   ├── upload.routes.js     # /upload
│   │   └── index.js             # merangkai /api + guards
│   ├── middlewares/
│   │   ├── auth.middleware.js    # verifyToken (JWT)
│   │   ├── upload.middleware.js  # multer
│   │   ├── notFound.js
│   │   └── errorHandler.js
│   ├── utils/{ApiError.js, asyncHandler.js, queryBuilder.js}
│   ├── app.js
│   └── server.js
├── uploads/                     # hasil upload (di-ignore git, kecuali .gitkeep)
├── postman_collection.json
├── .env.example
└── package.json
```

---

## 13. Keamanan & Praktik Baik

- Semua query memakai **prepared statement** (`?`) → aman **SQL Injection**; kolom sort dibatasi **whitelist**.
- Password disimpan sebagai **hash bcrypt** (tidak pernah plaintext).
- Token JWT ditandatangani dengan `JWT_SECRET` dari `.env`.
- Kredensial di **`.env`** (di-ignore git); `.env.example` sebagai template.
- Error DB umum (duplikat unik, FK, kolom wajib, ENUM salah) diterjemahkan otomatis ke HTTP status yang sesuai.

---

## 14. Menghubungkan ke Frontend

Frontend (`../frontend`) diarahkan ke backend ini lewat `VITE_API_BASE_URL=http://localhost:4000/api`. Autentikasi (register & login) sudah tersambung: token JWT disimpan di `localStorage` dan otomatis disisipkan ke header oleh `axiosClient`.

---

*Mission Intermediate Backend — Aplikasi Video Belajar (Edu Course).*
