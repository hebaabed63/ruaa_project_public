import React from 'react';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          عذراً، حدث خطأ غير متوقع
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {error?.message || 'حدث خطأ أثناء تحميل الصفحة'}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          إعادة تحميل الصفحة
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
