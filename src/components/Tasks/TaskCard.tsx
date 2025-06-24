import React from 'react';
import { Calendar, User, AlertCircle, Clock, DollarSign, Edit, Trash2 } from 'lucide-react';
import { Task, statusTranslations, priorityTranslations, roleTranslations } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useAuthStore } from '../../store/authStore';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onEdit, onDelete }) => {
  const { user } = useAuthStore();
  
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending-design': 'bg-gray-100 text-gray-800',
      'in-design': 'bg-blue-100 text-blue-800',
      'design-review': 'bg-indigo-100 text-indigo-800',
      'pending-approval': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'in-production': 'bg-purple-100 text-purple-800',
      'ready-delivery': 'bg-emerald-100 text-emerald-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'low': 'text-gray-500',
      'medium': 'text-yellow-500',
      'high': 'text-orange-500',
      'urgent': 'text-red-500',
    };
    return colors[priority] || 'text-gray-500';
  };

  const isOverdue = task.dueDate < new Date() && task.status !== 'delivered';
  const canEdit = user?.role === 'manager' || user?.role === 'sales-manager' || task.createdBy === user?.id;
  const canDelete = user?.role === 'manager' || task.createdBy === user?.id;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group relative"
    >
      {/* Action buttons */}
      {(canEdit || canDelete) && (
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2 space-x-reverse">
          {canEdit && (
            <button
              onClick={handleEdit}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              title="تعديل المهمة"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              title="حذف المهمة"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {task.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{task.clientName}</p>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <AlertCircle className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
          {isOverdue && <Clock className="w-4 h-4 text-red-500" />}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {statusTranslations[task.status]}
        </span>
        <span className="text-sm font-medium text-gray-900 flex items-center space-x-1 space-x-reverse">
          <DollarSign className="w-4 h-4" />
          <span>{task.estimatedValue.toLocaleString()} ريال</span>
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600 space-x-2 space-x-reverse">
          <User className="w-4 h-4" />
          <span>{roleTranslations[task.assignedTeam]}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 space-x-2 space-x-reverse">
          <Calendar className="w-4 h-4" />
          <span className={isOverdue ? 'text-red-600' : ''}>
            موعد التسليم {formatDistanceToNow(task.dueDate, { addSuffix: true, locale: ar })}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mt-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Priority indicator */}
      <div className="absolute top-0 right-0 w-3 h-3 rounded-bl-lg" 
           style={{ backgroundColor: getPriorityColor(task.priority).replace('text-', '') === 'text-gray-500' ? '#6B7280' : 
                                    getPriorityColor(task.priority).replace('text-', '') === 'text-yellow-500' ? '#F59E0B' :
                                    getPriorityColor(task.priority).replace('text-', '') === 'text-orange-500' ? '#EA580C' : '#DC2626' }}>
      </div>
    </div>
  );
};

export default TaskCard;