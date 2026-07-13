# PANDUAN INTEGRASI API BACKEND (EXPRESS.JS) UNTUK FRONTEND (REACT)

Dokumen ini merupakan **panduan lengkap spesifikasi dan integrasi API** dari **Backend Express.js** (`/backend-express`) untuk dikonsumsi oleh aplikasi **Frontend React** (`/frontend`).

---

## 1. Informasi Dasar & Konfigurasi Lingkungan

### Base URL API
Secara default saat pengembangan lokal (*development*), server backend Express berjalan di *port* `4000`:
```text
http://localhost:4000/api
```

### Konfigurasi `.env` pada Frontend React
Pastikan pada direktori `/frontend` terdapat file `.env` atau `.env.local` dengan konfigurasi berikut:
```env
VITE_API_URL=http://localhost:4000/api
```

### CORS & kredensial (Credentials)
- **CORS Origin:** Backend telah dikonfigurasi mengizinkan request dari origin frontend lokal (`http://localhost:5173`).
- **Autentikasi API Token (WAJIB untuk Koneksi Frontend / Eksternal):** Seluruh request dari aplikasi Frontend React ke endpoint `/api/*` **wajib menyertakan header `X-API-KEY`** agar diizinkan oleh API Gateway Guard:
  ```http
  X-API-KEY: alexa_live_secret_api_token_2026
  ```
  *(Token rahasia pengembangan dapat dilihat & disalin pada menu **Profil Saya & Keamanan** di Admin Panel atau dikonfigurasi melalui variabel `.env` `API_TOKEN`).*
- **Autentikasi Cookie / JWT Admin:** Untuk pengoperasian dari dalam Admin UI, backend mendukung autentikasi **JWT di dalam HTTP-Only Cookie (`token`)** atau header `Authorization: Bearer <JWT>`.

---

## 2. Format Standar Respons API

Semua endpoint di bawah prefix `/api` mengembalikan data dalam format **JSON standar**:

### Respons Sukses (`HTTP 200 / 201`)
```json
{
  "success": true,
  "message": "Pesan sukses opsional",
  "data": {
    ...
  }
}
```

### Respons Gagal (`HTTP 400 / 401 / 403 / 404 / 500`)
```json
{
  "success": false,
  "message": "Deskripsi kesalahan yang terjadi"
}
```

---

## 3. Endpoint Publik untuk Website Frontend React

Berikut daftar endpoint publik yang **tidak memerlukan autentikasi** dan langsung digunakan oleh halaman-halaman website PT. Alexa Computindo Group:

---

### A. Konten Halaman Website (CMS Dinamis & Dedicated Table Architecture)

Arsitektur penyimpanan konten frontend kini menggunakan **Tabel Database Terpisah per Halaman (`PageHome`, `PageAbout`, `PageServices`, `PageContact`)** di skema Prisma. Hal ini menjamin tipe data yang eksplisit (*schema-driven*), performa query optimal, serta sinkronisasi otomatis (*dual-write*) dengan sistem administrasi CMS.

#### 1. Ambil Konten Spesifik Halaman
- **Method:** `GET`
- **URL:** `/api/pages/:pageName`
- **Parameter `:pageName`:**
  - `home` — Mengambil data dari tabel `PageHome` (Hero, Statistik 1-3, CTA Primary/Secondary, Judul Section Layanan & Klien, SEO metadata)
  - `about` — Mengambil data dari tabel `PageAbout` (Sejarah, Visi, Misi dalam bentuk array/JSON, Timeline, Tim Manajemen, SEO metadata)
  - `services` — Mengambil data dari tabel `PageServices` (Header, Subtitle, Judul Section Layanan & Testimoni, SEO metadata)
  - `contact` — Mengambil data dari tabel `PageContact` (Alamat Kantor, Telepon, Email, URL Embed Maps, Daftar FAQ, SEO metadata)

**Contoh Request:**
```http
GET http://localhost:4000/api/pages/home
```

