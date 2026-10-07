'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  CreditCard,
  Briefcase,
  Award,
  Contact,
  TrendingUp,
  FileText,
  Receipt,
  Package,
  Building2,
  ShoppingCart,
  Coins,
  Megaphone,
  FolderKanban,
  CheckSquare,
  FileArchive,
  Calendar,
  Monitor,
  Headphones,
  BarChart3,
  Settings,
  ShieldAlert,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { NexoraLogo } from '@/components/ui/NexoraLogo';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Core Platform',
    items: [
      { name: 'Executive Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'HR & Workforce',
    items: [
      { name: 'Employees Directory', href: '/hr/employees', icon: Users },
      { name: 'Live Attendance', href: '/hr/attendance', icon: Clock },
      { name: 'Leave Management', href: '/hr/leave', icon: CalendarDays },
      { name: 'Payroll & Payslips', href: '/hr/payroll', icon: CreditCard },
      { name: 'Recruitment & ATS', href: '/hr/recruitment', icon: Briefcase },
      { name: 'Performance & KPIs', href: '/hr/performance', icon: Award },
    ],
  },
  {
    title: 'CRM & Commercial',
    items: [
      { name: 'Customers & CRM', href: '/crm/customers', icon: Contact },
      { name: 'Sales Pipeline / Leads', href: '/crm/leads', icon: TrendingUp },
      { name: 'Quotations', href: '/sales/quotations', icon: FileText },
      { name: 'Invoices & Billing', href: '/sales/invoices', icon: Receipt },
    ],
  },
  {
    title: 'Supply Chain & Inventory',
    items: [
      { name: 'Product Catalog', href: '/inventory/products', icon: Package },
      { name: 'Warehouses & Stock', href: '/inventory/warehouses', icon: Building2 },
      { name: 'Procurement & POs', href: '/inventory/procurement', icon: ShoppingCart },
    ],
  },
  {
    title: 'Financials & Expenses',
    items: [
      { name: 'Expense Claims', href: '/finance/expenses', icon: Coins },
      { name: 'Chart of Accounts', href: '/finance/accounts', icon: BarChart3 },
    ],
  },
  {
    title: 'Delivery & Collaboration',
    items: [
      { name: 'Projects Portfolio', href: '/projects', icon: FolderKanban },
      { name: 'Tasks Board (Kanban)', href: '/tasks', icon: CheckSquare },
      { name: 'Document Center', href: '/documents', icon: FileArchive },
      { name: 'Company Calendar', href: '/calendar', icon: Calendar },
    ],
  },
  {
    title: 'Operations & Support',
    items: [
      { name: 'Company Assets', href: '/assets', icon: Monitor },
      { name: 'Helpdesk & Tickets', href: '/tickets', icon: Headphones },
    ],
  },
  {
    title: 'Intelligence & Admin',
    items: [
      { name: 'Marketing & Ads Report', href: '/reports/marketing', icon: Megaphone },
      { name: 'Reporting Center', href: '/reports', icon: BarChart3 },
      { name: 'System Settings', href: '/settings', icon: Settings },
      { name: 'Security Audit Logs', href: '/audit-logs', icon: ShieldAlert },
    ],
  },
];

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const pathname = usePathname();
  const { currentUser, isSuperAdmin } = useAuth();
  const isAdmin = isSuperAdmin || currentUser?.role === 'Company Admin';
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950/60">
          <NexoraLogo size="sm" href="/dashboard" animated={true} />
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {/* Admin Control Center - Exclusively Visible to Admins */}
          {isAdmin && (
            <div className="pb-2 border-b border-slate-800">
              <Link
                href="/admin"
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  pathname === '/admin'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-lg shadow-emerald-500/25'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Control Center</span>
                </div>
                <span className="text-[9px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono uppercase tracking-wide">
                  Live
                </span>
              </Link>
            </div>
          )}
          {NAV_SECTIONS.map((section) => {
            const isCollapsed = collapsedSections[section.title];
            return (
              <div key={section.title} className="space-y-1">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors"
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isCollapsed ? '-rotate-90' : ''
                    }`}
                  />
                </button>

                {!isCollapsed && (
                  <div className="space-y-0.5 pt-1">
                    {section.items.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== '/dashboard' && pathname?.startsWith(item.href));
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => {
                            if (window.innerWidth < 1024) onClose();
                          }}
                          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                            isActive
                              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40'
                              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Status Indicator */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ERP Cloud Engine v2.4
            </span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">
              PROD
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
