let toastListeners = [];
let toasts = [];

// إضافة listener للتحديثات
export const addToastListener = (callback) => {
  toastListeners.push(callback);
};

// إزالة listener
export const removeToastListener = (callback) => {
  toastListeners = toastListeners.filter(listener => listener !== callback);
};

// إشعار جميع الـ listeners
const notifyListeners = () => {
  toastListeners.forEach(callback => callback([...toasts]));
};

// إضافة toast جديد
export const showToast = ({ 
  type = 'info', 
  message = '', 
  duration = 4000,
  position = 'top-right' 
}) => {
  const id = Date.now() + Math.random();
  const newToast = {
    id,
    type,
    message,
    duration,
    position
  };
  
  toasts.push(newToast);
  notifyListeners();
  
  return id;
};

// إزالة toast
export const removeToast = (id) => {
  toasts = toasts.filter(toast => toast.id !== id);
  notifyListeners();
};

// إزالة جميع التنبيهات
export const clearAllToasts = () => {
  toasts = [];
  notifyListeners();
};

// دوال مساعدة للأنواع المختلفة من التنبيهات
export const toast = {
  success: (message, options = {}) => showToast({ 
    type: 'success', 
    message, 
    duration: 3000,
    ...options 
  }),
  
  error: (message, options = {}) => showToast({ 
    type: 'error', 
    message, 
    duration: 5000,
    ...options 
  }),
  
  warning: (message, options = {}) => showToast({ 
    type: 'warning', 
    message, 
    duration: 4000,
    ...options 
  }),
  
  info: (message, options = {}) => showToast({ 
    type: 'info', 
    message, 
    duration: 4000,
    ...options 
  })
};

// Hook لاستخدام التنبيهات في React components
export const useToast = () => {
  return {
    showToast,
    removeToast,
    clearAllToasts,
    toast
  };
};
