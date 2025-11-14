import React, { useState } from 'react';
import LoadingButton from './ui/LoadingButton';

const TestLoadingButton = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Loading Button Demo</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Small Button</h2>
          <LoadingButton 
            size="sm" 
            loading={loading} 
            onClick={handleClick}
            className="bg-blue-600 text-white"
          >
            Click Me
          </LoadingButton>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Medium Button (Default)</h2>
          <LoadingButton 
            loading={loading} 
            onClick={handleClick}
            className="bg-green-600 text-white"
          >
            Submit Form
          </LoadingButton>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Large Button</h2>
          <LoadingButton 
            size="lg" 
            loading={loading} 
            onClick={handleClick}
            className="bg-purple-600 text-white"
          >
            Process Data
          </LoadingButton>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Custom Styling</h2>
          <LoadingButton 
            loading={loading} 
            onClick={handleClick}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-2 border-blue-700"
          >
            Gradient Button
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default TestLoadingButton;