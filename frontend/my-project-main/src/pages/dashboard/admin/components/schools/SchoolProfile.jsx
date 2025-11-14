// =============================================================================
// Comprehensive School Profile Component
// مكون ملف المدرسة الشامل والتفصيلي
// =============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSchool, 
  FaStar, 
  FaUsers, 
  FaGraduationCap,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaClock,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaTrophy,
  FaChartBar,
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaEye,
  FaInfoCircle,
  FaChevronRight,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import { Card, Button, Badge, Modal } from '../ui';

/**
 * مكون ملف المدرسة التفصيلي الشامل
 * Comprehensive school profile component
 * 
 * @param {Object} school - بيانات المدرسة
 * @param {Boolean} isFavorite - هل المدرسة في المفضلة
 * @param {Function} onToggleFavorite - دالة التبديل للمفضلة
 * @param {Function} onEvaluate - دالة فتح نموذج التقييم
 * @param {Boolean} isVisible - ظهور المكون
 * @param {Function} onClose - دالة الإغلاق
 */
const SchoolProfile = ({ 
  school, 
  isFavorite = false, 
  onToggleFavorite, 
  onEvaluate,
  isVisible = false,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showContactModal, setShowContactModal] = useState(false);

  if (!school) {
    return null;
  }

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-purple-500 bg-purple-100';
    if (rating >= 3.5) return 'text-green-500 bg-green-100';
    if (rating >= 3.0) return 'text-yellow-500 bg-yellow-100';
    return 'text-red-500 bg-red-100';
  };

  const getRatingText = (rating) => {
    if (rating >= 4.5) return 'ممتاز';
    if (rating >= 3.5) return 'جيد جداً';
    if (rating >= 3.0) return 'جيد';
    return 'يحتاج تحسين';
  };

  const getSchoolTypeColor = (type) => {
    switch (type) {
      case 'ابتدائية': return 'bg-blue-500';
      case 'متوسطة': return 'bg-purple-500';
      case 'ثانوية': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: FaSchool },
    { id: 'ratings', label: 'التقييمات', icon: FaStar },
    { id: 'facilities', label: 'المرافق', icon: FaInfoCircle },
    { id: 'contact', label: 'التواصل', icon: FaPhone }
  ];

  const ratingCategories = [
    { key: 'educationQuality', label: 'جودة التعليم', icon: FaGraduationCap },
    { key: 'facilities', label: 'المرافق', icon: FaSchool },
    { key: 'teachers', label: 'المعلمون', icon: FaUsers },
    { key: 'administration', label: 'الإدارة', icon: FaChartBar },
    { key: 'cleanliness', label: 'النظافة', icon: FaCheck },
    { key: 'safety', label: 'الأمان', icon: FaInfoCircle },
    { key: 'communication', label: 'التواصل', icon: FaPhone }
  ];

  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-xl">
          <FaUsers className="text-2xl text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{school.studentsCount}</p>
          <p className="text-sm text-gray-600">طالب</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-xl">
          <FaGraduationCap className="text-2xl text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{school.teachersCount}</p>
          <p className="text-sm text-gray-600">معلم</p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-xl">
          <FaSchool className="text-2xl text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{school.classroomsCount}</p>
          <p className="text-sm text-gray-600">فصل</p>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-xl">
          <FaCalendarAlt className="text-2xl text-yellow-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{new Date().getFullYear() - school.establishedYear}</p>
          <p className="text-sm text-gray-600">سنة</p>
        </div>
      </div>

      {/* الوصف */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <FaInfoCircle className="text-primary-500" />
          <h3 className="text-lg font-bold text-gray-900">نبذة عن المدرسة</h3>
        </div>
        <p className="text-gray-600 leading-relaxed">
          {school.description}
        </p>
      </Card>

      {/* الإنجازات */}
      {school.achievements && school.achievements.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <FaTrophy className="text-yellow-500" />
            <h3 className="text-lg font-bold text-gray-900">الإنجازات والجوائز</h3>
          </div>
          <div className="space-y-3">
            {school.achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg"
              >
                <FaTrophy className="text-yellow-500 flex-shrink-0" />
                <p className="text-gray-800">{achievement}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* معلومات إضافية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">أوقات العمل</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">بداية الدوام:</span>
              <span className="font-semibold">{school.workingHours?.start}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">نهاية الدوام:</span>
              <span className="font-semibold">{school.workingHours?.end}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">وقت الاستراحة:</span>
              <span className="font-semibold">{school.workingHours?.breakTime}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">معلومات مالية</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">الرسوم السنوية:</span>
              <span className="font-bold text-green-600 text-lg">
                {school.tuitionFees?.toLocaleString()} ريال
              </span>
            </div>
            <p className="text-sm text-gray-500">
              * قد تختلف الرسوم حسب الصف الدراسي والخدمات الإضافية
            </p>
          </div>
        </Card>
      </div>
    </motion.div>
  );

  const renderRatings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* التقييم العام */}
      <Card>
        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 ${getRatingColor(school.overallRating)}`}>
            <FaStar />
            <span className="text-2xl font-bold">{school.overallRating}</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{getRatingText(school.overallRating)}</p>
          <p className="text-sm text-gray-500">على أساس {school.ratingsCount} تقييم</p>
        </div>
      </Card>

      {/* تفاصيل التقييمات */}
      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-6">تفاصيل التقييم</h3>
        <div className="space-y-4">
          {ratingCategories.map((category) => {
            const rating = school.ratings?.[category.key] || 0;
            const percentage = (rating / 5) * 100;
            
            return (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <category.icon className="text-gray-600" />
                    <span className="font-medium text-gray-900">{category.label}</span>
                  </div>
                  <span className="font-bold text-gray-900">{rating.toFixed(1)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${getRatingColor(rating).split(' ')[1]}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* زر التقييم */}
      <div className="text-center">
        <Button 
          variant="primary" 
          size="lg"
          onClick={onEvaluate}
          className="px-8"
        >
          <FaStar className="ml-2" />
          قيّم هذه المدرسة
        </Button>
      </div>
    </motion.div>
  );

  const renderFacilities = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-6">المرافق والخدمات</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {school.facilities?.map((facility, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
            >
              <FaCheck className="text-green-500 flex-shrink-0" />
              <span className="text-gray-800">{facility}</span>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );

  const renderContact = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-6">معلومات التواصل</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <FaMapMarkerAlt className="text-primary-500 text-lg" />
            <div>
              <p className="font-medium text-gray-900">العنوان</p>
              <p className="text-gray-600">{school.address}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <FaPhone className="text-green-500 text-lg" />
            <div>
              <p className="font-medium text-gray-900">رقم الهاتف</p>
              <p className="text-gray-600" dir="ltr">{school.phone}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <FaEnvelope className="text-blue-500 text-lg" />
            <div>
              <p className="font-medium text-gray-900">البريد الإلكتروني</p>
              <p className="text-gray-600">{school.email}</p>
            </div>
          </div>
          
          {school.website && (
            <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <FaGlobe className="text-purple-500 text-lg" />
              <div>
                <p className="font-medium text-gray-900">الموقع الإلكتروني</p>
                <p className="text-gray-600">{school.website}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <FaGraduationCap className="text-orange-500 text-lg" />
            <div>
              <p className="font-medium text-gray-900">مدير المدرسة</p>
              <p className="text-gray-600">{school.principalName}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            onClick={() => setShowContactModal(true)}
            className="w-full"
          >
            <FaPhone className="ml-2" />
            إرسال رسالة للمدرسة
          </Button>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="min-h-screen bg-black bg-opacity-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="relative">
                <img 
                  src={school.image} 
                  alt={school.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Actions */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <button
                    onClick={onClose}
                    className="p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/30 transition-colors"
                  >
                    <FaTimes />
                  </button>
                  <button
                    onClick={() => onToggleFavorite(school.id)}
                    className="p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/30 transition-colors"
                  >
                    {isFavorite ? <FaHeart className="text-red-400" /> : <FaRegHeart />}
                  </button>
                  <button
                    className="p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/30 transition-colors"
                  >
                    <FaShareAlt />
                  </button>
                </div>

                {/* School Info */}
                <div className="absolute bottom-4 right-4 left-4 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 ${getSchoolTypeColor(school.type)} rounded-xl flex items-center justify-center text-white font-bold shadow-lg`}>
                      🏫
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{school.name}</h2>
                      <div className="flex items-center gap-2 text-sm">
                        <FaMapMarkerAlt />
                        <span>{school.location}</span>
                        {school.hasMyChild && (
                          <Badge variant="success" size="sm">مدرسة طفلي</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <tab.icon />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="max-h-96 overflow-y-auto">
                  {activeTab === 'overview' && renderOverview()}
                  {activeTab === 'ratings' && renderRatings()}
                  {activeTab === 'facilities' && renderFacilities()}
                  {activeTab === 'contact' && renderContact()}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Contact Modal */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="إرسال رسالة"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            إرسال رسالة إلى: <strong>{school.name}</strong>
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الموضوع</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="موضوع الرسالة"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الرسالة</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="اكتب رسالتك هنا..."
            />
          </div>
          <div className="flex gap-3">
            <Button variant="primary" className="flex-1">
              إرسال الرسالة
            </Button>
            <Button variant="outline" onClick={() => setShowContactModal(false)}>
              إلغاء
            </Button>
          </div>
        </div>
      </Modal>
    </AnimatePresence>
  );
};

export default SchoolProfile;
