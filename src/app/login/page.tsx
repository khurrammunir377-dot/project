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
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { NexoraLogo } from '@/components/ui/NexoraLogo';
import { WavingPakistanFlag } from '@/components/ui/WavingPakistanFlag';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const { login, isAuthenticated, isHydrated, users } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('nexora123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        setError('Invalid credentials. Please select one of the pre-configured Pakistani enterprise profiles below.');
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FBR Compliant Enterprise ERP</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-3">
            Sign In to Your Workspace
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access unified financials, HR, godown inventory &amp; operations
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
              className="w-full mt-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating with SECP/FBR Gateway...</span>
              ) : (
                <>
                  <span>Enter Nexora ERP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Instant Demo Access (Click to Login)
              </span>
              <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono">
                1-CLICK
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@nexora.pk')}
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/60 text-left transition-all group"
              >
                <div className="font-bold text-white text-[11px] group-hover:text-emerald-400 flex items-center gap-1">
                  <span>M. Hamza Khan</span>
                </div>
                <div className="text-[10px] text-slate-400">Super Admin (All)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('ayesha@nexora.pk')}
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/60 text-left transition-all group"
              >
                <div className="font-bold text-white text-[11px] group-hover:text-emerald-400 flex items-center gap-1">
                  <span>Ayesha Siddiqui</span>
                </div>
                <div className="text-[10px] text-slate-400">Company Admin</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('fatima.hr@nexora.pk')}
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/60 text-left transition-all group"
              >
                <div className="font-bold text-white text-[11px] group-hover:text-emerald-400 flex items-center gap-1">
                  <span>Fatima Tariq</span>
                </div>
                <div className="text-[10px] text-slate-400">HR Manager</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('bilal.fin@nexora.pk')}
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/60 text-left transition-all group"
              >
                <div className="font-bold text-white text-[11px] group-hover:text-emerald-400 flex items-center gap-1">
                  <span>Bilal Ahmed</span>
                </div>
                <div className="text-[10px] text-slate-400">Finance Manager</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('sana.sales@nexora.pk')}
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/60 text-left transition-all group"
              >
                <div className="font-bold text-white text-[11px] group-hover:text-emerald-400 flex items-center gap-1">
                  <span>Sana Mir</span>
                </div>
                <div className="text-[10px] text-slate-400">Sales Manager</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('tariq.inv@nexora.pk')}
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/60 text-left transition-all group"
              >
                <div className="font-bold text-white text-[11px] group-hover:text-emerald-400 flex items-center gap-1">
                  <span>Tariq Mahmood</span>
                </div>
                <div className="text-[10px] text-slate-400">Inventory Mgr</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info with NTN */}
        <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
          <div>
            Nexora Business Solutions (Pvt.) Ltd. • Level 14, Dolmen City, Karachi
          </div>
          <div className="font-mono text-[11px] text-slate-400 whitespace-nowrap">
            NTN: 7492819-3 • STRN: 3277876123456
          </div>
          <div className="pt-2">
            <Link href="/" className="text-emerald-400 hover:underline">
              ← Return to Nexora Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
          <NexoraLogo size="lg" animated={true} />
          <div className="mt-4 text-xs text-slate-400 font-mono">Loading Secure Portal...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
