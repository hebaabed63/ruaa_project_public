import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrophy, FaWrench, FaArchive, FaCheck, FaEye } from 'react-icons/fa';

const NotificationModal = ({ 
  notification, 
  isOpen, 
  onClose, 
  onMarkAsRead, 
  onMarkAsUnread, 
  onArchive 
}) => {
  if (!notification || !isOpen) return null;

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get type-specific styling
  const getTypeStyles = () => {
    if (notification.type === 'achievement') {
      return {
        badgeClass: 'bg-yellow-100 text-yellow-800',
        icon: <FaTrophy className="text-yellow-500 text-xl" />,
        title: 'إنجاز'
      };
    } else if (notification.type === 'improvement') {
      return {
        badgeClass: 'bg-blue-100 text-blue-800',
        icon: <FaWrench className="text-blue-500 text-xl" />,
        title: 'تحسين'
      };
    }
    // Default styling
    return {
      badgeClass: 'bg-gray-100 text-gray-800',
      icon: null,
      title: 'إشعار'
    };
  };

  const typeStyles = getTypeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            dir="rtl"
          >
            {/* Header */}
            <motion.div 
              className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2">
                {typeStyles.icon}
                <span className={`px-2 py-1 rounded text-xs font-medium ${typeStyles.badgeClass}`}>
                  {typeStyles.title}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="إغلاق"
              >
                <FaTimes />
              </motion.button>
            </motion.div>

            {/* Content */}
            <motion.div 
              className="p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {notification.title}
              </h2>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {notification.message}
              </p>
              
              <div className="space-y-3">
                <motion.div 
                  className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-sm text-gray-500">المدرسة</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {notification.schoolName}
                  </span>
                </motion.div>
                
                {notification.directorate && (
                  <motion.div 
                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="text-sm text-gray-500">المديرية</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {notification.directorate}
                    </span>
                  </motion.div>
                )}
                
                <motion.div 
                  className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-sm text-gray-500">التاريخ</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(notification.timestamp)}
                  </span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center justify-between py-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="text-sm text-gray-500">الحالة</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    notification.read 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {notification.read ? 'مقروء' : 'غير مقروء'}
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div 
              className="flex gap-2 p-4 border-t border-gray-200 dark:border-gray-700 flex-wrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {!notification.read ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onMarkAsRead(notification.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors min-w-[120px]"
                >
                  <FaCheck />
                  <span>تمييز كمقروء</span>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onMarkAsUnread(notification.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors min-w-[120px]"
                >
                  <FaEye />
                  <span>تمييز كغير مقروء</span>
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onArchive(notification.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 min-w-[120px]"
              >
                <FaArchive />
                <span>أرشفة</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;