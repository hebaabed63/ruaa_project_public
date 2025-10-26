// =============================================================================
// Enhanced Schools Management Page for Parents
// صفحة إدارة المدارس المتطورة لأولياء الأمور
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

import { Card, Button, Badge, Input, Loading } from '../components/ui';
import { useSchools, useParentProfile } from '../hooks/useData';

/**
 * مكون بطاقة المدرسة المتطورة
 * Enhanced School Card Component
 */
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

  // Extract directorate from location (assuming format "تابعة لمديرية [اسم المديرية]")
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
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-blue-500/5" />
        
        {/* My Child Badge */}
        {school.hasMyChild && (
          <div className="absolute top-4 right-4 z-10">
            <Badge variant="success" size="sm">
              مدرسة أبنائي
            </Badge>
          </div>
        )}

        <div className="relative z-10">
          {/* School Image */}
          <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
            <img 
              src={school.image} 
              alt={school.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Rating Overlay */}
            <div className="absolute bottom-4 right-4">
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full backdrop-blur bg-white/90 ${getRatingColor(school.overallRating).split(' ')[0]}`}>
                <FaStar />
                <span className="font-bold">{school.overallRating}</span>
              </div>
            </div>
          </div>

          {/* School Info */}
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                {school.name}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="primary" size="sm">{school.type}</Badge>
                <span className="text-sm text-gray-500">{getRatingText(school.overallRating)}</span>
              </div>
            </div>

            {/* Directorate Info */}
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <FaMapMarkerAlt className="flex-shrink-0" />
              <span>تابعة لمديرية {getDirectorate(school.location)}</span>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
              {school.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100 dark:border-gray-600">
              <div className="text-center">
                <p className="text-lg font-bold text-primary-600">{school.studentsCount}</p>
                <p className="text-xs text-gray-500">أبناء</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-primary-600">{school.teachersCount}</p>
                <p className="text-xs text-gray-500">معلم</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => onViewDetails(school)}
              >
                <FaEye className="ml-1" />
                عرض التفاصيل
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onEvaluateSchool(school)}
              >
                تقييم المدرسة
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => onCompare(school)}
              >
                <FaChartLine className="ml-1" />
                مقارنة
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

/**
 * الصفحة الرئيسية لإدارة مدارس أبناء
 * Main Schools Management Page for Children
 */
const SchoolsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { mySchools: schools, loading } = useSchools({ myChildren: true });
  const { profile: parentProfile } = useParentProfile();

  // Filter schools based on search term
  const filteredSchools = schools.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle view details
  const handleViewDetails = (school) => {
    // Navigate to school profile page
    navigate(`/dashboard/parents/schools/${school.id}`);
  };

  // Handle evaluate school
  const handleEvaluateSchool = (school) => {
    // Navigate to evaluation page for that school
    navigate(`/dashboard/parents/evaluations?schoolId=${school.id}`);
  };

  // Handle compare schools in the same directorate
  const handleCompare = (school) => {
    // Navigate to comparison page with all schools in the same directorate
    navigate('/dashboard/parents/schools/comparison', { 
      state: { 
        school: school
      } 
    });
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              مدارس أبنائي
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              إدارة وعرض مدارس الأطفال المسجلين فيها
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="البحث في مدارس أبنائي..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<FaSearch />}
            />
          </div>
        </div>
      </motion.div>

      {/* Results Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <p className="text-gray-600 dark:text-gray-400">
            تم العثور على <span className="font-bold text-primary-600">{filteredSchools.length}</span> مدرسة
          </p>
        </div>
      </motion.div>

      {/* Schools Grid */}
      {loading ? (
        <div className="text-center py-12">
          <Loading size="lg" text="جاري تحميل المدارس..." />
        </div>
      ) : filteredSchools.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
            لم يتم العثور على مدارس لأبنائك
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default SchoolsPage;