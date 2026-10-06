'use client';

import React, { useState } from 'react';
import { FileArchive, Plus, Download, Trash2, FileText, Folder } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DocumentRecord } from '@/lib/types';

export default function DocumentsPage() {
  const { state, addDocument, deleteDocument, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    category: 'Policies' as DocumentRecord['category'],
    fileType: 'PDF',
    version: 'v1.0',
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;

    addDocument({
      title: form.title.endsWith('.pdf') ? form.title : `${form.title}.pdf`,
      category: form.category,
      fileType: form.fileType,
      fileSize: '1.8 MB',
      uploadedBy: currentUser.name,
      version: form.version,
    });

    logAudit('Uploaded Corporate Document', 'documents', `Uploaded file: ${form.title} (${form.category})`, currentUser.name, currentUser.id);
    setIsModalOpen(false);
  };

  const columns: Column<DocumentRecord>[] = [
    {
      header: 'Document Name',
      accessorKey: 'title',
      sortable: true,
      render: (d) => (
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="font-semibold text-slate-900 dark:text-slate-100">{d.title}</span>
        </div>
      ),
    },
    {
      header: 'Category Folder',
      accessorKey: 'category',
      sortable: true,
      render: (d) => <Badge variant="indigo">{d.category}</Badge>,
    },
    {
      header: 'Format & Size',
      render: (d) => <span className="text-xs text-slate-500">{d.fileType} • {d.fileSize}</span>,
    },
    {
      header: 'Revision',
      accessorKey: 'version',
      render: (d) => <span className="font-mono text-xs text-slate-600 dark:text-slate-300">{d.version}</span>,
    },
    {
      header: 'Uploaded By',
      accessorKey: 'uploadedBy',
      sortable: true,
      render: (d) => (
        <div>
          <div className="text-xs font-medium text-slate-800 dark:text-slate-200">{d.uploadedBy}</div>
          <div className="text-[10px] text-slate-400">{d.uploadDate}</div>
        </div>
      ),
    },
    {
      header: 'Action',
      render: (d) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert(`Downloading ${d.title}...`)}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Download
          </Button>
          {can('documents', 'delete') && (
            <button
              onClick={() => deleteDocument(d.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              title="Delete Document"
            >
              <Trash2 className="w-4 h-4" />
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
            <FileArchive className="w-6 h-6 text-indigo-600" /> Document Management System
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralized repository for corporate contracts, HR policies, board minutes, and audit records.
          </p>
        </div>

        {can('documents', 'create') && (
          <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Upload Document
          </Button>
        )}
      </div>

      <DataTable
        data={state.documents}
        columns={columns}
        searchPlaceholder="Search documents by title, category, author..."
        searchKey={(d) => `${d.title} ${d.category} ${d.uploadedBy}`}
        exportFileName="Nexora_Corporate_Documents"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Corporate Document"
        description="Securely store a verified document in the enterprise vault."
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <Input
            label="Document Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Master Services Agreement 2026"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Classification Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as any })}
              options={[
                { label: 'Policies', value: 'Policies' },
                { label: 'Contracts', value: 'Contracts' },
                { label: 'Finance', value: 'Finance' },
                { label: 'HR', value: 'HR' },
                { label: 'Operations', value: 'Operations' },
              ]}
            />
            <Select
              label="File Format"
              value={form.fileType}
              onChange={(e) => setForm({ ...form, fileType: e.target.value })}
              options={[
                { label: 'PDF Document', value: 'PDF' },
                { label: 'Excel Spreadsheet', value: 'Excel' },
                { label: 'Word Document', value: 'Word' },
              ]}
            />
          </div>
          <Input
            label="Version Revision"
            value={form.version}
            onChange={(e) => setForm({ ...form, version: e.target.value })}
            placeholder="v1.0"
          />
          <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500">
            Click or drag files here to upload (Max 50MB per file)
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Upload Document
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
