'use client';

import React, { useState } from 'react';
import { Coins, Plus, Check, FileText, Upload, CheckCircle2 } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatCard } from '@/components/ui/StatCard';
import { ExpenseClaim } from '@/lib/types';

export default function ExpensesPage() {
  const { state, addExpenseClaim, updateExpenseStatus, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    category: 'Travel & Accommodation',
    amount: 25000,
    date: new Date().toISOString().split('T')[0],
    description: '',
    receiptName: 'receipt-invoice.pdf',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || form.amount <= 0) return;

    addExpenseClaim({
      employeeId: currentUser.employeeId,
      employeeName: currentUser.name,
      department: 'Executive & Admin',
      category: form.category,
      amount: Number(form.amount),
      date: form.date,
      description: form.description,
      receiptName: form.receiptName,
    });

    logAudit('Submitted Expense Claim', 'expenses', `Submitted claim for Rs. ${Number(form.amount).toLocaleString()} (${form.category})`, currentUser.name, currentUser.id);
    setIsModalOpen(false);
  };

  const handleApprove = (claim: ExpenseClaim) => {
    updateExpenseStatus(claim.id, 'Approved', currentUser.name);
    logAudit('Approved Expense Claim', 'expenses', `Approved claim ${claim.claimNumber} (Rs. ${claim.amount.toLocaleString()})`, currentUser.name, currentUser.id);
  };

  const handleReimburse = (claim: ExpenseClaim) => {
    updateExpenseStatus(claim.id, 'Reimbursed', currentUser.name);
    logAudit('Reimbursed Expense Claim', 'expenses', `Disbursed reimbursement for claim ${claim.claimNumber}`, currentUser.name, currentUser.id);
  };

  const totalClaimed = state.expenseClaims.reduce((acc, e) => acc + e.amount, 0);
  const pendingClaims = state.expenseClaims.filter((e) => e.status === 'Pending');

  const columns: Column<ExpenseClaim>[] = [
    {
      header: 'Claim Ref',
      accessorKey: 'claimNumber',
      sortable: true,
      render: (e) => (
        <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          {e.claimNumber}
        </span>
      ),
    },
    {
      header: 'Staff Member',
      accessorKey: 'employeeName',
      sortable: true,
      render: (e) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{e.employeeName}</div>
          <div className="text-xs text-slate-400">{e.department}</div>
        </div>
      ),
    },
    {
      header: 'Expense Category',
      accessorKey: 'category',
      sortable: true,
      render: (e) => <span className="text-xs font-medium">{e.category}</span>,
    },
    {
      header: 'Amount (PKR)',
      accessorKey: 'amount',
      sortable: true,
      render: (e) => <span className="font-bold text-slate-900 dark:text-slate-100">Rs. {e.amount.toLocaleString()}</span>,
    },
    {
      header: 'Date',
      accessorKey: 'date',
      sortable: true,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      render: (e) => {
        const variants: Record<string, any> = {
          Approved: 'info',
          Reimbursed: 'success',
          Pending: 'warning',
          Rejected: 'danger',
        };
        return <Badge variant={variants[e.status]}>{e.status}</Badge>;
      },
    },
    {
      header: 'Manager Action',
      render: (e) => (
        <div className="flex items-center gap-1.5" onClick={(ev) => ev.stopPropagation()}>
          {e.status === 'Pending' && can('expenses', 'approve') && (
            <Button variant="outline" size="sm" onClick={() => handleApprove(e)} icon={<Check className="w-3.5 h-3.5" />}>
              Approve
            </Button>
          )}
          {e.status === 'Approved' && can('expenses', 'approve') && (
            <Button variant="secondary" size="sm" onClick={() => handleReimburse(e)} icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}>
              Reimburse
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Coins className="w-6 h-6 text-indigo-600" /> Expense Claims &amp; Reimbursements
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Corporate receipts, employee expense reports, policy compliance, and automated payouts.
          </p>
        </div>

        {can('expenses', 'create') && (
          <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Submit Expense Claim
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Claims Incurred"
          value={`Rs. ${totalClaimed.toLocaleString()}`}
          icon={<Coins className="w-5 h-5" />}
          subtitle="YTD business expenses"
          colorScheme="indigo"
        />
        <StatCard
          title="Pending Approval"
          value={`Rs. ${pendingClaims.reduce((acc, c) => acc + c.amount, 0).toLocaleString()}`}
          icon={<FileText className="w-5 h-5" />}
          subtitle={`${pendingClaims.length} claims awaiting review`}
          colorScheme="amber"
        />
        <StatCard
          title="Reimbursed to Date"
          value={`Rs. ${state.expenseClaims.filter((c) => c.status === 'Reimbursed').reduce((acc, c) => acc + c.amount, 0).toLocaleString()}`}
          icon={<CheckCircle2 className="w-5 h-5" />}
          subtitle="Direct deposited to employees"
          colorScheme="emerald"
        />
      </div>

      <DataTable
        data={state.expenseClaims}
        columns={columns}
        searchPlaceholder="Search expense claims by employee, category, claim #..."
        searchKey={(e) => `${e.claimNumber} ${e.employeeName} ${e.category} ${e.status}`}
        exportFileName="Nexora_Expense_Claims"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit New Expense Claim"
        description="Attach receipt details for company reimbursement."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Select
            label="Expense Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={[
              { label: 'Travel & Accommodation', value: 'Travel & Accommodation' },
              { label: 'Client Dinner & Entertainment', value: 'Client Dinner & Entertainment' },
              { label: 'Software Subscription & SaaS', value: 'Software Subscription & SaaS' },
              { label: 'Office Supplies', value: 'Office Supplies' },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Amount (PKR)"
              type="number"
              step="1"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            />
            <Input
              label="Transaction Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Business Justification
            </label>
            <textarea
              required
              rows={2}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2 text-sm bg-white dark:bg-slate-900 focus:outline-none"
              placeholder="State the commercial purpose of this expense..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <Input
            label="Attached Receipt File (PDF/Image)"
            value={form.receiptName}
            onChange={(e) => setForm({ ...form, receiptName: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Claim
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
