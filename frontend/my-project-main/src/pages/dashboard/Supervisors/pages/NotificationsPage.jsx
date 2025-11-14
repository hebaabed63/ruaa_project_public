import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBell } from 'react-icons/fa';
import { markAllAsRead } from '../services/notificationsApi';
import SharedNotifications from '../components/SharedNotifications';

const NotificationsPage = () => {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      // The shared component will handle updating its own state
      window.location.reload(); 
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900" 
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="rounded-lg border-b-2 border-primary p-4 mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white dark:bg-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <FaBell className="text-xl text-gray-800 dark:text-gray-200" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">الإشعارات</h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMarkAllAsRead}
          className="px-4 py-2 rounded-lg text-sm text-white bg-primary hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 transition-colors self-start sm:self-auto"
        >
          تمييز الكل كمقروء
        </motion.button>
      </motion.div>

      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <SharedNotifications 
          variant="page"
          showFilters={true}
          showSearch={true}
          showMarkAllAsRead={true}
        />
      </motion.div>
    </motion.div>
  );
};

export default NotificationsPage;
