'use client';

import React, { useState } from 'react';
import { Contact, Plus, Mail, Phone, Coins, Building } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatCard } from '@/components/ui/StatCard';
import { Customer } from '@/lib/types';

export default function CustomersPage() {
  const { state, addCustomer, updateCustomer, deleteCustomer, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
    status: 'Active' as Customer['status'],
    assignedTo: 'Rachel Vance',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.email) return;

    addCustomer({
      name: form.name || 'Primary Contact',
      companyName: form.companyName,
      email: form.email,
      phone: form.phone || '+1 555-0100',
      address: form.address || 'Corporate HQ',
      status: form.status,
      totalRevenue: 0,
      outstandingBalance: 0,
      assignedTo: form.assignedTo,
    });

    logAudit('Created Customer', 'customers', `Added corporate client: ${form.companyName}`, currentUser.name, currentUser.id);
    setIsModalOpen(false);
  };

  const totalClientsRevenue = state.customers.reduce((acc, c) => acc + c.totalRevenue, 0);
  const totalOutstanding = state.customers.reduce((acc, c) => acc + c.outstandingBalance, 0);

  const columns: Column<Customer>[] = [
    {
      header: 'Company / Account',
      accessorKey: 'companyName',
      sortable: true,
      render: (c) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{c.companyName}</div>
          <div className="text-xs text-slate-400">Contact: {c.name}</div>
        </div>
      ),
    },
    {
      header: 'Email & Phone',
      accessorKey: 'email',
      render: (c) => (
        <div className="text-xs text-slate-600 dark:text-slate-300">
          <div>{c.email}</div>
          <div className="text-slate-400">{c.phone}</div>
        </div>
      ),
    },
    {
      header: 'Account Executive',
      accessorKey: 'assignedTo',
      sortable: true,
      render: (c) => <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{c.assignedTo}</span>,
    },
    {
      header: 'Lifetime Value',
      accessorKey: 'totalRevenue',
      sortable: true,
      render: (c) => (
        <span className="font-semibold font-mono text-slate-900 dark:text-slate-100">
          Rs. {c.totalRevenue.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Outstanding Balance',
      accessorKey: 'outstandingBalance',
      sortable: true,
      render: (c) => (
        <span className={`text-xs font-semibold font-mono ${c.outstandingBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
          Rs. {c.outstandingBalance.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      render: (c) => {
        const variants: Record<string, any> = {
          Active: 'success',
          Lead: 'indigo',
          Inactive: 'neutral',
        };
        return <Badge variant={variants[c.status]}>{c.status}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Contact className="w-6 h-6 text-indigo-600" /> Customer Relationship Management (CRM)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Accounts, customer lifetime values, communication records, and revenue tracking.
          </p>
        </div>

        {can('customers', 'create') && (
          <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Add Client Account
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Lifetime Client Value"
          value={`Rs. ${totalClientsRevenue.toLocaleString()}`}
          icon={<Coins className="w-5 h-5" />}
          trend={{ value: '+18.5% YoY', positive: true }}
          colorScheme="emerald"
        />
        <StatCard
          title="Outstanding Receivables"
          value={`Rs. ${totalOutstanding.toLocaleString()}`}
          icon={<Building className="w-5 h-5" />}
          subtitle="Total unpaid balance across accounts"
          colorScheme="rose"
        />
        <StatCard
          title="Active Client Accounts"
          value={state.customers.filter((c) => c.status === 'Active').length}
          icon={<Contact className="w-5 h-5" />}
          subtitle="Corporate accounts with active SLAs"
          colorScheme="indigo"
        />
      </div>

      <DataTable
        data={state.customers}
        columns={columns}
        searchPlaceholder="Search clients by company name, contact, email..."
        searchKey={(c) => `${c.companyName} ${c.name} ${c.email}`}
        exportFileName="Nexora_Customers_Accounts"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Customer Account"
        description="Register an enterprise customer profile in the CRM."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Company Name"
            required
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            placeholder="e.g. Acme Corporation"
          />
          <Input
            label="Primary Contact Person"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Jordan Miller"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Contact Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Contact Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <Input
            label="Billing & Office Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="e.g. 100 Main St, Chicago, IL"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Account Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as any })}
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Lead', value: 'Lead' },
                { label: 'Inactive', value: 'Inactive' },
              ]}
            />
            <Select
              label="Assigned Representative"
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              options={[
                { label: 'Rachel Vance', value: 'Rachel Vance' },
                { label: 'Alexander Vance', value: 'Alexander Vance' },
              ]}
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Customer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
