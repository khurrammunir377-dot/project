'use client';

import React from 'react';
import { ShieldAlert, Shield, Clock, User, Filter } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { AuditLog } from '@/lib/types';

export default function AuditLogsPage() {
  const { state } = useERPStore();

  const columns: Column<AuditLog>[] = [
    {
      header: 'Timestamp',
      accessorKey: 'timestamp',
      sortable: true,
      render: (log) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{log.timestamp}</span>
        </div>
      ),
    },
    {
      header: 'User Persona',
      accessorKey: 'userName',
      sortable: true,
      render: (log) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{log.userName}</div>
          <div className="text-[10px] text-slate-400 font-mono">IP: {log.ipAddress}</div>
        </div>
      ),
    },
    {
      header: 'Action Taken',
      accessorKey: 'action',
      sortable: true,
      render: (log) => <span className="font-bold text-slate-800 dark:text-slate-200">{log.action}</span>,
    },
    {
      header: 'Target Module',
      accessorKey: 'module',
      sortable: true,
      render: (log) => <Badge variant="indigo">{log.module}</Badge>,
    },
    {
      header: 'Event Details',
      accessorKey: 'details',
      render: (log) => (
        <span className="text-xs text-slate-600 dark:text-slate-300 max-w-md truncate block">
          {log.details}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-indigo-600" /> Security Audit Logs & Governance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable tracking of user authentication, approvals, deletions, and administrative actions.
          </p>
        </div>
      </div>

      <DataTable
        data={state.auditLogs}
        columns={columns}
        searchPlaceholder="Filter audit events by action, user, module..."
        searchKey={(log) => `${log.action} ${log.userName} ${log.module} ${log.details}`}
        exportFileName="Nexora_Security_Audit_Trail"
      />
    </div>
  );
}
