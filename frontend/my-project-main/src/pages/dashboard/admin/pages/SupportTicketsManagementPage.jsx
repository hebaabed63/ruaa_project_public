import React from 'react';
import SupportTicketsManagement from '../../../admin/SupportTicketsManagement';

const SupportTicketsManagementPage = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">الدعم الفني</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          إدارة طلبات الدعم الفني في النظام
        </p>
      </div>
      <SupportTicketsManagement />
    </div>
  );
};

export default SupportTicketsManagementPage;