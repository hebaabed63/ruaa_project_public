import React from 'react';
import { useUISettings } from './hooks/useData';

const TestTheme = () => {
  const { settings, toggleTheme } = useUISettings();

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen" dir="rtl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">اختبار الوضع (فاتح/مظلم)</h1>
      
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">الوضع الحالي: {settings.theme}</h2>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          تبديل الوضع
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">الوضع المضيء</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-100 rounded">
              <p className="text-gray-800">نص في الوضع المضيء</p>
            </div>
            <div className="p-3 bg-blue-100 rounded">
              <p className="text-blue-800">نص أزرق في الوضع المضيء</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-white dark:text-white mb-3">الوضع المظلم</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-800 rounded">
              <p className="text-gray-200">نص في الوضع المظلم</p>
            </div>
            <div className="p-3 bg-blue-900 rounded">
              <p className="text-blue-200">نص أزرق في الوضع المظلم</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestTheme;