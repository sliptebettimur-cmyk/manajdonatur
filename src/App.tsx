import { useEffect, useState } from 'react';
import { initializeLocalDatabase } from './services/api';
import { User } from './types';

// Components
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DonaturModule from './components/DonaturModule';
import EventModule from './components/EventModule';
import DonasiModule from './components/DonasiModule';
import LaporanModule from './components/LaporanModule';
import PenggunaModule from './components/PenggunaModule';
import SettingModule from './components/SettingModule';

// Icons
import { Menu, Heart, LogOut, ShieldCheck, HelpCircle } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(true);

  // Initialize simulated local database and load existing user session
  useEffect(() => {
    initializeLocalDatabase();
    setIsSeeding(false);

    const sessionUser = localStorage.getItem('current_user');
    if (sessionUser) {
      try {
        setCurrentUser(JSON.parse(sessionUser));
      } catch (err) {
        localStorage.removeItem('current_user');
      }
    }
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('current_user', JSON.stringify(user));
    
    // Auto redirect to appropriate default tab based on roles
    if (user.role === 'Fundraiser') {
      setActiveTab('donasi');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Keluar dari portal administrasi yayasan?')) {
      setCurrentUser(null);
      localStorage.removeItem('current_user');
    }
  };

  if (isSeeding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-slate-500 font-medium">Menyiapkan Database Amalan...</span>
        </div>
      </div>
    );
  }

  // Not Logged In -> Render Login Card
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Render correct content tab based on state
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'donatur':
        return <DonaturModule />;
      case 'event':
        return <EventModule />;
      case 'donasi':
        return <DonasiModule currentUser={currentUser} />;
      case 'laporan':
        return <LaporanModule />;
      case 'pengguna':
        // Role Guard: Only Super Admin
        if (currentUser.role !== 'Super Admin') {
          return (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
              <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">Akses Ditolak</h3>
              <p className="text-slate-500 text-sm">
                Maaf, modul manajemen akun staf hanya dapat diakses oleh administrator utama (Super Admin).
              </p>
            </div>
          );
        }
        return <PenggunaModule />;
      case 'setting':
        // Role Guard: Super Admin & Admin Keuangan
        if (currentUser.role !== 'Super Admin' && currentUser.role !== 'Admin Keuangan') {
          return (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
              <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">Akses Terbatas</h3>
              <p className="text-slate-500 text-sm">
                Maaf, halaman pengaturan dan sinkronisasi REST API hanya diizinkan untuk Direksi Yayasan & Divisi Keuangan.
              </p>
            </div>
          );
        }
        return <SettingModule />;
      default:
        return <Dashboard />;
    }
  };

  const getBreadcrumbLabel = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'donatur':
        return 'Basis Data / Data Donatur';
      case 'event':
        return 'Basis Data / Program Event';
      case 'donasi':
        return 'Transaksi / Input Donasi';
      case 'laporan':
        return 'Keuangan / Laporan Mutasi';
      case 'pengguna':
        // Role Guard: Only Super Admin
        return 'Otoritas / Manajemen Pengguna';
      case 'setting':
        return 'Integrasi / Pengaturan API';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col lg:flex-row relative">
      
      {/* 1. Sidebar Panel */}
      <Sidebar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* 2. Main Workstation Panel */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30 print:hidden shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
            
            {/* Breadcrumb path label */}
            <div className="hidden sm:flex items-center gap-2 text-slate-500">
              <span className="text-sm">Sistem</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              <span className="text-sm font-semibold text-indigo-600">{getBreadcrumbLabel()}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Status: Online</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 hover:bg-rose-50 rounded-full cursor-pointer text-slate-400 hover:text-rose-600 transition-colors"
              title="Keluar Aplikasi"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderTabContent()}
        </main>
      </div>

    </div>
  );
}
