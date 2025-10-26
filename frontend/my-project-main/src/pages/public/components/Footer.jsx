import { motion } from 'framer-motion';
import instagram from "../../../assets/icons/instagram.svg";
import facebook from "../../../assets/icons/facebook.svg";
import twitter from "../../../assets/icons/twitter.svg";


export default function Footer() {
  return (
    <footer className="bg-babyBlue text-black py-12 mt-16 font-cairo" dir="rtl">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
        {/* Platform Sections */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
  className="space-y-2 border-l border-gray-300 pl-4"
        >
          <h3 className="text-lg font-semibold pb-2 ">أقسام المنصّة</h3>
          <ul className="space-y-3">
            <li>
              <a href="/about" className="hover:text-blue-600 transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                عن المنصّة
              </a>
            </li>
            <li>
              <a href="/services" className="hover:text-blue-600 transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                الخدمات
              </a>
            </li>
            <li>
              <a href="/objectives" className="hover:text-blue-600 transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                الأهداف
              </a>
            </li>
            <li>
              <a href="/evaluate" className="hover:text-blue-600 transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                التقييمات
              </a>
            </li>
            <li>
              <a href="/schools" className="hover:text-blue-600 transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                المدارس
              </a>
            </li>
          </ul>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
  className="space-y-2 border-l border-gray-300 pl-4"
        >
          <h3 className="text-lg font-semibold pb-2 mr-7">روابط سريعة</h3>
          <ul className="space-y-3">
            <li>
              <a href="/" className="hover:text-blue-600 transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                سياسة الخصوصيّة
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-blue-600 transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                الأسئلة الشائعة
              </a>
            </li>
          </ul>
        </motion.div>

        {/* Contact Us */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
  className="space-y-2 border-l border-gray-300 pl-4"
        >
          <h3 className="text-lg font-semibold pb-2 mr-7">تواصل معنا</h3>
          <ul className="space-y-3 ">
            <li>
              <a href="/" className="hover:text-blue-600 transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                البريد الإلكتروني
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-blue-600 transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                اتصل بنا
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-blue-600 transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                الشكاوي
              </a>
            </li>
          </ul>
        </motion.div>

        {/* Follow Us */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
  className="space-y-6 border-l border-gray-300 pl-4 mr-8"
        >
          <h3 className="text-lg font-semibold pb-2 ">تابعنا</h3>
          <div className="grid gap-2 mt-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="cursor-pointer">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <img src={instagram} alt="Instagram" className="w-8 h-8" />
              </a>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="cursor-pointer">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <img src={facebook} alt="Facebook" className="w-8 h-8" />
              </a>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="cursor-pointer">
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <img src={twitter} alt="Twitter" className="w-8 h-8" />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Copyright */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="max-w-6xl mx-auto px-6 mt-12 pt-6 border-t border-gray-300"
      >
        <div
          className="text-center text-sm text-gray-600"
          style={{ direction: "ltr", unicodeBidi: "plaintext" }}
        >
          © {new Date().getFullYear()} Ru'a Platform, All Rights Reserved.
        </div>
      </motion.div>
    </footer>
  );
}