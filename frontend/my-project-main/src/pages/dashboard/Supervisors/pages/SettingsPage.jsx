import React, { useState, useEffect } from 'react';
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
  FaCheckCircle
} from 'react-icons/fa';

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
  const validateForm = () => {
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
  };

  // Update temporary settings
  const updateTempSetting = (key, value) => {
    setTempSettings(prev => ({
      ...prev,
      [key]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  // Handle password change
  const handleChangePassword = (e) => {
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
  };

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

  // Account settings section
  const AccountSettings = () => (
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
  );

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

  return (
    <div className="container mx-auto p-4" dir="rtl">
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
              { id: 'notifications', label: 'الإشعارات', icon: FaBell }
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
            {activeTab === 'account' && <AccountSettings />}
            {activeTab === 'privacy' && <PrivacySettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SettingsPage;