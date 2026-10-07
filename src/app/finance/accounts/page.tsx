'use client';

import React from 'react';
import { BarChart3, Plus, Coins, ArrowUpRight, ArrowDownRight, Scale } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { Account } from '@/lib/types';

export default function AccountsPage() {
  const { state } = useERPStore();

  const totalAssets = state.accounts.filter((a) => a.type === 'Asset').reduce((acc, a) => acc + a.balance, 0);
  const totalLiabilities = state.accounts.filter((a) => a.type === 'Liability').reduce((acc, a) => acc + a.balance, 0);
  const totalEquity = state.accounts.filter((a) => a.type === 'Equity').reduce((acc, a) => acc + a.balance, 0);
  const totalRevenue = state.accounts.filter((a) => a.type === 'Revenue').reduce((acc, a) => acc + a.balance, 0);
  const totalExpenses = state.accounts.filter((a) => a.type === 'Expense').reduce((acc, a) => acc + a.balance, 0);

  const columns: Column<Account>[] = [
    {
      header: 'Account Code',
      accessorKey: 'code',
      sortable: true,
      render: (a) => <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">{a.code}</span>,
    },
    {
      header: 'Account Name',
      accessorKey: 'name',
      sortable: true,
      render: (a) => <span className="font-semibold text-slate-900 dark:text-slate-100">{a.name}</span>,
    },
    {
      header: 'Classification',
      accessorKey: 'type',
      sortable: true,
      render: (a) => {
        const variants: Record<string, any> = {
          Asset: 'success',
          Liability: 'danger',
          Equity: 'purple',
          Revenue: 'indigo',
          Expense: 'warning',
        };
        return <Badge variant={variants[a.type]}>{a.type}</Badge>;
      },
    },
    {
      header: 'Currency',
      accessorKey: 'currency',
      render: (a) => <span className="text-xs font-mono">{a.currency || 'PKR'}</span>,
    },
    {
      header: 'Current Ledger Balance',
      accessorKey: 'balance',
      sortable: true,
      render: (a) => (
        <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">
          Rs. {a.balance.toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" /> Chart of Accounts &amp; General Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Standard GAAP/IFRS ledger accounts, real-time trial balances, and financial structure.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Assets"
          value={`Rs. ${(totalAssets / 1000).toFixed(0)}k`}
          icon={<Coins className="w-5 h-5" />}
          subtitle="Cash, receivables, equipment"
          colorScheme="emerald"
        />
        <StatCard
          title="Total Liabilities"
          value={`Rs. ${(totalLiabilities / 1000).toFixed(0)}k`}
          icon={<Scale className="w-5 h-5" />}
          subtitle="Payables and accruals"
          colorScheme="rose"
        />
        <StatCard
          title="YTD Total Revenue"
          value={`Rs. ${(totalRevenue / 1000).toFixed(0)}k`}
          icon={<ArrowUpRight className="w-5 h-5" />}
          subtitle="Gross enterprise earnings"
          colorScheme="indigo"
        />
        <StatCard
          title="Net Operating Margin"
          value={`Rs. ${((totalRevenue - totalExpenses) / 1000).toFixed(0)}k`}
          icon={<ArrowDownRight className="w-5 h-5" />}
          subtitle={`${(((totalRevenue - totalExpenses) / (totalRevenue || 1)) * 100).toFixed(1)}% Operating Margin`}
          colorScheme="sky"
        />
      </div>

      <DataTable
        data={state.accounts}
        columns={columns}
        searchPlaceholder="Search accounts by code, title, classification..."
        searchKey={(a) => `${a.code} ${a.name} ${a.type}`}
        exportFileName="Nexora_Chart_Of_Accounts"
      />
    </div>
  );
}
