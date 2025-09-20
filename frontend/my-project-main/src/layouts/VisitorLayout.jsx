import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Header Component
const Header = () => {
  const navLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'عن المنصة', href: '/about' },
    { name: 'الخدمات', href: '/services' },
    { name: 'الأهداف', href: '/goals' },
    { name: 'المدارس', href: '/schools' },
    { name: 'التقييمات', href: '/evaluation' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-bold text-blue-800"
        >
          رؤى
        </motion.div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8 space-x-reverse">
          {navLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-blue-600 transition-colors"
              whileHover={{ y: -2 }}
            >
              {link.name}
            </motion.a>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4 space-x-reverse">
          <motion.a
            href="/login"
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            تسجيل الدخول
          </motion.a>
          <motion.a
            href="/register"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            إنشاء حساب
          </motion.a>
        </div>
      </div>
    </header>
  );
};

// Footer Component
const Footer = () => {
  const platformLinks = [
    { name: 'عن المنصة', href: '/about' },
    { name: 'الخدمات', href: '/services' },
    { name: 'الأهداف', href: '/goals' },
    { name: 'المدارس', href: '/schools' },
    { name: 'التقييمات', href: '/evaluation' },
  ];

  const quickLinks = [
    { name: 'سياسة الخصوصية', href: '/privacy' },
    { name: 'الشروط والأحكام', href: '/terms' },
    { name: 'الأسئلة الشائعة', href: '/faq' },
    { name: 'الشكاوى', href: '/complaints' },
  ];

  const socialLinks = [
    { icon: <FaFacebook />, href: '#' },
    { icon: <FaTwitter />, href: '#' },
    { icon: <FaInstagram />, href: '#' },
    { icon: <FaLinkedin />, href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Platform Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">منصة رؤى</h3>
            <p className="text-gray-400">
              منصة متكاملة لتقييم المدارس ورفع كفاءة التعليم
            </p>
            <div className="mt-4 flex space-x-4 space-x-reverse">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-white text-xl"
                  whileHover={{ y: -3 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">أقسام المنصة</h4>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 space-x-reverse">
                <FaMapMarkerAlt className="mt-1 text-blue-400" />
                <span className="text-gray-400">الرياض، المملكة العربية السعودية</span>
              </li>
              <li className="flex items-center space-x-2 space-x-reverse">
                <FaPhone className="text-blue-400" />
                <a href="tel:+966112345678" className="text-gray-400 hover:text-white">+966 11 234 5678</a>
              </li>
              <li className="flex items-center space-x-2 space-x-reverse">
                <FaEnvelope className="text-blue-400" />
                <a href="mailto:info@rua.sa" className="text-gray-400 hover:text-white">info@rua.sa</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
          <p>© {new Date().getFullYear()} منصة رؤى. جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
};

// Main Layout Component
const VisitorLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default VisitorLayout;