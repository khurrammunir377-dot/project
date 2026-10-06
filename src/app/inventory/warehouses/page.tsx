'use client';

import React from 'react';
import { Building2, Plus, MapPin, User, Layers, ArrowRight } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';

export default function WarehousesPage() {
  const { state } = useERPStore();
  const { can } = useAuth();

  const totalCapacity = state.warehouses.reduce((acc, w) => acc + w.capacity, 0);
  const totalOccupied = state.warehouses.reduce((acc, w) => acc + w.currentStockUnits, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600" /> Warehouses & Logistics Hubs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Multi-facility storage management, capacity utilization, and inter-warehouse stock routing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Distribution Centers"
          value={state.warehouses.length}
          icon={<Building2 className="w-5 h-5" />}
          subtitle="Operating across North America & EMEA"
          colorScheme="indigo"
        />
        <StatCard
          title="Total Storage Capacity"
          value={`${totalCapacity.toLocaleString()} Units`}
          icon={<Layers className="w-5 h-5" />}
          subtitle="Combined cubic floor space"
          colorScheme="emerald"
        />
        <StatCard
          title="Average Utilization"
          value={`${((totalOccupied / totalCapacity) * 100).toFixed(1)}%`}
          icon={<Layers className="w-5 h-5" />}
          subtitle={`${totalOccupied.toLocaleString()} units stored`}
          colorScheme="amber"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {state.warehouses.map((wh) => {
          const util = ((wh.currentStockUnits / wh.capacity) * 100).toFixed(1);
          return (
            <div
              key={wh.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="indigo">{wh.code}</Badge>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2">
                    {wh.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{wh.location}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Utilization Rate</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{util}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${util}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Current: {wh.currentStockUnits.toLocaleString()}</span>
                  <span>Max: {wh.capacity.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Manager: {wh.manager}</span>
                </div>
                <Badge variant="success">Operational</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
