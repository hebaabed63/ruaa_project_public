// =============================================================================
// Advanced School Selection Dropdown Component
// مكون اختيار المدارس المتطور مع ميزات تفاعلية
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSchool, 
  FaChevronDown, 
  FaSearch, 
  FaStar, 
  FaUsers, 
  FaMapMarkerAlt,
  FaGraduationCap,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

/**
 * مكون اختيار المدرسة المتطور مع البحث والفلترة
 * Advanced school selection dropdown with search and filtering
 * 
 * @param {Array} schools - قائمة المدارس المتاحة
 * @param {Function} onSelect - دالة استدعاء عند اختيار مدرسة
 * @param {Object} selectedSchool - المدرسة المختارة حاليًا
 * @param {String} placeholder - النص الافتراضي
 * @param {Boolean} showOnlyMyChildren - عرض مدارس الأطفال فقط
 * @param {Boolean} disabled - تعطيل المكون
 * @param {String} className - كلاسات CSS إضافية
 */
const SchoolDropdown = ({ 
  schools = [], 
  onSelect, 
  selectedSchool = null,
  placeholder = "اختر المدرسة",
  showOnlyMyChildren = false,
  disabled = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSchools, setFilteredSchools] = useState([]);
  const dropdownRef = useRef(null);

  // فلترة المدارس حسب البحث والشروط
  useEffect(() => {
    let filtered = schools;

    // فلترة حسب مدارس الأطفال
    if (showOnlyMyChildren) {
      filtered = filtered.filter(school => school.hasMyChild);
    }

    // فلترة حسب البحث
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(school => 
        school.name.toLowerCase().includes(searchLower) ||
        school.location.toLowerCase().includes(searchLower) ||
        school.type.toLowerCase().includes(searchLower)
      );
    }

    setFilteredSchools(filtered);
  }, [schools, searchTerm, showOnlyMyChildren]);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSchoolSelect = (school) => {
    onSelect(school);
    setIsOpen(false);
    setSearchTerm('');
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-purple-500';
    if (rating >= 3.5) return 'text-green-500';
    if (rating >= 3.0) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSchoolTypeIcon = (type) => {
    switch (type) {
      case 'ابتدائية': return '🏫';
      case 'متوسطة': return '🏢';
      case 'ثانوية': return '🎓';
      default: return '🏫';
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* زر فتح القائمة */}
      <motion.button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-4 py-3 
          bg-white border border-gray-200 rounded-xl shadow-sm
          hover:border-primary-300 hover:shadow-md
          focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
          transition-all duration-300
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'border-primary-500 shadow-md' : ''}
        `}
        whileHover={{ scale: disabled ? 1 : 1.01 }}
        whileTap={{ scale: disabled ? 1 : 0.99 }}
      >
        <div className="flex items-center gap-3">
          {selectedSchool ? (
            <>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                {getSchoolTypeIcon(selectedSchool.type)}
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 text-sm">
                  {selectedSchool.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FaMapMarkerAlt />
                  <span>{selectedSchool.location}</span>
                  {selectedSchool.hasMyChild && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-full font-medium">
                      مدرسة طفلي
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <FaSchool className="text-gray-400 text-lg" />
              <span className="text-gray-500">{placeholder}</span>
            </>
          )}
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown className="text-gray-400" />
        </motion.div>
      </motion.button>

      {/* القائمة المنسدلة */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {/* شريط البحث */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث عن المدرسة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            {/* قائمة المدارس */}
            <div className="max-h-80 overflow-y-auto">
              {filteredSchools.length > 0 ? (
                <div className="py-2">
                  {filteredSchools.map((school, index) => (
                    <motion.button
                      key={school.id}
                      onClick={() => handleSchoolSelect(school)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={`
                        w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors duration-200
                        flex items-center gap-3 group border-b border-gray-50 last:border-0
                        ${selectedSchool?.id === school.id ? 'bg-primary-50 border-primary-200' : ''}
                      `}
                    >
                      {/* أيقونة المدرسة */}
                      <div className={`
                        w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold shadow-sm
                        ${school.hasMyChild 
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' 
                          : 'bg-gradient-to-br from-gray-400 to-gray-500 text-white'
                        }
                      `}>
                        {getSchoolTypeIcon(school.type)}
                      </div>

                      {/* معلومات المدرسة */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm truncate group-hover:text-primary-600 transition-colors">
                            {school.name}
                          </h4>
                          {selectedSchool?.id === school.id && (
                            <FaCheck className="text-primary-500 text-sm" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                          <div className="flex items-center gap-1">
                            <FaMapMarkerAlt />
                            <span className="truncate">{school.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaUsers />
                            <span>{school.studentsCount}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                              ${school.type === 'ابتدائية' ? 'bg-blue-100 text-blue-600' :
                                school.type === 'متوسطة' ? 'bg-purple-100 text-purple-600' :
                                'bg-orange-100 text-orange-600'}`}
                            >
                              {school.type}
                            </span>
                            {school.hasMyChild && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                                <FaGraduationCap className="inline ml-1" />
                                مدرسة طفلي
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <FaStar className={`text-sm ${getRatingColor(school.overallRating)}`} />
                            <span className="text-xs font-medium text-gray-600">
                              {school.overallRating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <FaSchool className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">لا توجد مدارس متطابقة</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {searchTerm ? 'جرب البحث بكلمة أخرى' : 'لا توجد مدارس متاحة'}
                  </p>
                </div>
              )}
            </div>

            {/* معلومات إضافية في الأسفل */}
            {filteredSchools.length > 0 && (
              <div className="p-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {filteredSchools.length} مدرسة متاحة
                    {showOnlyMyChildren && " (مدارس أطفالي فقط)"}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaGraduationCap />
                    {filteredSchools.filter(s => s.hasMyChild).length} مدرسة طفلي
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchoolDropdown;
