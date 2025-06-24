import React from 'react';
import { Clock, User, AlertCircle } from 'lucide-react';
import { statusTranslations, priorityTranslations } from '../../types';

const RecentTasks: React.FC = () => {
  const recentTasks = [
    {
      id: '1',
      title: 'تصميم كروت شخصية - شركة ABC',
      client: 'شركة ABC للتجارة',
      status: 'in-design' as const,
      priority: 'high' as const,
      assignee: 'محمد المصمم',
      dueDate: '2025-01-15',
    },
    {
      id: '2',
      title: 'تصميم بروشور - شركة XYZ',
      client: 'شركة XYZ المحدودة',
      status: 'pending-approval' as const,
      priority: 'medium' as const,
      assignee: 'سارة المبيعات',
      dueDate: '2025-01-16',
    },
    {
      id: '3',
      title: 'طباعة بانر - شركة الفعاليات',
      client: 'شركة الفعاليات والمؤتمرات',
      status: 'in-production' as const,
      priority: 'urgent' as const,
      assignee: 'ليلى الإنتاج',
      dueDate: '2025-01-14',
    },
    {
      id: '4',
      title: 'تصميم ورق رسمي - مكتب المحاماة',
      client: 'مكتب المحاماة والاستشارات',
      status: 'ready-delivery' as const,
      priority: 'low' as const,
      assignee: 'فريق الإنتاج',
      dueDate: '2025-01-17',
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'in-design': 'bg-blue-100 text-blue-800',
      'pending-approval': 'bg-yellow-100 text-yellow-800',
      'in-production': 'bg-purple-100 text-purple-800',
      'ready-delivery': 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'urgent' || priority === 'high') {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">المهام الحديثة</h3>
      <div className="space-y-4">
        {recentTasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1">
              <div className="flex items-center space-x-2 space-x-reverse mb-1">
                <h4 className="font-medium text-gray-900">{task.title}</h4>
                {getPriorityIcon(task.priority)}
              </div>
              <p className="text-sm text-gray-600">{task.client}</p>
              <div className="flex items-center space-x-4 space-x-reverse mt-2">
                <div className="flex items-center space-x-1 space-x-reverse">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">{task.assignee}</span>
                </div>
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">{task.dueDate}</span>
                </div>
              </div>
            </div>
            <div className="mr-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {statusTranslations[task.status]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTasks;