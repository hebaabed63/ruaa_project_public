import React from 'react';
import NotificationsPage from './pages/NotificationsPage';

const TestNotifications = () => {
  return (
    <div className="p-4" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">اختبار صفحة الإشعارات</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <NotificationsPage />
      </div>
    </div>
  );
};

export default TestNotifications;