import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaChartBar, 
  FaTrophy, 
  FaWrench, 
  FaEnvelope, 
  FaComments, 
  FaArchive, 
  FaEye, 
  FaCheck, 
  FaTimes,
  FaUser
} from 'react-icons/fa';
import { getNotificationTypeConfig } from '../services/notificationsApi';

const NotificationCard = ({ 
  notification, 
  onMarkAsRead, 
  onMarkAsUnread, 
  onArchive,
  onClick,
  showActions = true
}) => {
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
    const config = getNotificationTypeConfig(notification.type);
    
    return {
      borderClass: `border-r-4 ${config.borderColor}`,
      badgeClass: `${config.bgColor} ${config.color.replace('text-', 'text-').replace('-500', '-800')}`,
      icon: React.createElement(config.icon, { className: config.color }),
      bgColor: config.bgColor.replace('bg-', 'bg-').replace('-100', '-50'),
      accentColor: config.color.replace('text-', 'bg-')
    };
  };

  const typeStyles = getTypeStyles();

  return (
    <motion.div
      className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
        notification.read 
          ? 'bg-white border-gray-200' 
          : `${typeStyles.bgColor} border-gray-300 shadow-sm`
      } ${typeStyles.borderClass}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      layout
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {!notification.read && (
              <motion.div 
                className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              ></motion.div>
            )}
            <div className="flex items-center gap-2">
              {typeStyles.icon}
              <motion.span 
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${typeStyles.badgeClass}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {getNotificationTypeConfig(notification.type).label}
              </motion.span>
            </div>
          </div>
          
          <motion.h3 
            className={`font-bold ${notification.read ? 'text-gray-800' : 'text-gray-900'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {notification.title}
          </motion.h3>
          
          <motion.p 
            className={`mt-1 text-sm ${notification.read ? 'text-gray-600' : 'text-gray-700'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {notification.message}
          </motion.p>
          
          <motion.div 
            className="mt-3 flex items-center justify-between flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col">
              <motion.span 
                className="text-xs font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {notification.schoolName}
              </motion.span>
              {notification.directorate && (
                <motion.span 
                  className="text-xs text-gray-500 mt-1"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {notification.directorate}
                </motion.span>
              )}
              {/* Additional info for specific types */}
              {notification.type === 'performance' && notification.childName && (
                <motion.span 
                  className="text-xs text-gray-500 mt-1"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  {notification.childName} - {notification.subject}: {notification.grade}
                </motion.span>
              )}
              {(notification.type === 'principal' || notification.type === 'chat') && notification.sender && (
                <motion.span 
                  className="text-xs text-gray-500 mt-1"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  من: {notification.sender}
                </motion.span>
              )}
            </div>
            <motion.span 
              className="text-xs text-gray-500 whitespace-nowrap"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {formatDate(notification.timestamp)}
            </motion.span>
          </motion.div>
        </div>
      </div>

      {showActions && (
        <motion.div 
          className="mt-3 pt-3 border-t border-gray-100 flex gap-2 flex-wrap"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.9 }}
        >
          {!notification.read ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification.id);
              }}
              className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
            >
              <FaCheck size={12} />
              <span>تمييز كمقروء</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsUnread(notification.id);
              }}
              className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
            >
              <FaEye size={12} />
              <span>تمييز كغير مقروء</span>
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onArchive(notification.id);
            }}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
          >
            <FaArchive size={12} />
            <span>أرشفة</span>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NotificationCard;