'use client';

import React, { useState } from 'react';
import { BarChart3, Download, Filter, FileText, Users, DollarSign, Package, FolderKanban } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { exportToCSV, exportToExcel, exportTableToPDF } from '@/lib/export';

export default function ReportsPage() {
  const { state } = useERPStore();
  const [activeReport, setActiveReport] = useState<'payroll' | 'sales' | 'inventory' | 'expenses' | 'attendance'>('sales');

  const handleExportPDF = () => {
    if (activeReport === 'sales') {
      exportTableToPDF(
        'Sales Invoices Report',
        [
          { header: 'Invoice #', dataKey: 'invoiceNumber' },
          { header: 'Customer', dataKey: 'customerName' },
          { header: 'Date', dataKey: 'issueDate' },
          { header: 'Total (PKR)', dataKey: 'total' },
          { header: 'Paid (PKR)', dataKey: 'amountPaid' },
          { header: 'Status', dataKey: 'status' },
        ],
        state.invoices,
        state.settings.companyName
      );
    } else if (activeReport === 'payroll') {
      exportTableToPDF(
        'Payroll Disbursements Report',
        [
          { header: 'Payslip Ref', dataKey: 'payslipNo' },
          { header: 'Employee', dataKey: 'employeeName' },
          { header: 'Month', dataKey: 'month' },
          { header: 'Gross (PKR)', dataKey: 'grossSalary' },
          { header: 'Net Pay (PKR)', dataKey: 'netSalary' },
          { header: 'Status', dataKey: 'status' },
        ],
        state.payslips,
        state.settings.companyName
      );
    } else if (activeReport === 'inventory') {
      exportTableToPDF(
        'Inventory Stock Valuation Report',
        [
          { header: 'SKU', dataKey: 'sku' },
          { header: 'Product Name', dataKey: 'name' },
          { header: 'Category', dataKey: 'category' },
          { header: 'Stock Units', dataKey: 'stock' },
          { header: 'Cost Price (PKR)', dataKey: 'costPrice' },
          { header: 'Warehouse', dataKey: 'warehouseName' },
        ],
        state.products,
        state.settings.companyName
      );
    } else if (activeReport === 'expenses') {
      exportTableToPDF(
        'Corporate Expenses Report',
        [
          { header: 'Claim Ref', dataKey: 'claimNumber' },
          { header: 'Staff Member', dataKey: 'employeeName' },
          { header: 'Category', dataKey: 'category' },
          { header: 'Amount (PKR)', dataKey: 'amount' },
          { header: 'Date', dataKey: 'date' },
          { header: 'Status', dataKey: 'status' },
        ],
        state.expenseClaims,
        state.settings.companyName
      );
    } else if (activeReport === 'attendance') {
      exportTableToPDF(
        'Employee Attendance Audit',
        [
          { header: 'Employee', dataKey: 'employeeName' },
          { header: 'Date', dataKey: 'date' },
          { header: 'Clock In', dataKey: 'clockIn' },
          { header: 'Clock Out', dataKey: 'clockOut' },
          { header: 'Hours', dataKey: 'workingHours' },
          { header: 'Status', dataKey: 'status' },
        ],
        state.attendance,
        state.settings.companyName
      );
    }
  };

  const handleExportExcel = () => {
    const dataMap: Record<string, any[]> = {
      sales: state.invoices,
      payroll: state.payslips,
      inventory: state.products,
      expenses: state.expenseClaims,
      attendance: state.attendance,
    };
    exportToExcel(dataMap[activeReport], `${activeReport.toUpperCase()}_Report`, `Nexora_${activeReport}_Report.xlsx`);
  };

  const handleExportCSV = () => {
    const dataMap: Record<string, any[]> = {
      sales: state.invoices,
      payroll: state.payslips,
      inventory: state.products,
      expenses: state.expenseClaims,
      attendance: state.attendance,
    };
    exportToCSV(dataMap[activeReport], `Nexora_${activeReport}_Report.csv`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" /> Enterprise Intelligence & Reporting
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Executive audit reports, financial exports, compliance statements, and cross-department analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} icon={<Download className="w-3.5 h-3.5" />}>
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel} icon={<Download className="w-3.5 h-3.5" />}>
            Export Excel
          </Button>
          <Button size="sm" onClick={handleExportPDF} icon={<Download className="w-3.5 h-3.5" />}>
            Export Formal PDF
          </Button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { key: 'sales', label: 'Commercial & Sales', icon: DollarSign },
          { key: 'payroll', label: 'Payroll & Comp', icon: Users },
          { key: 'inventory', label: 'Inventory & Stock', icon: Package },
          { key: 'expenses', label: 'Expense Claims', icon: FileText },
          { key: 'attendance', label: 'Attendance Audit', icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReport === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveReport(tab.key as any)}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                isActive
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Report Preview Card */}
      <Card
        title={`Live Preview: ${activeReport.toUpperCase()} Consolidated Report`}
        subtitle={`Total active records: ${
          activeReport === 'sales'
            ? state.invoices.length
            : activeReport === 'payroll'
            ? state.payslips.length
            : activeReport === 'inventory'
            ? state.products.length
            : activeReport === 'expenses'
            ? state.expenseClaims.length
            : state.attendance.length
        }`}
      >
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 font-semibold uppercase text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                {activeReport === 'sales' && (
                  <>
                    <th className="p-2.5">Invoice #</th>
                    <th className="p-2.5">Customer</th>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Total Amount</th>
                    <th className="p-2.5">Balance Due</th>
                    <th className="p-2.5">Status</th>
                  </>
                )}
                {activeReport === 'payroll' && (
                  <>
                    <th className="p-2.5">Payslip #</th>
                    <th className="p-2.5">Staff Member</th>
                    <th className="p-2.5">Period</th>
                    <th className="p-2.5">Gross Pay</th>
                    <th className="p-2.5">Net Pay</th>
                    <th className="p-2.5">Status</th>
                  </>
                )}
                {activeReport === 'inventory' && (
                  <>
                    <th className="p-2.5">SKU</th>
                    <th className="p-2.5">Product Name</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Units in Stock</th>
                    <th className="p-2.5">Warehouse</th>
                  </>
                )}
                {activeReport === 'expenses' && (
                  <>
                    <th className="p-2.5">Claim #</th>
                    <th className="p-2.5">Staff Member</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Amount</th>
                    <th className="p-2.5">Status</th>
                  </>
                )}
                {activeReport === 'attendance' && (
                  <>
                    <th className="p-2.5">Staff Member</th>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Clock In</th>
                    <th className="p-2.5">Hours</th>
                    <th className="p-2.5">Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {activeReport === 'sales' &&
                state.invoices.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-2.5 font-mono text-indigo-600 font-semibold">{i.invoiceNumber}</td>
                    <td className="p-2.5 font-medium">{i.customerName}</td>
                    <td className="p-2.5">{i.issueDate}</td>
                    <td className="p-2.5 font-bold">Rs. {i.total.toLocaleString()}</td>
                    <td className="p-2.5 text-rose-600 font-semibold">Rs. {i.balanceDue.toLocaleString()}</td>
                    <td className="p-2.5">{i.status}</td>
                  </tr>
                ))}
              {activeReport === 'payroll' &&
                state.payslips.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-2.5 font-mono text-indigo-600 font-semibold">{p.payslipNo}</td>
                    <td className="p-2.5 font-medium">{p.employeeName}</td>
                    <td className="p-2.5">{p.month} {p.year}</td>
                    <td className="p-2.5">Rs. {p.grossSalary.toLocaleString()}</td>
                    <td className="p-2.5 font-bold text-slate-900 dark:text-slate-100">Rs. {p.netSalary.toLocaleString()}</td>
                    <td className="p-2.5">{p.status}</td>
                  </tr>
                ))}
              {activeReport === 'inventory' &&
                state.products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-2.5 font-mono text-indigo-600 font-semibold">{p.sku}</td>
                    <td className="p-2.5 font-medium">{p.name}</td>
                    <td className="p-2.5">{p.category}</td>
                    <td className="p-2.5 font-bold">{p.stock} {p.unit}</td>
                    <td className="p-2.5">{p.warehouseName}</td>
                  </tr>
                ))}
              {activeReport === 'expenses' &&
                state.expenseClaims.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-2.5 font-mono text-indigo-600 font-semibold">{e.claimNumber}</td>
                    <td className="p-2.5 font-medium">{e.employeeName}</td>
                    <td className="p-2.5">{e.category}</td>
                    <td className="p-2.5 font-bold">Rs. {e.amount.toLocaleString()}</td>
                    <td className="p-2.5">{e.status}</td>
                  </tr>
                ))}
              {activeReport === 'attendance' &&
                state.attendance.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-2.5 font-medium">{a.employeeName}</td>
                    <td className="p-2.5">{a.date}</td>
                    <td className="p-2.5 font-mono">{a.clockIn}</td>
                    <td className="p-2.5 font-semibold">{a.workingHours} hrs</td>
                    <td className="p-2.5">{a.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
