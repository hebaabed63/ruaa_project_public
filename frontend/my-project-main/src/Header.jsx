// src/components/ui/Header.jsx
import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import logo from "./assets/images/LOGO.svg";

const Header = () => {
  const { isAuthenticated, logout, user, userAvatar, userRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get dashboard path based on user role
  const getDashboardPath = () => {
    switch (userRole) {
      case 'admin':
        return '/dashboard/admin';
      case 'parent':
        return '/dashboard/parent';
      case 'supervisor':
        return '/dashboard/supervisor';
      case 'school_manager':
        return '/dashboard/school-manager';
      default:
        return '/dashboard';
    }
  };

  const handleDashboardClick = () => {
    setIsProfileMenuOpen(false);
    navigate(getDashboardPath());
  };

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        <h1 className="text-xl font-bold text-gray-800">رؤى</h1>
      </div>
      
      <nav>
        {isAuthenticated ? (
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-2 space-x-reverse bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-2 transition-colors"
            >
              {userAvatar ? (
                <img 
                  src={userAvatar} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
              <span className="text-gray-800 font-medium">{user?.name || 'المستخدم'}</span>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                <button
                  onClick={handleDashboardClick}
                  className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  لوحة التحكم
                </button>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  الملف الشخصي
                </Link>
                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-right px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            تسجيل الدخول
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;