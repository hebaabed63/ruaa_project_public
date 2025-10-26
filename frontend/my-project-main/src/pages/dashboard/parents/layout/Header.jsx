// =============================================================================
// Enhanced Header Component for Parents Dashboard
// مكون الهيدر المتطور لداشبورد أولياء الأمور
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, 
  FaBell, 
  FaUser, 
  FaMoon, 
  FaSun,
  FaSignOutAlt,
  FaCog,
  FaHome,
  FaChevronLeft,
  FaComments
} from 'react-icons/fa';
import { Button } from '../ui';
import { useParentProfile, useNotifications, useUISettings } from '../../hooks/useData';
import { LogoutModal } from './LogoutModal';
import NotificationsDropdown from '../../components/NotificationsDropdown';

/**
 * مكون الهيدر المتطور مع الإشعارات والدردشة
 * Enhanced Header component with notifications and chat
 */
const ParentsHeader = ({ title, subtitle, breadcrumbs = [], onMenuClick }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const { profile, loading: profileLoading } = useParentProfile();
  const { notifications, unreadCount } = useNotifications();
  const { settings, toggleTheme, updateSetting } = useUISettings();

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
        className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Left Section - Menu & Greeting */}
          <div className="flex items-center space-x-4 space-x-reverse flex-1">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <FaBars />
            </Button>

            {/* Greeting */}
            <div className="min-w-0 flex-1">
              <h1 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white truncate">
                {getGreeting()}، {profileLoading ? '...' : (profile?.fullName?.split(' ')[0] || 'ولي الأمر')}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2 space-x-reverse">
            {/* Chat Icon */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard/parents/chat')}
              title="المحادثة"
            >
              <FaComments />
            </Button>

            {/* Theme Toggle - Show Sun icon when in Light mode, Moon icon when in Dark mode */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              title={settings.theme === 'light' ? 'الوضع المضيء' : 'الوضع المظلم'}
            >
              {settings.theme === 'light' ? <FaSun /> : <FaMoon />}
            </Button>

            {/* Notifications */}
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
                <FaBell />
                {unreadCount > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </Button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                <NotificationsDropdown
                  notifications={notifications}
                  unreadCount={unreadCount}
                  isOpen={notificationsOpen}
                  onClose={() => setNotificationsOpen(false)}
                />
              </AnimatePresence>
            </div>

            {/* Profile Menu */}
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
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
                  {profileLoading ? '...' : (profile?.fullName?.charAt(0) || 'ا')}
                </div>
                <span className="hidden lg:inline text-gray-700 dark:text-gray-300">
                  {profileLoading ? '...' : profile?.fullName?.split(' ')[0]}
                </span>
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
                    <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white text-lg font-bold">
                          {profile?.fullName?.charAt(0) || 'ا'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {profile?.fullName || 'ولي الأمر'}
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
                          navigate('/dashboard/parents/profile');
                        }}
                      >
                        <FaUser className="text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">الملف الشخصي</span>
                      </button>
                      
                      <button 
                        className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-right"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          navigate('/dashboard/parents/settings');
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
    </motion.header>
      
      <LogoutModal 
        isOpen={logoutModalOpen} 
        onClose={() => setLogoutModalOpen(false)} 
      />
    </>
  );
};

export default ParentsHeader;