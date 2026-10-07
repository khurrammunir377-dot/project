'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const data = [
  { month: 'Apr', revenue: 1800000, expenses: 950000, profit: 850000 },
  { month: 'May', revenue: 2100000, expenses: 1050000, profit: 1050000 },
  { month: 'Jun', revenue: 2450000, expenses: 1200000, profit: 1250000 },
  { month: 'Jul', revenue: 2300000, expenses: 1150000, profit: 1150000 },
  { month: 'Aug', revenue: 2900000, expenses: 1350000, profit: 1550000 },
  { month: 'Sep', revenue: 3400000, expenses: 1420000, profit: 1980000 },
  { month: 'Oct (Proj)', revenue: 3800000, expenses: 1500000, profit: 2300000 },
];

export const RevenueChart: React.FC = () => {
  const [showRevenue, setShowRevenue] = useState(true);
  const [showExpenses, setShowExpenses] = useState(true);
  const [showProfit, setShowProfit] = useState(true);

  return (
    <div className="space-y-3 w-full">
      {/* Interactive Series Toggle Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 pb-2 border-b border-slate-100 dark:border-slate-800">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Filter Trajectory Series:
        </span>
        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setShowRevenue(!showRevenue)}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 border ${
              showRevenue
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            <span>Revenue</span>
          </button>

          <button
            type="button"
            onClick={() => setShowExpenses(!showExpenses)}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 border ${
              showExpenses
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>OpEx Expenses</span>
          </button>

          <button
            type="button"
            onClick={() => setShowProfit(!showProfit)}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 border ${
              showProfit
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Net Margin</span>
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              stroke="#cbd5e1"
              tickFormatter={(val) => `Rs. ${(val / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              formatter={(value: any, name: any) => [
                `Rs. ${Number(value).toLocaleString()}`,
                name === 'revenue' ? 'Gross Revenue' : name === 'expenses' ? 'OpEx' : 'Net Margin',
              ]}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderRadius: '12px',
                border: '1px solid #1e293b',
                color: '#f8fafc',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
              }}
            />
            {showRevenue && (
              <Area
                type="monotone"
                dataKey="revenue"
                name="Gross Revenue"
                stroke="#4f46e5"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRev)"
              />
            )}
            {showExpenses && (
              <Area
                type="monotone"
                dataKey="expenses"
                name="Operational Expenses"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorExp)"
              />
            )}
            {showProfit && (
              <Area
                type="monotone"
                dataKey="profit"
                name="Net Margin"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorProfit)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

