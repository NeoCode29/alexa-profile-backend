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
- **Autentikasi Cookie:** Untuk endpoint yang membutuhkan autentikasi (seperti profil atau admin), backend menggunakan **JWT di dalam HTTP-Only Cookie (`token`)**. Jika frontend melakukan request ke *protected endpoints*, tambahkan konfigurasi `credentials: 'include'` pada `fetch` atau `withCredentials: true` pada `axios`.

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

### A. Konten Halaman Website (CMS Dinamis)
Digunakan untuk mengisi teks, judul, statistik, visi misi, dan informasi halaman website secara dinamis dari database.

#### 1. Ambil Konten Spesifik Halaman
- **Method:** `GET`
- **URL:** `/api/pages/:pageName`
- **Parameter `:pageName`:**
  - `home` — Konten halaman beranda (Hero, Statistik, CTA, Pengantar)
  - `about` — Konten halaman tentang kami (Sejarah, Visi, Misi, Timeline)
  - `services` — Konten pengantar halaman layanan
  - `contact` — Konten informasi kontak (Alamat, Email, Telepon, Jam Kerja)
  - `blog` — Konten pengantar halaman artikel/berita

**Contoh Request:**
```http
GET http://localhost:4000/api/pages/home
```

**Contoh Respons (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "heroTitleLine1": "Membangun Infrastruktur",
    "heroTitleHighlight": "Digital Masa Depan",
    "heroDesc": "PT. Alexa Computindo Group menyediakan solusi Media Digital, ISP Berkecepatan Tinggi, dan Arsitektur Perangkat Lunak untuk skala Enterprise.",
    "ctaPrimaryText": "Eksplorasi Layanan",
    "ctaPrimaryLink": "/services",
    "ctaSecondaryText": "Pelajari Lebih Lanjut",
    "ctaSecondaryLink": "/about",
    "stat1Number": "8+",
    "stat1Label": "Tahun Pengalaman",
    "stat2Number": "99.9%",
    "stat2Label": "Uptime Server",
    "stat3Number": "200+",
    "stat3Label": "Klien Enterprise"
  }
}
```

#### 2. Ambil Semua Konten Halaman Sekaligus
- **Method:** `GET`
- **URL:** `/api/pages`

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
| `/api/pages/:pageName`| `PUT` | Ubah konten halaman CMS | Protected |

---

## 6. Penanganan Aset Gambar (URL Relatif vs Absolut)
Ketika API mengembalikan `image` atau `logo` seperti `/uploads/article1.jpg`, path tersebut dapat diakses melalui host backend:
```javascript
const imageUrl = `http://localhost:4000${article.image}`;
```
Atau jika reverse proxy / alias telah dikonfigurasi pada environment production, gambar langsung dapat diakses dari *base root url*.
