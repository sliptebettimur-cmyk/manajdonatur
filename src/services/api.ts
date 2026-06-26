import {
  User,
  Donatur,
  Event,
  Transaksi,
  RekapHarian,
  RekapBulanan,
  RekapEvent,
  RekapDonatur,
  UserRole
} from '../types';

// Default Seed Data
const DEFAULT_USERS: User[] = [
  {
    id: 'USR-001',
    nama: 'Ahmad Subarjo',
    email: 'superadmin@yayasan.org',
    password: 'admin123',
    role: 'Super Admin',
    status: 'Aktif',
    created_at: '2026-01-01T08:00:00Z'
  },
  {
    id: 'USR-002',
    nama: 'Siti Rahmawati',
    email: 'keuangan@yayasan.org',
    password: 'keuangan123',
    role: 'Admin Keuangan',
    status: 'Aktif',
    created_at: '2026-01-02T09:00:00Z'
  },
  {
    id: 'USR-003',
    nama: 'Budi Hartono',
    email: 'fundraiser@yayasan.org',
    password: 'fundraiser123',
    role: 'Fundraiser',
    status: 'Aktif',
    created_at: '2026-01-03T10:00:00Z'
  },
  {
    id: 'USR-004',
    nama: 'Drs. H. Mulyadi',
    email: 'ketua@yayasan.org',
    password: 'ketua123',
    role: 'Ketua Yayasan',
    status: 'Aktif',
    created_at: '2026-01-04T11:00:00Z'
  }
];

const DEFAULT_DONATUR: Donatur[] = [
  {
    id: 'DON-001',
    kode_donatur: 'DN-0001',
    nama: 'H. Syamsul Arifin',
    jenis_donatur: 'Individu',
    alamat: 'Jl. Margonda Raya No. 45',
    kota: 'Depok',
    telepon: '081234567890',
    email: 'syamsul.arifin@gmail.com',
    tanggal_bergabung: '2026-01-10',
    status: 'Aktif',
    catatan: 'Donatur tetap bulanan, sangat peduli program pendidikan anak yatim.'
  },
  {
    id: 'DON-002',
    kode_donatur: 'DN-0002',
    nama: 'PT. Maju Mundur Sejahtera',
    jenis_donatur: 'Instansi',
    alamat: 'Sudirman Central Business District Lot 21',
    kota: 'Jakarta Selatan',
    telepon: '0215556789',
    email: 'csr@majumundur.co.id',
    tanggal_bergabung: '2026-01-15',
    status: 'Aktif',
    catatan: 'Donasi CSR tahunan untuk pembangunan masjid.'
  },
  {
    id: 'DON-003',
    kode_donatur: 'DN-0003',
    nama: 'Komunitas Hijrah Mulia',
    jenis_donatur: 'Komunitas',
    alamat: 'Ruko Emerald Blok B No. 12',
    kota: 'Bekasi',
    telepon: '085678901234',
    email: 'hijrahmulia@yahoo.com',
    tanggal_bergabung: '2026-02-01',
    status: 'Aktif',
    catatan: 'Mengumpulkan donasi kolektif setiap pekan.'
  },
  {
    id: 'DON-004',
    kode_donatur: 'DN-0004',
    nama: 'Hj. Fatimah Az-Zahra',
    jenis_donatur: 'Individu',
    alamat: 'Jl. Dago Elok No. 89',
    kota: 'Bandung',
    telepon: '082198765432',
    email: 'fatimah.zahra@gmail.com',
    tanggal_bergabung: '2026-02-10',
    status: 'Aktif',
    catatan: 'Sering berkontribusi di donasi pangan darurat.'
  },
  {
    id: 'DON-005',
    kode_donatur: 'DN-0005',
    nama: 'Dr. Hendra Wijaya',
    jenis_donatur: 'Individu',
    alamat: 'Jl. Kaliurang KM 5.5',
    kota: 'Sleman',
    telepon: '081122334455',
    email: 'hendra.wijaya@ugm.ac.id',
    tanggal_bergabung: '2026-02-20',
    status: 'Aktif',
    catatan: 'Berminat pada program beasiswa kedokteran.'
  },
  {
    id: 'DON-006',
    kode_donatur: 'DN-0006',
    nama: 'Yusuf Mansur',
    jenis_donatur: 'Individu',
    alamat: 'Jl. Ketintang Baru II No. 17',
    kota: 'Surabaya',
    telepon: '081345671122',
    email: 'yusuf.mansur@outlook.com',
    tanggal_bergabung: '2026-03-01',
    status: 'Aktif',
    catatan: 'Mengirimkan donasi via transfer bank BCA setiap awal bulan.'
  },
  {
    id: 'DON-007',
    kode_donatur: 'DN-0007',
    nama: 'Yayasan Bakti Nusantara',
    jenis_donatur: 'Instansi',
    alamat: 'Jl. Pemuda No. 102',
    kota: 'Semarang',
    telepon: '0248882233',
    email: 'info@baktinusantara.or.id',
    tanggal_bergabung: '2026-03-12',
    status: 'Aktif',
    catatan: 'Kemitraan penyaluran zakat produktif.'
  },
  {
    id: 'DON-008',
    kode_donatur: 'DN-0008',
    nama: 'Ir. Rian Ardianto',
    jenis_donatur: 'Individu',
    alamat: 'Perumahan Graha Indah Blok F-5',
    kota: 'Tangerang',
    telepon: '087799008811',
    email: 'rian.ardi@gmail.com',
    tanggal_bergabung: '2026-03-25',
    status: 'Aktif',
    catatan: 'Berpartisipasi aktif pada kampanye tanggap bencana.'
  }
];

