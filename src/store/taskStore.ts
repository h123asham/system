import { create } from 'zustand';
import { Task, TaskStatus, statusWorkflow } from '../types';
import { useNotificationStore } from './notificationStore';
import { useAuthStore } from './authStore';

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  isTaskModalOpen: boolean;
  isCreateModalOpen: boolean;
  filters: {
    status: TaskStatus | 'all';
    priority: string;
    assignedTeam: string;
    dateRange: [Date | null, Date | null];
  };
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus, reason?: string) => void;
  deleteTask: (taskId: string) => void;
  setSelectedTask: (task: Task | null) => void;
  setTaskModalOpen: (isOpen: boolean) => void;
  setCreateModalOpen: (isOpen: boolean) => void;
  setFilters: (filters: Partial<TaskState['filters']>) => void;
  canUpdateStatus: (currentStatus: TaskStatus, newStatus: TaskStatus, userRole: string) => boolean;
  getAvailableStatuses: (currentStatus: TaskStatus, userRole: string) => TaskStatus[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  selectedTask: null,
  isTaskModalOpen: false,
  isCreateModalOpen: false,
  filters: {
    status: 'all',
    priority: 'all',
    assignedTeam: 'all',
    dateRange: [null, null],
  },

  setTasks: (tasks) => set({ tasks }),

  addTask: (task) => {
    set((state) => ({ 
      tasks: [...state.tasks, task],
      isCreateModalOpen: false 
    }));

    // Send notification to assigned team
    const { sendTaskNotification } = useNotificationStore.getState();
    const assignedUsers = getTeamMembers(task.assignedTeam);
    
    sendTaskNotification(
      'task-assigned',
      assignedUsers,
      task.title,
      task.id
    );
  },

  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates, updatedAt: new Date() } : task
      ),
      selectedTask: state.selectedTask?.id === taskId 
        ? { ...state.selectedTask, ...updates, updatedAt: new Date() }
        : state.selectedTask
    })),

  updateTaskStatus: (taskId, newStatus, reason) => {
    const state = get();
    const task = state.tasks.find(t => t.id === taskId);
    const { user } = useAuthStore.getState();
    const { sendTaskNotification } = useNotificationStore.getState();
    
    if (!task || !user) return;

    const oldStatus = task.status;
    
    // Check permissions
    if (!state.canUpdateStatus(oldStatus, newStatus, user.role)) {
      console.error('User does not have permission to update status');
      return;
    }

    // Update task status
    state.updateTask(taskId, { status: newStatus });

    // Add status change note
    const statusNote = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      message: `تم تغيير حالة المهمة من "${getStatusTranslation(oldStatus)}" إلى "${getStatusTranslation(newStatus)}"${reason ? ` - السبب: ${reason}` : ''}`,
      createdAt: new Date(),
      type: 'status-change' as const
    };

    state.updateTask(taskId, {
      notes: [...task.notes, statusNote]
    });

    // Send notifications based on status change
    handleStatusChangeNotifications(task, oldStatus, newStatus, reason);
  },

  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
      selectedTask: state.selectedTask?.id === taskId ? null : state.selectedTask,
      isTaskModalOpen: state.selectedTask?.id === taskId ? false : state.isTaskModalOpen
    })),

  setSelectedTask: (selectedTask) => set({ selectedTask }),
  setTaskModalOpen: (isTaskModalOpen) => set({ isTaskModalOpen }),
  setCreateModalOpen: (isCreateModalOpen) => set({ isCreateModalOpen }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  canUpdateStatus: (currentStatus, newStatus, userRole) => {
    const workflow = statusWorkflow[currentStatus];
    if (!workflow) return false;

    return workflow.allowedRoles.includes(userRole as any) && 
           workflow.nextStatuses.includes(newStatus);
  },

  getAvailableStatuses: (currentStatus, userRole) => {
    const workflow = statusWorkflow[currentStatus];
    if (!workflow || !workflow.allowedRoles.includes(userRole as any)) {
      return [];
    }
    return workflow.nextStatuses;
  },
}));

