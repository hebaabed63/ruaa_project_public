// =============================================================================
// Supervisor Profile Context for Supervisors Dashboard
// سياق الملف الشخصي للمشرف لداشبورد المشرفين
// =============================================================================

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as supervisorAPI from '../services/supervisorApi';

// Create the context
export const SupervisorProfileContext = createContext(undefined);

/**
 * Supervisor Profile Provider Component
 * مكون مزود الملف الشخصي للمشرف
 */
export const SupervisorProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supervisorAPI.fetchSupervisorProfile();
      setProfile(data);
    } catch (err) {
      console.error('Error fetching supervisor profile:', err);
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
      const updatedProfile = await supervisorAPI.updateSupervisorProfile(profileData);
      setProfile(updatedProfile);
      return updatedProfile;
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
  }, []);

  // Update avatar
  const updateAvatar = useCallback(async (formData) => {
    try {
      const updatedData = await supervisorAPI.updateSupervisorProfileImage(formData);
      setProfile(prev => ({
        ...prev,
        profileImage: updatedData.profileImage
      }));
      return updatedData;
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
  }, []);

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
    <SupervisorProfileContext.Provider value={value}>
      {children}
    </SupervisorProfileContext.Provider>
  );
};

/**
 * Hook to use the supervisor profile context
 * هوك لاستخدام سياق الملف الشخصي للمشرف
 */
export const useSupervisorProfileContext = () => {
  const context = useContext(SupervisorProfileContext);
  if (context === undefined) {
    throw new Error('useSupervisorProfileContext must be used within a SupervisorProfileProvider');
  }
  return context;
};

export default SupervisorProfileProvider;