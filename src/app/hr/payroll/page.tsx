'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Download,
  FileText,
  Check,
  Coins,
  Zap,
  Users,
  Building,
  HelpCircle,
  Sliders,
  AlertCircle,
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
import { Payslip } from '@/lib/types';
import { generatePayslipPDF } from '@/lib/export';

export default function PayrollPage() {
  const { state, addPayslip, addMultiplePayslips, updatePayslipStatus, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);

  // Single Payslip Form State with comprehensive deduction options
  const [form, setForm] = useState({
    employeeName: state.employees[0] ? `${state.employees[0].firstName} ${state.employees[0].lastName}` : 'Muhammad Hamza Khan',
    month: 'October',
    year: 2026,
    basicSalary: 350000,
    allowances: 35000,
    bonus: 15000,
    overtime: 0,
    taxDeduction: 28000,
    socialInsurance: 600, // EOBI
    providentFund: 17500, // 5% PF
    advanceSalaryDeduction: 0,
    absencePenalty: 0,
    otherDeductions: 0,
  });

  // Batch Generation Form State
  const [batchMonth, setBatchMonth] = useState('October');
  const [batchYear, setBatchYear] = useState(2026);
  const [batchTaxRatePercent, setBatchTaxRatePercent] = useState(7);
  const [batchEobiAmount, setBatchEobiAmount] = useState(600);
  const [batchPfPercent, setBatchPfPercent] = useState(5);
  const [batchAllowancePercent, setBatchAllowancePercent] = useState(15);

  const calculateSingleTotals = () => {
    const gross =
      Number(form.basicSalary) +
      Number(form.allowances) +
      Number(form.bonus) +
      Number(form.overtime);
    const totalDeductions =
      Number(form.taxDeduction) +
      Number(form.socialInsurance) +
      Number(form.providentFund) +
      Number(form.advanceSalaryDeduction) +
      Number(form.absencePenalty) +
      Number(form.otherDeductions);
    const net = Math.max(0, gross - totalDeductions);
    return { gross, totalDeductions, net };
  };

  const { gross: singleGross, totalDeductions: singleDeductions, net: singleNet } = calculateSingleTotals();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const emp =
      state.employees.find((e) => `${e.firstName} ${e.lastName}` === form.employeeName) ||
      state.employees[0];

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
      grossSalary: singleGross,
      taxDeduction: Number(form.taxDeduction),
      socialInsurance: Number(form.socialInsurance),
      otherDeductions:
        Number(form.providentFund) +
        Number(form.advanceSalaryDeduction) +
        Number(form.absencePenalty) +
        Number(form.otherDeductions),
      netSalary: singleNet,
      status: 'Approved',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Meezan Bank Raast Direct Wire',
    });

    logAudit(
      'Generated Payslip',
      'payroll',
      `Generated payslip for ${emp.firstName} ${emp.lastName} (Net: Rs. ${singleNet.toLocaleString()})`,
      currentUser.name,
      currentUser.id
    );

    setIsModalOpen(false);
  };

  // Handle 1-Click Batch Payroll Generation for ALL Active Employees
  const handleBatchGenerate = () => {
    const activeEmployees = state.employees.filter((emp) => emp.status === 'Active');
    if (activeEmployees.length === 0) return;

    const generatedSlips: Omit<Payslip, 'id'>[] = activeEmployees.map((emp) => {
      const basic = emp.basicSalary || 180000;
      const allowances = Math.round((basic * batchAllowancePercent) / 100);
      const gross = basic + allowances;
      const tax = Math.round((basic * batchTaxRatePercent) / 100);
      const eobi = Number(batchEobiAmount);
      const pf = Math.round((basic * batchPfPercent) / 100);
      const deductions = tax + eobi + pf;
      const net = Math.max(0, gross - deductions);

      return {
        payslipNo: `PAY-BATCH-${batchMonth.slice(0, 3).toUpperCase()}-${emp.employeeId}`,
        employeeId: emp.employeeId,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        department: emp.department,
        jobTitle: emp.jobTitle,
        month: batchMonth,
        year: Number(batchYear),
        basicSalary: basic,
        allowances: allowances,
        bonus: 0,
        overtime: 0,
        grossSalary: gross,
        taxDeduction: tax,
        socialInsurance: eobi,
        otherDeductions: pf,
        netSalary: net,
        status: 'Approved',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: `${emp.bankName || 'Meezan Bank'} Direct Deposit`,
      };
    });

    addMultiplePayslips(generatedSlips);
    logAudit(
      'Batch Payroll Processed',
      'payroll',
      `Generated monthly payroll batch for ${generatedSlips.length} employees (${batchMonth} ${batchYear})`,
      currentUser.name,
      currentUser.id
    );

    setIsBatchOpen(false);
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
      render: (p) => (
        <span className="text-xs font-medium font-mono text-slate-700 dark:text-slate-300">
          Rs. {p.grossSalary.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Total Deductions',
      render: (p) => {
        const totalDed = p.taxDeduction + p.socialInsurance + (p.otherDeductions || 0);
        return (
          <span className="text-xs font-mono text-rose-600 dark:text-rose-400">
            -Rs. {totalDed.toLocaleString()}
          </span>
        );
      },
    },
    {
      header: 'Net Pay',
      accessorKey: 'netSalary',
      sortable: true,
      render: (p) => (
        <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
          Rs. {p.netSalary.toLocaleString()}
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
      {/* Header and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-600" /> Payroll &amp; Compensation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated Pakistani salary calculations, statutory FBR withholdings, EOBI deductions, and 1-click batch payroll.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {can('payroll', 'create') && (
            <>
              <Button
                variant="outline"
                onClick={() => setIsBatchOpen(true)}
                icon={<Zap className="w-4 h-4 text-amber-500" />}
              >
                Batch Generate (All Employees)
              </Button>
              <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
                Single Payslip
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Processed Payroll"
          value={`Rs. ${totalPayrollOutflow.toLocaleString()}`}
          icon={<Coins className="w-5 h-5" />}
          subtitle="Net disbursements across staff"
          colorScheme="emerald"
        />
        <StatCard
          title="Disbursement Currency"
          value="PKR (Pakistani Rupee)"
          icon={<CreditCard className="w-5 h-5" />}
          subtitle="Symbols: Rs. / PKR • Raast Integrated"
          colorScheme="indigo"
        />
        <StatCard
          title="Generated Payslips"
          value={state.payslips.length}
          icon={<FileText className="w-5 h-5" />}
          subtitle="All records digitally signed with NTN"
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

      {/* 1. SINGLE PAYSLIP GENERATION MODAL (WITH COMPREHENSIVE DEDUCTION OPTIONS) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate Employee Payslip"
        description="Compute gross earnings, statutory withholdings, loan repayments, and net salary."
        maxWidth="2xl"
      >
        <form onSubmit={handleGenerate} className="space-y-4">
          <Select
            label="Staff Member"
            value={form.employeeName}
            onChange={(e) => {
              const emp = state.employees.find((x) => `${x.firstName} ${x.lastName}` === e.target.value);
              if (emp) {
                const bSalary = emp.basicSalary || 200000;
                setForm({
                  ...form,
                  employeeName: e.target.value,
                  basicSalary: bSalary,
                  allowances: Math.round(bSalary * 0.15),
                  taxDeduction: Math.round(bSalary * 0.07),
                  providentFund: Math.round(bSalary * 0.05),
                });
              }
            }}
            options={state.employees.map((e) => ({
              label: `${e.firstName} ${e.lastName} - ${e.jobTitle} (Basic: Rs. ${e.basicSalary.toLocaleString()})`,
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
                { label: 'January', value: 'January' },
                { label: 'February', value: 'February' },
                { label: 'March', value: 'March' },
              ]}
            />
            <Input
              label="Fiscal Year"
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            />
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-3 border border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider">
              <span>Earnings &amp; Allowances</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Input
                label="Basic Salary (PKR)"
                type="number"
                value={form.basicSalary}
                onChange={(e) => setForm({ ...form, basicSalary: Number(e.target.value) })}
              />
              <Input
                label="Housing/Utility Allowances"
                type="number"
                value={form.allowances}
                onChange={(e) => setForm({ ...form, allowances: Number(e.target.value) })}
              />
              <Input
                label="Performance Bonus"
                type="number"
                value={form.bonus}
                onChange={(e) => setForm({ ...form, bonus: Number(e.target.value) })}
              />
              <Input
                label="Overtime Pay"
                type="number"
                value={form.overtime}
                onChange={(e) => setForm({ ...form, overtime: Number(e.target.value) })}
              />
            </div>
            <div className="text-right text-xs font-semibold text-slate-700 dark:text-slate-300">
              Total Gross Earnings: <span className="font-mono text-emerald-600 font-bold">Rs. {singleGross.toLocaleString()}</span>
            </div>
          </div>

          {/* DEDUCTIONS SECTION (REQUESTED BY USER) */}
          <div className="p-3.5 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl space-y-3 border border-rose-200 dark:border-rose-900/50">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Sliders className="w-3.5 h-3.5 text-rose-500" />
                <span>Statutory &amp; Custom Deductions</span>
              </h4>
              <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                EOBI standard: Rs. 600 • FBR Tax WHT
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Input
                label="FBR Income Tax (PKR)"
                type="number"
                value={form.taxDeduction}
                onChange={(e) => setForm({ ...form, taxDeduction: Number(e.target.value) })}
              />
              <Input
                label="EOBI Contribution (PKR)"
                type="number"
                value={form.socialInsurance}
                onChange={(e) => setForm({ ...form, socialInsurance: Number(e.target.value) })}
              />
              <Input
                label="Provident Fund (PKR)"
                type="number"
                value={form.providentFund}
                onChange={(e) => setForm({ ...form, providentFund: Number(e.target.value) })}
              />
              <Input
                label="Salary Advance / Loan (PKR)"
                type="number"
                value={form.advanceSalaryDeduction}
                onChange={(e) => setForm({ ...form, advanceSalaryDeduction: Number(e.target.value) })}
              />
              <Input
                label="Absence / Late Penalty (PKR)"
                type="number"
                value={form.absencePenalty}
                onChange={(e) => setForm({ ...form, absencePenalty: Number(e.target.value) })}
              />
              <Input
                label="Health / Misc Deductions (PKR)"
                type="number"
                value={form.otherDeductions}
                onChange={(e) => setForm({ ...form, otherDeductions: Number(e.target.value) })}
              />
            </div>

            <div className="text-right text-xs font-semibold text-rose-700 dark:text-rose-300">
              Total Deductions: <span className="font-mono text-rose-600 font-bold">-Rs. {singleDeductions.toLocaleString()}</span>
            </div>
          </div>

          {/* NET SALARY LIVE SUMMARY */}
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl flex items-center justify-between border border-indigo-200 dark:border-indigo-800">
            <div>
              <span className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold block">
                Calculated Net Payable Salary
              </span>
              <span className="text-[11px] text-slate-500">
                Gross (Rs. {singleGross.toLocaleString()}) minus Deductions (Rs. {singleDeductions.toLocaleString()})
              </span>
            </div>
            <div className="text-xl font-black font-mono text-indigo-700 dark:text-indigo-300">
              Rs. {singleNet.toLocaleString()}
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Generate &amp; Sign Payslip
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. BATCH PAYROLL GENERATION MODAL (1-CLICK FOR ALL EMPLOYEES) */}
      <Modal
        isOpen={isBatchOpen}
        onClose={() => setIsBatchOpen(false)}
        title="1-Click Batch Payroll Generation (All Employees)"
        description="Compute and disburse monthly compensation across all company employees in one operation."
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Automated Multi-Employee Processing:</strong> This will process payslips for all{' '}
              <strong>{state.employees.filter((e) => e.status === 'Active').length} active staff members</strong> using their configured basic salaries, automated FBR tax slabs, EOBI contributions, and Provident Fund parameters.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Disbursement Month"
              value={batchMonth}
              onChange={(e) => setBatchMonth(e.target.value)}
              options={[
                { label: 'October', value: 'October' },
                { label: 'November', value: 'November' },
                { label: 'December', value: 'December' },
                { label: 'January', value: 'January' },
              ]}
            />
            <Input
              label="Fiscal Year"
              type="number"
              value={batchYear}
              onChange={(e) => setBatchYear(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
            <Input
              label="Allowances (% of Basic)"
              type="number"
              value={batchAllowancePercent}
              onChange={(e) => setBatchAllowancePercent(Number(e.target.value))}
            />
            <Input
              label="Income Tax Rate (%)"
              type="number"
              value={batchTaxRatePercent}
              onChange={(e) => setBatchTaxRatePercent(Number(e.target.value))}
            />
            <Input
              label="EOBI Fixed (PKR)"
              type="number"
              value={batchEobiAmount}
              onChange={(e) => setBatchEobiAmount(Number(e.target.value))}
            />
            <Input
              label="Provident Fund (%)"
              type="number"
              value={batchPfPercent}
              onChange={(e) => setBatchPfPercent(Number(e.target.value))}
            />
          </div>

          {/* Roster Preview */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-100 dark:bg-slate-800/80 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
              <span>Employee Roster Preview ({state.employees.filter((e) => e.status === 'Active').length} staff)</span>
              <span>Disbursal Estimate</span>
            </div>
            <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {state.employees
                .filter((e) => e.status === 'Active')
                .map((emp) => {
                  const basic = emp.basicSalary || 180000;
                  const gross = basic + Math.round((basic * batchAllowancePercent) / 100);
                  const ded =
                    Math.round((basic * batchTaxRatePercent) / 100) +
                    Number(batchEobiAmount) +
                    Math.round((basic * batchPfPercent) / 100);
                  const net = gross - ded;

                  return (
                    <div key={emp.id} className="p-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {emp.jobTitle} • {emp.department}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          Rs. {net.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Gross: Rs. {gross.toLocaleString()} | Ded: -Rs. {ded.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsBatchOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleBatchGenerate}
              icon={<Zap className="w-4 h-4 text-amber-300" />}
            >
              Confirm &amp; Generate All Payslips
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
