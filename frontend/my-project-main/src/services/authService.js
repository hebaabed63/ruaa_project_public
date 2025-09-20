import api from "../api/axios";

// تسجيل الدخول
export const loginService = async (data) => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data; // إرجاع البيانات مباشرة
  } catch (error) {
    // إذا كان هناك رد من الخادم، نرجع رسالة الخطأ
    if (error.response && error.response.data) {
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
    return response.data;
  } catch (error) {
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
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل تسجيل الدخول بـ Google");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};
