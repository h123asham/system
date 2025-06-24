import React, { useState } from 'react';
import { X, Calendar, User, DollarSign, FileText, MessageSquare, Clock, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Task, TaskStatus, statusTranslations, roleTranslations } from '../../types';
import { formatDistanceToNow, format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';

interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, onEdit, onDelete }) => {
  const { user } = useAuthStore();
  const { updateTaskStatus, canUpdateStatus, getAvailableStatuses } = useTaskStore();
  const [newNote, setNewNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(task.status);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  if (!isOpen) return null;

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

  const handleStatusUpdate = () => {
    if (selectedStatus !== task.status) {
      // Check if this is a rejection (moving from pending-approval to design-review)
      if (task.status === 'pending-approval' && selectedStatus === 'design-review') {
        setShowRejectionModal(true);
        return;
      }
      
      updateTaskStatus(task.id, selectedStatus);
      onClose();
    }
  };

  const handleRejection = () => {
    updateTaskStatus(task.id, selectedStatus, rejectionReason);
    setShowRejectionModal(false);
    setRejectionReason('');
    onClose();
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      // Add note logic here - would typically update the task with new note
      setNewNote('');
    }
  };

  const canEdit = user?.role === 'manager' || user?.role === 'sales-manager' || task.createdBy === user?.id;
  const canDelete = user?.role === 'manager' || task.createdBy === user?.id;
  const availableStatuses = user ? getAvailableStatuses(task.status, user.role) : [];

  // Special handling for manager approval
  const isManagerApproval = task.status === 'pending-approval' && user?.role === 'manager';

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
            <div className="flex items-center space-x-2 space-x-reverse">
              {canEdit && (
                <button
                  onClick={onEdit}
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  title="تعديل المهمة"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
              {canDelete && (
                <button
                  onClick={onDelete}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  title="حذف المهمة"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">تفاصيل المهمة</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">العميل</label>
                      <p className="text-gray-900">{task.clientName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">معلومات الاتصال</label>
                      <p className="text-gray-900">{task.clientContact}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">الوصف</label>
                    <p className="text-gray-900">{task.description}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">المواصفات الفنية</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">الكمية</label>
                      <p className="text-gray-900">{task.specifications.quantity}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">المقاس</label>
                      <p className="text-gray-900">{task.specifications.size}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">المادة</label>
                      <p className="text-gray-900">{task.specifications.material}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">الألوان</label>
                      <p className="text-gray-900">{task.specifications.colors}</p>
                    </div>
                  </div>
                  {task.specifications.finishes.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">التشطيبات</label>
                      <p className="text-gray-900">{task.specifications.finishes.join(', ')}</p>
                    </div>
                  )}
                  {task.specifications.specialInstructions && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">تعليمات خاصة</label>
                      <p className="text-gray-900">{task.specifications.specialInstructions}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">الملاحظات والتعليقات</h3>
                <div className="space-y-3">
                  {task.notes.map((note) => (
                    <div key={note.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{note.userName}</span>
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(note.createdAt, { addSuffix: true, locale: ar })}
                        </span>
                      </div>
                      <p className="text-gray-700">{note.message}</p>
                    </div>
                  ))}
                  <div className="flex space-x-3 space-x-reverse">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="إضافة ملاحظة..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddNote}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      إضافة
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">الحالة والجدولة</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">الحالة الحالية</label>
                    <div className="mt-1">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                        {statusTranslations[task.status]}
                      </span>
                    </div>
                  </div>

                  {availableStatuses.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">تحديث الحالة</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as TaskStatus)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={task.status}>{statusTranslations[task.status]}</option>
                        {availableStatuses.map((status) => (
                          <option key={status} value={status}>
                            {statusTranslations[status]}
                          </option>
                        ))}
                      </select>
                      
                      {selectedStatus !== task.status && (
                        <div className="mt-2">
                          {isManagerApproval && selectedStatus === 'approved' && (
                            <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-medium text-green-800">
                                  الموافقة على المهمة ونقلها إلى الإنتاج
                                </span>
                              </div>
                            </div>
                          )}
                          
                          {isManagerApproval && selectedStatus === 'design-review' && (
                            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <span className="text-sm font-medium text-red-800">
                                  رفض المهمة وإرجاعها للتصميم
                                </span>
                              </div>
                            </div>
                          )}
                          
                          <button
                            onClick={handleStatusUpdate}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            تحديث الحالة
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">التفاصيل</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm space-x-2 space-x-reverse">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">موعد التسليم:</span>
                    <span className="font-medium">{format(task.dueDate, 'dd MMM yyyy', { locale: ar })}</span>
                  </div>
                  <div className="flex items-center text-sm space-x-2 space-x-reverse">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">مسند إلى:</span>
                    <span className="font-medium">{roleTranslations[task.assignedTeam]}</span>
                  </div>
                  <div className="flex items-center text-sm space-x-2 space-x-reverse">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">القيمة:</span>
                    <span className="font-medium">{task.estimatedValue.toLocaleString()} ريال</span>
                  </div>
                  <div className="flex items-center text-sm space-x-2 space-x-reverse">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">تم الإنشاء:</span>
                    <span className="font-medium">
                      {formatDistanceToNow(task.createdAt, { addSuffix: true, locale: ar })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">سبب الرفض</h3>
              <button
                onClick={() => setShowRejectionModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                يرجى توضيح سبب رفض المهمة (اختياري)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: يحتاج تعديل في التصميم، أو معلومات ناقصة..."
              />
            </div>
            
            <div className="flex space-x-3 space-x-reverse">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleRejection}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                رفض المهمة
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskModal;