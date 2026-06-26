import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Donatur, Event, Transaksi, MetodePembayaran, BankPilihan, StatusTransaksi, User } from '../types';
import {
  Coins,
  CheckCircle,
  FileText,
  Printer,
  Calendar,
  Clock,
  User as UserIcon,
  CreditCard,
  MessageSquare,
  Upload,
  Sparkles,
  AlertCircle,
  Image,
  RefreshCw,
  Search,
  X,
  FileCheck
} from 'lucide-react';

interface DonasiModuleProps {
  currentUser: User;
}

export default function DonasiModule({ currentUser }: DonasiModuleProps) {
  const [donaturs, setDonaturs] = useState<Donatur[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [recentTxs, setRecentTxs] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [donaturId, setDonaturId] = useState('');
  const [eventId, setEventId] = useState('');
  const [nominal, setNominal] = useState<number | ''>('');
  const [metode, setMetode] = useState<MetodePembayaran>('Transfer');
  const [bank, setBank] = useState<BankPilihan>('BCA');
  const [referensi, setReferensi] = useState('');
  const [status, setStatus] = useState<StatusTransaksi>('Masuk');
  const [catatan, setCatatan] = useState('');
  const [buktiTransfer, setBuktiTransfer] = useState<string>(''); // base64 string

  // Dynamic automatic fields
  const [autoNoTrx, setAutoNoTrx] = useState('');
  const [autoDate, setAutoDate] = useState('');
  const [autoTime, setAutoTime] = useState('');

  // UI States
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Transaksi | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const loadSelectionData = async () => {
    setLoading(true);
    try {
      const donRes = await apiService.getDonatur();
      const evRes = await apiService.getEvent();
      const txRes = await apiService.getTransaksi();

      if (donRes.success) {
        setDonaturs(donRes.data.filter((d) => d.status === 'Aktif'));
      }
      if (evRes.success) {
        setEvents(evRes.data.filter((e) => e.status === 'Aktif'));
      }
      if (txRes.success) {
        setRecentTxs(txRes.data.slice().sort((a, b) => b.created_at.localeCompare(a.created_at)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateAutoFields = () => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const dateCompact = dateStr.replace(/-/g, '');
    const jamCompact = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');

    // Simple temporary auto-number based on timestamp seconds to guarantee uniqueness in SPA state before saving
    const uniqId = String(now.getSeconds()).padStart(2, '0') + String(now.getMilliseconds()).slice(0, 1);
    setAutoNoTrx(`TRX-${dateCompact}${uniqId}`);
    setAutoDate(dateStr);
    setAutoTime(jamCompact);
  };

  useEffect(() => {
    loadSelectionData();
    updateAutoFields();
    // Refresh fields every 10 seconds to keep clock aligned
    const interval = setInterval(updateAutoFields, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        triggerAlert('error', 'Ukuran bukti transfer tidak boleh melebihi 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBuktiTransfer(reader.result as string);
        triggerAlert('success', 'Bukti transfer berhasil diupload.');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  const handleResetForm = () => {
    setDonaturId('');
    setEventId('');
    setNominal('');
    setMetode('Transfer');
    setBank('BCA');
    setReferensi('');
    setStatus('Masuk');
    setCatatan('');
    setBuktiTransfer('');
    updateAutoFields();
  };

  const handleInputDonasi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donaturId) {
      triggerAlert('error', 'Silakan pilih donatur terlebih dahulu.');
      return;
    }
    if (!eventId) {
      triggerAlert('error', 'Silakan pilih program event tujuan.');
      return;
    }
    if (!nominal || Number(nominal) <= 0) {
      triggerAlert('error', 'Nominal donasi harus lebih dari Rp 0.');
      return;
    }

    try {
      const payload = {
        donatur_id: donaturId,
        event_id: eventId,
        nominal: Number(nominal),
        metode,
        bank: metode === 'Tunai' ? 'Lainnya' as BankPilihan : bank,
        referensi: referensi || '-',
        admin: currentUser.nama,
        status,
        catatan,
        bukti_transfer: buktiTransfer
      };

      const res = await apiService.createTransaksi(payload);
      if (res.success && res.data) {
        triggerAlert('success', `Berhasil! Donasi ${res.data.nomor_transaksi} sebesar Rp ${Number(nominal).toLocaleString('id-ID')} disimpan.`);
        
        // Open receipt dialog instantly for printing
        setSelectedReceipt(res.data);
        setIsReceiptOpen(true);
        
        // Reset and reload
        handleResetForm();
        loadSelectionData();
      } else {
        triggerAlert('error', res.message);
      }
    } catch (err) {
      triggerAlert('error', 'Terjadi kesalahan saat menginput donasi.');
    }
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getDonaturName = (id: string) => {
    return donaturs.find((d) => d.id === id)?.nama || 'Donatur Umum';
  };

  const getEventName = (id: string) => {
    return events.find((e) => e.id === id)?.nama_event || 'Program Umum';
  };

  const handleCetakKwitansi = (tx: Transaksi) => {
    setSelectedReceipt(tx);
    setIsReceiptOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans text-slate-900">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Form Input Donasi</h1>
        <p className="text-slate-500 text-sm mt-1">
          Halaman pencatatan donasi baru secara real-time dengan nomor bukti transaksi otomatis dan kwitansi PDF digital.
        </p>
      </div>

      {/* Alert Banner */}
      {alertMsg && (
        <div className={`p-4 border rounded-md flex items-center gap-3 animate-fade-in ${
          alertMsg.type === 'success' ? 'bg-indigo-50 border-indigo-100 text-indigo-800' : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          {alertMsg.type === 'success' ? <CheckCircle className="w-5 h-5 text-indigo-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
          <span className="text-sm font-medium">{alertMsg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Form Input */}
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-xs lg:col-span-7">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-6">
            <Coins className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-base text-slate-900">Pencatatan Donasi Baru</h2>
          </div>

          <form onSubmit={handleInputDonasi} className="space-y-6">
            {/* Row 1: No Transaksi, Tanggal, Jam */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-md">
              <div>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">No. Transaksi</span>
                <span className="font-mono text-xs font-bold text-slate-900 block truncate">{autoNoTrx}</span>
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Tanggal Input</span>
                <span className="font-semibold text-xs text-slate-700 block flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {autoDate}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Jam Transaksi</span>
                <span className="font-semibold text-xs text-slate-700 block flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {autoTime}
                </span>
              </div>
            </div>

            {/* Row 2: Select Donatur */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Pilih Donatur *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </span>
                <select
                  required
                  value={donaturId}
                  onChange={(e) => setDonaturId(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer text-slate-800"
                >
                  <option value="">-- Pilih Donatur yang Terdaftar --</option>
                  {donaturs.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nama} ({d.kode_donatur}) - {d.kota}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Select Event */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Pilih Program Penggalangan (Event) *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Coins className="w-4 h-4" />
                </span>
                <select
                  required
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer text-slate-800"
                >
                  <option value="">-- Pilih Kampanye Program Amal --</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.nama_event} (Target: {formatRupiah(ev.target_dana)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: Nominal & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nominal Donasi (IDR) *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600 font-bold text-sm">
                    Rp
                  </span>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="Contoh: 100000"
                    value={nominal}
                    onChange={(e) => setNominal(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status Konfirmasi *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StatusTransaksi)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold cursor-pointer text-slate-800"
                >
                  <option value="Masuk">Masuk / Berhasil</option>
                  <option value="Pending">Pending / Menunggu Verifikasi</option>
                  <option value="Batal">Batal</option>
                </select>
              </div>
            </div>

            {/* Row 5: Metode Pembayaran & Bank */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Metode Bayar *</label>
                <select
                  value={metode}
                  onChange={(e) => setMetode(e.target.value as MetodePembayaran)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer text-slate-800"
                >
                  <option value="Transfer">Transfer Bank</option>
                  <option value="QRIS">QRIS / E-Wallet</option>
                  <option value="Tunai">Tunai / Cash</option>
                </select>
              </div>

              {metode === 'Transfer' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pilih Bank Rekening *</label>
                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value as BankPilihan)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer text-slate-800"
                  >
                    <option value="BCA">BCA Syariah / BCA</option>
                    <option value="Mandiri">Mandiri Syariah / Mandiri</option>
                    <option value="BRI">BRI Syariah / BRI</option>
                    <option value="BNI">BNI Syariah / BNI</option>
                    <option value="BSI">BSI (Bank Syariah Indonesia)</option>
                    <option value="Lainnya">Bank Lainnya</option>
                  </select>
                </div>
              )}

              <div className={`space-y-1.5 ${metode !== 'Transfer' ? 'col-span-2' : ''}`}>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">No. Referensi / Reff ID</label>
                <input
                  type="text"
                  placeholder="Contoh: REF99182A (Opsional)"
                  value={referensi}
                  onChange={(e) => setReferensi(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                />
              </div>
            </div>

            {/* Row 6: Upload Bukti Transfer */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Upload Bukti Pembayaran / Slip (Opsional)</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50 text-slate-800 text-xs font-semibold cursor-pointer transition-colors shadow-xs bg-white">
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Pilih File Gambar</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {buktiTransfer ? (
                  <div className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-md font-medium">
                    <FileCheck className="w-4 h-4" />
                    <span>File Terunggah</span>
                    <button type="button" onClick={() => setBuktiTransfer('')} className="text-slate-400 hover:text-slate-600 ml-2 cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">Belum ada file diupload (Maks 2MB)</span>
                )}
              </div>
              {buktiTransfer && (
                <div className="mt-3 border border-slate-150 p-2 bg-slate-50 rounded-md inline-block max-w-xs relative">
                  <img src={buktiTransfer} alt="Bukti Transfer" className="max-h-24 rounded-md object-contain" />
                </div>
              )}
            </div>

            {/* Row 7: Catatan */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Keterangan / Catatan Tambahan</label>
              <textarea
                placeholder="Tulis pesan atau catatan donatur jika ada..."
                rows={3}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetForm}
                className="px-5 py-2 border border-slate-300 rounded-md text-sm font-semibold hover:bg-slate-50 transition-colors text-slate-700 cursor-pointer"
              >
                Reset Form
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Simpan Donasi & Cetak Kwitansi</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Recent transactions logging */}
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-xs lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-6">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-base text-slate-900">Log Pengisian Terakhir</h2>
            </div>

            {loading ? (
              <div className="space-y-3 animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-slate-100 rounded-md" />
                ))}
              </div>
            ) : recentTxs.length === 0 ? (
              <p className="text-sm text-slate-400 italic text-center py-12">Belum ada transaksi diinput.</p>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto pr-1 space-y-1">
                {recentTxs.slice(0, 7).map((tx) => (
                  <div key={tx.id} className="py-3 flex flex-col justify-between hover:bg-slate-50 rounded-md p-2.5 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-slate-900">{tx.nomor_transaksi}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        tx.status === 'Masuk' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {tx.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-end mt-2">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-800">{getDonaturName(tx.donatur_id)}</h4>
                        <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{getEventName(tx.event_id)}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900 block">{formatRupiah(tx.nominal)}</span>
                        <button
                          onClick={() => handleCetakKwitansi(tx)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 mt-1 cursor-pointer"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Kwitansi</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* --- RECEIPT MODAL / KWITANSI OVERLAY --- */}
      {isReceiptOpen && selectedReceipt && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-2xl shadow-lg overflow-hidden flex flex-col">
            
            {/* Modal Controls Header */}
            <div className="h-14 border-b border-slate-150 px-6 flex items-center justify-between bg-slate-50 print:hidden">
              <span className="font-bold text-slate-800 text-sm">Bukti Kwitansi Digital</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md transition-colors shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print PDF</span>
                </button>
                <button onClick={() => setIsReceiptOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Kwitansi Wrapper */}
            <div id="printable-kwitansi" className="p-8 font-serif text-slate-900 bg-white space-y-6 print:p-0">
              
              {/* Kwitansi Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
                <div>
                  <h2 className="text-xl font-bold tracking-tight uppercase text-slate-950">YAYASAN AMAL NUSANTARA</h2>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5 font-semibold">
                    SK Kemenkumham RI No. AHU-00122.AH.01.04 • Jl. Margonda Raya No. 45, Depok<br />
                    Telp: (021) 555-6789 • Web: www.amalnusantara.or.id
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black tracking-widest text-indigo-700 uppercase font-sans">KWITANSI</div>
                  <div className="text-xs font-mono font-bold text-slate-500 mt-1">{selectedReceipt.nomor_transaksi}</div>
                </div>
              </div>

              {/* Kwitansi Content Fields */}
              <div className="space-y-4 text-xs font-sans">
                
                <div className="grid grid-cols-4 gap-2 items-center py-1 border-b border-dashed border-slate-200">
                  <span className="font-semibold text-slate-500">Telah Diterima Dari</span>
                  <span className="col-span-3 text-slate-900 font-bold text-sm uppercase">
                    : {getDonaturName(selectedReceipt.donatur_id)}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 items-center py-1 border-b border-dashed border-slate-200">
                  <span className="font-semibold text-slate-500">Uang Sejumlah</span>
                  <span className="col-span-3 bg-slate-50 p-2.5 rounded-md border border-slate-200 font-bold text-slate-950 italic text-sm">
                    : Rp {selectedReceipt.nominal.toLocaleString('id-ID')} ({selectedReceipt.nominal.toString().replace(/\d/g, '').length > 0 ? '' : 'Terbilang masuk kas amal'})
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 items-start py-1 border-b border-dashed border-slate-200">
                  <span className="font-semibold text-slate-500">Guna Keperluan</span>
                  <span className="col-span-3 text-slate-900 font-semibold leading-relaxed">
                    : Penyaluran donasi Program <strong className="text-slate-950">&ldquo;{getEventName(selectedReceipt.event_id)}&rdquo;</strong>
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 items-center py-1 border-b border-dashed border-slate-200">
                  <span className="font-semibold text-slate-500">Metode Penyaluran</span>
                  <span className="col-span-3 text-slate-800 font-bold">
                    : {selectedReceipt.metode} {selectedReceipt.bank !== 'Lainnya' ? `(${selectedReceipt.bank})` : ''} 
                    {selectedReceipt.referensi !== '-' ? ` - Ref: ${selectedReceipt.referensi}` : ''}
                  </span>
                </div>

                {selectedReceipt.catatan && (
                  <div className="grid grid-cols-4 gap-2 items-start py-1">
                    <span className="font-semibold text-slate-500">Catatan Khusus</span>
                    <span className="col-span-3 text-slate-500 italic">
                      : &ldquo;{selectedReceipt.catatan}&rdquo;
                    </span>
                  </div>
                )}
              </div>

              {/* Amount Box & Signatures */}
              <div className="grid grid-cols-2 gap-4 pt-6 items-end">
                <div>
                  <div className="bg-indigo-50 border border-indigo-200 text-indigo-955 p-3.5 rounded-md font-sans inline-block">
                    <span className="text-[10px] font-bold block uppercase tracking-wider text-indigo-700">Jumlah Nominal:</span>
                    <span className="text-xl font-black">{formatRupiah(selectedReceipt.nominal)}</span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-sans mt-3">
                    * Kwitansi sah dicetak secara digital, tidak memerlukan stempel fisik basah.
                  </p>
                </div>
                
                <div className="text-right space-y-12 font-sans text-xs">
                  <div>
                    <span className="text-slate-500 block">Depok, {selectedReceipt.tanggal}</span>
                    <span className="font-semibold text-slate-800 block mt-1">Admin Penerima,</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-950 underline block">{selectedReceipt.admin}</span>
                    <span className="text-[10px] text-slate-400 block">Yayasan Amal Nusantara</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer (print hidden) */}
            <div className="h-14 border-t border-slate-150 px-6 flex items-center justify-end bg-slate-50 print:hidden shrink-0">
              <button
                onClick={() => setIsReceiptOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer text-slate-700"
              >
                Tutup Kwitansi
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Print-specific style injected */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-kwitansi, #printable-kwitansi * {
            visibility: visible;
          }
          #printable-kwitansi {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            padding: 0;
            margin: 0;
          }
        }
      `}</style>

    </div>
  );
}