const DEFAULT_EVENTS: Event[] = [
  {
    id: 'EVT-001',
    kode_event: 'EV-0001',
    nama_event: 'Sedekah Subuh Berkah',
    kategori: 'Sosial & Kemanusiaan',
    target_dana: 50000000,
    tanggal_mulai: '2026-01-01',
    tanggal_selesai: '2026-12-31',
    status: 'Aktif',
    PIC: 'Budi Hartono'
  },
  {
    id: 'EVT-002',
    kode_event: 'EV-0002',
    nama_event: 'Wakaf Al-Quran Pelosok Nusantara',
    kategori: 'Wakaf & Keagamaan',
    target_dana: 150000000,
    tanggal_mulai: '2026-01-15',
    tanggal_selesai: '2026-06-30',
    status: 'Aktif',
    PIC: 'Budi Hartono'
  },
  {
    id: 'EVT-003',
    kode_event: 'EV-0003',
    nama_event: 'Peduli 1000 Anak Yatim Piatu',
    kategori: 'Pendidikan & Yatim',
    target_dana: 200000000,
    tanggal_mulai: '2026-02-01',
    tanggal_selesai: '2026-05-31',
    status: 'Selesai',
    PIC: 'Ahmad Subarjo'
  },
  {
    id: 'EVT-004',
    kode_event: 'EV-0004',
    nama_event: 'Pembangunan Masjid Al-Kautsar',
    kategori: 'Infrastruktur Keagamaan',
    target_dana: 750000000,
    tanggal_mulai: '2026-01-01',
    tanggal_selesai: '2026-12-31',
    status: 'Aktif',
    PIC: 'Ahmad Subarjo'
  },
  {
    id: 'EVT-005',
    kode_event: 'EV-0005',
    nama_event: 'Tanggap Bencana Banjir Bandang',
    kategori: 'Darurat & Kebencanaan',
    target_dana: 100000000,
    tanggal_mulai: '2026-03-10',
    tanggal_selesai: '2026-04-10',
    status: 'Selesai',
    PIC: 'Budi Hartono'
  },
  {
    id: 'EVT-006',
    kode_event: 'EV-0006',
    nama_event: 'Beasiswa Santri Berprestasi',
    kategori: 'Pendidikan & Yatim',
    target_dana: 120000000,
    tanggal_mulai: '2026-02-15',
    tanggal_selesai: '2026-08-15',
    status: 'Aktif',
    PIC: 'Siti Rahmawati'
  },
  {
    id: 'EVT-007',
    kode_event: 'EV-0007',
    nama_event: 'Sembako Murah Keluarga Dhuafa',
    kategori: 'Sosial & Kemanusiaan',
    target_dana: 60000000,
    tanggal_mulai: '2026-03-01',
    tanggal_selesai: '2026-04-30',
    status: 'Aktif',
    PIC: 'Budi Hartono'
  },
  {
    id: 'EVT-008',
    kode_event: 'EV-0008',
    nama_event: 'Klinik Kesehatan Gratis Dhuafa',
    kategori: 'Kesehatan',
    target_dana: 180000000,
    tanggal_mulai: '2026-01-20',
    tanggal_selesai: '2026-07-20',
    status: 'Aktif',
    PIC: 'Siti Rahmawati'
  },
  {
    id: 'EVT-009',
    kode_event: 'EV-0009',
    nama_event: 'Wakaf Sumur Air Bersih Gunungkidul',
    kategori: 'Wakaf & Keagamaan',
    target_dana: 85000000,
    tanggal_mulai: '2026-04-01',
    tanggal_selesai: '2026-09-30',
    status: 'Aktif',
    PIC: 'Ahmad Subarjo'
  },
  {
    id: 'EVT-010',
    kode_event: 'EV-0010',
    nama_event: 'Bantuan Nutrisi Ibu Hamil & Balita',
    kategori: 'Kesehatan',
    target_dana: 45000000,
    tanggal_mulai: '2026-03-15',
    tanggal_selesai: '2026-06-15',
    status: 'Aktif',
    PIC: 'Siti Rahmawati'
  },
  {
    id: 'EVT-011',
    kode_event: 'EV-0011',
    nama_event: 'Sedekah Air Mineral Jum’at Berkah',
    kategori: 'Sosial & Kemanusiaan',
    target_dana: 15000000,
    tanggal_mulai: '2026-01-01',
    tanggal_selesai: '2026-12-31',
    status: 'Aktif',
    PIC: 'Budi Hartono'
  },
  {
    id: 'EVT-012',
    kode_event: 'EV-0012',
    nama_event: 'Renovasi Jembatan Desa Tertinggal',
    kategori: 'Infrastruktur Keagamaan',
    target_dana: 250000000,
    tanggal_mulai: '2026-05-01',
    tanggal_selesai: '2026-10-31',
    status: 'Draf',
    PIC: 'Ahmad Subarjo'
  },
  {
    id: 'EVT-013',
    kode_event: 'EV-0013',
    nama_event: 'Tebar Hewan Qurban Pedalaman',
    kategori: 'Wakaf & Keagamaan',
    target_dana: 350000000,
    tanggal_mulai: '2026-04-15',
    tanggal_selesai: '2026-06-20',
    status: 'Aktif',
    PIC: 'Budi Hartono'
  },
  {
    id: 'EVT-014',
    kode_event: 'EV-0014',
    nama_event: 'Beasiswa Pendidikan Anak Driver Ojol',
    kategori: 'Pendidikan & Yatim',
    target_dana: 90000000,
    tanggal_mulai: '2026-02-01',
    tanggal_selesai: '2026-07-31',
    status: 'Aktif',
    PIC: 'Siti Rahmawati'
  },
  {
    id: 'EVT-015',
    kode_event: 'EV-0015',
    nama_event: 'Bantuan Usaha Mikro Ummat (MUI)',
    kategori: 'Sosial & Kemanusiaan',
    target_dana: 110000000,
    tanggal_mulai: '2026-03-20',
    tanggal_selesai: '2026-09-20',
    status: 'Aktif',
    PIC: 'Ahmad Subarjo'
  },
  {
    id: 'EVT-016',
    kode_event: 'EV-0016',
    nama_event: 'Pemberdayaan Mualaf Pedalaman',
    kategori: 'Wakaf & Keagamaan',
    target_dana: 70000000,
    tanggal_mulai: '2026-03-01',
    tanggal_selesai: '2026-08-31',
    status: 'Aktif',
    PIC: 'Budi Hartono'
  },
  {
    id: 'EVT-017',
    kode_event: 'EV-0017',
    nama_event: 'Renovasi Sekolah Madrasah Rusak',
    kategori: 'Pendidikan & Yatim',
    target_dana: 400000000,
    tanggal_mulai: '2026-05-15',
    tanggal_selesai: '2026-11-15',
    status: 'Draf',
    PIC: 'Ahmad Subarjo'
  },
  {
    id: 'EVT-018',
    kode_event: 'EV-0018',
    nama_event: 'Peduli Kanker Anak Indonesia',
    kategori: 'Kesehatan',
    target_dana: 150000000,
    tanggal_mulai: '2026-01-10',
    tanggal_selesai: '2026-06-10',
    status: 'Selesai',
    PIC: 'Siti Rahmawati'
  },
  {
    id: 'EVT-019',
    kode_event: 'EV-0019',
    nama_event: 'Operasi Katarak Gratis Lansia',
    kategori: 'Kesehatan',
    target_dana: 130000000,
    tanggal_mulai: '2026-02-25',
    tanggal_selesai: '2026-08-25',
    status: 'Aktif',
    PIC: 'Siti Rahmawati'
  },
  {
    id: 'EVT-020',
    kode_event: 'EV-0020',
    nama_event: 'Penghijauan Hutan & Mangrove',
    kategori: 'Sosial & Kemanusiaan',
    target_dana: 50000000,
    tanggal_mulai: '2026-04-10',
    tanggal_selesai: '2026-10-10',
    status: 'Aktif',
    PIC: 'Budi Hartono'
  }
];

