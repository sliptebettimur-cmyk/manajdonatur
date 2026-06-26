import { User, UserRole } from '../types';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Coins,
  FileSpreadsheet,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Heart,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({
  currentUser,
  activeTab,
  setActiveTab,
  onLogout,
  sidebarOpen,
  setSidebarOpen
}: SidebarProps) {
  // Navigation tabs config with Roles permission guard
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Super Admin', 'Admin Keuangan', 'Fundraiser', 'Ketua Yayasan'] },
    { id: 'donatur', label: 'Data Donatur', icon: Users, roles: ['Super Admin', 'Admin Keuangan', 'Fundraiser', 'Ketua Yayasan'] },
    { id: 'event', label: 'Data Event', icon: CalendarDays, roles: ['Super Admin', 'Admin Keuangan', 'Fundraiser', 'Ketua Yayasan'] },
    { id: 'donasi', label: 'Input Donasi', icon: Coins, roles: ['Super Admin', 'Admin Keuangan', 'Fundraiser'] },
    { id: 'laporan', label: 'Laporan', icon: FileSpreadsheet, roles: ['Super Admin', 'Admin Keuangan', 'Fundraiser', 'Ketua Yayasan'] },
    { id: 'pengguna', label: 'Manajemen Pengguna', icon: ShieldCheck, roles: ['Super Admin'] },
    { id: 'setting', label: 'Pengaturan API', icon: Settings, roles: ['Super Admin', 'Admin Keuangan'] }
  ];

  const allowedMenuItems = menuItems.filter((item) => item.roles.includes(currentUser.role));

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-purple-900/30 text-purple-300 border-purple-800/50';
      case 'Admin Keuangan':
        return 'bg-amber-900/30 text-amber-300 border-amber-800/50';
      case 'Fundraiser':
        return 'bg-blue-900/30 text-blue-300 border-blue-800/50';
      case 'Ketua Yayasan':
        return 'bg-emerald-900/30 text-emerald-300 border-emerald-800/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-slate-900 text-white z-50 flex flex-col border-r border-slate-850 transition-transform duration-300 transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Section */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              <Heart className="w-4.5 h-4.5 text-white fill-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight text-white uppercase">Yayasan Amal</h2>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Nusantara</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Profile Card */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-indigo-400 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0">
              {currentUser.nama.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white truncate">{currentUser.nama}</h4>
              <p className="text-xs text-slate-400 truncate mb-1">{currentUser.email}</p>
              <span className={`inline-block px-2 py-0.5 text-[9px] font-bold rounded-md border tracking-wider uppercase ${getRoleBadgeColor(currentUser.role)}`}>
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {allowedMenuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all group ${
                  isSelected
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  <span>{item.label}</span>
                </div>
                {isSelected && <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />}
              </button>
            );
          })}
        </nav>

        {/* Logout Footer */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            id="sidebar-logout"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0 text-slate-400" />
            <span>Keluar Aplikasi</span>
          </button>
        </div>
      </aside>
    </>
  );
}
