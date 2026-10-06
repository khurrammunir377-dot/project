'use client';

import React, { useState } from 'react';
import { Award, Plus, Star, Target, CheckCircle } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatCard } from '@/components/ui/StatCard';
import { PerformanceReview } from '@/lib/types';

export default function PerformancePage() {
  const { state, addPerformanceReview, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    employeeName: 'Michael Scott',
    period: 'Q3 2026',
    score: 4.5,
    goalsMetPercent: 95,
    strengths: 'Outstanding commitment to sprint velocity.',
    improvements: 'Focus on documentation.',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = state.employees.find((e) => `${e.firstName} ${e.lastName}` === form.employeeName) || state.employees[0];

    addPerformanceReview({
      employeeId: emp.employeeId,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      department: emp.department,
      period: form.period,
      score: Number(form.score),
      goalsMetPercent: Number(form.goalsMetPercent),
      strengths: form.strengths,
      improvements: form.improvements,
      status: 'Completed',
      reviewedBy: currentUser.name,
    });

    logAudit(
      'Submitted Performance Review',
      'performance',
      `Performance review logged for ${form.employeeName} (${form.period})`,
      currentUser.name,
      currentUser.id
    );

    setIsModalOpen(false);
  };

  const columns: Column<PerformanceReview>[] = [
    {
      header: 'Staff Member',
      accessorKey: 'employeeName',
      sortable: true,
      render: (r) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{r.employeeName}</div>
          <div className="text-xs text-slate-400">{r.department}</div>
        </div>
      ),
    },
    {
      header: 'Review Period',
      accessorKey: 'period',
      sortable: true,
    },
    {
      header: 'Overall Rating',
      accessorKey: 'score',
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-1 font-bold text-amber-500">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{r.score.toFixed(1)} / 5.0</span>
        </div>
      ),
    },
    {
      header: 'KPI Goal Attainment',
      accessorKey: 'goalsMetPercent',
      sortable: true,
      render: (r) => (
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          {r.goalsMetPercent}% Met
        </span>
      ),
    },
    {
      header: 'Key Strengths',
      accessorKey: 'strengths',
      render: (r) => (
        <span className="text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate block">
          {r.strengths}
        </span>
      ),
    },
    {
      header: 'Evaluated By',
      accessorKey: 'reviewedBy',
      render: (r) => <span className="text-xs text-slate-500">{r.reviewedBy}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-600" /> Performance & KPI Appraisals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Goal setting, continuous performance reviews, 360-degree feedback, and rating scores.
          </p>
        </div>

        {can('performance', 'create') && (
          <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            New Appraisal
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Average Organization Score"
          value="4.7 / 5.0"
          icon={<Star className="w-5 h-5" />}
          subtitle="Across active quarterly cycles"
          colorScheme="amber"
        />
        <StatCard
          title="Goal Completion Rate"
          value="104%"
          icon={<Target className="w-5 h-5" />}
          subtitle="Above organizational targets"
          colorScheme="emerald"
        />
        <StatCard
          title="Appraisals Completed"
          value={state.performanceReviews.length}
          icon={<CheckCircle className="w-5 h-5" />}
          subtitle="Q3 Cycle Closed"
          colorScheme="indigo"
        />
      </div>

      <DataTable
        data={state.performanceReviews}
        columns={columns}
        searchPlaceholder="Search reviews by employee, period, evaluator..."
        searchKey={(r) => `${r.employeeName} ${r.department} ${r.period}`}
        exportFileName="Nexora_Performance_Reviews"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Conduct Performance Review"
        description="Evaluate employee key objectives and assign performance ratings."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Select
            label="Staff Member"
            value={form.employeeName}
            onChange={(e) => setForm({ ...form, employeeName: e.target.value })}
            options={state.employees.map((e) => ({
              label: `${e.firstName} ${e.lastName} - ${e.jobTitle}`,
              value: `${e.firstName} ${e.lastName}`,
            }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Evaluation Period"
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
              options={[
                { label: 'Q3 2026', value: 'Q3 2026' },
                { label: 'Q4 2026', value: 'Q4 2026' },
                { label: 'Annual 2026', value: 'Annual 2026' },
              ]}
            />
            <Input
              label="Rating (1.0 to 5.0)"
              type="number"
              step="0.1"
              min={1}
              max={5}
              value={form.score}
              onChange={(e) => setForm({ ...form, score: Number(e.target.value) })}
            />
          </div>
          <Input
            label="Goals Met Percentage (%)"
            type="number"
            value={form.goalsMetPercent}
            onChange={(e) => setForm({ ...form, goalsMetPercent: Number(e.target.value) })}
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Demonstrated Strengths
            </label>
            <textarea
              rows={2}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2 text-sm bg-white dark:bg-slate-900 focus:outline-none"
              value={form.strengths}
              onChange={(e) => setForm({ ...form, strengths: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Development Areas & Improvements
            </label>
            <textarea
              rows={2}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2 text-sm bg-white dark:bg-slate-900 focus:outline-none"
              value={form.improvements}
              onChange={(e) => setForm({ ...form, improvements: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Record Appraisal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
