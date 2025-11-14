// =============================================================================
// API Services for Parents Dashboard
// وظائف استدعاء البيانات وإدارتها من الخادم
// =============================================================================

import axios from 'axios';
import { toast } from 'react-hot-toast';

/**
 * تكوين عام لطلبات API
 * Base configuration for API requests
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// اعتراض الطلبات لإضافة رمز المصادقة
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// اعتراض الاستجابات للتعامل مع الأخطاء
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    const errorMessage = handleAPIError(error);
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

/**
 * Handle API errors and return appropriate error messages
 * معالجة أخطاء API وإرجاع رسائل الخطأ المناسبة
 */
export const handleAPIError = (error) => {
  if (!error.response) {
    return 'Network error. Please check your connection.';
  }
  return error.response.data?.message || 'An unexpected error occurred.';
};

export default api;
