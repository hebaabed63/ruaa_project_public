// =============================================================================
// UI Components Library for Parents Dashboard
// مكتبة مكونات واجهة المستخدم للداشبورد
// =============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaSpinner, 
  FaCheck, 
  FaExclamationTriangle, 
  FaInfo,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaSearch
} from 'react-icons/fa';

/**
 * بطاقة أساسية مع animations وتصميم متطور
 * Enhanced Card component with animations and modern design
 */
export const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  padding = 'p-6',
  shadow = 'shadow-card',
  rounded = 'rounded-2xl',
  background = 'bg-white',
  ...props 
}) => {
  return (
    <motion.div
      className={`
        ${background} ${rounded} ${shadow} ${padding} ${className}
        ${hover ? 'hover:shadow-card-hover transition-all duration-300' : ''}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * زر محسن مع animations وحالات متعددة
 * Enhanced Button component with animations and multiple states
 */
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  onClick,
  className = '',
  icon,
  iconPosition = 'left',
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    success: 'bg-success hover:bg-green-600 text-white',
    danger: 'bg-danger hover:bg-red-600 text-white',
    warning: 'bg-warning hover:bg-yellow-600 text-white',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white',
    ghost: 'text-primary-500 hover:bg-primary-50'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  return (
    <motion.button
      className={`
        ${variants[variant]} ${sizes[size]} 
        rounded-xl font-semibold transition-all duration-200 
        flex items-center justify-center gap-2
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading ? (
        <FaSpinner className="animate-spin" />
      ) : icon && iconPosition === 'left' ? (
        icon
      ) : null}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading && icon}
    </motion.button>
  );
};

/**
 * حقل إدخال محسن مع تصميم متطور
 * Enhanced Input component with modern design
 */
export const Input = ({ 
  label, 
  error, 
  hint,
  icon,
  iconPosition = 'right',
  className = '',
  containerClassName = '',
  required = false,
  ...props 
}) => {
  return (
    <motion.div 
      className={`space-y-2 ${containerClassName}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-danger mr-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}
        
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}
        
        <input
          className={`
            w-full px-4 py-3 border-2 border-gray-200 rounded-xl
            focus:border-primary-500 focus:ring-2 focus:ring-primary-200
            transition-all duration-200 text-right font-arabic
            ${error ? 'border-danger focus:border-danger focus:ring-red-200' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <motion.p 
          className="text-sm text-danger flex items-center gap-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaExclamationTriangle className="text-xs" />
          {error}
        </motion.p>
      )}
      
      {hint && !error && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}
    </motion.div>
  );
};

/**
 * قائمة منسدلة محسنة مع بحث
 * Enhanced Dropdown component with search functionality
 */
export const Dropdown = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'اختر من القائمة',
  searchable = false,
  className = '',
  error,
  label,
  required = false,
  ...props 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const dropdownRef = React.useRef(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-danger mr-1">*</span>}
        </label>
      )}
      
      <motion.button
        type="button"
        className={`
          w-full px-4 py-3 border-2 border-gray-200 rounded-xl
          focus:border-primary-500 focus:ring-2 focus:ring-primary-200
          transition-all duration-200 text-right font-arabic
          flex items-center justify-between
          ${error ? 'border-danger focus:border-danger focus:ring-red-200' : ''}
          ${isOpen ? 'border-primary-500 ring-2 ring-primary-200' : ''}
        `}
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.98 }}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown />
        </motion.div>
      </motion.button>

      {isOpen && (
        <motion.div
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {searchable && (
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-200 text-right"
                />
              </div>
            </div>
          )}
          
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  className={`
                    w-full px-4 py-3 text-right hover:bg-primary-50 transition-colors
                    flex items-center justify-between
                    ${option.value === value ? 'bg-primary-100 text-primary-700' : 'text-gray-700'}
                  `}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1, delay: index * 0.02 }}
                >
                  <span>{option.label}</span>
                  {option.value === value && <FaCheck className="text-primary-500" />}
                </motion.button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-center">
                لا توجد نتائج
              </div>
            )}
          </div>
        </motion.div>
      )}
      
      {error && (
        <motion.p 
          className="text-sm text-danger flex items-center gap-1 mt-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaExclamationTriangle className="text-xs" />
          {error}
        </motion.p>
      )}
    </div>
  );
};

/**
 * مكون Loading مع أنماط متعددة
 * Loading component with multiple styles
 */
