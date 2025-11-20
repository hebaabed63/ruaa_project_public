import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useUISettings } from '../hooks/useData';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBell, 
  FaEnvelope, 
  FaSms, 
  FaDesktop,
  FaSave,
  FaUndo,
  FaLock,
  FaUserShield,
  FaUserFriends,
  FaHistory,
  FaEye,
  FaEyeSlash,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimes
} from 'react-icons/fa';

// Account settings component moved outside to prevent re-creation
const AccountSettings = memo(({ 
  tempSettings, 
  errors, 
  showPassword, 
  isSaving, 
  successMessage, 
  updateTempSetting, 
  setShowPassword, 
  handleChangePassword 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    {/* Success Message */}
    <AnimatePresence>
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center"
        >
          <FaCheckCircle className="text-green-500 dark:text-green-400 mr-2" />
          <span className="text-green-800 dark:text-green-200">{successMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Change Password */}
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">تغيير كلمة المرور</h3>
      
      <form onSubmit={handleChangePassword} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            كلمة المرور الحالية
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={tempSettings.currentPassword || ''}
              onChange={(e) => updateTempSetting('currentPassword', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="أدخل كلمة المرور الحالية"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
              <FaExclamationTriangle className="ml-1" />
              {errors.currentPassword}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            كلمة المرور الجديدة
          </label>
          <input
            type="password"
            value={tempSettings.newPassword || ''}
            onChange={(e) => updateTempSetting('newPassword', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="أدخل كلمة المرور الجديدة"
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
              <FaExclamationTriangle className="ml-1" />
              {errors.newPassword}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            تأكيد كلمة المرور الجديدة
          </label>
          <input
            type="password"
            value={tempSettings.confirmPassword || ''}
            onChange={(e) => updateTempSetting('confirmPassword', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="أدخل كلمة المرور الجديدة مرة أخرى"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
              <FaExclamationTriangle className="ml-1" />
              {errors.confirmPassword}
            </p>
          )}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري الحفظ...
            </>
          ) : (
            'تغيير كلمة المرور'
          )}
        </motion.button>
      </form>
    </div>
  </motion.div>
));

const SettingsPage = () => {
  const { settings, updateSetting } = useUISettings();
  const [tempSettings, setTempSettings] = useState({ ...settings });
  const [activeTab, setActiveTab] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Update temporary settings when settings change
  useEffect(() => {
    setTempSettings({ ...settings });
  }, [settings]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Validate form fields
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Validate password change form if fields are filled
    if (tempSettings.currentPassword || tempSettings.newPassword || tempSettings.confirmPassword) {
      if (!tempSettings.currentPassword) {
        newErrors.currentPassword = 'كلمة المرور الحالية مطلوبة';
      }
      if (!tempSettings.newPassword) {
        newErrors.newPassword = 'كلمة المرور الجديدة مطلوبة';
      } else if (tempSettings.newPassword.length < 8) {
        newErrors.newPassword = 'كلمة المرور الجديدة يجب أن تكون على الأقل 8 أحرف';
      }
      if (!tempSettings.confirmPassword) {
        newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
      } else if (tempSettings.newPassword !== tempSettings.confirmPassword) {
        newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [tempSettings.currentPassword, tempSettings.newPassword, tempSettings.confirmPassword]);

  // Update temporary settings
  const updateTempSetting = useCallback((key, value) => {
    setTempSettings(prev => ({
      ...prev,
      [key]: value
    }));

    // Clear error for this field when user starts typing
    setErrors(prev => {
      if (prev[key]) {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      }
      return prev;
    });
  }, []);

  // Handle password change
  const handleChangePassword = useCallback((e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Simulate API call to change password
    setIsSaving(true);
    setTimeout(() => {
      // In a real app, this would be an API call
      console.log('Password changed successfully');
      setIsSaving(false);
      setSuccessMessage('تم تغيير كلمة المرور بنجاح');
      
      // Clear password fields
      setTempSettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    }, 1500);
  }, [validateForm]);

  // Save settings
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call to save settings
    setTimeout(() => {
      Object.keys(tempSettings).forEach(key => {
        // Don't save password fields through normal settings update
        if (key !== 'currentPassword' && key !== 'newPassword' && key !== 'confirmPassword') {
          updateSetting(key, tempSettings[key]);
        }
      });
      
      setIsSaving(false);
      setSuccessMessage('تم حفظ الإعدادات بنجاح');
    }, 1000);
  };

  // Reset to current settings
  const handleResetSettings = () => {
    setTempSettings({ ...settings });
    setErrors({});
    setSuccessMessage('');
  };

  // Privacy settings section
  const PrivacySettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center"
          >
            <FaCheckCircle className="text-green-500 dark:text-green-400 mr-2" />
            <span className="text-green-800 dark:text-green-200">{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">من يمكنه رؤية معلوماتي</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaUserFriends className="text-gray-500 dark:text-gray-400 mr-3 text-lg" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">معلومات الحساب</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">الاسم، الصورة، معلومات الاتصال</p>
              </div>
            </div>
            <select 
              value={tempSettings.profileVisibility || 'everyone'}
              onChange={(e) => updateTempSetting('profileVisibility', e.target.value)}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              <option value="everyone">الجميع</option>
              <option value="friends">الأصدقاء</option>
              <option value="none">لا أحد</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaHistory className="text-gray-500 dark:text-gray-400 mr-3 text-lg" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">سجل النشاط</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">من يمكنه رؤية نشاطك على المنصة</p>
              </div>
            </div>
            <select 
              value={tempSettings.activityVisibility || 'friends'}
              onChange={(e) => updateTempSetting('activityVisibility', e.target.value)}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              <option value="everyone">الجميع</option>
              <option value="friends">الأصدقاء</option>
              <option value="none">لا أحد</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">إعدادات الخصوصية المتقدمة</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">البحث في محركات البحث</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">السماح للمحركات بالفهرسة</p>
            </div>
            <motion.label 
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                checked={tempSettings.searchIndexing || false}
                onChange={(e) => updateTempSetting('searchIndexing', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </motion.label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">التسويق والإعلانات</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">استخدام البيانات للتسويق</p>
            </div>
            <motion.label 
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                checked={tempSettings.marketingData || true}
                onChange={(e) => updateTempSetting('marketingData', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </motion.label>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Notification settings section
  const NotificationSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center"
          >
            <FaCheckCircle className="text-green-500 dark:text-green-400 mr-2" />
            <span className="text-green-800 dark:text-green-200">{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">الإشعارات</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaBell className="text-gray-500 dark:text-gray-400 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">الإشعارات العامة</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">تفعيل أو تعطيل جميع الإشعارات</p>
              </div>
            </div>
            <motion.label 
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                checked={tempSettings.notifications}
                onChange={(e) => updateTempSetting('notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </motion.label>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaEnvelope className="text-gray-500 dark:text-gray-400 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">البريد الإلكتروني</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">تلقي الإشعارات عبر البريد الإلكتروني</p>
              </div>
            </div>
            <motion.label 
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                checked={tempSettings.emailNotifications}
                onChange={(e) => updateTempSetting('emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </motion.label>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaSms className="text-gray-500 dark:text-gray-400 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">الرسائل النصية</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">تلقي الإشعارات عبر الرسائل النصية</p>
              </div>
            </div>
            <motion.label 
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                checked={tempSettings.smsNotifications}
                onChange={(e) => updateTempSetting('smsNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </motion.label>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaDesktop className="text-gray-500 dark:text-gray-400 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">الإشعارات على سطح المكتب</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">عرض الإشعارات على سطح المكتب</p>
              </div>
            </div>
            <motion.label 
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                checked={tempSettings.desktopNotifications}
                onChange={(e) => updateTempSetting('desktopNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </motion.label>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Support settings section
  const SupportSettings = () => {
    const [supportForm, setSupportForm] = useState({
      title: '',
      description: '',
      senderName: '',
      email: '',
      priority: 'medium',
      issueTypes: {
        technical: false,
        feature: false,
        bug: false,
        general: false
      }
    });
    
    const [files, setFiles] = useState([]);
    const [supportErrors, setSupportErrors] = useState({});
    const [supportSuccess, setSupportSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Handle form input changes
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setSupportForm(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error when user starts typing
      if (supportErrors[name]) {
        setSupportErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    };
    
    // Handle checkbox changes
    const handleCheckboxChange = (type) => {
      setSupportForm(prev => ({
        ...prev,
        issueTypes: {
          ...prev.issueTypes,
          [type]: !prev.issueTypes[type]
        }
      }));
    };
    
    // Handle file selection
    const handleFileChange = (e) => {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    };
    
    // Remove file
    const removeFile = (index) => {
      setFiles(prev => prev.filter((_, i) => i !== index));
    };
    
    // Validate support form
    const validateSupportForm = () => {
      const newErrors = {};
      
      if (!supportForm.title.trim()) {
        newErrors.title = 'عنوان الرسالة مطلوب';
      }
      
      if (!supportForm.description.trim()) {
        newErrors.description = 'الوصف مطلوب';
      } else if (supportForm.description.length > 1000) {
        newErrors.description = 'الوصف يجب ألا يتجاوز 1000 حرف';
      }
      
      if (!supportForm.senderName.trim()) {
        newErrors.senderName = 'اسم المرسل مطلوب';
      }
      
      if (!supportForm.email.trim()) {
        newErrors.email = 'البريد الإلكتروني مطلوب';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supportForm.email)) {
        newErrors.email = 'البريد الإلكتروني غير صحيح';
      }
      
      // Check if at least one issue type is selected
      const hasIssueType = Object.values(supportForm.issueTypes).some(type => type);
      if (!hasIssueType) {
        newErrors.issueTypes = 'يجب اختيار نوع المشكلة على الأقل';
      }
      
      setSupportErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    // Submit support request
    const handleSubmitSupport = (e) => {
      e.preventDefault();
      
      if (!validateSupportForm()) {
        return;
      }
      
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log('Support request submitted:', {
          ...supportForm,
          files: files.map(file => file.name)
        });
        
        setIsSubmitting(false);
        setSupportSuccess(true);
        resetSupportForm();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSupportSuccess(false);
        }, 3000);
      }, 1500);
    };
    
    // Reset support form
    const resetSupportForm = () => {
      setSupportForm({
        title: '',
        description: '',
        senderName: '',
        email: '',
        priority: 'medium',
        issueTypes: {
          technical: false,
          feature: false,
          bug: false,
          general: false
        }
      });
      setFiles([]);
      setSupportErrors({});
    };
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Success Message */}
        <AnimatePresence>
          {supportSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center"
            >
              <FaCheckCircle className="text-green-500 dark:text-green-400 mr-2" />
              <span className="text-green-800 dark:text-green-200">تم إرسال طلب الدعم بنجاح</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">طلب دعم فني</h3>
          
          <form onSubmit={handleSubmitSupport} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                عنوان الرسالة
              </label>
              <input
                type="text"
                name="title"
                value={supportForm.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  supportErrors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="أدخل عنوان المشكلة أو الطلب"
              />
              {supportErrors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <FaExclamationTriangle className="ml-1" />
                  {supportErrors.title}
                </p>
              )}
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                الوصف / التفاصيل
              </label>
              <textarea
                name="description"
                value={supportForm.description}
                onChange={handleInputChange}
                rows={5}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  supportErrors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="اكتب تفاصيل المشكلة أو الطلب"
              />
              <div className="flex justify-between mt-1">
                <div>
                  {supportErrors.description && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                      <FaExclamationTriangle className="ml-1" />
                      {supportErrors.description}
                    </p>
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {supportForm.description.length}/1000
                </div>
              </div>
            </div>
            
            {/* Sender Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                اسم المرسل
              </label>
              <input
                type="text"
                name="senderName"
                value={supportForm.senderName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  supportErrors.senderName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="أدخل اسمك"
              />
              {supportErrors.senderName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <FaExclamationTriangle className="ml-1" />
                  {supportErrors.senderName}
                </p>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="email"
                value={supportForm.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  supportErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="أدخل بريدك الإلكتروني"
              />
              {supportErrors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <FaExclamationTriangle className="ml-1" />
                  {supportErrors.email}
                </p>
              )}
            </div>
            
            {/* Issue Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                نوع المشكلة / الطلب
              </label>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="technical"
                      name="technical"
                      type="checkbox"
                      checked={supportForm.issueTypes.technical}
                      onChange={() => handleCheckboxChange('technical')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="mr-3 text-sm">
                    <label htmlFor="technical" className="font-medium text-gray-700 dark:text-gray-300">
                      مشكلة تقنية (Technical Issue)
                    </label>
                    <ul className="mt-1 text-gray-500 dark:text-gray-400 mr-4">
                      <li>• النظام لا يعمل بشكل صحيح (صفحات لا تُفتح، أزرار لا تعمل)</li>
                      <li>• أخطاء في عرض البيانات (درجات الطلاب، التقارير، الإحصائيات)</li>
                      <li>• مشاكل في تحميل الملفات أو المستندات</li>
                      <li>• مشاكل تسجيل الدخول أو صلاحيات المستخدمين</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="feature"
                      name="feature"
                      type="checkbox"
                      checked={supportForm.issueTypes.feature}
                      onChange={() => handleCheckboxChange('feature')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="mr-3 text-sm">
                    <label htmlFor="feature" className="font-medium text-gray-700 dark:text-gray-300">
                      طلب تحسين أو إضافة ميزة (Feature Request / Enhancement)
                    </label>
                    <ul className="mt-1 text-gray-500 dark:text-gray-400 mr-4">
                      <li>• إضافة تبويبات أو تقارير جديدة</li>
                      <li>• تعديل تصميم أو واجهة الاستخدام لتكون أسهل أو أسرع</li>
                      <li>• تحسين الإشعارات والتنبيهات في النظام</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="bug"
                      name="bug"
                      type="checkbox"
                      checked={supportForm.issueTypes.bug}
                      onChange={() => handleCheckboxChange('bug')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="mr-3 text-sm">
                    <label htmlFor="bug" className="font-medium text-gray-700 dark:text-gray-300">
                      تقرير خطأ (Bug Report)
                    </label>
                    <ul className="mt-1 text-gray-500 dark:text-gray-400 mr-4">
                      <li>• إرفاق لقطة شاشة توضح المشكلة</li>
                      <li>• وصف خطوات حدوث الخطأ بدقة</li>
                      <li>• ذكر متصفح الإنترنت أو الجهاز المستخدم</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="general"
                      name="general"
                      type="checkbox"
                      checked={supportForm.issueTypes.general}
                      onChange={() => handleCheckboxChange('general')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="mr-3 text-sm">
                    <label htmlFor="general" className="font-medium text-gray-700 dark:text-gray-300">
                      استفسار أو سؤال عام (General Question)
                    </label>
                    <ul className="mt-1 text-gray-500 dark:text-gray-400 mr-4">
                      <li>• كيفية استخدام ميزة معينة في الداشبورد</li>
                      <li>• طلب توضيح صلاحيات أو وظائف المستخدمين</li>
                    </ul>
                  </div>
                </div>
              </div>
              {supportErrors.issueTypes && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <FaExclamationTriangle className="ml-1" />
                  {supportErrors.issueTypes}
                </p>
              )}
            </div>
            
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                أولوية الطلب
              </label>
              <select
                name="priority"
                value={supportForm.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">منخفضة</option>
                <option value="medium">متوسطة</option>
                <option value="high">عالية</option>
              </select>
            </div>
            
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                إرفاق ملفات / لقطات شاشة
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>اختر ملفات</span>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">أو اسحب وأفلت</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF, PDF حتى 10MB
                  </p>
                </div>
              </div>
              
              {/* File list */}
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end space-x-3 space-x-reverse">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={resetSupportForm}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                إعادة تعيين
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري الإرسال...
                  </>
                ) : (
                  'إرسال الطلب'
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">الإعدادات</h1>
            <p className="text-gray-600 dark:text-gray-400">تخصيص تجربتك في النظام</p>
          </div>
          
          <div className="flex space-x-3 space-x-reverse mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResetSettings}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              <FaUndo className="ml-2" />
              إعادة تعيين
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <FaSave className="ml-2" />
                  حفظ التغييرات
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Settings Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="flex space-x-8 space-x-reverse overflow-x-auto pb-2">
            {[
              { id: 'account', label: 'الحساب', icon: FaUserShield },
              { id: 'privacy', label: 'الخصوصية', icon: FaLock },
              { id: 'notifications', label: 'الإشعارات', icon: FaBell },
              { id: 'support', label: 'الدعم الفني', icon: FaExclamationTriangle }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ y: -2 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center whitespace-nowrap px-1 py-3 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="ml-2" />
                {tab.label}
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'account' && (
              <AccountSettings
                tempSettings={tempSettings}
                errors={errors}
                showPassword={showPassword}
                isSaving={isSaving}
                successMessage={successMessage}
                updateTempSetting={updateTempSetting}
                setShowPassword={setShowPassword}
                handleChangePassword={handleChangePassword}
              />
            )}
            {activeTab === 'privacy' && <PrivacySettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'support' && <SupportSettings />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SettingsPage;