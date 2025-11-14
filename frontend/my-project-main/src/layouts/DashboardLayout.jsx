import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { 
  FaCog, 
  FaBell, 
  FaUserCircle, 
  FaSignOutAlt,
  FaChevronDown,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const DashboardLayout = ({ children, sidebarItems = [], userInfo = {} }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { logout, userRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Default user info based on role
  const defaultUserInfo = {
    admin: { name: 'المدير العام', title: 'مدير النظام', avatar: 'م' },
    supervisor: { name: 'المشرف التعليمي', title: 'مشرف', avatar: 'ش' },
    school_manager: { name: 'مدير المدرسة', title: 'مدير مدرسة', avatar: 'د' },
    parent: { name: 'ولي الأمر', title: 'ولي أمر', avatar: 'و' }
  };

  const currentUserInfo = userInfo.name ? userInfo : defaultUserInfo[userRole] || defaultUserInfo.parent;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/admin')) return 'admin';
    if (path.includes('/supervisor')) return 'supervisor';
    if (path.includes('/school-manager')) return 'school-manager';
    if (path.includes('/parent')) return 'parent';
    return 'overview';
  };

  return (
    <div className="flex h-screen bg-gray-50 text-right" dir="rtl">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} fixed lg:relative inset-y-0 right-0 z-50 bg-blue-800 text-white transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex justify-between items-center border-b border-blue-700">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold">لوحة التحكم</h1>
          ) : (
            <div className="w-8 h-8"></div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-blue-700 focus:outline-none hidden lg:block"
          >
            {sidebarOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-blue-700 focus:outline-none lg:hidden"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6">
          <div>
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`w-full flex items-center px-6 py-3 text-right transition-colors duration-200 ${
                  item.active ? 'bg-blue-700' : 'hover:bg-blue-700'
                }`}
              >
                <item.icon className="ml-3" />
                {sidebarOpen && <span className="mr-2">{item.label}</span>}
              </button>
            ))}
          </div>
        </nav>

        {/* User section at bottom */}
        {sidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {currentUserInfo.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{currentUserInfo.name}</p>
                <p className="text-xs text-blue-200">{currentUserInfo.title}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <FaBars className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold text-gray-800 mr-4">
                {/* This will be filled by the specific dashboard */}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none">
                <FaBell className="text-xl" />
                <span className="absolute top-0 left-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none">
                <FaCog className="text-xl" />
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 space-x-reverse p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {currentUserInfo.avatar}
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-gray-700">{currentUserInfo.name}</p>
                    <p className="text-xs text-gray-500">{currentUserInfo.title}</p>
                  </div>
                  <FaChevronDown className="text-gray-400 text-sm" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        // Navigate to profile/settings
                      }}
                      className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 space-x-reverse"
                    >
                      <FaUserCircle />
                      <span>الملف الشخصي</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        // Navigate to settings
                      }}
                      className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 space-x-reverse"
                    >
                      <FaCog />
                      <span>الإعدادات</span>
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 space-x-reverse"
                    >
                      <FaSignOutAlt />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;