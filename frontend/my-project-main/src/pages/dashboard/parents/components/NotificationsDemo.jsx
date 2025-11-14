import React from 'react';
import { motion } from 'framer-motion';
import SharedNotifications from './SharedNotifications';

const NotificationsDemo = () => {
  return (
    <div className="p-6" dir="rtl">
      <motion.h1 
        className="text-2xl font-bold text-gray-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        عرض تجريبي للإشعارات المشتركة
      </motion.h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dropdown Variant Demo */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">نمط القائمة المنسدلة</h2>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-w-xs">
            <SharedNotifications 
              variant="dropdown"
              maxItems={5}
            />
          </div>
        </motion.div>
        
        {/* Page Variant Demo */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">نمط الصفحة الكاملة</h2>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <SharedNotifications 
              variant="page"
              showFilters={true}
              showSearch={true}
            />
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">الميزات المضمنة</h3>
        <ul className="list-disc list-inside text-blue-700 dark:text-blue-300 space-y-1">
          <li>مكون مشترك واحد لعرض الإشعارات في كلا المكانين</li>
          <li>تحديث تلقائي لعدد الإشعارات غير المقروءة</li>
          <li>تصميم متجاوب مع دعم اللغة من اليمين إلى اليسار</li>
          <li>تحريك أنيق باستخدام Framer Motion</li>
          <li>فلاتر وأنواع متعددة من الإشعارات</li>
          <li>تصميم بصري مميز لكل نوع من الإشعارات</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default NotificationsDemo;