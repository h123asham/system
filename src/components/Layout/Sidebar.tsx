import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  BarChart3, 
  DollarSign,
  FileText,
  Settings
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Sidebar: React.FC = () => {
  const { user } = useAuthStore();

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'لوحة التحكم', path: '/dashboard', icon: LayoutDashboard },
      { name: 'المهام', path: '/tasks', icon: ClipboardList },
    ];

    if (user?.role === 'manager') {
      return [
        ...baseItems,
        { name: 'الفريق', path: '/team', icon: Users },
        { name: 'التحليلات', path: '/analytics', icon: BarChart3 },
        { name: 'العمولات', path: '/commission', icon: DollarSign },
        { name: 'التقارير', path: '/reports', icon: FileText },
        { name: 'الإعدادات', path: '/settings', icon: Settings },
      ];
    }

    if (user?.role === 'sales-manager') {
      return [
        ...baseItems,
        { name: 'فريقي', path: '/team', icon: Users },
        { name: 'التحليلات', path: '/analytics', icon: BarChart3 },
        { name: 'العمولات', path: '/commission', icon: DollarSign },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <aside className="w-64 bg-gray-900 text-white h-full">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-300 mb-6">القائمة الرئيسية</h2>
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;