'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Building,
  UserCheck,
  X,
  User,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { NexoraLogo } from '@/components/ui/NexoraLogo';
import { WavingPakistanFlag } from '@/components/ui/WavingPakistanFlag';

function GoogleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const { login, loginWithGoogle, isAuthenticated, isHydrated, users } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('nexora123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Google Modal State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.push(redirectPath);
    }
  }, [isAuthenticated, isHydrated, redirectPath, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        router.push(redirectPath);
      } else {
        setError('Invalid credentials. Please select one of the pre-configured enterprise profiles below or continue with Google.');
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const success = login(userEmail);
      if (success) {
        router.push(redirectPath);
      } else {
        setError('Failed to log in with this profile.');
        setIsLoading(false);
      }
    }, 300);
  };

  const handleGoogleAuth = (googleUserEmail: string, googleUserName: string) => {
    setIsLoading(true);
    setIsGoogleModalOpen(false);

    setTimeout(() => {
      const ok = loginWithGoogle(
        googleUserEmail,
        googleUserName,
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
      );
      if (ok) {
        router.push(redirectPath);
      } else {
        setError('Google authentication failed. Please try again.');
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Background Flag with Low Opacity */}
      <WavingPakistanFlag className="opacity-15" />

      {/* Ambient Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-md w-full mx-auto px-4 py-8">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <NexoraLogo size="lg" href="/" animated={true} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-sky-400 text-xs font-semibold">
            <GoogleIcon className="w-3.5 h-3.5" />
            <span>Google Account Authentication Required</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-3">
            Enterprise Single Sign-On
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mandatory Security Policy: All users must sign in via their Google Account to enter the ERP.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* PRIMARY GOOGLE SIGN-IN EXPERIENCE (MANDATORY) */}
          <div className="space-y-3 mb-5">
            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(true)}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 active:scale-[0.99] text-slate-900 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-3 border border-slate-200 ring-2 ring-blue-500/30"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>Sign in with Google Workspace</span>
            </button>

            {/* Quick 1-Click Google Accounts */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Instant Google Sign-In:
              </span>
              <button
                type="button"
                onClick={() => handleGoogleAuth('khurrammunir377@gmail.com', 'Khurram Munir')}
                className="w-full p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 flex items-center gap-3 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                  KM
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-emerald-400 truncate">
                    Khurram Munir
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">khurrammunir377@gmail.com</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium shrink-0">
                  Google SSO
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleGoogleAuth('admin@nexora.pk', 'Muhammad Hamza Khan')}
                className="w-full p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 flex items-center gap-3 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                  HK
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-sky-400 truncate">
                    Muhammad Hamza Khan (Super Admin)
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">admin@nexora.pk</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-sky-400 font-medium shrink-0">
                  Google SSO
                </span>
              </button>
            </div>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider relative">
                Alternative: Emergency Admin Override
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@nexora.pk"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs text-white placeholder-slate-500 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Password
                </label>
                <a href="#reset" className="text-[11px] text-emerald-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs text-white placeholder-slate-500 transition-all outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0"
                />
                <span>Remember this computer</span>
              </label>
              <span className="text-[11px] text-slate-500">256-Bit SSL</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.99] text-slate-200 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 border border-slate-700"
            >
              Sign In with Corporate Password
            </button>
          </form>

          {/* Quick Demo Login Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Instant Demo Access (Click to Login)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('superadmin@nexora.pk')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-emerald-400 flex items-center justify-between">
                  <span>Hamza Khan</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Super Admin</span>
                </div>
                <div className="text-[10px] text-slate-500">superadmin@nexora.pk</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('hr@nexora.pk')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-indigo-400 flex items-center justify-between">
                  <span>Fatima Tariq</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-semibold">HR Head</span>
                </div>
                <div className="text-[10px] text-slate-500">hr@nexora.pk</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('finance@nexora.pk')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/50 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-sky-400 flex items-center justify-between">
                  <span>Bilal Ahmed</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 font-semibold">Finance VP</span>
                </div>
                <div className="text-[10px] text-slate-500">finance@nexora.pk</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('sales@nexora.pk')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                  <span>Ayesha Malik</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold">Sales Lead</span>
                </div>
                <div className="text-[10px] text-slate-500">sales@nexora.pk</div>
              </button>
            </div>
          </div>
        </div>

        {/* Security Footer Notice */}
        <div className="text-center mt-6 text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <span>NTN: 7492819-3</span>
          <span>•</span>
          <span>ISO 27001 Certified Infrastructure</span>
          <span>•</span>
          <span>Pakistan</span>
        </div>
      </div>

      {/* GOOGLE OAUTH MODAL */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsGoogleModalOpen(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <div className="flex justify-center mb-2">
                <GoogleIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Sign in with Google</h3>
              <p className="text-xs text-slate-500 mt-1">
                Choose an account to continue to <strong>Nexora ERP</strong>
              </p>
            </div>

            <div className="space-y-2 mb-6">
              {/* Account Option 1 */}
              <button
                type="button"
                onClick={() => handleGoogleAuth('khurrammunir377@gmail.com', 'Khurram Munir')}
                className="w-full p-3 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center gap-3 transition-all text-left"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  KM
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">Khurram Munir</div>
                  <div className="text-[11px] text-slate-500 truncate">khurrammunir377@gmail.com</div>
                </div>
              </button>

              {/* Account Option 2 */}
              <button
                type="button"
                onClick={() => handleGoogleAuth('admin@nexora.pk', 'Muhammad Hamza Khan')}
                className="w-full p-3 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center gap-3 transition-all text-left"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  HK
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">Muhammad Hamza Khan (Admin)</div>
                  <div className="text-[11px] text-slate-500 truncate">admin@nexora.pk</div>
                </div>
              </button>
            </div>

            {/* Custom Google Account Entry */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <span className="text-[11px] font-semibold text-slate-500 block">Use another Google Account:</span>
              <input
                type="text"
                placeholder="Full Name"
                value={customGoogleName}
                onChange={(e) => setCustomGoogleName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="name@gmail.com or Google Workspace"
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                disabled={!customGoogleEmail}
                onClick={() => handleGoogleAuth(customGoogleEmail, customGoogleName || 'Google User')}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs transition-all shadow-sm"
              >
                Sign in with this Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Nexora Portal...</div>}>
      <LoginForm />
    </Suspense>
  );
}
