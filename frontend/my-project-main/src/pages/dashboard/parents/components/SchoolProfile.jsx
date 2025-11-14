import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowRight, 
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaImages,
  FaStar,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';
import HomeTab from './tabs/HomeTab';
import TeachersTab from './tabs/TeachersTab';
import ActivitiesTab from './tabs/ActivitiesTab';
import MediaTab from './tabs/MediaTab';
import EvaluationsTab from './tabs/EvaluationsTab';

const SchoolProfile = ({ school, onBack, initialTab = 'home' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: 'home', name: 'الرئيسية', icon: FaHome },
    { id: 'teachers', name: 'المعلمين', icon: FaUsers },
    { id: 'activities', name: 'النشاطات', icon: FaCalendarAlt },
    { id: 'media', name: 'الصور والفيديوهات', icon: FaImages },
    { id: 'evaluations', name: 'التقييمات', icon: FaStar }
  ];

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#8b5cf6'; // بنفسجي - ممتاز
    if (rating >= 3.5) return '#10b981'; // أخضر - جيد
    if (rating >= 3.0) return '#f59e0b'; // أصفر - متوسط
    if (rating >= 2.0) return '#f97316'; // برتقالي - متوسط ضعيف
    return '#ef4444'; // أحمر - ضعيف
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab school={school} />;
      case 'teachers':
        return <TeachersTab school={school} />;
      case 'activities':
        return <ActivitiesTab school={school} />;
      case 'media':
        return <MediaTab school={school} />;
      case 'evaluations':
        return <EvaluationsTab school={school} />;
      default:
        return <HomeTab school={school} />;
    }
  };

  return (
    <div className="rtl">
      {/* Header Section */}
      <motion.div 
        className="relative mb-6 overflow-hidden rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative h-56 md:h-72">
          <img src={school.image} alt={school.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        </div>
        
        <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between">
          <motion.button
            className="self-start inline-flex items-center gap-2 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg shadow transition"
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowRight />
            العودة للبحث
          </motion.button>

          <div className="mt-auto grid grid-cols-1 md:grid-cols-[auto,1fr,auto] items-end gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/90 flex items-center justify-center text-2xl text-primary-600 shadow">
              <FaGraduationCap />
            </div>
            
            <div className="text-white">
              <h1 className="text-2xl md:text-3xl font-bold mb-1">{school.name}</h1>
              <p className="text-white/90 mb-2">{school.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="inline-flex items-center gap-2">
                  <FaMapMarkerAlt className="text-white/80" />
                  <span>{school.location}</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <FaUsers className="text-white/80" />
                  <span>{school.studentsCount} طالب</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <FaUsers className="text-white/80" />
                  <span>{school.teachersCount} معلم</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div 
                className="px-3 py-2 rounded-xl text-white flex items-center gap-2"
                style={{ backgroundColor: getRatingColor(school.overallRating) }}
              >
                <FaStar className="text-yellow-300" />
                <span className="font-bold">{school.overallRating}</span>
              </div>
              <span className="text-white font-semibold">التقييم العام</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div 
        className="sticky top-0 z-10 bg-white/80 backdrop-blur supports-backdrop-blur:backdrop-blur border-b border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto">
          {tabs.map((tab, index) => {
            const IconComponent = tab.icon;
            return (
              <motion.button
                key={tab.id}
                className={`relative px-4 py-2 rounded-lg whitespace-nowrap inline-flex items-center gap-2 transition ${activeTab === tab.id ? 'text-primary-700 bg-primary-50' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <IconComponent className="text-lg" />
                <span className="font-semibold">{tab.name}</span>
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute inset-x-2 -bottom-1 h-1 bg-primary-500 rounded-full"
                    layoutId="activeTab"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div 
        className="max-w-5xl mx-auto p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SchoolProfile;
