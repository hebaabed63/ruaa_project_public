// src/pages/dashboard/admin/contexts/AdminContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// إنشاء خدمة محلية بديلة
const adminService = {
  getAdminProfile: async () => {
    // محاكاة API call
    return {
      success: true,
      data: {
        id: 1,
        fullName: 'مدير النظام',
        email: 'admin@system.com',
        phone: '+966501234567',
        address: 'الرياض، المملكة العربية السعودية',
        profileImage: null,
        dateJoined: '2024-01-01',
        status: 'active'
      }
    };
  },
  
  updateAdminProfile: async (profileData) => {
    // محاكاة تحديث البروفايل
    return {
      success: true,
      data: profileData
    };
  },
  
  updateAdminAvatar: async (formData) => {
    // محاكاة رفع الصورة
    return {
      success: true,
      data: {
        profileImage: 'https://via.placeholder.com/150'
      }
    };
  }
};

const AdminContext = createContext();

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب بيانات البروفايل
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getAdminProfile();
      if (response.success) {
        setProfile(response.data);
      } else {
        setError(response.message || 'فشل في جلب البيانات');
      }
    } catch (err) {
      setError(err.message || 'حدث خطأ في جلب البيانات');
      console.error('Error fetching admin profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // تحديث بيانات البروفايل
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await adminService.updateAdminProfile(profileData);
      if (response.success) {
        setProfile(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'فشل في تحديث البيانات');
      }
    } catch (err) {
      setError(err.message || 'حدث خطأ في تحديث البيانات');
      throw err;
    }
  };

  // تحديث الصورة الشخصية
  const updateAvatar = async (formData) => {
    try {
      setError(null);
      const response = await adminService.updateAdminAvatar(formData);
      if (response.success) {
        setProfile(prev => ({
          ...prev,
          profileImage: response.data.profileImage
        }));
        return response.data;
      } else {
        throw new Error(response.message || 'فشل في تحديث الصورة');
      }
    } catch (err) {
      setError(err.message || 'حدث خطأ في تحديث الصورة');
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const value = {
    profile,
    loading,
    error,
    updateProfile,
    updateAvatar,
    refreshProfile: fetchProfile
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};