import React from 'react';
import { motion } from 'framer-motion';
import { useUISettings } from '../hooks/useData';

const ThemeDemo = () => {
  const { settings, toggleTheme } = useUISettings();

  return (
    <div className="p-6" dir="rtl">
      <motion.h1 
        className="text-2xl font-bold text-gray-800 dark:text-white mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        عرض تجريبي لنظام الوضع (فاتح/مظلم)
      </motion.h1>
      
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">الوضع الحالي</h2>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {settings.theme === 'light' ? 'الوضع المضيء' : 'الوضع المظلم'}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          اضغط على الزر أدناه لتبديل الوضع بين الوضعين المضيء والمظلم.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>{settings.theme === 'light' ? '🌙' : '☀️'}</span>
          <span>تبديل الوضع</span>
        </motion.button>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">الوضع المضيء</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-800 dark:text-gray-200">النص في الوضع المضيء</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200">نص ملون في الوضع المضيء</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <p className="text-green-800 dark:text-green-200">مثال آخر للون في الوضع المضيء</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-gray-700 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-white dark:text-white mb-3">الوضع المظلم</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-800 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-200 dark:text-gray-200">النص في الوضع المظلم</p>
            </div>
            <div className="p-3 bg-blue-900 dark:bg-blue-800 rounded-lg">
              <p className="text-blue-200 dark:text-blue-200">نص ملون في الوضع المظلم</p>
            </div>
            <div className="p-3 bg-green-900 dark:bg-green-800 rounded-lg">
              <p className="text-green-200 dark:text-green-200">مثال آخر للون في الوضع المظلم</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-yellow-800 dark:text-yellow-200">
          <strong>ملاحظة:</strong> عند تبديل الوضع، سيتم حفظ التفضيل في التخزين المحلي وسيبقى محفوظًا عند إعادة تحميل الصفحة.
        </p>
      </motion.div>
    </div>
  );
};

export default ThemeDemo;