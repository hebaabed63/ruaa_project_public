// =============================================================================
// Profile Management Hook for Parents Dashboard
// هوك إدارة الملف الشخصي لداشبورد أولياء الأمور
// =============================================================================

import { useState, useCallback } from 'react';
import { z } from 'zod';
import { parentsAPI } from '../services/api';

// مخطط التحقق من صحة البيانات
// Profile validation schema
const profileSchema = z.object({
  fullName: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'رقم الهاتف غير صالح'),
  address: z.string().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل'),
  region: z.string().min(2, 'المنطقة مطلوبة'),
  preferences: z.object({
    notifications: z.boolean(),
    emailNotifications: z.boolean(),
    smsNotifications: z.boolean(),
    language: z.enum(['ar', 'en']),
    theme: z.enum(['light', 'dark'])
  })
});

/**
 * هوك إدارة الملف الشخصي
 * Profile management hook
 */
export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState(null);

  // جلب بيانات الملف الشخصي
  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await parentsAPI.getParentProfile();
      setProfile(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // تحديث بيانات الملف الشخصي
  // Update profile data
  const updateProfile = useCallback(async (profileData) => {
    try {
      // التحقق من صحة البيانات
      // Validate profile data
      const validatedData = profileSchema.parse(profileData);

      setUpdating(true);
      setError(null);
      const response = await parentsAPI.updateParentProfile(validatedData);
      setProfile(response.data);
      return response.data;
    } catch (err) {
      if (err instanceof z.ZodError) {
        // أخطاء التحقق من صحة البيانات
        // Validation errors
        const errors = err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }));
        setError({ type: 'validation', errors });
      } else {
        setError({ type: 'api', message: err.message });
      }
      throw err;
    } finally {
      setUpdating(false);
    }
  }, []);

  // تحميل صورة شخصية جديدة
  // Upload new avatar
  const uploadAvatar = useCallback(async (file) => {
    try {
      // التحقق من نوع وحجم الملف
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        throw new Error('يجب أن يكون الملف صورة');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('حجم الصورة يجب أن لا يتجاوز 5 ميجابايت');
      }

      setUploadingAvatar(true);
      setError(null);

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await parentsAPI.uploadParentAvatar(formData);
      setProfile(prev => ({ ...prev, profileImage: response.data.profileImage }));
      return response.data;
    } catch (err) {
      setError({ type: 'upload', message: err.message });
      throw err;
    } finally {
      setUploadingAvatar(false);
    }
  }, []);

  // حذف الصورة الشخصية
  // Remove avatar
  const removeAvatar = useCallback(async () => {
    try {
      setUploadingAvatar(true);
      setError(null);
      const response = await parentsAPI.removeParentAvatar();
      setProfile(prev => ({ ...prev, profileImage: null }));
      return response.data;
    } catch (err) {
      setError({ type: 'remove', message: err.message });
      throw err;
    } finally {
      setUploadingAvatar(false);
    }
  }, []);

  return {
    profile,
    loading,
    updating,
    uploadingAvatar,
    error,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    removeAvatar,
    validateProfile: (data) => profileSchema.safeParse(data)
  };
};