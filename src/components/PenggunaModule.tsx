import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { User, UserRole } from '../types';
import {
  ShieldAlert,
  UserPlus,
  Edit3,
  Trash2,
  X,
  AlertCircle,
  Check,
  UserCheck,
  Mail,
  Lock,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

export default function PenggunaModule() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Zod simulation validation state
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    role: 'Fundraiser' as UserRole,
    status: 'Aktif' as 'Aktif' | 'Nonaktif'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiService.getUsers();
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const triggerAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      nama: '',
      email: '',
      password: '',
      role: 'Fundraiser',
      status: 'Aktif'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: User) => {
    setEditingItem(item);
    setFormData({
      nama: item.nama,
      email: item.email,
      password: item.password || '',
      role: item.role,
      status: item.status
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.nama.trim()) errors.nama = 'Nama lengkap admin wajib diisi';
    if (!formData.email.trim()) {
      errors.email = 'Alamat email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Format email tidak valid';
    }
    if (!editingItem && !formData.password.trim()) {
      errors.password = 'Password default wajib ditentukan';
    } else if (formData.password && formData.password.length < 5) {
      errors.password = 'Password minimal berukuran 5 karakter';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingItem) {
        const res = await apiService.updateUser({
          ...editingItem,
          ...formData
        });
        if (res.success) {
          triggerAlert('success', `Pengguna "${formData.nama}" berhasil diperbarui.`);
          fetchUsers();
        } else {
          triggerAlert('error', res.message);
        }
      } else {
        const res = await apiService.createUser(formData);
        if (res.success) {
          triggerAlert('success', `Pengguna baru "${formData.nama}" berhasil didaftarkan.`);
          fetchUsers();
        } else {
          triggerAlert('error', res.message);
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      triggerAlert('error', 'Gagal memproses pengajuan pengguna.');
    }
  };

  const handleDelete = async (item: User) => {
    if (item.email === 'superadmin@yayasan.org') {
      triggerAlert('error', 'Super Admin utama tidak dapat dihapus dari sistem demi keamanan.');
      return;
    }

    if (window.confirm(`Hapus hak akses pengguna "${item.nama}"?\nTindakan ini mencabut akses login secara permanen.`)) {
      try {
        const res = await apiService.deleteUser(item.id);
        if (res.success) {
          triggerAlert('success', 'Akses pengguna berhasil dihapus.');
          fetchUsers();
        } else {
          triggerAlert('error', res.message);
        }
      } catch (err) {
        triggerAlert('error', 'Gagal membatalkan akses pengguna.');
      }
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Admin Keuangan':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Fundraiser':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Ketua Yayasan':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-zinc-50 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-900">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manajemen Pengguna</h1>
          <p className="text-slate-500 text-sm mt-1">
            Konfigurasi akun staff yayasan, hak akses, status login, dan reset password admin. (Hanya diizinkan untuk Super Admin).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-md transition-all shadow-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      {/* Alerts */}
      {alertMsg && (
        <div className={`p-4 border rounded-md flex items-center gap-3 animate-fade-in ${
          alertMsg.type === 'success' ? 'bg-indigo-50 border-indigo-100 text-indigo-800' : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          {alertMsg.type === 'success' ? <Check className="w-5 h-5 text-indigo-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
          <span className="text-sm font-medium">{alertMsg.text}</span>
        </div>
      )}

      {/* Users table list */}
      <div className="bg-white border border-slate-200 rounded-md shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-150 bg-slate-50/50 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-indigo-600" />
          <span className="text-sm font-bold text-slate-800">Daftar Akun Otorisasi</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-500">
            <thead className="text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">Email Login</th>
                <th className="px-6 py-4">Status Hak Akses (Role)</th>
                <th className="px-6 py-4">Status Akun</th>
                <th className="px-6 py-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-900 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-sm italic">Loading users database...</td>
                </tr>
              ) : (
                users.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                          {item.nama.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{item.nama}</h4>
                          <span className="text-[10px] text-slate-400 font-mono font-normal">ID: {item.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-normal">{item.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getRoleBadgeColor(item.role)}`}>
                        {item.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full ${
                        item.status === 'Aktif' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Aktif' ? 'bg-indigo-500' : 'bg-rose-500'}`} />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md transition-colors flex items-center justify-center cursor-pointer"
                          title="Ubah Role/Password"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          disabled={item.email === 'superadmin@yayasan.org'}
                          onClick={() => handleDelete(item)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md transition-colors flex items-center justify-center disabled:opacity-30 disabled:hover:bg-rose-50 cursor-pointer"
                          title="Hapus Pengguna"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD/EDIT MODAL DIALOG --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-md shadow-lg overflow-hidden flex flex-col">
            <div className="h-16 border-b border-slate-150 px-6 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2 text-slate-900">
                <UserCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-lg">{editingItem ? 'Edit Konfigurasi Akun' : 'Daftarkan Akun Baru'}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Lengkap Admin *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Fajrin"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                {formErrors.nama && <p className="text-rose-600 text-xs mt-1">{formErrors.nama}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Login *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="nama@yayasan.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                {formErrors.email && <p className="text-rose-600 text-xs mt-1">{formErrors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Password Login {editingItem ? '(Isi hanya untuk reset)' : '*'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required={!editingItem}
                    placeholder={editingItem ? 'Tulis password baru jika diubah' : 'Tentukan password default'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formErrors.password && <p className="text-rose-600 text-xs mt-1">{formErrors.password}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Level Hak Akses *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer text-slate-800"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin Keuangan">Admin Keuangan</option>
                    <option value="Fundraiser">Fundraiser</option>
                    <option value="Ketua Yayasan">Ketua Yayasan</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status Login *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Aktif' | 'Nonaktif' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer text-slate-800"
                  >
                    <option value="Aktif">Aktif / Boleh Login</option>
                    <option value="Nonaktif">Nonaktif / Blokir</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-150 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  Simpan Akses
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
