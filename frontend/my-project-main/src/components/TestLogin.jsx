import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const TestLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    // بيانات تجريبية لتسجيل الدخول كأدمن
    const adminData = {
      token: 'test-admin-token-' + Date.now(),
      role: 'admin',
      user: {
        id: 1,
        name: 'مدير النظام',
        email: 'admin@ruaa.com',
        avatar: null
      }
    };

    // تسجيل الدخول
    login(adminData.token, adminData.role, adminData.user);
    
    // إظهار رسالة نجاح
    toast.success('تم تسجيل الدخول كمدير بنجاح!');
    
    // التوجيه إلى لوحة تحكم الأدمن
    navigate('/admin/overview');
  };

  const handleParentLogin = () => {
    // بيانات تجريبية لتسجيل الدخول كولي أمر
    const parentData = {
      token: 'test-parent-token-' + Date.now(),
      role: 'parent',
      user: {
        id: 2,
        name: 'ولي الأمر',
        email: 'parent@ruaa.com',
        avatar: null
      }
    };

    // تسجيل الدخول
    login(parentData.token, parentData.role, parentData.user);
    
    // إظهار رسالة نجاح
    toast.success('تم تسجيل الدخول كولي أمر بنجاح!');
    
    // التوجيه إلى لوحة تحكم ولي الأمر
    navigate('/dashboard/parent');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-4 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            تسجيل دخول تجريبي
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            اختر نوع المستخدم لتسجيل الدخول التجريبي
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleAdminLogin}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            تسجيل دخول كمدير النظام
          </button>

          <button
            onClick={handleParentLogin}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            تسجيل دخول كولي أمر
          </button>
        </div>

        <div className="text-center pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            هذا للاختبار فقط - لا يتطلب كلمة مرور حقيقية
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestLogin;