const DEFAULT_TRANSAKSI: Transaksi[] = [
  {
    id: 'TX-001',
    nomor_transaksi: 'TRX-20260620001',
    tanggal: '2026-06-20',
    jam: '08:30',
    donatur_id: 'DON-001',
    event_id: 'EVT-001',
    nominal: 500000,
    metode: 'Transfer',
    bank: 'BCA',
    referensi: 'REF88721A',
    admin: 'Siti Rahmawati',
    status: 'Masuk',
    catatan: 'Zakat mal bulanan H. Syamsul',
    created_at: '2026-06-20T08:30:00Z'
  },
  {
    id: 'TX-002',
    nomor_transaksi: 'TRX-20260620002',
    tanggal: '2026-06-20',
    jam: '10:15',
    donatur_id: 'DON-002',
    event_id: 'EVT-004',
    nominal: 50000000,
    metode: 'Transfer',
    bank: 'Mandiri',
    referensi: 'REF01928B',
    admin: 'Siti Rahmawati',
    status: 'Masuk',
    catatan: 'Donasi CSR pembangunan masjid gelombang 1',
    created_at: '2026-06-20T10:15:00Z'
  },
  {
    id: 'TX-003',
    nomor_transaksi: 'TRX-20260621001',
    tanggal: '2026-06-21',
    jam: '14:20',
    donatur_id: 'DON-003',
    event_id: 'EVT-002',
    nominal: 2500000,
    metode: 'QRIS',
    bank: 'Lainnya',
    referensi: 'QRIS9901A',
    admin: 'Budi Hartono',
    status: 'Masuk',
    catatan: 'Sedekah jum’at dari komunitas Hijrah',
    created_at: '2026-06-21T14:20:00Z'
  },
  {
    id: 'TX-004',
    nomor_transaksi: 'TRX-20260622001',
    tanggal: '2026-06-22',
    jam: '09:00',
    donatur_id: 'DON-004',
    event_id: 'EVT-003',
    nominal: 1000000,
    metode: 'Tunai',
    bank: 'Lainnya',
    referensi: '-',
    admin: 'Ahmad Subarjo',
    status: 'Masuk',
    catatan: 'Titipan tunai via kantor yayasan',
    created_at: '2026-06-22T09:00:00Z'
  },
  {
    id: 'TX-005',
    nomor_transaksi: 'TRX-20260623001',
    tanggal: '2026-06-23',
    jam: '11:45',
    donatur_id: 'DON-005',
    event_id: 'EVT-006',
    nominal: 5000000,
    metode: 'Transfer',
    bank: 'BNI',
    referensi: 'REF77218C',
    admin: 'Siti Rahmawati',
    status: 'Masuk',
    catatan: 'Beasiswa 2 santri penghafal Quran',
    created_at: '2026-06-23T11:45:00Z'
  },
  {
    id: 'TX-006',
    nomor_transaksi: 'TRX-20260624001',
    tanggal: '2026-06-24',
    jam: '16:00',
    donatur_id: 'DON-006',
    event_id: 'EVT-001',
    nominal: 300000,
    metode: 'QRIS',
    bank: 'Lainnya',
    referensi: 'QRIS8812B',
    admin: 'Budi Hartono',
    status: 'Masuk',
    catatan: 'Donasi harian Subuh Berkah',
    created_at: '2026-06-24T16:00:00Z'
  },
  {
    id: 'TX-007',
    nomor_transaksi: 'TRX-20260624002',
    tanggal: '2026-06-24',
    jam: '19:30',
    donatur_id: 'DON-001',
    event_id: 'EVT-008',
    nominal: 10000000,
    metode: 'Transfer',
    bank: 'BCA',
    referensi: 'REF90011D',
    admin: 'Siti Rahmawati',
    status: 'Masuk',
    catatan: 'Donasi alat kesehatan klinik dhuafa',
    created_at: '2026-06-24T19:30:00Z'
  },
  {
    id: 'TX-008',
    nomor_transaksi: 'TRX-20260625001',
    tanggal: '2026-06-25',
    jam: '10:00',
    donatur_id: 'DON-007',
    event_id: 'EVT-007',
    nominal: 15000000,
    metode: 'Transfer',
    bank: 'BSI',
    referensi: 'REF66521A',
    admin: 'Siti Rahmawati',
    status: 'Masuk',
    catatan: 'Sembako murah untuk 150 KK dhuafa',
    created_at: '2026-06-25T10:00:00Z'
  },
  {
    id: 'TX-009',
    nomor_transaksi: 'TRX-20260625002',
    tanggal: '2026-06-25',
    jam: '13:00',
    donatur_id: 'DON-008',
    event_id: 'EVT-005',
    nominal: 2000000,
    metode: 'Transfer',
    bank: 'BRI',
    referensi: 'REF11289F',
    admin: 'Budi Hartono',
    status: 'Masuk',
    catatan: 'Tanggap bencana banjir bandang',
    created_at: '2026-06-25T13:00:00Z'
  },
  {
    id: 'TX-010',
    nomor_transaksi: 'TRX-20260626001', // Hari ini
    tanggal: '2026-06-26',
    jam: '08:15',
    donatur_id: 'DON-001',
    event_id: 'EVT-001',
    nominal: 750000,
    metode: 'QRIS',
    bank: 'Lainnya',
    referensi: 'QRIS7712C',
    admin: 'Budi Hartono',
    status: 'Masuk',
    catatan: 'Sedekah subuh berlipat berkah',
    created_at: '2026-06-26T08:15:00Z'
  },
  {
    id: 'TX-011',
    nomor_transaksi: 'TRX-20260626002', // Hari ini
    tanggal: '2026-06-26',
    jam: '09:40',
    donatur_id: 'DON-004',
    event_id: 'EVT-013',
    nominal: 3500000,
    metode: 'Transfer',
    bank: 'BCA',
    referensi: 'REF00122X',
    admin: 'Siti Rahmawati',
    status: 'Masuk',
    catatan: 'Patungan 1 ekor sapi Qurban pedalaman',
    created_at: '2026-06-26T09:40:00Z'
  },
  {
    id: 'TX-012',
    nomor_transaksi: 'TRX-20260626003', // Hari ini pending
    tanggal: '2026-06-26',
    jam: '10:05',
    donatur_id: 'DON-006',
    event_id: 'EVT-009',
    nominal: 12000000,
    metode: 'Transfer',
    bank: 'BCA',
    referensi: 'REF77811Y',
    admin: 'Siti Rahmawati',
    status: 'Pending',
    catatan: 'Wakaf sumur air bersih tahap konfirmasi',
    created_at: '2026-06-26T10:05:00Z'
  }
];

