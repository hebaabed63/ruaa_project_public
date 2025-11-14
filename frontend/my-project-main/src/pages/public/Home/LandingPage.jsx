import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../../../Header';
import usePageTitle from '../../../hooks/usePageTitle';
import headerimg from '../../../assets/images/hero-section.png';

const LandingPage = () => {
  // Set page title
  usePageTitle("الصفحة الرئيسية");
  
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-screen font-cairo" dir="rtl">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل الصفحة...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-cairo" dir="rtl">
      <div className="relative h-screen overflow-hidden"> 
        
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {!imageError ? (
            <img 
              src={headerimg} 
              alt="خلفية الصفحة" 
              className="w-full h-full object-cover object-center"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-indigo-900 to-blue-800"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 via-blue-950/40 to-blue-950/80"></div>
        </motion.div>
        
        <Header variant="transparent" showTitle={false} />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              منصة رؤى التعليمية
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              المنصة الرائدة لإدارة المدارس والطلاب والمعلمين
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
              >
                تسجيل الدخول
              </Link>
              <Link 
                to="/register" 
                className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-8 rounded-lg transition-colors duration-300"
              >
                إنشاء حساب
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">مرحباً بكم في منصة رؤى</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              نقدم أفضل الحلول التعليمية لإدارة المدارس والطلاب والمعلمين في مكان واحد
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-blue-600 text-4xl mb-4">🏫</div>
              <h3 className="text-xl font-bold mb-2">إدارة المدارس</h3>
              <p className="text-gray-600">
                نظام متكامل لإدارة المدارس والمعلمين والطلاب بكفاءة
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-green-600 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">تقارير وتقييمات</h3>
              <p className="text-gray-600">
                تقارير تحليلية وتقييمات شاملة لأداء المدارس والطلاب
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-purple-600 text-4xl mb-4">👨‍🏫</div>
              <h3 className="text-xl font-bold mb-2">دعم المعلمين</h3>
              <p className="text-gray-600">
                أدوات وموارد تعليمية لدعم المعلمين في مهامهم اليومية
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;