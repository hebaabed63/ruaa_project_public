import React from 'react';

const Loading = ({ type = 'spinner', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const spinnerClasses = `${sizeClasses[size]} border-2 border-gray-200 border-t-primary-500 rounded-full animate-spin ${className}`;

  if (type === 'spinner') {
    return (
      <div className="flex items-center justify-center">
        <div className={spinnerClasses}></div>
      </div>
    );
  }

  if (type === 'dots') {
    return (
      <div className="flex space-x-1 space-x-reverse">
        <div className={`w-2 h-2 bg-primary-500 rounded-full animate-bounce ${className}`}></div>
        <div className={`w-2 h-2 bg-primary-500 rounded-full animate-bounce ${className}`} style={{ animationDelay: '0.2s' }}></div>
        <div className={`w-2 h-2 bg-primary-500 rounded-full animate-bounce ${className}`} style={{ animationDelay: '0.4s' }}></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className={spinnerClasses}></div>
    </div>
  );
};

export default Loading;