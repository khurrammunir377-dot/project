'use client';

import React, { useState } from 'react';
import { CreditCard, Plus, Download, FileText, Check, DollarSign } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatCard } from '@/components/ui/StatCard';
import { Payslip } from '@/lib/types';
import { generatePayslipPDF } from '@/lib/export';

export default function PayrollPage() {
  const { state, addPayslip, updatePayslipStatus, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    employeeName: 'Michael Scott',
    month: 'October',
    year: 2026,
    basicSalary: 9500,
    allowances: 1200,
    bonus: 500,
    overtime: 0,
    taxDeduction: 2200,
    socialInsurance: 600,
    otherDeductions: 0,
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = state.employees.find((e) => `${e.firstName} ${e.lastName}` === form.employeeName) || state.employees[0];
    const gross = Number(form.basicSalary) + Number(form.allowances) + Number(form.bonus) + Number(form.overtime);
    const deductions = Number(form.taxDeduction) + Number(form.socialInsurance) + Number(form.otherDeductions);
    const net = Math.max(0, gross - deductions);

    addPayslip({
      payslipNo: `PAY-2026-${form.month.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      employeeId: emp.employeeId,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      department: emp.department,
      jobTitle: emp.jobTitle,
      month: form.month,
      year: Number(form.year),
      basicSalary: Number(form.basicSalary),
      allowances: Number(form.allowances),
      bonus: Number(form.bonus),
      overtime: Number(form.overtime),
      grossSalary: gross,
      taxDeduction: Number(form.taxDeduction),
      socialInsurance: Number(form.socialInsurance),
      otherDeductions: Number(form.otherDeductions),
      netSalary: net,
      status: 'Approved',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Direct Wire',
    });

    logAudit(
      'Generated Payslip',
      'payroll',
      `Generated payslip for ${emp.firstName} ${emp.lastName} (${form.month} ${form.year})`,
      currentUser.name,
      currentUser.id
    );

    setIsModalOpen(false);
  };

  const totalPayrollOutflow = state.payslips.reduce((acc, p) => acc + p.netSalary, 0);

  const columns: Column<Payslip>[] = [
    {
      header: 'Payslip Ref',
      accessorKey: 'payslipNo',
      sortable: true,
      render: (p) => (
        <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          {p.payslipNo}
        </span>
      ),
    },
    {
      header: 'Employee',
      accessorKey: 'employeeName',
      sortable: true,
      render: (p) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{p.employeeName}</div>
          <div className="text-xs text-slate-400">{p.department}</div>
        </div>
      ),
    },
    {
      header: 'Period',
      render: (p) => <span className="text-xs">{p.month} {p.year}</span>,
    },
    {
      header: 'Gross Earnings',
      accessorKey: 'grossSalary',
      sortable: true,
      render: (p) => <span className="text-xs font-medium">${p.grossSalary.toLocaleString()}</span>,
    },
    {
      header: 'Deductions',
      render: (p) => (
        <span className="text-xs text-rose-600">
          -${(p.taxDeduction + p.socialInsurance + p.otherDeductions).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Net Pay',
      accessorKey: 'netSalary',
      sortable: true,
      render: (p) => (
        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
          ${p.netSalary.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      render: (p) => {
        const variants: Record<string, any> = {
          Paid: 'success',
          Approved: 'info',
          Draft: 'neutral',
        };
        return <Badge variant={variants[p.status]}>{p.status}</Badge>;
      },
    },
    {
      header: 'Payslip PDF',
      render: (p) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => generatePayslipPDF(p, state.settings)}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            PDF
          </Button>
          {p.status !== 'Paid' && can('payroll', 'approve') && (
            <button
              onClick={() => updatePayslipStatus(p.id, 'Paid')}
              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
              title="Mark as Paid"
            >
              <Check className="w-4 h-4" />
            </button>
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
            <CreditCard className="w-6 h-6 text-indigo-600" /> Payroll & Compensation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated salary calculations, tax withholdings, direct deposits, and PDF payslip generation.
          </p>
        </div>

        {can('payroll', 'create') && (
          <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Generate Payslip
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Processed Payroll"
          value={`$${totalPayrollOutflow.toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5" />}
          subtitle="Net disbursements across staff"
          colorScheme="emerald"
        />
        <StatCard
          title="Disbursement Currency"
          value={state.settings.currency}
          icon={<CreditCard className="w-5 h-5" />}
          subtitle={`Symbol: ${state.settings.currencySymbol}`}
          colorScheme="indigo"
        />
        <StatCard
          title="Generated Payslips"
          value={state.payslips.length}
          icon={<FileText className="w-5 h-5" />}
          subtitle="All records digitally signed"
          colorScheme="sky"
        />
      </div>

      <DataTable
        data={state.payslips}
        columns={columns}
        searchPlaceholder="Search payslips by employee, payslip ref, month..."
        searchKey={(p) => `${p.payslipNo} ${p.employeeName} ${p.month}`}
        exportFileName="Nexora_Payroll_Records"
      />

      {/* Generate Payslip Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate Employee Payslip"
        description="Compute gross earnings, statutory withholdings, and net salary."
      >
        <form onSubmit={handleGenerate} className="space-y-4">
          <Select
            label="Staff Member"
            value={form.employeeName}
            onChange={(e) => {
              const emp = state.employees.find((x) => `${x.firstName} ${x.lastName}` === e.target.value);
              setForm({
                ...form,
                employeeName: e.target.value,
                basicSalary: emp ? emp.basicSalary : form.basicSalary,
              });
            }}
            options={state.employees.map((e) => ({
              label: `${e.firstName} ${e.lastName} - ${e.jobTitle}`,
              value: `${e.firstName} ${e.lastName}`,
            }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Payroll Month"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              options={[
                { label: 'October', value: 'October' },
                { label: 'November', value: 'November' },
                { label: 'December', value: 'December' },
              ]}
            />
            <Input
              label="Fiscal Year"
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Basic Salary (PKR)"
              type="number"
              value={form.basicSalary}
              onChange={(e) => setForm({ ...form, basicSalary: Number(e.target.value) })}
            />
            <Input
              label="Allowances (PKR)"
              type="number"
              value={form.allowances}
              onChange={(e) => setForm({ ...form, allowances: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Performance Bonus (PKR)"
              type="number"
              value={form.bonus}
              onChange={(e) => setForm({ ...form, bonus: Number(e.target.value) })}
            />
            <Input
              label="Overtime Pay (PKR)"
              type="number"
              value={form.overtime}
              onChange={(e) => setForm({ ...form, overtime: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-3">
            <Input
              label="Income Tax Withholding (PKR)"
              type="number"
              value={form.taxDeduction}
              onChange={(e) => setForm({ ...form, taxDeduction: Number(e.target.value) })}
            />
            <Input
              label="EOBI / Social Insurance (PKR)"
              type="number"
              value={form.socialInsurance}
              onChange={(e) => setForm({ ...form, socialInsurance: Number(e.target.value) })}
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Generate & Sign Payslip
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
