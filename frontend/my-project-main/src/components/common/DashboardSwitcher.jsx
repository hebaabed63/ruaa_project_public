import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaExchangeAlt, 
  FaUsers, 
  FaSchool, 
  FaChalkboardTeacher, 
  FaChild,
  FaTimes
} from 'react-icons/fa';

const DashboardSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const dashboards = [
    {
      id: 'admin',
      name: 'لوحة المدير',
      description: 'إدارة شاملة للنظام',
      icon: FaUsers,
      path: '/dashboard/admin',
      color: 'bg-purple-600'
    },
    {
      id: 'supervisor',
      name: 'لوحة المشرف',
      description: 'مراقبة وتقييم المدارس',
      icon: FaChalkboardTeacher,
      path: '/dashboard/supervisor',
      color: 'bg-blue-600'
    },
    {
      id: 'school-manager',
      name: 'لوحة مدير المدرسة',
      description: 'إدارة المدرسة والطلاب',
      icon: FaSchool,
      path: '/dashboard/school-manager',
      color: 'bg-green-600'
    },
    {
      id: 'parent',
      name: 'لوحة ولي الأمر',
      description: 'متابعة الأطفال والمدارس',
      icon: FaChild,
      path: '/dashboard/parents',
      color: 'bg-orange-600'
    }
  ];

  const handleDashboardSwitch = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Dashboard Switcher Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 z-50 group"
        title="تبديل لوحة التحكم"
      >
        <FaExchangeAlt className="text-xl group-hover:rotate-180 transition-transform duration-300" />
      </button>

      {/* Dashboard Switcher Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">اختر لوحة التحكم</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboards.map((dashboard) => (
                  <div
                    key={dashboard.id}
                    onClick={() => handleDashboardSwitch(dashboard.path)}
                    className="group cursor-pointer bg-gray-50 rounded-lg p-6 border-2 border-transparent hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4 space-x-reverse mb-4">
                      <div className={`${dashboard.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                        <dashboard.icon className="text-white text-2xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {dashboard.name}
                        </h3>
                        <p className="text-sm text-gray-600">{dashboard.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">انقر للانتقال</span>
                      <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs group-hover:bg-blue-700 transition-colors">
                        انتقال
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">ملاحظة للتطوير</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      هذه الأداة مخصصة لأغراض التطوير والاختبار فقط. في الإنتاج، سيتم توجيه المستخدمين تلقائياً حسب صلاحياتهم.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardSwitcher;