import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome,
  FaSchool,
  FaComments,
  FaBell,
  FaUser,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
  FaGraduationCap,
  FaBars,
  FaExclamationTriangle
} from 'react-icons/fa';

const navigationItems = [
  {
    id: 'dashboard',
    label: 'لوحة التحكم',
    icon: FaHome,
    path: '/dashboard/parents/dashboard',
  },
  {
    id: 'schools',
    label: 'المدارس',
    icon: FaSchool,
    path: '/dashboard/parents/schools',
  },
  {
    id: 'complaints',
    label: 'رفع شكاوي',
    icon: FaExclamationTriangle,
    path: '/dashboard/parents/complaints',
  },
  {
    id: 'chat',
    label: 'المحادثة',
    icon: FaComments,
    path: '/dashboard/parents/chat',
  },
  {
    id: 'notifications',
    label: 'الإشعارات',
    icon: FaBell,
    path: '/dashboard/parents/notifications',
  },
];

const bottomItems = [
  {
    id: 'profile',
    label: 'الملف الشخصي',
    icon: FaUser,
    path: '/dashboard/parents/profile',
  },
  {
    id: 'settings',
    label: 'الإعدادات',
    icon: FaCog,
    path: '/dashboard/parents/settings',
  },
];

const NavItem = ({ item, isActive, isCollapsed, onItemClick, index }) => {
  const IconComponent = item.icon;

  return (
    <motion.button
      onClick={() => onItemClick(item)}
      className={`
        w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
        ${isActive 
          ? 'bg-primary-500 text-white shadow-lg' 
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
        }
        ${isCollapsed ? 'justify-center px-3' : 'justify-start'}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      title={isCollapsed ? item.label : undefined}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="flex-shrink-0 flex items-center justify-center">
        <IconComponent className={`${isCollapsed ? 'text-xl' : 'text-lg'}`} />
      </div>
      {!isCollapsed && (
        <motion.span 
          className="flex-1 text-right font-medium truncate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {item.label}
        </motion.span>
      )}
    </motion.button>
  );
};

const Sidebar = ({ isOpen, onToggle }) => {
  const [activeItem, setActiveItem] = useState('schools'); // Default to schools
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Update active item based on current location
  useEffect(() => {
    const path = location.pathname;
    // More precise matching - check if the path ends with the item's path segment
    const currentItem = navigationItems.find(item => {
      const itemPathSegments = item.path.split('/');
      const lastSegment = itemPathSegments[itemPathSegments.length - 1];
      return path.endsWith('/' + lastSegment) || path.endsWith('/' + lastSegment + '/');
    }) || bottomItems.find(item => {
      const itemPathSegments = item.path.split('/');
      const lastSegment = itemPathSegments[itemPathSegments.length - 1];
      return path.endsWith('/' + lastSegment) || path.endsWith('/' + lastSegment + '/');
    });
    
    if (currentItem) {
      setActiveItem(currentItem.id);
    } else if (path === '/dashboard/parents' || path === '/dashboard/parents/') {
      // Default to schools page for the base path
      setActiveItem('schools');
    }
  }, [location.pathname]);

  const handleItemClick = (item) => {
    setActiveItem(item.id);
    navigate(item.path);
  };

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile menu button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 lg:hidden bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <FaBars className="text-gray-600 dark:text-gray-300" />
      </motion.button>

      <motion.aside
        className={`
          fixed right-0 top-0 z-40 h-full bg-white dark:bg-gray-800 shadow-xl
          border-l border-gray-200 dark:border-gray-700 
          flex flex-col transition-all duration-300
          ${isOpen ? (isCollapsed ? 'translate-x-0 w-20' : 'translate-x-0 w-64') : 'translate-x-full w-64'}
          lg:translate-x-0
        `}
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        <div className={`p-4 border-b border-gray-200 dark:border-gray-700 ${isCollapsed ? 'px-3' : ''}`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <motion.div 
                className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold"
                whileHover={{ rotate: 5 }}
              >
                <FaGraduationCap />
              </motion.div>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="font-bold text-gray-900 dark:text-white">تقييم المدارس</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">لوحة أولياء الأمور</p>
                </motion.div>
              )}
            </div>
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCollapseToggle}
                className="hidden lg:flex"
              >
                <FaChevronRight />
              </Button>
            )}
          </div>
        </div>

        {isCollapsed && (
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCollapseToggle}
              className="w-full"
              title="توسيع القائمة"
            >
              <FaChevronLeft />
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="space-y-1">
            {navigationItems.map((item, index) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                isCollapsed={isCollapsed}
                onItemClick={handleItemClick}
                index={index}
              />
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
          {bottomItems.map((item, index) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeItem === item.id}
              isCollapsed={isCollapsed}
              onItemClick={handleItemClick}
              index={index + navigationItems.length}
            />
          ))}
        </div>
      </motion.aside>
    </>
  );
};

const Button = ({ 
  children, 
  variant = 'ghost', 
  size = 'md', 
  onClick,
  className = '',
  title,
  ...props 
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`
        rounded-lg transition-colors duration-200 flex items-center justify-center
        ${variant === 'ghost' ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400' : ''}
        ${size === 'sm' ? 'p-2' : 'px-4 py-2'}
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={title}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Sidebar;