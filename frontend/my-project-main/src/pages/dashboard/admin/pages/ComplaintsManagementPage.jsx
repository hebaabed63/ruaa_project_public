import React from 'react';
import ComplaintsManagement from '../../../admin/ComplaintsManagement';

const ComplaintsManagementPage = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة الشكاوى</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          إدارة الشكاوى في النظام
        </p>
      </div>
      <ComplaintsManagement />
    </div>
  );
};

export default ComplaintsManagementPage;