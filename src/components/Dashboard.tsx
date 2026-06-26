import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { RekapHarian, RekapBulanan, RekapEvent, Transaksi } from '../types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import {
  ArrowUpRight,
  TrendingUp,
  Users,
  Calendar,
  Wallet,
  Activity,
  Award,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [rekapHarian, setRekapHarian] = useState<RekapHarian[]>([]);
  const [rekapBulanan, setRekapBulanan] = useState<RekapBulanan[]>([]);
  const [rekapEvent, setRekapEvent] = useState<RekapEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsData = await apiService.getDashboardStats();
      const harianData = await apiService.getRekapHarian();
      const bulananData = await apiService.getRekapBulanan();
      const eventData = await apiService.getRekapEvent();

      setStats(statsData);
      setRekapHarian(harianData.success ? harianData.data : []);
      setRekapBulanan(bulananData.success ? bulananData.data : []);
      setRekapEvent(eventData.success ? eventData.data : []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Status Badge components
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Masuk':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Berhasil
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Pending
          </span>
        );
      case 'Batal':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            Batal
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Skeleton cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 p-6 rounded-xl h-32 space-y-3" />
          ))}
        </div>
        {/* Skeleton charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-xl h-[350px]" />
          <div className="bg-white border border-slate-200 p-6 rounded-xl h-[350px]" />
        </div>
      </div>
    );
  }

  // Event Categories colors for Pie/Bar charts
  const COLORS = ['#6366f1', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981'];

  // Formatting date nicely
  const formatDateIndo = (dateStr: string) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]} ${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <div className="space-y-8 font-sans text-slate-900">
      
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Ringkasan data, grafik donasi harian/bulanan, dan perkembangan program donasi yayasan.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-md transition-all border border-slate-800 shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 animate-hover-spin" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Donasi Hari Ini */}
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/40 rounded-bl-full -z-10 group-hover:scale-105 transition-transform" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Donasi Hari Ini</span>
            <div className="w-9 h-9 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {formatRupiah(stats?.donasiHariIni || 0)}
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
              <span className="text-indigo-600 font-semibold inline-flex items-center">
                <ArrowUpRight className="w-3 h-3" /> Aktif
              </span>
              <span>Terupdate real-time</span>
            </p>
          </div>
        </div>

        {/* 2. Donasi Bulan Ini */}
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/40 rounded-bl-full -z-10 group-hover:scale-105 transition-transform" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Donasi Bulan Ini</span>
            <div className="w-9 h-9 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {formatRupiah(stats?.donasiBulanIni || 0)}
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
              <span className="text-blue-600 font-semibold inline-flex items-center">Juni 2026</span>
              <span>Periode aktif berjalan</span>
            </p>
          </div>
        </div>

        {/* 3. Donasi Tahun Ini */}
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/40 rounded-bl-full -z-10 group-hover:scale-105 transition-transform" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Donasi Tahun Ini</span>
            <div className="w-9 h-9 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
              <Activity className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {formatRupiah(stats?.donasiTahunIni || 0)}
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
              <span className="text-purple-600 font-semibold inline-flex items-center">Tahun 2026</span>
              <span>Total akumulasi donasi</span>
            </p>
          </div>
        </div>

        {/* 4. Jumlah Donatur */}
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-xs flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-10 h-10 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Donatur</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {stats?.jumlahDonatur || 0}
            </h3>
            <p className="text-xs text-slate-500">Orang & Lembaga</p>
          </div>
        </div>

        {/* 5. Jumlah Event */}
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-xs flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-10 h-10 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Kampanye Event</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {stats?.jumlahEvent || 0}
            </h3>
            <p className="text-xs text-slate-500">Program Aktif & Selesai</p>
          </div>
        </div>

        {/* 6. Jumlah Transaksi */}
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-xs flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-10 h-10 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Transaksi</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {stats?.jumlahTransaksi || 0}
            </h3>
            <p className="text-xs text-slate-500">Seluruh Status Log</p>
          </div>
        </div>
      </div>

      {/* Recharts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Harian (Line Chart) */}
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-xs flex flex-col">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Grafik Donasi Harian (Juni 2026)</h3>
          <p className="text-xs text-slate-400 mb-6">Tren masuk donasi per tanggal transaksi</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rekapHarian.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="tanggal" stroke="#64748b" fontSize={11} tickFormatter={(val) => val.split('-')[2]} />
                <YAxis stroke="#64748b" fontSize={11} width={60} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip
                  formatter={(val: number) => [formatRupiah(val), 'Total Donasi']}
                  labelFormatter={(lbl) => `Tanggal: ${formatDateIndo(String(lbl))}`}
                />
                <Line type="monotone" dataKey="total_donasi" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bulanan (Bar Chart) */}
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-xs flex flex-col">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Akumulasi Bulanan (Tahun 2026)</h3>
          <p className="text-xs text-slate-400 mb-6">Total donasi terkumpul berdasarkan bulan</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rekapBulanan}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="bulan" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} width={60} tickFormatter={(val) => `${val / 1000000}M`} />
                <Tooltip formatter={(val: number) => [formatRupiah(val), 'Total Terkumpul']} />
                <Bar dataKey="total_donasi" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {rekapBulanan.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Progress (Bar Chart Target vs Realization) */}
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-xs flex flex-col lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Progress Pencapaian Dana Event</h3>
          <p className="text-xs text-slate-400 mb-6">Perbandingan donasi masuk dibanding target dana (Top 8 Program)</p>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rekapEvent.filter(e => e.target > 0).slice(0, 8)} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="event" stroke="#64748b" fontSize={10} tickFormatter={(val) => val.length > 20 ? `${val.substring(0, 18)}...` : val} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `${val / 1000000}jt`} />
                <Tooltip formatter={(val: number) => [formatRupiah(val)]} />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar dataKey="target" name="Target Dana" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total" name="Realisasi Donasi" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: Top Donors & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Top Donors Table */}
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-xs lg:col-span-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">Top Donatur</h3>
            <p className="text-xs text-slate-400 mb-6">Pemberi kontribusi donasi terbesar saat ini</p>
            <div className="divide-y divide-slate-100">
              {stats?.topDonatur?.map((d: any, index: number) => (
                <div key={index} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{d.nama}</h4>
                      <p className="text-xs text-slate-400">{d.kota}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{formatRupiah(d.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions list */}
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-xs lg:col-span-7 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">Transaksi Terbaru</h3>
            <p className="text-xs text-slate-400 mb-6">Log status donasi yang baru saja diinput</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-500">
                <thead className="text-xs font-semibold text-slate-700 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">No. Transaksi</th>
                    <th className="px-4 py-3">Tanggal / Jam</th>
                    <th className="px-4 py-3">Nominal</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-900 font-medium">
                  {stats?.recentTransactions?.map((tx: Transaksi) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{tx.nomor_transaksi}</div>
                        <div className="text-[10px] text-slate-400 font-mono font-normal">via {tx.metode} ({tx.bank})</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-700 text-xs">{formatDateIndo(tx.tanggal)}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{tx.jam}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {formatRupiah(tx.nominal)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {getStatusBadge(tx.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
