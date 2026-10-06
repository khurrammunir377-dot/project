'use client';

import React, { useState } from 'react';
import { Clock, CheckCircle2, AlertCircle, Plus, Calendar, UserCheck } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatCard } from '@/components/ui/StatCard';
import { AttendanceRecord } from '@/lib/types';

export default function AttendancePage() {
  const { state, addAttendance, logAudit } = useERPStore();
  const { currentUser } = useAuth();
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  const [manualForm, setManualForm] = useState({
    employeeName: currentUser.name,
    department: 'Engineering & IT',
    date: new Date().toISOString().split('T')[0],
    clockIn: '09:00 AM',
    clockOut: '05:00 PM',
    status: 'Present' as AttendanceRecord['status'],
    workingHours: 8,
    overtimeHours: 0,
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = state.employees.find((e) => `${e.firstName} ${e.lastName}` === manualForm.employeeName) || state.employees[0];
    addAttendance({
      employeeId: emp.employeeId,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      department: emp.department,
      date: manualForm.date,
      clockIn: manualForm.clockIn,
      clockOut: manualForm.clockOut,
      breakDurationMinutes: 60,
      workingHours: Number(manualForm.workingHours),
      overtimeHours: Number(manualForm.overtimeHours),
      status: manualForm.status,
      approved: true,
    });
    logAudit(
      'Manual Attendance Adjusted',
      'attendance',
      `Logged attendance for ${manualForm.employeeName} on ${manualForm.date}`,
      currentUser.name,
      currentUser.id
    );
    setIsManualModalOpen(false);
  };

  const columns: Column<AttendanceRecord>[] = [
    {
      header: 'Employee',
      accessorKey: 'employeeName',
      sortable: true,
      render: (att) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{att.employeeName}</div>
          <div className="text-xs text-slate-400">{att.employeeId}</div>
        </div>
      ),
    },
    {
      header: 'Department',
      accessorKey: 'department',
      sortable: true,
    },
    {
      header: 'Date',
      accessorKey: 'date',
      sortable: true,
    },
    {
      header: 'Clock In',
      accessorKey: 'clockIn',
      render: (att) => <span className="font-mono text-xs">{att.clockIn}</span>,
    },
    {
      header: 'Clock Out',
      accessorKey: 'clockOut',
      render: (att) => <span className="font-mono text-xs">{att.clockOut || 'Active'}</span>,
    },
    {
      header: 'Hours Logged',
      accessorKey: 'workingHours',
      sortable: true,
      render: (att) => (
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {att.workingHours} hrs {att.overtimeHours > 0 && `(+${att.overtimeHours}h OT)`}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      render: (att) => {
        const variants: Record<string, any> = {
          Present: 'success',
          Late: 'warning',
          'Half Day': 'info',
          Absent: 'danger',
          'On Leave': 'purple',
        };
        return <Badge variant={variants[att.status] || 'neutral'}>{att.status}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-600" /> Attendance Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time biometric & web clock logs, working hours, punctuality tracking, and overtime audits.
          </p>
        </div>

        <Button onClick={() => setIsManualModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
          Manual Entry Adjustment
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="On-Time Rate"
          value="94.2%"
          icon={<CheckCircle2 className="w-5 h-5" />}
          trend={{ value: '+2.1% this month', positive: true }}
          colorScheme="emerald"
        />
        <StatCard
          title="Average Daily Hours"
          value="8.2 hrs"
          icon={<Clock className="w-5 h-5" />}
          colorScheme="indigo"
        />
        <StatCard
          title="Late Arrivals Today"
          value="1"
          icon={<AlertCircle className="w-5 h-5" />}
          colorScheme="amber"
        />
        <StatCard
          title="On Approved Leave"
          value={state.leaveRequests.filter((l) => l.status === 'Approved').length}
          icon={<Calendar className="w-5 h-5" />}
          colorScheme="sky"
        />
      </div>

      {/* Attendance DataTable */}
      <DataTable
        data={state.attendance}
        columns={columns}
        searchPlaceholder="Filter attendance by employee name, department, date..."
        searchKey={(att) => `${att.employeeName} ${att.department} ${att.date}`}
        exportFileName="Nexora_Attendance_Logs"
      />

      {/* Manual Entry Modal */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="Manual Attendance Adjustment"
        description="Add or correct a historical attendance punch for an employee."
      >
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <Select
            label="Staff Member"
            value={manualForm.employeeName}
            onChange={(e) => setManualForm({ ...manualForm, employeeName: e.target.value })}
            options={state.employees.map((e) => ({
              label: `${e.firstName} ${e.lastName} (${e.department})`,
              value: `${e.firstName} ${e.lastName}`,
            }))}
          />
          <Input
            label="Date"
            type="date"
            required
            value={manualForm.date}
            onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Clock In Time"
              value={manualForm.clockIn}
              onChange={(e) => setManualForm({ ...manualForm, clockIn: e.target.value })}
            />
            <Input
              label="Clock Out Time"
              value={manualForm.clockOut}
              onChange={(e) => setManualForm({ ...manualForm, clockOut: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Working Hours"
              type="number"
              step="0.1"
              value={manualForm.workingHours}
              onChange={(e) => setManualForm({ ...manualForm, workingHours: Number(e.target.value) })}
            />
            <Select
              label="Punctuality Status"
              value={manualForm.status}
              onChange={(e) => setManualForm({ ...manualForm, status: e.target.value as any })}
              options={[
                { label: 'Present', value: 'Present' },
                { label: 'Late', value: 'Late' },
                { label: 'Half Day', value: 'Half Day' },
                { label: 'Absent', value: 'Absent' },
              ]}
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsManualModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