**Contoh Respons (`200 OK` - `home`):**
```json
{
  "success": true,
  "data": {
    "seoTitle": "Beranda — PT. Alexa Computindo Group | Infrastruktur & Solusi Digital",
    "seoDescription": "PT. Alexa Computindo Group menyediakan solusi Media Digital, ISP Berkecepatan Tinggi, dan Arsitektur Perangkat Lunak untuk skala Enterprise di Indonesia.",
    "heroTitleLine1": "Membangun Infrastruktur",
    "heroTitleHighlight": "Digital Masa Depan",
    "heroDesc": "PT. Alexa Computindo Group menyediakan solusi Media Digital, ISP Berkecepatan Tinggi, dan Arsitektur Perangkat Lunak untuk skala Enterprise.",
    "ctaPrimaryText": "Eksplorasi Layanan",
    "ctaPrimaryLink": "/services",
    "ctaSecondaryText": "Pelajari Lebih Lanjut",
    "ctaSecondaryLink": "/about",
    "introTitle": "Fundamen Solid. Inovasi Tanpa Henti.",
    "introDesc": "Didirikan sejak tahun 2018, kami telah bertransformasi...",
    "stat1Number": "8+",
    "stat1Label": "Tahun Pengalaman",
    "stat2Number": "99.9%",
    "stat2Label": "Uptime Server",
    "stat3Number": "200+",
    "stat3Label": "Klien Enterprise",
    "servicesSectionTitle": "Divisi Utama Kami",
    "servicesSectionSubtitle": "Tiga pilar strategis yang menggerakkan ekosistem digital kami.",
    "clientsSectionTitle": "DIPERCAYA OLEH PERUSAHAAN TERKEMUKA",
    "articlesSectionTitle": "Berita & Insight"
  }
}
```

**Contoh Respons (`200 OK` - `about`):**
```json
{
  "success": true,
  "data": {
    "seoTitle": "Tentang Kami — PT. Alexa Computindo Group",
    "heroTitle": "TENTANG KAMI",
    "historyTitle": "Sejarah Perusahaan",
    "historyPar1": "Berdiri pada tahun 2018, kami memulai langkah sebagai perusahaan pengembangan perangkat lunak...",
    "timelineList": [
      { "year": "2018", "title": "PENDIRIAN WEBMEDIA", "desc": "Fokus awal pada arsitektur sistem informasi enterprise." },
      { "year": "2020", "title": "EKSPANSI INETMEDIA", "desc": "Memperoleh lisensi ISP nasional untuk infrastruktur jaringan." }
    ],
    "teamSectionTitle": "MANAJEMEN INTI",
    "teamList": [
      { "name": "Budi Santoso", "role": "Chief Executive Officer", "bio": "Berpengalaman 15 tahun di industri IT...", "image": "..." }
    ],
    "visionText": "Menjadi perusahaan teknologi dan media terdepan di Asia Tenggara...",
    "missionList": [
      "Menyediakan akses internet korporat berkecepatan tinggi dengan jaminan uptime 99.9%.",
      "Mengembangkan arsitektur perangkat lunak berskala enterprise yang aman dan efisien."
    ]
  }
}
```

#### 2. Ambil Semua Konten Halaman Sekaligus
- **Method:** `GET`
- **URL:** `/api/pages`
- **Keterangan:** Mengembalikan sebuah *object map* berisi keseluruhan halaman (`home`, `about`, `services`, `contact`) yang diambil langsung dari masing-masing tabel database terdedikasi.

---

### B. Layanan, Paket, Portofolio & Testimonial

#### 1. Ambil Daftar Semua Layanan (Lengkap)
- **Method:** `GET`
- **URL:** `/api/services`
- **Keterangan:** Mengembalikan seluruh divisi/layanan (MediaKampung, InetMedia, WebMedia) beserta `features`, `packages`, `portfolios`, dan `testimonials`.

