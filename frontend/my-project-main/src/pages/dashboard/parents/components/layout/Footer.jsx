import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

/**
 * supervisor Dashboard Footer Component
 * مكون تذييل الصفحة لداشبورد أولياء الأمور
 */
const Footer = () => {
  const navigate = useNavigate();

  // Footer links data
  const footerLinks = [
    { id: 'terms', label: 'الشروط والأحكام', path: '/terms' },
    { id: 'privacy', label: 'الخصوصية', path: '/privacy' },
  ];

  return (
    <motion.footer
      className="mt-8 pb-1 bg-secondary dark:bg-gray-800/80 backdrop-blur"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full mt-6 pt-3 flex justify-between items-center relative"
      >
        {/* border */}
        <div className="absolute top-0 left-0 right-0 border-t border-[#E3E8E9]" />

        {/* Right side - Copyright */}
        <div
          className="text-sm text-white font-light pr-6"
          style={{ direction: "ltr", unicodeBidi: "plaintext" }}
        >
          © {new Date().getFullYear()} Ru'a Platform, All Rights Reserved.
        </div>

        {/* Left side - Links */}
        <div className="flex items-center gap-x-6 pl-6 my-2">
          {footerLinks.map((link) => (
            <motion.a
              key={link.id}
              href={link.path}
              className="text-sm text-white hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors relative"
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
      </motion.div>
    </motion.footer>
  );
};

export default Footer;