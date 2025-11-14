import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminHeader from './Header';
import Footer from './Footer';
// Updated import to use AdminContext instead of ParentProfileContext
import { AdminProvider, useAdminContext } from '../../contexts/AdminContext';
import { useUISettings } from '../../hooks/useData';

/**
 * مكون التخطيط الرئيسي مع إدارة الحالات والتبديل
 * Main Layout component with state management and theme switching
 */
const Layout = ({ children, title, subtitle, breadcrumbs = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings, toggleTheme } = useUISettings();
  // Updated to use admin context instead of parent context
  const { profile, loading: profileLoading } = useAdminContext();
  
  const [sidebarOpen, setSidebarOpen] = useState(!settings.sidebarCollapsed);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Update sidebar state when settings change

  useEffect(() => {
    setSidebarOpen(!settings.sidebarCollapsed);
  }, [settings.sidebarCollapsed]);

  return (
    <motion.div
      className={`
        min-h-screen flex flex-col 
        bg-[#F9FAFB]
        dark:bg-gray-800 
        transition-all duration-300 rtl
        ${settings.compactMode ? 'text-sm' : ''}
      `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-secondary/20" />
        <div
          className="absolute top-0 left-0 w-full h-full opacity-20 dark:opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23e5e7eb' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* الهيدر */}
      <header className="relative z-50">
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </header>

      {/* Sidebar and main content*/}
      <div className="flex flex-1 relative">
        {/* السايد بار */}
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />
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
        {/* Page Content */}
        <main
          className={`flex-1 transition-all duration-300 p-4 lg:p-6 ${
            sidebarOpen ? (sidebarCollapsed ? 'lg:mr-20' : 'lg:mr-64') : 'lg:mr-20'
          }`}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>

      <footer className="relative z-[9999]">
        <Footer />
      </footer>
    </motion.div>
  );
};

// Wrap the Layout component with AdminProvider instead of ParentProfileProvider
const LayoutWithProvider = (props) => (
  <AdminProvider>
    <Layout {...props} />
  </AdminProvider>
);

export default LayoutWithProvider;