'use client';

import React, { useState } from 'react';
import {
  Building2,
  Plus,
  MapPin,
  User,
  Layers,
  ArrowRight,
  ArrowLeftRight,
  Truck,
  Phone,
  Edit,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Package,
} from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Warehouse } from '@/lib/types';

export default function WarehousesPage() {
  const { state, addWarehouse, updateWarehouse, transferWarehouseStock, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [editingWh, setEditingWh] = useState<Warehouse | null>(null);

  // Add Warehouse Form
  const [newWh, setNewWh] = useState({
    name: '',
    code: '',
    location: 'Karachi, Sindh',
    manager: 'Tariq Mahmood',
    capacity: 25000,
    currentStockUnits: 8000,
    type: 'Bonded Port Godown',
    phone: '+92 21 34567890',
    status: 'Operational' as const,
  });

  // Transfer Form State
  const [transferForm, setTransferForm] = useState({
    sourceId: state.warehouses[0]?.id || '',
    destId: state.warehouses[1]?.id || '',
    productName: state.products[0]?.name || 'Industrial Packaging Units',
    units: 500,
    transitNote: 'Inter-branch stock rebalancing via National Highway Logistics',
    trackingNumber: `TRK-PK-${Math.floor(1000 + Math.random() * 9000)}`,
  });

  const totalCapacity = state.warehouses.reduce((acc, w) => acc + w.capacity, 0);
  const totalOccupied = state.warehouses.reduce((acc, w) => acc + w.currentStockUnits, 0);

  const handleCreateWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWh.name) return;

    const code = newWh.code || `WH-PK-${Math.floor(10 + Math.random() * 90)}`;
    addWarehouse({
      name: newWh.name,
      code,
      location: newWh.location,
      manager: newWh.manager,
      capacity: Number(newWh.capacity),
      currentStockUnits: Number(newWh.currentStockUnits),
      status: newWh.status,
      type: newWh.type,
      phone: newWh.phone,
    });

    logAudit(
      'Created Warehouse Hub',
      'inventory',
      `Registered new logistics facility: ${newWh.name} (${code}) in ${newWh.location}`,
      currentUser.name,
      currentUser.id
    );

    setIsAddOpen(false);
    setNewWh({
      name: '',
      code: '',
      location: 'Karachi, Sindh',
      manager: 'Tariq Mahmood',
      capacity: 25000,
      currentStockUnits: 8000,
      type: 'Bonded Port Godown',
      phone: '+92 21 34567890',
      status: 'Operational',
    });
  };

  const handleUpdateWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWh) return;

    updateWarehouse(editingWh.id, {
      name: editingWh.name,
      location: editingWh.location,
      manager: editingWh.manager,
      capacity: Number(editingWh.capacity),
      currentStockUnits: Number(editingWh.currentStockUnits),
      status: editingWh.status,
    });

    logAudit(
      'Updated Warehouse',
      'inventory',
      `Updated logistics facility: ${editingWh.name} (${editingWh.code})`,
      currentUser.name,
      currentUser.id
    );

    setEditingWh(null);
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (transferForm.sourceId === transferForm.destId) {
      alert('Source and destination warehouses cannot be the same.');
      return;
    }

    const sourceWh = state.warehouses.find((w) => w.id === transferForm.sourceId);
    const destWh = state.warehouses.find((w) => w.id === transferForm.destId);

    if (!sourceWh || !destWh) return;

    if (sourceWh.currentStockUnits < Number(transferForm.units)) {
      alert(`Source warehouse only has ${sourceWh.currentStockUnits.toLocaleString()} units available.`);
      return;
    }

    transferWarehouseStock(
      transferForm.sourceId,
      transferForm.destId,
      Number(transferForm.units)
    );

    logAudit(
      'Inter-Warehouse Stock Routed',
      'inventory',
      `Routed ${transferForm.units} units of ${transferForm.productName} from ${sourceWh.name} to ${destWh.name} (Ref: ${transferForm.trackingNumber})`,
      currentUser.name,
      currentUser.id
    );

    setIsTransferOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600" /> Warehouses &amp; Logistics Hubs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Multi-facility godown management, volumetric capacity utilization, and inter-warehouse stock transfer routing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {can('inventory', 'create') && (
            <>
              <Button
                variant="outline"
                onClick={() => setIsTransferOpen(true)}
                icon={<ArrowLeftRight className="w-4 h-4 text-indigo-500" />}
              >
                Stock Transfer Routing
              </Button>
              <Button onClick={() => setIsAddOpen(true)} icon={<Plus className="w-4 h-4" />}>
                Add Logistics Hub
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Godowns &amp; Hubs"
          value={state.warehouses.length}
          icon={<Building2 className="w-5 h-5" />}
          subtitle="Karachi Port, Lahore Dry Port, Islamabad &amp; FSD"
          colorScheme="indigo"
        />
        <StatCard
          title="Total Storage Capacity"
          value={`${totalCapacity.toLocaleString()} Units`}
          icon={<Layers className="w-5 h-5" />}
          subtitle="Combined cubic inventory capacity"
          colorScheme="emerald"
        />
        <StatCard
          title="Average Space Utilization"
          value={`${((totalOccupied / (totalCapacity || 1)) * 100).toFixed(1)}%`}
          icon={<Layers className="w-5 h-5" />}
          subtitle={`${totalOccupied.toLocaleString()} units stored across Pakistan`}
          colorScheme="amber"
        />
      </div>

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.warehouses.map((wh) => {
          const util = Number(((wh.currentStockUnits / (wh.capacity || 1)) * 100).toFixed(1));
          const isHigh = util > 85;

          return (
            <div
              key={wh.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-indigo-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="indigo">{wh.code}</Badge>
                      <Badge variant={wh.status === 'Operational' ? 'success' : wh.status === 'Maintenance' ? 'warning' : 'neutral'}>
                        {wh.status || 'Operational'}
                      </Badge>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2">
                      {wh.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{wh.location}</span>
                    </div>
                  </div>

                  {can('inventory', 'edit') && (
                    <button
                      onClick={() => setEditingWh(wh)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Manage / Edit Hub"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1.5 pt-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Utilization Rate</span>
                    <span className={`font-bold font-mono ${isHigh ? 'text-amber-600' : 'text-slate-800 dark:text-slate-200'}`}>
                      {util}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        isHigh ? 'bg-amber-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${Math.min(100, util)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>Occupied: {wh.currentStockUnits.toLocaleString()}</span>
                    <span>Max: {wh.capacity.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Footer Details */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {wh.manager}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setTransferForm({
                        ...transferForm,
                        sourceId: wh.id,
                        destId: state.warehouses.find((x) => x.id !== wh.id)?.id || '',
                      });
                      setIsTransferOpen(true);
                    }}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Route Stock</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 1. ADD NEW LOGISTICS HUB MODAL */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Logistics Hub / Godown"
        description="Register a new storage depot, fulfillment facility, or dry port godown."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateWarehouse} className="space-y-4">
          <Input
            label="Facility / Godown Name"
            required
            value={newWh.name}
            onChange={(e) => setNewWh({ ...newWh, name: e.target.value })}
            placeholder="e.g. Faisalabad Textile Hub"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Facility Code"
              value={newWh.code}
              onChange={(e) => setNewWh({ ...newWh, code: e.target.value })}
              placeholder="e.g. WH-FSD-04"
            />
            <Input
              label="Location / City"
              value={newWh.location}
              onChange={(e) => setNewWh({ ...newWh, location: e.target.value })}
              placeholder="e.g. Faisalabad, Punjab"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Total Capacity (Units)"
              type="number"
              value={newWh.capacity}
              onChange={(e) => setNewWh({ ...newWh, capacity: Number(e.target.value) })}
            />
            <Input
              label="Initial Stock Units"
              type="number"
              value={newWh.currentStockUnits}
              onChange={(e) => setNewWh({ ...newWh, currentStockUnits: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Station Manager"
              value={newWh.manager}
              onChange={(e) => setNewWh({ ...newWh, manager: e.target.value })}
              placeholder="e.g. Tariq Mahmood"
            />
            <Select
              label="Operational Status"
              value={newWh.status}
              onChange={(e) => setNewWh({ ...newWh, status: e.target.value as any })}
              options={[
                { label: 'Operational', value: 'Operational' },
                { label: 'Maintenance', value: 'Maintenance' },
                { label: 'Full', value: 'Full' },
              ]}
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Facility
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. INTER-WAREHOUSE STOCK TRANSFER MODAL */}
      <Modal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        title="Inter-Warehouse Stock Routing &amp; Transfer"
        description="Dispatch inventory between distribution godowns with transit tracking."
        maxWidth="lg"
      >
        <form onSubmit={handleExecuteTransfer} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Source Warehouse (Dispatch)"
              value={transferForm.sourceId}
              onChange={(e) => setTransferForm({ ...transferForm, sourceId: e.target.value })}
              options={state.warehouses.map((w) => ({
                label: `${w.name} (${w.currentStockUnits.toLocaleString()} units avail)`,
                value: w.id,
              }))}
            />
            <Select
              label="Destination Warehouse (Receiving)"
              value={transferForm.destId}
              onChange={(e) => setTransferForm({ ...transferForm, destId: e.target.value })}
              options={state.warehouses.map((w) => ({
                label: `${w.name} (Cap: ${w.capacity.toLocaleString()})`,
                value: w.id,
              }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Product / Item SKU"
              value={transferForm.productName}
              onChange={(e) => setTransferForm({ ...transferForm, productName: e.target.value })}
              options={state.products.map((p) => ({
                label: `${p.name} (${p.sku})`,
                value: p.name,
              }))}
            />
            <Input
              label="Transfer Quantity (Units)"
              type="number"
              value={transferForm.units}
              onChange={(e) => setTransferForm({ ...transferForm, units: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Logistics Dispatch Note"
            value={transferForm.transitNote}
            onChange={(e) => setTransferForm({ ...transferForm, transitNote: e.target.value })}
            placeholder="e.g. National Logistics Cell (NLC) Container #4912"
          />

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <span className="text-slate-500">Auto Transit Consignment ID:</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {transferForm.trackingNumber}
            </span>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsTransferOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<Truck className="w-4 h-4" />}>
              Dispatch Consignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* 3. EDIT WAREHOUSE MODAL */}
      {editingWh && (
        <Modal
          isOpen={!!editingWh}
          onClose={() => setEditingWh(null)}
          title={`Edit Hub: ${editingWh.name}`}
          description={`Update parameters for ${editingWh.code}`}
          maxWidth="md"
        >
          <form onSubmit={handleUpdateWarehouse} className="space-y-4">
            <Input
              label="Facility Name"
              value={editingWh.name}
              onChange={(e) => setEditingWh({ ...editingWh, name: e.target.value })}
            />
            <Input
              label="Location"
              value={editingWh.location}
              onChange={(e) => setEditingWh({ ...editingWh, location: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Max Storage Capacity"
                type="number"
                value={editingWh.capacity}
                onChange={(e) => setEditingWh({ ...editingWh, capacity: Number(e.target.value) })}
              />
              <Input
                label="Current Stock Units"
                type="number"
                value={editingWh.currentStockUnits}
                onChange={(e) => setEditingWh({ ...editingWh, currentStockUnits: Number(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Manager"
                value={editingWh.manager}
                onChange={(e) => setEditingWh({ ...editingWh, manager: e.target.value })}
              />
              <Select
                label="Status"
                value={editingWh.status || 'Operational'}
                onChange={(e) => setEditingWh({ ...editingWh, status: e.target.value as any })}
                options={[
                  { label: 'Operational', value: 'Operational' },
                  { label: 'Maintenance', value: 'Maintenance' },
                  { label: 'Full', value: 'Full' },
                ]}
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => setEditingWh(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
