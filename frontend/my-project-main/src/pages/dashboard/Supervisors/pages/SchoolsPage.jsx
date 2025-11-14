// =============================================================================
// Enhanced Schools Management Page for Supervisors
// صفحة إدارة المدارس المتطورة  Supervisors
// =============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaSchool,
  FaStar,
  FaMapMarkerAlt,
  FaUsers,
  FaGraduationCap,
  FaEye,
  FaChartLine,
  FaSearch
} from 'react-icons/fa';
import school1 from "../../../../assets/images/School 1.jpg";

import { Card, Button, Badge, Input, Loading } from '../components/ui';
import { useSchools, useParentProfile } from '../hooks/useData';

const SchoolCard = ({ school, index, onViewDetails, onEvaluateSchool, onCompare }) => {
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-purple-500 bg-purple-100';
    if (rating >= 3.5) return 'text-green-500 bg-green-100';
    if (rating >= 3.0) return 'text-yellow-500 bg-yellow-100';
    return 'text-red-500 bg-red-100';
  };

  const getRatingText = (rating) => {
    if (rating >= 4.5) return 'ممتاز';
    if (rating >= 3.5) return 'جيد';
    if (rating >= 3.0) return 'متوسط';
    return 'ضعيف';
  };

  const getDirectorate = (location) => {
    if (location.includes('مديرية')) {
      return location.split('مديرية')[1].trim();
    }
    return location;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 w-80 h-fit bg-white dark:bg-gray-800 rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-blue-500/5" />

        <div className="relative z-10">
          <div className="relative h-48 mb-4 overflow-hidden rounded-t-xl">
            <img 
src={school1}
              alt={school.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            <div className="absolute top-4 left-4">
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full backdrop-blur bg-white/90 ${getRatingColor(school.overallRating).split(' ')[0]}`}>
                <FaStar />
                <span className="font-bold">{school.overallRating}</span>
              </div>
            </div>
          </div>

          {/* معلومات المدرسة */}
          <div className="space-y-3 px-4 pb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white text-right line-clamp-1">
              {school.name}
            </h3>

<div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
  {/* الطلاب */}
  <div className="flex items-center gap-1 " dir="ltr">
      <span>طالب</span>

<span>{school.studentsCount}</span>
          <FaGraduationCap className="text-gray-500 dark:text-gray-400" />

  </div>

  {/* المعلمون */}
  <div className="flex items-center gap-1" dir="ltr">
      <span>معلم</span>

    <span>{school.teachersCount}</span>
        <FaUsers className="text-gray-500 dark:text-gray-400" />

  </div>

  {/* نوع المدرسة */}
  <div className="flex items-center gap-1" dir="ltr">
    <Badge variant="primary" size="sm">{school.type}</Badge>
        <FaSchool className="text-gray-500 dark:text-gray-400" />

  </div>
</div>


            {/* وصف المدرسة */}
            <p className="text-sm text-gray-500 dark:text-gray-400 text-right mt-2">
              {school.description || 'مدرسة النجاح الابتدائيَّة هي إحدى المدارس الرائدة في منطقة البريج، تتميّز بالتعليم الحديث والبيئة التعليميَّة المحفزة. نسعى لتقديم تعليم متميّز يهدف لإعداد جيل واعٍ ومبدِع.'}
            </p>

            {/* الأزرار */}
            <div className="flex flex-col gap-2 mt-3">
              <Button 
                variant="primary" 
                className="w-full bg-primary dark:bg-gray-600"
                onClick={() => onViewDetails(school)}
              >
                عرض التفاصيل
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full bg-white border-primary text-primary dark:bg-gray-600 dark:border-gray-600"
                onClick={() => onEvaluateSchool(school)}
              >
                تقييم المدرسة
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

/**
 * الصفحة الرئيسية لإدارة مدارس المشرف
 */
const SchoolsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { mySchools: schools, loading } = useSchools({ myChildren: true });
  const { profile: parentProfile } = useParentProfile();

  const filteredSchools = schools.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (school) => {
    navigate(`/dashboard/Supervisors/schools/${school.id}`);
  };

  const handleEvaluateSchool = (school) => {
    navigate(`/dashboard/Supervisors/evaluations?schoolId=${school.id}`);
  };

  const handleCompare = (school) => {
    navigate('/dashboard/Supervisors/schools/comparison', { state: { school } });
  };

  return (
    <div className="container mx-auto p-4 bg-white dark:bg-gray-900 transition-colors duration-300" dir="rtl">
      {/* Header */}
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="mb-8"
>
  {/* Header */}
  <div className="w-full text-right mb-6">
    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
      المدارس
    </h1>
    <p className="text-gray-600 dark:text-gray-400 mt-2">
      المدارس التي تُشرِف عليها
    </p>
  </div>

  {/* Search Input */}
  <div className="flex justify-end mb-4">
    <div className="relative w-full">
      <Input
        placeholder="...بحث سريع"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full text-right pr-10 bg-[#F3F3F5] text-[#717182] rounded-md placeholder:text-gray-400"
      />
      <FaSearch className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500" />
    </div>
  </div>
</motion.div>


      {/* Schools Grid */}
      {loading ? (
        <div className="text-center py-12">
          <Loading size="lg" text="جاري تحميل المدارس..." />
        </div>
      ) : filteredSchools.length > 0 ? (
        <div className="flex flex-col items-end">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {filteredSchools.map((school, index) => (
              <SchoolCard
                key={school.id}
                school={school}
                index={index}
                onViewDetails={handleViewDetails}
                onEvaluateSchool={handleEvaluateSchool}
                onCompare={handleCompare}
              />
            ))}
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <FaSchool className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            لا توجد مدارس
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            لم يتم العثور على مدارس
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default SchoolsPage;