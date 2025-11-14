// =============================================================================
// Admin Context for Admin Dashboard
// سياق الملف الشخصي للمدير لداشبورد المدير
// =============================================================================

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { fetchAdminProfile, updateAdminProfile, updateAdminProfileImage, changeAdminPassword } from '../services/adminApiService';

// Create the context
export const AdminContext = createContext(undefined);

/**
 * Admin Profile Provider Component
 * مكون مزود الملف الشخصي للمدير
 */
export const AdminProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdminProfile();
      setProfile(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching admin profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update profile data
  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await updateAdminProfile(profileData);
      setProfile(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Update avatar
  const updateAvatar = useCallback(async (formData) => {
    try {
      const response = await updateAdminProfileImage(formData);
      setProfile(prev => ({
        ...prev,
        profileImage: response.profileImage
      }));
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (passwordData) => {
    try {
      const response = await changeAdminPassword(passwordData);
      // Refresh the profile after password change to ensure consistency
      await fetchProfile();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchProfile]);

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
    changePassword,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

/**
 * Hook to use admin context
 * هوك لاستخدام سياق المدير
 */
export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
};