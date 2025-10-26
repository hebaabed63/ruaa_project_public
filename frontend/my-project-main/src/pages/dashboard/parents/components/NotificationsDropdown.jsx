import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaTrophy, FaWrench } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NotificationsDropdown = ({ 
  notifications, 
  unreadCount, 
  isOpen, 
  onClose 
}) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  if (!isOpen) return null;

  // Filter notifications based on type and archived status
  const filteredNotifications = notifications.filter(notification => {
    // Check if notification has archived property, if not, treat as not archived
    const isArchived = notification.archived || false;
    if (filter === 'all') return !isArchived;
    return notification.type === filter && !isArchived;
  });

  // Get counts for each type (excluding archived)
  const achievementCount = notifications.filter(n => 
    n.type === 'achievement' && !(n.archived || false)
  ).length;
  const improvementCount = notifications.filter(n => 
    n.type === 'improvement' && !(n.archived || false)
  ).length;

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
        
        {/* Notification Type Filters */}
        <div className="flex gap-2 mt-3 flex-wrap">
          <button 
            className={`text-xs px-2 py-1 rounded-full transition-colors ${
              filter === 'all' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setFilter('all');
            }}
          >
            الكل
          </button>
          <button 
            className={`text-xs px-2 py-1 rounded-full transition-colors flex items-center gap-1 ${
              filter === 'achievement' 
                ? 'bg-yellow-500 text-white shadow-md' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setFilter('achievement');
            }}
          >
            <FaTrophy size={10} />
            إنجازات ({achievementCount})
          </button>
          <button 
            className={`text-xs px-2 py-1 rounded-full transition-colors flex items-center gap-1 ${
              filter === 'improvement' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setFilter('improvement');
            }}
          >
            <FaWrench size={10} />
            تحسينات ({improvementCount})
          </button>
        </div>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {filteredNotifications && filteredNotifications.length > 0 ? (
          filteredNotifications
            .slice(0, 5)
            .map((notification) => {
              // Get type-specific styling
              const getTypeStyles = () => {
                if (notification.type === 'achievement') {
                  return {
                    badgeClass: 'bg-yellow-100 text-yellow-800',
                    icon: <FaTrophy className="text-yellow-500" size={14} />
                  };
                } else if (notification.type === 'improvement') {
                  return {
                    badgeClass: 'bg-blue-100 text-blue-800',
                    icon: <FaWrench className="text-blue-500" size={14} />
                  };
                }
                // Default styling
                return {
                  badgeClass: 'bg-gray-100 text-gray-800',
                  icon: null
                };
              };
              
              const typeStyles = getTypeStyles();
              
              return (
                <motion.div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  whileHover={{ x: 5 }}
                  onClick={() => {
                    onClose();
                    navigate('/dashboard/parents/notifications');
                  }}
                >
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      !notification.read ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {typeStyles.icon}
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${typeStyles.badgeClass}`}>
                          {notification.type === 'achievement' ? 'إنجاز' : 'تحسين'}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(notification.timestamp).toLocaleDateString('ar-SA')}
                        </span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                          {notification.schoolName}
                        </span>
                      </div>
                      {notification.directorate && (
                        <div className="text-xs text-gray-500 mt-1">
                          {notification.directorate}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            لا توجد إشعارات
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-600">
        <button 
          className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded-lg transition-colors"
          onClick={() => {
            onClose();
            navigate('/dashboard/parents/notifications');
          }}
        >
          عرض جميع الإشعارات
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationsDropdown;