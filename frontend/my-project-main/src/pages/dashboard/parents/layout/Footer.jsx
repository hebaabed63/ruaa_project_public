import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

/**
 * Parents Dashboard Footer Component
 * مكون تذييل الصفحة لداشبورد أولياء الأمور
 */
const Footer = () => {
  const navigate = useNavigate();

  // Footer links data
  const footerLinks = [
    { id: 'privacy', label: 'الخصوصية', path: '/privacy' },
    { id: 'terms', label: 'الشروط والأحكام', path: '/terms' },
    { id: 'support', label: 'الدعم', path: '/support' }
  ];



  return (
    <motion.footer
      className="mt-8 py-6 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Right side - Copyright text */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>© 2025 رؤى التعليم المستقبلية. جميع الحقوق محفوظة.</p>
          </div>
          
          {/* Left side - Links */}
          <div className="flex items-center space-x-6 space-x-reverse">
            {footerLinks.map((link) => (
              <motion.a
                key={link.id}
                href={link.path}
                className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors relative"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.label}
                <motion.span
                  className="absolute bottom-0 right-0 w-0 h-0.5 bg-primary-500 dark:bg-primary-400"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>
        </div>
        
        {/* Additional footer info */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            نظام تقييم المدارس - يهدف إلى تحسين جودة التعليم من خلال الشفافية والتواصل
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;