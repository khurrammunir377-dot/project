'use client';

import React, { useState } from 'react';
import { FileText, Plus, Check, ArrowRight, Download, Trash2, ShoppingBag } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Quotation } from '@/lib/types';
import { generateQuotationPDF } from '@/lib/export';

interface QuoteLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function QuotationsPage() {
  const { state, addQuotation, updateQuotationStatus, addInvoice, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [customerName, setCustomerName] = useState('Systems Limited Pakistan');
  const [expiryDate, setExpiryDate] = useState('2026-11-15');
  const [taxPercent, setTaxPercent] = useState<number>(18);
  const [discount, setDiscount] = useState<number>(15000);
  const [items, setItems] = useState<QuoteLineItem[]>([
    { description: 'Enterprise ERP Implementation & Cloud Onboarding', quantity: 1, unitPrice: 350000, total: 350000 },
    { description: 'Annual Priority SLA & 24/7 Production Support', quantity: 1, unitPrice: 85000, total: 85000 },
  ]);

  const handleAddItem = () => {
    setItems((prev) => [...prev, { description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: 'description' | 'quantity' | 'unitPrice',
    val: string | number
  ) => {
    setItems((prev) => {
      const next = [...prev];
      const updated = { ...next[index], [field]: val };
      const q = Number(updated.quantity) || 0;
      const p = Number(updated.unitPrice) || 0;
      updated.total = q * p;
      next[index] = updated;
      return next;
    });
  };

  const handleSelectCatalogProduct = (index: number, prodId: string) => {
    if (!prodId) return;
    const prod = state.products.find((p) => p.id === prodId);
    if (!prod) return;
    setItems((prev) => {
      const next = [...prev];
      const q = Number(next[index].quantity) || 1;
      next[index] = {
        description: prod.name,
        quantity: q,
        unitPrice: prod.sellingPrice,
        total: q * prod.sellingPrice,
      };
      return next;
    });
  };

  const subtotal = items.reduce((sum, it) => sum + (Number(it.quantity) * Number(it.unitPrice)), 0);
  const tax = Math.round((subtotal * (Number(taxPercent) || 0)) / 100);
  const grandTotal = Math.max(0, subtotal + tax - (Number(discount) || 0));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = state.customers.find((c) => c.companyName === customerName) || state.customers[0];

    const validItems = items
      .filter((it) => it.description.trim().length > 0)
      .map((it) => ({
        description: it.description,
        quantity: Number(it.quantity) || 1,
        unitPrice: Number(it.unitPrice) || 0,
        total: (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0),
      }));

    if (validItems.length === 0) {
      alert('Please add at least one line item with a description.');
      return;
    }

    addQuotation({
      quotationNumber: `QT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: cust.id,
      customerName: cust.companyName,
      date: new Date().toISOString().split('T')[0],
      expiryDate: expiryDate,
      items: validItems,
      subtotal,
      tax,
      discount: Number(discount) || 0,
      total: grandTotal,
      status: 'Sent',
    });

    logAudit(
      'Issued Quotation',
      'sales',
      `Sent quotation with ${validItems.length} items for ${cust.companyName} (Rs. ${grandTotal.toLocaleString()})`,
      currentUser.name,
      currentUser.id
    );
    setIsModalOpen(false);
  };

  const handleConvertToInvoice = (q: Quotation) => {
    addInvoice({
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: q.customerId,
      customerName: q.customerName,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: q.expiryDate,
      items: q.items,
      subtotal: q.subtotal,
      tax: q.tax,
      discount: q.discount,
      total: q.total,
      amountPaid: 0,
      balanceDue: q.total,
      status: 'Sent',
    });

    updateQuotationStatus(q.id, 'Converted');
    logAudit('Converted Quotation to Invoice', 'sales', `Quotation ${q.quotationNumber} converted to active invoice`, currentUser.name, currentUser.id);
  };

  const columns: Column<Quotation>[] = [
    {
      header: 'Quote Ref',
      accessorKey: 'quotationNumber',
      sortable: true,
      render: (q) => (
        <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          {q.quotationNumber}
        </span>
      ),
    },
    {
      header: 'Customer Account',
      accessorKey: 'customerName',
      sortable: true,
      render: (q) => <span className="font-semibold text-slate-900 dark:text-slate-100">{q.customerName}</span>,
    },
    {
      header: 'Issue Date',
      accessorKey: 'date',
      sortable: true,
    },
    {
      header: 'Valid Till',
      accessorKey: 'expiryDate',
      sortable: true,
    },
    {
      header: 'Total Value',
      accessorKey: 'total',
      sortable: true,
      render: (q) => (
        <span className="font-bold text-slate-900 dark:text-slate-100">
          Rs. {q.total.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      render: (q) => {
        const variants: Record<string, any> = {
          Accepted: 'success',
          Sent: 'info',
          Draft: 'neutral',
          Declined: 'danger',
          Converted: 'purple',
        };
        return <Badge variant={variants[q.status]}>{q.status}</Badge>;
      },
    },
    {
      header: 'Actions',
      render: (q) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateQuotationPDF(q, state.settings)}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            PDF
          </Button>

          {q.status !== 'Converted' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleConvertToInvoice(q)}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Convert to Inv
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
            <FileText className="w-6 h-6 text-indigo-600" /> Quotations &amp; Proposals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official commercial price proposals with Pakistani letterhead and 1-click invoice conversion.
          </p>
        </div>

        {can('sales', 'create') && (
          <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Create Quotation
          </Button>
        )}
      </div>

      <DataTable
        data={state.quotations}
        columns={columns}
        searchPlaceholder="Search quotations by quote ref, client name..."
        searchKey={(q) => `${q.quotationNumber} ${q.customerName}`}
        exportFileName="Nexora_Quotations_List"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Commercial Quotation"
        description="Draft a formal corporate proposal with Pakistan FBR compliant terms & multiple line items."
        maxWidth="4xl"
      >
        <form onSubmit={handleCreate} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Client Corporate Account"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              options={state.customers.map((c) => ({ label: c.companyName, value: c.companyName }))}
            />
            <Input
              label="Proposal Expiry Date"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>

          {/* Multiple Line Items Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" /> Deliverables &amp; Billable Line Items
                </h4>
                <p className="text-xs text-slate-500">
                  Add multiple products or custom deliverables. Line totals update dynamically in PKR.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddItem}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Item
              </Button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-center">#</th>
                      <th className="py-2.5 px-3 min-w-[260px]">Deliverable Particulars / Product Preset</th>
                      <th className="py-2.5 px-3 w-24 text-center">Qty</th>
                      <th className="py-2.5 px-3 w-36 text-right">Unit Price (PKR)</th>
                      <th className="py-2.5 px-3 w-36 text-right">Line Total (PKR)</th>
                      <th className="py-2.5 px-3 w-12 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-2 px-3 text-center text-slate-400 font-mono font-medium">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 space-y-1.5">
                          <input
                            type="text"
                            required
                            placeholder="e.g. ERP Implementation & Customization"
                            value={item.description}
                            onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                          {state.products.length > 0 && (
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                              <span>Preset:</span>
                              <select
                                className="bg-transparent text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none cursor-pointer max-w-[200px] truncate"
                                onChange={(e) => {
                                  handleSelectCatalogProduct(idx, e.target.value);
                                  e.target.value = '';
                                }}
                                defaultValue=""
                              >
                                <option value="" disabled>Select from catalog...</option>
                                {state.products.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.name} (Rs. {p.sellingPrice.toLocaleString()})
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            min={1}
                            required
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                            className="w-20 mx-auto text-center px-2 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </td>
                        <td className="py-2 px-3 text-right">
                          <input
                            type="number"
                            min={0}
                            required
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                            className="w-28 ml-auto text-right px-2 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </td>
                        <td className="py-2 px-3 text-right font-semibold font-mono text-slate-800 dark:text-slate-200">
                          Rs. {(Number(item.quantity) * Number(item.unitPrice)).toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            type="button"
                            title="Remove line item"
                            disabled={items.length <= 1}
                            onClick={() => handleRemoveItem(idx)}
                            className="text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pricing Adjustments & Grand Total Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Tax &amp; Commercial Terms
              </h5>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Sales Tax (GST %)"
                  type="number"
                  min={0}
                  max={30}
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                />
                <Input
                  label="Discount (PKR)"
                  type="number"
                  min={0}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Complies with Pakistan Sales Tax Act, 1990. Standard FBR General Sales Tax is 18%.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 space-y-2.5">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Financial Summary
              </h5>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Items Subtotal ({items.length} items):</span>
                <span className="font-mono font-medium">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Sales Tax ({taxPercent}% GST):</span>
                <span className="font-mono font-medium text-emerald-400">+Rs. {tax.toLocaleString()}</span>
              </div>
              {Number(discount) > 0 && (
                <div className="flex justify-between text-xs text-rose-300">
                  <span>Special Client Discount:</span>
                  <span className="font-mono font-medium">-Rs. {Number(discount).toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-100">Grand Total Payable:</span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  Rs. {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Issue Quotation ({items.length} items)
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
