# Sistem Manajemen Donasi Yayasan Amal Nusantara

Aplikasi portal administrasi modern berbasis web untuk mengelola donasi, pendataan donatur, pembuatan program penggalangan dana (event), pencatatan transaksi masuk, dan pencetakan kwitansi digital secara real-time.

Aplikasi ini didesain menggunakan arsitektur hibrida berkinerja tinggi, siap di-deploy ke **Vercel** atau platform hosting awan lainnya, dan terintegrasi langsung dengan **Google Sheets** sebagai database utama menggunakan REST API ditenagai **Google Apps Script**.

---

## 🚀 Fitur Unggulan

- **Role-Based Access Control (RBAC):** Otentikasi sesi aman dengan pembatasan hak akses halaman berdasarkan 4 level posisi yayasan:
  1. `Super Admin` (Akses penuh ke seluruh sistem & manajemen staf admin)
  2. `Admin Keuangan` (Verifikasi mutasi kas, laporan mutasi, dan export spreadsheet)
  3. `Fundraiser` (Fokus pendataan donatur baru dan pencatatan transaksi masuk)
  4. `Ketua Yayasan` (Melihat visualisasi ringkasan grafik performa, statistik, laporan, dan cetak mutasi)
- **Dashboard Multi-Metrik:** KPI card ringkasan total donasi harian, bulanan, tahunan, serta visualisasi tren interaktif (Line Chart, Bar Chart, dan Progress Bar target dana program).
- **Manajemen Donatur & Program (Event):** Sistem CRUD dinamis, filter kategori, penanggung jawab, serta visualisasi persentase pencapaian dana program secara real-time.
- **Form Kasir Donasi Pintar:** Penomoran bukti invoice transaksi otomatis (`TRX-YYYYMMDDxxx`), dropdown interaktif, lampiran unggah bukti transfer (base64 image), dan generate cetak kwitansi fisik cetak ramah cetak.
- **Laporan Mutasi Terintegrasi:** Penyaringan mutasi multi-dimensi (Bulan, Tahun, Tanggal mulai s/d selesai, Event program, Nama donatur, dan Admin Kasir) serta download CSV/Excel.
- **Sinkronisasi Google Sheets API:** Pengaturan antarmuka dinamis untuk berpindah secara mulus antara **Mode Simulasi Lokal (Offline Cache)** dan **Database Google Sheets Aktif (Online Mode)**.

---

## 🛠️ Stack Teknologi

- **Frontend Core:** React, TypeScript, TailwindCSS v4
- **Charts Engine:** Recharts (Interaktif SVG rendering)
- **Layout & Icons:** Lucide-React, Tailwind-animated components
- **Database Backend:** Google Spreadsheet
- **API Engine:** Google Apps Script Serverless REST API (GET/POST Router)

---

## 📂 Struktur Direktori Projek

```text
/src
 ├── /components      # Modul antarmuka fungsional fungsional (Dashboard, Donatur, Event, dll)
 ├── /services        # api.ts (Dual model controller: simulator offline & GAS fetcher)
 ├── types.ts         # Deklarasi tipe data TypeScript & interface entitas basis data
 ├── App.tsx          # Router utama, kerangka shell dashboard, dan guard otorisasi
 ├── main.tsx         # Entry-point bootstrap React 19
 └── index.css        # Entry-point global CSS Tailwind v4
/apps-script.js       # Kode sumber lengkap Google Apps Script REST API untuk Spreadsheet
/INSTALL.md           # Panduan lengkap langkah sinkronisasi Google Sheets database
```

---

## ⚙️ Cara Menjalankan Secara Lokal

1. Pastikan Anda memiliki Node.js terinstal.
2. Pasang dependensi projek:
   ```bash
   npm install
   ```
3. Jalankan server pengembangan (dev server) di port 3000:
   ```bash
   npm run dev
   ```
4. Buka `http://localhost:3000` di browser Anda.

---

## 🔐 Akun Akses Demo Bawaan

| Email Akun | Password | Level Jabatan | Kegunaan |
|---|---|---|---|
| `superadmin@yayasan.org` | `admin123` | `Super Admin` | Akses penuh sistem & kelola pengguna |
| `keuangan@yayasan.org` | `keuangan123` | `Admin Keuangan` | Mutasi kas, laporan, & ekspor data |
| `fundraiser@yayasan.org` | `fundraiser123` | `Fundraiser` | Entri donasi & tambah donatur baru |
| `ketua@yayasan.org` | `ketua123` | `Ketua Yayasan` | Pantau grafik, monitoring, & unduh rekap |

---
*Projek ini dilisensikan di bawah Apache-2.0 License.*
