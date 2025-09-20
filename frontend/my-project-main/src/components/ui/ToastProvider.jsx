import React, { useState, useEffect } from 'react';
import { ToastContainer } from './Toast';
import { addToastListener, removeToastListener, removeToast } from '../../utils/toastManager';

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // إضافة listener للتحديثات
    const handleToastsUpdate = (updatedToasts) => {
      setToasts(updatedToasts);
    };

    addToastListener(handleToastsUpdate);

    // تنظيف عند الإلغاء
    return () => {
      removeToastListener(handleToastsUpdate);
    };
  }, []);

  return (
    <>
      {children}
      <ToastContainer
        toasts={toasts}
        removeToast={removeToast}
      />
      
      {/* إضافة CSS للـ animations */}
      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        .toast-enter {
          animation: slideInRight 0.3s ease-out;
        }
        
        .toast-exit {
          animation: slideOutRight 0.3s ease-in;
        }
      `}</style>
    </>
  );
};

export default ToastProvider;
