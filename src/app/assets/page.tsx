'use client';

import React, { useState } from 'react';
import { Monitor, Plus, Coins, Layers } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatCard } from '@/components/ui/StatCard';
import { Asset } from '@/lib/types';

export default function AssetsPage() {
  const { state, addAsset, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    assetTag: '',
    category: 'Computers' as Asset['category'],
    serialNumber: '',
    cost: 250000,
    assignedTo: 'Saad Farooq',
    department: 'Software Engineering & IT',
    status: 'In Use' as Asset['status'],
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;

    addAsset({
      assetTag: form.assetTag || `AST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: form.name,
      category: form.category,
      serialNumber: form.serialNumber || 'SN-991283',
      purchaseDate: new Date().toISOString().split('T')[0],
      cost: Number(form.cost),
      assignedTo: form.assignedTo,
      department: form.department,
      status: form.status,
    });

    logAudit('Registered Asset', 'assets', `Added asset: ${form.name} (Rs. ${form.cost.toLocaleString()})`, currentUser.name, currentUser.id);
    setIsModalOpen(false);
  };

  const totalAssetValue = state.assets.reduce((acc, a) => acc + a.cost, 0);

  const columns: Column<Asset>[] = [
    {
      header: 'Asset Tag',
      accessorKey: 'assetTag',
      sortable: true,
      render: (a) => (
        <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          {a.assetTag}
        </span>
      ),
    },
    {
      header: 'Device / Equipment',
      accessorKey: 'name',
      sortable: true,
      render: (a) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{a.name}</div>
          <div className="text-xs text-slate-400">SN: {a.serialNumber}</div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category',
      sortable: true,
      render: (a) => <span className="text-xs">{a.category}</span>,
    },
    {
      header: 'Assigned User',
      accessorKey: 'assignedTo',
      sortable: true,
      render: (a) => (
        <div>
          <div className="text-xs font-medium text-slate-800 dark:text-slate-200">{a.assignedTo}</div>
          <div className="text-[10px] text-slate-400">{a.department}</div>
        </div>
      ),
    },
    {
      header: 'Acquisition Cost',
      accessorKey: 'cost',
      sortable: true,
      render: (a) => (
        <span className="font-semibold font-mono text-emerald-600 dark:text-emerald-400">
          Rs. {a.cost.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      render: (a) => {
        const variants: Record<string, any> = {
          'In Use': 'success',
          Available: 'indigo',
          Maintenance: 'warning',
          Retired: 'neutral',
        };
        return <Badge variant={variants[a.status]}>{a.status}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Monitor className="w-6 h-6 text-indigo-600" /> Company Asset Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking laptops, vehicles, software licenses, serial numbers, and equipment allocation.
          </p>
        </div>

        {can('assets', 'create') && (
          <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Register Asset
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Fixed Assets Value"
          value={`Rs. ${totalAssetValue.toLocaleString()}`}
          icon={<Coins className="w-5 h-5" />}
          subtitle="Cumulative purchase expenditure"
          colorScheme="indigo"
        />
        <StatCard
          title="Assigned Devices"
          value={state.assets.filter((a) => a.status === 'In Use').length}
          icon={<Monitor className="w-5 h-5" />}
          subtitle="Actively assigned to employees"
          colorScheme="emerald"
        />
        <StatCard
          title="In Maintenance"
          value={state.assets.filter((a) => a.status === 'Maintenance').length}
          icon={<Layers className="w-5 h-5" />}
          subtitle="Pending repair or overhaul"
          colorScheme="amber"
        />
      </div>

      <DataTable
        data={state.assets}
        columns={columns}
        searchPlaceholder="Search assets by tag, device name, assigned user..."
        searchKey={(a) => `${a.assetTag} ${a.name} ${a.assignedTo} ${a.serialNumber}`}
        exportFileName="Nexora_Asset_Register"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Company Asset"
        description="Add IT hardware or office property into the asset management register."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Device / Asset Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. MacBook Pro 16 M3 Max"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Asset Tag Code"
              value={form.assetTag}
              onChange={(e) => setForm({ ...form, assetTag: e.target.value })}
              placeholder="AST-NEX-099"
            />
            <Input
              label="Serial Number"
              value={form.serialNumber}
              onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
              placeholder="e.g. C02F9102X9"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as any })}
              options={[
                { label: 'Computers', value: 'Computers' },
                { label: 'Vehicles', value: 'Vehicles' },
                { label: 'Equipment', value: 'Equipment' },
                { label: 'Furniture', value: 'Furniture' },
                { label: 'Software Licenses', value: 'Software Licenses' },
              ]}
            />
            <Input
              label="Purchase Cost (PKR)"
              type="number"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Assigned Staff Member"
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              options={state.employees.map((e) => ({
                label: `${e.firstName} ${e.lastName}`,
                value: `${e.firstName} ${e.lastName}`,
              }))}
            />
            <Select
              label="Asset Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as any })}
              options={[
                { label: 'In Use', value: 'In Use' },
                { label: 'Available', value: 'Available' },
                { label: 'Maintenance', value: 'Maintenance' },
                { label: 'Retired', value: 'Retired' },
              ]}
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Asset
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
