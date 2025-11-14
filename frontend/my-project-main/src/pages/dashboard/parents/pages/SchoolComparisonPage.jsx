import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaSort, FaEye } from 'react-icons/fa';
import { useSchools, useParentProfile } from '../hooks/useData';

const SchoolComparisonPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile: parentProfile } = useParentProfile();
  const { schools } = useSchools();
  
  // Get the selected school from location state or default to first child's school
  const selectedSchool = location.state?.school || 
    (parentProfile?.children?.length > 0 
      ? schools.find(s => s.id === parentProfile.children[0].school.id)
      : null);

  // Get schools in the same directorate as the selected school
  // If directorateSchools are passed in state, use them; otherwise, get all schools in the same directorate
  const directorateSchools = useMemo(() => {
    if (location.state?.directorateSchools) {
      return location.state.directorateSchools;
    }
    
    if (!selectedSchool) return [];
    return schools.filter(school => 
      school.location === selectedSchool.location && 
      school.id !== selectedSchool.id
    );
  }, [schools, selectedSchool, location.state]);

  // Combine selected school with other schools in the same directorate
  const comparisonSchools = useMemo(() => {
    if (!selectedSchool) return directorateSchools;
    return [selectedSchool, ...directorateSchools];
  }, [selectedSchool, directorateSchools]);

  // State for sorting and column visibility
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    overallRating: true,
    teachers: true,
    cleanliness: true,
    activities: true,
    notes: true
  });

  // Toggle column visibility
  const toggleColumn = (column) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort schools based on sort config
  const sortedSchools = useMemo(() => {
    if (!sortConfig.key) return comparisonSchools;
    
    return [...comparisonSchools].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      // For ratings, we need to access nested properties
      if (sortConfig.key === 'teachers') aValue = a.ratings?.teachers;
      if (sortConfig.key === 'cleanliness') aValue = a.ratings?.cleanliness;
      if (sortConfig.key === 'activities') aValue = a.ratings?.activities || 0;
      
      if (sortConfig.key === 'teachers') bValue = b.ratings?.teachers;
      if (sortConfig.key === 'cleanliness') bValue = b.ratings?.cleanliness;
      if (sortConfig.key === 'activities') bValue = b.ratings?.activities || 0;
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [comparisonSchools, sortConfig]);

  // Generate insight text based on comparison
  const comparisonInsight = useMemo(() => {
    if (!selectedSchool || sortedSchools.length < 2) return '';
    
    const selectedSchoolIndex = sortedSchools.findIndex(s => s.id === selectedSchool.id);
    if (selectedSchoolIndex === -1) return '';
    
    const avgCleanliness = sortedSchools.reduce((sum, school) => 
      sum + (school.ratings?.cleanliness || 0), 0) / sortedSchools.length;
    
    const avgActivities = sortedSchools.reduce((sum, school) => 
      sum + (school.ratings?.activities || 0), 0) / sortedSchools.length;
    
    const selectedCleanliness = selectedSchool.ratings?.cleanliness || 0;
    const selectedActivities = selectedSchool.ratings?.activities || 0;
    
    let insight = `مدرستك `;
    
    if (selectedCleanliness > avgCleanliness) {
      insight += 'أعلى من المتوسط في النظافة';
    } else if (selectedCleanliness < avgCleanliness) {
      insight += 'أقل من المتوسط في النظافة';
    } else {
      insight += 'في المتوسط في النظافة';
    }
    
    insight += '، لكنها ';
    
    if (selectedActivities > avgActivities) {
      insight += 'أعلى في الأنشطة مقارنةً مع المدارس الأخرى في نفس المديرية.';
    } else if (selectedActivities < avgActivities) {
      insight += 'أقل في الأنشطة مقارنةً مع المدارس الأخرى في نفس المديرية.';
    } else {
      insight += 'في المتوسط في الأنشطة مقارنةً مع المدارس الأخرى في نفس المديرية.';
    }
    
    return insight;
  }, [sortedSchools, selectedSchool]);

  // Render sort indicator
  const SortIndicator = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  if (!selectedSchool) {
    return (
      <div className="container mx-auto p-4" dir="rtl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">لم يتم العثور على مدرسة لل сравн</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            يرجى العودة إلى صفحة المدارس واختيار مدرسة للمقارنة
          </p>
          <button
            onClick={() => navigate('/dashboard/parents/schools')}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
          >
            <FaArrowLeft />
            العودة إلى المدارس
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4" dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => navigate('/dashboard/parents/schools')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 mb-2"
            >
              <FaArrowLeft />
              العودة إلى المدارس
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              مقارنة المدارس
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              مقارنة {selectedSchool.name} مع المدارس الأخرى في {selectedSchool.location}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              إجمالي {comparisonSchools.length} مدرسة للمقارنة
            </p>
          </div>
        </div>
      </motion.div>

      {/* Column Visibility Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow p-4"
      >
        <h3 className="font-bold text-gray-900 dark:text-white mb-3">عرض الأعمدة:</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(visibleColumns).map(([key, isVisible]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={() => toggleColumn(key)}
                className="rounded text-primary-500"
              />
              <span className="text-gray-700 dark:text-gray-300">
                {key === 'name' && 'المدرسة'}
                {key === 'overallRating' && 'التقييم العام'}
                {key === 'teachers' && 'الكادر التعليمي'}
                {key === 'cleanliness' && 'النظافة'}
                {key === 'activities' && 'الأنشطة'}
                {key === 'notes' && 'ملاحظات بارزة'}
              </span>
            </label>
          ))}
        </div>
      </motion.div>

      {/* Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {visibleColumns.name && (
                  <th 
                    className="text-right p-4 font-bold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center justify-between">
                      <span>المدرسة</span>
                      <FaSort className="mr-2" />
                      <SortIndicator columnKey="name" />
                    </div>
                  </th>
                )}
                {visibleColumns.overallRating && (
                  <th 
                    className="text-right p-4 font-bold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort('overallRating')}
                  >
                    <div className="flex items-center justify-between">
                      <span>التقييم العام</span>
                      <FaSort className="mr-2" />
                      <SortIndicator columnKey="overallRating" />
                    </div>
                  </th>
                )}
                {visibleColumns.teachers && (
                  <th 
                    className="text-right p-4 font-bold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort('teachers')}
                  >
                    <div className="flex items-center justify-between">
                      <span>الكادر التعليمي</span>
                      <FaSort className="mr-2" />
                      <SortIndicator columnKey="teachers" />
                    </div>
                  </th>
                )}
                {visibleColumns.cleanliness && (
                  <th 
                    className="text-right p-4 font-bold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort('cleanliness')}
                  >
                    <div className="flex items-center justify-between">
                      <span>النظافة</span>
                      <FaSort className="mr-2" />
                      <SortIndicator columnKey="cleanliness" />
                    </div>
                  </th>
                )}
                {visibleColumns.activities && (
                  <th 
                    className="text-right p-4 font-bold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort('activities')}
                  >
                    <div className="flex items-center justify-between">
                      <span>الأنشطة</span>
                      <FaSort className="mr-2" />
                      <SortIndicator columnKey="activities" />
                    </div>
                  </th>
                )}
                <th className="text-right p-4 font-bold text-gray-900 dark:text-white">
                  المديرية
                </th>
                {visibleColumns.notes && (
                  <th className="text-right p-4 font-bold text-gray-900 dark:text-white">
                    ملاحظات بارزة
                  </th>
                )}
                <th className="text-right p-4 font-bold text-gray-900 dark:text-white">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedSchools.map((school, index) => {
                const isParentSchool = school.id === selectedSchool.id;
                return (
                  <motion.tr
                    key={school.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      border-b border-gray-100 dark:border-gray-700
                      ${isParentSchool ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
                    `}
                  >
                    {visibleColumns.name && (
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={school.image} 
                            alt={school.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {school.name}
                              {isParentSchool && (
                                <span className="mr-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                  ⭐ مدرستي
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {school.type}
                            </div>
                          </div>
                        </div>
                      </td>
                    )}
                    {visibleColumns.overallRating && (
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 dark:text-white">
                            {school.overallRating} / 5
                          </span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full" 
                              style={{ width: `${(school.overallRating / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    )}
                    {visibleColumns.teachers && (
                      <td className="p-4">
                        <span className="font-medium">
                          {school.ratings?.teachers?.toFixed(1) || 'N/A'}
                        </span>
                      </td>
                    )}
                    {visibleColumns.cleanliness && (
                      <td className="p-4">
                        <span className="font-medium">
                          {school.ratings?.cleanliness?.toFixed(1) || 'N/A'}
                        </span>
                      </td>
                    )}
                    {visibleColumns.activities && (
                      <td className="p-4">
                        <span className="font-medium">
                          {school.ratings?.activities?.toFixed(1) || 'N/A'}
                        </span>
                      </td>
                    )}
                    <td className="p-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {school.location}
                      </div>
                    </td>
                    {visibleColumns.notes && (
                      <td className="p-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {isParentSchool ? (
                            <span>مدرسة طفلي</span>
                          ) : school.ratings?.teachers > 4.5 ? (
                            <span>قوية بالكادر</span>
                          ) : school.ratings?.cleanliness > 4.5 ? (
                            <span>أعلى في النظافة</span>
                          ) : (
                            <span>متوسطة الأداء</span>
                          )}
                        </div>
                      </td>
                    )}
                    <td className="p-4">
                      <button
                        onClick={() => navigate('/dashboard/parents/schools', { state: { school } })}
                        className="flex items-center gap-2 text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        <FaEye />
                        عرض التفاصيل
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Comparison Insight */}
      {comparisonInsight && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">تحليل المقارنة:</h3>
          <p className="text-gray-700 dark:text-gray-300">{comparisonInsight}</p>
        </motion.div>
      )}
    </div>
  );
};

export default SchoolComparisonPage;