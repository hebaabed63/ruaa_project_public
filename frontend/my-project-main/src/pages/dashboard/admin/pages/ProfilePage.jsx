import React, { useState, useEffect, useRef } from 'react';
// Updated import to use admin API service instead of parent API
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
  FaCamera
} from 'react-icons/fa';
// Updated import to use AdminContext instead of ParentProfileContext
import { useAdminContext } from '../contexts/AdminContext';

const ProfilePage = () => {
  // Updated to use admin context instead of parent context
  const { profile: contextProfile, updateProfile, updateAvatar, loading: contextLoading } = useAdminContext();
  const [profile, setProfile] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  // Function to handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
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

  // Function to validate individual fields
  const validateField = (fieldName, value) => {
    let fieldError = '';
    
    switch (fieldName) {
      case 'fullName':
        if (!value || value.trim().length < 3) {
          fieldError = 'الاسم يجب أن يكون 3 أحرف على الأقل';
        } else if (value.trim().length > 50) {
          fieldError = 'الاسم يجب ألا يتجاوز 50 حرفًا';
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          fieldError = 'البريد الإلكتروني غير صالح';
        } else if (value.length > 100) {
          fieldError = 'البريد الإلكتروني طويل جدًا';
        }
        break;
        
      case 'phone':
        const phoneRegex = /^[\+]?[0-9]{10,15}$/;
        if (!value || !phoneRegex.test(value)) {
          fieldError = 'رقم الهاتف غير صالح (يجب أن يكون بين 10-15 رقمًا)';
        }
        break;
        
      case 'address':
        if (!value) {
          fieldError = 'العنوان مطلوب';
        } else if (value.length < 5) {
          fieldError = 'العنوان يجب أن يكون 5 أحرف على الأقل';
        } else if (value.length > 200) {
          fieldError = 'العنوان طويل جدًا';
        }
        break;
        
      default:
        break;
    }
    
    // Update errors state
    if (fieldError) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: fieldError
      }));
    } else if (errors[fieldName]) {
      // Remove error if it was fixed
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use context profile data instead of fetching directly
        if (contextProfile) {
          setProfile(contextProfile);
          setOriginalProfile({ ...contextProfile });
          setAvatarPreview(contextProfile.profileImage);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (contextProfile) {
      fetchData();
    }
  }, [contextProfile]);

  const validateForm = () => {
    const newErrors = {};
    
    // Validate full name
    if (!profile.fullName || profile.fullName.trim().length < 3) {
      newErrors.fullName = 'الاسم يجب أن يكون 3 أحرف على الأقل';
    } else if (profile.fullName.trim().length > 50) {
      newErrors.fullName = 'الاسم يجب ألا يتجاوز 50 حرفًا';
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profile.email || !emailRegex.test(profile.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    } else if (profile.email.length > 100) {
      newErrors.email = 'البريد الإلكتروني طويل جدًا';
    }
    
    // Validate phone
    const phoneRegex = /^[\+]?[0-9]{10,15}$/;
    if (!profile.phone || !phoneRegex.test(profile.phone)) {
      newErrors.phone = 'رقم الهاتف غير صالح (يجب أن يكون بين 10-15 رقمًا)';
    }
    
    // Validate address
    if (!profile.address) {
      newErrors.address = 'العنوان مطلوب';
    } else if (profile.address.length < 5) {
      newErrors.address = 'العنوان يجب أن يكون 5 أحرف على الأقل';
    } else if (profile.address.length > 200) {
      newErrors.address = 'العنوان طويل جدًا';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    // Validate all fields
    if (!validateForm()) {
      alert('يرجى تصحيح الأخطاء في النموذج قبل الحفظ');
      return;
    }
    
    try {
      setUpdating(true);
      setSuccessMessage(''); // Clear any previous success message
      
      // Start with current profile data
      let finalProfileData = { ...profile };
      
      // Check if avatar has changed and needs to be uploaded
      if (avatarPreview !== originalProfile.profileImage) {
        // Upload avatar using context function
        const fileInput = fileInputRef.current;
        if (fileInput && fileInput.files[0]) {
          const formData = new FormData();
          formData.append('avatar', fileInput.files[0]);
          const avatarResponse = await updateAvatar(formData);
          
          // Update the final profile data with the new avatar URL
          finalProfileData.profileImage = avatarResponse.profileImage;
        }
      }
      
      // Update profile data using context function with the final profile data
      const updatedProfile = await updateProfile(finalProfileData);
      
      // Update local state with returned data
      setOriginalProfile({ ...updatedProfile });
      setProfile(updatedProfile);
      // Also update the avatar preview to match the saved avatar
      setAvatarPreview(updatedProfile.profileImage);
      
      // Show success message
      setSuccessMessage('تم حفظ التغييرات بنجاح');
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      // Show error message
      alert(err.message || 'حدث خطأ أثناء حفظ التغييرات');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    // Reset to original profile data
    setProfile({ ...originalProfile });
    setAvatarPreview(originalProfile.profileImage);
    setErrors({});
    setSuccessMessage('');
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const hasChanges = () => {
    if (!profile || !originalProfile) return false;
    return JSON.stringify(profile) !== JSON.stringify(originalProfile) || 
           avatarPreview !== originalProfile.profileImage;
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatar: 'يجب أن يكون الملف صورة' }));
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, avatar: 'حجم الصورة يجب أن لا يتجاوز 5 ميجابايت' }));
        return;
      }
      
      // Validate image dimensions
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        // Clean up object URL
        URL.revokeObjectURL(objectUrl);
        
        // Check minimum dimensions
        if (img.width < 100 || img.height < 100) {
          setErrors(prev => ({ ...prev, avatar: 'حجم الصورة صغير جدًا (يجب أن يكون على الأقل 100×100)' }));
          return;
        }
        
        // Preview the image
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatarPreview(e.target.result);
          // Clear avatar error if it exists
          if (errors.avatar) {
            const newErrors = { ...errors };
            delete newErrors.avatar;
            setErrors(newErrors);
          }
        };
        reader.readAsDataURL(file);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        setErrors(prev => ({ ...prev, avatar: 'الملف غير صالح كصورة' }));
      };
      
      img.src = objectUrl;
    }
  };

  if (loading || contextLoading) {
    return (
      <motion.div 
        className="flex justify-center items-center h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
      </motion.div>
    );
  }

  if (!profile) {
    return (
      <motion.div 
        className="container mx-auto p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          <p className="text-red-500">حدث خطأ أثناء تحميل الملف الشخصي</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto p-4" dir="rtl">
      <motion.div 
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-2xl font-bold text-gray-900 dark:text-white mb-6 p-4 rounded-lg"
          style={{ 
            background: 'linear-gradient(90deg, #64C8CC, #4182F966)',
            boxShadow: '0 4px 6px #4182F966'
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ملفي الشخصي
        </motion.h1>

        {successMessage && (
          <motion.div 
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <FaCheck className="mr-2" />
              <p>{successMessage}</p>
            </div>
          </motion.div>
        )}

        {Object.keys(errors).length > 0 && (
          <motion.div 
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-bold">يرجى تصحيح الأخطاء التالية:</p>
            <ul className="list-disc mr-5 mt-2">
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>{message}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Profile Header */}
        <motion.div 
          className="flex flex-col md:flex-row items-center mb-8 p-6 bg-white dark:bg-gray-700 rounded-lg justify-between"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative mb-4 md:mb-0 md:ml-6">
            <img 
              src={avatarPreview || profile.profileImage} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-600 shadow" 
            />
            <motion.button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 left-0 bg-blue-500 rounded-full p-2 shadow-lg hover:bg-blue-600 transition-colors"
              title="تغيير الصورة"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaCamera className="text-white text-sm" />
            </motion.button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between w-full md:ml-6">
            <div className="text-center md:text-right">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile.fullName}</h2>
              <p className="text-gray-600 dark:text-gray-400">مدير النظام</p>
              {errors.avatar && (
                <motion.p 
                  className="text-red-500 text-sm mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.avatar}
                </motion.p>
              )}
            </div>

            <motion.button
              onClick={handleSaveChanges}
              disabled={!hasChanges() || updating}
              className={`px-6 py-2 rounded-lg flex items-center justify-center mt-4 md:mt-0 space-x-2 ${
                !hasChanges() || updating
                  ? 'bg-[#4182F9] cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
              whileHover={!hasChanges() || updating ? {} : { scale: 1.05 }}
              whileTap={!hasChanges() || updating ? {} : { scale: 0.95 }}
            >
              {updating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              ) : (
                <FaSave className="text-white mr-2" />
              )}
              <span>{updating ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Profile Form */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Full Name */}
          <motion.div 
            className="bg-white dark:bg-gray-700 p-4 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الاسم الكامل
            </label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName || ''}
              onChange={handleInputChange}
              onBlur={(e) => validateField('fullName', e.target.value)}
              className={`w-full bg-gray-100 dark:bg-gray-600 border ${
                errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-500'
              } rounded-md p-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="أدخل الاسم الكامل"
            />
            {errors.fullName && (
              <motion.p 
                className="text-red-500 text-xs mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.fullName}
              </motion.p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div 
            className="bg-white dark:bg-gray-700 p-4 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              value={profile.email || ''}
              onChange={handleInputChange}
              onBlur={(e) => validateField('email', e.target.value)}
              className={`w-full bg-gray-100 dark:bg-gray-600 border ${
                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-500'
              } rounded-md p-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ltr`}
              placeholder="example@email.com"
              dir="ltr"
            />
            {errors.email && (
              <motion.p 
                className="text-red-500 text-xs mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          {/* Address */}
          <motion.div 
            className="bg-white dark:bg-gray-700 p-4 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              العنوان
            </label>
            <input
              type="text"
              name="address"
              value={profile.address || ''}
              onChange={handleInputChange}
              onBlur={(e) => validateField('address', e.target.value)}
              className={`w-full bg-gray-100 dark:bg-gray-600 border ${
                errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-500'
              } rounded-md p-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="أدخل العنوان"
            />
            {errors.address && (
              <motion.p 
                className="text-red-500 text-xs mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.address}
              </motion.p>
            )}
          </motion.div>

          {/* Phone */}
          <motion.div 
            className="bg-white dark:bg-gray-700 p-4 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              رقم الهاتف
            </label>
            <input
              type="tel"
              name="phone"
              value={profile.phone || ''}
              onChange={handleInputChange}
              onBlur={(e) => validateField('phone', e.target.value)}
              className={`w-full bg-gray-100 dark:bg-gray-600 border ${
                errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-500'
              } rounded-md p-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ltr`}
              placeholder="+966501234567"
              dir="ltr"
            />
            {errors.phone && (
              <motion.p 
                className="text-red-500 text-xs mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.phone}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      
      </motion.div>
    </div>
  );
};

export default ProfilePage;