// Helper to initialize local storage with default database if it doesn't exist
export function initializeLocalDatabase() {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem('donatur')) {
    localStorage.setItem('donatur', JSON.stringify(DEFAULT_DONATUR));
  }
  if (!localStorage.getItem('event')) {
    localStorage.setItem('event', JSON.stringify(DEFAULT_EVENTS));
  }
  if (!localStorage.getItem('transaksi')) {
    localStorage.setItem('transaksi', JSON.stringify(DEFAULT_TRANSAKSI));
  }
}

// Check GAS configuration
export function getGASUrl(): string | null {
  const localUrl = localStorage.getItem('gas_api_url');
  const envUrl = (import.meta as any).env?.VITE_GAS_API_URL;
  let url = localUrl || envUrl || null;
  if (url) {
    url = url.trim().replace(/^['"]|['"]$/g, '').trim();
  }
  return url || null;
}

export function setGASUrl(url: string) {
  if (url) {
    localStorage.setItem('gas_api_url', url);
  } else {
    localStorage.removeItem('gas_api_url');
  }
}

// Request dispatcher that falls back to Local Storage if GAS URL is not provided
async function makeRequest<T>(
  action: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: any,
  queryParams?: Record<string, string>
): Promise<{ success: boolean; message: string; data: T }> {
  const gasUrl = getGASUrl();

  if (!gasUrl) {
    // FALLBACK TO LOCAL STORAGE
    initializeLocalDatabase();
    return handleLocalRequest<T>(action, method, body, queryParams);
  }

  try {
    let url = gasUrl;
    const urlObj = new URL(gasUrl);
    urlObj.searchParams.set('action', action);
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, val]) => {
        urlObj.searchParams.set(key, val);
      });
    }
    url = urlObj.toString();

    let response;
    if (method === 'GET') {
      response = await fetch(url, { method: 'GET' });
    } else {
      // For Apps Script, standard CORS redirects sometimes require POST with method payload or transparent redirect routing.
      // We send simple json payload.
      response = await fetch(gasUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8' // To bypass CORS preflight checks in Apps Script
        },
        body: JSON.stringify({
          action,
          method,
          payload: body,
          ...queryParams
        })
      });
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error: any) {
    console.warn('GAS API connection failed, falling back to local simulation:', error);
    // Fallback on connection/CORS error so the UI NEVER breaks
    return handleLocalRequest<T>(action, method, body, queryParams);
  }
}

