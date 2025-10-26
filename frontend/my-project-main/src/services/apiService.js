/**
 * API Service - خدمة مركزية لجميع طلبات API
 * استخدم هذا الملف في جميع أنحاء التطبيق للتواصل مع Laravel Backend
 */

import axiosInstance from './axios.instance';
import { API_ENDPOINTS } from '../config/api.config';

/**
 * ============================================================================
 * Auth API - APIs المصادقة
 * ============================================================================
 */
export const authAPI = {
  // تسجيل مستخدم جديد
  register: (userData) => axiosInstance.post('/auth/register', userData),

  // تسجيل الدخول
  login: (credentials) => axiosInstance.post('/auth/login', credentials),

  // تسجيل الخروج
  logout: () => axiosInstance.post('/auth/logout'),

  // الحصول على بيانات المستخدم الحالي
  getCurrentUser: () => axiosInstance.get('/user'),

  // Google OAuth - إعادة التوجيه
  googleRedirect: () => axiosInstance.get('/auth/google'),

  // Google OAuth - معالجة Callback
  googleCallback: (code) => axiosInstance.get(`/auth/google/callback?code=${code}`),

  // تسجيل الدخول بـ Google (مباشرة من Frontend)
  loginWithGoogle: (tokenId) => axiosInstance.post('/auth/google/login', { token: tokenId }),

  // نسيت كلمة المرور
  forgotPassword: (email) => axiosInstance.post('/auth/forgot-password', { email }),

  // إعادة تعيين كلمة المرور
  resetPassword: (token, password, passwordConfirmation) =>
    axiosInstance.post(`/auth/reset-password/${token}`, {
      password,
      password_confirmation: passwordConfirmation,
    }),
};

/**
 * ============================================================================
 * Schools API - APIs المدارس
 * ============================================================================
 */
export const schoolsAPI = {
  // الحصول على جميع المدارس
  getAll: (params = {}) => axiosInstance.get(API_ENDPOINTS.SCHOOLS.GET_ALL, { params }),

  // الحصول على مدرسة واحدة بالـ ID
  getById: (id) => axiosInstance.get(API_ENDPOINTS.SCHOOLS.GET_BY_ID(id)),

  // أفضل المدارس
  getBest: (params = {}) => axiosInstance.get(API_ENDPOINTS.SCHOOLS.GET_BEST, { params }),

  // المدارس المضافة حديثاً
  getRecent: (params = {}) => axiosInstance.get(API_ENDPOINTS.SCHOOLS.GET_RECENTLY_ADDED, { params }),

  // البحث في المدارس
  search: (searchParams) => axiosInstance.get(API_ENDPOINTS.SCHOOLS.SEARCH, { params: searchParams }),

  // المدارس حسب المنطقة
  getByRegion: (region) => axiosInstance.get(API_ENDPOINTS.SCHOOLS.GET_BY_REGION, { params: { region } }),

  // الحصول على قائمة المناطق
  getRegions: () => axiosInstance.get('/schools/regions'),

  // إحصائيات المدارس
  getStatistics: () => axiosInstance.get(API_ENDPOINTS.SCHOOLS.GET_STATISTICS),

  // أفضل المدارس (الطريقة الجديدة)
  getBestSchools: () => axiosInstance.get(API_ENDPOINTS.SCHOOLS.GET_BEST_SCHOOLS),
};

/**
 * ============================================================================
 * Ratings API - APIs التقييمات
 * ============================================================================
 */
export const ratingsAPI = {
  // الحصول على جميع التقييمات
  getAll: (params = {}) => axiosInstance.get(API_ENDPOINTS.RATINGS.GET_ALL, { params }),

  // الحصول على تقييمات مدرسة معينة
  getBySchool: (schoolId) => axiosInstance.get(API_ENDPOINTS.RATINGS.GET_BY_SCHOOL(schoolId)),

  // إضافة تقييم جديد
  create: (ratingData) => axiosInstance.post(API_ENDPOINTS.RATINGS.CREATE, ratingData),

  // احصائيات التقييمات
  getStatistics: () => axiosInstance.get(API_ENDPOINTS.RATINGS.GET_STATISTICS),

  // الحصول على معايير التقييم
  getCriteria: () => axiosInstance.get(API_ENDPOINTS.RATINGS.GET_CRITERIA),
};

/**
 * ============================================================================
 * Statistics API - APIs الإحصائيات
 * ============================================================================
 */
export const statisticsAPI = {
  // إحصائيات عامة
  general: () => axiosInstance.get(API_ENDPOINTS.STATISTICS.GENERAL),

  // إحصائيات حسب المديريات
  directorates: () => axiosInstance.get(API_ENDPOINTS.STATISTICS.DIRECTORATES),
};

/**
 * ============================================================================
 * Contact API - API التواصل
 * ============================================================================
 */
export const contactAPI = {
  // إرسال رسالة تواصل
  send: (contactData) => axiosInstance.post(API_ENDPOINTS.CONTACT.SEND, contactData),

  // الحصول على معلومات التواصل
  getInfo: () => axiosInstance.get(API_ENDPOINTS.CONTACT.GET_INFO),
};

/**
 * ============================================================================
 * Services API - API الخدمات
 * ============================================================================
 */
export const servicesAPI = {
  // الحصول على جميع الخدمات
  getAll: () => axiosInstance.get(API_ENDPOINTS.SERVICES),
};

/**
 * ============================================================================
 * Content APIs - APIs المحتوى
 * ============================================================================
 */
export const contentAPI = {
  // صفحة من نحن
  about: () => axiosInstance.get(API_ENDPOINTS.ABOUT),

  // الأسئلة الشائعة
  faqs: () => axiosInstance.get(API_ENDPOINTS.FAQS),

  // شهادات المستخدمين
  testimonials: () => axiosInstance.get(API_ENDPOINTS.TESTIMONIALS),

  // التحديثات والأخبار
  updates: () => axiosInstance.get(API_ENDPOINTS.UPDATES),
};

/**
 * ============================================================================
 * Helper Functions - دوال مساعدة
 * ============================================================================
 */

// حفظ التوكن في localStorage
export const saveToken = (token) => {
  localStorage.setItem('authToken', token);
};

// الحصول على التوكن
export const getToken = () => {
  return localStorage.getItem('authToken') || localStorage.getItem('token');
};

// حذف التوكن
export const removeToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('token');
};

// التحقق من وجود مستخدم مسجل
export const isAuthenticated = () => {
  return !!getToken();
};

// تصدير axiosInstance للاستخدام المباشر إذا لزم الأمر
export { axiosInstance };

const apiServices = {
  auth: authAPI,
  schools: schoolsAPI,
  ratings: ratingsAPI,
  statistics: statisticsAPI,
  contact: contactAPI,
  services: servicesAPI,
  content: contentAPI,
};

export default apiServices;
