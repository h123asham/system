import React, { useEffect } from 'react';
import { Bell, Settings, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { roleTranslations } from '../../types';
import NotificationDropdown from './NotificationDropdown';

const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
          <h1 className="text-2xl font-bold text-gray-900">نظام إدارة المطبعة</h1>
          <div className="hidden md:block">
            <span className="text-sm text-gray-500">نظام إدارة المهام والمشاريع</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 space-x-reverse">
          <NotificationDropdown />

          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 space-x-reverse pr-4 border-r border-gray-200">
            <div className="flex items-center space-x-2 space-x-reverse">
              <User className="w-8 h-8 text-gray-400 bg-gray-100 rounded-full p-1.5" />
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role ? roleTranslations[user.role] : 'غير محدد'}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;