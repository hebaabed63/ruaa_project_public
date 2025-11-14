import React, { useState } from 'react';
import LoadingSpinner from './ui/LoadingSpinner';

const TestLoadingSpinner = () => {
  const [isLoading, setIsLoading] = useState(false);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Loading Spinner Demo</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
          <h3 className="mb-2 font-medium">Small</h3>
          <LoadingSpinner size="sm" />
        </div>
        
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
          <h3 className="mb-2 font-medium">Medium</h3>
          <LoadingSpinner size="md" />
        </div>
        
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
          <h3 className="mb-2 font-medium">Large</h3>
          <LoadingSpinner size="lg" />
        </div>
        
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
          <h3 className="mb-2 font-medium">Extra Large</h3>
          <LoadingSpinner size="xl" />
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        <button
          onClick={simulateLoading}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {isLoading ? 'Loading...' : 'Show Loading Spinner'}
        </button>
        
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <LoadingSpinner size="xl" />
          </div>
        )}
      </div>
      
      <div className="mt-10 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Usage Instructions</h2>
        <ul className="list-disc pr-5 space-y-2 text-gray-700">
          <li>Import the component: <code className="bg-gray-200 px-2 py-1 rounded">import LoadingSpinner from './ui/LoadingSpinner'</code></li>
          <li>Use with different sizes: <code className="bg-gray-200 px-2 py-1 rounded">{'<LoadingSpinner size="md" />'}</code></li>
          <li>Available sizes: sm, md, lg, xl</li>
          <li>Add custom classes: <code className="bg-gray-200 px-2 py-1 rounded">{'<LoadingSpinner className="my-4" />'}</code></li>
        </ul>
      </div>
    </div>
  );
};

export default TestLoadingSpinner;