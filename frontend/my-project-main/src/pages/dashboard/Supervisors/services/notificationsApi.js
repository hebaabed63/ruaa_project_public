/**
 * Mock Notifications API Service
 * Simulates API calls with realistic delays
 */

import notificationsMockData from './notificationsMockData';
import { FaChartBar, FaTrophy, FaWrench, FaEnvelope, FaComments, FaUser } from 'react-icons/fa';

// Mock delay to simulate network requests
const simulateDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch notifications with a delay to simulate API call
 * @returns {Promise<Array>} Array of notification objects
 */
export const fetchNotifications = async () => {
  await simulateDelay();
  return [...notificationsMockData];
};

/**
 * Mark a notification as read
 * @param {number} id - The ID of the notification to mark as read
 * @returns {Promise<Object>} Success response
 */
export const markAsRead = async (id) => {
  await simulateDelay(300);
  return { success: true, message: 'تم وضع علامة مقروء على الإشعار' };
};

/**
 * Mark a notification as unread
 * @param {number} id - The ID of the notification to mark as unread
 * @returns {Promise<Object>} Success response
 */
export const markAsUnread = async (id) => {
  await simulateDelay(300);
  return { success: true, message: 'تم وضع علامة غير مقروء على الإشعار' };
};

/**
 * Archive a notification
 * @param {number} id - The ID of the notification to archive
 * @returns {Promise<Object>} Success response
 */
export const archiveNotification = async (id) => {
  await simulateDelay(300);
  return { success: true, message: 'تم أرشفة الإشعار' };
};

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} Success response
 */
export const markAllAsRead = async () => {
  await simulateDelay(500);
  return { success: true, message: 'تم وضع علامة مقروء على جميع الإشعارات' };
};

/**
 * Get notification type configuration
 * @param {string} type - The notification type
 * @returns {Object} Configuration for the notification type
 */
export const getNotificationTypeConfig = (type) => {
  const configs = {
    performance: {
      label: 'أداء الطالب',
      icon: FaChartBar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-500'
    },
    achievement: {
      label: 'إنجازات المدرسة',
      icon: FaTrophy,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-500'
    },
    improvement: {
      label: 'تحسينات المدرسة',
      icon: FaWrench,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-500'
    },
    principal: {
      label: 'ردود المدير',
      icon: FaEnvelope,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-500'
    },
    chat: {
      label: 'محادثات',
      icon: FaComments,
      color: 'text-pink-500',
      bgColor: 'bg-pink-100',
      borderColor: 'border-pink-500'
    }
  };
  
  return configs[type] || {
    label: 'إشعار',
    icon: FaUser,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-500'
  };
};

export default {
  fetchNotifications,
  markAsRead,
  markAsUnread,
  archiveNotification,
  markAllAsRead,
  getNotificationTypeConfig
};