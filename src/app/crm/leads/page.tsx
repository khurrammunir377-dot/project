'use client';

import React, { useState } from 'react';
import { TrendingUp, Plus, DollarSign, Calendar, UserCheck } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatCard } from '@/components/ui/StatCard';
import { Lead } from '@/lib/types';

const STAGES: Lead['stage'][] = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];

export default function LeadsPage() {
  const { state, addLead, updateLeadStage, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    company: '',
    contactName: '',
    email: '',
    phone: '',
    stage: 'Lead' as Lead['stage'],
    value: 50000,
    probability: 50,
    assignedTo: 'Rachel Vance',
    expectedCloseDate: '2026-11-30',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.company) return;

    addLead({
      title: form.title,
      company: form.company,
      contactName: form.contactName || 'Key Contact',
      email: form.email || 'contact@client.com',
      phone: form.phone || '+1 555-0199',
      stage: form.stage,
      value: Number(form.value),
      probability: Number(form.probability),
      assignedTo: form.assignedTo,
      expectedCloseDate: form.expectedCloseDate,
    });

    logAudit('Created Sales Lead', 'sales', `New deal registered: ${form.title} ($${form.value})`, currentUser.name, currentUser.id);
    setIsModalOpen(false);
  };

  const totalPipelineValue = state.leads.reduce((acc, l) => acc + l.value, 0);
  const weightedPipeline = state.leads.reduce((acc, l) => acc + (l.value * l.probability) / 100, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" /> Sales Pipeline & Deals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visual deal flow stages (Lead → Qualified → Proposal → Negotiation → Won/Lost).
          </p>
        </div>

        {can('sales', 'create') && (
          <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Create New Deal
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Pipeline Volume"
          value={`Rs. ${(totalPipelineValue / 1000).toFixed(0)}k`}
          icon={<DollarSign className="w-5 h-5" />}
          subtitle="Gross potential contract value"
          colorScheme="indigo"
        />
        <StatCard
          title="Weighted Pipeline Value"
          value={`Rs. ${(weightedPipeline / 1000).toFixed(0)}k`}
          icon={<TrendingUp className="w-5 h-5" />}
          subtitle="Probability-adjusted forecast"
          colorScheme="emerald"
        />
        <StatCard
          title="Active Opportunities"
          value={state.leads.filter((l) => l.stage !== 'Lost').length}
          icon={<UserCheck className="w-5 h-5" />}
          subtitle="High-velocity enterprise deals"
          colorScheme="sky"
        />
      </div>

      {/* Visual Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {STAGES.map((stage) => {
          const leadsInStage = state.leads.filter((l) => l.stage === stage);
          const stageValue = leadsInStage.reduce((acc, l) => acc + l.value, 0);

          return (
            <div
              key={stage}
              className="bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 flex flex-col min-h-[420px]"
            >
              <div className="pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{stage}</span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {leadsInStage.length}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  Rs. ${(stageValue / 1000).toFixed(0)}k
                </div>
              </div>

              <div className="space-y-2 flex-1">
                {leadsInStage.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700 rounded-lg p-3 shadow-sm space-y-2 text-xs hover:border-indigo-400 transition-colors"
                  >
                    <div className="font-bold text-slate-900 dark:text-slate-100">{lead.title}</div>
                    <div className="text-[11px] text-slate-500">{lead.company}</div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-900 dark:text-white">
                        Rs. {lead.value.toLocaleString()}
                      </span>
                      <span className="text-indigo-600 font-semibold">{lead.probability}% Prob</span>
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-center justify-between">
                      <span>Close: {lead.expectedCloseDate}</span>
                      <span>{lead.assignedTo.split(' ')[0]}</span>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                      <select
                        value={lead.stage}
                        onChange={(e) => updateLeadStage(lead.id, e.target.value as any)}
                        className="text-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5"
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>
                            Move: {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Sales Deal"
        description="Add a high-value opportunity to the commercial sales pipeline."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Deal Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Multi-Site Cloud License Upgrade"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Company / Prospect"
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="e.g. Horizon Logistics"
            />
            <Input
              label="Contact Person"
              value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              placeholder="e.g. Sarah Connor"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Deal Value (PKR)"
              type="number"
              required
              value={form.value}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
            />
            <Input
              label="Win Probability (%)"
              type="number"
              min={0}
              max={100}
              value={form.probability}
              onChange={(e) => setForm({ ...form, probability: Number(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Initial Stage"
              value={form.stage}
              onChange={(e) => setForm({ ...form, stage: e.target.value as any })}
              options={STAGES.map((s) => ({ label: s, value: s }))}
            />
            <Input
              label="Target Close Date"
              type="date"
              value={form.expectedCloseDate}
              onChange={(e) => setForm({ ...form, expectedCloseDate: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Deal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
