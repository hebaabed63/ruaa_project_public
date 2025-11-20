// src/components/NotificationsDropdown.js
import React from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaEnvelope, FaExclamationTriangle, FaCheck, FaTimes } from 'react-icons/fa';

const NotificationsDropdown = ({ notifications, unreadCount, isOpen, onClose }) => {
  const markAsRead = (notificationId) => {
    // TODO: تنفيذ علامة كمقروء
    console.log('Mark as read:', notificationId);
  };

  const clearAll = () => {
    // TODO: تنفيذ مسح الكل
    console.log('Clear all notifications');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'registration':
        return <FaEnvelope className="text-blue-500" />;
      case 'report':
        return <FaExclamationTriangle className="text-orange-500" />;
      case 'support':
        return <FaBell className="text-green-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="absolute left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden z-50"
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-600 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 space-x-reverse">
            <FaBell className="text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">الإشعارات</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount} جديد
              </span>
            )}
          </div>
          <button
            onClick={clearAll}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            مسح الكل
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <FaBell className="text-gray-400 text-3xl mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">لا توجد إشعارات جديدة</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
              }`}
            >
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title="علامة كمقروء"
                      >
                        <FaCheck className="text-xs" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {notification.time}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      notification.type === 'registration' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      notification.type === 'report' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {notification.type === 'registration' ? 'تسجيل' :
                       notification.type === 'report' ? 'تقرير' : 'دعم'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
        <button
          onClick={() => {
            onClose();
            // TODO: التنقل لصفحة جميع الإشعارات
          }}
          className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors py-2"
        >
          عرض جميع الإشعارات
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationsDropdown;