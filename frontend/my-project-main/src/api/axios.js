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
  withCredentials: true, // قم بتغييرها إلى true إذا كنت تستخدم cookies للمصادقة
});

// Function to fetch CSRF cookie
const fetchCSRFCookie = async () => {
  try {
    await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
      withCredentials: true
    });
  } catch (error) {
    console.error('Failed to fetch CSRF cookie:', error);
  }
};

// Fetch CSRF cookie on initial load
fetchCSRFCookie();

// إضافة التوكن تلقائيًا من localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  console.log('Axios interceptor - Token from localStorage:', token ? 'Present' : 'Missing');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Axios interceptor - Token added to request headers');
  } else {
    console.log('Axios interceptor - No token found in localStorage');
  }
  console.log('Making API request:', config.method?.toUpperCase(), config.url);
  return config;
}, (error) => {
  return Promise.reject(error);
});

// إضافة interceptor للاستجابات
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  async (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });
    
    // If it's a CSRF token mismatch error, fetch a new CSRF cookie and retry
    if (error.response?.status === 419) {
      console.log('CSRF token mismatch, fetching new CSRF cookie...');
      await fetchCSRFCookie();
      
      // Retry the request
      if (error.config) {
        return api.request(error.config);
      }
    }
    
    // If it's an authentication error (401), logout the user
    if (error.response?.status === 401) {
      // Only logout if we're not already on the login page
      if (window.location.pathname !== '/login') {
        // Clear localStorage and redirect to login
        localStorage.removeItem("auth_token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        localStorage.removeItem("user_avatar");
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;