// =============================================================================
// Coming Soon Component for Under Development Pages
// مكون "قريباً" للصفحات قيد التطوير
// =============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { FaTools, FaRocket, FaClock } from 'react-icons/fa';

/**
 * مكون "قريباً" للصفحات قيد التطوير
 * Coming Soon component for pages under development
 */
const ComingSoon = ({ page = "هذه الميزة" }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        {/* Animated Icon - SIMPLIFIED */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
            <FaTools className="text-3xl text-white" />
          </div>
          
          {/* Static particles */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full opacity-70" />
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-400 rounded-full opacity-70" />
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
        >
          قريباً جداً!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg text-gray-600 dark:text-gray-300 mb-6"
        >
          <span className="font-semibold text-blue-600">{page}</span> قيد التطوير حالياً
        </motion.p>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-gray-500 dark:text-gray-400 mb-8 space-y-2"
        >
          <p className="flex items-center justify-center gap-2">
            <FaRocket className="text-blue-500" />
            نعمل بجد لإنجاز هذه الميزة
          </p>
          <p className="flex items-center justify-center gap-2">
            <FaClock className="text-orange-500" />
            ستكون متاحة قريباً
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ duration: 2, delay: 0.8 }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">التقدم: 75%</p>
        </motion.div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          onClick={() => window.history.back()}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
        >
          العودة للخلف
        </motion.button>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 text-xs text-gray-400 dark:text-gray-500"
        >
          <p>💡 نقدر صبركم ونعدكم بتجربة رائعة</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
