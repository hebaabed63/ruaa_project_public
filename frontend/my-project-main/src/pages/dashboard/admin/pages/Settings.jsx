import React, { useState, useEffect } from "react";
import { FaSave, FaSpinner, FaInfoCircle } from 'react-icons/fa';
import { showAlert } from "../../../../utils/SweetAlert";
import { getSystemSettings, updateSystemSettings } from "../../../../services/adminService";

const SettingsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    // General settings
    siteName: "منصة رؤى التعليمية",
    siteDescription: "منصة شاملة لإدارة المدارس والطلاب والمعلمين",
    contactEmail: "support@ruaa.edu.sa",
    contactPhone: "+966 11 123 4567",
    
    // Email settings
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "noreply@ruaa.edu.sa",
    smtpPassword: "",
    smtpEncryption: "tls",
    
    // Notification settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    
    // Security settings
    passwordMinLength: 8,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    sessionTimeout: 30, // minutes
    
    // Appearance settings
    theme: "light",
    language: "ar",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    
    // Maintenance settings
    maintenanceMode: false,
    maintenanceMessage: "النظام قيد الصيانة، يرجى المحاولة لاحقاً"
  });

  const [errors, setErrors] = useState({});

  // Load settings from backend
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const response = await getSystemSettings();
        if (response.success) {
          // Map backend keys to frontend keys
          const mappedSettings = {
            siteName: response.data.site_name,
            siteDescription: response.data.site_description,
            contactEmail: response.data.contact_email,
            contactPhone: response.data.contact_phone,
            smtpHost: response.data.smtp_host,
            smtpPort: response.data.smtp_port,
            smtpUsername: response.data.smtp_username,
            smtpPassword: "", // Don't load password for security
            smtpEncryption: response.data.smtp_encryption,
            emailNotifications: response.data.email_notifications,
            smsNotifications: response.data.sms_notifications,
            pushNotifications: response.data.push_notifications,
            passwordMinLength: response.data.password_min_length,
            passwordRequireNumbers: response.data.password_require_numbers,
            passwordRequireSpecialChars: response.data.password_require_special_chars,
            sessionTimeout: response.data.session_timeout,
            theme: response.data.theme,
            language: response.data.language,
            dateFormat: response.data.date_format,
            timeFormat: response.data.time_format,
            maintenanceMode: response.data.maintenance_mode,
            maintenanceMessage: response.data.maintenance_message
          };
          setSettings(mappedSettings);
        }
      } catch (error) {
        showAlert('error', error.message || 'حدث خطأ في تحميل الإعدادات');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateSettings = () => {
    const newErrors = {};
    
    // Validate required fields
    if (!settings.siteName.trim()) {
      newErrors.siteName = 'اسم الموقع مطلوب';
    }
    
    if (!settings.contactEmail.trim()) {
      newErrors.contactEmail = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(settings.contactEmail)) {
      newErrors.contactEmail = 'البريد الإلكتروني غير صحيح';
    }
    
    if (settings.passwordMinLength < 6) {
      newErrors.passwordMinLength = 'الحد الأدنى لطول كلمة المرور هو 6 أحرف';
    }
    
    if (settings.sessionTimeout < 5) {
      newErrors.sessionTimeout = 'مهلة الجلسة يجب أن تكون 5 دقائق على الأقل';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveSettings = async () => {
    if (!validateSettings()) {
      showAlert('error', 'يرجى تصحيح الأخطاء في النموذج');
      return;
    }
    
    setSaving(true);
    try {
      // Map frontend keys to backend keys
      const settingsData = {
        site_name: settings.siteName,
        site_description: settings.siteDescription,
        contact_email: settings.contactEmail,
        contact_phone: settings.contactPhone,
        smtp_host: settings.smtpHost,
        smtp_port: settings.smtpPort,
        smtp_username: settings.smtpUsername,
        smtp_encryption: settings.smtpEncryption,
        email_notifications: settings.emailNotifications,
        sms_notifications: settings.smsNotifications,
        push_notifications: settings.pushNotifications,
        password_min_length: settings.passwordMinLength,
        password_require_numbers: settings.passwordRequireNumbers,
        password_require_special_chars: settings.passwordRequireSpecialChars,
        session_timeout: settings.sessionTimeout,
        theme: settings.theme,
        language: settings.language,
        date_format: settings.dateFormat,
        time_format: settings.timeFormat,
        maintenance_mode: settings.maintenanceMode,
        maintenance_message: settings.maintenanceMessage
      };
      
      // Only include password if it's not empty
      if (settings.smtpPassword) {
        settingsData.smtp_password = settings.smtpPassword;
      }
      
      const response = await updateSystemSettings(settingsData);
      if (response.success) {
        showAlert('success', 'تم حفظ الإعدادات بنجاح');
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  // Section definitions
  const sections = [
    { id: 'general', title: 'الإعدادات العامة', icon: '⚙️' },
    { id: 'email', title: 'إعدادات البريد الإلكتروني', icon: '📧' },
    { id: 'notifications', title: 'إعدادات الإشعارات', icon: '🔔' },
    { id: 'security', title: 'إعدادات الأمان', icon: '🔒' },
    { id: 'appearance', title: 'إعدادات المظهر', icon: '🎨' },
    { id: 'maintenance', title: 'إعدادات الصيانة', icon: '🛠️' }
  ];

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'general':
        return renderGeneralSettings();
      case 'email':
        return renderEmailSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'maintenance':
        return renderMaintenanceSettings();
      default:
        return renderGeneralSettings();
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">الإعدادات العامة</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            اسم الموقع
          </label>
          <input
            type="text"
            name="siteName"
            value={settings.siteName}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.siteName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.siteName && (
            <p className="mt-1 text-sm text-red-600">{errors.siteName}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            البريد الإلكتروني للتواصل
          </label>
          <input
            type="email"
            name="contactEmail"
            value={settings.contactEmail}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.contactEmail ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.contactEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            رقم الهاتف للتواصل
          </label>
          <input
            type="text"
            name="contactPhone"
            value={settings.contactPhone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            وصف الموقع
          </label>
          <textarea
            name="siteDescription"
            value={settings.siteDescription}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">إعدادات البريد الإلكتروني</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            خادم SMTP
          </label>
          <input
            type="text"
            name="smtpHost"
            value={settings.smtpHost}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            منفذ SMTP
          </label>
          <input
            type="text"
            name="smtpPort"
            value={settings.smtpPort}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            اسم المستخدم
          </label>
          <input
            type="text"
            name="smtpUsername"
            value={settings.smtpUsername}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            كلمة المرور
          </label>
          <input
            type="password"
            name="smtpPassword"
            value={settings.smtpPassword}
            onChange={handleInputChange}
            placeholder="اتركه فارغاً للحفاظ على كلمة المرور الحالية"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            نوع التشفير
          </label>
          <select
            name="smtpEncryption"
            value={settings.smtpEncryption}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="tls">TLS</option>
            <option value="ssl">SSL</option>
            <option value="none">بدون تشفير</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">إعدادات الإشعارات</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              إشعارات البريد الإلكتروني
            </label>
            <p className="text-sm text-gray-500">
              إرسال إشعارات عبر البريد الإلكتروني
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleInputChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              إشعارات الرسائل القصيرة
            </label>
            <p className="text-sm text-gray-500">
              إرسال إشعارات عبر الرسائل القصيرة
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="smsNotifications"
              checked={settings.smsNotifications}
              onChange={handleInputChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              الإشعارات داخل التطبيق
            </label>
            <p className="text-sm text-gray-500">
              عرض الإشعارات داخل التطبيق
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="pushNotifications"
              checked={settings.pushNotifications}
              onChange={handleInputChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">إعدادات الأمان</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الحد الأدنى لطول كلمة المرور
          </label>
          <input
            type="number"
            name="passwordMinLength"
            value={settings.passwordMinLength}
            onChange={handleInputChange}
            min="6"
            max="128"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.passwordMinLength ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.passwordMinLength && (
            <p className="mt-1 text-sm text-red-600">{errors.passwordMinLength}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            مهلة الجلسة (بالدقائق)
          </label>
          <input
            type="number"
            name="sessionTimeout"
            value={settings.sessionTimeout}
            onChange={handleInputChange}
            min="5"
            max="1440"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.sessionTimeout ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.sessionTimeout && (
            <p className="mt-1 text-sm text-red-600">{errors.sessionTimeout}</p>
          )}
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            name="passwordRequireNumbers"
            checked={settings.passwordRequireNumbers}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="mr-2 block text-sm text-gray-700">
            تتطلب كلمة المرور أرقاماً
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            name="passwordRequireSpecialChars"
            checked={settings.passwordRequireSpecialChars}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="mr-2 block text-sm text-gray-700">
            تتطلب كلمة المرور أحرف خاصة
          </label>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">إعدادات المظهر</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            السمة
          </label>
          <select
            name="theme"
            value={settings.theme}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="light">فاتح</option>
            <option value="dark">داكن</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            اللغة
          </label>
          <select
            name="language"
            value={settings.language}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ar">العربية</option>
            <option value="en">الإنجليزية</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            تنسيق التاريخ
          </label>
          <select
            name="dateFormat"
            value={settings.dateFormat}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            تنسيق الوقت
          </label>
          <select
            name="timeFormat"
            value={settings.timeFormat}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="12h">12 ساعة</option>
            <option value="24h">24 ساعة</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderMaintenanceSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">إعدادات الصيانة</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              وضع الصيانة
            </label>
            <p className="text-sm text-gray-500">
              تفعيل وضع الصيانة لإيقاف النظام مؤقتاً
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleInputChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        {settings.maintenanceMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رسالة الصيانة
            </label>
            <textarea
              name="maintenanceMessage"
              value={settings.maintenanceMessage}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin">
          <FaSpinner className="text-3xl text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">إعدادات النظام</h2>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                حفظ الإعدادات
              </>
            )}
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          قم بتخصيص إعدادات النظام حسب احتياجاتك
        </p>
      </div>
      
      <div className="p-6">
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <FaInfoCircle className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">ملاحظة مهمة</h3>
              <p className="text-sm text-blue-700 mt-1">
                تأكد من مراجعة جميع الإعدادات بعناية قبل الحفظ. بعض الإعدادات قد تتطلب إعادة تشغيل النظام لتصبح نافذة المفعول.
              </p>
            </div>
          </div>
        </div>
        
        {/* Section Navigation */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 space-x-reverse pb-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap transition-colors duration-200 ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{section.icon}</span>
                {section.title}
              </button>
            ))}
          </div>
        </div>
        
        {/* Section Content with Simple Animation */}
        <div className="space-y-8 transition-all duration-300 ease-in-out">
          {renderSectionContent(activeSection)}
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                حفظ الإعدادات
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;