// =============================================================================
// Parent Profile Context for Parents Dashboard
// سياق الملف الشخصي لولي الأمر لداشبورد أولياء الأمور
// =============================================================================

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getProfile, updateProfile as updateProfileAPI, updateAvatar as updateAvatarAPI } from '../services/api';

// Create the context
export const ParentProfileContext = createContext(undefined);

/**
 * Parent Profile Provider Component
 * مكون مزود الملف الشخصي لولي الأمر
 */
export const ParentProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProfile();
      if (response.success) {
        // Ensure consistent data structure
        const profileData = {
          ...response.data,
          fullName: response.data.fullName || response.data.name || '',
          name: response.data.name || response.data.fullName || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          profileImage: response.data.profileImage || null
        };
        setProfile(profileData);
      } else {
        throw new Error(response.message || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Error fetching parent profile:', err);
      // Set specific error message based on error type
      if (err.response?.status === 401) {
        setError('جلسة تسجيل الدخول منتهية. يرجى تسجيل الدخول مرة أخرى.');
      } else if (err.response?.status === 403) {
        setError('غير مسموح لك بالوصول لهذه البيانات.');
      } else if (err.response?.status === 500) {
        setError('حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.');
      } else if (!navigator.onLine) {
        setError('لا يوجد اتصال بالإنترنت. يرجى التحقق من الاتصال وإعادة المحاولة.');
      } else {
        setError('حدث خطأ أثناء جلب بيانات الملف الشخصي. يرجى المحاولة مرة أخرى لاحقاً.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Update profile data
  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await updateProfileAPI(profileData);
      if (response.success) {
        // Ensure consistent data structure
        const updatedProfile = {
          ...response.data,
          fullName: response.data.fullName || response.data.name || '',
          name: response.data.name || response.data.fullName || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          profileImage: response.data.profileImage || profile?.profileImage
        };
        setProfile(updatedProfile);
        return updatedProfile;
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      // Set specific error message based on error type
      if (err.response?.status === 401) {
        setError('جلسة تسجيل الدخول منتهية. يرجى تسجيل الدخول مرة أخرى.');
      } else if (err.response?.status === 403) {
        setError('غير مسموح لك بتحديث هذه البيانات.');
      } else if (err.response?.status === 422) {
        setError('بيانات غير صحيحة. يرجى التحقق من المعلومات المدخلة.');
      } else if (err.response?.status === 500) {
        setError('حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.');
      } else if (!navigator.onLine) {
        setError('لا يوجد اتصال بالإنترنت. يرجى التحقق من الاتصال وإعادة المحاولة.');
      } else {
        setError('حدث خطأ أثناء تحديث الملف الشخصي. يرجى المحاولة مرة أخرى لاحقاً.');
      }
      throw err;
    }
  }, [profile]);

  // Update avatar
  const updateAvatar = useCallback(async (formData) => {
    try {
      const response = await updateAvatarAPI(formData);
      if (response.success) {
        // Update profile with new image URL
        const updatedProfile = {
          ...profile,
          profileImage: response.data.profileImage || profile?.profileImage
        };
        setProfile(updatedProfile);
        return response.data; // إرجاع data فقط
      } else {
        throw new Error(response.message || 'Failed to update avatar');
      }
    } catch (err) {
      // Set specific error message based on error type
      if (err.response?.status === 401) {
        setError('جلسة تسجيل الدخول منتهية. يرجى تسجيل الدخول مرة أخرى.');
      } else if (err.response?.status === 403) {
        setError('غير مسموح لك بتحديث الصورة.');
      } else if (err.response?.status === 422) {
        setError('الصورة غير صحيحة. يرجى التأكد من نوع وحجم الصورة.');
      } else if (err.response?.status === 500) {
        setError('حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.');
      } else if (!navigator.onLine) {
        setError('لا يوجد اتصال بالإنترنت. يرجى التحقق من الاتصال وإعادة المحاولة.');
      } else {
        setError('حدث خطأ أثناء تحديث الصورة. يرجى المحاولة مرة أخرى لاحقاً.');
      }
      throw err;
    }
  }, [profile]);

  // Initialize profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Context value
  const value = {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateAvatar,
  };

  return (
    <ParentProfileContext.Provider value={value}>
      {children}
    </ParentProfileContext.Provider>
  );
};

/**
 * Hook to use parent profile context
 * هوك لاستخدام سياق الملف الشخصي لولي الأمر
 */
export const useParentProfileContext = () => {
  const context = useContext(ParentProfileContext);
  if (context === undefined) {
    throw new Error('useParentProfileContext must be used within a ParentProfileProvider');
  }
  return context;
};