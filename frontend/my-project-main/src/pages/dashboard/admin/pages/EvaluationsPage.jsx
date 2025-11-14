// =============================================================================
// Advanced School Evaluations Page for Admin
// صفحة التقييمات المتطورة للمدارس  Admin
// =============================================================================

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStar,
  FaChartPie,
  FaChartLine,
  FaSchool,
  FaSave,
  FaEye,
  FaHistory,
  FaAward,
  FaComments,
  FaDownload,
  FaShare,
  FaTrophy,
  FaUsers,
  FaGraduationCap
} from 'react-icons/fa';

import { Card, Button, Badge, ProgressBar, Modal, Alert } from '../components/ui';
import { useSchools, useEvaluations } from '../hooks/useData';

/**
 * معايير التقييم
 * Evaluation Criteria Configuration
 */
const evaluationCriteria = [
  {
    key: 'educationQuality',
    label: 'جودة التعليم',
    description: 'كفاءة المعلمين، طرق التدريس، متابعة الطلاب أكاديمياً',
    icon: FaGraduationCap,
    color: 'from-blue-500 to-blue-600',
    subCriteria: [
      'مستوى المعلمين وخبرتهم',
      'طرق التدريس المستخدمة',
      'متابعة الأداء الأكاديمي',
      'جودة المناهج والمواد التعليمية'
    ]
  },
  {
    key: 'facilities',
    label: 'المرافق والخدمات',
    description: 'نظافة المدرسة، الصفوف والمختبرات، الملاعب والمكتبة',
    icon: FaSchool,
    color: 'from-green-500 to-green-600',
    subCriteria: [
      'نظافة وصيانة المباني',
      'جودة الصفوف الدراسية',
      'توفر المختبرات والمعامل',
      'المرافق الرياضية والترفيهية'
    ]
  },
  {
    key: 'environment',
    label: 'البيئة المدرسية',
    description: 'الانضباط والنظام، بيئة آمنة ومحفزة، تعامل الإدارة',
    icon: FaUsers,
    color: 'from-purple-500 to-purple-600',
    subCriteria: [
      'الأمان داخل المدرسة',
      'انضباط الطلاب والنظام',
      'التعامل مع المشاكل',
      'بيئة محفزة للتعلم'
    ]
  },
  {
    key: 'mentalHealth',
    label: 'الصحة النفسية والدعم',
    description: 'مرشد نفسي/اجتماعي، دعم للطلاب ذوي المشاكل',
    icon: FaComments,
    color: 'from-pink-500 to-pink-600',
    subCriteria: [
      'توفر المرشد النفسي',
      'برامج الدعم النفسي',
      'التعامل مع الطلاب المتعثرين',
      'برامج تطوير المهارات'
    ]
  },
  {
    key: 'communication',
    label: 'التواصل مع الأهالي',
    description: 'سرعة تجاوب الإدارة، قنوات تواصل واضحة',
    icon: FaComments,
    color: 'from-orange-500 to-orange-600',
    subCriteria: [
      'سرعة الرد على الاستفسارات',
      'وضوح قنوات التواصل',
      'التقارير الدورية',
      'الاجتماعات مع الأهالي'
    ]
  },
  {
    key: 'sustainability',
    label: 'الاستدامة والمسؤولية',
    description: 'المحافظة على البيئة، ترشيد استهلاك الموارد',
    icon: FaTrophy,
    color: 'from-yellow-500 to-yellow-600',
    subCriteria: [
      'برامج المحافظة على البيئة',
      'ترشيد استخدام الموارد',
      'برامج التوعية البيئية',
      'المشاريع المجتمعية'
    ]
  }
];

/**
 * مكون سلايدر التقييم التفاعلي
 * Interactive Rating Slider Component
 */