// Helper functions
function getStatusTranslation(status: TaskStatus): string {
  const translations = {
    'pending-design': 'في انتظار التصميم',
    'in-design': 'قيد التصميم',
    'design-review': 'مراجعة التصميم',
    'pending-approval': 'في انتظار الموافقة',
    'approved': 'تمت الموافقة',
    'in-production': 'قيد الإنتاج',
    'ready-delivery': 'جاهز للتسليم',
    'delivered': 'تم التسليم',
    'cancelled': 'ملغي'
  };
  return translations[status] || status;
}

function getTeamMembers(team: string): string[] {
  // In a real app, this would fetch from user database
  // For demo, return mock user IDs
  const teamMembers: Record<string, string[]> = {
    'design-team': ['design-1', 'design-2'],
    'production-team': ['production-1', 'production-2'],
    'sales-team': ['sales-1', 'sales-2'],
    'sales-manager': ['sales-manager-1'],
    'manager': ['manager-1']
  };
  return teamMembers[team] || [];
}

function handleStatusChangeNotifications(
  task: Task, 
  oldStatus: TaskStatus, 
  newStatus: TaskStatus, 
  reason?: string
) {
  const { sendTaskNotification } = useNotificationStore.getState();
  
  // Notify based on status transitions
  switch (newStatus) {
    case 'pending-approval':
      // Notify manager that approval is needed
      sendTaskNotification(
        'approval-needed',
        getTeamMembers('manager'),
        task.title,
        task.id
      );
      break;
      
    case 'approved':
      // Notify production team that task is approved
      sendTaskNotification(
        'task-approved',
        getTeamMembers('production-team'),
        task.title,
        task.id
      );
      // Also notify the creator
      sendTaskNotification(
        'task-approved',
        [task.createdBy],
        task.title,
        task.id
      );
      break;
      
    case 'design-review':
      if (oldStatus === 'pending-approval') {
        // Task was rejected, notify design team
        sendTaskNotification(
          'task-rejected',
          getTeamMembers('design-team'),
          task.title,
          task.id,
          { reason }
        );
      } else {
        // Normal design review, notify relevant team
        sendTaskNotification(
          'task-updated',
          getTeamMembers('design-team'),
          task.title,
          task.id,
          { newStatus: getStatusTranslation(newStatus) }
        );
      }
      break;
      
    case 'in-production':
      // Notify production team
      sendTaskNotification(
        'task-updated',
        getTeamMembers('production-team'),
        task.title,
        task.id,
        { newStatus: getStatusTranslation(newStatus) }
      );
      break;
      
    case 'ready-delivery':
      // Notify sales team and manager
      sendTaskNotification(
        'task-updated',
        [...getTeamMembers('sales-team'), ...getTeamMembers('sales-manager')],
        task.title,
        task.id,
        { newStatus: getStatusTranslation(newStatus) }
      );
      break;
      
    case 'delivered':
      // Notify everyone involved that task is completed
      sendTaskNotification(
        'task-completed',
        [task.createdBy, ...getTeamMembers('manager')],
        task.title,
        task.id
      );
      break;
      
    default:
      // General status update notification
      const targetTeam = getTargetTeamForStatus(newStatus);
      if (targetTeam) {
        sendTaskNotification(
          'task-updated',
          getTeamMembers(targetTeam),
          task.title,
          task.id,
          { newStatus: getStatusTranslation(newStatus) }
        );
      }
  }
}

function getTargetTeamForStatus(status: TaskStatus): string | null {
  const statusTeamMap: Record<TaskStatus, string | null> = {
    'pending-design': 'design-team',
    'in-design': 'design-team',
    'design-review': 'design-team',
    'pending-approval': 'manager',
    'approved': 'production-team',
    'in-production': 'production-team',
    'ready-delivery': 'sales-team',
    'delivered': null,
    'cancelled': null
  };
  return statusTeamMap[status];
}