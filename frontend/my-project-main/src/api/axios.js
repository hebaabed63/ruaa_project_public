
import axios from 'axios';

// استخدام متغير البيئة للحصول على رابط API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // الوقت الأقصى للاستجابة 10 ثواني
  withCredentials: false, // قم بتغييرها إلى true إذا كنت تستخدم cookies للمصادقة
});
// إضافة التوكن تلقائيًا من localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Making API request:', config.method?.toUpperCase(), config.url);
  return config;
});

// إضافة interceptor للاستجابات
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export default api;
