import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const TaskChart: React.FC = () => {
  const barData = [
    { name: 'الأحد', tasks: 12 },
    { name: 'الاثنين', tasks: 19 },
    { name: 'الثلاثاء', tasks: 8 },
    { name: 'الأربعاء', tasks: 15 },
    { name: 'الخميس', tasks: 22 },
    { name: 'الجمعة', tasks: 7 },
    { name: 'السبت', tasks: 5 },
  ];

  const pieData = [
    { name: 'مكتملة', value: 45, color: '#10B981' },
    { name: 'قيد التنفيذ', value: 30, color: '#3B82F6' },
    { name: 'في الانتظار', value: 25, color: '#F59E0B' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">نشاط المهام الأسبوعي</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="tasks" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">توزيع حالة المهام</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskChart;