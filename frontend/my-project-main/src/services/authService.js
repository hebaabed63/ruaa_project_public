import api from "../api/axios";

// Get current user data
export const getCurrentUser = async (token = null) => {
  try {
    // If token is provided, set it in the headers
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب بيانات المستخدم");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// تسجيل الدخول
export const loginService = async (data) => {
  try {
    console.log('Attempting login with data:', data);
    const response = await api.post("/auth/login", data);
    console.log('Login response:', response);
    
    // Store token in localStorage with the correct key
    if (response.data.success && response.data.data.token) {
      localStorage.setItem("auth_token", response.data.data.token);
      console.log('Token stored in localStorage with key: auth_token');
    }
    
    return response.data; // إرجاع البيانات مباشرة
  } catch (error) {
    console.log('Login error caught:', error);
    // إذا كان هناك رد من الخادم، نرجع رسالة الخطأ
    if (error.response && error.response.data) {
      // Handle specific status cases
      if (error.response.status === 403) {
        const responseData = error.response.data;
        if (responseData.data && responseData.data.status === 'pending') {
          // For supervisors, we still allow login but show a warning
          if (responseData.data.role === 'supervisor') {
            // Return the data for pending supervisors to allow login
            throw new Error({
              message: 'حسابك قيد انتظار موافقة الإدارة. يمكنك الوصول إلى لوحة التحكم الخاصة بك.',
              response: {
                data: responseData
              }
            });
          } else {
            throw new Error('حسابك قيد انتظار موافقة الإدارة. سيتم إعلامك عند الموافقة على حسابك.');
          }
        } else if (responseData.data && responseData.data.status === 'suspended') {
          throw new Error('حسابك موقوف. يرجى التواصل مع الإدارة للمساعدة.');
        }
      }
      throw new Error(error.response.data.message || "فشل تسجيل الدخول");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// تسجيل جديد
export const registerService = async (data) => {
  try {
    const response = await api.post("/auth/register", data);
    console.log('Raw API Response:', response); // للمراقبة
    
    // Store token in localStorage with the correct key
    if (response.data.success && response.data.data.token) {
      localStorage.setItem("auth_token", response.data.data.token);
      console.log('Token stored in localStorage with key: auth_token');
    }
    
    return response.data; // إرجاع البيانات مباشرة
  } catch (error) {
    console.error('Registration API Error:', error); // للمراقبة
    // إذا كان هناك رد من الخادم، نرجع رسالة الخطأ
    if (error.response && error.response.data) {
      const errorMsg = error.response.data.message || error.response.data.errors || "فشل التسجيل";
      throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// تسجيل الخروج
export const logoutService = async () => {
  try {
    const response = await api.post("/auth/logout");
    
    // Remove token from localStorage
    localStorage.removeItem("auth_token");
    console.log('Token removed from localStorage');
    
    return response.data;
  } catch (error) {
    // Remove token from localStorage even if logout fails
    localStorage.removeItem("auth_token");
    console.log('Token removed from localStorage (logout failed)');
    
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل تسجيل الخروج");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// طلب رابط إعادة تعيين كلمة المرور
export const forgotPasswordService = async (data) => {
  try {
    const response = await api.post("/auth/forgot-password", data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل إرسال رابط الاستعادة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// إعادة تعيين كلمة المرور باستخدام التوكن
export const resetPasswordService = async (token, data) => {
  try {
    const response = await api.post(`/auth/reset-password/${token}`, data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل تغيير كلمة المرور");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// تسجيل الدخول بـ Google (توجيه للـ Google OAuth)
export const loginWithGoogleRedirect = () => {
  try {
    // توجيه المستخدم إلى Google OAuth
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/auth/google`;
  } catch (error) {
    throw new Error("خطأ في تسجيل الدخول بـ Google");
  }
};

// تسجيل الدخول بـ Google باستخدام Google ID Token (Client-side)
export const loginWithGoogleCredential = async (credential) => {
  try {
    const response = await api.post("/auth/google/login", {
      credential: credential
    });
    
    // Store token in localStorage with the correct key
    if (response.data.success && response.data.data.token) {
      localStorage.setItem("auth_token", response.data.data.token);
      console.log('Token stored in localStorage with key: auth_token');
    }
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل تسجيل الدخول بـ Google");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// معالجة callback من Google (للاستخدام في صفحة callback)
export const handleGoogleCallback = async (code) => {
  try {
    const response = await api.get(`/auth/google/callback?code=${code}`);
    
    // Store token in localStorage with the correct key
    if (response.data.success && response.data.data.token) {
      localStorage.setItem("auth_token", response.data.data.token);
      console.log('Token stored in localStorage with key: auth_token');
    }
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل تسجيل الدخول بـ Google");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// ===========================================
// Token-based Registration Services
// ===========================================

// التحقق من صحة رابط التسجيل
export const validateRegistrationToken = async (token) => {
  try {
    const response = await api.get(`/auth/validate-token/${token}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "رابط التسجيل غير صالح");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// تسجيل مشرف جديد
export const registerSupervisor = async (data) => {
  try {
    const response = await api.post("/auth/register-supervisor", data);
    
    // Store token in localStorage with the correct key
    if (response.data.success && response.data.data.token) {
      localStorage.setItem("auth_token", response.data.data.token);
      console.log('Token stored in localStorage with key: auth_token');
    }
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMsg = error.response.data.message || error.response.data.errors || "فشل تسجيل المشرف";
      throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// تسجيل مدير مدرسة جديد
export const registerPrincipal = async (data) => {
  try {
    const response = await api.post("/auth/register-principal", data);
    
    // Store token in localStorage with the correct key
    if (response.data.success && response.data.data.token) {
      localStorage.setItem("auth_token", response.data.data.token);
      console.log('Token stored in localStorage with key: auth_token');
    }
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMsg = error.response.data.message || error.response.data.errors || "فشل تسجيل مدير المدرسة";
      throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};