// =============================================================================
// Comprehensive Evaluation System Component
// نظام التقييمات الشامل مع رسوم بيانية ومعايير متعددة
// =============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStar, 
  FaSchool, 
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaThumbsUp,
  FaThumbsDown,
  FaGraduationCap,
  FaUsers,
  FaCog,
  FaShieldAlt,
  FaComments,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaSpinner,
  FaAward,
  FaPhone
} from 'react-icons/fa';
import { Card, Button, Modal, Badge, Loading } from '../ui';
import { evaluateSchool } from '../../services/parentsApi';

/**
 * نظام التقييم الشامل للمدارس
 * Comprehensive school evaluation system
 * 
 * @param {Object} school - بيانات المدرسة
 * @param {Function} onSubmitSuccess - دالة عند نجاح إرسال التقييم
 * @param {Boolean} isVisible - ظهور المكون
 * @param {Function} onClose - دالة الإغلاق
 */
const EvaluationSystem = ({ school, onSubmitSuccess, isVisible, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const evaluationSteps = [
    {
      id: 'intro',
      title: 'مقدمة التقييم',
      description: 'نرحب بك في نظام تقييم المدارس'
    },
    {
      id: 'categories',
      title: 'معايير التقييم',
      description: 'قيّم المدرسة حسب المعايير التالية'
    },
    {
      id: 'comment',
      title: 'التعليقات',
      description: 'شاركنا تجربتك وملاحظاتك'
    },
    {
      id: 'review',
      title: 'مراجعة التقييم',
      description: 'راجع تقييمك قبل الإرسال'
    }
  ];

  const ratingCategories = [
    {
      key: 'educationQuality',
      label: 'جودة التعليم',
      description: 'مستوى التعليم والمناهج وطرق التدريس',
      icon: FaGraduationCap,
      color: 'bg-blue-500'
    },
    {
      key: 'facilities',
      label: 'المرافق والبنية التحتية',
      description: 'جودة المباني والمختبرات والمرافق',
      icon: FaSchool,
      color: 'bg-green-500'
    },
    {
      key: 'teachers',
      label: 'المعلمون',
      description: 'كفاءة المعلمين وتعاملهم مع الطلاب',
      icon: FaUsers,
      color: 'bg-purple-500'
    },
    {
      key: 'administration',
      label: 'الإدارة المدرسية',
      description: 'تنظيم الإدارة وسرعة الاستجابة',
      icon: FaCog,
      color: 'bg-orange-500'
    },
    {
      key: 'cleanliness',
      label: 'النظافة والصحة',
      description: 'مستوى النظافة والاهتمام بالصحة العامة',
      icon: FaCheck,
      color: 'bg-teal-500'
    },
    {
      key: 'safety',
      label: 'الأمان والحماية',
      description: 'إجراءات الأمان وحماية الطلاب',
      icon: FaShieldAlt,
      color: 'bg-red-500'
    },
    {
      key: 'communication',
      label: 'التواصل مع الأهل',
      description: 'جودة التواصل مع أولياء الأمور',
      icon: FaPhone,
      color: 'bg-indigo-500'
    }
  ];

  const handleRatingChange = (category, rating) => {
    setRatings(prev => ({
      ...prev,
      [category]: rating
    }));
  };

  const getOverallRating = () => {
    const values = Object.values(ratings);
    if (values.length === 0) return 0;
    return (values.reduce((sum, rating) => sum + rating, 0) / values.length).toFixed(1);
  };

  const getRatingText = (rating) => {
    if (rating >= 4.5) return { text: 'ممتاز', color: 'text-purple-600' };
    if (rating >= 3.5) return { text: 'جيد جداً', color: 'text-green-600' };
    if (rating >= 2.5) return { text: 'جيد', color: 'text-blue-600' };
    if (rating >= 1.5) return { text: 'مقبول', color: 'text-yellow-600' };
    return { text: 'ضعيف', color: 'text-red-600' };
  };

  const canProceedToNextStep = () => {
    switch (activeStep) {
      case 1: // Categories step
        return Object.keys(ratings).length === ratingCategories.length;
      case 2: // Comment step
        return comment.trim().length >= 10;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!canProceedToNextStep()) return;

    setIsSubmitting(true);
    try {
      const evaluationData = {
        ratings,
        comment: comment.trim(),
        overallRating: parseFloat(getOverallRating()),
        timestamp: new Date().toISOString()
      };

      const result = await evaluateSchool(school.id, evaluationData);
      setSubmissionResult(result);
      setShowResults(true);
      
      if (onSubmitSuccess) {
        onSubmitSuccess(result);
      }
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      setSubmissionResult({
        success: false,
        message: 'حدث خطأ أثناء إرسال التقييم. يرجى المحاولة مرة أخرى.'
      });
      setShowResults(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetEvaluation = () => {
    setActiveStep(0);
    setRatings({});
    setComment('');
    setShowResults(false);
    setSubmissionResult(null);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {evaluationSteps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
            index === activeStep 
              ? 'bg-primary-500 border-primary-500 text-white'
              : index < activeStep
              ? 'bg-green-500 border-green-500 text-white'
              : 'bg-gray-200 border-gray-300 text-gray-500'
          }`}>
            {index < activeStep ? (
              <FaCheck />
            ) : (
              <span className="font-bold">{index + 1}</span>
            )}
          </div>
          {index < evaluationSteps.length - 1 && (
            <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
              index < activeStep ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderIntroStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
        <FaSchool className="text-3xl text-white" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          تقييم {school?.name}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          رأيك يهمنا! ساعدنا في تحسين جودة التعليم من خلال تقييم صادق وموضوعي 
          للمدرسة. سيتم استخدام تقييمك لمساعدة أولياء الأمور الآخرين في اتخاذ قرارات مدروسة.
        </p>
      </div>

      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <FaInfoCircle className="text-blue-500" />
          معلومات مهمة
        </h3>
        <ul className="text-sm text-gray-700 space-y-2 text-right">
          <li>• التقييم سيكون مجهول الهوية</li>
          <li>• يمكنك تقييم المدرسة مرة واحدة كل 6 أشهر</li>
          <li>• تأكد من صدق وموضوعية تقييمك</li>
          <li>• سيستغرق التقييم حوالي 5 دقائق</li>
        </ul>
      </div>

      <Button 
        variant="primary" 
        size="lg" 
        onClick={() => setActiveStep(1)}
        className="px-8"
      >
        ابدأ التقييم
        <FaChevronRight className="mr-2" />
      </Button>
    </motion.div>
  );

  const renderCategoriesStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">معايير التقييم</h2>
        <p className="text-gray-600">
          قيّم المدرسة من 1 إلى 5 نجوم في كل معيار ({Object.keys(ratings).length}/{ratingCategories.length} مكتمل)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ratingCategories.map((category, index) => (
          <motion.div
            key={category.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                  <category.icon className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{category.label}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    onClick={() => handleRatingChange(category.key, star)}
                    className={`text-3xl transition-all duration-200 ${
                      ratings[category.key] >= star
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-gray-300 hover:text-yellow-400'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaStar />
                  </motion.button>
                ))}
              </div>

              {/* Rating Display */}
              {ratings[category.key] && (
                <div className="text-center">
                  <span className="text-sm font-medium text-gray-600">
                    تقييمك: {ratings[category.key]} من 5
                  </span>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">التقدم</span>
          <span className="text-sm font-medium text-gray-900">
            {Math.round((Object.keys(ratings).length / ratingCategories.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-primary-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(Object.keys(ratings).length / ratingCategories.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={() => setActiveStep(0)}>
          السابق
        </Button>
        <Button 
          variant="primary" 
          onClick={() => setActiveStep(2)}
          disabled={!canProceedToNextStep()}
        >
          التالي
        </Button>
      </div>
    </motion.div>
  );

  const renderCommentStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">شاركنا تجربتك</h2>
        <p className="text-gray-600">
          اكتب تعليقك حول تجربتك مع المدرسة (10 أحرف على الأقل)
        </p>
      </div>

      <Card>
        <div className="space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="اكتب تعليقك هنا... شاركنا ما يعجبك في المدرسة وما يمكن تحسينه"
            className="w-full h-40 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            maxLength={500}
          />
          
          <div className="flex items-center justify-between text-sm">
            <span className={`${comment.length >= 10 ? 'text-green-600' : 'text-gray-400'}`}>
              {comment.length >= 10 ? 'ممتاز!' : 'يجب كتابة 10 أحرف على الأقل'}
            </span>
            <span className="text-gray-500">
              {comment.length}/500 حرف
            </span>
          </div>
        </div>
      </Card>

      {/* Quick Comments */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">اقتراحات سريعة:</h3>
        <div className="flex flex-wrap gap-2">
          {[
            'مدرسة ممتازة بشكل عام',
            'المعلمون متعاونون جداً',
            'المرافق تحتاج تحسين',
            'الإدارة سريعة في الاستجابة',
            'بيئة تعليمية مثالية',
            'التواصل مع الأهل ممتاز'
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setComment(prev => prev ? `${prev}، ${suggestion}` : suggestion)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={() => setActiveStep(1)}>
          السابق
        </Button>
        <Button 
          variant="primary" 
          onClick={() => setActiveStep(3)}
          disabled={!canProceedToNextStep()}
        >
          التالي
        </Button>
      </div>
    </motion.div>
  );

  const renderReviewStep = () => {
    const overallRating = parseFloat(getOverallRating());
    const ratingInfo = getRatingText(overallRating);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">مراجعة التقييم</h2>
          <p className="text-gray-600">تأكد من صحة تقييمك قبل الإرسال</p>
        </div>

        {/* Overall Rating */}
        <Card className="bg-gradient-to-br from-primary-50 to-blue-50">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">{overallRating}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              التقييم الإجمالي
            </h3>
            <p className={`text-lg font-semibold ${ratingInfo.color}`}>
              {ratingInfo.text}
            </p>
          </div>
        </Card>

        {/* Categories Summary */}
        <Card>
          <h3 className="font-bold text-gray-900 mb-4">ملخص التقييمات</h3>
          <div className="space-y-3">
            {ratingCategories.map((category) => {
              const rating = ratings[category.key];
              return (
                <div key={category.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center`}>
                      <category.icon className="text-white text-sm" />
                    </div>
                    <span className="font-medium text-gray-900">{category.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar 
                          key={star}
                          className={`text-sm ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-gray-900 w-8 text-center">{rating}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Comment Summary */}
        <Card>
          <h3 className="font-bold text-gray-900 mb-4">تعليقك</h3>
          <p className="text-gray-700 bg-gray-50 rounded-lg p-4 italic">
            "{comment}"
          </p>
        </Card>

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={() => setActiveStep(2)}>
            السابق
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin ml-2" />
                جاري الإرسال...
              </>
            ) : (
              <>
                إرسال التقييم
                <FaCheck className="mr-2" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    );
  };

  const renderResultsModal = () => (
    <Modal
      isOpen={showResults}
      onClose={() => {
        setShowResults(false);
        if (submissionResult?.success) {
          onClose();
          resetEvaluation();
        }
      }}
      title={submissionResult?.success ? 'تم إرسال التقييم بنجاح!' : 'خطأ في الإرسال'}
      size="md"
    >
      <div className="text-center space-y-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
          submissionResult?.success ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {submissionResult?.success ? (
            <FaCheck className="text-3xl text-green-600" />
          ) : (
            <FaTimes className="text-3xl text-red-600" />
          )}
        </div>

        <div>
          <h3 className={`text-xl font-bold mb-2 ${
            submissionResult?.success ? 'text-green-600' : 'text-red-600'
          }`}>
            {submissionResult?.success ? 'شكراً لك!' : 'حدث خطأ'}
          </h3>
          <p className="text-gray-600">
            {submissionResult?.message || 'حدث خطأ غير متوقع'}
          </p>
        </div>

        {submissionResult?.success && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-bold text-blue-900 mb-2">ما سيحدث بعد ذلك؟</h4>
            <ul className="text-sm text-blue-800 space-y-1 text-right">
              <li>• سيتم مراجعة تقييمك من قبل فريقنا</li>
              <li>• سيظهر التقييم خلال 24-48 ساعة</li>
              <li>• ستحصل على إشعار عند الموافقة عليه</li>
              <li>• يمكنك تعديل تقييمك خلال 7 أيام</li>
            </ul>
          </div>
        )}

        <div className="flex gap-3">
          {submissionResult?.success ? (
            <Button 
              variant="primary" 
              className="flex-1"
              onClick={() => {
                setShowResults(false);
                onClose();
                resetEvaluation();
              }}
            >
              العودة للرئيسية
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowResults(false)}
              >
                المحاولة مرة أخرى
              </Button>
              <Button 
                variant="primary" 
                className="flex-1"
                onClick={() => {
                  setShowResults(false);
                  onClose();
                }}
              >
                إغلاق
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );

  if (!school) {
    return null;
  }

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
              <div className="bg-gradient-to-r from-primary-500 to-blue-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">نظام التقييم</h1>
                    <p className="text-primary-100">
                      {evaluationSteps[activeStep]?.description}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {renderStepIndicator()}
                
                <div className="max-h-96 overflow-y-auto">
                  {activeStep === 0 && renderIntroStep()}
                  {activeStep === 1 && renderCategoriesStep()}
                  {activeStep === 2 && renderCommentStep()}
                  {activeStep === 3 && renderReviewStep()}
                </div>
              </div>
            </motion.div>
          </div>

          {renderResultsModal()}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EvaluationSystem;
