import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  trend?: {
    value: number;
    isUp: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-100',
    green: 'bg-green-500 text-green-100',
    orange: 'bg-orange-500 text-orange-100',
    red: 'bg-red-500 text-red-100',
    purple: 'bg-purple-500 text-purple-100',
  };

  const trendColorClasses = {
    blue: trend?.isUp ? 'text-green-600' : 'text-red-600',
    green: trend?.isUp ? 'text-green-600' : 'text-red-600',
    orange: trend?.isUp ? 'text-green-600' : 'text-red-600',
    red: trend?.isUp ? 'text-green-600' : 'text-red-600',
    purple: trend?.isUp ? 'text-green-600' : 'text-red-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trendColorClasses[color]}`}>
              {trend.isUp ? '↗' : '↘'} {Math.abs(trend.value)}% من الشهر الماضي
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;