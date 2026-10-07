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
  X,
  PanelLeftClose,
  PanelLeftOpen,
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

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
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

      {/* Sidebar Container with Collapsible Width */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-800 ${
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        } w-64 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div
          className={`h-16 flex items-center justify-between border-b border-slate-800 bg-slate-950/80 transition-all ${
            isCollapsed ? 'px-3 justify-center' : 'px-4'
          }`}
        >
          {isCollapsed ? (
            <div className="flex flex-col items-center">
              <NexoraLogo size="sm" showText={false} animated={true} />
            </div>
          ) : (
            <NexoraLogo size="sm" showText={true} animated={true} />
          )}

          <div className="flex items-center gap-1">
            {/* Desktop Collapse / Expand Toggle Button */}
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                title={isCollapsed ? 'Expand navigation sidebar' : 'Collapse navigation sidebar'}
                className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {isCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4 text-emerald-400" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-4">
          {/* Admin Control Center - Exclusively Visible to Admins */}
          {isAdmin && (
            <div className="pb-2 border-b border-slate-800">
              <Link
                href="/admin"
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                title="Admin Control Center"
                className={`flex items-center ${
                  isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                } rounded-xl text-xs font-bold transition-all ${
                  pathname === '/admin'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-lg shadow-emerald-500/25'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Admin Control Center</span>}
                </div>
                {!isCollapsed && (
                  <span className="text-[9px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono uppercase tracking-wide">
                    Live
                  </span>
                )}
              </Link>
            </div>
          )}

          {NAV_SECTIONS.map((section) => {
            const isCollapsedSection = collapsedSections[section.title];

            return (
              <div key={section.title} className="space-y-1">
                {/* Section Header with AA Contrast Standards */}
                {isCollapsed ? (
                  <div
                    className="w-full my-2 border-t border-slate-800/80"
                    title={section.title}
                  />
                ) : (
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between px-2 text-[11px] font-bold text-slate-200 uppercase tracking-wider hover:text-white transition-colors"
                  >
                    <span>{section.title}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                        isCollapsedSection ? '-rotate-90' : ''
                      }`}
                    />
                  </button>
                )}

                {(!isCollapsedSection || isCollapsed) && (
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
                          title={item.name}
                          onClick={() => {
                            if (window.innerWidth < 1024) onClose();
                          }}
                          className={`flex items-center ${
                            isCollapsed
                              ? 'justify-center p-2.5 rounded-xl'
                              : 'gap-2.5 px-2.5 py-2 rounded-lg'
                          } text-xs font-medium transition-all group ${
                            isActive
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 font-semibold'
                              : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-transform ${
                              isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                            }`}
                          />
                          {!isCollapsed && <span className="truncate">{item.name}</span>}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Status / Collapse Toggle */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          {isCollapsed ? (
            <div className="flex justify-center">
              <span
                className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"
                title="Nexora ERP Online"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ERP Cloud Engine v2.4
              </span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded font-mono text-emerald-400 font-bold">
                PROD
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

