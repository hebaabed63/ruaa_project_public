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
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// ✅ Log the baseURL to verify configuration
console.log('🔗 Parents API Base URL:', api.defaults.baseURL);

// اعتراض الطلبات لإضافة رمز المصادقة
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // ✅ Log full URL to verify no duplication
    const fullURL = `${config.baseURL}${config.url}`;
    console.log('📡 Parents API Request:', config.method?.toUpperCase(), fullURL);
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

// =============================================================================
// Dashboard API Services
// خدمات API للوحة التحكم
// =============================================================================

/**
 * Get parent dashboard data (statistics, notifications, schools)
 * جلب بيانات لوحة التحكم الرئيسية
 */
export const getDashboardData = async () => {
  try {
    const response = await api.get('/parent/dashboard');
    return response;
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    throw error;
  }
};

// =============================================================================
// Profile API Services
// خدمات API للملف الشخصي
// =============================================================================

/**
 * Get parent profile data
 * جلب بيانات الملف الشخصي
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/parent/profile');
    return response;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
};

/**
 * Update parent profile
 * تحديث بيانات الملف الشخصي
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/parent/profile', profileData);
    toast.success('تم تحديث الملف الشخصي بنجاح');
    return response;
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
};

/**
 * Update parent avatar/profile image
 * تحديث صورة الملف الشخصي
 */
export const updateAvatar = async (formData) => {
  try {
    const response = await api.post('/parent/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success('تم تحديث الصورة بنجاح');
    return response;
  } catch (error) {
    console.error('Avatar update error:', error);
    throw error;
  }
};

// =============================================================================
// Schools API Services
// خدمات API للمدارس
// =============================================================================

/**
 * Get parent's schools (children's schools)
 * جلب مدارس الأبناء
 */
export const getSchools = async () => {
  try {
    const response = await api.get('/parent/schools');
    return response;
  } catch (error) {
    console.error('Schools fetch error:', error);
    throw error;
  }
};

/**
 * Get school evaluation criteria
 * جلب معايير تقييم المدارس
 */
export const getEvaluationCriteria = async () => {
  try {
    const response = await api.get('/parent/evaluation-criteria');
    return response;
  } catch (error) {
    console.error('Evaluation criteria fetch error:', error);
    throw error;
  }
};

/**
 * Get school evaluation by school ID
 * جلب تقييم مدرسة معينة
 */
export const getSchoolEvaluation = async (schoolId) => {
  try {
    const response = await api.get(`/parent/schools/${schoolId}/evaluation`);
    return response;
  } catch (error) {
    console.error('School evaluation fetch error:', error);
    throw error;
  }
};

/**
 * Submit school evaluation
 * إرسال تقييم مدرسة
 */
export const submitSchoolEvaluation = async (schoolId, evaluationData) => {
  try {
    const response = await api.post(`/parent/schools/${schoolId}/evaluation`, evaluationData);
    toast.success('تم إرسال التقييم بنجاح');
    return response;
  } catch (error) {
    console.error('School evaluation submit error:', error);
    throw error;
  }
};

// =============================================================================
// Complaints API Services
// خدمات API للشكاوى
// =============================================================================

/**
 * Get complaints metadata (categories, priorities, etc.)
 * جلب بيانات الشكاوى الوصفية
 */
export const getComplaintsMeta = async () => {
  try {
    const response = await api.get('/parent/complaints/meta');
    return response;
  } catch (error) {
    console.error('Complaints meta fetch error:', error);
    throw error;
  }
};

/**
 * Get parent's complaints
 * جلب شكاوى ولي الأمر
 */
export const getComplaints = async () => {
  try {
    const response = await api.get('/parent/complaints');
    return response;
  } catch (error) {
    console.error('Complaints fetch error:', error);
    throw error;
  }
};

/**
 * Submit a new complaint
 * إرسال شكوى جديدة
 */
export const submitComplaint = async (complaintData) => {
  try {
    const response = await api.post('/parent/complaints', complaintData);
    toast.success('تم إرسال الشكوى بنجاح');
    return response;
  } catch (error) {
    console.error('Complaint submit error:', error);
    throw error;
  }
};

// =============================================================================
// Notifications API Services
// خدمات API للإشعارات
// =============================================================================

/**
 * Get parent notifications
 * جلب إشعارات ولي الأمر
 */
export const getNotifications = async (params = {}) => {
  try {
    const response = await api.get('/parent/notifications', { params });
    return response;
  } catch (error) {
    console.error('Notifications fetch error:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 * تمييز الإشعار كمقروء
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/parent/notifications/${notificationId}/read`);
    return response;
  } catch (error) {
    console.error('Mark notification as read error:', error);
    throw error;
  }
};

// =============================================================================
// Reports API Services
// خدمات API للتقارير
// =============================================================================

/**
 * Get parent reports
 * جلب تقارير ولي الأمر
 */
export const getReports = async () => {
  try {
    const response = await api.get('/parent/reports');
    return response;
  } catch (error) {
    console.error('Reports fetch error:', error);
    throw error;
  }
};

// =============================================================================
// Settings API Services
// خدمات API للإعدادات
// =============================================================================

/**
 * Get parent settings
 * جلب إعدادات ولي الأمر
 */
export const getSettings = async () => {
  try {
    const response = await api.get('/parent/settings');
    return response;
  } catch (error) {
    console.error('Settings fetch error:', error);
    throw error;
  }
};

/**
 * Change password
 * تغيير كلمة المرور
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await api.post('/parent/settings/change-password', passwordData);
    toast.success('تم تغيير كلمة المرور بنجاح');
    return response;
  } catch (error) {
    console.error('Password change error:', error);
    throw error;
  }
};

/**
 * Update notification settings
 * تحديث إعدادات الإشعارات
 */
export const updateNotificationSettings = async (settingsData) => {
  try {
    const response = await api.put('/parent/settings/notifications', settingsData);
    toast.success('تم تحديث الإعدادات بنجاح');
    return response;
  } catch (error) {
    console.error('Notification settings update error:', error);
    throw error;
  }
};

export default api;
