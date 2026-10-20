'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Clock,
  Receipt,
  CheckSquare,
  Menu,
} from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMenu }) => {
  const pathname = usePathname();
  const { state } = useERPStore();
  const { currentUser } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = state.attendance.find(
    (a) =>
      a.date === todayStr &&
      (a.employeeId === currentUser?.employeeId || a.employeeName === currentUser?.name)
  );
  const isClockedIn = Boolean(todayRecord && !todayRecord.clockOut);

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Attendance',
      href: '/hr/attendance',
      icon: Clock,
      badge: isClockedIn ? 'Active' : null,
      badgeColor: 'bg-emerald-500',
    },
    {
      name: 'Invoices',
      href: '/sales/invoices',
      icon: Receipt,
      badge: null,
    },
    {
      name: 'Tasks',
      href: '/tasks',
      icon: CheckSquare,
      badge: null,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? 'text-indigo-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110' : ''
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium leading-tight truncate max-w-[64px]">
                {item.name}
              </span>
              {isActive && (
                <span className="w-4 h-0.5 rounded-full bg-indigo-600 dark:bg-emerald-400 mt-0.5" />
              )}
            </Link>
          );
        })}

        {/* Menu button to open full drawer */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all active:scale-95"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium leading-tight">More</span>
        </button>
      </div>
    </nav>
  );
};
