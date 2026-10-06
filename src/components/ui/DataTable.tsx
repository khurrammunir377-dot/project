'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Download, Filter } from 'lucide-react';
import { Button } from './Button';
import { exportToCSV, exportToExcel } from '@/lib/export';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T | string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKey?: keyof T | ((item: T) => string);
  onRowClick?: (item: T) => void;
  pageSize?: number;
  title?: string;
  actions?: React.ReactNode;
  exportFileName?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = 'Search records...',
  searchKey,
  onRowClick,
  pageSize = 10,
  title,
  actions,
  exportFileName = 'data_export',
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Filter
  const filteredData = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter((item) => {
      if (typeof searchKey === 'function') {
        return searchKey(item).toLowerCase().includes(q);
      }
      if (searchKey && item[searchKey]) {
        return String(item[searchKey]).toLowerCase().includes(q);
      }
      // fallback search all top-level string/number keys
      return Object.values(item).some((val) =>
        String(val).toLowerCase().includes(q)
      );
    });
  }, [data, query, searchKey]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal === bVal) return 0;
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;
      if (aVal < bVal) return sortAsc ? -1 : 1;
      return sortAsc ? 1 : -1;
    });
  }, [filteredData, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key?: string) => {
    if (!key) return;
    if (sortField === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(key);
      setSortAsc(true);
    }
  };

  const handleExportCSV = () => {
    exportToCSV(sortedData, `${exportFileName}.csv`);
  };

  const handleExportExcel = () => {
    exportToExcel(sortedData, 'Export', `${exportFileName}.xlsx`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
      {/* Top Bar */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {title && <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleExportCSV} icon={<Download className="w-3.5 h-3.5" />}>
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel} icon={<Download className="w-3.5 h-3.5" />}>
            Excel
          </Button>
          {actions}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50/75 dark:bg-slate-800/50 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-slate-800">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-3 ${col.sortable ? 'cursor-pointer select-none hover:text-slate-900 dark:hover:text-white' : ''}`}
                  onClick={() => col.sortable && handleSort(col.accessorKey as string)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && sortField === col.accessorKey && (
                      <span className="text-indigo-600 dark:text-indigo-400">{sortAsc ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400">
                  No records match your criteria.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-4 py-3.5 whitespace-nowrap">
                      {col.render
                        ? col.render(row)
                        : col.accessorKey
                        ? String(row[col.accessorKey] ?? '')
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-700 dark:text-slate-300">
            {sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span> to{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {Math.min(currentPage * pageSize, sortedData.length)}
          </span> of <span className="font-semibold text-slate-700 dark:text-slate-300">{sortedData.length}</span> results
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
