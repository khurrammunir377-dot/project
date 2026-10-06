'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Apr', revenue: 180000, expenses: 95000, profit: 85000 },
  { month: 'May', revenue: 210000, expenses: 105000, profit: 105000 },
  { month: 'Jun', revenue: 245000, expenses: 120000, profit: 125000 },
  { month: 'Jul', revenue: 230000, expenses: 115000, profit: 115000 },
  { month: 'Aug', revenue: 290000, expenses: 135000, profit: 155000 },
  { month: 'Sep', revenue: 340000, expenses: 142000, profit: 198000 },
  { month: 'Oct (Proj)', revenue: 380000, expenses: 150000, profit: 230000 },
];

export const RevenueChart: React.FC = () => {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            stroke="#cbd5e1"
            tickFormatter={(val) => `$${val / 1000}k`}
          />
          <Tooltip
            formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              border: 'none',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#4f46e5"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorRev)"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="#f43f5e"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorExp)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
