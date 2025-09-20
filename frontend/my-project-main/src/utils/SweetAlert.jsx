import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// إعدادات أساسية للتصميم
const getAlertConfig = (type, message) => {
  const baseConfig = {
    title: message,
    confirmButtonColor: "#4682B4",
    cancelButtonColor: "#d33",
    showConfirmButton: true,
    timer: type === 'success' ? 2000 : 3500, // اختفاء تلقائي للنجاح
    timerProgressBar: true,
    toast: false, // عرض كـ popup وليس toast
    position: 'center',
    customClass: {
      popup: "rounded-xl shadow-2xl",
      title: "text-lg font-semibold font-cairo",
      confirmButton: "rounded-lg px-6 py-2 font-cairo font-medium",
      cancelButton: "rounded-lg px-6 py-2 font-cairo font-medium"
    },
    backdrop: `rgba(0,0,0,0.4)`,
    allowOutsideClick: true,
    allowEscapeKey: true
  };

  // تخصيص حسب النوع
  switch(type) {
    case 'success':
      return {
        ...baseConfig,
        icon: 'success',
        iconColor: '#22c55e',
        confirmButtonText: 'رائع!'
      };
    case 'error':
      return {
        ...baseConfig,
        icon: 'error',
        iconColor: '#ef4444',
        confirmButtonText: 'حسناً',
        timer: 4000
      };
    case 'warning':
      return {
        ...baseConfig,
        icon: 'warning',
        iconColor: '#f59e0b',
        confirmButtonText: 'فهمت'
      };
    case 'info':
      return {
        ...baseConfig,
        icon: 'info',
        iconColor: '#3b82f6',
        confirmButtonText: 'موافق'
      };
    default:
      return {
        ...baseConfig,
        icon: type,
        confirmButtonText: 'موافق'
      };
  }
};

// دالة عرض التنبيه العادية
export const showAlert = (type, message) => {
  MySwal.fire(getAlertConfig(type, message));
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
    }
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
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    customClass: {
      popup: "rounded-lg shadow-lg",
      title: "text-sm font-cairo"
    }
  });
};
