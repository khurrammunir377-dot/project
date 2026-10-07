'use client';

import React, { useState } from 'react';
import { FolderKanban, Plus, Clock, Coins, CheckCircle2 } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatCard } from '@/components/ui/StatCard';
import { Project } from '@/lib/types';

export default function ProjectsPage() {
  const { state, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    department: 'Engineering & IT',
    manager: 'David Chen',
    budget: 150000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    priority: 'High' as Project['priority'],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-indigo-600" /> Projects Portfolio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise project delivery, milestone timelines, budget burn rates, and resource allocation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Projects"
          value={state.projects.filter((p) => p.status === 'Active').length}
          icon={<FolderKanban className="w-5 h-5" />}
          subtitle="In flight cross-functional initiatives"
          colorScheme="indigo"
        />
        <StatCard
          title="Committed Portfolio Budget"
          value={`Rs. ${(state.projects.reduce((acc, p) => acc + p.budget, 0) / 1000).toFixed(0)}k`}
          icon={<Coins className="w-5 h-5" />}
          subtitle={`Spent: Rs. ${(state.projects.reduce((acc, p) => acc + p.spent, 0) / 1000).toFixed(0)}k`}
          colorScheme="emerald"
        />
        <StatCard
          title="Average Completion Rate"
          value={`${(state.projects.reduce((acc, p) => acc + p.progressPercent, 0) / state.projects.length).toFixed(0)}%`}
          icon={<CheckCircle2 className="w-5 h-5" />}
          subtitle="On track for Q4 delivery"
          colorScheme="sky"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {state.projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <Badge variant="indigo">{proj.code}</Badge>
                <Badge variant={proj.priority === 'High' ? 'danger' : 'neutral'}>
                  {proj.priority} Priority
                </Badge>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2">
                {proj.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{proj.department}</p>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Progress</span>
                <span className="font-bold text-indigo-600">{proj.progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{ width: `${proj.progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Spent: Rs. {proj.spent.toLocaleString()}</span>
                <span>Budget: Rs. {proj.budget.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Lead: {proj.manager}</span>
              <span className="text-[11px]">Due: {proj.endDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
