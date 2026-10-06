'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const data = [
  { name: 'Engineering & IT', value: 22, color: '#4f46e5' },
  { name: 'Sales & BD', value: 14, color: '#06b6d4' },
  { name: 'Customer Support', value: 12, color: '#10b981' },
  { name: 'Supply Chain', value: 11, color: '#f59e0b' },
  { name: 'Human Resources', value: 8, color: '#ec4899' },
  { name: 'Finance & Admin', value: 10, color: '#8b5cf6' },
];

export const DepartmentPieChart: React.FC = () => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => [`${value} staff members`, 'Headcount']}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              border: 'none',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
