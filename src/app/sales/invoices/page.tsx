'use client';

import React, { useState } from 'react';
import { Receipt, Plus, Download, DollarSign, Check, CreditCard, AlertCircle } from 'lucide-react';
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

export default function InvoicesPage() {
  const { state, addInvoice, recordInvoicePayment, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoiceForPay, setSelectedInvoiceForPay] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const [invoiceForm, setInvoiceForm] = useState({
    customerName: 'OmniCorp Technologies Ltd',
    description: 'Enterprise Managed Hosting & Support',
    unitPrice: 15000,
    quantity: 1,
    taxPercent: 8,
    discount: 500,
    dueDate: '2026-11-15',
  });

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = state.customers.find((c) => c.companyName === invoiceForm.customerName) || state.customers[0];
    const subtotal = Number(invoiceForm.unitPrice) * Number(invoiceForm.quantity);
    const tax = (subtotal * Number(invoiceForm.taxPercent)) / 100;
    const total = subtotal + tax - Number(invoiceForm.discount);

    addInvoice({
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: cust.id,
      customerName: cust.companyName,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: invoiceForm.dueDate,
      items: [
        {
          description: invoiceForm.description,
          quantity: Number(invoiceForm.quantity),
          unitPrice: Number(invoiceForm.unitPrice),
          total: subtotal,
        },
      ],
      subtotal,
      tax,
      discount: Number(invoiceForm.discount),
      total,
      amountPaid: 0,
      balanceDue: total,
      status: 'Sent',
    });

    logAudit('Generated Invoice', 'sales', `Created invoice for ${cust.companyName} (Rs. ${total.toLocaleString()})`, currentUser.name, currentUser.id);
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
              icon={<DollarSign className="w-3.5 h-3.5 text-emerald-600" />}
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
          icon={<DollarSign className="w-5 h-5" />}
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
        title="Issue New Invoice"
        description="Bill a customer account for delivered products or consulting services."
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <Select
            label="Client Account"
            value={invoiceForm.customerName}
            onChange={(e) => setInvoiceForm({ ...invoiceForm, customerName: e.target.value })}
            options={state.customers.map((c) => ({ label: c.companyName, value: c.companyName }))}
          />
          <Input
            label="Item / Service Description"
            required
            value={invoiceForm.description}
            onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
            placeholder="e.g. Enterprise Cloud Implementation"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity"
              type="number"
              min={1}
              value={invoiceForm.quantity}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, quantity: Number(e.target.value) })}
            />
            <Input
              label="Unit Price (PKR)"
              type="number"
              value={invoiceForm.unitPrice}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, unitPrice: Number(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Sales Tax Rate (GST %)"
              type="number"
              value={invoiceForm.taxPercent}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, taxPercent: Number(e.target.value) })}
            />
            <Input
              label="Discount (PKR)"
              type="number"
              value={invoiceForm.discount}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, discount: Number(e.target.value) })}
            />
            <Input
              label="Payment Due Date"
              type="date"
              value={invoiceForm.dueDate}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsInvoiceModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Issue Invoice
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
