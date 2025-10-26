import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaChevronDown,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaTrophy,
  FaChartLine,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import Sidebar from './Sidebar';
import ParentsHeader from './Header';
import Footer from './Footer';
import { ParentProfileProvider, useParentProfileContext } from '../../contexts/ParentProfileContext';
import { useUISettings, useNotifications, useParentProfile } from '../../hooks/useData';
import { Card, Button } from '../ui';

/**
 * مكون التخطيط الرئيسي مع إدارة الحالات والتبديل
 * Main Layout component with state management and theme switching
 */
const Layout = ({ children, title, subtitle, breadcrumbs = [] }) => {
  const navigate = useNavigate();
  const { settings, toggleTheme } = useUISettings();
  const { profile, loading: profileLoading } = useParentProfileContext();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  
  const [sidebarOpen, setSidebarOpen] = useState(!settings.sidebarCollapsed);
  // Update sidebar state when settings change
  useEffect(() => {
    setSidebarOpen(!settings.sidebarCollapsed);
  }, [settings.sidebarCollapsed]);

  return (
    <div className={`
      min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 
      dark:from-gray-900 dark:to-blue-900 
      transition-all duration-300 rtl
      ${settings.compactMode ? 'text-sm' : ''}
    `}>
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-secondary/20" />
        <div className="absolute top-0 left-0 w-full h-full opacity-20 dark:opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23e5e7eb' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className={
        `transition-all duration-300 relative z-10 ${sidebarOpen ? 'lg:mr-64' : 'lg:mr-20'}`
      }>
        <ParentsHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <motion.main
          className="p-4 lg:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </motion.main>

        <Footer />
      </div>
    </div>
  );
};

// Wrap the Layout component with ParentProfileProvider
const LayoutWithProvider = (props) => {
  return (
    <ParentProfileProvider>
      <Layout {...props} />
    </ParentProfileProvider>
  );
};

export default LayoutWithProvider;