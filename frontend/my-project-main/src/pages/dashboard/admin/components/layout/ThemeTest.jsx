import React from 'react';
import { useUISettings } from '../../hooks/useData';
import ThemeToggle from './ThemeToggle';

/**
 * Theme Test Component
 * مكون اختبار الوضع (فاتح/داكن)
 */
const ThemeTest = () => {
  const { settings } = useUISettings();

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg" dir="rtl">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">اختبار الوضع</h2>
      
      <div className="flex items-center gap-4 mb-4">
        <span className="text-gray-700 dark:text-gray-300">الوضع الحالي:</span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          settings.theme === 'light' 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-indigo-100 text-indigo-800'
        }`}>
          {settings.theme === 'light' ? 'فاتح' : 'داكن'}
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-gray-700 dark:text-gray-300">تبديل الوضع:</span>
        <ThemeToggle />
      </div>
      
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          تم حفظ التفضيل في localStorage وسيظل محفوظاً بعد إعادة تحميل الصفحة.
        </p>
      </div>
    </div>
  );
};

export default ThemeTest;