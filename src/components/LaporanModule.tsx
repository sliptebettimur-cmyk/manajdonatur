import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Transaksi, Donatur, Event } from '../types';
import {
  FileSpreadsheet,
  Search,
  Filter,
  FileDown,
  Printer,
  Calendar,
  Layers,
  Users,
  UserCheck,
  CheckCircle2,
  Clock,
  XCircle,
  FileCheck
} from 'lucide-react';

export default function LaporanModule() {
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [donaturs, setDonaturs] = useState<Donatur[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterMonth, setFilterMonth] = useState('Semua');
  const [filterYear, setFilterYear] = useState('Semua');
  const [filterEventId, setFilterEventId] = useState('Semua');
  const [filterDonaturId, setFilterDonaturId] = useState('Semua');
  const [filterAdmin, setFilterAdmin] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  const loadLaporanData = async () => {
    setLoading(true);
    try {
      const txRes = await apiService.getTransaksi();
      const donRes = await apiService.getDonatur();
      const evRes = await apiService.getEvent();

      if (txRes.success) setTransaksi(txRes.data);
      if (donRes.success) setDonaturs(donRes.data);
      if (evRes.success) setEvents(evRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLaporanData();
  }, []);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Extract distinct admins for filter dropdown
  const adminList = Array.from(new Set(transaksi.map((t) => t.admin))).filter(Boolean);

  // Filter Logic
  const filteredTxs = transaksi.filter((t) => {
    // 1. Search term (Invoice number or notes)
    const matchesSearch =
      t.nomor_transaksi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.catatan && t.catatan.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.referensi && t.referensi.toLowerCase().includes(searchTerm.toLowerCase()));

    // 2. Date Range
    let matchesDate = true;
    if (filterStartDate) {
      matchesDate = matchesDate && t.tanggal >= filterStartDate;
    }
    if (filterEndDate) {
      matchesDate = matchesDate && t.tanggal <= filterEndDate;
    }

    // 3. Month & Year (if date range not set or in combination)
    let matchesMonthYear = true;
    const dateParts = t.tanggal.split('-'); // [YYYY, MM, DD]
    if (dateParts.length === 3) {
      if (filterMonth !== 'Semua') {
        matchesMonthYear = matchesMonthYear && dateParts[1] === filterMonth;
      }
      if (filterYear !== 'Semua') {
        matchesMonthYear = matchesMonthYear && dateParts[0] === filterYear;
      }
    }

    // 4. Dropdowns
    const matchesEvent = filterEventId === 'Semua' || t.event_id === filterEventId;
    const matchesDonatur = filterDonaturId === 'Semua' || t.donatur_id === filterDonaturId;
    const matchesAdmin = filterAdmin === 'Semua' || t.admin === filterAdmin;
    const matchesStatus = filterStatus === 'Semua' || t.status === filterStatus;

    return matchesSearch && matchesDate && matchesMonthYear && matchesEvent && matchesDonatur && matchesAdmin && matchesStatus;
  });

  // Totals calculations based on filtered list
  const totalDonasiBerhasil = filteredTxs
    .filter((t) => t.status === 'Masuk')
    .reduce((sum, t) => sum + t.nominal, 0);

  const totalDonasiPending = filteredTxs
    .filter((t) => t.status === 'Pending')
    .reduce((sum, t) => sum + t.nominal, 0);

  const totalDonasiBatal = filteredTxs
    .filter((t) => t.status === 'Batal')
    .reduce((sum, t) => sum + t.nominal, 0);

  const getDonaturName = (id: string) => {
    return donaturs.find((d) => d.id === id)?.nama || 'Donatur Umum';
  };

  const getEventName = (id: string) => {
    return events.find((e) => e.id === id)?.nama_event || 'Program Umum';
  };

  // Status Badge components
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Masuk':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Masuk
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            Pending
          </span>
        );
      case 'Batal':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            Batal
          </span>
        );
      default:
        return null;
    }
  };

  // Reset Filters helper
  const handleResetFilters = () => {
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterMonth('Semua');
    setFilterYear('Semua');
    setFilterEventId('Semua');
    setFilterDonaturId('Semua');
    setFilterAdmin('Semua');
    setFilterStatus('Semua');
    setSearchTerm('');
  };

  // Export CSV
  const handleExportCSV = () => {
    try {
      const headers = ['ID', 'Nomor Transaksi', 'Tanggal', 'Jam', 'Donatur', 'Program Event', 'Nominal', 'Metode', 'Bank', 'Referensi', 'Admin', 'Status', 'Catatan'];
      const rows = filteredTxs.map((t) => [
        t.id,
        t.nomor_transaksi,
        t.tanggal,
        t.jam,
        `"${getDonaturName(t.donatur_id).replace(/"/g, '""')}"`,
        `"${getEventName(t.event_id).replace(/"/g, '""')}"`,
        t.nominal,
        t.metode,
        t.bank,
        t.referensi,
        `"${t.admin.replace(/"/g, '""')}"`,
        t.status,
        `"${(t.catatan || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF'
        + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Laporan_Donasi_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('Gagal mengekspor laporan.');
    }
  };

  const handlePrintLaporan = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 print:p-0">
      
      {/* Page Header (Hidden on print) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Laporan Donasi</h1>
          <p className="text-slate-500 text-sm mt-1">
            Filter multi-dimensi transaksi donasi, cetak rekapitulasi penyerahan dana, dan export database spreadsheet.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-md transition-all border border-slate-300 shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrintLaporan}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-md transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Card (Hidden on print) */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs space-y-4 print:hidden">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm pb-2 border-b border-slate-100">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>Filter Laporan Multi-Kriteria</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* 1. Date Range */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tanggal Mulai</span>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tanggal Selesai</span>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* 2. Month Selector */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bulan Transaksi</span>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer text-slate-800"
            >
              <option value="Semua">Semua Bulan</option>
              <option value="01">Januari</option>
              <option value="02">Februari</option>
              <option value="03">Maret</option>
              <option value="04">April</option>
              <option value="05">Mei</option>
              <option value="06">Juni</option>
              <option value="07">Juli</option>
              <option value="08">Agustus</option>
              <option value="09">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
          </div>

          {/* 3. Year Selector */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tahun</span>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer text-slate-800"
            >
              <option value="Semua">Semua Tahun</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>

          {/* 4. Event Selector */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Program Event</span>
            <select
              value={filterEventId}
              onChange={(e) => setFilterEventId(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer text-slate-800"
            >
              <option value="Semua">Semua Program</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.nama_event}</option>
              ))}
            </select>
          </div>

          {/* 5. Donatur Selector */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Donatur</span>
            <select
              value={filterDonaturId}
              onChange={(e) => setFilterDonaturId(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer text-slate-800"
            >
              <option value="Semua">Semua Donatur</option>
              {donaturs.map((d) => (
                <option key={d.id} value={d.id}>{d.nama}</option>
              ))}
            </select>
          </div>

          {/* 6. Admin Selector */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Admin Input</span>
            <select
              value={filterAdmin}
              onChange={(e) => setFilterAdmin(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer text-slate-800"
            >
              <option value="Semua">Semua Admin</option>
              {adminList.map((admin, idx) => (
                <option key={idx} value={admin}>{admin}</option>
              ))}
            </select>
          </div>

          {/* 7. Status Selector */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status Transaksi</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer text-slate-800"
            >
              <option value="Semua">Semua Status</option>
              <option value="Masuk">Masuk / Sukses</option>
              <option value="Pending">Pending</option>
              <option value="Batal">Batal</option>
            </select>
          </div>

        </div>

        {/* Search bar and Reset button inside Filter Card */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-slate-100 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="Cari kata kunci (No. Trx, catatan...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleResetFilters}
            className="px-4 py-1.5 border border-slate-300 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shrink-0 w-full sm:w-auto cursor-pointer text-slate-700"
          >
            Bersihkan Filter
          </button>
        </div>
      </div>

      {/* Consolidated Financial Summary Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs border-l-4 border-l-indigo-600">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Donasi Masuk (Berhasil)</span>
          <h3 className="text-xl font-extrabold text-indigo-700 leading-none mt-2">
            {formatRupiah(totalDonasiBerhasil)}
          </h3>
          <p className="text-[10px] text-slate-400 mt-2">Akumulasi donasi sah</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs border-l-4 border-l-amber-500">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Donasi Tertunda (Pending)</span>
          <h3 className="text-xl font-extrabold text-amber-700 leading-none mt-2">
            {formatRupiah(totalDonasiPending)}
          </h3>
          <p className="text-[10px] text-slate-400 mt-2">Dana dalam proses verifikasi bank</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs border-l-4 border-l-rose-500">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Donasi Dibatalkan</span>
          <h3 className="text-xl font-extrabold text-rose-700 leading-none mt-2">
            {formatRupiah(totalDonasiBatal)}
          </h3>
          <p className="text-[10px] text-slate-400 mt-2">Transaksi dibatalkan atau kedaluwarsa</p>
        </div>
      </div>

      {/* Printable Report Header */}
      <div className="hidden print:block text-center space-y-2 border-b-2 border-slate-900 pb-4 mb-6">
        <h2 className="text-xl font-bold tracking-tight uppercase text-slate-950">LAPORAN MUTASI DAN REKAPITULASI DONASI</h2>
        <p className="text-xs text-slate-600 font-sans font-semibold">
          YAYASAN AMAL NUSANTARA • DEPOK • JAWA BARAT<br />
          Periode Cetak: {new Date().toISOString().split('T')[0]} • Diunduh oleh: Admin Keuangan
        </p>
      </div>

      {/* Mutasi Table Card */}
      <div className="bg-white border border-slate-200 rounded-md p-6 shadow-xs">
        <div className="flex justify-between items-center mb-4 print:hidden">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mutasi Detail ({filteredTxs.length} Transaksi)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-500 print:text-[10px]">
            <thead className="text-[10px] font-bold text-slate-700 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">No. Transaksi</th>
                <th className="px-4 py-3">Tanggal / Jam</th>
                <th className="px-4 py-3">Donatur</th>
                <th className="px-4 py-3">Program Tujuan</th>
                <th className="px-4 py-3">Metode</th>
                <th className="px-4 py-3">Nominal</th>
                <th className="px-4 py-3">Admin</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-slate-900 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-sm italic">Loading data mutasi...</td>
                </tr>
              ) : filteredTxs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-sm italic text-slate-400">Tidak ada data donasi yang cocok dengan filter kriteria.</td>
                </tr>
              ) : (
                filteredTxs.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors print:hover:bg-transparent">
                    <td className="px-4 py-3 font-bold text-slate-950 font-mono">{t.nomor_transaksi}</td>
                    <td className="px-4 py-3">
                      <div>{t.tanggal}</div>
                      <div className="text-[9px] text-slate-400 font-normal">{t.jam}</div>
                    </td>
                    <td className="px-4 py-3">{getDonaturName(t.donatur_id)}</td>
                    <td className="px-4 py-3 max-w-[200px] truncate" title={getEventName(t.event_id)}>
                      {getEventName(t.event_id)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {t.metode} {t.bank !== 'Lainnya' ? `(${t.bank})` : ''}
                    </td>
                    <td className="px-4 py-3 font-extrabold text-slate-950">
                      {formatRupiah(t.nominal)}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-normal">{t.admin}</td>
                    <td className="px-4 py-3">{getStatusBadge(t.status)}</td>
                  </tr>
                ))
              )}
              {/* Grand Total row */}
              {!loading && filteredTxs.length > 0 && (
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                  <td colSpan={5} className="px-4 py-4 text-slate-800 text-right uppercase tracking-wider">
                    Total Dana Masuk Sah (Berhasil):
                  </td>
                  <td colSpan={3} className="px-4 py-4 text-indigo-800 text-sm font-black text-left">
                    {formatRupiah(totalDonasiBerhasil)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print Signature panel (Visible only on print layout) */}
      <div className="hidden print:grid grid-cols-2 gap-8 pt-12 text-xs text-center items-end">
        <div>
          <span className="text-slate-500 block">Mengetahui,</span>
          <span className="font-semibold text-slate-800 block mt-1">Ketua Yayasan Amal Nusantara</span>
          <div className="h-20" />
          <span className="font-bold text-slate-950 underline block">Drs. H. Mulyadi</span>
        </div>
        <div>
          <span className="text-slate-500 block">Dibuat Oleh,</span>
          <span className="font-semibold text-slate-800 block mt-1">Staf Keuangan Yayasan</span>
          <div className="h-20" />
          <span className="font-bold text-slate-950 underline block">Siti Rahmawati</span>
        </div>
      </div>

    </div>
  );
}
