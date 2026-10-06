'use client';

import React, { useState } from 'react';
import { FileText, Plus, Check, ArrowRight, Download } from 'lucide-react';
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

export default function QuotationsPage() {
  const { state, addQuotation, updateQuotationStatus, addInvoice, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    customerName: 'Systems Limited Pakistan',
    description: 'Enterprise ERP Implementation & Cloud Onboarding',
    unitPrice: 350000,
    quantity: 1,
    taxPercent: 17,
    discount: 15000,
    expiryDate: '2026-11-15',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = state.customers.find((c) => c.companyName === form.customerName) || state.customers[0];
    const subtotal = form.unitPrice * form.quantity;
    const tax = Math.round((subtotal * form.taxPercent) / 100);
    const total = subtotal + tax - form.discount;

    addQuotation({
      quotationNumber: `QT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: cust.id,
      customerName: cust.companyName,
      date: new Date().toISOString().split('T')[0],
      expiryDate: form.expiryDate,
      items: [
        {
          description: form.description,
          quantity: form.quantity,
          unitPrice: form.unitPrice,
          total: subtotal,
        },
      ],
      subtotal,
      tax,
      discount: form.discount,
      total,
      status: 'Sent',
    });

    logAudit('Issued Quotation', 'sales', `Sent quotation for ${cust.companyName} (Rs. ${total})`, currentUser.name, currentUser.id);
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
        description="Draft a formal corporate proposal with Pakistan FBR compliant terms."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Select
            label="Client Corporate Account"
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            options={state.customers.map((c) => ({ label: c.companyName, value: c.companyName }))}
          />
          <Input
            label="Scope / Service Particulars"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="e.g. ERP Implementation & Customization"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity"
              type="number"
              min={1}
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
            />
            <Input
              label="Unit Price (PKR)"
              type="number"
              value={form.unitPrice}
              onChange={(e) => setForm({ ...form, unitPrice: Number(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Sales Tax Rate (GST %)"
              type="number"
              value={form.taxPercent}
              onChange={(e) => setForm({ ...form, taxPercent: Number(e.target.value) })}
            />
            <Input
              label="Discount (PKR)"
              type="number"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
            />
            <Input
              label="Proposal Expiry Date"
              type="date"
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Issue Quotation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
