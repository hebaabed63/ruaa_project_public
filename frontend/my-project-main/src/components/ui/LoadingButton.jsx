import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingButton = ({ 
  children, 
  loading = false, 
  size = 'md',
  spinnerSize = 'sm',
  className = '',
  disabled = false,
  ...props 
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      disabled={disabled || loading}
      className={`flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        loading ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90'
      } ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size={spinnerSize} className="mr-2" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;