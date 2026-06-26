# Panduan Instalasi & Integrasi Google Sheets API (Google Apps Script)

Aplikasi **Sistem Manajemen Donasi Yayasan** dapat dihubungkan secara penuh ke Google Spreadsheet menggunakan REST API serverless yang ditenagai oleh **Google Apps Script**.

Ikuti 4 langkah mudah di bawah ini untuk mengonfigurasi database Yayasan Anda sendiri.

---

## Langkah 1: Siapkan Google Spreadsheet

1. Masuk ke Google Drive menggunakan akun Google Yayasan Anda.
2. Buat sebuah **Google Spreadsheet** baru, beri nama sesuai yayasan Anda, misalnya `Database_Donasi_Yayasan`.
3. Buka Spreadsheet tersebut, lalu buat lembar lembar (sheet) utama dengan nama persis di bawah ini dan isi kolom pertamanya sebagai Header (Baris ke-1):

### 1. Sheet `USERS`
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| `id` | `nama` | `email` | `password` | `role` | `status` | `created_at` |

*Tambahkan baris data default di bawah header USERS agar Anda bisa login pertama kali:*
- **id:** `USR-001`
- **nama:** `Ahmad Subarjo`
- **email:** `superadmin@yayasan.org`
- **password:** `admin123`
- **role:** `Super Admin`
- **status:** `Aktif`
- **created_at:** `2026-06-26T10:00:00Z`

### 2. Sheet `DONATUR`
| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| `id` | `kode_donatur` | `nama` | `jenis_donatur` | `alamat` | `kota` | `telepon` | `email` | `tanggal_bergabung` | `status` | `catatan` |

### 3. Sheet `EVENT`
| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| `id` | `kode_event` | `nama_event` | `kategori` | `target_dana` | `tanggal_mulai` | `tanggal_selesai` | `status` | `PIC` |

### 4. Sheet `TRANSAKSI`
| A | B | C | D | E | F | G | H | I | J | K | L | M | N |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `id` | `nomor_transaksi` | `tanggal` | `jam` | `donatur_id` | `event_id` | `nominal` | `metode` | `bank` | `referensi` | `admin` | `status` | `catatan` | `created_at` |

---

## Langkah 2: Salin Token ID Spreadsheet Anda

Di bilah alamat browser Anda, cari ID unik Spreadsheet tersebut. 
Format tautan Spreadsheet biasanya:
`https://docs.google.com/spreadsheets/d/MASUKKAN_ID_DI_SINI/edit#gid=0`

Salin kode ID unik tersebut (antara `/d/` dan `/edit`).

---

## Langkah 3: Konfigurasi Google Apps Script

1. Di menu Google Spreadsheet Anda, pilih **Extensions (Ekstensi) > Apps Script**.
2. Hapus seluruh kode default yang ada di dalam editor `Code.gs`.
3. Salin dan tempel (paste) seluruh isi kode dari file **`apps-script.js`** yang ada di dalam root projek ini.
4. Ganti nilai konstanta `SPREADSHEET_ID` di baris ke-13 menggunakan ID Spreadsheet Anda yang sudah disalin tadi:
   ```javascript
   const SPREADSHEET_ID = "PASTE_ID_SPREADSHEET_YAYASAN_ANDA_DI_SINI";
   ```
5. Simpan projek Apps Script Anda (klik ikon disket/save).

---

## Langkah 4: Publikasikan sebagai Aplikasi Web (Web App)

1. Di pojok kanan atas editor Apps Script, klik tombol **Deploy** dan pilih **New Deployment** (Penerapan Baru).
2. Klik ikon gir (pilih tipe penerapan) lalu pilih **Web App** (Aplikasi Web).
3. Isi konfigurasi deployment seperti berikut:
   - **Description:** `REST API Donasi Yayasan v1`
   - **Execute As:** `Me (email-yayasan-anda@gmail.com)` (Wajib dijalankan sebagai email Anda agar program bisa menulis data ke Spreadsheet)
   - **Who has access:** `Anyone` (Pilih "Siapa saja", ini wajib agar frontend web Anda dapat berkomunikasi mengirim data ke serverless)
4. Klik tombol **Deploy**.
5. Google akan meminta persetujuan Otorisasi Akun (Authorization). Klik **Authorize Access**, pilih akun Google Anda, klik tautan **Advanced** (Lanjutan) di kiri bawah, lalu klik **Go to Database (Unsafe)** dan setujui **Allow**.
6. Setelah deployment selesai, Google akan menyajikan tautan **Web App URL** yang berujung akhiran `/exec`. Contoh:
   `https://script.google.com/macros/s/AKfycby..._Y8B/exec`
7. Salin tautan lengkap tersebut.

---

## Langkah 5: Hubungkan ke Aplikasi Web

1. Buka aplikasi **Sistem Manajemen Donasi Yayasan** Anda.
2. Masuk menggunakan akun Super Admin (`superadmin@yayasan.org` / password `admin123`).
3. Masuk ke halaman **Pengaturan API** di menu sidebar kiri.
4. Tempel tautan URL Google Apps Script yang sudah Anda salin tadi ke input form **URL Web App Google Apps Script**.
5. Klik **Simpan URL**.
6. Klik tombol **Test Koneksi API Sheets** di bawah form untuk memvalidasi bahwa sinkronisasi database Google Sheets Anda telah aktif secara real-time!

---
*Selamat! Sekarang sistem manajemen donasi yayasan Anda berjalan secara online penuh dan seluruh data Donatur, Program Event, serta Transaksi Donasi akan terekam secara permanen di Google Spreadsheet Anda.*
