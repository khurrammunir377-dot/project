'use client';

import React, { useState } from 'react';
import { Headphones, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatCard } from '@/components/ui/StatCard';
import { Ticket } from '@/lib/types';

export default function TicketsPage() {
  const { state, addTicket, updateTicketStatus, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    subject: '',
    category: 'IT Support' as Ticket['category'],
    priority: 'Medium' as Ticket['priority'],
    assignedTo: 'IT Support Desk',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject) return;

    addTicket({
      subject: form.subject,
      category: form.category,
      requesterName: currentUser.name,
      assignedTo: form.assignedTo,
      priority: form.priority,
      status: 'Open',
    });

    logAudit('Created Support Ticket', 'tickets', `Created ticket: ${form.subject} (${form.priority})`, currentUser.name, currentUser.id);
    setIsModalOpen(false);
  };

  const openTickets = state.tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress');

  const columns: Column<Ticket>[] = [
    {
      header: 'Ticket #',
      accessorKey: 'ticketNumber',
      sortable: true,
      render: (t) => (
        <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          {t.ticketNumber}
        </span>
      ),
    },
    {
      header: 'Subject',
      accessorKey: 'subject',
      sortable: true,
      render: (t) => <span className="font-semibold text-slate-900 dark:text-slate-100">{t.subject}</span>,
    },
    {
      header: 'Category',
      accessorKey: 'category',
      sortable: true,
      render: (t) => <span className="text-xs">{t.category}</span>,
    },
    {
      header: 'Requester',
      accessorKey: 'requesterName',
      sortable: true,
      render: (t) => <span className="text-xs text-slate-700 dark:text-slate-300">{t.requesterName}</span>,
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      sortable: true,
      render: (t) => {
        const variants: Record<string, any> = {
          Urgent: 'danger',
          High: 'warning',
          Medium: 'indigo',
          Low: 'neutral',
        };
        return <Badge variant={variants[t.priority]}>{t.priority}</Badge>;
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      render: (t) => {
        const variants: Record<string, any> = {
          Open: 'warning',
          'In Progress': 'info',
          Resolved: 'success',
          Closed: 'neutral',
        };
        return <Badge variant={variants[t.status]}>{t.status}</Badge>;
      },
    },
    {
      header: 'Action',
      render: (t) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {t.status !== 'Resolved' && can('tickets', 'edit') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateTicketStatus(t.id, 'Resolved')}
              icon={<CheckCircle className="w-3.5 h-3.5" />}
            >
              Resolve
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
            <Headphones className="w-6 h-6 text-indigo-600" /> Internal Helpdesk & Ticket System
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            IT support requests, facility inquiries, HR payroll tickets, and SLA incident resolutions.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
          Submit Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Open Tickets"
          value={openTickets.length}
          icon={<Clock className="w-5 h-5" />}
          subtitle="Awaiting resolution"
          colorScheme="amber"
        />
        <StatCard
          title="SLA Compliance Rate"
          value="98.5%"
          icon={<CheckCircle className="w-5 h-5" />}
          subtitle="Resolved under 4-hour target"
          colorScheme="emerald"
        />
        <StatCard
          title="Urgent Priority"
          value={state.tickets.filter((t) => t.priority === 'Urgent').length}
          icon={<AlertCircle className="w-5 h-5" />}
          subtitle="Mission-critical issues"
          colorScheme="rose"
        />
      </div>

      <DataTable
        data={state.tickets}
        columns={columns}
        searchPlaceholder="Search tickets by subject, requester, category..."
        searchKey={(t) => `${t.ticketNumber} ${t.subject} ${t.requesterName} ${t.category}`}
        exportFileName="Nexora_Helpdesk_Tickets"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Helpdesk Ticket"
        description="Submit an incident or request to the IT/Facilities team."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Ticket Subject"
            required
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="e.g. Broken monitor or VPN access issue"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as any })}
              options={[
                { label: 'IT Support', value: 'IT Support' },
                { label: 'HR Inquiry', value: 'HR Inquiry' },
                { label: 'Billing', value: 'Billing' },
                { label: 'Facility', value: 'Facility' },
                { label: 'General', value: 'General' },
              ]}
            />
            <Select
              label="Urgency / Priority"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
              options={[
                { label: 'Low', value: 'Low' },
                { label: 'Medium', value: 'Medium' },
                { label: 'High', value: 'High' },
                { label: 'Urgent', value: 'Urgent' },
              ]}
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
