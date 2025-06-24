import React from 'react';
import { ClipboardList, Users, TrendingUp, DollarSign, Clock, CheckCircle } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import TaskChart from '../components/Dashboard/TaskChart';
import RecentTasks from '../components/Dashboard/RecentTasks';
import { useAuthStore } from '../store/authStore';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  const getDashboardData = () => {
    if (user?.role === 'manager') {
      return {
        title: 'لوحة تحكم المدير',
        stats: [
          { title: 'إجمالي المهام', value: 148, icon: ClipboardList, color: 'blue' as const, trend: { value: 12, isUp: true } },
          { title: 'المشاريع النشطة', value: 23, icon: TrendingUp, color: 'green' as const, trend: { value: 8, isUp: true } },
          { title: 'أعضاء الفريق', value: 15, icon: Users, color: 'purple' as const },
          { title: 'الإيرادات الشهرية', value: '45,290 ريال', icon: DollarSign, color: 'orange' as const, trend: { value: 15, isUp: true } },
        ],
      };
    }

    if (user?.role === 'sales-manager' || user?.role === 'sales-team') {
      return {
        title: 'لوحة تحكم المبيعات',
        stats: [
          { title: 'مهامي', value: 28, icon: ClipboardList, color: 'blue' as const, trend: { value: 5, isUp: true } },
          { title: 'مكتملة', value: 15, icon: CheckCircle, color: 'green' as const },
          { title: 'في الانتظار', value: 13, icon: Clock, color: 'orange' as const },
          { title: 'إيرادات هذا الشهر', value: '12,450 ريال', icon: DollarSign, color: 'purple' as const, trend: { value: 20, isUp: true } },
        ],
      };
    }

    return {
      title: 'لوحة تحكم الفريق',
      stats: [
        { title: 'المهام المسندة', value: 12, icon: ClipboardList, color: 'blue' as const },
        { title: 'مكتملة اليوم', value: 5, icon: CheckCircle, color: 'green' as const },
        { title: 'قيد التنفيذ', value: 7, icon: Clock, color: 'orange' as const },
        { title: 'متوسط وقت الإنجاز', value: '2.3 أيام', icon: TrendingUp, color: 'purple' as const },
      ],
    };
  };

  const dashboardData = getDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{dashboardData.title}</h1>
          <p className="text-gray-600 mt-1">مرحباً بك، {user?.name}!</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('ar-SA', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
          />
        ))}
      </div>

      <TaskChart />

      <RecentTasks />
    </div>
  );
};

export default Dashboard;