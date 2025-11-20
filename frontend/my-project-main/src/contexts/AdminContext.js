import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI } from '../services/adminAPI';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await adminAPI.getProfile();
        const userData = response.data.data;
        setProfile(userData);
      } catch (error) {
        console.error('Failed to fetch admin profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <AdminContext.Provider value={{ profile, loading, setProfile }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within AdminProvider');
  }
  return context;
};