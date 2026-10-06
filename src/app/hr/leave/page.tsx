'use client';

import React, { useState } from 'react';
import { CalendarDays, Plus, Check, X, Clock, ShieldCheck } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatCard } from '@/components/ui/StatCard';
import { LeaveRequest, LeaveType } from '@/lib/types';

export default function LeavePage() {
  const { state, addLeaveRequest, updateLeaveStatus, logAudit } = useERPStore();
  const { currentUser, can, isManager } = useAuth();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const [form, setForm] = useState({
    leaveType: 'Annual Leave' as LeaveType,
    startDate: '2026-10-15',
    endDate: '2026-10-18',
    days: 4,
    reason: '',
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.reason) return;

    addLeaveRequest({
      employeeId: currentUser.employeeId,
      employeeName: currentUser.name,
      department: 'Executive & Admin',
      leaveType: form.leaveType,
      startDate: form.startDate,
      endDate: form.endDate,
      days: Number(form.days),
      reason: form.reason,
    });

    logAudit(
      'Submitted Leave Request',
      'leave',
      `${currentUser.name} applied for ${form.days} days of ${form.leaveType}`,
      currentUser.name,
      currentUser.id
    );

    setIsApplyModalOpen(false);
  };

  const handleApprove = (id: string, empName: string) => {
    updateLeaveStatus(id, 'Approved', currentUser.name);
    logAudit(
      'Approved Leave Request',
      'leave',
      `Approved leave request for ${empName}`,
      currentUser.name,
      currentUser.id
    );
  };

  const handleReject = (id: string, empName: string) => {
    updateLeaveStatus(id, 'Rejected', currentUser.name);
    logAudit(
      'Rejected Leave Request',
      'leave',
      `Rejected leave request for ${empName}`,
      currentUser.name,
      currentUser.id
    );
  };

  const columns: Column<LeaveRequest>[] = [
    {
      header: 'Staff Member',
      accessorKey: 'employeeName',
      sortable: true,
      render: (req) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{req.employeeName}</div>
          <div className="text-xs text-slate-400">{req.department}</div>
        </div>
      ),
    },
    {
      header: 'Leave Category',
      accessorKey: 'leaveType',
      sortable: true,
      render: (req) => <span className="font-medium text-xs">{req.leaveType}</span>,
    },
    {
      header: 'Duration',
      accessorKey: 'days',
      sortable: true,
      render: (req) => (
        <div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">{req.days} Days</div>
          <div className="text-[11px] text-slate-400">
            {req.startDate} → {req.endDate}
          </div>
        </div>
      ),
    },
    {
      header: 'Reason',
      accessorKey: 'reason',
      render: (req) => (
        <span className="text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate block">
          {req.reason}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      render: (req) => {
        const variants: Record<string, any> = {
          Approved: 'success',
          Pending: 'warning',
          Rejected: 'danger',
          Cancelled: 'neutral',
        };
        return <Badge variant={variants[req.status]}>{req.status}</Badge>;
      },
    },
    {
      header: 'Action / Sign-Off',
      render: (req) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {req.status === 'Pending' && can('leave', 'approve') ? (
            <>
              <button
                onClick={() => handleApprove(req.id, req.employeeName)}
                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                title="Approve Request"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleReject(req.id, req.employeeName)}
                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                title="Reject Request"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <span className="text-xs text-slate-400">
              {req.approvedBy ? `By ${req.approvedBy}` : 'Completed'}
            </span>
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
            <CalendarDays className="w-6 h-6 text-indigo-600" /> Leave Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated leave allocations, multi-tier approval workflows, and vacation tracking.
          </p>
        </div>

        <Button onClick={() => setIsApplyModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
          Request Leave
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Annual Vacation"
          value="18 / 24 Days"
          icon={<CalendarDays className="w-5 h-5" />}
          subtitle="Remaining this calendar year"
          colorScheme="indigo"
        />
        <StatCard
          title="Sick Leave"
          value="8 / 10 Days"
          icon={<ShieldCheck className="w-5 h-5" />}
          subtitle="Remaining paid medical leave"
          colorScheme="emerald"
        />
        <StatCard
          title="Emergency Leave"
          value="3 / 5 Days"
          icon={<Clock className="w-5 h-5" />}
          subtitle="Available for urgent family needs"
          colorScheme="amber"
        />
        <StatCard
          title="Pending Requests"
          value={state.leaveRequests.filter((l) => l.status === 'Pending').length}
          icon={<Clock className="w-5 h-5" />}
          subtitle="Requests awaiting sign-off"
          colorScheme="rose"
        />
      </div>

      {/* Leave Requests Table */}
      <DataTable
        data={state.leaveRequests}
        columns={columns}
        searchPlaceholder="Filter leave requests by name, department, status..."
        searchKey={(r) => `${r.employeeName} ${r.department} ${r.leaveType} ${r.status}`}
        exportFileName="Nexora_Leave_Requests"
      />

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Leave"
        description="Submit a vacation or absence request to your department manager."
      >
        <form onSubmit={handleApply} className="space-y-4">
          <Select
            label="Leave Type"
            value={form.leaveType}
            onChange={(e) => setForm({ ...form, leaveType: e.target.value as LeaveType })}
            options={[
              { label: 'Annual Leave', value: 'Annual Leave' },
              { label: 'Sick Leave', value: 'Sick Leave' },
              { label: 'Emergency Leave', value: 'Emergency Leave' },
              { label: 'Maternity / Paternity', value: 'Maternity / Paternity' },
              { label: 'Unpaid Leave', value: 'Unpaid Leave' },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              required
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              required
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </div>
          <Input
            label="Number of Working Days"
            type="number"
            min={1}
            value={form.days}
            onChange={(e) => setForm({ ...form, days: Number(e.target.value) })}
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Reason / Justification
            </label>
            <textarea
              required
              rows={3}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 text-sm bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              placeholder="Provide context for your leave request..."
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
