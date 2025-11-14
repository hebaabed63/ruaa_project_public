import React from 'react';
import SchoolsManagement from '../../../admin/SchoolsManagement';

const SchoolsManagementPage = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة المدارس</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          إدارة جميع المدارس في النظام
        </p>
      </div>
      <SchoolsManagement />
    </div>
  );
};

export default SchoolsManagementPage;