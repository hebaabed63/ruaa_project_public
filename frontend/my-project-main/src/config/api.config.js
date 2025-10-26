/**
 * API Configuration
 * ملف إعدادات الاتصال بالـ API
 */

// Base URL للباك إند - غيّر هذا حسب بيئة العمل
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// Timeout للطلبات (بالميلي ثانية)
const API_TIMEOUT = 30000; // 30 ثانية

// API Endpoints
export const API_ENDPOINTS = {
  // Schools endpoints
  SCHOOLS: {
    GET_ALL: '/schools',
    GET_BY_ID: (id) => `/schools/${id}`,
    GET_BEST: '/schools/best',
    GET_BY_REGION: '/schools/by-region',
    GET_RECENTLY_ADDED: '/schools/recent',
    SEARCH: '/schools/search',
    GET_STATISTICS: '/schools/statistics',
    GET_BEST_SCHOOLS: '/schools/best-schools',
  },

  // Ratings endpoints
  RATINGS: {
    GET_ALL: '/ratings',
    GET_BY_SCHOOL: (schoolId) => `/ratings/school/${schoolId}`,
    CREATE: '/ratings',
    GET_STATISTICS: '/ratings/statistics',
    GET_CRITERIA: '/ratings/criteria',
  },

  // Statistics endpoints
  STATISTICS: {
    GENERAL: '/statistics/general',
    DIRECTORATES: '/statistics/directorates',
  },

  // Contact endpoints
  CONTACT: {
    SEND: '/contact',
    GET_INFO: '/contact/info',
  },

  // Services endpoint
  SERVICES: '/services',

  // About page
  ABOUT: '/about',

  // FAQs
  FAQS: '/faqs',

  // Testimonials
  TESTIMONIALS: '/testimonials',

  // Updates/News
  UPDATES: '/updates',
};

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export default API_CONFIG;
