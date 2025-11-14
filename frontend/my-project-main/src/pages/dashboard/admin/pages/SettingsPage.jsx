import React, { useState, useEffect } from 'react';
import { useAdminContext } from '../contexts/AdminContext.js';
import { FaUserFriends, FaHistory, FaBell, FaEnvelope, FaSms, FaDesktop, FaCheckCircle, FaExclamationTriangle, FaEye, FaEyeSlash, FaTimes, FaSave, FaUndo } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  // Updated to use admin context instead of parent context
  const { profile, updateProfile, changePassword } = useAdminContext();
  const [tempSettings, setTempSettings] = useState({ 
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profileVisibility: 'everyone',
    activityVisibility: 'friends',
    searchIndexing: false,
    marketingData: true,
    notifications: true,
    emailNotifications: true,
    smsNotifications: false,
    desktopNotifications: true
  });
  const [activeTab, setActiveTab] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Log initial state
  useEffect(() => {
    // console.log('Initial tempSettings:', tempSettings);
  }, []);

  // Update temporary settings when profile changes
  useEffect(() => {
    if (profile && Object.keys(profile).length > 0) {
      setTempSettings(prev => ({
        // Preserve password fields as they are not part of profile preferences
        currentPassword: prev.currentPassword,
        newPassword: prev.newPassword,
        confirmPassword: prev.confirmPassword,
        // Update only the preference fields
        profileVisibility: profile.preferences?.profileVisibility || 'everyone',
        activityVisibility: profile.preferences?.activityVisibility || 'friends',
        searchIndexing: profile.preferences?.searchIndexing !== undefined ? profile.preferences.searchIndexing : false,
        marketingData: profile.preferences?.marketingData !== undefined ? profile.preferences.marketingData : true,
        notifications: profile.preferences?.notifications !== undefined ? profile.preferences.notifications : true,
        emailNotifications: profile.preferences?.emailNotifications !== undefined ? profile.preferences.emailNotifications : true,
        smsNotifications: profile.preferences?.smsNotifications !== undefined ? profile.preferences.smsNotifications : false,
        desktopNotifications: profile.preferences?.desktopNotifications !== undefined ? profile.preferences.desktopNotifications : true
      }));
    }
  }, [profile]);

  // Log tempSettings changes for debugging
  useEffect(() => {
    // console.log('Temp settings updated:', tempSettings);
  }, [tempSettings]);

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
    // console.log('Updating setting:', key, value);
    setTempSettings(prev => {
      const newSettings = {
        ...prev,
        [key]: value
      };
      // console.log('New settings:', newSettings);
      return newSettings;
    });

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
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      // Call the changePassword function from admin context
      const response = await changePassword({
        current_password: tempSettings.currentPassword,
        new_password: tempSettings.newPassword,
        new_password_confirmation: tempSettings.confirmPassword
      });
      
      setSuccessMessage('تم تغيير كلمة المرور بنجاح');
      
      // Clear password fields
      setTempSettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      // Clear any previous errors
      setErrors({});
    } catch (err) {
      // Handle different types of errors
      let errorMessage = 'حدث خطأ أثناء تغيير كلمة المرور';
      
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setErrors({ currentPassword: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  // Save settings
  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Prepare profile data with updated preferences
      const profileData = {
        ...profile,
        preferences: {
          profileVisibility: tempSettings.profileVisibility,
          activityVisibility: tempSettings.activityVisibility,
          searchIndexing: tempSettings.searchIndexing,
          marketingData: tempSettings.marketingData,
          notifications: tempSettings.notifications,
          emailNotifications: tempSettings.emailNotifications,
          smsNotifications: tempSettings.smsNotifications,
          desktopNotifications: tempSettings.desktopNotifications
        }
      };
      
      // Update profile with new preferences
      await updateProfile(profileData);
      setSuccessMessage('تم حفظ الإعدادات بنجاح');
      
      // Clear any previous errors
      setErrors({});
    } catch (err) {
      // Handle different types of errors
      let errorMessage = 'حدث خطأ أثناء حفظ الإعدادات';
      
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setSuccessMessage(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to current settings
  const handleResetSettings = () => {
    // console.log('Resetting settings to profile values');
    if (profile && Object.keys(profile).length > 0) {
      setTempSettings(prev => ({
        // Preserve password fields as they are not part of profile preferences
        currentPassword: prev.currentPassword,
        newPassword: prev.newPassword,
        confirmPassword: prev.confirmPassword,
        // Reset preference fields to profile values
        profileVisibility: profile.preferences?.profileVisibility || 'everyone',
        activityVisibility: profile.preferences?.activityVisibility || 'friends',
        searchIndexing: profile.preferences?.searchIndexing !== undefined ? profile.preferences.searchIndexing : false,
        marketingData: profile.preferences?.marketingData !== undefined ? profile.preferences.marketingData : true,
        notifications: profile.preferences?.notifications !== undefined ? profile.preferences.notifications : true,
        emailNotifications: profile.preferences?.emailNotifications !== undefined ? profile.preferences.emailNotifications : true,
        smsNotifications: profile.preferences?.smsNotifications !== undefined ? profile.preferences.smsNotifications : false,
        desktopNotifications: profile.preferences?.desktopNotifications !== undefined ? profile.preferences.desktopNotifications : true
      }));
    } else {
      // If no profile, reset to default values
      setTempSettings({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        profileVisibility: 'everyone',
        activityVisibility: 'friends',
        searchIndexing: false,
        marketingData: true,
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        desktopNotifications: true
      });
    }
    setErrors({});
    setSuccessMessage('');
  };

  // Account settings section
  const AccountSettings = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Success Message */}
      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center"
        >
          <FaCheckCircle className="text-green-500 dark:text-green-400 mr-2" />
          <span className="text-green-800 dark:text-green-200">{successMessage}</span>
        </motion.div>
      )}

      {/* Change Password */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">تغيير كلمة المرور</h3>
        
        <form 
          onSubmit={handleChangePassword} 
          className="space-y-4"
          noValidate
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              كلمة المرور الحالية
            </label>
            <div className="relative">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                type={showPassword ? "text" : "password"}
                value={tempSettings.currentPassword || ''}
                onChange={(e) => updateTempSetting('currentPassword', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="أدخل كلمة المرور الحالية"
                autoComplete="current-password"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </motion.button>
            </div>
            {errors.currentPassword && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center"
              >
                <FaExclamationTriangle className="ml-1" />
                {errors.currentPassword}
              </motion.p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              كلمة المرور الجديدة
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              type="password"
              value={tempSettings.newPassword || ''}
              onChange={(e) => updateTempSetting('newPassword', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="أدخل كلمة المرور الجديدة"
              autoComplete="new-password"
            />
            {errors.newPassword && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center"
              >
                <FaExclamationTriangle className="ml-1" />
                {errors.newPassword}
              </motion.p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              تأكيد كلمة المرور الجديدة
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              type="password"
              value={tempSettings.confirmPassword || ''}
              onChange={(e) => updateTempSetting('confirmPassword', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="أدخل كلمة المرور الجديدة مرة أخرى"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center"
              >
                <FaExclamationTriangle className="ml-1" />
                {errors.confirmPassword}
              </motion.p>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
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
      </motion.div>
    </motion.div>
  );

  // Privacy settings section
  const PrivacySettings = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Success Message */}
      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center"
        >
          <FaCheckCircle className="text-green-500 dark:text-green-400 mr-2" />
          <span className="text-green-800 dark:text-green-200">{successMessage}</span>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">من يمكنه رؤية معلوماتي</h3>
        
        <div className="space-y-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <FaUserFriends className="text-gray-500 dark:text-gray-400 mr-3 text-lg" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">معلومات الحساب</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">الاسم، الصورة، معلومات الاتصال</p>
              </div>
            </div>
            <motion.select 
              whileFocus={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              value={tempSettings.profileVisibility || 'everyone'}
              onChange={(e) => updateTempSetting('profileVisibility', e.target.value)}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              <option value="everyone">الجميع</option>
              <option value="friends">الأصدقاء</option>
              <option value="none">لا أحد</option>
            </motion.select>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <FaHistory className="text-gray-500 dark:text-gray-400 mr-3 text-lg" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">سجل النشاط</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">من يمكنه رؤية نشاطك على المنصة</p>
              </div>
            </div>
            <motion.select 
              whileFocus={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              value={tempSettings.activityVisibility || 'friends'}
              onChange={(e) => updateTempSetting('activityVisibility', e.target.value)}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              <option value="everyone">الجميع</option>
              <option value="friends">الأصدقاء</option>
              <option value="none">لا أحد</option>
            </motion.select>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">إعدادات الخصوصية المتقدمة</h3>
        
        <div className="space-y-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-center justify-between"
          >
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
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-center justify-between"
          >
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
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Notification settings section
  const NotificationSettings = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Success Message */}
      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center"
        >
          <FaCheckCircle className="text-green-500 dark:text-green-400 mr-2" />
          <span className="text-green-800 dark:text-green-200">{successMessage}</span>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">الإشعارات</h3>
        
        <div className="space-y-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-center justify-between"
          >
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
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-center justify-between"
          >
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
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-center justify-between"
          >
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
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-center justify-between"
          >
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
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إعدادات الحساب</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">إدارة إعدادات الحساب والإشعارات</p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('account')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'account'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              الحساب
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('privacy')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'privacy'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              الخصوصية
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'notifications'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              الإشعارات
            </motion.button>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          {activeTab === 'account' && <AccountSettings />}
          {activeTab === 'privacy' && <PrivacySettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex justify-end space-x-3"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResetSettings}
            disabled={isSaving}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50"
          >
            <FaUndo className="ml-2" />
            إعادة تعيين
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
          >
            <FaSave className="ml-2" />
            {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;