import React, { useState } from 'react';
import { X, Calendar, User, DollarSign, AlertCircle } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import { Task, TaskPriority, UserRole, statusTranslations, priorityTranslations, roleTranslations } from '../../types';
import toast from 'react-hot-toast';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose }) => {
  const { addTask } = useTaskStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientName: '',
    clientContact: '',
    priority: 'medium' as TaskPriority,
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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newTask: Task = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        clientName: formData.clientName,
        clientContact: formData.clientContact,
        priority: formData.priority,
        status: 'pending-design',
        assignedTeam: formData.assignedTeam,
        createdBy: user?.id || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: new Date(formData.dueDate),
        estimatedValue: parseFloat(formData.estimatedValue) || 0,
        notes: [],
        attachments: [],
        specifications: {
          quantity: parseInt(formData.specifications.quantity) || 0,
          size: formData.specifications.size,
          material: formData.specifications.material,
          colors: formData.specifications.colors,
          finishes: formData.specifications.finishes,
          specialInstructions: formData.specifications.specialInstructions
        }
      };

      addTask(newTask);
      toast.success('تم إنشاء المهمة بنجاح');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        clientName: '',
        clientContact: '',
        priority: 'medium',
        assignedTeam: 'design-team',
        dueDate: '',
        estimatedValue: '',
        specifications: {
          quantity: '',
          size: '',
          material: '',
          colors: '',
          finishes: [],
          specialInstructions: ''
        }
      });
      
      onClose();
    } catch (error) {
      toast.error('حدث خطأ أثناء إنشاء المهمة');
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
          <h2 className="text-2xl font-bold text-gray-900">إنشاء مهمة جديدة</h2>
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
                      placeholder="مثال: تصميم كروت شخصية - شركة ABC"
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
                      placeholder="وصف تفصيلي للمهمة والمتطلبات..."
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
                        placeholder="اسم الشركة أو العميل"
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
                        placeholder="البريد الإلكتروني أو رقم الهاتف"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      placeholder="0"
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
                        placeholder="1000"
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
                        placeholder="مثال: A4 أو 10×15 سم"
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
                        placeholder="مثال: ورق مطفي 300 جرام"
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
                        placeholder="مثال: 4 ألوان CMYK"
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
                      placeholder="أي تعليمات أو ملاحظات خاصة للمهمة..."
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
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'جاري الإنشاء...' : 'إنشاء المهمة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;