**Contoh Respons (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "MediaKampung",
      "slug": "mediakampung",
      "tagline": "Jaringan Media Digital & Jurnalisme Siber",
      "description": "Portal berita independen dan terdepan...",
      "icon": "Newspaper",
      "features": ["Jurnalisme Terverifikasi Dewan Pers", "Jangkauan Daerah & Nasional"],
      "packages": [
        {
          "id": 1,
          "name": "Paket Advertorial",
          "price": "Rp 2.500.000",
          "features": ["1 Artikel Advertorial", "Tayang Selamanya"]
        }
      ],
      "portfolios": [
        {
          "id": 1,
          "title": "Liputan Khusus Pemprov",
          "client": "Dinas Kominfo",
          "image": "/uploads/portfolio1.jpg"
        }
      ],
      "testimonials": [
        {
          "id": 1,
          "quote": "Layanan pemberitaan sangat cepat dan akurat.",
          "author": "Budi Santoso",
          "role": "Humas Pemkab"
        }
      ]
    }
  ]
}
```

> **Catatan Integrasi Frontend:**  
> Pada hook `useServices.js`, jika field `features` dikembalikan dalam bentuk array atau JSON string, lakukan pemrosesan `JSON.parse` sebagai *safety check* (sudah diterapkan pada fallback/hook).

#### 2. Ambil Detail Satu Layanan
- **Method:** `GET`
- **URL:** `/api/services/:id`

---

### C. Artikel / Berita (Blog)

#### 1. Ambil Daftar Artikel (Mendukung Filter & Pencarian)
- **Method:** `GET`
- **URL:** `/api/articles`
- **Query Parameters (Opsional):**
  - `category` : Contoh `?category=Berita` atau `?category=Teknologi` (abaikan jika `'Semua'`)
  - `search` : Contoh `?search=cloud` (pencarian judul atau ringkasan)

**Contoh Request:**
```http
GET http://localhost:4000/api/articles?category=Teknologi&search=infrastruktur
```

**Contoh Respons (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Transformasi Infrastruktur Digital Indonesia",
      "slug": "transformasi-infrastruktur-digital-indonesia",
      "category": "Teknologi",
      "excerpt": "Peran ISP berkecepatan tinggi dalam percepatan ekosistem cloud...",
      "content": "Isi lengkap artikel...",
      "image": "/uploads/article1.jpg",
      "author": {
        "name": "Admin Alexa"
      },
      "createdAt": "2026-07-10T03:00:00.000Z"
    }
  ]
}
```

#### 2. Ambil Detail Artikel berdasarkan Slug
- **Method:** `GET`
- **URL:** `/api/articles/:slug`

---

### D. Klien & Mitra Enterprise

#### 1. Ambil Daftar Klien
- **Method:** `GET`
- **URL:** `/api/clients`

**Contoh Respons (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "PT. Nusantara Digital",
      "logo": "/uploads/client-logo1.png",
      "industry": "Perbankan"
    }
  ]
}
```

---

### E. Karir / Lowongan Kerja

#### 1. Ambil Daftar Lowongan Kerja Aktif
- **Method:** `GET`
- **URL:** `/api/careers`

**Contoh Respons (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Senior Network Engineer (ISP)",
      "department": "InetMedia",
      "location": "Jakarta / Hybrid",
      "type": "Full Time",
      "description": "Bertanggung jawab atas infrastruktur backbone BGP & MikroTik...",
      "requirements": ["Pengalaman minimal 3 tahun", "Sertifikasi MTCINE / CCNP"]
    }
  ]
}
```

---

### F. Kontak & Pesan Masuk (Inquiries Form)

#### 1. Kirim Pesan dari Formulir Kontak
- **Method:** `POST`
- **URL:** `/api/inquiries`
- **Headers:** `Content-Type: application/json`

**Payload Request Body:**
```json
{
  "name": "Budi Santoso",
  "email": "budi@perusahaan.co.id",
  "subject": "Layanan Internet Dedicated Corporate",
  "message": "Halo tim Alexa, kami berminat berlangganan dedicated internet 500 Mbps untuk kantor pusat."
}
```
*(Catatan: field `name`, `email`, dan `message` wajib diisi. Field `subject` opsional, default: "Pertanyaan Umum".)*

**Contoh Respons (`201 Created`):**
```json
{
  "success": true,
  "message": "Pesan Anda berhasil dikirim. Tim kami akan segera menghubungi Anda.",
  "data": {
    "id": 1,
    "name": "Budi Santoso",
    "email": "budi@perusahaan.co.id",
    "subject": "Layanan Internet Dedicated Corporate",
    "message": "Halo tim Alexa, kami berminat berlangganan dedicated internet 500 Mbps untuk kantor pusat.",
    "status": "UNREAD",
    "createdAt": "2026-07-10T12:00:00.000Z"
  }
}
```