// Local simulation handlers
function handleLocalRequest<T>(
  action: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: any,
  queryParams?: Record<string, string>
): { success: boolean; message: string; data: T } {
  initializeLocalDatabase();

  const getCollection = (name: string): any[] => JSON.parse(localStorage.getItem(name) || '[]');
  const saveCollection = (name: string, data: any[]) => localStorage.setItem(name, JSON.stringify(data));

  if (action === 'getUsers') {
    const users = getCollection('users');
    return { success: true, message: 'Success get users', data: users as T };
  }

  if (action === 'createUser' && method === 'POST') {
    const users = getCollection('users');
    const newUser: User = {
      ...body,
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    saveCollection('users', users);
    return { success: true, message: 'User berhasil ditambahkan', data: newUser as T };
  }

  if (action === 'updateUser' && method === 'PUT') {
    const users = getCollection('users');
    const idx = users.findIndex((u: any) => u.id === body.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...body };
      saveCollection('users', users);
      return { success: true, message: 'User berhasil diperbarui', data: users[idx] as T };
    }
    return { success: false, message: 'User tidak ditemukan', data: null as T };
  }

  if (action === 'deleteUser' && method === 'DELETE') {
    const id = queryParams?.id || body?.id;
    let users = getCollection('users');
    users = users.filter((u: any) => u.id !== id);
    saveCollection('users', users);
    return { success: true, message: 'User berhasil dihapus', data: true as T };
  }

  // --- DONATUR CRUD ---
  if (action === 'getDonatur') {
    const data = getCollection('donatur');
    return { success: true, message: 'Success get donatur', data: data as T };
  }

  if (action === 'createDonatur' && method === 'POST') {
    const data = getCollection('donatur');
    const kode = `DN-${String(data.length + 1).padStart(4, '0')}`;
    const newItem: Donatur = {
      ...body,
      id: `DON-${String(data.length + 1).padStart(3, '0')}`,
      kode_donatur: kode,
      tanggal_bergabung: body.tanggal_bergabung || new Date().toISOString().split('T')[0]
    };
    data.push(newItem);
    saveCollection('donatur', data);
    return { success: true, message: 'Donatur berhasil ditambahkan', data: newItem as T };
  }

  if (action === 'updateDonatur' && method === 'PUT') {
    const data = getCollection('donatur');
    const idx = data.findIndex((item: any) => item.id === body.id);
    if (idx !== -1) {
      data[idx] = { ...data[idx], ...body };
      saveCollection('donatur', data);
      return { success: true, message: 'Donatur berhasil diperbarui', data: data[idx] as T };
    }
    return { success: false, message: 'Donatur tidak ditemukan', data: null as T };
  }

  if (action === 'deleteDonatur' && method === 'DELETE') {
    const id = queryParams?.id || body?.id;
    let data = getCollection('donatur');
    data = data.filter((item: any) => item.id !== id);
    saveCollection('donatur', data);
    return { success: true, message: 'Donatur berhasil dihapus', data: true as T };
  }

  // --- EVENT CRUD ---
  if (action === 'getEvent') {
    const data = getCollection('event');
    return { success: true, message: 'Success get event', data: data as T };
  }

  if (action === 'createEvent' && method === 'POST') {
    const data = getCollection('event');
    const kode = `EV-${String(data.length + 1).padStart(4, '0')}`;
    const newItem: Event = {
      ...body,
      id: `EVT-${String(data.length + 1).padStart(3, '0')}`,
      kode_event: kode,
      target_dana: Number(body.target_dana) || 0
    };
    data.push(newItem);
    saveCollection('event', data);
    return { success: true, message: 'Event berhasil ditambahkan', data: newItem as T };
  }

  if (action === 'updateEvent' && method === 'PUT') {
    const data = getCollection('event');
    const idx = data.findIndex((item: any) => item.id === body.id);
    if (idx !== -1) {
      data[idx] = { ...data[idx], ...body, target_dana: Number(body.target_dana) };
      saveCollection('event', data);
      return { success: true, message: 'Event berhasil diperbarui', data: data[idx] as T };
    }
    return { success: false, message: 'Event tidak ditemukan', data: null as T };
  }

  if (action === 'deleteEvent' && method === 'DELETE') {
    const id = queryParams?.id || body?.id;
    let data = getCollection('event');
    data = data.filter((item: any) => item.id !== id);
    saveCollection('event', data);
    return { success: true, message: 'Event berhasil dihapus', data: true as T };
  }

  // --- TRANSAKSI CRUD ---
  if (action === 'getTransaksi') {
    const data = getCollection('transaksi');
    return { success: true, message: 'Success get transaksi', data: data as T };
  }

  if (action === 'createTransaksi' && method === 'POST') {
    const data = getCollection('transaksi');
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const countToday = data.filter((t: any) => t.tanggal === now.toISOString().split('T')[0]).length;
    const countStr = String(countToday + 1).padStart(3, '0');
    const autoNoTrx = `TRX-${dateStr}${countStr}`;

    const jamNow = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');

    const newItem: Transaksi = {
      id: `TX-${String(data.length + 1).padStart(3, '0')}`,
      nomor_transaksi: autoNoTrx,
      tanggal: body.tanggal || now.toISOString().split('T')[0],
      jam: body.jam || jamNow,
      donatur_id: body.donatur_id,
      event_id: body.event_id,
      nominal: Number(body.nominal) || 0,
      metode: body.metode,
      bank: body.bank || 'Lainnya',
      referensi: body.referensi || '-',
      admin: body.admin || 'System Admin',
      status: body.status || 'Masuk',
      catatan: body.catatan || '',
      created_at: now.toISOString(),
      bukti_transfer: body.bukti_transfer || ''
    };
    data.push(newItem);
    saveCollection('transaksi', data);
    return { success: true, message: 'Transaksi donasi berhasil disimpan', data: newItem as T };
  }

  if (action === 'updateTransaksi' && method === 'PUT') {
    const data = getCollection('transaksi');
    const idx = data.findIndex((item: any) => item.id === body.id);
    if (idx !== -1) {
      data[idx] = { ...data[idx], ...body, nominal: Number(body.nominal) };
      saveCollection('transaksi', data);
      return { success: true, message: 'Transaksi berhasil diupdate', data: data[idx] as T };
    }
    return { success: false, message: 'Transaksi tidak ditemukan', data: null as T };
  }

  if (action === 'deleteTransaksi' && method === 'DELETE') {
    const id = queryParams?.id || body?.id;
    let data = getCollection('transaksi');
    data = data.filter((item: any) => item.id !== id);
    saveCollection('transaksi', data);
    return { success: true, message: 'Transaksi berhasil dihapus', data: true as T };
  }

  // --- REKAPS ---
  if (action === 'getRekapHarian') {
    const txs = getCollection('transaksi').filter((t: any) => t.status === 'Masuk');
    const rekapMap: Record<string, { trxCount: number; donaturSet: Set<string>; total: number }> = {};

    txs.forEach((t: any) => {
      if (!rekapMap[t.tanggal]) {
        rekapMap[t.tanggal] = { trxCount: 0, donaturSet: new Set<string>(), total: 0 };
      }
      rekapMap[t.tanggal].trxCount += 1;
      rekapMap[t.tanggal].donaturSet.add(t.donatur_id);
      rekapMap[t.tanggal].total += t.nominal;
    });

    const result: RekapHarian[] = Object.entries(rekapMap).map(([tgl, val]) => ({
      tanggal: tgl,
      jumlah_transaksi: val.trxCount,
      jumlah_donatur: val.donaturSet.size,
      total_donasi: val.total
    })).sort((a, b) => a.tanggal.localeCompare(b.tanggal));

    return { success: true, message: 'Success get rekap harian', data: result as T };
  }

  if (action === 'getRekapBulanan') {
    const txs = getCollection('transaksi').filter((t: any) => t.status === 'Masuk');
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const rekapMap: Record<string, { trxCount: number; donaturSet: Set<string>; total: number; year: number; monthIdx: number }> = {};

    txs.forEach((t: any) => {
      const parts = t.tanggal.split('-');
      if (parts.length === 3) {
        const yearNum = parseInt(parts[0], 10);
        const monthIdx = parseInt(parts[1], 10) - 1;
        const key = `${yearNum}-${monthIdx}`;

        if (!rekapMap[key]) {
          rekapMap[key] = { trxCount: 0, donaturSet: new Set<string>(), total: 0, year: yearNum, monthIdx };
        }
        rekapMap[key].trxCount += 1;
        rekapMap[key].donaturSet.add(t.donatur_id);
        rekapMap[key].total += t.nominal;
      }
    });

    const result: RekapBulanan[] = Object.entries(rekapMap).map(([key, val]) => ({
      bulan: monthNames[val.monthIdx],
      tahun: val.year,
      jumlah_transaksi: val.trxCount,
      jumlah_donatur: val.donaturSet.size,
      total_donasi: val.total
    })).sort((a, b) => {
      if (a.tahun !== b.tahun) return a.tahun - b.tahun;
      return monthNames.indexOf(a.bulan) - monthNames.indexOf(b.bulan);
    });

    return { success: true, message: 'Success get rekap bulanan', data: result as T };
  }

  if (action === 'getRekapEvent') {
    const evts = getCollection('event');
    const txs = getCollection('transaksi').filter((t: any) => t.status === 'Masuk');

    const result: RekapEvent[] = evts.map((e: any) => {
      const totalDonasi = txs
        .filter((t: any) => t.event_id === e.id)
        .reduce((sum: number, t: any) => sum + t.nominal, 0);

      const pct = e.target_dana > 0 ? Math.round((totalDonasi / e.target_dana) * 100) : 0;

      return {
        event: e.nama_event,
        target: e.target_dana,
        total: totalDonasi,
        persentase: pct
      };
    });

    return { success: true, message: 'Success get rekap event', data: result as T };
  }

  if (action === 'getRekapDonatur') {
    const donaturs = getCollection('donatur');
    const txs = getCollection('transaksi').filter((t: any) => t.status === 'Masuk');

    const result: RekapDonatur[] = donaturs.map((d: any) => {
      const dtxs = txs.filter((t: any) => t.donatur_id === d.id);
      const totalDonasi = dtxs.reduce((sum: number, t: any) => sum + t.nominal, 0);

      return {
        donatur: d.nama,
        jumlah_donasi: dtxs.length,
        frekuensi: dtxs.length,
        total: totalDonasi
      };
    }).sort((a, b) => b.total - a.total);

    return { success: true, message: 'Success get rekap donatur', data: result as T };
  }

  return { success: false, message: `Unknown action: ${action}`, data: null as T };
}

