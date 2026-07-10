# Alexa Computindo Group — Backend Express.js & CMS API

Backend REST API untuk manajemen konten website **PT. Alexa Computindo Group** dibangun dengan **Express.js (ESM)**, **Prisma ORM**, dan sistem **Role & Permission (RBAC)**.

---

## 🚀 Panduan Memulai Cepat

### 1. Instalasi Dependensi
Jalankan perintah berikut di dalam direktori `backend-express`:
```bash
npm install
```

### 2. Konfigurasi Environment & Database
Secara default, project dikonfigurasi menggunakan **SQLite** (`file:./dev.db`) agar langsung siap dijalankan tanpa perlu instalasi server database eksternal.

Jika ingin beralih ke MySQL/PostgreSQL:
1. Ubah `provider = "sqlite"` menjadi `provider = "mysql"` atau `provider = "postgresql"` di file `prisma/schema.prisma`.
2. Ubah `DATABASE_URL` di file `.env`.

### 3. Migrasi & Seeding Database
Jalankan perintah berikut untuk membuat skema database dan mengisi data awal (termasuk Super Admin dan data konten website frontend):
```bash
npm run prisma:migrate
npm run prisma:seed
```

### 4. Jalankan Server
Untuk mode development (dengan auto-reload Nodemon):
```bash
npm run dev
```
Server akan berjalan di: `http://localhost:4000/api`
Admin Panel UI di: `http://localhost:4000/admin`

---

## 🔐 Akun Super Admin Default (Hasil Seeding)
- **Email:** `admin@alexagroup.co.id`
- **Password:** `admin123`

---

## 📚 Struktur Direktori
```
backend-express/
├── prisma/
│   ├── schema.prisma       # Skema Database (RBAC + CMS)
│   └── seed.js             # Seeder data awal & akun Super Admin
├── src/
│   ├── controllers/        # Controller untuk penanganan logika API
│   ├── middlewares/        # Middleware Auth JWT, RBAC & Error Handling
│   ├── routes/             # Definisi Endpoint API (/api/auth, /api/articles, dll)
│   ├── app.js              # Konfigurasi aplikasi Express
│   └── server.js           # Entry point server HTTP
├── .env                    # Variabel environment lokal
└── package.json
```
