// =============================================================================
// Parent Profile Context for Parents Dashboard
// سياق الملف الشخصي لولي الأمر لداشبورد أولياء الأمور
// =============================================================================

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { parentsAPI } from '../services/parentsApi';

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
      const data = await parentsAPI.getParentProfile();
      setProfile(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching parent profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update profile data
  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await parentsAPI.updateParentProfile(profileData);
      if (response.success) {
        setProfile(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Update avatar
  const updateAvatar = useCallback(async (formData) => {
    try {
      const response = await parentsAPI.updateProfileImage(formData);
      if (response.success) {
        setProfile(prev => {
          const updatedProfile = { ...prev, profileImage: response.data.profileImage };
          return updatedProfile;
        });
        return response;
      } else {
        throw new Error(response.message || 'Failed to update avatar');
      }
    } catch (err) {
      setError(err.message);
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