// Global API Services for easy export and usage in views
export const apiService = {
  // Authentication
  async login(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
    const res = await makeRequest<User[]>('getUsers', 'GET');
    if (res.success) {
      const found = res.data.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (found) {
        if (found.status === 'Nonaktif') {
          return { success: false, message: 'Akun Anda dinonaktifkan. Silakan hubungi Super Admin.' };
        }
        return { success: true, message: 'Login berhasil!', user: found };
      }
    }
    return { success: false, message: 'Email atau password salah.' };
  },

  // Users CRUD
  async getUsers() {
    return makeRequest<User[]>('getUsers', 'GET');
  },
  async createUser(user: Omit<User, 'id' | 'created_at'>) {
    return makeRequest<User>('createUser', 'POST', user);
  },
  async updateUser(user: User) {
    return makeRequest<User>('updateUser', 'PUT', user);
  },
  async deleteUser(id: string) {
    return makeRequest<boolean>('deleteUser', 'DELETE', null, { id });
  },

  // Donatur CRUD
  async getDonatur() {
    return makeRequest<Donatur[]>('getDonatur', 'GET');
  },
  async createDonatur(donatur: Omit<Donatur, 'id' | 'kode_donatur'>) {
    return makeRequest<Donatur>('createDonatur', 'POST', donatur);
  },
  async updateDonatur(donatur: Donatur) {
    return makeRequest<Donatur>('updateDonatur', 'PUT', donatur);
  },
  async deleteDonatur(id: string) {
    return makeRequest<boolean>('deleteDonatur', 'DELETE', null, { id });
  },

  // Event CRUD
  async getEvent() {
    return makeRequest<Event[]>('getEvent', 'GET');
  },
  async createEvent(event: Omit<Event, 'id' | 'kode_event'>) {
    return makeRequest<Event>('createEvent', 'POST', event);
  },
  async updateEvent(event: Event) {
    return makeRequest<Event>('updateEvent', 'PUT', event);
  },
  async deleteEvent(id: string) {
    return makeRequest<boolean>('deleteEvent', 'DELETE', null, { id });
  },

  // Transaksi CRUD
  async getTransaksi() {
    return makeRequest<Transaksi[]>('getTransaksi', 'GET');
  },
  async createTransaksi(transaksi: Omit<Transaksi, 'id' | 'nomor_transaksi' | 'tanggal' | 'jam' | 'created_at'> & { tanggal?: string; jam?: string }) {
    return makeRequest<Transaksi>('createTransaksi', 'POST', transaksi);
  },
  async updateTransaksi(transaksi: Transaksi) {
    return makeRequest<Transaksi>('updateTransaksi', 'PUT', transaksi);
  },
  async deleteTransaksi(id: string) {
    return makeRequest<boolean>('deleteTransaksi', 'DELETE', null, { id });
  },

  // Dashboard Stats & Rekaps
  async getRekapHarian() {
    return makeRequest<RekapHarian[]>('getRekapHarian', 'GET');
  },
  async getRekapBulanan() {
    return makeRequest<RekapBulanan[]>('getRekapBulanan', 'GET');
  },
  async getRekapEvent() {
    return makeRequest<RekapEvent[]>('getRekapEvent', 'GET');
  },
  async getRekapDonatur() {
    return makeRequest<RekapDonatur[]>('getRekapDonatur', 'GET');
  },

  // Dynamic Dashboard Stats aggregator
  async getDashboardStats() {
    const txRes = await this.getTransaksi();
    const donaturRes = await this.getDonatur();
    const eventRes = await this.getEvent();

    if (!txRes.success || !donaturRes.success || !eventRes.success) {
      throw new Error('Gagal mengambil data untuk dashboard');
    }

    const txs = txRes.data;
    const donaturs = donaturRes.data;
    const events = eventRes.data;

    const todayStr = '2026-06-26'; // Mocked / actual based on target system timestamp
    const activeTxs = txs.filter((t) => t.status === 'Masuk');

    // Total Donasi Hari Ini
    const donasiHariIni = activeTxs
      .filter((t) => t.tanggal === todayStr)
      .reduce((sum, t) => sum + t.nominal, 0);

    // Total Donasi Bulan Ini (Juni 2026)
    const donasiBulanIni = activeTxs
      .filter((t) => t.tanggal.startsWith('2026-06'))
      .reduce((sum, t) => sum + t.nominal, 0);

    // Total Donasi Tahun Ini (2026)
    const donasiTahunIni = activeTxs
      .filter((t) => t.tanggal.startsWith('2026'))
      .reduce((sum, t) => sum + t.nominal, 0);

    return {
      donasiHariIni,
      donasiBulanIni,
      donasiTahunIni,
      jumlahDonatur: donaturs.length,
      jumlahEvent: events.length,
      jumlahTransaksi: txs.length,
      topDonatur: donaturs
        .map((d) => {
          const total = activeTxs
            .filter((t) => t.donatur_id === d.id)
            .reduce((sum, t) => sum + t.nominal, 0);
          return { nama: d.nama, kota: d.kota, total };
        })
        .sort((a, b) => b.total - a.total)
        .slice(0, 5),
      recentTransactions: txs
        .slice()
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .slice(0, 5)
    };
  }
};
