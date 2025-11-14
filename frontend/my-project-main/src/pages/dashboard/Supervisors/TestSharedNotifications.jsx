import React from 'react';
import SharedNotifications from './components/SharedNotifications';

const TestSharedNotifications = () => {
  return (
    <div className="p-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">اختبار المكون المشترك للإشعارات</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">نمط القائمة المنسدلة</h2>
          <div className="border border-gray-200 rounded-lg p-4 max-w-xs">
            <SharedNotifications 
              variant="dropdown"
              maxItems={5}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">نمط الصفحة الكاملة</h2>
          <div className="border border-gray-200 rounded-lg p-4">
            <SharedNotifications 
              variant="page"
              showFilters={true}
              showSearch={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSharedNotifications;