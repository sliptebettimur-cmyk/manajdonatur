import React, { useEffect, useState } from 'react';
import { apiService, getGASUrl, setGASUrl, initializeLocalDatabase } from '../services/api';
import {
  Settings,
  Database,
  Link,
  Info,
  CheckCircle2,
  Trash2,
  Send,
  HelpCircle,
  FileCode,
  Copy,
  Terminal,
  RefreshCw
} from 'lucide-react';

export default function SettingModule() {
  const [gasUrl, setGasUrlState] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'IDLE' | 'TESTING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [testResponse, setTestResponse] = useState<string>('');

  useEffect(() => {
    const savedUrl = getGASUrl();
    if (savedUrl) {
      setGasUrlState(savedUrl);
    }
  }, []);

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setGASUrl(gasUrl);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleClearUrl = () => {
    setGasUrlState('');
    setGASUrl('');
    setConnectionStatus('IDLE');
    setTestResponse('');
  };

  const handleTestConnection = async () => {
    if (!gasUrl) {
      alert('Masukkan URL Web App Apps Script terlebih dahulu!');
      return;
    }
    setConnectionStatus('TESTING');
    setTestResponse('');

    try {
      // Append getDonatur query action to verify cors/read permissions
      const testActionUrl = `${gasUrl}?action=getDonatur`;
      const res = await fetch(testActionUrl, { method: 'GET' });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setConnectionStatus('SUCCESS');
          setTestResponse(`Berhasil Terhubung! Database merespon dengan ${json.data?.length || 0} donatur.`);
        } else {
          setConnectionStatus('FAILED');
          setTestResponse(`Gagal mengurai respon: ${json.message || 'Merespon salah format'}`);
        }
      } else {
        setConnectionStatus('FAILED');
        setTestResponse(`Server merespon dengan status error: ${res.status}`);
      }
    } catch (err: any) {
      setConnectionStatus('FAILED');
      setTestResponse(`CORS Error atau URL Salah: Pastikan program Apps Script telah di-deploy sebagai "Web App" dengan akses "Anyone" (Siapa saja). Detail: ${err.message}`);
    }
  };

  const handleResetSimulatedDB = () => {
    if (window.confirm('Reset database simulasi lokal?\nSeluruh data transaksi baru yang telah diinput akan dihapus dan dikembalikan ke data default bawaan.')) {
      localStorage.removeItem('users');
      localStorage.removeItem('donatur');
      localStorage.removeItem('event');
      localStorage.removeItem('transaksi');
      initializeLocalDatabase();
      alert('Database simulasi lokal berhasil diset ulang!');
      window.location.reload();
    }
  };

  // Google Apps Script source code to show inside view helper
  const appsScriptCode = `/**
 * GOOGLE APPS SCRIPT DATABASE DRIVER & API REST CONTROLLER
 * Deploy as Web App, Execute as "Me", Access to "Anyone"
 */

const SPREADSHEET_ID = "MASUKKAN_ID_SPREADSHEET_YAYASAN_ANDA";

function doGet(e) {
  return handleRequest(e, "GET");
}

function doPost(e) {
  return handleRequest(e, "POST");
}

function handleRequest(e, method) {
  try {
    const action = e.parameter.action || (e.postData ? JSON.parse(e.postData.contents).action : "");
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Router logic based on action parameter
    let data;
    let message = "Request processed successfully";
    
    if (action === "getDonatur") {
      data = readSheet(ss, "DONATUR");
    } else if (action === "getEvent") {
      data = readSheet(ss, "EVENT");
    } else if (action === "getTransaksi") {
      data = readSheet(ss, "TRANSAKSI");
    } else if (action === "getUsers") {
      data = readSheet(ss, "USERS");
    } else {
      throw new Error("Action not supported");
    }
    
    return jsonResponse({ success: true, message, data });
  } catch (err) {
    return jsonResponse({ success: false, message: err.toString(), data: null });
  }
}

function readSheet(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const data = [];
  
  for (let i = 1; i < rows.length; i++) {
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = rows[i][j];
    }
    data.push(obj);
  }
  return data;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  return (
    <div className="space-y-6 font-sans text-slate-900">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Integrasi API & Spreadsheet</h1>
        <p className="text-slate-500 text-sm mt-1">
          Atur URL REST API Google Apps Script untuk menghubungkan portal administrasi secara langsung ke database Google Sheets Yayasan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Configuration URL form */}
        <div className="space-y-6 lg:col-span-5">
          
          <div className="bg-white border border-slate-200 rounded-md p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Link className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-base text-slate-900">Koneksi Google Spreadsheet</h2>
            </div>

            <form onSubmit={handleSaveUrl} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">URL Web App Google Apps Script</label>
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  required
                  value={gasUrl}
                  onChange={(e) => setGasUrlState(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-400 block font-normal">
                  * Biarkan kosong untuk menjalankan <strong>Mode Simulasi Lokal (Offline Mode)</strong> menggunakan media penyimpanan <code>localStorage</code>.
                </span>
              </div>

              {isSaved && (
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-md text-indigo-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-indigo-600" />
                  <span>Pengaturan URL Apps Script berhasil disimpan!</span>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleClearUrl}
                  disabled={!gasUrl}
                  className="px-4 py-2 border border-slate-300 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer text-slate-700"
                >
                  Gunakan Offline
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md text-xs transition-all shadow-xs cursor-pointer"
                >
                  Simpan URL
                </button>
              </div>
            </form>

            {gasUrl && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <button
                  onClick={handleTestConnection}
                  disabled={connectionStatus === 'TESTING'}
                  className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 font-bold text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${connectionStatus === 'TESTING' ? 'animate-spin' : ''}`} />
                  Test Koneksi API Sheets
                </button>

                {connectionStatus !== 'IDLE' && (
                  <div className={`p-4 border rounded-md text-xs font-medium space-y-1 ${
                    connectionStatus === 'TESTING' ? 'bg-slate-50 text-slate-600 border-slate-200' :
                    connectionStatus === 'SUCCESS' ? 'bg-indigo-50 border-indigo-100 text-indigo-800' :
                    'bg-rose-50 border-rose-100 text-rose-800'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      Status Respon: {connectionStatus}
                    </div>
                    <p className="leading-relaxed font-mono text-[10px] break-all">{testResponse}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Local cache Seeder reset panel */}
          <div className="bg-white border border-slate-200 rounded-md p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Database className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-base text-slate-900 font-sans">Simulasi database lokal</h2>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Aplikasi berjalan out-of-the-box dalam mode offline menggunakan cache aman browser Anda. Jika database terasa penuh atau rusak, Anda dapat membersihkannya kembali ke data default (20 Program Event, 8 Donatur, dan Users otorisasi).
            </p>

            <button
              onClick={handleResetSimulatedDB}
              className="w-full py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Reset Database Simulasi Lokal
            </button>
          </div>

        </div>

        {/* Right column: Instructions for Google Spreadsheet Setup */}
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-xs lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <HelpCircle className="w-5.5 h-5.5 text-indigo-600" />
            <h2 className="font-bold text-base text-slate-900">Panduan Sinkronisasi Google Sheets</h2>
          </div>

          <div className="space-y-4 text-xs text-slate-600 leading-relaxed font-sans">
            
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-md space-y-2">
              <h3 className="font-bold text-indigo-800 text-xs flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-600 shrink-0" />
                Cara Kerja Integrasi
              </h3>
              <p className="text-slate-600 text-[11px]">
                Aplikasi web ini menggunakan model hibrida. Tanpa URL Apps Script, data disimpan di penyimpanan lokal (offline). Begitu URL Apps Script disinkronisasi, program akan memintas rute dan langsung memperbarui Spreadsheet Anda!
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 text-xs">Langkah 1: Siapkan Spreadsheet</h4>
              <p className="font-normal text-slate-500">
                Buat sebuah Google Spreadsheet baru. Tambahkan 4 lembar sheet utama dengan nama kolom persis di baris pertama:
              </p>
              <ul className="list-disc list-inside pl-2 space-y-1 text-[11px] text-slate-600">
                <li><strong>USERS</strong>: <code>id, nama, email, password, role, status, created_at</code></li>
                <li><strong>DONATUR</strong>: <code>id, kode_donatur, nama, jenis_donatur, alamat, kota, telepon, email, tanggal_bergabung, status, catatan</code></li>
                <li><strong>EVENT</strong>: <code>id, kode_event, nama_event, kategori, target_dana, tanggal_mulai, tanggal_selesai, status, PIC</code></li>
                <li><strong>TRANSAKSI</strong>: <code>id, nomor_transaksi, tanggal, jam, donatur_id, event_id, nominal, metode, bank, referensi, admin, status, catatan, created_at</code></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 text-xs">Langkah 2: Buat Google Apps Script</h4>
              <p className="font-normal text-slate-500">
                Di Google Spreadsheet Anda, klik menu <strong>Extensions &gt; Apps Script</strong>. Hapus seluruh isi default, lalu paste kode JavaScript Apps Script lengkap (silakan lihat file <code>INSTALL.md</code> atau <code>Code.gs</code> di dalam paket zip projek ini).
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 text-xs">Langkah 3: Deploy sebagai Web App</h4>
              <p className="font-normal text-slate-500">
                Klik tombol <strong>Deploy &gt; New Deployment</strong>. Pilih jenis <strong>Web App</strong>. Set konfigurasi:
              </p>
              <ul className="list-disc list-inside pl-2 space-y-1 text-[11px] text-slate-600">
                <li><strong>Execute As:</strong> Me (Email Anda)</li>
                <li><strong>Who has access:</strong> Anyone (Siapa saja, bahkan anonim)</li>
              </ul>
              <p className="font-normal text-slate-500 mt-1">
                Salin tautan <strong>Web App URL</strong> yang dihasilkan (tautan yang berujung <code>/exec</code>), lalu paste ke dalam form input di sebelah kiri aplikasi ini dan simpan!
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
