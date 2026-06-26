import React, { useState } from 'react';
import { apiService } from '../services/api';
import { User } from '../types';
import { Heart, Lock, Mail, ShieldAlert, Sparkles } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await apiService.login(email, password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg('Koneksi bermasalah. Silakan coba kembali.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (roleMail: string, pass: string) => {
    setEmail(roleMail);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans text-slate-900">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden flex flex-col p-8 relative">
        
        {/* Foundation Branding Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100 mb-4 shadow-xs">
            <Heart className="w-6 h-6 fill-indigo-500 text-indigo-600 animate-pulse" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Sistem Manajemen Donasi
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
            Yayasan Amal Nusantara • Portal Admin
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-md text-rose-700 text-sm flex items-start gap-2 animate-fade-in">
            <ShieldAlert className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@yayasan.org"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              />
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-xs transition-all focus:ring-4 focus:ring-indigo-100 disabled:opacity-50 text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              'Masuk Aplikasi'
            )}
          </button>
        </form>

        {/* Quick Demo Logins Section */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Quick Login Roles (Demo)
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="role-superadmin"
              onClick={() => handleQuickLogin('superadmin@yayasan.org', 'admin123')}
              className="text-left p-2.5 hover:bg-slate-50 border border-slate-200 rounded-md transition-colors text-xs cursor-pointer"
            >
              <div className="font-semibold text-slate-900">Super Admin</div>
              <div className="text-[10px] text-slate-500">Ahmad Subarjo</div>
            </button>
            <button
              id="role-keuangan"
              onClick={() => handleQuickLogin('keuangan@yayasan.org', 'keuangan123')}
              className="text-left p-2.5 hover:bg-slate-50 border border-slate-200 rounded-md transition-colors text-xs cursor-pointer"
            >
              <div className="font-semibold text-slate-900">Keuangan</div>
              <div className="text-[10px] text-slate-500">Siti Rahmawati</div>
            </button>
            <button
              id="role-fundraiser"
              onClick={() => handleQuickLogin('fundraiser@yayasan.org', 'fundraiser123')}
              className="text-left p-2.5 hover:bg-slate-50 border border-slate-200 rounded-md transition-colors text-xs cursor-pointer"
            >
              <div className="font-semibold text-slate-900">Fundraiser</div>
              <div className="text-[10px] text-slate-500">Budi Hartono</div>
            </button>
            <button
              id="role-ketua"
              onClick={() => handleQuickLogin('ketua@yayasan.org', 'ketua123')}
              className="text-left p-2.5 hover:bg-slate-50 border border-slate-200 rounded-md transition-colors text-xs cursor-pointer"
            >
              <div className="font-semibold text-slate-900">Ketua Yayasan</div>
              <div className="text-[10px] text-slate-500">Drs. H. Mulyadi</div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
