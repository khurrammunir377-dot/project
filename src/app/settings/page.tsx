'use client';

import React, { useState } from 'react';
import { Settings, Save, Download, Upload, RotateCcw, ShieldCheck, Building, DollarSign } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function SettingsPage() {
  const { state, updateSettings, resetAllData, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();

  const [form, setForm] = useState({ ...state.settings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    logAudit('Updated Company Settings', 'settings', 'Updated organizational profile & localization preferences', currentUser.name, currentUser.id);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDownloadBackup = () => {
    const backupJson = JSON.stringify(state, null, 2);
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Nexora_ERP_Full_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    logAudit('Exported System Backup', 'settings', 'Full database snapshot downloaded', currentUser.name, currentUser.id);
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported && imported.employees) {
          localStorage.setItem('NEXORA_ERP_DATABASE_V2', JSON.stringify(imported));
          window.location.reload();
        } else {
          alert('Invalid backup file structure.');
        }
      } catch (err) {
        alert('Failed to parse JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data to default demo seed values? This will erase custom records.')) {
      resetAllData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600" /> Platform & Enterprise Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global corporate parameters, financial currency formatting, data backups, and security policies.
          </p>
        </div>

        {saveSuccess && (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-200">
            Settings saved successfully!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Identity */}
        <Card title="Corporate Identity & Profile" subtitle="Primary legal entity information displayed on official documents">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Legal Name"
              required
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />
            <Input
              label="Registration Number"
              value={form.registrationNumber}
              onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
            />
            <Input
              label="Tax / VAT ID"
              value={form.taxNumber}
              onChange={(e) => setForm({ ...form, taxNumber: e.target.value })}
            />
            <Input
              label="Official Contact Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Official Telephone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              label="Corporate Website"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
            <div className="col-span-1 sm:col-span-2">
              <Input
                label="Registered Headquarters Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>
        </Card>

        {/* Currency & Localization */}
        <Card title="Localization & Working Hours" subtitle="Date formats, primary operational currency, and fiscal rules">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Operational Currency Code"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            />
            <Input
              label="Currency Symbol"
              value={form.currencySymbol}
              onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
            />
            <Input
              label="Enterprise Timezone"
              value={form.timeZone}
              onChange={(e) => setForm({ ...form, timeZone: e.target.value })}
            />
            <Input
              label="Standard Daily Work Hours"
              type="number"
              value={form.standardWorkHoursPerDay}
              onChange={(e) => setForm({ ...form, standardWorkHoursPerDay: Number(e.target.value) })}
            />
            <Input
              label="Working Days per Week"
              type="number"
              value={form.workingDaysPerWeek}
              onChange={(e) => setForm({ ...form, workingDaysPerWeek: Number(e.target.value) })}
            />
            <Input
              label="Fiscal Year Commencement"
              value={form.fiscalYearStart}
              onChange={(e) => setForm({ ...form, fiscalYearStart: e.target.value })}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />}>
            Save Changes
          </Button>
        </div>
      </form>

      {/* Backup, Recovery & Maintenance Section */}
      <Card title="Database Maintenance & Disaster Recovery" subtitle="Full JSON data snapshots, migrations, and system restorations">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Export Complete Database Snapshot
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Download all employees, invoices, tasks, products, accounts, and logs as a single JSON file.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownloadBackup} icon={<Download className="w-3.5 h-3.5" />}>
            Download Backup (.json)
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 mt-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Restore from Backup Snapshot
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a previously exported JSON file to restore the entire ERP state.
            </p>
          </div>
          <label className="inline-flex items-center justify-center font-medium rounded-lg transition-all border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs gap-1.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
            <Upload className="w-3.5 h-3.5" />
            <span>Select File to Restore</span>
            <input type="file" accept=".json" onChange={handleRestoreBackup} className="hidden" />
          </label>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 mt-3 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/30 dark:bg-rose-950/20">
          <div>
            <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
              Reset to Factory Seed Data
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Clear local modifications and re-populate the ERP with clean, pristine enterprise seed records.
            </p>
          </div>
          <Button variant="danger" size="sm" onClick={handleResetData} icon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset All Data
          </Button>
        </div>
      </Card>
    </div>
  );
}
