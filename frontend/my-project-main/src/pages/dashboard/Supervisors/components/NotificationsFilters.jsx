import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaChartBar, FaTrophy, FaWrench, FaEnvelope, FaComments } from 'react-icons/fa';

const NotificationsFilters = ({ 
  onFilterChange, 
  onSearchChange, 
  typeCounts,
  currentFilter 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Reset search term when filter changes
    setSearchTerm('');
  }, [currentFilter]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleFilterChange = (filterType) => {
    onFilterChange(filterType);
  };

  // Ensure typeCounts has all required properties with default values
  const safeTypeCounts = {
    total: typeCounts?.total || 0,
    performance: typeCounts?.performance || 0,
    achievement: typeCounts?.achievement || 0,
    improvement: typeCounts?.improvement || 0,
    principal: typeCounts?.principal || 0,
    chat: typeCounts?.chat || 0,
    ...typeCounts
  };

  return (
    <div className="mb-6" dir="rtl">
      {/* Search Input */}
      <motion.div 
        className="relative mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="البحث في الإشعارات..."
          className="w-full pr-10 pl-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800
                   transition-all duration-200 text-right font-arabic"
        />
      </motion.div>

      {/* Filter Tabs */}
      <motion.div 
        className="flex flex-wrap gap-2 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleFilterChange('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentFilter === 'all'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-label={`عرض الكل (${safeTypeCounts.total})`}
        >
          الكل ({safeTypeCounts.total})
        </motion.button>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleFilterChange('performance')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            currentFilter === 'performance'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-label={`أداء (${safeTypeCounts.performance})`}
        >
          <FaChartBar />
          <span>أداء ({safeTypeCounts.performance})</span>
        </motion.button>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleFilterChange('achievement')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            currentFilter === 'achievement'
              ? 'bg-yellow-500 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-label={`إنجازات (${safeTypeCounts.achievement})`}
        >
          <FaTrophy />
          <span>إنجازات ({safeTypeCounts.achievement})</span>
        </motion.button>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleFilterChange('improvement')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            currentFilter === 'improvement'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-label={`تحسينات (${safeTypeCounts.improvement})`}
        >
          <FaWrench />
          <span>تحسينات ({safeTypeCounts.improvement})</span>
        </motion.button>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleFilterChange('principal')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            currentFilter === 'principal'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-label={`ردود (${safeTypeCounts.principal})`}
        >
          <FaEnvelope />
          <span>ردود ({safeTypeCounts.principal})</span>
        </motion.button>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleFilterChange('chat')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            currentFilter === 'chat'
              ? 'bg-pink-500 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-label={`محادثات (${safeTypeCounts.chat})`}
        >
          <FaComments />
          <span>محادثات ({safeTypeCounts.chat})</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotificationsFilters;