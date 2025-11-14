import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaSchool, FaSave, FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { Card, Button, Input, Loading } from '../components/ui';
import { useSchools } from '../hooks/useData';

const CreateReport = () => {
  const navigate = useNavigate();
  const { mySchools: schools, loading: schoolsLoading } = useSchools({ myChildren: true });
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    schoolId: '',
    file: null
  });
  
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'عنوان التقرير مطلوب';
    } else if (formData.title.trim().length < 10) {
      newErrors.title = 'عنوان التقرير يجب أن يكون على الأقل 10 أحرف';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'عنوان التقرير يجب ألا يتجاوز 100 حرف';
    }
    
    // Validate content
    if (!formData.content.trim()) {
      newErrors.content = 'محتوى التقرير مطلوب';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'محتوى التقرير يجب أن يكون على الأقل 10 أحرف';
    } else if (formData.content.trim().length > 1000) {
      newErrors.content = 'محتوى التقرير يجب ألا يتجاوز 1000 حرف';
    }
    
    // Validate school selection
    if (!formData.schoolId) {
      newErrors.schoolId = 'يرجى اختيار مدرسة';
    }
    
    // Validate file if selected
    if (formData.file) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!validTypes.includes(formData.file.type)) {
        newErrors.file = 'نوع الملف غير مدعوم. يرجى اختيار ملف PDF, DOCX, أو XLSX';
      } else if (formData.file.size > 5 * 1024 * 1024) {
        newErrors.file = 'حجم الملف يجب ألا يتجاوز 5 ميغابايت';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        file: file
      }));
      setFileName(file.name);
      
      // Clear file error if it exists
      if (errors.file) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.file;
          return newErrors;
        });
      }
    } else {
      setFormData(prev => ({
        ...prev,
        file: null
      }));
      setFileName('');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });
    
    try {
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success or error randomly for demonstration
      const isSuccess = Math.random() > 0.2; // 80% success rate
      
      if (isSuccess) {
        setSubmitMessage({
          type: 'success',
          text: 'تم حفظ التقرير بنجاح!'
        });
        
        // Reset form after successful submission
        setFormData({
          title: '',
          content: '',
          schoolId: '',
          file: null
        });
        setFileName('');
        setErrors({});
        
        // Navigate back to reports page after 2 seconds
        setTimeout(() => {
          navigate('/dashboard/supervisor/reports');
        }, 2000);
      } else {
        throw new Error('حدث خطأ أثناء حفظ التقرير. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: error.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    navigate('/dashboard/Supervisors/reports');
  };

  return (
    <div className="container mx-auto p-4 bg-white dark:bg-gray-900 transition-colors duration-300" dir="rtl">
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="mb-8"
>
  <div className="w-full text-right mb-6">
    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
      إنشاء تقرير جديد
    </h1>
    <p className="text-gray-600 dark:text-gray-400 mt-2">
      قم بإنشاء تقرير جديد للمدرسة التي تشرف عليها
    </p>
  </div>
</motion.div>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {/* Success/Error Message */}
          {submitMessage.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg flex items-center ${
                submitMessage.type === 'success' 
                  ? 'bg-green-100 border border-green-400 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200' 
                  : 'bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
              }`}
            >
              {submitMessage.type === 'success' ? (
                <FaCheck className="ml-2" />
              ) : (
                <FaExclamationTriangle className="ml-2" />
              )}
              <span>{submitMessage.text}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Report Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                عنوان التقرير *
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="أدخل عنوان التقرير"
                className={`w-full text-right bg-gray-100 dark:bg-gray-700 border ${
                  errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-md p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.title && (
                <motion.p 
                  className="mt-1 text-sm text-red-600 dark:text-red-400 text-right flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <FaExclamationTriangle className="ml-1" />
                  {errors.title}
                </motion.p>
              )}
            </div>

            {/* Report Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                محتوى التقرير *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={6}
                placeholder="اكتب محتوى التقرير هنا..."
                className={`w-full text-right bg-gray-100 dark:bg-gray-700 border ${
                  errors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-md p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none`}
              />
              {errors.content && (
                <motion.p 
                  className="mt-1 text-sm text-red-600 dark:text-red-400 text-right flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <FaExclamationTriangle className="ml-1" />
                  {errors.content}
                </motion.p>
              )}
            </div>

            {/* School Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                اختيار المدرسة *
              </label>
              {schoolsLoading ? (
                <div className="flex justify-center py-4">
                  <Loading size="sm" />
                </div>
              ) : (
                <div className="relative">
                  <select
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleInputChange}
                    className={`w-full text-right bg-gray-100 dark:bg-gray-700 border ${
                      errors.schoolId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-md p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none`}
                  >
                    <option value="">اختر مدرسة</option>
                    {schools.map(school => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <FaSchool className="text-gray-500 dark:text-gray-400" />
                  </div>
                </div>
              )}
              {errors.schoolId && (
                <motion.p 
                  className="mt-1 text-sm text-red-600 dark:text-red-400 text-right flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <FaExclamationTriangle className="ml-1" />
                  {errors.schoolId}
                </motion.p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                رفع ملف التقرير (اختياري)
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer">
                  <div className={`flex items-center justify-between p-3 border rounded-md ${
                    errors.file ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white`}>
                    <span className="text-right truncate flex-1">
                      {fileName || 'اختر ملف (PDF, DOCX, XLSX)'}
                    </span>
                    <FaFileAlt className="text-gray-500 dark:text-gray-400 ml-2" />
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.docx,.xlsx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.file && (
                <motion.p 
                  className="mt-1 text-sm text-red-600 dark:text-red-400 text-right flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <FaExclamationTriangle className="ml-1" />
                  {errors.file}
                </motion.p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                الحد الأقصى للحجم: 5 ميغابايت
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                disabled={isSubmitting}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loading size="sm" />
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>حفظ التقرير</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateReport;