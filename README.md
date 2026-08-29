# Video Belajar (Edu Course) — Monorepo

Repositori ini berisi dua aplikasi yang berdiri sejajar:

| Folder      | Aplikasi                                   | Stack                         |
|-------------|--------------------------------------------|-------------------------------|
| `frontend/` | Aplikasi web pembelajaran (SPA)            | React + Vite + Tailwind CSS   |
| `backend/`  | REST API                                   | Express.js + MySQL (mysql2)   |

## Menjalankan

### Frontend
```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

### Backend
```bash
cd backend
npm install
cp .env.example .env   # sesuaikan kredensial MySQL & JWT_SECRET
npm run db:reset       # buat schema + data seed
npm run dev            # http://localhost:4000
```

Konfigurasi `.gitignore` dipusatkan di root repo ini dan berlaku untuk kedua folder.
