'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const attendanceData = [
  { day: 'Mon', onTime: 68, late: 4, onLeave: 3 },
  { day: 'Tue', onTime: 71, late: 2, onLeave: 2 },
  { day: 'Wed', onTime: 70, late: 3, onLeave: 2 },
  { day: 'Thu', onTime: 69, late: 5, onLeave: 1 },
  { day: 'Fri', onTime: 66, late: 6, onLeave: 3 },
];

export const AttendanceChart: React.FC = () => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              border: 'none',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
          <Bar dataKey="onTime" name="On Time" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
          <Bar dataKey="late" name="Late" fill="#f59e0b" radius={[0, 0, 0, 0]} stackId="a" />
          <Bar dataKey="onLeave" name="On Leave" fill="#6366f1" radius={[4, 4, 0, 0]} stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
