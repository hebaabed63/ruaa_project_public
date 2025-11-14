import React from 'react';
import { resetMockData } from './services/parentsApi';

const ResetData = () => {
  const handleReset = () => {
    resetMockData();
    alert('Mock data has been reset to defaults!');
  };

  return (
    <div className="p-4" dir="rtl">
      <h2 className="text-xl font-bold mb-4">Reset Mock Data</h2>
      <button 
        onClick={handleReset}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Reset Mock Data
      </button>
    </div>
  );
};

export default ResetData;