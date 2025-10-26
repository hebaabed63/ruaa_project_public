/**
 * Axios Instance Configuration
 * إعداد Axios مع Interceptors للتعامل مع الطلبات والاستجابات
 */

import axios from 'axios';
import API_CONFIG from '../config/api.config';

// إنشاء Axios instance
const axiosInstance = axios.create({
  ...API_CONFIG,
  withCredentials: false, // سيتم تفعيله إذا استخدمت cookies
});

// Request Interceptor - يتم تنفيذه قبل إرسال أي طلب
axiosInstance.interceptors.request.use(
  (config) => {
    // إضافة التوكن إذا كان موجوداً (للطلبات المحمية)
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // إضافة اللغة
    config.headers['Accept-Language'] = 'ar';

    // طباعة معلومات الطلب في وضع التطوير
    if (process.env.NODE_ENV === 'development') {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - يتم تنفيذه بعد استلام الاستجابة
axiosInstance.interceptors.response.use(
  (response) => {
    // طباعة معلومات الاستجابة في وضع التطوير
    if (process.env.NODE_ENV === 'development') {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    // معالجة الأخطاء
    const errorResponse = {
      message: 'حدث خطأ غير متوقع',
      status: error.response?.status,
      data: error.response?.data,
    };

    // معالجة أنواع الأخطاء المختلفة
    if (error.response) {
      // الخادم أرجع استجابة بخطأ
      switch (error.response.status) {
        case 400:
          errorResponse.message = error.response.data?.message || 'بيانات غير صحيحة';
          break;
        case 401:
          errorResponse.message = 'غير مصرح لك بالوصول';
          // يمكن إضافة logout هنا
          // localStorage.removeItem('authToken');
          // window.location.href = '/login';
          break;
        case 403:
          errorResponse.message = 'ليس لديك صلاحية للوصول';
          break;
        case 404:
          errorResponse.message = 'المورد المطلوب غير موجود';
          break;
        case 500:
          errorResponse.message = 'خطأ في الخادم، يرجى المحاولة لاحقاً';
          break;
        case 503:
          errorResponse.message = 'الخدمة غير متاحة حالياً';
          break;
        default:
          errorResponse.message = error.response.data?.message || 'حدث خطأ في الاتصال';
      }
    } else if (error.request) {
      // الطلب تم إرساله لكن لم يتم استلام استجابة
      errorResponse.message = 'لا يمكن الاتصال بالخادم، تحقق من الاتصال بالإنترنت';
    } else {
      // خطأ في إعداد الطلب
      errorResponse.message = error.message || 'حدث خطأ في إعداد الطلب';
    }

    console.error('❌ API Error:', errorResponse);

    return Promise.reject(errorResponse);
  }
);

export default axiosInstance;
