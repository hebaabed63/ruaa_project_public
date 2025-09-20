import React, { useState } from 'react';
import { 
  FaUsers, 
  FaCog, 
  FaFileAlt, 
  FaSchool as FaSchoolIcon,
  FaHome,
  FaChartLine,
  FaExclamationTriangle,
  FaClipboardCheck,
  FaUserTie,
  FaChalkboardTeacher,
  FaSave,
  FaServer,
  FaDatabase,
  FaCloudUploadAlt,
  FaDownload
} from 'react-icons/fa';

const SchoolManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sample data
  const statsData = [
    { title: 'إجمالي الطلاب', value: '1,245', change: '+12%', icon: FaUsers, color: 'bg-blue-500' },
    { title: 'إجمالي المعلمين', value: '68', change: '+5%', icon: FaChalkboardTeacher, color: 'bg-green-500' },
    { title: 'إجمالي الفصول', value: '32', change: '+3%', icon: FaClipboardCheck, color: 'bg-yellow-500' },
    { title: 'متوسط الحضور', value: '94%', change: '+2%', icon: FaUserTie, color: 'bg-purple-500' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} من الشهر الماضي
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setActiveTab('schools')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
            >
              <FaSchoolIcon />
              <span>إدارة المدرسة</span>
            </button>
            <button 
              onClick={() => setActiveTab('complaints')}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 flex items-center space-x-2 space-x-reverse"
            >
              <FaExclamationTriangle />
              <span>الشكاوى والتقييمات</span>
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 flex items-center space-x-2 space-x-reverse"
            >
              <FaFileAlt />
              <span>التقارير</span>
            </button>
          </div>
        </div>

        {/* School Info Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">معلومات المدرسة</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">اسم المدرسة:</span>
                <span className="font-medium">مدرسة النموذجية</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">المدير:</span>
                <span className="font-medium">سارة أحمد</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">النوع:</span>
                <span className="font-medium">ابتدائي</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">العام الدراسي:</span>
                <span className="font-medium">2024-2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">النشاط الأخير</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaUsers className="text-blue-600 text-sm" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">تسجيل طالب جديد</p>
                  <p className="text-xs text-gray-500">منذ ساعتين</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FaFileAlt className="text-green-600 text-sm" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">إرسال تقرير شهري</p>
                  <p className="text-xs text-gray-500">منذ يوم</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 text-right" dir="rtl">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-800 text-white transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex justify-between items-center border-b border-blue-700">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold">لوحة التحكم</h1>
          ) : (
            <div className="w-8 h-8"></div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            {sidebarOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
        <nav className="mt-6">
          <div>
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center px-6 py-3 text-right transition-colors duration-200 ${activeTab === 'overview' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
            >
              <FaHome className="ml-3" />
              {sidebarOpen && <span className="mr-2">نظرة عامة</span>}
            </button>
            <button
              onClick={() => setActiveTab('schools')}
              className={`w-full flex items-center px-6 py-3 text-right transition-colors duration-200 ${activeTab === 'schools' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
            >
              <FaSchoolIcon className="ml-3" />
              {sidebarOpen && <span className="mr-2">المدرسة</span>}
            </button>
            <button
              onClick={() => setActiveTab('complaints')}
              className={`w-full flex items-center px-6 py-3 text-right transition-colors duration-200 ${activeTab === 'complaints' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
            >
              <FaExclamationTriangle className="ml-3" />
              {sidebarOpen && <span className="mr-2">الشكاوى</span>}
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`w-full flex items-center px-6 py-3 text-right transition-colors duration-200 ${activeTab === 'performance' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
            >
              <FaChartLine className="ml-3" />
              {sidebarOpen && <span className="mr-2">الأداء</span>}
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center px-6 py-3 text-right transition-colors duration-200 ${activeTab === 'reports' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
            >
              <FaFileAlt className="ml-3" />
              {sidebarOpen && <span className="mr-2">التقارير</span>}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center px-6 py-3 text-right transition-colors duration-200 ${activeTab === 'settings' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
            >
              <FaCog className="ml-3" />
              {sidebarOpen && <span className="mr-2">الإعدادات</span>}
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {activeTab === 'overview' && 'نظرة عامة'}
                {activeTab === 'schools' && 'المدرسة'}
                {activeTab === 'complaints' && 'الشكاوى'}
                {activeTab === 'performance' && 'الأداء'}
                {activeTab === 'reports' && 'التقارير'}
                {activeTab === 'settings' && 'الإعدادات'}
              </h2>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none">
                <FaCog className="text-xl" />
              </button>
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  س
                </div>
                {sidebarOpen && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">سارة أحمد</p>
                    <p className="text-xs text-gray-500">مدير المدرسة</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'schools' && <div><h2 className="text-xl font-bold">المدرسة</h2><p className="mt-4">معلومات المدرسة ستظهر هنا</p></div>}
          {activeTab === 'complaints' && <div><h2 className="text-xl font-bold">الشكاوى والتقييمات</h2><p className="mt-4">قسم الشكاوى والتقييمات سيتم إضافته قريباً</p></div>}
          {activeTab === 'performance' && <div><h2 className="text-xl font-bold">أداء الطلاب</h2><p className="mt-4">إحصائيات أداء الطلاب ستظهر هنا</p></div>}
          {activeTab === 'reports' && <div><h2 className="text-xl font-bold">التقارير</h2><p className="mt-4">قسم التقارير سيتم إضافته قريباً</p></div>}
          {activeTab === 'settings' && <div><h2 className="text-xl font-bold">الإعدادات</h2><p className="mt-4">صفحة الإعدادات ستكون هنا</p></div>}
        </main>
      </div>
    </div>
  );
};

export default SchoolManagerDashboard;
