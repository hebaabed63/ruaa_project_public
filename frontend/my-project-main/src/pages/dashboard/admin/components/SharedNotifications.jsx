import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { fetchNotifications, markAsRead } from '../services/notificationsApi';

const SharedNotifications = ({ 
  variant = 'dropdown',
  maxItems = 5,
  onNotificationClick,
  showFilters = false,
  showSearch = false
}) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (err) {
        setError('حدث خطأ أثناء تحميل الإشعارات');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (currentFilter !== 'all' && notification.type !== currentFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        notification.schoolName.toLowerCase().includes(term) || 
        notification.description.toLowerCase().includes(term) ||
        (notification.studentName && notification.studentName.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const displayNotifications = variant === 'dropdown' 
    ? filteredNotifications.slice(0, maxItems) 
    : filteredNotifications;

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      );
    }
    if (onNotificationClick) onNotificationClick(notification);
  };

  const handleFilterChange = (type) => setCurrentFilter(type);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const getTypeCounts = () => ({
    all: notifications.length,
    achievement: notifications.filter(n => n.type === 'achievement').length,
    improvement: notifications.filter(n => n.type === 'improvement').length,
    chat: notifications.filter(n => n.type === 'chat').length
  });

  const typeCounts = getTypeCounts();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000*60*60));
    return diffInHours < 24
      ? date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', hour12: true })
      : date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getTypeLabel = (type) => {
    if (type === 'achievement') return 'إنجاز';
    if (type === 'improvement') return 'تحديث';
    if (type === 'chat') return 'رسالة';
    return '';
  };

  const getGreenBoxLabels = (notification) => {
    switch(notification.type){
      case 'achievement':
        return { typeLabel: 'إنجازات', categoryLabel: notification.category || 'مسابقة' };
      case 'improvement':
        return { typeLabel: 'تحديثات', categoryLabel: notification.category || 'تطوير' };
      case 'chat':
        return { typeLabel: 'رسائل', categoryLabel: notification.category || 'عام' };
      default:
        return { typeLabel: '', categoryLabel: 'عام' };
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center py-12" dir="rtl">
      <motion.div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></motion.div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">جاري تحميل الإشعارات...</p>
    </div>
  );

  if (error) return (
    <div className="text-center py-12" dir="rtl">
      <p className="text-sm text-red-500">{error}</p>
    </div>
  );

  if (displayNotifications.length === 0) return (
    <div className="text-center py-12" dir="rtl">
      <p className="text-sm text-gray-500 dark:text-gray-400">لا توجد إشعارات</p>
    </div>
  );

  return (
    <div dir="rtl">

      {/* Filters */}
      {variant === 'page' && showFilters && (
        <motion.div 
          className="mt-4 p-4 rounded-lg shadow-md bg-gray-100 dark:bg-gray-700 flex justify-between gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {['all','achievement','improvement','chat'].map(type => (
            <button
              key={type}
              onClick={() => handleFilterChange(type)}
              className={`flex-1 text-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentFilter === type
                  ? 'bg-white text-black dark:bg-gray-600 dark:text-white'
                  : 'text-gray-700 dark:bg-gray-600 dark:text-gray-200'
              }`}
            >
              {type === 'all' ? `الكل (${typeCounts.all})` :
               type === 'achievement' ? `التقييمات (${typeCounts.achievement})` :
               type === 'improvement' ? `المدارس (${typeCounts.improvement})` :
               `الرسائل (${typeCounts.chat})`}
            </button>
          ))}
        </motion.div>
      )}

      {/* البحث */}
      {showSearch && (
        <div className="my-4">
          <div className="flex items-center bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1">
            <FaSearch className="text-gray-400 dark:text-gray-300 ml-2" />
            <input
              type="text"
              placeholder="ابحث عن الرسائل,  التقييمات ,المدارس.."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-2 text-sm text-gray-700 dark:text-gray-200 bg-transparent outline-none"
            />
          </div>
        </div>
      )}

      {/* Notifications List */}
      <motion.div 
        className="mt-4 p-4 rounded-lg shadow-md space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {displayNotifications.map((notification, index) => {
          const bgColor = index % 2 === 0 
            ? 'bg-white dark:bg-gray-800' 
            : 'bg-[#E0F4F5] dark:bg-gray-700';
          const { typeLabel, categoryLabel } = getGreenBoxLabels(notification);

          return (
            <motion.div
              key={notification.id}
              className={`${bgColor} rounded-lg border border-gray-200 dark:border-gray-600 p-4 cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => handleNotificationClick(notification)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="font-bold text-sm text-gray-800 dark:text-gray-200">{getTypeLabel(notification.type)}</span>
                <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 text-xs px-2 py-1 rounded">{typeLabel}</span>
                <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 text-xs px-2 py-1 rounded">{categoryLabel}</span>
              </div>

              <p className="text-gray-700 dark:text-gray-200 text-sm mb-1">{notification.description}</p>

              <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(notification.date)}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default SharedNotifications;
