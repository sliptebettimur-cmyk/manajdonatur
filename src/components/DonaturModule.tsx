import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Donatur, JenisDonatur } from '../types';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  FileDown,
  FileUp,
  X,
  AlertCircle,
  Check,
  Building,
  User,
  Users2,
  PlusSquare,
  Import,
  AlertTriangle
} from 'lucide-react';

export default function DonaturModule() {
  const [donatur, setDonatur] = useState<Donatur[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJenis, setFilterJenis] = useState<string>('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Donatur | null>(null);

  // Validation Form inputs
  const [formData, setFormData] = useState({
    nama: '',
    jenis_donatur: 'Individu' as JenisDonatur,
    alamat: '',
    kota: '',
    telepon: '',
    email: '',
    status: 'Aktif' as 'Aktif' | 'Nonaktif',
    catatan: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchDonaturs = async () => {
    setLoading(true);
    try {
      const res = await apiService.getDonatur();
      if (res.success) {
        setDonatur(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonaturs();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      nama: '',
      jenis_donatur: 'Individu',
      alamat: '',
      kota: '',
      telepon: '',
      email: '',
      status: 'Aktif',
      catatan: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Donatur) => {
    setEditingItem(item);
    setFormData({
      nama: item.nama,
      jenis_donatur: item.jenis_donatur,
      alamat: item.alamat,
      kota: item.kota,
      telepon: item.telepon,
      email: item.email,
      status: item.status,
      catatan: item.catatan
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.nama.trim()) errors.nama = 'Nama lengkap wajib diisi';
    if (!formData.alamat.trim()) errors.alamat = 'Alamat wajib diisi';
    if (!formData.kota.trim()) errors.kota = 'Kota wajib diisi';
    if (!formData.telepon.trim()) {
      errors.telepon = 'No. Telepon wajib diisi';
    } else if (!/^\+?[0-9]{8,15}$/.test(formData.telepon.replace(/[\s-]/g, ''))) {
      errors.telepon = 'No. Telepon tidak valid';
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Format Email tidak valid';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingItem) {
        const res = await apiService.updateDonatur({
          ...editingItem,
          ...formData
        });
        if (res.success) {
          triggerAlert('success', `Data donatur "${formData.nama}" berhasil diperbarui.`);
          fetchDonaturs();
        } else {
          triggerAlert('error', res.message);
        }
      } else {
        const res = await apiService.createDonatur(formData);
        if (res.success) {
          triggerAlert('success', `Donatur baru "${formData.nama}" berhasil didaftarkan.`);
          fetchDonaturs();
        } else {
          triggerAlert('error', res.message);
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      triggerAlert('error', 'Gagal menyimpan data donatur.');
    }
  };

  const handleDelete = async (item: Donatur) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus donatur "${item.nama}"?\nSeluruh riwayat donatur akan diarsipkan.`)) {
      try {
        const res = await apiService.deleteDonatur(item.id);
        if (res.success) {
          triggerAlert('success', 'Donatur berhasil dihapus.');
          fetchDonaturs();
        } else {
          triggerAlert('error', res.message);
        }
      } catch (err) {
        triggerAlert('error', 'Gagal menghapus donatur.');
      }
    }
  };

  const triggerAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  // Export CSV/Excel simulation
  const handleExportCSV = () => {
    try {
      const headers = ['ID', 'Kode Donatur', 'Nama', 'Jenis', 'Alamat', 'Kota', 'Telepon', 'Email', 'Tanggal Bergabung', 'Status', 'Catatan'];
      const rows = donatur.map((d) => [
        d.id,
        d.kode_donatur,
        d.nama,
        d.jenis_donatur,
        `"${d.alamat.replace(/"/g, '""')}"`,
        d.kota,
        d.telepon,
        d.email,
        d.tanggal_bergabung,
        d.status,
        `"${d.catatan.replace(/"/g, '""')}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF'
        + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Database_Donatur_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerAlert('success', 'Database donatur berhasil diexport ke CSV/Excel.');
    } catch (err) {
      triggerAlert('error', 'Gagal mengexport data.');
    }
  };

  // Import mock Excel/CSV rows
  const handleImportCSV = async () => {
    if (!importText.trim()) {
      setImportError('Silakan masukkan baris data CSV/Excel terlebih dahulu.');
      return;
    }

    try {
      const lines = importText.split('\n').filter((l) => l.trim() !== '');
      if (lines.length < 2) {
        setImportError('Format salah. Minimal baris header dan 1 baris data.');
        return;
      }

      // Format input text box: "Nama,Jenis,Alamat,Kota,Telepon,Email,Catatan"
      const parsedDonaturs: Omit<Donatur, 'id' | 'kode_donatur'>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
        if (columns.length < 5) {
          setImportError(`Baris ${i + 1} tidak memiliki kolom yang cukup (Minimal: Nama, Jenis, Alamat, Kota, Telepon).`);
          return;
        }

        parsedDonaturs.push({
          nama: columns[0],
          jenis_donatur: (columns[1] as JenisDonatur) || 'Individu',
          alamat: columns[2],
          kota: columns[3],
          telepon: columns[4],
          email: columns[5] || '',
          tanggal_bergabung: new Date().toISOString().split('T')[0],
          status: 'Aktif',
          catatan: columns[6] || 'Imported via CSV'
        });
      }

      // Save them recursively to DB
      for (const item of parsedDonaturs) {
        await apiService.createDonatur(item);
      }

      triggerAlert('success', `Berhasil mengimport ${parsedDonaturs.length} data donatur baru.`);
      setIsImportModalOpen(false);
      setImportText('');
      setImportError(null);
      fetchDonaturs();
    } catch (err) {
      setImportError('Gagal melakukan parsing. Pastikan separator menggunakan koma (,)');
    }
  };

  // Filter and Search logic
  const filteredDonatur = donatur.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode_donatur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kota.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.telepon.includes(searchTerm);

    const matchesJenis = filterJenis === 'Semua' || item.jenis_donatur === filterJenis;

    return matchesSearch && matchesJenis;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDonatur.length / itemsPerPage);
  const paginatedDonatur = filteredDonatur.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getDonaturIcon = (jenis: JenisDonatur) => {
    switch (jenis) {
      case 'Instansi':
        return <Building className="w-5 h-5 text-zinc-500" />;
      case 'Komunitas':
        return <Users2 className="w-5 h-5 text-emerald-500" />;
      default:
        return <User className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-900">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manajemen Donatur</h1>
          <p className="text-slate-500 text-sm mt-1">
            Daftar donatur donasi yayasan, tambah donatur baru, serta export/import data excel.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm rounded-md transition-all border border-slate-300 shadow-xs cursor-pointer"
          >
            <FileUp className="w-4 h-4 text-slate-600" />
            <span>Import CSV</span>
          </button>
          
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm rounded-md transition-all border border-slate-300 shadow-xs cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-slate-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-md transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Tambah Donatur</span>
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {alertMsg && (
        <div className={`p-4 border rounded-md flex items-center gap-3 animate-fade-in ${
          alertMsg.type === 'success' ? 'bg-indigo-50 border-indigo-100 text-indigo-800' : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          {alertMsg.type === 'success' ? <Check className="w-5 h-5 text-indigo-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
          <span className="text-sm font-medium">{alertMsg.text}</span>
        </div>
      )}

      {/* Filters bar */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Cari Kode, Nama, Kota, atau No. Telp..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Kategori:</span>
          <div className="flex gap-1 overflow-x-auto w-full md:w-auto">
            {['Semua', 'Individu', 'Instansi', 'Komunitas'].map((jenis) => (
              <button
                key={jenis}
                onClick={() => { setFilterJenis(jenis); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all shrink-0 cursor-pointer ${
                  filterJenis === jenis
                    ? 'bg-slate-900 text-white border-slate-950'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {jenis}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Donaturs */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 p-6 rounded-md h-44 animate-pulse" />
          ))}
        </div>
      ) : paginatedDonatur.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-md p-12 text-center max-w-xl mx-auto">
          <Users2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">Tidak ada donatur ditemukan</h3>
          <p className="text-slate-500 text-sm mt-1">Coba sesuaikan kata kunci pencarian atau filter kategori Anda.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedDonatur.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-md p-6 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50/50 px-2.5 py-1 rounded-md border border-indigo-100">
                      {item.kode_donatur}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-md ${
                      item.status === 'Aktif' ? 'bg-slate-100 text-slate-850 border border-slate-200' : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-1.5">
                      {getDonaturIcon(item.jenis_donatur)}
                      <h3 className="text-base font-bold text-slate-900 truncate">{item.nama}</h3>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                      {item.jenis_donatur}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <p className="truncate"><strong>Telepon:</strong> {item.telepon}</p>
                    <p className="truncate"><strong>Email:</strong> {item.email || '-'}</p>
                    <p className="truncate"><strong>Alamat:</strong> {item.alamat}, {item.kota}</p>
                  </div>
                  
                  {item.catatan && (
                    <p className="text-xs text-slate-400 italic bg-slate-50 border border-slate-150 p-2 rounded-md line-clamp-2">
                      &ldquo;{item.catatan}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md transition-colors flex items-center justify-center cursor-pointer"
                    title="Edit Donatur"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md transition-colors flex items-center justify-center cursor-pointer"
                    title="Hapus Donatur"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
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

      {/* --- ADD/EDIT MODAL DIALOG --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-lg shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="h-16 border-b border-slate-150 px-6 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2 text-slate-950">
                <PlusSquare className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">{editingItem ? 'Edit Data Donatur' : 'Tambah Donatur Baru'}</h3>
              </div>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: H. Syamsul Arifin"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  {formErrors.nama && <p className="text-rose-600 text-xs mt-1">{formErrors.nama}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kategori Donatur *</label>
                  <select
                    value={formData.jenis_donatur}
                    onChange={(e) => setFormData({ ...formData, jenis_donatur: e.target.value as JenisDonatur })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="Individu">Individu / Perorangan</option>
                    <option value="Instansi">Instansi / CSR Perusahaan</option>
                    <option value="Komunitas">Komunitas / Jamaah</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status Keanggotaan</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Aktif' | 'Nonaktif' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif / Suspend</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nomor Telepon *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 081234567890"
                    value={formData.telepon}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  {formErrors.telepon && <p className="text-rose-600 text-xs mt-1">{formErrors.telepon}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alamat Email (Opsional)</label>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  {formErrors.email && <p className="text-rose-600 text-xs mt-1">{formErrors.email}</p>}
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alamat Rumah / Kantor *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Jalan, Blok, No. Rumah"
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kota Domisili *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Depok / Jakarta"
                    value={formData.kota}
                    onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Catatan Donatur (Opsional)</label>
                  <textarea
                    placeholder="Tulis detail khusus tentang donatur ini..."
                    rows={3}
                    value={formData.catatan}
                    onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-150 shrink-0">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-slate-300 rounded-md text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- IMPORT MODAL DIALOG --- */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-xl shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="h-16 border-b border-slate-150 px-6 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2 text-slate-900">
                <Import className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">Import Data Donatur via CSV/Excel</h3>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-2">
                <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Aturan Format Data
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Gunakan format CSV dengan pemisah koma (,). Baris pertama wajib sebagai Header dengan format: <br />
                  <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-[11px] block mt-1.5 p-1">
                    Nama,Jenis_Donatur,Alamat,Kota,Telepon,Email,Catatan
                  </code>
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Paste Data Spreadsheet (CSV)</label>
                <textarea
                  placeholder={`Nama,Jenis_Donatur,Alamat,Kota,Telepon,Email,Catatan&#10;H. Hasanudin,Individu,Jl. Melati No. 9,Semarang,081299887711,hasan@gmail.com,Donatur beasiswa&#10;PT Sinar Berkah,Instansi,Kawasan Industri MM2100,Cikarang,0218899220,csr@sinar.co.id,CSR Tahunan`}
                  rows={8}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {importError && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-md text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleImportCSV}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-semibold transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Import className="w-4 h-4" />
                  <span>Import Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
