// =============================================================================
// Enhanced Header Component for Admin  Dashboard
// مكون الهيدر المتطور لداشبورد  Admin
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, 
  FaBell, 
  FaUser, 
  FaSignOutAlt,
  FaCog
} from 'react-icons/fa';
import { Button } from '../ui';
// Updated import to use admin hooks instead of parent hooks
import { useAdminContext } from '../../contexts/AdminContext';
import { LogoutModal } from './LogoutModal';
import NotificationsDropdown from '../../components/NotificationsDropdown';
import ThemeToggle from './ThemeToggle';
import { fetchNotifications } from '../../services/notificationsApi';
import logo from "../../../../../assets/icons/LOGO.svg"; 

/**
 * مكون الهيدر المتطور مع الإشعارات والدردشة
 * Enhanced Header component with notifications and chat
 */
const AdminHeader = ({ title, subtitle, breadcrumbs = [], onMenuClick }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  // Updated to use admin context instead of parent context
  const { profile, loading: profileLoading } = useAdminContext();
  // Fetch notifications and calculate unread count

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
        const unread = data.filter(n => !n.read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };
    loadNotifications();
        // Set up interval to refresh notifications

    const interval = setInterval(loadNotifications, 30000);// Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);
  // Close dropdowns when clicking outside

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsOpen || profileMenuOpen) {
                // Check if click is outside both dropdowns

        const notificationsDropdown = document.querySelector('.notifications-dropdown');
        const profileDropdown = document.querySelector('.profile-dropdown');
        const isOutsideNotifications = notificationsDropdown && !notificationsDropdown.contains(event.target);
        const isOutsideProfile = profileDropdown && !profileDropdown.contains(event.target);
        if (isOutsideNotifications && isOutsideProfile) {
          setNotificationsOpen(false);
          setProfileMenuOpen(false);
        }
      }
    };
    if (notificationsOpen || profileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [notificationsOpen, profileMenuOpen]);
  // Get greeting based on time of day

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'صباح الخير';
    if (hour < 18) return 'مساء الخير';
    return 'مساء الخير';
  };

  
  return (
    <>
     <motion.header
  className="sticky top-0 z-50 w-full bg-[#FFFFFF] dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <div className="w-full px-4 lg:px-6">
    <div className="flex items-center justify-between h-16 lg:h-20">
      {/* Right Section - Logo + System Name */}
      <div className="flex items-center space-x-3 space-x-reverse pr-0 mr-0">
        <img src={logo} alt="Logo" className="w-10 h-10 ml-1" />
        <span className="text-lg font-bold text-gray-900 dark:text-white mr-2">
نظام مدير النظام         </span>
      </div>

      {/* Left Section - Actions */}
      <div 
        className="flex items-center space-x-4 space-x-reverse pl-0 ml-0"
      >
        {/* Theme Toggle */}
        <div>
          <ThemeToggle />
        </div>
        
        {/* Notifications */}
        <div>
          <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setNotificationsOpen(!notificationsOpen);
              setProfileMenuOpen(false);
            }}
            className="relative"
          >
            <FaBell className="text-gray-700 dark:text-gray-300" />
            {unreadCount > 0 && (
              <motion.span
                className="absolute -top-1 -right-1 bg-red-700 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </Button>
          {/* Notifications Dropdown */}
          <AnimatePresence>
            {notificationsOpen && (
              <NotificationsDropdown
                notifications={notifications}
                unreadCount={unreadCount}
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

        {/* User Icon + Name */}
        <div>
          <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setProfileMenuOpen(!profileMenuOpen);
            }}
            className="flex items-center space-x-2 space-x-reverse"
          >
            <FaUser className="text-gray-700 dark:text-gray-300" />
            <div className="flex flex-col items-start text-left">
              <span className="text-black dark:text-gray-300 font-medium truncate">
                {profileLoading ? '...' : profile?.fullName?.split(' ')[0]}
              </span>
              <span className="text-sm text-gray-400 dark:text-gray-500">مدير النظام  </span>
            </div>
          </Button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {profileMenuOpen && (
              <motion.div
                className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden z-50 profile-dropdown"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Profile Info */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-600 w-fit">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white text-lg font-bold mr-2">
                      {profile?.fullName?.charAt(0) || 'ا'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {profile?.fullName || 'مدير النظام '}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {profile?.email || 'email@example.com'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-right"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      navigate('/dashboard/Admin/profile');
                    }}
                  >
                    <FaUser className="text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">الملف الشخصي</span>
                  </button>

                  <button
                    className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-right"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      navigate('/dashboard/Admin/settings');
                    }}
                  >
                    <FaCog className="text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">الإعدادات</span>
                  </button>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 py-2">
                  <button
                    className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-right"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setLogoutModalOpen(true);
                    }}
                  >
                    <FaSignOutAlt className="text-red-400" />
                    <span className="text-red-600 dark:text-red-400">تسجيل الخروج</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
    </div>
  </div>
</motion.header>

      
      <LogoutModal 
        isOpen={logoutModalOpen} 
        onClose={() => setLogoutModalOpen(false)} 
      />
    </>
  );
};

export default AdminHeader;