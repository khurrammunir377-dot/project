'use client';

import React, { useState } from 'react';
import { Package, Plus, AlertTriangle, ArrowUpDown, DollarSign, Layers } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatCard } from '@/components/ui/StatCard';
import { Product } from '@/lib/types';

export default function ProductsPage() {
  const { state, addProduct, updateProductStock, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [adjustProd, setAdjustProd] = useState<Product | null>(null);
  const [stockDelta, setStockDelta] = useState<number>(0);

  const [form, setForm] = useState({
    name: '',
    sku: '',
    barcode: '',
    category: 'Hardware & Infrastructure',
    costPrice: 1200,
    sellingPrice: 1950,
    stock: 25,
    minStockLevel: 10,
    warehouseName: 'East Coast Distribution Center',
    unit: 'Units',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.sku) return;

    addProduct({
      sku: form.sku,
      barcode: form.barcode || '793573000000',
      name: form.name,
      category: form.category,
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      stock: Number(form.stock),
      minStockLevel: Number(form.minStockLevel),
      warehouseId: 'wh-1',
      warehouseName: form.warehouseName,
      unit: form.unit,
    });

    logAudit('Created Product', 'inventory', `Added product: ${form.name} (SKU: ${form.sku})`, currentUser.name, currentUser.id);
    setIsAddOpen(false);
  };

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustProd || stockDelta === 0) return;

    updateProductStock(adjustProd.id, stockDelta);
    logAudit(
      'Adjusted Stock Level',
      'inventory',
      `Stock adjusted for ${adjustProd.name} by ${stockDelta > 0 ? `+${stockDelta}` : stockDelta} units`,
      currentUser.name,
      currentUser.id
    );

    setAdjustProd(null);
    setStockDelta(0);
  };

  const totalInventoryValue = state.products.reduce((acc, p) => acc + p.stock * p.costPrice, 0);
  const lowStockCount = state.products.filter((p) => p.stock <= p.minStockLevel).length;

  const columns: Column<Product>[] = [
    {
      header: 'Product Name',
      accessorKey: 'name',
      sortable: true,
      render: (p) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{p.name}</div>
          <div className="text-xs text-slate-400">Barcode: {p.barcode}</div>
        </div>
      ),
    },
    {
      header: 'SKU',
      accessorKey: 'sku',
      sortable: true,
      render: (p) => <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">{p.sku}</span>,
    },
    {
      header: 'Category',
      accessorKey: 'category',
      sortable: true,
      render: (p) => <span className="text-xs">{p.category}</span>,
    },
    {
      header: 'Warehouse',
      accessorKey: 'warehouseName',
      sortable: true,
      render: (p) => <span className="text-xs text-slate-500">{p.warehouseName}</span>,
    },
    {
      header: 'Cost / Price (PKR)',
      render: (p) => (
        <div className="text-xs">
          <span className="font-semibold text-slate-900 dark:text-slate-100">Rs. {p.sellingPrice.toLocaleString()}</span>
          <span className="text-slate-400 block">Cost: Rs. {p.costPrice.toLocaleString()}</span>
        </div>
      ),
    },
    {
      header: 'Stock Level',
      accessorKey: 'stock',
      sortable: true,
      render: (p) => {
        const isLow = p.stock <= p.minStockLevel;
        return (
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${isLow ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'}`}>
              {p.stock} {p.unit}
            </span>
            {isLow && (
              <Badge variant="danger" size="sm">
                Low (&lt;{p.minStockLevel})
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      header: 'Adjust',
      render: (p) => (
        <div onClick={(e) => e.stopPropagation()}>
          {can('inventory', 'edit') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAdjustProd(p);
                setStockDelta(0);
              }}
              icon={<ArrowUpDown className="w-3.5 h-3.5" />}
            >
              Adjust
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
            <Package className="w-6 h-6 text-indigo-600" /> Products & Inventory Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            SKUs, multi-warehouse stock levels, reorder thresholds, and valuation tracking.
          </p>
        </div>

        {can('inventory', 'create') && (
          <Button onClick={() => setIsAddOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Add Product
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Valuation"
          value={`Rs. ${(totalInventoryValue / 1000).toFixed(1)}k`}
          icon={<DollarSign className="w-5 h-5" />}
          subtitle="At current cost price"
          colorScheme="indigo"
        />
        <StatCard
          title="Catalog SKUs"
          value={state.products.length}
          icon={<Layers className="w-5 h-5" />}
          subtitle="Managed product variations"
          colorScheme="emerald"
        />
        <StatCard
          title="Low Stock Warning"
          value={lowStockCount}
          icon={<AlertTriangle className="w-5 h-5" />}
          subtitle="Items requiring replenishment"
          colorScheme="rose"
        />
      </div>

      <DataTable
        data={state.products}
        columns={columns}
        searchPlaceholder="Search products by SKU, name, warehouse..."
        searchKey={(p) => `${p.name} ${p.sku} ${p.category} ${p.warehouseName}`}
        exportFileName="Nexora_Inventory_Catalog"
      />

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Catalog Product"
        description="Register a new item with SKU, unit price, and warehouse stock."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Product Title"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Dell PowerEdge Server"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="SKU Code"
              required
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              placeholder="e.g. HW-SRV-099"
            />
            <Input
              label="Barcode / EAN"
              value={form.barcode}
              onChange={(e) => setForm({ ...form, barcode: e.target.value })}
              placeholder="e.g. 793573100999"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              options={[
                { label: 'Hardware & Infrastructure', value: 'Hardware & Infrastructure' },
                { label: 'Software & Licenses', value: 'Software & Licenses' },
                { label: 'Workstations', value: 'Workstations' },
                { label: 'Peripherals', value: 'Peripherals' },
              ]}
            />
            <Select
              label="Primary Warehouse"
              value={form.warehouseName}
              onChange={(e) => setForm({ ...form, warehouseName: e.target.value })}
              options={state.warehouses.map((w) => ({ label: w.name, value: w.name }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Cost Price (PKR)"
              type="number"
              value={form.costPrice}
              onChange={(e) => setForm({ ...form, costPrice: Number(e.target.value) })}
            />
            <Input
              label="Selling Price (PKR)"
              type="number"
              value={form.sellingPrice}
              onChange={(e) => setForm({ ...form, sellingPrice: Number(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Initial Stock"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            />
            <Input
              label="Min Alert Level"
              type="number"
              value={form.minStockLevel}
              onChange={(e) => setForm({ ...form, minStockLevel: Number(e.target.value) })}
            />
            <Input
              label="Unit"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              placeholder="Units / Licenses"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Product
            </Button>
          </div>
        </form>
      </Modal>

      {/* Adjust Stock Modal */}
      {adjustProd && (
        <Modal
          isOpen={!!adjustProd}
          onClose={() => setAdjustProd(null)}
          title={`Adjust Inventory - ${adjustProd.name}`}
          description={`Current Stock: ${adjustProd.stock} ${adjustProd.unit} • Warehouse: ${adjustProd.warehouseName}`}
        >
          <form onSubmit={handleAdjustStock} className="space-y-4">
            <Input
              label="Quantity Delta (+ for received, - for damaged/written off)"
              type="number"
              required
              value={stockDelta}
              onChange={(e) => setStockDelta(Number(e.target.value))}
              placeholder="e.g. +10 or -5"
            />
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-500">
              New Projected Stock: <span className="font-bold text-slate-900 dark:text-slate-100">{Math.max(0, adjustProd.stock + stockDelta)}</span> {adjustProd.unit}
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => setAdjustProd(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Apply Stock Adjustment
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
