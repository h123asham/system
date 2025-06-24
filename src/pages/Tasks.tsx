import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import TaskCard from '../components/Tasks/TaskCard';
import TaskModal from '../components/Tasks/TaskModal';
import CreateTaskModal from '../components/Tasks/CreateTaskModal';
import EditTaskModal from '../components/Tasks/EditTaskModal';
import { useTaskStore } from '../store/taskStore';
import { Task, TaskStatus, statusTranslations } from '../types';
import toast from 'react-hot-toast';

const Tasks: React.FC = () => {
  const { 
    tasks, 
    selectedTask, 
    isTaskModalOpen, 
    isCreateModalOpen,
    setTasks, 
    setSelectedTask, 
    setTaskModalOpen, 
    setCreateModalOpen,
    updateTask,
    deleteTask
  } = useTaskStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Demo tasks data
  const demoTasks: Task[] = [
    {
      id: '1',
      title: 'تصميم كروت شخصية - شركة ABC',
      description: 'تصميم كروت شخصية احترافية مع شعار الشركة ومعلومات الاتصال',
      clientName: 'شركة ABC للتجارة',
      clientContact: 'john@abccorp.com',
      priority: 'high',
      status: 'in-design',
      assignedTeam: 'design-team',
      createdBy: 'sales-1',
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-01-12'),
      dueDate: new Date('2025-01-15'),
      estimatedValue: 500,
      notes: [
        {
          id: '1',
          userId: 'design-1',
          userName: 'محمد المصمم',
          message: 'بدأت العمل على التصميم الأولي. سيكون المسودة الأولى جاهزة غداً.',
          createdAt: new Date('2025-01-12'),
          type: 'comment'
        }
      ],
      attachments: [],
      specifications: {
        quantity: 1000,
        size: '9×5 سم',
        material: 'ورق مقوى فاخر',
        colors: '4 ألوان CMYK',
        finishes: ['لامينيشن مطفي'],
        specialInstructions: 'تضمين رمز QR للتواصل الرقمي'
      }
    },
    {
      id: '2',
      title: 'تصميم بروشور - شركة XYZ',
      description: 'بروشور ثلاثي الطي يعرض خدمات الشركة وآراء العملاء',
      clientName: 'شركة XYZ المحدودة',
      clientContact: 'sarah@xyzltd.com',
      priority: 'medium',
      status: 'pending-approval',
      assignedTeam: 'design-team',
      createdBy: 'sales-2',
      createdAt: new Date('2025-01-08'),
      updatedAt: new Date('2025-01-11'),
      dueDate: new Date('2025-01-16'),
      estimatedValue: 750,
      notes: [],
      attachments: [],
      specifications: {
        quantity: 500,
        size: 'A4 (مطوي)',
        material: 'ورق لامع',
        colors: 'ألوان كاملة',
        finishes: ['طلاء UV']
      }
    },
    {
      id: '3',
      title: 'طباعة بانر - شركة الفعاليات',
      description: 'بانر كبير الحجم لجناح المعرض التجاري',
      clientName: 'شركة الفعاليات والمؤتمرات',
      clientContact: 'mike@eventco.com',
      priority: 'urgent',
      status: 'in-production',
      assignedTeam: 'production-team',
      createdBy: 'sales-1',
      createdAt: new Date('2025-01-09'),
      updatedAt: new Date('2025-01-13'),
      dueDate: new Date('2025-01-14'),
      estimatedValue: 1200,
      notes: [],
      attachments: [],
      specifications: {
        quantity: 2,
        size: '3×2.5 متر',
        material: 'فينيل',
        colors: 'ألوان كاملة',
        finishes: ['حلقات معدنية', 'حواف مخيطة']
      }
    }
  ];

  useEffect(() => {
    if (tasks.length === 0) {
      setTasks(demoTasks);
    }
  }, [tasks.length, setTasks]);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
    setTaskModalOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
      deleteTask(taskId);
      toast.success('تم حذف المهمة بنجاح');
      setTaskModalOpen(false);
    }
  };

  const handleEditFromCard = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleDeleteFromCard = (taskId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
      deleteTask(taskId);
      toast.success('تم حذف المهمة بنجاح');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">المهام</h1>
          <p className="text-gray-600 mt-1">إدارة ومتابعة جميع مهام الطباعة</p>
        </div>
        <button 
          onClick={() => setCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 space-x-reverse"
        >
          <Plus className="w-5 h-5" />
          <span>مهمة جديدة</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="البحث في المهام..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending-design">في انتظار التصميم</option>
              <option value="in-design">قيد التصميم</option>
              <option value="design-review">مراجعة التصميم</option>
              <option value="pending-approval">في انتظار الموافقة</option>
              <option value="approved">تمت الموافقة</option>
              <option value="in-production">قيد الإنتاج</option>
              <option value="ready-delivery">جاهز للتسليم</option>
              <option value="delivered">تم التسليم</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => handleTaskClick(task)}
            onEdit={() => handleEditFromCard(task)}
            onDelete={() => handleDeleteFromCard(task.id)}
          />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">لا توجد مهام تطابق معايير البحث</p>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={isTaskModalOpen}
          onClose={() => setTaskModalOpen(false)}
          onEdit={() => handleEditTask(selectedTask)}
          onDelete={() => handleDeleteTask(selectedTask.id)}
        />
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        task={editingTask}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
      />
    </div>
  );
};

export default Tasks;