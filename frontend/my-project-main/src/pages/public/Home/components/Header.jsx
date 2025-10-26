import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LOGO from '../../../../assets/images/LOGO.svg';
import HeroSection from '../components/HeroSection';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = ['الرئيسية', 'عن المنصّة', 'الخدمات', 'الأهداف', 'المدارس','التقييمات', 'تواصل معنا'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 font-cairo" dir="rtl">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-300 hover:bg-white/5 hover:backdrop-blur-sm">
        <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="logo" className="w-10 h-10" />
            <h1 className="text-xl font-bold text-white">رؤى التعليم المستقبلية</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-reverse space-x-6">
            {navItems.map((item, index) => (
              <motion.a
                key={index}
                href="#"
                className="relative text-white/90 hover:text-white px-3 py-2 font-medium text-sm transition-colors duration-200 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
                <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/login"
                className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                تسجيل دخول
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="hidden md:block">
              <Link
                to="/register"
                className="px-5 py-2.5 text-sm font-medium text-white bg-transparent border-2 border-white/30 rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
              >
                إنشاء حساب
              </Link>
            </motion.div>
            <button onClick={toggleMenu} className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden bg-gradient-to-b from-blue-900/95 to-indigo-900/95 backdrop-blur-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="container mx-auto px-4 py-4 space-y-1">
                {navItems.map((item, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className="block py-3 px-4 text-white/90 hover:bg-white/10 rounded-lg transition-colors duration-200 text-right"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                    whileHover={{ x: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item}
                  </motion.a>
                ))}
                <div className="pt-2 border-t border-white/10 mt-3">
                  <Link
                    to="/login"
                    className="block w-full py-3 px-4 text-center text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors duration-200 mb-2"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full py-3 px-4 text-center text-white border-2 border-white/30 hover:bg-white/10 rounded-lg font-medium transition-colors duration-200"
                  >
                    إنشاء حساب جديد
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <HeroSection />
    </div>
  );
};

export default Header;