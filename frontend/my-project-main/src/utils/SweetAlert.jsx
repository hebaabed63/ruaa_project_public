import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// إعدادات أساسية للتصميم
const getAlertConfig = (type, message) => {
  const baseConfig = {
    title: message,
    showConfirmButton: false,
    timer: type === 'success' ? 2000 : 3500, // اختفاء تلقائي للنجاح
    timerProgressBar: true,
    toast: true, // عرض كـ toast notification
    position: 'top', // الظهور من الأعلى بالوسط
    customClass: {
      popup: "rounded-lg shadow-lg",
      title: "text-sm font-cairo"
    },
    backdrop: false,
    allowOutsideClick: true,
    allowEscapeKey: true
  };

  // تخصيص حسب النوع
  switch(type) {
    case 'success':
      return {
        ...baseConfig,
        icon: 'success',
        iconColor: '#22c55e'
      };
    case 'error':
      return {
        ...baseConfig,
        icon: 'error',
        iconColor: '#ef4444',
        timer: 4000
      };
    case 'warning':
      return {
        ...baseConfig,
        icon: 'warning',
        iconColor: '#f59e0b'
      };
    case 'info':
      return {
        ...baseConfig,
        icon: 'info',
        iconColor: '#3b82f6'
      };
    default:
      return {
        ...baseConfig,
        icon: type
      };
  }
};

// دالة عرض التنبيه العادية
export const showAlert = (type, message, text, showCancelButton) => {
  // If showCancelButton is true, treat this as a confirmation dialog
  if (showCancelButton) {
    return MySwal.fire({
      title: message,
      text: text,
      icon: type,
      showCancelButton: true,
      confirmButtonColor: '#4682B4',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، متأكد!',
      cancelButtonText: 'إلغاء',
      customClass: {
        popup: "rounded-xl shadow-2xl",
        title: "text-lg font-semibold font-cairo",
        content: "font-cairo",
        confirmButton: "rounded-lg px-6 py-2 font-cairo font-medium",
        cancelButton: "rounded-lg px-6 py-2 font-cairo font-medium"
      },
      toast: false, // Keep modals for confirmations
      position: 'center'
    });
  }
  
  // Otherwise, show a simple toast notification
  return MySwal.fire(getAlertConfig(type, message));
};

// دالة تنبيه التأكيد
export const showConfirmAlert = (title, text, onConfirm) => {
  MySwal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4682B4',
    cancelButtonColor: '#d33',
    confirmButtonText: 'نعم، متأكد!',
    cancelButtonText: 'إلغاء',
    customClass: {
      popup: "rounded-xl shadow-2xl",
      title: "text-lg font-semibold font-cairo",
      content: "font-cairo",
      confirmButton: "rounded-lg px-6 py-2 font-cairo font-medium",
      cancelButton: "rounded-lg px-6 py-2 font-cairo font-medium"
    },
    toast: false, // Keep modals for confirmations
    position: 'center'
  }).then((result) => {
    if (result.isConfirmed && onConfirm) {
      onConfirm();
    }
  });
};

// دالة التنبيه المبسط (للعمليات الناجحة السريعة)
export const showToast = (type, message) => {
  MySwal.fire({
    title: message,
    icon: type,
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    customClass: {
      popup: "rounded-lg shadow-lg",
      title: "text-sm font-cairo"
    }
  });
};
