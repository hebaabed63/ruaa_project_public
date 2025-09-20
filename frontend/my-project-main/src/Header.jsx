// src/components/ui/Header.jsx
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => {
    navigate('/login'); // الانتقال إلى صفحة التسجيل
  };

  return (
    <header className={`bg-white shadow-md py-3 px-6 sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-md'}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* الشعار */}
        <div className="flex items-center">
          <img 
            src="assets\images\LOGO.svg" 
            alt="شعار المنصة" 
            className="h-12 me-3"
          />
          <h1 className="text-xl font-bold text-gray-800">رؤى التعليم المستقبلية</h1>
        </div>

        {/* أزرار الهيدر */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button 
            onClick={handleLogin}
            className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 px-4 py-2 rounded-md transition duration-300 font-medium"
          >
            تسجيل الدخول
          </button>
          
          <button 
            className="md:hidden text-gray-700 ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;