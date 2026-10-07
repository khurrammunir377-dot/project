'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Coins,
  TrendingUp,
  CreditCard,
  Clock,
  CalendarDays,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  Plus,
  CheckCircle,
  FolderKanban,
  Package,
  Megaphone,
  Calendar,
  Building,
} from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { AttendanceChart } from '@/components/charts/AttendanceChart';
import { DepartmentPieChart } from '@/components/charts/DepartmentPieChart';

export default function DashboardPage() {
  const { state, addAttendance } = useERPStore();
  const { currentUser, currentBranch } = useAuth();
  const [clockedIn, setClockedIn] = useState(false);

  // Calculations
  const totalEmployees = state.employees.length;
  const activeEmployees = state.employees.filter((e) => e.status === 'Active').length;
  const onLeaveEmployees = state.leaveRequests.filter((l) => l.status === 'Approved').length;
  const pendingApprovalsCount =
    state.leaveRequests.filter((l) => l.status === 'Pending').length +
    state.expenseClaims.filter((e) => e.status === 'Pending').length +
    state.purchaseOrders.filter((p) => p.status === 'Submitted').length;

  const totalRevenue = state.invoices
    .filter((i) => i.status === 'Paid' || i.status === 'Partial')
    .reduce((acc, i) => acc + i.amountPaid, 0);

  const outstandingInvoicesTotal = state.invoices
    .filter((i) => i.status !== 'Paid')
    .reduce((acc, i) => acc + i.balanceDue, 0);

  const lowStockProducts = state.products.filter((p) => p.stock <= p.minStockLevel);

  const inventoryValue = state.products.reduce((acc, p) => acc + p.stock * p.costPrice, 0);

  const handleQuickClock = () => {
    if (!clockedIn) {
      addAttendance({
        employeeId: currentUser.employeeId,
        employeeName: currentUser.name,
        department: 'Executive & Admin',
        date: new Date().toISOString().split('T')[0],
        clockIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        breakDurationMinutes: 0,
        workingHours: 0,
        overtimeHours: 0,
        status: 'Present',
        approved: true,
      });
      setClockedIn(true);
    } else {
      setClockedIn(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <span>{currentBranch.name}</span>
            <span>•</span>
            <span>Fiscal Year 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Here is your live operational overview across all departments, active projects,
            revenue streams, and workforce metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10 flex-wrap">
          <button
            onClick={handleQuickClock}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md ${
              clockedIn
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/40'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-900/40'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{clockedIn ? 'Clock Out (Active)' : 'Quick Clock In'}</span>
          </button>
          <Link href="/hr/employees">
            <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              <Users className="w-3.5 h-3.5 mr-1" /> Directory
            </Button>
          </Link>
          <Link href="/sales/invoices">
            <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              <CreditCard className="w-3.5 h-3.5 mr-1" /> New Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workforce"
          value={totalEmployees}
          icon={<Users className="w-5 h-5" />}
          subtitle={`${activeEmployees} active • ${onLeaveEmployees} on leave`}
          trend={{ value: '+8.4% YoY', positive: true }}
          colorScheme="indigo"
        />
        <StatCard
          title="YTD Realized Revenue"
          value={`Rs. ${(totalRevenue / 1000000).toFixed(2)}M`}
          icon={<Coins className="w-5 h-5" />}
          subtitle={`Rs. ${(outstandingInvoicesTotal / 1000).toFixed(0)}k outstanding`}
          trend={{ value: '+14.2% MoM', positive: true }}
          colorScheme="emerald"
        />
        <StatCard
          title="Pending Approvals"
          value={pendingApprovalsCount}
          icon={<FileCheck className="w-5 h-5" />}
          subtitle="Leave, expenses, and POs awaiting sign-off"
          trend={{ value: 'Action Required', positive: false }}
          colorScheme="amber"
        />
        <StatCard
          title="Inventory Valuation"
          value={`$${(inventoryValue / 1000).toFixed(1)}k`}
          icon={<Package className="w-5 h-5" />}
          subtitle={`${lowStockProducts.length} items below minimum threshold`}
          trend={{ value: `${lowStockProducts.length} Low Stock`, positive: lowStockProducts.length === 0 }}
          colorScheme="rose"
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          title="Revenue vs Operational Expenses"
          subtitle="Consolidated 6-month financial performance trajectory"
          className="lg:col-span-2"
          headerAction={
            <Link href="/finance/accounts" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
              General Ledger <ArrowRight className="w-3 h-3" />
            </Link>
          }
        >
          <RevenueChart />
        </Card>

        <Card
          title="Department Headcount Distribution"
          subtitle="Workforce allocation across 6 key divisions"
          headerAction={
            <Link href="/hr/employees" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          }
        >
          <DepartmentPieChart />
        </Card>
      </div>

      {/* Secondary Operational Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trends */}
        <Card
          title="Weekly Attendance & Punctuality"
          subtitle="Mon - Fri attendance logging rates across staff"
          headerAction={
            <Link href="/hr/attendance" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
              Live Logs <ArrowRight className="w-3 h-3" />
            </Link>
          }
        >
          <AttendanceChart />
        </Card>

        {/* Pending Approvals Workflow Queue */}
        <Card
          title="Actionable Approval Queue"
          subtitle="Items awaiting managerial authorization"
          headerAction={
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
              {pendingApprovalsCount} Items
            </span>
          }
        >
          <div className="space-y-3">
            {state.leaveRequests.filter((l) => l.status === 'Pending').slice(0, 2).map((l) => (
              <div key={l.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{l.employeeName}</div>
                  <div className="text-slate-500">{l.leaveType} • {l.days} days ({l.startDate})</div>
                </div>
                <Link href="/hr/leave">
                  <Badge variant="warning">Review</Badge>
                </Link>
              </div>
            ))}

            {state.expenseClaims.filter((e) => e.status === 'Pending').slice(0, 2).map((e) => (
              <div key={e.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{e.employeeName}</div>
                  <div className="text-slate-500">${e.amount.toFixed(2)} • {e.category}</div>
                </div>
                <Link href="/finance/expenses">
                  <Badge variant="warning">Review</Badge>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        {/* Announcements & Upcoming Events */}
        <Card
          title="Announcements & Syncs"
          subtitle="Company-wide updates and upcoming meetings"
        >
          <div className="space-y-3">
            {state.announcements.slice(0, 2).map((ann) => (
              <div key={ann.id} className="p-3 rounded-lg border border-indigo-100 dark:border-indigo-950 bg-indigo-50/40 dark:bg-indigo-950/20 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-300">
                  <Megaphone className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{ann.title}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{ann.content}</p>
                <div className="text-[10px] text-slate-400 mt-1.5">{ann.author} • {ann.date}</div>
              </div>
            ))}

            {state.calendarEvents.slice(0, 1).map((ev) => (
              <div key={ev.id} className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{ev.title}</div>
                    <div className="text-[11px] text-slate-400">{ev.date} @ {ev.startTime}</div>
                  </div>
                </div>
                <Badge variant="neutral">{ev.type}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Active Projects & Low Stock Warning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects */}
        <Card
          title="Strategic Projects in Flight"
          subtitle="Active deliverables, progress, and budget burn rate"
          headerAction={
            <Link href="/projects" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
              Projects Portfolio <ArrowRight className="w-3 h-3" />
            </Link>
          }
        >
          <div className="space-y-4">
            {state.projects.map((p) => (
              <div key={p.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{p.name}</span>
                  <span className="font-bold text-indigo-600">{p.progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${p.progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Manager: {p.manager}</span>
                  <span>Spent: Rs. {p.spent.toLocaleString()} / Rs. {p.budget.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Low Stock Watchlist */}
        <Card
          title="Inventory Alerts & Critical Items"
          subtitle="Products requiring immediate supplier replenishment"
          headerAction={
            <Link href="/inventory/products" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
              Manage Products <ArrowRight className="w-3 h-3" />
            </Link>
          }
        >
          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                All inventory items are currently above healthy stock thresholds.
              </div>
            ) : (
              lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-300">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{p.name}</div>
                      <div className="text-slate-500">
                        SKU: {p.sku} • Warehouse: {p.warehouseName}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-rose-600 text-sm">
                      {p.stock} / {p.minStockLevel} {p.unit}
                    </div>
                    <Link href="/inventory/procurement" className="text-[11px] text-indigo-600 hover:underline font-semibold">
                      Create PO
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
