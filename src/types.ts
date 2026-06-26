export type UserRole = 'Super Admin' | 'Admin Keuangan' | 'Fundraiser' | 'Ketua Yayasan';

export interface User {
  id: string;
  nama: string;
  email: string;
  password?: string;
  role: UserRole;
  status: 'Aktif' | 'Nonaktif';
  created_at: string;
}

export type JenisDonatur = 'Individu' | 'Instansi' | 'Komunitas' | 'Lainnya';

export interface Donatur {
  id: string;
  kode_donatur: string;
  nama: string;
  jenis_donatur: JenisDonatur;
  alamat: string;
  kota: string;
  telepon: string;
  email: string;
  tanggal_bergabung: string;
  status: 'Aktif' | 'Nonaktif';
  catatan: string;
}

export interface Event {
  id: string;
  kode_event: string;
  nama_event: string;
  kategori: string;
  target_dana: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: 'Aktif' | 'Selesai' | 'Draf';
  PIC: string;
}

export type MetodePembayaran = 'Transfer' | 'QRIS' | 'Tunai';
export type StatusTransaksi = 'Masuk' | 'Pending' | 'Batal';
export type BankPilihan = 'BCA' | 'Mandiri' | 'BRI' | 'BNI' | 'BSI' | 'Lainnya';

export interface Transaksi {
  id: string;
  nomor_transaksi: string;
  tanggal: string; // YYYY-MM-DD
  jam: string; // HH:mm
  donatur_id: string;
  event_id: string;
  nominal: number;
  metode: MetodePembayaran;
  bank: BankPilihan;
  referensi: string;
  admin: string; // nama / email admin yang input
  status: StatusTransaksi;
  catatan: string;
  created_at: string;
  bukti_transfer?: string; // Base64 data url or dummy path
}

// Rekap structures
export interface RekapHarian {
  tanggal: string;
  jumlah_transaksi: number;
  jumlah_donatur: number;
  total_donasi: number;
}

export interface RekapBulanan {
  bulan: string; // "Januari", "Februari", etc.
  tahun: number;
  jumlah_transaksi: number;
  jumlah_donatur: number;
  total_donasi: number;
}

export interface RekapEvent {
  event: string; // nama_event
  target: number;
  total: number;
  persentase: number;
}

export interface RekapDonatur {
  donatur: string; // nama_donatur
  jumlah_donasi: number; // frekuensi
  frekuensi: number;
  total: number;
}
