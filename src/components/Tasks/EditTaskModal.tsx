import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { Task, TaskPriority, UserRole, TaskStatus, statusTranslations, priorityTranslations, roleTranslations } from '../../types';
import toast from 'react-hot-toast';

interface EditTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, isOpen, onClose }) => {
  const { updateTask } = useTaskStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientName: '',
    clientContact: '',
    priority: 'medium' as TaskPriority,
    status: 'pending-design' as TaskStatus,
    assignedTeam: 'design-team' as UserRole,
    dueDate: '',
    estimatedValue: '',
    specifications: {
      quantity: '',
      size: '',
      material: '',
      colors: '',
      finishes: [] as string[],
      specialInstructions: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task && isOpen) {
      setFormData({
        title: task.title,
        description: task.description,
        clientName: task.clientName,
        clientContact: task.clientContact,
        priority: task.priority,
        status: task.status,
        assignedTeam: task.assignedTeam,
        dueDate: task.dueDate.toISOString().split('T')[0],
        estimatedValue: task.estimatedValue.toString(),
        specifications: {
          quantity: task.specifications.quantity.toString(),
          size: task.specifications.size,
          material: task.specifications.material,
          colors: task.specifications.colors,
          finishes: [...task.specifications.finishes],
          specialInstructions: task.specifications.specialInstructions || ''
        }
      });
    }
  }, [task, isOpen]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updates: Partial<Task> = {
        title: formData.title,
        description: formData.description,
        clientName: formData.clientName,
        clientContact: formData.clientContact,
        priority: formData.priority,
        status: formData.status,
        assignedTeam: formData.assignedTeam,
        dueDate: new Date(formData.dueDate),
        estimatedValue: parseFloat(formData.estimatedValue) || 0,
        specifications: {
          quantity: parseInt(formData.specifications.quantity) || 0,
          size: formData.specifications.size,
          material: formData.specifications.material,
          colors: formData.specifications.colors,
          finishes: formData.specifications.finishes,
          specialInstructions: formData.specifications.specialInstructions
        }
      };

      updateTask(task.id, updates);
      toast.success('تم تحديث المهمة بنجاح');
      onClose();
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث المهمة');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishToggle = (finish: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        finishes: prev.specifications.finishes.includes(finish)
          ? prev.specifications.finishes.filter(f => f !== finish)
          : [...prev.specifications.finishes, finish]
      }
    }));
  };

  const availableFinishes = ['لامينيشن لامع', 'لامينيشن مطفي', 'طلاء UV', 'تذهيب', 'فضي', 'نقش بارز'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">تعديل المهمة</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">المعلومات الأساسية</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان المهمة *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      وصف المهمة
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اسم العميل *
                      </label>
                      <input
                        type="text"
                        value={formData.clientName}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        معلومات الاتصال
                      </label>
                      <input
                        type="text"
                        value={formData.clientContact}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientContact: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الأولوية
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">منخفضة</option>
                        <option value="medium">متوسطة</option>
                        <option value="high">عالية</option>
                        <option value="urgent">عاجلة</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الحالة
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as TaskStatus }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pending-design">في انتظار التصميم</option>
                        <option value="in-design">قيد التصميم</option>
                        <option value="design-review">مراجعة التصميم</option>
                        <option value="pending-approval">في انتظار الموافقة</option>
                        <option value="approved">تمت الموافقة</option>
                        <option value="in-production">قيد الإنتاج</option>
                        <option value="ready-delivery">جاهز للتسليم</option>
                        <option value="delivered">تم التسليم</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الفريق المسؤول
                      </label>
                      <select
                        value={formData.assignedTeam}
                        onChange={(e) => setFormData(prev => ({ ...prev, assignedTeam: e.target.value as UserRole }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="design-team">فريق التصميم</option>
                        <option value="production-team">فريق الإنتاج</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ التسليم *
                      </label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      القيمة المقدرة (ريال)
                    </label>
                    <input
                      type="number"
                      value={formData.estimatedValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedValue: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">المواصفات الفنية</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الكمية
                      </label>
                      <input
                        type="number"
                        value={formData.specifications.quantity}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          specifications: { ...prev.specifications, quantity: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المقاس
                      </label>
                      <input
                        type="text"
                        value={formData.specifications.size}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          specifications: { ...prev.specifications, size: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نوع الورق/المادة
                      </label>
                      <input
                        type="text"
                        value={formData.specifications.material}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          specifications: { ...prev.specifications, material: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الألوان
                      </label>
                      <input
                        type="text"
                        value={formData.specifications.colors}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          specifications: { ...prev.specifications, colors: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التشطيبات
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableFinishes.map((finish) => (
                        <label key={finish} className="flex items-center space-x-2 space-x-reverse">
                          <input
                            type="checkbox"
                            checked={formData.specifications.finishes.includes(finish)}
                            onChange={() => handleFinishToggle(finish)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{finish}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تعليمات خاصة
                    </label>
                    <textarea
                      value={formData.specifications.specialInstructions}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        specifications: { ...prev.specifications, specialInstructions: e.target.value }
                      }))}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 space-x-reverse mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 space-x-reverse"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;