const RatingSlider = ({ criterion, value, onChange, showDetails = false }) => {
  const [hoveredValue, setHoveredValue] = useState(null);
  const IconComponent = criterion.icon;

  const getRatingText = (rating) => {
    if (rating >= 4.5) return { text: 'ممتاز', color: 'text-purple-600' };
    if (rating >= 3.5) return { text: 'جيد', color: 'text-green-600' };
    if (rating >= 3.0) return { text: 'متوسط', color: 'text-yellow-600' };
    if (rating >= 2.0) return { text: 'ضعيف', color: 'text-orange-600' };
    return { text: 'ضعيف جداً', color: 'text-red-600' };
  };

  const currentRating = hoveredValue !== null ? hoveredValue : value;
  const ratingInfo = getRatingText(currentRating);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-r ${criterion.color} opacity-5`} />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${criterion.color} text-white shadow-lg`}>
              <IconComponent className="text-xl" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {criterion.label}
                </h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentRating.toFixed(1)}
                  </div>
                  <div className={`text-sm font-medium ${ratingInfo.color}`}>
                    {ratingInfo.text}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {criterion.description}
              </p>
            </div>
          </div>

          {/* Rating Slider */}
          <div className="space-y-4">
            <div className="relative">
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                onMouseMove={(e) => {
                  const rect = e.target.getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  const newValue = 1 + (4 * percent);
                  setHoveredValue(Math.min(5, Math.max(1, newValue)));
                }}
                onMouseLeave={() => setHoveredValue(null)}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #f97316 25%, #f59e0b 50%, #10b981 75%, #8b5cf6 100%)`
                }}
              />
              
              {/* Rating Labels */}
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>1.0</span>
                <span>2.0</span>
                <span>3.0</span>
                <span>4.0</span>
                <span>5.0</span>
              </div>
            </div>

            {/* Stars Display */}
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`text-2xl transition-colors duration-200 ${
                    star <= Math.round(currentRating)
                      ? 'text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <ProgressBar
              value={currentRating}
              max={5}
              color={currentRating >= 4.5 ? 'success' : currentRating >= 3.5 ? 'primary' : currentRating >= 3.0 ? 'warning' : 'danger'}
              showPercentage={false}
              animated
            />

            {/* Sub-criteria (if details shown) */}
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">عوامل التقييم:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                  {criterion.subCriteria.map((sub, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                      {sub}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

/**
 * مكون عرض النتيجة الإجمالية
 * Overall Rating Display Component
 */
const OverallRatingCard = ({ ratings, onSave, isSaving }) => {
  const overallRating = useMemo(() => {
    const values = Object.values(ratings);
    const sum = values.reduce((acc, val) => acc + val, 0);
    return values.length > 0 ? sum / values.length : 0;
  }, [ratings]);

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return { bg: 'from-purple-500 to-purple-600', text: 'ممتاز' };
    if (rating >= 3.5) return { bg: 'from-green-500 to-green-600', text: 'جيد' };
    if (rating >= 3.0) return { bg: 'from-yellow-500 to-yellow-600', text: 'متوسط' };
    if (rating >= 2.0) return { bg: 'from-orange-500 to-orange-600', text: 'ضعيف' };
    return { bg: 'from-red-500 to-red-600', text: 'ضعيف جداً' };
  };

  const ratingInfo = getRatingColor(overallRating);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="sticky top-24 z-10"
    >
      <Card className={`relative overflow-hidden bg-gradient-to-r ${ratingInfo.bg} text-white border-0`}>
        <div className="text-center">
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 mb-4"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-3xl font-bold">
              {overallRating.toFixed(1)}
            </span>
          </motion.div>
          
          <h2 className="text-2xl font-bold mb-2">التقييم الإجمالي</h2>
          <p className="text-lg opacity-90 mb-4">{ratingInfo.text}</p>
          
          {/* Stars */}
          <div className="flex items-center justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`text-2xl ${
                  star <= Math.round(overallRating)
                    ? 'text-yellow-300'
                    : 'text-white/30'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={onSave}
              loading={isSaving}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30"
              icon={<FaSave />}
            >
              حفظ التقييم
            </Button>
            
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              icon={<FaShare />}
            >
              مشاركة
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

/**
 * مكون الرسوم البيانية للتحليلات
 * Analytics Charts Component
 */
const AnalyticsCharts = ({ ratings, schoolName }) => {
  const chartData = evaluationCriteria.map(criterion => ({
    name: criterion.label,
    value: ratings[criterion.key] || 0,
    color: criterion.color
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <FaChartPie className="text-2xl text-primary-500" />
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              تحليل التقييمات
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              نظرة مفصلة على تقييم {schoolName}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {chartData.map((item, index) => (
            <motion.div
              key={item.name}
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {item.value.toFixed(1)}
                  </span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`text-xs ${
                          star <= Math.round(item.value)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / 5) * 100}%` }}
                  transition={{ duration: 1, delay: 0.2 * index }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {chartData.filter(item => item.value >= 4).length}
              </p>
              <p className="text-xs text-gray-500">معايير ممتازة</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {chartData.filter(item => item.value >= 3 && item.value < 4).length}
              </p>
              <p className="text-xs text-gray-500">معايير جيدة</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {chartData.filter(item => item.value < 3).length}
              </p>
              <p className="text-xs text-gray-500">تحتاج تحسين</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

/**
 * الصفحة الرئيسية لتقييم المدارس
 * Main School Evaluation Page
 */
const EvaluationsPage = () => {
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [ratings, setRatings] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [successMessage, setSuccessMessage] = '';

  const { mySchools, loading: schoolsLoading } = useSchools({ myChildren: true });
  const { submitEvaluation, loading: submitting } = useEvaluations();

  // Initialize ratings when school is selected
  React.useEffect(() => {
    if (selectedSchool) {
      const initialRatings = {};
      evaluationCriteria.forEach(criterion => {
        initialRatings[criterion.key] = selectedSchool.detailedRatings?.[criterion.key] || 3.0;
      });
      setRatings(initialRatings);
    }
  }, [selectedSchool]);

  // Handle rating change
  const handleRatingChange = (criterionKey, value) => {
    setRatings(prev => ({
      ...prev,
      [criterionKey]: value
    }));
  };

  // Handle save evaluation
  const handleSaveEvaluation = async () => {
    if (!selectedSchool) return;

    try {
      const result = await submitEvaluation(selectedSchool.id, ratings);
      setSuccessMessage('تم حفظ تقييمك بنجاح! شكراً لك على مساهمتك في تطوير التعليم.');
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error saving evaluation:', error);
    }
  };

  if (schoolsLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p>جاري تحميل مدارس أطفالك...</p>
      </div>
    );
  }

  if (!selectedSchool) {
    return (
      <>
        {/* School Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <FaAward className="text-6xl text-primary-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              ساهم في تطوير التعليم
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              تقييمك يساعد أولياء الأمور الآخرين في اتخاذ قرارات مدروسة ويساعد المدارس على التحسن
            </p>
          </div>

          {mySchools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mySchools.map((school, index) => (
                <motion.div
                  key={school.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-blue-500/5"
                      onClick={() => setSelectedSchool(school)}
                    />
                    
                    <div className="relative z-10" onClick={() => setSelectedSchool(school)}>
                      <div className="flex items-center gap-4 mb-4">
                        <img 
                          src={school.image} 
                          alt={school.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {school.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="success" size="sm">{school.type}</Badge>
                            <div className="flex items-center gap-1">
                              <FaStar className="text-yellow-500 text-sm" />
                              <span className="text-sm font-medium">{school.overallRating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {school.description}
                      </p>

                      <Button 
                        variant="primary" 
                        className="w-full group-hover:bg-primary-600 transition-colors"
                        icon={<FaStar />}
                      >
                        بدء التقييم
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <FaSchool className="text-4xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                لا توجد مدارس مسجلة
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                يجب أن تكون لديك مدارس مسجلة لأطفالك لتتمكن من تقييمها
              </p>
              <Button variant="primary">
                إضافة مدرسة
              </Button>
            </Card>
          )}
        </motion.div>
      </>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    تقييم المدرسة
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    قدم تقييمك الشامل لمدرسة طفلك لمساعدتنا في تحسين جودة التعليم
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <select
                    value={selectedSchool.id}
                    onChange={(e) => setSelectedSchool(mySchools.find(s => s.id === e.target.value))}
                    className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {mySchools.map(school => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowSchoolModal(true)}
                  >
                    <FaHistory className="ml-2" />
                    التاريخ
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Rating Sliders */}
          <div className="space-y-6">
            {evaluationCriteria.map((criterion, index) => (
              <motion.div
                key={criterion.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <RatingSlider
                  criterion={criterion}
                  value={ratings[criterion.key] || 3.0}
                  onChange={(value) => handleRatingChange(criterion.key, value)}
                  showDetails={showDetails}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Overall Rating Card */}
          <OverallRatingCard
            ratings={ratings}
            onSave={handleSaveEvaluation}
            isSaving={submitting}
          />

          {/* Analytics Charts */}
          <AnalyticsCharts
            ratings={ratings}
            schoolName={selectedSchool.name}
          />
        </div>
      </div>
    </div>
  );
};

export default EvaluationsPage;
