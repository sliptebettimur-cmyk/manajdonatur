import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Event } from '../types';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  AlertCircle,
  Check,
  Calendar,
  User,
  TrendingUp,
  Award,
  Archive,
  RefreshCw,
  Clock
} from 'lucide-react';

export default function EventModule() {
  const [events, setEvents] = useState<Event[]>([]);
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [filterKategori, setFilterKategori] = useState<string>('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    nama_event: '',
    kategori: 'Sosial & Kemanusiaan',
    target_dana: 0,
    tanggal_mulai: '',
    tanggal_selesai: '',
    status: 'Aktif' as 'Aktif' | 'Selesai' | 'Draf',
    PIC: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchEventsAndTransactions = async () => {
    setLoading(true);
    try {
      const evRes = await apiService.getEvent();
      const txRes = await apiService.getTransaksi();
      if (evRes.success) {
        setEvents(evRes.data);
      }
      if (txRes.success) {
        setTxs(txRes.data.filter((t: any) => t.status === 'Masuk'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsAndTransactions();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      nama_event: '',
      kategori: 'Sosial & Kemanusiaan',
      target_dana: 50000000,
      tanggal_mulai: new Date().toISOString().split('T')[0],
      tanggal_selesai: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Aktif',
      PIC: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Event) => {
    setEditingItem(item);
    setFormData({
      nama_event: item.nama_event,
      kategori: item.kategori,
      target_dana: item.target_dana,
      tanggal_mulai: item.tanggal_mulai,
      tanggal_selesai: item.tanggal_selesai,
      status: item.status,
      PIC: item.PIC
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.nama_event.trim()) errors.nama_event = 'Nama program event wajib diisi';
    if (!formData.kategori.trim()) errors.kategori = 'Kategori wajib dipilih';
    if (formData.target_dana <= 0) errors.target_dana = 'Target dana harus lebih besar dari Rp 0';
    if (!formData.tanggal_mulai) errors.tanggal_mulai = 'Tanggal mulai wajib diisi';
    if (!formData.tanggal_selesai) errors.tanggal_selesai = 'Tanggal selesai wajib diisi';
    if (!formData.PIC.trim()) errors.PIC = 'Penanggung jawab (PIC) wajib diisi';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingItem) {
        const res = await apiService.updateEvent({
          ...editingItem,
          ...formData
        });
        if (res.success) {
          triggerAlert('success', `Program "${formData.nama_event}" berhasil diperbarui.`);
          fetchEventsAndTransactions();
        } else {
          triggerAlert('error', res.message);
        }
      } else {
        const res = await apiService.createEvent(formData);
        if (res.success) {
          triggerAlert('success', `Program baru "${formData.nama_event}" berhasil didaftarkan.`);
          fetchEventsAndTransactions();
        } else {
          triggerAlert('error', res.message);
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      triggerAlert('error', 'Gagal menyimpan data program.');
    }
  };

  const handleDelete = async (item: Event) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus program "${item.nama_event}"?\nSeluruh laporan terkait akan diarsipkan.`)) {
      try {
        const res = await apiService.deleteEvent(item.id);
        if (res.success) {
          triggerAlert('success', 'Program event berhasil dihapus.');
          fetchEventsAndTransactions();
        } else {
          triggerAlert('error', res.message);
        }
      } catch (err) {
        triggerAlert('error', 'Gagal menghapus program.');
      }
    }
  };

  const triggerAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getEventTotalDonasi = (eventId: string) => {
    return txs
      .filter((t) => t.event_id === eventId)
      .reduce((sum, t) => sum + t.nominal, 0);
  };

  // Filter & Search
  const filteredEvents = events.filter((item) => {
    const matchesSearch =
      item.nama_event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode_event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.PIC.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'Semua' || item.status === filterStatus;
    const matchesKategori = filterKategori === 'Semua' || item.kategori === filterKategori;

    return matchesSearch && matchesStatus && matchesKategori;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aktif':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Selesai':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Draf':
        return 'bg-zinc-100 text-zinc-600 border-zinc-200';
      default:
        return 'bg-zinc-50 text-zinc-500 border-zinc-150';
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-900">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Program Penggalangan (Event)</h1>
          <p className="text-slate-500 text-sm mt-1">
            Daftar program amal/wakaf yayasan beserta persentase progress pengumpulan donasi.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-md transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Program</span>
        </button>
      </div>

      {/* Alert Message */}
      {alertMsg && (
        <div className={`p-4 border rounded-md flex items-center gap-3 animate-fade-in ${
          alertMsg.type === 'success' ? 'bg-indigo-50 border-indigo-100 text-indigo-800' : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          {alertMsg.type === 'success' ? <Check className="w-5 h-5 text-indigo-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
          <span className="text-sm font-medium">{alertMsg.text}</span>
        </div>
      )}

      {/* Filters bar */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Cari program, kode, PIC..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer text-slate-800"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Status ...</option>
              <option value="Selesai">Status Selesai</option>
              <option value="Draf">Status Draf</option>
            </select>
          </div>

          <div>
            <select
              value={filterKategori}
              onChange={(e) => { setFilterKategori(e.target.value); setCurrentPage(1); }}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer text-slate-800"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Sosial & Kemanusiaan">Sosial & Kemanusiaan</option>
              <option value="Wakaf & Keagamaan">Wakaf & Keagamaan</option>
              <option value="Pendidikan & Yatim">Pendidikan & Yatim</option>
              <option value="Infrastruktur Keagamaan">Infrastruktur Keagamaan</option>
              <option value="Darurat & Kebencanaan">Darurat & Kebencanaan</option>
              <option value="Kesehatan">Kesehatan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 p-6 rounded-md h-60 animate-pulse" />
          ))}
        </div>
      ) : paginatedEvents.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-md p-12 text-center max-w-xl mx-auto">
          <Archive className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">Tidak ada program ditemukan</h3>
          <p className="text-slate-500 text-sm mt-1">Coba ubah filter atau tambahkan program baru.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedEvents.map((item) => {
              const totalTerkumpul = getEventTotalDonasi(item.id);
              const persentase = item.target_dana > 0 ? Math.min(100, Math.round((totalTerkumpul / item.target_dana) * 100)) : 0;
              return (
                <div key={item.id} className="bg-white border border-slate-200 rounded-md p-6 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.kategori}</span>
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-950 line-clamp-1" title={item.nama_event}>{item.nama_event}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{item.kode_event}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Progress Terkumpul</span>
                        <span className="text-indigo-600 font-bold">{persentase}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${persentase}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-semibold mt-1">
                        <span className="text-indigo-600">{formatRupiah(totalTerkumpul)}</span>
                        <span className="text-slate-400">Target: {formatRupiah(item.target_dana)}</span>
                      </div>
                    </div>

                    {/* Footer Details */}
                    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
                      <div>
                        <span className="block text-slate-400 font-medium">Masa Program</span>
                        <span className="font-semibold text-slate-700 block truncate">
                          {item.tanggal_mulai} s/d {item.tanggal_selesai}
                        </span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium">PIC Admin</span>
                        <span className="font-semibold text-slate-700 block truncate">{item.PIC}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-4 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md transition-colors flex items-center justify-center cursor-pointer"
                      title="Edit Program"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md transition-colors flex items-center justify-center cursor-pointer"
                      title="Hapus Program"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-4">
              <span className="text-sm text-slate-500">
                Menampilkan halaman {currentPage} dari {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  Sebelumnya
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-lg shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="h-16 border-b border-slate-150 px-6 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2 text-slate-900">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-lg">{editingItem ? 'Edit Program Amal' : 'Tambah Program Amal Baru'}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Program / Event *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Renovasi Jembatan Desa Tertinggal"
                  value={formData.nama_event}
                  onChange={(e) => setFormData({ ...formData, nama_event: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                {formErrors.nama_event && <p className="text-rose-600 text-xs mt-1">{formErrors.nama_event}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kategori Program *</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer text-slate-850"
                  >
                    <option value="Sosial & Kemanusiaan">Sosial & Kemanusiaan</option>
                    <option value="Wakaf & Keagamaan">Wakaf & Keagamaan</option>
                    <option value="Pendidikan & Yatim">Pendidikan & Yatim</option>
                    <option value="Infrastruktur Keagamaan">Infrastruktur Keagamaan</option>
                    <option value="Darurat & Kebencanaan">Darurat & Kebencanaan</option>
                    <option value="Kesehatan">Kesehatan</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status Program *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Aktif' | 'Selesai' | 'Draf' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer text-slate-850"
                  >
                    <option value="Aktif">Aktif / Berjalan</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Draf">Draf</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Pengumpulan Dana (IDR) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="Contoh: 150000000"
                    value={formData.target_dana || ''}
                    onChange={(e) => setFormData({ ...formData, target_dana: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold"
                  />
                  {formErrors.target_dana && <p className="text-rose-600 text-xs mt-1">{formErrors.target_dana}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Penanggung Jawab (PIC) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ahmad Subarjo"
                    value={formData.PIC}
                    onChange={(e) => setFormData({ ...formData, PIC: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  {formErrors.PIC && <p className="text-rose-600 text-xs mt-1">{formErrors.PIC}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal Mulai *</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal_mulai}
                    onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  {formErrors.tanggal_mulai && <p className="text-rose-600 text-xs mt-1">{formErrors.tanggal_mulai}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal Selesai *</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal_selesai}
                    onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  {formErrors.tanggal_selesai && <p className="text-rose-600 text-xs mt-1">{formErrors.tanggal_selesai}</p>}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-150 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer text-slate-750"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  Simpan Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
