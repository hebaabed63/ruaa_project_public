import React from 'react';
import SupervisorLinksManagement from '../../../admin/SupervisorLinksManagement';

const SupervisorLinksManagementPage = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">دعوات المشرفين</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          إدارة دعوات المشرفين في النظام
        </p>
      </div>
      <SupervisorLinksManagement />
    </div>
  );
};

export default SupervisorLinksManagementPage;