export const Loading = ({ 
  type = 'spinner', 
  size = 'md', 
  text,
  className = '' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  if (type === 'spinner') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
        <motion.div
          className={`${sizes[size]} border-4 border-primary-200 border-t-primary-500 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "loop", ease: 'linear' }}
        />
        {text && <p className="text-gray-600 font-medium">{text}</p>}
      </div>
    );
  }

  if (type === 'dots') {
    return (
      <div className={`flex items-center justify-center space-x-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary-500 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "loop", delay: i * 0.2 }}
          />
        ))}
        {text && <p className="text-gray-600 font-medium mr-3">{text}</p>}
      </div>
    );
  }

  return null;
};

/**
 * تنبيهات مع أنواع مختلفة
 * Alert component with different types
 */
export const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  onClose, 
  className = '',
  showIcon = true 
}) => {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <FaCheck />
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <FaExclamationTriangle />
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: <FaExclamationTriangle />
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <FaInfo />
    }
  };

  const config = types[type];

  return (
    <motion.div
      className={`
        ${config.bg} ${config.border} ${config.text}
        border rounded-xl p-4 flex items-start gap-3 ${className}
      `}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      {showIcon && (
        <div className="flex-shrink-0 text-lg">
          {config.icon}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-bold mb-1">{title}</h4>
        )}
        <p className="text-sm">{message}</p>
      </div>
      
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-lg hover:opacity-75 transition-opacity"
        >
          <FaTimes />
        </button>
      )}
    </motion.div>
  );
};

/**
 * نموذج منبثق محسن
 * Enhanced Modal component
 */
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  className = '',
  showCloseButton = true,
  closeOnOverlay = true 
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={closeOnOverlay ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <motion.div
          className={`
            relative bg-white rounded-2xl shadow-xl w-full ${sizes[size]} ${className}
            max-h-[90vh] flex flex-col
          `}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              {title && (
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-xl transition-colors"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

/**
 * شريط تقدم محسن
 * Enhanced Progress Bar component
 */
export const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  className = '',
  showPercentage = true,
  color = 'primary',
  size = 'md',
  animated = true 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const colors = {
    primary: 'bg-primary-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500'
  };

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {showPercentage && (
        <div className="flex justify-between text-sm text-gray-600">
          <span>{percentage.toFixed(0)}%</span>
        </div>
      )}
      
      <div className={`bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          className={`${colors[color]} ${sizes[size]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.8 : 0, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

/**
 * Badge مع أنماط متعددة
 * Badge component with multiple styles
 */
export const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'sm',
  className = '' 
}) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      ${variants[variant]} ${sizes[size]} ${className}
    `}>
      {children}
    </span>
  );
};

/**
 * مكون العضو النائب (Skeleton Loader)
 * Skeleton Loader component
 */
export const Skeleton = ({ 
  className = '',
  width,
  height = '1rem',
  rounded = 'rounded' 
}) => {
  // Disabled animation to prevent errors
  return (
    <div
      className={`
        bg-gray-200 
        ${rounded} ${className}
      `}
      style={{ width, height }}
    />
  );
};

/**
 * مكون منطقة النص المحسن
 * Enhanced Textarea component
 */
export const TextArea = ({ 
  label, 
  error, 
  hint,
  icon,
  className = '',
  containerClassName = '',
  required = false,
  rows = 4,
  ...props 
}) => {
  return (
    <motion.div 
      className={`space-y-2 ${containerClassName}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-danger mr-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-start pt-3 pointer-events-none">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}
        
        <textarea
          rows={rows}
          className={`
            w-full px-4 py-3 border-2 border-gray-200 rounded-xl
            focus:border-primary-500 focus:ring-2 focus:ring-primary-200
            transition-all duration-200 text-right font-arabic resize-none
            ${error ? 'border-danger focus:border-danger focus:ring-red-200' : ''}
            ${icon ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <motion.p 
          className="text-sm text-danger flex items-center gap-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaExclamationTriangle className="text-xs" />
          {error}
        </motion.p>
      )}
      
      {hint && !error && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}
    </motion.div>
  );
};

/**
 * مكون قائمة الاختيار المحسن
 * Enhanced Select component
 */
export const Select = ({ 
  label,
  error,
  hint,
  className = '',
  containerClassName = '',
  required = false,
  children,
  ...props 
}) => {
  return (
    <motion.div 
      className={`space-y-2 ${containerClassName}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-danger mr-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          className={`
            w-full px-4 py-3 border-2 border-gray-200 rounded-xl
            focus:border-primary-500 focus:ring-2 focus:ring-primary-200
            transition-all duration-200 text-right font-arabic
            appearance-none bg-white
            ${error ? 'border-danger focus:border-danger focus:ring-red-200' : ''}
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaChevronDown className="text-gray-400" />
        </div>
      </div>
      
      {error && (
        <motion.p 
          className="text-sm text-danger flex items-center gap-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaExclamationTriangle className="text-xs" />
          {error}
        </motion.p>
      )}
      
      {hint && !error && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}
    </motion.div>
  );
};
