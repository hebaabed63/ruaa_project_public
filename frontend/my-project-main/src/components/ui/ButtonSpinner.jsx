import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const ButtonSpinner = ({ size = 'sm', className = '' }) => {
  const sizeMap = {
    xs: 'sm',
    sm: 'sm',
    md: 'md',
    lg: 'md'
  };

  return (
    <div className={className}>
      <LoadingSpinner size={sizeMap[size]} />
    </div>
  );
};

export default ButtonSpinner;
