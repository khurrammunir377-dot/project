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
  iconColor: string;
  iconBg: string;
  iconGlow: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Core Platform',
    items: [
      {
        name: 'Executive Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        iconColor: 'text-emerald-400',
        iconBg: 'bg-emerald-500/15 group-hover:bg-emerald-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(16,185,129,0.55)]',
      },
    ],
  },
  {
    title: 'HR & Workforce',
    items: [
      {
        name: 'Employees Directory',
        href: '/hr/employees',
        icon: Users,
        iconColor: 'text-sky-400',
        iconBg: 'bg-sky-500/15 group-hover:bg-sky-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(56,189,248,0.55)]',
      },
      {
        name: 'Live Attendance',
        href: '/hr/attendance',
        icon: Clock,
        iconColor: 'text-amber-400',
        iconBg: 'bg-amber-500/15 group-hover:bg-amber-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(251,191,36,0.55)]',
      },
      {
        name: 'Leave Management',
        href: '/hr/leave',
        icon: CalendarDays,
        iconColor: 'text-rose-400',
        iconBg: 'bg-rose-500/15 group-hover:bg-rose-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(251,113,133,0.55)]',
      },
      {
        name: 'Payroll & Payslips',
        href: '/hr/payroll',
        icon: CreditCard,
        iconColor: 'text-teal-400',
        iconBg: 'bg-teal-500/15 group-hover:bg-teal-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(45,212,191,0.55)]',
      },
      {
        name: 'Recruitment & ATS',
        href: '/hr/recruitment',
        icon: Briefcase,
        iconColor: 'text-purple-400',
        iconBg: 'bg-purple-500/15 group-hover:bg-purple-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(192,132,252,0.55)]',
      },
      {
        name: 'Performance & KPIs',
        href: '/hr/performance',
        icon: Award,
        iconColor: 'text-yellow-400',
        iconBg: 'bg-yellow-500/15 group-hover:bg-yellow-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(250,204,21,0.55)]',
      },
    ],
  },
  {
    title: 'CRM & Commercial',
    items: [
      {
        name: 'Customers & CRM',
        href: '/crm/customers',
        icon: Contact,
        iconColor: 'text-cyan-400',
        iconBg: 'bg-cyan-500/15 group-hover:bg-cyan-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(34,211,238,0.55)]',
      },
      {
        name: 'Sales Pipeline / Leads',
        href: '/crm/leads',
        icon: TrendingUp,
        iconColor: 'text-orange-400',
        iconBg: 'bg-orange-500/15 group-hover:bg-orange-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(251,146,60,0.55)]',
      },
      {
        name: 'Quotations',
        href: '/sales/quotations',
        icon: FileText,
        iconColor: 'text-blue-400',
        iconBg: 'bg-blue-500/15 group-hover:bg-blue-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(96,165,250,0.55)]',
      },
      {
        name: 'Invoices & Billing',
        href: '/sales/invoices',
        icon: Receipt,
        iconColor: 'text-emerald-400',
        iconBg: 'bg-emerald-500/15 group-hover:bg-emerald-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(16,185,129,0.55)]',
      },
    ],
  },
  {
    title: 'Supply Chain & Inventory',
    items: [
      {
        name: 'Product Catalog',
        href: '/inventory/products',
        icon: Package,
        iconColor: 'text-amber-400',
        iconBg: 'bg-amber-500/15 group-hover:bg-amber-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(251,191,36,0.55)]',
      },
      {
        name: 'Warehouses & Stock',
        href: '/inventory/warehouses',
        icon: Building2,
        iconColor: 'text-indigo-400',
        iconBg: 'bg-indigo-500/15 group-hover:bg-indigo-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(129,140,248,0.55)]',
      },
      {
        name: 'Procurement & POs',
        href: '/inventory/procurement',
        icon: ShoppingCart,
        iconColor: 'text-lime-400',
        iconBg: 'bg-lime-500/15 group-hover:bg-lime-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(163,230,53,0.55)]',
      },
    ],
  },
  {
    title: 'Financials & Expenses',
    items: [
      {
        name: 'Expense Claims',
        href: '/finance/expenses',
        icon: Coins,
        iconColor: 'text-rose-400',
        iconBg: 'bg-rose-500/15 group-hover:bg-rose-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(251,113,133,0.55)]',
      },
      {
        name: 'Chart of Accounts',
        href: '/finance/accounts',
        icon: BarChart3,
        iconColor: 'text-teal-400',
        iconBg: 'bg-teal-500/15 group-hover:bg-teal-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(45,212,191,0.55)]',
      },
    ],
  },
  {
    title: 'Delivery & Collaboration',
    items: [
      {
        name: 'Projects Portfolio',
        href: '/projects',
        icon: FolderKanban,
        iconColor: 'text-violet-400',
        iconBg: 'bg-violet-500/15 group-hover:bg-violet-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(167,139,250,0.55)]',
      },
      {
        name: 'Tasks Board (Kanban)',
        href: '/tasks',
        icon: CheckSquare,
        iconColor: 'text-sky-400',
        iconBg: 'bg-sky-500/15 group-hover:bg-sky-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(56,189,248,0.55)]',
      },
      {
        name: 'Document Center',
        href: '/documents',
        icon: FileArchive,
        iconColor: 'text-amber-400',
        iconBg: 'bg-amber-500/15 group-hover:bg-amber-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(251,191,36,0.55)]',
      },
      {
        name: 'Company Calendar',
        href: '/calendar',
        icon: Calendar,
        iconColor: 'text-blue-400',
        iconBg: 'bg-blue-500/15 group-hover:bg-blue-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(96,165,250,0.55)]',
      },
    ],
  },
  {
    title: 'Operations & Support',
    items: [
      {
        name: 'Company Assets',
        href: '/assets',
        icon: Monitor,
        iconColor: 'text-cyan-400',
        iconBg: 'bg-cyan-500/15 group-hover:bg-cyan-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(34,211,238,0.55)]',
      },
      {
        name: 'Helpdesk & Tickets',
        href: '/tickets',
        icon: Headphones,
        iconColor: 'text-pink-400',
        iconBg: 'bg-pink-500/15 group-hover:bg-pink-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(244,114,182,0.55)]',
      },
    ],
  },
  {
    title: 'Intelligence & Admin',
    items: [
      {
        name: 'Marketing & Ads Report',
        href: '/reports/marketing',
        icon: Megaphone,
        iconColor: 'text-fuchsia-400',
        iconBg: 'bg-fuchsia-500/15 group-hover:bg-fuchsia-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(232,121,249,0.55)]',
      },
      {
        name: 'Reporting Center',
        href: '/reports',
        icon: BarChart3,
        iconColor: 'text-emerald-400',
        iconBg: 'bg-emerald-500/15 group-hover:bg-emerald-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(16,185,129,0.55)]',
      },
      {
        name: 'System Settings',
        href: '/settings',
        icon: Settings,
        iconColor: 'text-slate-300',
        iconBg: 'bg-slate-700/30 group-hover:bg-slate-700/50',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(148,163,184,0.4)]',
      },
      {
        name: 'Security Audit Logs',
        href: '/audit-logs',
        icon: ShieldAlert,
        iconColor: 'text-red-400',
        iconBg: 'bg-red-500/15 group-hover:bg-red-500/25',
        iconGlow: 'group-hover:shadow-[0_0_12px_rgba(248,113,113,0.55)]',
      },
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
            <div className="pb-2 border-b border-slate-800/80">
              <Link
                href="/admin"
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                title="Admin Control Center"
                className={`group relative flex items-center ${
                  isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
                } rounded-xl text-xs font-bold transition-all duration-300 ${
                  pathname === '/admin'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-lg shadow-emerald-500/30 ring-1 ring-emerald-300/40'
                    : 'bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-indigo-500/15 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400/70 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-500/20'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300 group-hover:scale-110 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.6)] transition-all duration-300">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                  </div>
                  {!isCollapsed && <span>Admin Control Center</span>}
                </div>
                {!isCollapsed && (
                  <span className="flex items-center gap-1.5 text-[9px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Live</span>
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
                    className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-200 transition-colors group"
                  >
                    <span className="group-hover:tracking-[0.12em] transition-all duration-200">
                      {section.title}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-transform duration-200 ${
                        isCollapsedSection ? '-rotate-90' : ''
                      }`}
                    />
                  </button>
                )}

                {(!isCollapsedSection || isCollapsed) && (
                  <div className="space-y-1 pt-1">
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
                          className={`group relative flex items-center ${
                            isCollapsed
                              ? 'justify-center p-2.5 rounded-xl'
                              : 'gap-3 px-2.5 py-2 rounded-xl'
                          } text-xs font-medium transition-all duration-300 ease-out ${
                            isActive
                              ? 'bg-gradient-to-r from-slate-800 via-slate-800/90 to-slate-900/60 text-white font-semibold shadow-md shadow-black/40 border border-slate-700/80'
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/70 hover:shadow-md hover:shadow-black/20 border border-transparent hover:border-slate-700/60'
                          }`}
                        >
                          {/* Active Left Illuminated Indicator Pill */}
                          {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-gradient-to-b from-emerald-400 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
                          )}

                          {/* Colored Icon Container with Glow & Micro-Animation */}
                          <div
                            className={`p-1.5 rounded-lg shrink-0 transition-all duration-300 ease-out flex items-center justify-center ${
                              item.iconBg
                            } ${item.iconColor} ${item.iconGlow} ${
                              isActive
                                ? 'ring-1 ring-white/25 shadow-md shadow-black/30 scale-105'
                                : 'group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:rotate-[2deg]'
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 transition-all duration-300 ${
                                isActive
                                  ? 'drop-shadow-[0_0_8px_currentColor]'
                                  : 'group-hover:drop-shadow-[0_0_8px_currentColor]'
                              }`}
                            />
                          </div>

                          {/* Button Label with Smooth Translation on Hover */}
                          {!isCollapsed && (
                            <span className="truncate transition-transform duration-200 group-hover:translate-x-1">
                              {item.name}
                            </span>
                          )}

                          {/* Active Neon Dot Indicator */}
                          {!isCollapsed && isActive && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                          )}
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

