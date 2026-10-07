'use client';

import React, { useState } from 'react';
import { Receipt, Plus, Download, Coins, Check, CreditCard, AlertCircle, Trash2, ShoppingBag } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatCard } from '@/components/ui/StatCard';
import { Invoice } from '@/lib/types';
import { generateInvoicePDF } from '@/lib/export';

interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function InvoicesPage() {
  const { state, addInvoice, recordInvoicePayment, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoiceForPay, setSelectedInvoiceForPay] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const [customerName, setCustomerName] = useState('OmniCorp Technologies Ltd');
  const [dueDate, setDueDate] = useState('2026-11-15');
  const [taxPercent, setTaxPercent] = useState<number>(18);
  const [discount, setDiscount] = useState<number>(10000);
  const [items, setItems] = useState<InvoiceLineItem[]>([
    { description: 'Cloud Infrastructure & Managed Server Cluster', quantity: 1, unitPrice: 220000, total: 220000 },
    { description: 'Database Clustering & High Availability Setup', quantity: 1, unitPrice: 85000, total: 85000 },
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
  const total = Math.max(0, subtotal + tax - (Number(discount) || 0));

  const handleCreateInvoice = (e: React.FormEvent) => {
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

    addInvoice({
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: cust.id,
      customerName: cust.companyName,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate,
      items: validItems,
      subtotal,
      tax,
      discount: Number(discount) || 0,
      total,
      amountPaid: 0,
      balanceDue: total,
      status: 'Sent',
    });

    logAudit(
      'Generated Invoice',
      'sales',
      `Created invoice with ${validItems.length} items for ${cust.companyName} (Rs. ${total.toLocaleString()})`,
      currentUser.name,
      currentUser.id
    );
    setIsInvoiceModalOpen(false);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPay || paymentAmount <= 0) return;

    recordInvoicePayment(selectedInvoiceForPay.id, Number(paymentAmount));
    logAudit(
      'Recorded Invoice Payment',
      'sales',
      `Payment of Rs. ${paymentAmount.toLocaleString()} recorded on ${selectedInvoiceForPay.invoiceNumber}`,
      currentUser.name,
      currentUser.id
    );

    setSelectedInvoiceForPay(null);
    setPaymentAmount(0);
  };

  const totalBilled = state.invoices.reduce((acc, i) => acc + i.total, 0);
  const totalReceived = state.invoices.reduce((acc, i) => acc + i.amountPaid, 0);
  const totalOutstanding = state.invoices.reduce((acc, i) => acc + i.balanceDue, 0);

  const columns: Column<Invoice>[] = [
    {
      header: 'Invoice #',
      accessorKey: 'invoiceNumber',
      sortable: true,
      render: (i) => (
        <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          {i.invoiceNumber}
        </span>
      ),
    },
    {
      header: 'Client Account',
      accessorKey: 'customerName',
      sortable: true,
      render: (i) => <span className="font-semibold text-slate-900 dark:text-slate-100">{i.customerName}</span>,
    },
    {
      header: 'Due Date',
      accessorKey: 'dueDate',
      sortable: true,
      render: (i) => <span className="text-xs">{i.dueDate}</span>,
    },
    {
      header: 'Total Amount',
      accessorKey: 'total',
      sortable: true,
      render: (i) => <span className="font-semibold">Rs. {i.total.toLocaleString()}</span>,
    },
    {
      header: 'Paid Amount',
      accessorKey: 'amountPaid',
      render: (i) => <span className="text-emerald-600 font-medium">Rs. {i.amountPaid.toLocaleString()}</span>,
    },
    {
      header: 'Balance Due',
      accessorKey: 'balanceDue',
      sortable: true,
      render: (i) => (
        <span className={`font-bold ${i.balanceDue > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
          Rs. {i.balanceDue.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      render: (i) => {
        const variants: Record<string, any> = {
          Paid: 'success',
          Partial: 'warning',
          Sent: 'info',
          Overdue: 'danger',
          Draft: 'neutral',
        };
        return <Badge variant={variants[i.status]}>{i.status}</Badge>;
      },
    },
    {
      header: 'Actions',
      render: (i) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateInvoicePDF(i, state.settings)}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            PDF
          </Button>

          {i.status !== 'Paid' && can('sales', 'approve') && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSelectedInvoiceForPay(i);
                setPaymentAmount(i.balanceDue);
              }}
              icon={<Coins className="w-3.5 h-3.5 text-emerald-600" />}
            >
              Pay
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
            <Receipt className="w-6 h-6 text-indigo-600" /> Invoices & Accounts Receivable
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated billing, partial collections, aging schedules, and professional PDF invoices.
          </p>
        </div>

        {can('sales', 'create') && (
          <Button onClick={() => setIsInvoiceModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Create Invoice
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Billed"
          value={`Rs. ${totalBilled.toLocaleString()}`}
          icon={<Receipt className="w-5 h-5" />}
          subtitle="Cumulative invoiced total"
          colorScheme="indigo"
        />
        <StatCard
          title="Cash Collected"
          value={`Rs. ${totalReceived.toLocaleString()}`}
          icon={<Coins className="w-5 h-5" />}
          subtitle="Received in bank account"
          colorScheme="emerald"
        />
        <StatCard
          title="Outstanding Receivables"
          value={`Rs. ${totalOutstanding.toLocaleString()}`}
          icon={<AlertCircle className="w-5 h-5" />}
          subtitle="Uncollected invoice balances"
          colorScheme="rose"
        />
      </div>

      <DataTable
        data={state.invoices}
        columns={columns}
        searchPlaceholder="Search invoices by invoice #, customer name..."
        searchKey={(i) => `${i.invoiceNumber} ${i.customerName} ${i.status}`}
        exportFileName="Nexora_Invoices_Billing"
      />

      {/* New Invoice Modal */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Issue New Sales Tax Invoice"
        description="FBR Annex-C compliant tax invoice with itemized line items and automatic ledger posting."
        maxWidth="4xl"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Client Account"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              options={state.customers.map((c) => ({ label: c.companyName, value: c.companyName }))}
            />
            <Input
              label="Payment Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Multiple Line Items Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" /> Billed Items &amp; Services
                </h4>
                <p className="text-xs text-slate-500">
                  Add multiple billable line items. Prices and line totals calculate automatically in PKR.
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
                      <th className="py-2.5 px-3 min-w-[260px]">Item Description / Catalog Preset</th>
                      <th className="py-2.5 px-3 w-24 text-center">Qty</th>
                      <th className="py-2.5 px-3 w-36 text-right">Unit Rate (PKR)</th>
                      <th className="py-2.5 px-3 w-36 text-right">Net Amount (PKR)</th>
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
                            placeholder="e.g. Enterprise Cloud Implementation"
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
                Tax &amp; Adjustments (FBR SRO)
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
                Verified under Sales Tax Act 1990. Standard Pakistan rate: 18% GST with automated NTN withholding.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 space-y-2.5">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Billing Summary
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
                  <span>Trade Discount:</span>
                  <span className="font-mono font-medium">-Rs. {Number(discount).toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-100">Total Invoice Payable:</span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  Rs. {total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsInvoiceModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Issue Invoice ({items.length} items)
            </Button>
          </div>
        </form>
      </Modal>

      {/* Record Payment Modal */}
      {selectedInvoiceForPay && (
        <Modal
          isOpen={!!selectedInvoiceForPay}
          onClose={() => setSelectedInvoiceForPay(null)}
          title={`Record Payment - ${selectedInvoiceForPay.invoiceNumber}`}
          description={`Customer: ${selectedInvoiceForPay.customerName} • Outstanding Balance: Rs. ${selectedInvoiceForPay.balanceDue.toLocaleString()}`}
        >
          <form onSubmit={handleRecordPayment} className="space-y-4">
            <Input
              label="Payment Amount Received (PKR)"
              type="number"
              min={1}
              max={selectedInvoiceForPay.balanceDue}
              required
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
            />
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs">
              Recording this payment will update Accounts Receivable and reconcile the customer ledger automatically.
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => setSelectedInvoiceForPay(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="success">
                Confirm Payment Receipt
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
