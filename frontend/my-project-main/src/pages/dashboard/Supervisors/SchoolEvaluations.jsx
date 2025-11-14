import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaChevronDown, 
  FaGraduationCap,
  FaStar,
  FaMapMarkerAlt
} from 'react-icons/fa';
import SchoolProfile from './components/SchoolProfile';

const SchoolEvaluations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // بيانات وهمية للمدارس (ستأتي من API لاحقاً)
  const schools = [
    {
      id: 1,
      name: 'مدرسة النور الابتدائية',
      location: 'حي الزهراء، الرياض',
      overallRating: 4.2,
      studentsCount: 450,
      teachersCount: 25,
      image: 'https://via.placeholder.com/400x200/4f46e5/ffffff?text=مدرسة+النور',
      description: 'مدرسة متميزة تهتم بالتعليم الحديث والأنشطة اللامنهجية',
      achievements: ['جائزة أفضل مدرسة 2023', 'المركز الأول في مسابقة العلوم'],
      vision: 'تقديم تعليم متميز وشامل لبناء جيل مبدع ومتطور',
      mission: 'نسعى لتوفير بيئة تعليمية محفزة ومبتكرة'
    },
    {
      id: 2,
      name: 'مدرسة الفجر المتوسطة',
      location: 'حي النخيل، جدة',
      overallRating: 3.8,
      studentsCount: 320,
      teachersCount: 18,
      image: 'https://via.placeholder.com/400x200/059669/ffffff?text=مدرسة+الفجر',
      description: 'مدرسة تركز على التطوير الشخصي والأكاديمي للطلاب',
      achievements: ['شهادة الجودة التعليمية', 'المركز الثاني في الرياضيات'],
      vision: 'إعداد جيل قادر على مواجهة تحديات المستقبل',
      mission: 'تطوير مهارات الطلاب الأكاديمية والاجتماعية'
    },
    {
      id: 3,
      name: 'مدرسة الأمل الثانوية',
      location: 'حي الملز، الرياض',
      overallRating: 4.6,
      studentsCount: 280,
      teachersCount: 22,
      image: 'https://via.placeholder.com/400x200/dc2626/ffffff?text=مدرسة+الأمل',
      description: 'مدرسة ثانوية متقدمة بمناهج حديثة ومرافق متطورة',
      achievements: ['أفضل نتائج الثانوية العامة', 'مدرسة صديقة للبيئة'],
      vision: 'تخريج طلاب قادرين على الإبداع والتميز في الحياة الجامعية',
      mission: 'تقديم تعليم ثانوي عالي الجودة مع التركيز على الإعداد الجامعي'
    }
  ];

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#8b5cf6'; // بنفسجي - ممتاز
    if (rating >= 3.5) return '#10b981'; // أخضر - جيد
    if (rating >= 3.0) return '#f59e0b'; // أصفر - متوسط
    if (rating >= 2.0) return '#f97316'; // برتقالي - متوسط ضعيف
    return '#ef4444'; // أحمر - ضعيف
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      setTimeout(() => {
        setShowDropdown(true);
        setIsSearching(false);
      }, 800);
    }
  };

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school);
    setShowDropdown(false);
  };

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedSchool) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <SchoolProfile school={selectedSchool} onBack={() => setSelectedSchool(null)} />
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 rtl p-4 md:p-8">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h1 className="flex items-center justify-center gap-3 text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            <FaGraduationCap className="text-primary-500" />
            تقييم المدارس
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            ابحث عن مدرسة أطفالك واطلع على تقييمها الشامل والتفصيلي
          </p>
        </div>
      </motion.div>

      <motion.div 
        className="max-w-4xl mx-auto mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="ابحث عن اسم المدرسة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300 font-arabic"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <motion.button
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 min-w-[120px] ${
                isSearching 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl'
              }`}
              onClick={handleSearch}
              disabled={isSearching}
              whileHover={!isSearching ? { scale: 1.05 } : {}}
              whileTap={!isSearching ? { scale: 0.95 } : {}}
            >
              {isSearching ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <FaSearch />
                  بحث
                </>
              )}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              className="mt-6 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 text-white">
                <div className="flex items-center gap-2">
                  <FaChevronDown className="text-lg" />
                  <span className="font-bold text-lg">المدارس المتاحة ({filteredSchools.length})</span>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {filteredSchools.map((school, index) => (
                  <motion.div
                    key={school.id}
                    className="relative flex items-center p-6 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-all duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => handleSchoolSelect(school)}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div 
                      className="w-4 h-12 rounded-r-lg ml-4 flex-shrink-0"
                      style={{ backgroundColor: getRatingColor(school.overallRating) }}
                    ></div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-800 truncate">{school.name}</h3>
                        <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                          <FaStar className="text-yellow-500 text-sm" />
                          <span className="font-bold text-sm text-gray-700">{school.overallRating}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaMapMarkerAlt className="text-sm flex-shrink-0" />
                          <span className="text-sm truncate">{school.location}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {school.studentsCount} طالب • {school.teachersCount} معلم
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SchoolEvaluations;
