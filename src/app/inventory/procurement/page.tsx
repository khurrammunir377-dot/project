'use client';

import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Check,
  PackageCheck,
  Download,
  Trash2,
  Building2,
  CreditCard,
  FileCheck,
} from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatCard } from '@/components/ui/StatCard';
import { PurchaseOrder, PurchaseOrderItem } from '@/lib/types';
import { generatePurchaseOrderPDF } from '@/lib/export';

export default function ProcurementPage() {
  const { state, addPurchaseOrder, updatePOStatus, updateProductStock, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state with multi-item line editor
  const [supplierName, setSupplierName] = useState('Pak Suzuki Motors Parts Div');
  const [expectedDate, setExpectedDate] = useState('2026-11-05');
  const [deliveryAddress, setDeliveryAddress] = useState('SITE Industrial Area Godown, Karachi');
  const [paymentTerms, setPaymentTerms] = useState('1Link Raast 30 Days Credit');
  const [notes, setNotes] = useState('Deliver with original Sales Tax Invoice and Delivery Challan');

  const [items, setItems] = useState<PurchaseOrderItem[]>([
    {
      description: 'Industrial Heavy Duty Storage Pallets',
      quantity: 10,
      unitPrice: 15000,
      taxPercent: 17,
      taxAmount: 25500,
      total: 175500,
    },
    {
      description: 'Barcode Scanner Handheld Terminals (Honeywell)',
      quantity: 4,
      unitPrice: 32000,
      taxPercent: 17,
      taxAmount: 21760,
      total: 149760,
    },
  ]);

  // Handle adding line item
  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxPercent: 17,
        taxAmount: 0,
        total: 0,
      },
    ]);
  };

  // Handle updating line item
  const handleUpdateItem = (
    index: number,
    field: keyof PurchaseOrderItem,
    value: string | number
  ) => {
    setItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };

      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      const taxRate = Number(item.taxPercent) || 0;

      const sub = qty * price;
      const taxAmt = Math.round((sub * taxRate) / 100);
      item.taxAmount = taxAmt;
      item.total = sub + taxAmt;

      updated[index] = item;
      return updated;
    });
  };

  // Handle removing line item
  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((_, idx) => idx !== index));
    }
  };

  // Totals
  const subtotal = items.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0);
  const totalTax = items.reduce((acc, it) => acc + it.taxAmount, 0);
  const grandTotal = subtotal + totalTax;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = state.suppliers.find((s) => s.name === supplierName) || state.suppliers[0];

    addPurchaseOrder({
      poNumber: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      supplierId: sup.id,
      supplierName: sup.name,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDate,
      items,
      subtotal,
      tax: totalTax,
      totalAmount: grandTotal,
      deliveryAddress,
      paymentTerms,
      notes,
      status: 'Submitted',
    });

    logAudit(
      'Issued Purchase Order',
      'procurement',
      `Created PO for ${sup.name} with ${items.length} line items (Rs. ${grandTotal.toLocaleString()})`,
      currentUser.name,
      currentUser.id
    );
    setIsModalOpen(false);
  };

  const handleReceiveGoods = (po: PurchaseOrder) => {
    updatePOStatus(po.id, 'Goods Received');
    if (state.products.length > 0) {
      updateProductStock(state.products[0].id, 10);
    }
    logAudit(
      'Received Purchase Order Goods',
      'procurement',
      `Goods received for PO ${po.poNumber}. Stock incremented.`,
      currentUser.name,
      currentUser.id
    );
  };

  const totalProcurementSpend = state.purchaseOrders.reduce(
    (acc, p) => acc + (p.totalAmount || 0),
    0
  );

  const columns: Column<PurchaseOrder>[] = [
    {
      header: 'PO Number',
      accessorKey: 'poNumber',
      sortable: true,
      render: (po) => (
        <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          {po.poNumber}
        </span>
      ),
    },
    {
      header: 'Vendor / Supplier',
      accessorKey: 'supplierName',
      sortable: true,
      render: (po) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-100 block">
            {po.supplierName}
          </span>
          <span className="text-[10px] text-slate-400">
            {po.items?.length || 1} line item(s)
          </span>
        </div>
      ),
    },
    {
      header: 'Order Date',
      accessorKey: 'orderDate',
      sortable: true,
    },
    {
      header: 'Expected Delivery',
      accessorKey: 'expectedDate',
      sortable: true,
    },
    {
      header: 'Total Value (PKR)',
      accessorKey: 'totalAmount',
      sortable: true,
      render: (po) => (
        <span className="font-bold text-slate-900 dark:text-slate-100">
          Rs. {po.totalAmount.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      render: (po) => {
        const variants: Record<string, any> = {
          Approved: 'info',
          'Goods Received': 'success',
          Submitted: 'warning',
          Paid: 'purple',
          Draft: 'neutral',
        };
        return <Badge variant={variants[po.status]}>{po.status}</Badge>;
      },
    },
    {
      header: 'Actions',
      render: (po) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => generatePurchaseOrderPDF(po, state.settings)}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            PDF
          </Button>

          {po.status === 'Submitted' && can('procurement', 'approve') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updatePOStatus(po.id, 'Approved')}
              icon={<Check className="w-3.5 h-3.5" />}
            >
              Approve
            </Button>
          )}

          {po.status === 'Approved' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleReceiveGoods(po)}
              icon={<PackageCheck className="w-3.5 h-3.5 text-emerald-600" />}
            >
              Receive
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
            <ShoppingCart className="w-6 h-6 text-indigo-600" /> Procurement &amp; Purchase Orders
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Requisition builder with multi-item line pricing, FBR GST calculations, and official corporate letterhead PDFs.
          </p>
        </div>

        {can('procurement', 'create') && (
          <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Create Purchase Order
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Procurement Commitment"
          value={`Rs. ${(totalProcurementSpend / 1000).toFixed(1)}k`}
          icon={<CreditCard className="w-5 h-5" />}
          subtitle="Total vendor obligations (PKR)"
          colorScheme="indigo"
        />
        <StatCard
          title="Approved POs"
          value={state.purchaseOrders.filter((p) => p.status === 'Approved').length.toString()}
          icon={<Check className="w-5 h-5" />}
          subtitle="Pending delivery from vendors"
          colorScheme="sky"
        />
        <StatCard
          title="Goods Received"
          value={state.purchaseOrders.filter((p) => p.status === 'Goods Received').length.toString()}
          icon={<PackageCheck className="w-5 h-5" />}
          subtitle="Restocked into multi-godowns"
          colorScheme="emerald"
        />
      </div>

      <DataTable
        data={state.purchaseOrders}
        columns={columns}
        searchPlaceholder="Search POs by number, supplier name..."
        searchKey={(p) => `${p.poNumber} ${p.supplierName} ${p.status}`}
        exportFileName="Nexora_Procurement_POs"
      />

      {/* ENHANCED PURCHASE ORDER BUILDER MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Detailed Purchase Order (PO)"
        description="Specify multiple line items with unit price and sales tax (GST) breakdown."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Approved Vendor / Supplier"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              options={state.suppliers.map((s) => ({ label: s.name, value: s.name }))}
            />

            <Input
              label="Expected Delivery Date"
              type="date"
              required
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Destination Godown Address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="e.g. Central Karachi Godown (SITE Area)"
            />

            <Input
              label="Settlement / Payment Terms"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              placeholder="e.g. 1Link 30 Days Net"
            />
          </div>

          {/* MULTI-ITEM LINE EDITOR */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Order Line Items (Goods / Materials)
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Another Item
              </button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {items.map((it, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-500">Item #{idx + 1}</span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-rose-500 hover:text-rose-600 text-xs p-1"
                        title="Remove Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Item / Material description (e.g. Industrial Pallets)"
                    value={it.description}
                    onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
                  />

                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Qty</span>
                      <input
                        type="number"
                        min={1}
                        required
                        value={it.quantity}
                        onChange={(e) => handleUpdateItem(idx, 'quantity', Number(e.target.value))}
                        className="w-full px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Unit Price (PKR)</span>
                      <input
                        type="number"
                        min={0}
                        required
                        value={it.unitPrice}
                        onChange={(e) => handleUpdateItem(idx, 'unitPrice', Number(e.target.value))}
                        className="w-full px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">GST / Tax %</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={it.taxPercent}
                        onChange={(e) =>
                          handleUpdateItem(idx, 'taxPercent', Number(e.target.value))
                        }
                        className="w-full px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Total (PKR)</span>
                      <div className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100 text-right">
                        Rs. {it.total.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CALCULATED FINANCIAL SUMMARY BANNER */}
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Items Subtotal:</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Total Sales Tax (GST):</span>
              <span>Rs. {totalTax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-slate-100 pt-1 border-t border-slate-200 dark:border-slate-800">
              <span>Net PO Grand Total:</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                Rs. {grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Issue Official PO
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
