import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Login from './components/Auth/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';

function App() {
  const { isAuthenticated, isLoading, setLoading } = useAuthStore();

  useEffect(() => {
    // Simulate checking authentication state
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [setLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل نظام إدارة المطبعة...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Login />
        <Toaster 
          position="top-left" 
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'Cairo, sans-serif',
              direction: 'rtl',
              textAlign: 'right'
            }
          }}
        />
      </>
    );
  }

  return (
    <Router>
      <div className="h-screen overflow-hidden" dir="rtl">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="team" element={<div className="p-6"><h1 className="text-2xl font-bold">إدارة الفريق</h1><p className="text-gray-600 mt-2">ميزات إدارة الفريق قريباً...</p></div>} />
            <Route path="analytics" element={<div className="p-6"><h1 className="text-2xl font-bold">التحليلات</h1><p className="text-gray-600 mt-2">التحليلات التفصيلية قريباً...</p></div>} />
            <Route path="commission" element={<div className="p-6"><h1 className="text-2xl font-bold">العمولات</h1><p className="text-gray-600 mt-2">تتبع العمولات قريباً...</p></div>} />
            <Route path="reports" element={<div className="p-6"><h1 className="text-2xl font-bold">التقارير</h1><p className="text-gray-600 mt-2">ميزات التقارير قريباً...</p></div>} />
            <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">الإعدادات</h1><p className="text-gray-600 mt-2">لوحة الإعدادات قريباً...</p></div>} />
          </Route>
        </Routes>
      </div>
      <Toaster 
        position="top-left" 
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'Cairo, sans-serif',
            direction: 'rtl',
            textAlign: 'right'
          }
        }}
      />
    </Router>
  );
}

export default App;