---

## 4. Contoh Kode Integrasi pada Frontend React

### A. Contoh Client Helper (`src/services/api.js`)
Anda dapat membuat berkas helper sederhana di proyek React untuk melakukan pemanggilan ke backend:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function fetchApi(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return { success: false, message: error.message };
  }
}
```

### B. Contoh Mengirim Form Kontak (`Contact.jsx`)
```jsx
import React, { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [statusMsg, setStatusMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      const response = await fetch(`${API_BASE_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const json = await response.json();
      if (json.success) {
        setStatusMsg({ type: 'success', text: json.message });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatusMsg({ type: 'error', text: json.message });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Gagal menghubungi server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {statusMsg && (
        <div className={`alert ${statusMsg.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {statusMsg.text}
        </div>
      )}

      <input
        type="text"
        placeholder="Nama Lengkap"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email Anda"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Subjek"
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
      />
      <textarea
        placeholder="Pesan Anda"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Mengirim...' : 'Kirim Pesan'}
      </button>
    </form>
  );
}
```

---

## 5. Ringkasan Protected & Admin Endpoints (Untuk Referensi Tambahan)

Jika Frontend kelak juga mengimplementasikan Portal Client / Login Admin berbasis React:

| Endpoint | Method | Keterangan | Autentikasi |
| :--- | :---: | :--- | :---: |
| `/api/auth/login` | `POST` | Login user admin/karyawan (`email`, `password`) | Publik |
| `/api/auth/logout` | `POST` | Logout dan hapus cookie token | Protected |
| `/api/auth/me` | `GET` | Cek sesi & data user yang sedang login | Protected |
| `/api/auth/profile` | `PUT` | Update nama & profil user | Protected |
| `/api/auth/change-password` | `PUT` | Update password akun | Protected |
| `/api/upload` | `POST` | Upload gambar/file (`multipart/form-data`, field `image`) | Protected |
| `/api/articles` | `POST` / `PUT` / `DELETE` | Manajemen CRUD artikel | Protected (`articles.manage`) |
| `/api/services` | `POST` / `PUT` / `DELETE` | Manajemen CRUD layanan | Protected (`services.manage`) |
| `/api/inquiries` | `GET` / `PATCH` | Lihat & ubah status pesan kontak masuk | Protected (`inquiries.manage`) |
| `/api/pages/:pageName`| `PUT` | Ubah konten halaman CMS (Disimpan ke tabel `PageHome`, `PageAbout`, `PageServices`, atau `PageContact`) | Protected |

#### Detail Endpoint `PUT /api/pages/:pageName` (Admin CMS)
- **Method:** `PUT`
- **URL:** `/api/pages/:pageName` (`home`, `about`, `services`, `contact`)
- **Autentikasi:** Wajib (Admin JWT Cookie/Header)
- **Payload Request Body (`application/json`):**
  Mengirimkan objek yang berisi *field* yang ingin diperbarui (mendukung *partial update*):
```json
{
  "content": {
    "heroTitleLine1": "Membangun Infrastruktur Terdepan",
    "stat1Number": "10+"
  }
}
```
- **Perilaku Penyimpanan (Per Tabel Halaman):**
  1. Backend secara otomatis memverifikasi dan memperbarui kolom di tabel khusus (`PageHome`, `PageAbout`, `PageServices`, atau `PageContact`).
  2. Backend juga melakukan *dual-write* ke tabel `PageContent` guna menjaga kompatibilitas penuh dengan sistem *legacy*.

---

## 6. Penanganan Aset Gambar (URL Relatif vs Absolut)
Ketika API mengembalikan `image` atau `logo` seperti `/uploads/article1.jpg`, path tersebut dapat diakses melalui host backend:
```javascript
const imageUrl = `http://localhost:4000${article.image}`;
```
Atau jika reverse proxy / alias telah dikonfigurasi pada environment production, gambar langsung dapat diakses dari *base root url*.
