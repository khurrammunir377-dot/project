'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Users, Contact, Receipt, CheckSquare, Package, ArrowRight } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { state } = useERPStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const empMatches = state.employees
      .filter((e) => `${e.firstName} ${e.lastName} ${e.jobTitle} ${e.department}`.toLowerCase().includes(q))
      .slice(0, 3)
      .map((e) => ({
        id: e.id,
        title: `${e.firstName} ${e.lastName}`,
        subtitle: `${e.jobTitle} • ${e.department}`,
        type: 'Employee',
        icon: Users,
        href: '/hr/employees',
      }));

    const custMatches = state.customers
      .filter((c) => `${c.name} ${c.companyName} ${c.email}`.toLowerCase().includes(q))
      .slice(0, 3)
      .map((c) => ({
        id: c.id,
        title: c.companyName,
        subtitle: `Contact: ${c.name} • ${c.email}`,
        type: 'Customer',
        icon: Contact,
        href: '/crm/customers',
      }));

    const invMatches = state.invoices
      .filter((i) => `${i.invoiceNumber} ${i.customerName}`.toLowerCase().includes(q))
      .slice(0, 3)
      .map((i) => ({
        id: i.id,
        title: `${i.invoiceNumber} - ${i.customerName}`,
        subtitle: `Total: $${i.total.toLocaleString()} • Status: ${i.status}`,
        type: 'Invoice',
        icon: Receipt,
        href: '/sales/invoices',
      }));

    const taskMatches = state.tasks
      .filter((t) => `${t.title} ${t.assigneeName}`.toLowerCase().includes(q))
      .slice(0, 3)
      .map((t) => ({
        id: t.id,
        title: t.title,
        subtitle: `Assignee: ${t.assigneeName} • Priority: ${t.priority}`,
        type: 'Task',
        icon: CheckSquare,
        href: '/tasks',
      }));

    const prodMatches = state.products
      .filter((p) => `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(q))
      .slice(0, 3)
      .map((p) => ({
        id: p.id,
        title: p.name,
        subtitle: `SKU: ${p.sku} • Stock: ${p.stock} ${p.unit}`,
        type: 'Product',
        icon: Package,
        href: '/inventory/products',
      }));

    return [...empMatches, ...custMatches, ...invMatches, ...taskMatches, ...prodMatches];
  }, [query, state]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-500" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search employees, customers, invoices, tasks, products..."
            className="w-full bg-transparent text-sm focus:outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Type keywords above to search across the entire ERP platform.
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((res) => {
                const Icon = res.icon;
                return (
                  <div
                    key={`${res.type}-${res.id}`}
                    onClick={() => {
                      router.push(res.href);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                          {res.title}
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                            {res.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{res.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Press ESC to close</span>
          <span>Tip: Navigate directly to matching records</span>
        </div>
      </div>
    </div>
  );
};
