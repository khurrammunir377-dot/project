'use client';

import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Building,
  UserCheck,
  ChevronDown,
  LogOut,
  Check,
  X,
  ExternalLink,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  Receipt,
  FileText,
  CheckSquare,
  TrendingUp,
  ShoppingCart,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useERPStore } from '@/lib/store/StoreContext';
import { GlobalSearchModal } from './GlobalSearchModal';
import Link from 'next/link';

interface TopNavbarProps {
  onMenuClick: () => void;
  onToggleCollapse?: () => void;
  isSidebarCollapsed?: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onMenuClick,
  onToggleCollapse,
  isSidebarCollapsed = false,
}) => {
  const {
    currentUser,
    users,
    switchUser,
    currentBranch,
    branches,
    setCurrentBranch,
    logout,
  } = useAuth();
  const { state, markNotificationRead, markAllNotificationsRead } = useERPStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6">
        {/* Left Section: Menu Toggle, Desktop Collapse & Global Search Trigger */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden lg:flex p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-emerald-500" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          )}

          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-xs w-56 lg:w-72 justify-between"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search modules, items, records...</span>
            </span>
            <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono text-slate-500 dark:text-slate-300">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right Section: Quick Add, Branch, Role Switcher, Dark Mode, Notifications, User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Add Action Menu (+) */}
          <div className="relative">
            <button
              onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
              title="Quick Add Action"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-xs shadow-sm shadow-indigo-600/30 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden md:inline">Quick Add</span>
            </button>

            {isQuickAddOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Quick Action Launcher
                </div>
                <div className="py-1 space-y-0.5">
                  <Link
                    href="/sales/invoices"
                    onClick={() => setIsQuickAddOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
                  >
                    <Receipt className="w-4 h-4 text-indigo-500" />
                    <span>New Sales Invoice</span>
                  </Link>
                  <Link
                    href="/sales/quotations"
                    onClick={() => setIsQuickAddOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-sky-500" />
                    <span>Commercial Quotation</span>
                  </Link>
                  <Link
                    href="/tasks"
                    onClick={() => setIsQuickAddOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
                  >
                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                    <span>Create Task</span>
                  </Link>
                  <Link
                    href="/crm/leads"
                    onClick={() => setIsQuickAddOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
                  >
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    <span>New Sales Lead</span>
                  </Link>
                  <Link
                    href="/inventory/procurement"
                    onClick={() => setIsQuickAddOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4 text-purple-500" />
                    <span>Purchase Order (PO)</span>
                  </Link>
                  <Link
                    href="/hr/employees"
                    onClick={() => setIsQuickAddOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
                  >
                    <UserPlus className="w-4 h-4 text-teal-500" />
                    <span>Onboard Employee</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Branch Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsBranchMenuOpen(!isBranchMenuOpen)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <Building className="w-3.5 h-3.5 text-indigo-500" />
              <span className="truncate max-w-[120px]">{currentBranch.name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isBranchMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Active Branch
                </div>
                {branches.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setCurrentBranch(b);
                      setIsBranchMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${
                      currentBranch.id === b.id
                        ? 'font-bold text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{b.name}</span>
                    {currentBranch.id === b.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Role / User Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 hover:bg-indigo-100/60 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline font-semibold">{currentUser.role}</span>
              <ChevronDown className="w-3 h-3 text-indigo-500" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50">
                <div className="px-3.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Switch Persona / Role
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Test the system across different RBAC authorization tiers.
                  </p>
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${
                        currentUser.id === u.id
                          ? 'bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div>
                          <div className="leading-tight">{u.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{u.role}</div>
                        </div>
                      </div>
                      {currentUser.id === u.id && (
                        <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Notifications
                    </h4>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-indigo-600 hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {state.notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications at this time.
                    </div>
                  ) : (
                    state.notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                          !n.read ? 'bg-indigo-50/20 dark:bg-indigo-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`text-xs font-semibold ${
                              !n.read
                                ? 'text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {n.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {n.message}
                        </p>
                        {n.link && (
                          <Link
                            href={n.link}
                            onClick={() => setIsNotifOpen(false)}
                            className="inline-flex items-center gap-1 text-[11px] text-indigo-600 font-medium mt-1.5 hover:underline"
                          >
                            View details <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">{currentUser.jobTitle}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Dialog */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
