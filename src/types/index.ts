export type UserRole = 'manager' | 'sales-manager' | 'sales-team' | 'design-team' | 'production-team';

export type TaskStatus = 
  | 'pending-design'
  | 'in-design'
  | 'design-review'
  | 'pending-approval'
  | 'approved'
  | 'in-production'
  | 'ready-delivery'
  | 'delivered'
  | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  avatar?: string;
  createdAt: Date;
  isActive: boolean;
  notificationToken?: string; // For push notifications
}

export interface Task {
  id: string;
  title: string;
  description: string;
  clientName: string;
  clientContact: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo?: string;
  assignedTeam: UserRole;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
  estimatedValue: number;
  actualValue?: number;
  completedAt?: Date;
  notes: TaskNote[];
  attachments: string[];
  specifications: {
    quantity: number;
    size: string;
    material: string;
    colors: string;
    finishes: string[];
    specialInstructions?: string;
  };
}

export interface TaskNote {
  id: string;
  userId: string;
  userName: string;
  message: string;
  createdAt: Date;
  type: 'comment' | 'status-change' | 'assignment';
}

export interface Commission {
  id: string;
  userId: string;
  taskId: string;
  amount: number;
  percentage: number;
  basedOn: 'task-completion' | 'delivery' | 'payment';
  createdAt: Date;
  paidAt?: Date;
  status: 'pending' | 'paid';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'task-assigned' | 'task-updated' | 'approval-needed' | 'task-completed' | 'task-approved' | 'task-rejected';
  isRead: boolean;
  createdAt: Date;
  taskId?: string;
  priority: 'low' | 'medium' | 'high';
}

// Arabic translations
export const statusTranslations: Record<TaskStatus, string> = {
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

export const priorityTranslations: Record<TaskPriority, string> = {
  'low': 'منخفضة',
  'medium': 'متوسطة',
  'high': 'عالية',
  'urgent': 'عاجلة'
};

export const roleTranslations: Record<UserRole, string> = {
  'manager': 'مدير',
  'sales-manager': 'مدير المبيعات',
  'sales-team': 'فريق المبيعات',
  'design-team': 'فريق التصميم',
  'production-team': 'فريق الإنتاج'
};

// Status workflow permissions
export const statusWorkflow: Record<TaskStatus, { allowedRoles: UserRole[], nextStatuses: TaskStatus[] }> = {
  'pending-design': {
    allowedRoles: ['manager', 'sales-manager', 'design-team'],
    nextStatuses: ['in-design', 'cancelled']
  },
  'in-design': {
    allowedRoles: ['design-team', 'manager'],
    nextStatuses: ['design-review', 'pending-design', 'cancelled']
  },
  'design-review': {
    allowedRoles: ['design-team', 'manager'],
    nextStatuses: ['pending-approval', 'in-design', 'cancelled']
  },
  'pending-approval': {
    allowedRoles: ['manager'], // Only manager can approve
    nextStatuses: ['approved', 'design-review', 'cancelled']
  },
  'approved': {
    allowedRoles: ['manager', 'production-team'],
    nextStatuses: ['in-production', 'design-review']
  },
  'in-production': {
    allowedRoles: ['production-team', 'manager'],
    nextStatuses: ['ready-delivery', 'design-review', 'cancelled']
  },
  'ready-delivery': {
    allowedRoles: ['production-team', 'sales-team', 'sales-manager', 'manager'],
    nextStatuses: ['delivered', 'in-production']
  },
  'delivered': {
    allowedRoles: ['sales-team', 'sales-manager', 'manager'],
    nextStatuses: []
  },
  'cancelled': {
    allowedRoles: ['manager'],
    nextStatuses: []
  }
};

// Notification templates
export const notificationTemplates = {
  'task-assigned': {
    title: 'مهمة جديدة مسندة إليك',
    message: (taskTitle: string) => `تم إسناد مهمة جديدة إليك: ${taskTitle}`,
    priority: 'medium' as const
  },
  'task-updated': {
    title: 'تم تحديث المهمة',
    message: (taskTitle: string, newStatus: string) => `تم تحديث حالة المهمة "${taskTitle}" إلى: ${newStatus}`,
    priority: 'medium' as const
  },
  'approval-needed': {
    title: 'مطلوب موافقة على مهمة',
    message: (taskTitle: string) => `المهمة "${taskTitle}" تحتاج إلى موافقتك للانتقال إلى الإنتاج`,
    priority: 'high' as const
  },
  'task-approved': {
    title: 'تمت الموافقة على المهمة',
    message: (taskTitle: string) => `تمت الموافقة على المهمة "${taskTitle}" ويمكن البدء في الإنتاج`,
    priority: 'high' as const
  },
  'task-rejected': {
    title: 'تم رفض المهمة',
    message: (taskTitle: string, reason?: string) => `تم رفض المهمة "${taskTitle}"${reason ? ` - السبب: ${reason}` : ''}`,
    priority: 'high' as const
  },
  'task-completed': {
    title: 'تم إكمال المهمة',
    message: (taskTitle: string) => `تم إكمال المهمة "${taskTitle}" بنجاح`,
    priority: 'medium' as const
  }
};