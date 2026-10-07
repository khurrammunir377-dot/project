'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { StoreProvider } from '@/lib/store/StoreContext';
import { AuthProvider, useAuth } from '@/lib/auth/AuthContext';
import { NexoraLogo } from '@/components/ui/NexoraLogo';

function ERPProtectedShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isAuthenticated, isHydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isHydrated, isAuthenticated, pathname, router]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <NexoraLogo size="lg" animated={true} />
        <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>INITIALIZING NEXORA SECURE ENTERPRISE SUITE...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <NexoraLogo size="md" animated={true} />
        <p className="mt-3 text-xs text-slate-400">
          Authentication required. Redirecting to Nexora Portal...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 flex flex-col font-sans">
      {/* Sidebar with Desktop Icon Collapsibility */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Main Area with dynamic padding-left */}
      <div
        className={`${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        } flex flex-col flex-1 min-w-0 transition-all duration-300`}
      >
        {/* Top Navigation */}
        <TopNavbar
          onMenuClick={() => setSidebarOpen(true)}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Dynamic Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isPublicRoute = pathname === '/' || pathname === '/login';

  return (
    <StoreProvider>
      <AuthProvider>
        {isPublicRoute ? (
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-emerald-500 selection:text-white">
            {children}
          </div>
        ) : (
          <ERPProtectedShell>{children}</ERPProtectedShell>
        )}
      </AuthProvider>
    </StoreProvider>
  );
};
