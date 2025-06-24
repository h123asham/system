import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Printer, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Demo authentication
    setTimeout(() => {
      const demoUsers = [
        { id: '1', email: 'manager@printflow.com', name: 'أحمد المدير', role: 'manager' as const, department: 'الإدارة' },
        { id: '2', email: 'sales@printflow.com', name: 'سارة المبيعات', role: 'sales-manager' as const, department: 'المبيعات' },
        { id: '3', email: 'design@printflow.com', name: 'محمد المصمم', role: 'design-team' as const, department: 'التصميم' },
        { id: '4', email: 'production@printflow.com', name: 'ليلى الإنتاج', role: 'production-team' as const, department: 'الإنتاج' },
      ];

      const user = demoUsers.find(u => u.email === email);
      if (user) {
        setUser({ ...user, createdAt: new Date(), isActive: true });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
              <Printer className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">نظام إدارة المطبعة</h1>
            <p className="text-gray-600">نظام إدارة المهام والمشاريع</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="أدخل بريدك الإلكتروني"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pl-12"
                  placeholder="أدخل كلمة المرور"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">حسابات تجريبية:</p>
              <div className="space-y-1 text-xs">
                <p>• المدير: manager@printflow.com</p>
                <p>• المبيعات: sales@printflow.com</p>
                <p>• التصميم: design@printflow.com</p>
                <p>• الإنتاج: production@printflow.com</p>
                <p className="text-gray-500 mt-2">كلمة المرور: أي شيء</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;