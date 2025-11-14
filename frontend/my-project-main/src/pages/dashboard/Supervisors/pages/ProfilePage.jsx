import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaSave, 
  FaCheck,
  FaGraduationCap,
  FaSchool,
  FaCamera,
  FaExclamationTriangle,
  FaLock
} from 'react-icons/fa';
import supervisorAPI from '../services/supervisorApi';
import { useSupervisorProfileContext } from '../contexts/SupervisorProfileContext';
import ChangePasswordModal from '../components/ChangePasswordModal';

const ProfilePage = () => {
  const { profile: contextProfile, updateProfile, updateAvatar } = useSupervisorProfileContext();
  const [profile, setProfile] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  // تغيير القيم في الفورم
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // التحقق من صحة الحقول
  const validateField = (fieldName, value) => {
    let fieldError = '';
    switch (fieldName) {
      case 'fullName':
        if (!value || value.trim().length < 3) fieldError = 'الاسم يجب أن يكون 3 أحرف على الأقل';
        else if (value.trim().length > 50) fieldError = 'الاسم يجب ألا يتجاوز 50 حرفًا';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) fieldError = 'البريد الإلكتروني غير صالح';
        else if (value.length > 100) fieldError = 'البريد الإلكتروني طويل جدًا';
        break;
      case 'phone':
        const phoneRegex = /^[\+]?[0-9]{10,15}$/;
        if (!value || !phoneRegex.test(value)) fieldError = 'رقم الهاتف غير صالح (10-15 رقمًا)';
        break;
      case 'address':
        if (!value) fieldError = 'العنوان مطلوب';
        else if (value.length < 5) fieldError = 'العنوان يجب أن يكون 5 أحرف على الأقل';
        else if (value.length > 200) fieldError = 'العنوان طويل جدًا';
        break;
      default:
        break;
    }
    if (fieldError) setErrors(prev => ({ ...prev, [fieldName]: fieldError }));
    else if (errors[fieldName]) {
      const newErrors = { ...errors };
      delete newErrors[fieldName];
      setErrors(newErrors);
    }
  };

  // التحقق من صحة ملف الصورة
  const validateImageFile = (file) => {
    // التحقق من نوع الملف
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return 'يجب أن يكون الملف صورة من نوع JPG أو PNG';
    }
    
    // التحقق من حجم الملف (2 ميغابايت)
    if (file.size > 2 * 1024 * 1024) {
      return 'حجم الصورة يجب أن لا يتجاوز 2 ميجابايت';
    }
    
    return null;
  };

  // التعامل مع تغيير الصورة
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // التحقق من صحة الملف
      const validationError = validateImageFile(file);
      if (validationError) {
        setErrors(prev => ({ ...prev, avatar: validationError }));
        return;
      }
      
      try {
        // إنشاء معاينة مؤقتة للصورة
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatarPreview(e.target.result);
        };
        reader.readAsDataURL(file);
        
        // إرسال الصورة إلى الخادم عبر Context (رفع واحد فقط)
        const formData = new FormData();
        formData.append('avatar', file);
        const updatedData = await updateAvatar(formData);
        
        // تحديث الحالة المحلية بنفس البيانات من Context
        setProfile(prev => ({
          ...prev,
          profileImage: updatedData.profileImage
        }));
        setOriginalProfile(prev => ({
          ...prev,
          profileImage: updatedData.profileImage
        }));
        setAvatarPreview(updatedData.profileImage);
        
        // إزالة خطأ الصورة إذا كان موجوداً
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.avatar;
          return newErrors;
        });
        
        setSuccessMessage('تم تحديث الصورة بنجاح');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Error uploading avatar:', err);
        setErrors(prev => ({ ...prev, avatar: 'حدث خطأ أثناء رفع الصورة. يرجى المحاولة مرة أخرى.' }));
      }
    }
  };

  // جلب بيانات الملف الشخصي عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching supervisor profile data...');
        // استخدام بيانات الملف الشخصي من السياق إذا كانت متوفرة
        let profileData;
        if (contextProfile) {
          profileData = contextProfile;
        } else {
          profileData = await supervisorAPI.fetchSupervisorProfile();
        }
        console.log('Profile data fetched successfully:', profileData);
        const schoolsData = await supervisorAPI.fetchSupervisorSchools();
        console.log('Schools data fetched successfully:', schoolsData);
        setProfile({
          ...profileData,
          fullName: profileData.fullName || profileData.name || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          address: profileData.address || ''
        });
        setOriginalProfile({
          ...profileData,
          fullName: profileData.fullName || profileData.name || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          address: profileData.address || ''
        });
        setAvatarPreview(profileData.profileImage || '/default-avatar.png');
        setSchools(schoolsData);
        setErrors({}); // Clear any previous errors
      } catch (err) {
        console.error('Error fetching data:', err);
        // Show specific error message to user based on error type
        if (err.response?.status === 401) {
          setErrors({ general: 'جلسة تسجيل الدخول منتهية. يرجى تسجيل الدخول مرة أخرى.' });
        } else if (err.response?.status === 403) {
          setErrors({ general: 'غير مسموح لك بالوصول لهذه البيانات.' });
        } else if (err.response?.status === 500) {
          setErrors({ general: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.' });
        } else if (!navigator.onLine) {
          setErrors({ general: 'لا يوجد اتصال بالإنترنت. يرجى التحقق من الاتصال وإعادة المحاولة.' });
        } else {
          setErrors({ general: 'حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى لاحقاً.' });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [contextProfile]);

  // Function to retry fetching data
  const handleRetry = async () => {
    try {
      setLoading(true);
      setErrors({});
      
      // Re-fetch profile data
      const profileData = await supervisorAPI.fetchSupervisorProfile();
      const schoolsData = await supervisorAPI.fetchSupervisorSchools();
      
      setProfile(profileData);
      setOriginalProfile({ ...profileData });
      setAvatarPreview(profileData.profileImage || '/default-avatar.png');
      setSchools(schoolsData);
    } catch (err) {
      console.error('Error retrying data fetch:', err);
      if (err.response?.status === 401) {
        setErrors({ general: 'جلسة تسجيل الدخول منتهية. يرجى تسجيل الدخول مرة أخرى.' });
      } else if (err.response?.status === 403) {
        setErrors({ general: 'غير مسموح لك بالوصول لهذه البيانات.' });
      } else if (err.response?.status === 500) {
        setErrors({ general: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.' });
      } else if (!navigator.onLine) {
        setErrors({ general: 'لا يوجد اتصال بالإنترنت. يرجى التحقق من الاتصال وإعادة المحاولة.' });
      } else {
        setErrors({ general: 'حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى لاحقاً.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!profile.fullName || profile.fullName.trim().length < 3) newErrors.fullName = 'الاسم يجب أن يكون 3 أحرف على الأقل';
    if (!profile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) newErrors.email = 'البريد الإلكتروني غير صالح';
    if (!profile.phone || !/^[\+]?[0-9]{10,15}$/.test(profile.phone)) newErrors.phone = 'رقم الهاتف غير صالح (10-15 رقمًا)';
    if (profile.address && profile.address.length < 5) newErrors.address = 'العنوان يجب أن يكون 5 أحرف على الأقل';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasChanges = () => {
    if (!profile || !originalProfile) return false;
    return JSON.stringify(profile) !== JSON.stringify(originalProfile) || avatarPreview !== originalProfile.profileImage;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) {
      setErrors(prev => ({ ...prev, general: 'يرجى تصحيح الأخطاء قبل الحفظ' }));
      return;
    }
    try {
      setUpdating(true);
      
      // إرسال البيانات إلى الخادم عبر Context (رفع واحد فقط)
      const updatedProfile = await updateProfile({
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        address: profile.address
      });
      
      // تحديث الحالة المحلية بنفس البيانات من Context
      setProfile(updatedProfile);
      setOriginalProfile({ ...updatedProfile });
      
      setSuccessMessage('تم حفظ التغييرات بنجاح');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Clear any previous errors
      setErrors({});
    } catch (err) {
      console.error(err);
      setErrors({ general: err.message || 'حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى.' });
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setProfile({ ...originalProfile });
    setAvatarPreview(originalProfile.profileImage);
    setErrors({});
    setSuccessMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // فتح محدد الملفات
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (loading) {
    return (
      <motion.div className="flex justify-center items-center h-64" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}/>
      </motion.div>
    );
  }

  if (!profile && errors.general) {
    return (
      <motion.div className="container mx-auto p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center" initial={{ y: -20 }} animate={{ y: 0 }}>
          <p className="text-red-500 mb-4">{errors.general}</p>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto p-4" dir="rtl">
      <motion.div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        
        <motion.h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 p-4 rounded-lg" style={{ background: 'linear-gradient(90deg, #64C8CC, #4182F966)', boxShadow: '0 4px 6px #4182F966' }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          أهلاً، أستاذ/ة  {profile?.fullName || profile?.name || 'سيّد/سيّدة'} !
        </motion.h1>

        {successMessage && (
          <motion.div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center">
              <FaCheck className="mr-2" />
              <p>{successMessage}</p>
            </div>
          </motion.div>
        )}

        {errors.general && (
          <motion.div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
            <div className="flex items-center">
              <FaExclamationTriangle className="mr-2" />
              <p>{errors.general}</p>
            </div>
          </motion.div>
        )}

        {Object.keys(errors).length > 0 && !errors.general && (
          <motion.div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
            <p className="font-bold">يرجى تصحيح الأخطاء التالية:</p>
            <ul className="list-disc mr-5 mt-2">
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>{message}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Profile Header */}
        <motion.div className="flex flex-col md:flex-row items-center mb-8 p-6 bg-white dark:bg-gray-700 rounded-lg justify-between" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <div className="relative mb-4 md:mb-0 md:ml-6">
            <img 
              src={avatarPreview || profile.profileImage || '/default-avatar.png'} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-600 shadow" 
            />
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
              accept="image/*" 
              className="hidden" 
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={triggerFileInput}
              className="absolute bottom-0 left-0 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border-2 border-white dark:border-gray-600"
            >
              <FaCamera className="text-gray-700 dark:text-gray-300" />
            </motion.button>
            {errors.avatar && (
              <motion.p 
                className="text-red-500 text-sm mt-2 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <FaExclamationTriangle className="ml-1" />
                {errors.avatar}
              </motion.p>
            )}
          </div>

          <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between w-full md:ml-6">
            <div className="text-center md:text-right">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile.fullName || profile.name || 'مشرف'}</h2>
              <p className="text-gray-600 dark:text-gray-400">مشرف</p>
            </div>

            <div className="flex space-x-3 space-x-reverse mt-4 md:mt-0">
              <motion.button
                onClick={() => setPasswordModalOpen(true)}
                className="px-4 py-2 rounded-lg flex items-center justify-center space-x-2 space-x-reverse bg-gray-600 hover:bg-gray-700 text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaLock className="text-white" />
                <span>تغيير كلمة المرور</span>
              </motion.button>
              
              <motion.button
                onClick={handleSaveChanges}
                disabled={!hasChanges() || updating}
                className={`px-6 py-2 rounded-lg flex items-center justify-center space-x-2 space-x-reverse ${!hasChanges() || updating ? 'bg-[#4182F9] cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                whileHover={!hasChanges() || updating ? {} : { scale: 1.05 }}
                whileTap={!hasChanges() || updating ? {} : { scale: 0.95 }}
              >
                {updating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                ) : (
                  <FaSave className="text-white mr-2" />
                )}
                <span>{updating ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Profile Form */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          {/* Full Name */}
          <motion.div className="bg-white dark:bg-gray-700 p-4 rounded-lg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الاسم الكامل</label>
            <input type="text" name="fullName" value={profile.fullName || profile.name || ''} onChange={handleInputChange} onBlur={(e) => validateField('fullName', e.target.value)} className={`w-full bg-gray-100 dark:bg-gray-600 border ${errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-500'} rounded-md p-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`} placeholder="أدخل الاسم الكامل" />
            {errors.fullName && <motion.p className="text-red-500 text-xs mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors.fullName}</motion.p>}
          </motion.div>

          {/* Email */}
          <motion.div className="bg-white dark:bg-gray-700 p-4 rounded-lg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">البريد الإلكتروني</label>
            <input type="email" name="email" value={profile.email || ''} onChange={handleInputChange} onBlur={(e) => validateField('email', e.target.value)} className={`w-full bg-gray-100 dark:bg-gray-600 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-500'} rounded-md p-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ltr`} placeholder="example@email.com" dir="ltr" />
            {errors.email && <motion.p className="text-red-500 text-xs mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors.email}</motion.p>}
          </motion.div>

          {/* Phone */}
          <motion.div className="bg-white dark:bg-gray-700 p-4 rounded-lg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">رقم الهاتف</label>
            <input type="tel" name="phone" value={profile.phone || ''} onChange={handleInputChange} onBlur={(e) => validateField('phone', e.target.value)} className={`w-full bg-gray-100 dark:bg-gray-600 border ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-500'} rounded-md p-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ltr`} placeholder="+966501234567" dir="ltr" />
            {errors.phone && <motion.p className="text-red-500 text-xs mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors.phone}</motion.p>}
          </motion.div>

          {/* Address */}
          <motion.div className="bg-white dark:bg-gray-700 p-4 rounded-lg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">العنوان</label>
            <input type="text" name="address" value={profile.address || ''} onChange={handleInputChange} onBlur={(e) => validateField('address', e.target.value)} className={`w-full bg-gray-100 dark:bg-gray-600 border ${errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-500'} rounded-md p-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`} placeholder="أدخل العنوان" />
            {errors.address && <motion.p className="text-red-500 text-xs mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors.address}</motion.p>}
          </motion.div>
         
        </motion.div>

        {/* Schools Section */}
        <motion.div className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 border border-gray-300 dark:border-gray-600">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">  معلومات المدارس التي تُشرف عليها</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Display real schools data */}
              {schools && schools.length > 0 ? (
                schools.map((school, index) => (
                  <motion.div key={school.school_id} className="flex items-center p-4 dark:bg-gray-600 rounded-lg shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 1 + index * 0.1 }} whileHover={{ y: -2 }}>
                    <div className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow flex items-center justify-center bg-blue-100 dark:bg-gray-500">
                      <FaSchool className="text-blue-500 dark:text-white text-xl" />
                    </div>
                    <div className="mr-4">
                      <h3 className="font-bold text-gray-900 dark:text-white">{school.name}</h3>
                      <div className="flex items-center mt-1">
                        <FaMapMarkerAlt className="text-gray-400 ml-2 text-sm" />
                        <span className="text-gray-600 dark:text-gray-300 text-sm">{school.address || 'غير محدد'}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <FaGraduationCap className="text-gray-400 ml-2 text-sm" />
                        <span className="text-gray-600 dark:text-gray-300 text-sm">المرحلة {school.type || 'غير محددة'}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <FaSchool className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">لا توجد مدارس مرتبطة بك حالياً</p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">سيتم عرض المدارس التي تشرف عليها هنا بمجرد إضافتها من قبل الإدارة</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

      </motion.div>
      
      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={passwordModalOpen} 
        onClose={() => setPasswordModalOpen(false)} 
      />
    </div>
  );
};

export default ProfilePage;
