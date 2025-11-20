// src/pages/dashboard/admin/components/layout/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, 
  FaBell, 
  FaUser, 
  FaSignOutAlt,
  FaCog,
  FaSearch,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { useAdminContext } from '../../contexts/AdminContext';
import NotificationsDropdown from '../NotificationsDropdown';


/**
 * 🎯 الهيدر بالستايل الأصلي مع إضافة أيقونة البحث
 * ✅ يحتفظ بالستايل القديم كاملاً
 * ✅ يضيف أيقونة البحث بجانب الوضع الداكن
 * ✅ لا يغير في التخطيط الأصلي
 */
const AdminHeader = ({ onMenuClick }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { profile, loading: profileLoading } = useAdminContext();
  const searchRef = useRef(null);

  // 🔍 تأثير فتح/إغلاق البحث
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchOpen && searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  // 🌙 تأثير الوضع الداكن
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  // 🔍 معالجة البحث
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performGlobalSearch(searchQuery.trim());
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  // 🎯 تنفيذ البحث الشامل
  const performGlobalSearch = (query) => {
    console.log(`🔍 البحث عن: "${query}"`);
    
    const searchTerms = {
      // 👥 إدارة المستخدمين
      'مستخدم': '/dashboard/admin/users',
      'مستخدمين': '/dashboard/admin/users',
      'users': '/dashboard/admin/users',
      'user': '/dashboard/admin/users',
      
      // 🏫 المدارس
      'مدرسة': '/dashboard/admin/schools',
      'مدارس': '/dashboard/admin/schools',
      'school': '/dashboard/admin/schools',
      'schools': '/dashboard/admin/schools',
      
      // 📊 التقارير
      'تقرير': '/dashboard/admin/reports',
      'تقارير': '/dashboard/admin/reports',
      'report': '/dashboard/admin/reports',
      'reports': '/dashboard/admin/reports',
      
      // 🔗 روابط المشرفين
      'رابط': '/dashboard/admin/links',
      'روابط': '/dashboard/admin/links',
      'link': '/dashboard/admin/links',
      'links': '/dashboard/admin/links',
      'مشرف': '/dashboard/admin/links',
      'مشرفين': '/dashboard/admin/links',
      
      // 🆘 الدعم
      'دعم': '/dashboard/admin/support',
      'دعم فني': '/dashboard/admin/support',
      'support': '/dashboard/admin/support',
      'ticket': '/dashboard/admin/support',
      
      // ⚙️ الإعدادات
      'إعدادات': '/dashboard/admin/settings',
      'settings': '/dashboard/admin/settings',
      'config': '/dashboard/admin/settings',
      
      // 👤 البروفايل
      'ملف': '/dashboard/admin/profile',
      'بروفايل': '/dashboard/admin/profile',
      'profile': '/dashboard/admin/profile',
      
      // 🏠 الداشبورد
      'رئيسية': '/dashboard/admin/dashboard',
      'لوحة': '/dashboard/admin/dashboard',
      'dashboard': '/dashboard/admin/dashboard',
      'home': '/dashboard/admin/dashboard'
    };

    const lowerQuery = query.toLowerCase();
    let targetPage = '/dashboard/admin/dashboard';

    for (const [term, page] of Object.entries(searchTerms)) {
      if (lowerQuery.includes(term.toLowerCase())) {
        targetPage = page;
        break;
      }
    }

    navigate(targetPage);
    
    setTimeout(() => {
      alert(`✅ تم البحث عن "${query}" والانتقال للصفحة المناسبة`);
    }, 100);
  };

  // 🌙 تبديل الوضع الداكن
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // 🚪 تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // 📧 تحميل الإشعارات (محاكاة)
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        title: 'طلب تسجيل جديد',
        message: 'هناك طلب تسجيل جديد من مشرف',
        time: 'منذ 5 دقائق',
        read: false,
        type: 'registration'
      },
      {
        id: 2,
        title: 'تقرير جديد',
        message: 'تم رفع تقرير جديد',
        time: 'منذ ساعة',
        read: false,
        type: 'report'
      }
    ];
    setNotifications(mockNotifications);
    setUnreadCount(2);
  }, []);

  return (
    <>
      {/* 🎨 الهيدر بالستايل الأصلي */}
      <motion.header
        className="sticky top-0 z-40 w-full bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center px-6 py-4">
          
          {/* 🏠 القسم الأيمن - اللوقو والعنوان */}
          <div className="flex items-center space-x-3 space-x-reverse">
            {/* زر القائمة الجانبية */}
            <button
              onClick={onMenuClick}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaBars className="text-xl" />
            </button>

            {/* اللوقو والعنوان */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                R
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  نظام مدير النظام
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {profile?.fullName?.split(' ')[0] || 'مدير النظام'}
                </p>
              </div>
            </div>
          </div>

          {/* 🔔 القسم الأيسر - الإجراءات */}
          <div className="flex items-center space-x-2 space-x-reverse">
            
            {/* 🔍 أيقونة البحث */}
            <div className="relative" ref={searchRef}>
              {searchOpen ? (
                <motion.div
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-600 z-50"
                  initial={{ opacity: 0, scale: 0.8, width: 0 }}
                  animate={{ opacity: 1, scale: 1, width: 300 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleSearch} className="flex items-center w-full p-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث في النظام..."
                      className="flex-1 bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm px-2"
                      autoFocus
                      dir="auto"
                    />
                    <button
                      type="submit"
                      className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                    >
                      <FaSearch className="text-sm" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      ✕
                    </button>
                  </form>
                </motion.div>
              ) : null}
              
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title="بحث في النظام"
              >
                <FaSearch className="text-xl" />
              </button>
            </div>

            {/* 🌙 تبديل الوضع الداكن */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title={darkMode ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            {/* 🔔 الإشعارات */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileMenuOpen(false);
                }}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FaBell className="text-xl" />
                {unreadCount > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </button>

              {/* 📨 قائمة الإشعارات */}
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

            {/* 👤 الملف الشخصي */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileMenuOpen(!profileMenuOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center space-x-3 space-x-reverse p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex flex-col items-start text-right">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {profileLoading ? '...' : profile?.fullName?.split(' ')[0] || 'مدير النظام'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">مدير النظام</span>
                </div>
                
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                  {profile?.profileImage ? (
                    <img 
                      src={profile.profileImage} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <FaUser className="text-sm" />
                  )}
                </div>
              </button>

              {/* 📋 قائمة الملف الشخصي */}
              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden z-50"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  >
                    {/* معلومات المستخدم */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold">
                          {profile?.fullName?.charAt(0) || 'ا'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {profile?.fullName || 'مدير النظام'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                            {profile?.email || 'admin@system.com'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* عناصر القائمة */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          navigate('/dashboard/admin/profile');
                        }}
                        className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 text-right hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <FaUser className="text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">الملف الشخصي</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          navigate('/dashboard/admin/settings');
                        }}
                        className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 text-right hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <FaCog className="text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">الإعدادات</span>
                      </button>
                    </div>

                    {/* تسجيل الخروج */}
                    <div className="border-t border-gray-200 dark:border-gray-600 py-2">
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          setLogoutModalOpen(true);
                        }}
                        className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 text-right hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
      </motion.header>

      {/* 🚪 نافذة تأكيد تسجيل الخروج */}
      <AnimatePresence>
        {logoutModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  تأكيد تسجيل الخروج
                </h3>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  هل أنت متأكد من رغبتك في تسجيل الخروج من النظام؟
                </p>
                
                <div className="flex justify-end space-x-3 space-x-reverse">
                  <button
                    onClick={() => setLogoutModalOpen(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 space-x-reverse"
                  >
                    <FaSignOutAlt />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminHeader;