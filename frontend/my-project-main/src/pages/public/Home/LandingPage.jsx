

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import SchoolSection from './components/SchoolSection';
import BestSchools from './components/BestSchools';
import UpdateSection from './components/UpdateSection';
import FQAsection from './components/FQAsection';
import FeedbackSection from './components/FeedbackSection';
import Footer from '../components/Footer';
import headerimg from '../../../assets/images/headerimg1.png';
import HeroSection from '../Home/components/HeroSection';

const LandingPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  if (error) {
    return (
      <div className="flex flex-col min-h-screen font-cairo" dir="rtl">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-2xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              إعادة المحاولة
            </button>
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
        
        <HeroSection />
      </div>

      <main className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 relative z-10"> 
        <SchoolSection />
        <BestSchools />
        <UpdateSection />
        <FQAsection />
        <FeedbackSection />
      </main>

    {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Footer />
      </motion.footer>
    </div>
  );
};

export default LandingPage;