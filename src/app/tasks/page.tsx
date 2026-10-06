'use client';

import React, { useState } from 'react';
import { CheckSquare, Plus, Clock, MessageSquare, AlertCircle, Trash2 } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Task } from '@/lib/types';

const STATUSES: Task['status'][] = ['Backlog', 'To Do', 'In Progress', 'Review', 'Completed'];

export default function TasksPage() {
  const { state, addTask, updateTaskStatus, deleteTask, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    assigneeName: 'Michael Scott',
    priority: 'Medium' as Task['priority'],
    status: 'To Do' as Task['status'],
    dueDate: '2026-10-25',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;

    const emp = state.employees.find((x) => `${x.firstName} ${x.lastName}` === form.assigneeName) || state.employees[0];

    addTask({
      title: form.title,
      description: form.description || 'Deliver task requirements per specification.',
      assigneeId: emp.employeeId,
      assigneeName: `${emp.firstName} ${emp.lastName}`,
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate,
    });

    logAudit('Created Task', 'tasks', `Task added: ${form.title} (Assigned to ${form.assigneeName})`, currentUser.name, currentUser.id);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-600" /> Tasks & Sprint Board
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kanban sprint board for tracking engineering, operations, and cross-department assignments.
          </p>
        </div>

        {can('tasks', 'create') && (
          <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Create Task
          </Button>
        )}
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {STATUSES.map((status) => {
          const tasksInStatus = state.tasks.filter((t) => t.status === status);

          return (
            <div
              key={status}
              className="bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 flex flex-col min-h-[440px]"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{status}</span>
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold flex items-center justify-center">
                  {tasksInStatus.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1">
                {tasksInStatus.map((task) => {
                  const priorityColors: Record<string, any> = {
                    Urgent: 'danger',
                    High: 'warning',
                    Medium: 'indigo',
                    Low: 'neutral',
                  };

                  return (
                    <div
                      key={task.id}
                      className="bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700 rounded-lg p-3 shadow-sm space-y-2 text-xs hover:border-indigo-400 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <Badge variant={priorityColors[task.priority]} size="sm">
                          {task.priority}
                        </Badge>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-0.5"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                        {task.title}
                      </div>

                      <p className="text-[11px] text-slate-500 line-clamp-2">{task.description}</p>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                          <span>{task.assigneeName.split(' ')[0]}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{task.dueDate}</span>
                        </div>
                      </div>

                      <div className="pt-1">
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                          className="w-full text-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-1 text-slate-600 dark:text-slate-300"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              Status: {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Sprint Task"
        description="Assign a deliverable to a team member."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Task Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Implement Webhook Dispatcher"
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Task Description & Criteria
            </label>
            <textarea
              rows={2}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2 text-sm bg-white dark:bg-slate-900 focus:outline-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Outline steps to complete..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Assigned To"
              value={form.assigneeName}
              onChange={(e) => setForm({ ...form, assigneeName: e.target.value })}
              options={state.employees.map((e) => ({
                label: `${e.firstName} ${e.lastName} (${e.jobTitle})`,
                value: `${e.firstName} ${e.lastName}`,
              }))}
            />
            <Select
              label="Priority"
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
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Initial Column"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as any })}
              options={STATUSES.map((s) => ({ label: s, value: s }))}
            />
            <Input
              label="Due Date"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Assign Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
