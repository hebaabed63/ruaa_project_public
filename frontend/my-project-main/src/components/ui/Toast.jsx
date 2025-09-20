import React, { useState, useEffect } from 'react';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaTimesCircle,
  FaTimes 
} from 'react-icons/fa';

const Toast = ({ 
  type = 'info', 
  message = '', 
  duration = 4000, 
  onClose,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation
    setTimeout(() => setIsAnimating(true), 10);

    // Auto close
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const typeConfig = {
    success: {
      icon: FaCheckCircle,
      bgColor: 'bg-green-500',
      borderColor: 'border-green-500',
      textColor: 'text-green-800',
      lightBg: 'bg-green-50'
    },
    error: {
      icon: FaTimesCircle,
      bgColor: 'bg-red-500',
      borderColor: 'border-red-500',
      textColor: 'text-red-800',
      lightBg: 'bg-red-50'
    },
    warning: {
      icon: FaExclamationTriangle,
      bgColor: 'bg-yellow-500',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-800',
      lightBg: 'bg-yellow-50'
    },
    info: {
      icon: FaInfoCircle,
      bgColor: 'bg-blue-500',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-800',
      lightBg: 'bg-blue-50'
    }
  };

  const config = typeConfig[type] || typeConfig.info;
  const IconComponent = config.icon;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  return (
    <div
      className={`fixed z-50 ${positionClasses[position]} transition-all duration-300 ease-in-out transform ${
        isAnimating 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 -translate-y-2 scale-95'
      }`}
      style={{ direction: 'rtl' }}
    >
      <div className={`
        ${config.lightBg} ${config.borderColor} 
        border-r-4 rounded-lg shadow-lg min-w-80 max-w-96
        hover:shadow-xl transition-shadow duration-200
      `}>
        <div className="flex items-center p-4">
          <div className={`
            flex-shrink-0 w-8 h-8 ${config.bgColor} 
            rounded-full flex items-center justify-center mr-3
          `}>
            <IconComponent className="w-4 h-4 text-white" />
          </div>
          
          <div className={`flex-1 ${config.textColor} font-cairo`}>
            <p className="text-sm font-medium leading-5">
              {message}
            </p>
          </div>
          
          <button
            onClick={handleClose}
            className={`
              flex-shrink-0 mr-2 p-1 rounded-full
              ${config.textColor} hover:bg-gray-200 
              transition-colors duration-150
            `}
          >
            <FaTimes className="w-3 h-3" />
          </button>
        </div>
        
        {/* Progress bar */}
        {duration > 0 && (
          <div className="h-1 bg-gray-200 rounded-b-lg overflow-hidden">
            <div 
              className={`h-full ${config.bgColor} transition-all ease-linear`}
              style={{ 
                animation: `shrink ${duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Toast Container لإدارة التنبيهات المتعددة
const ToastContainer = ({ toasts = [], removeToast }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          style={{
            transform: `translateY(${index * 80}px)`
          }}
        >
          <Toast
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default Toast;
export { ToastContainer };
