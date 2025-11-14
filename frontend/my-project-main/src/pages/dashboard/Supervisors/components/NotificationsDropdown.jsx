import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SharedNotifications from './SharedNotifications';

const NotificationsDropdown = ({ 
  notifications, 
  unreadCount, 
  isOpen, 
  onClose 
}) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  if (!isOpen) return null;

  const handleNotificationClick = () => {
    onClose();
    navigate('/dashboard/supervisors/notifications');
  };

  return (
    <motion.div
      className="absolute left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden z-50 notifications-dropdown"
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-white">الإشعارات</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {unreadCount} غير مقروء
          </span>
        </div>
      </div>
      
      <div className="max-h-80 overflow-y-auto p-2">
        <SharedNotifications 
          variant="dropdown"
          maxItems={5}
          onNotificationClick={handleNotificationClick}
        />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-600">
        <button 
          className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded-lg transition-colors"
          onClick={() => {
            onClose();
            navigate('/dashboard/supervisors/notifications');
          }}
        >
          عرض جميع الإشعارات
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationsDropdown;