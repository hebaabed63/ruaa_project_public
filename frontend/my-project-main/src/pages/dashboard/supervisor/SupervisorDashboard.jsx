import React, { useState } from 'react';
import { 
  FaSchool, 
  FaExclamationTriangle, 
  FaClipboardCheck, 
  FaFileAlt, 
  FaPaperPlane,
  FaChartBar,
  FaCog,
  FaSearch,
  FaBell,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaDownload,
  FaFilter,
  FaStar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers
} from 'react-icons/fa';

const SupervisorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sample data for supervisor dashboard
  const statsData = [
    { title: 'المدارس المُشرف عليها', value: '12', change: '+2%', icon: FaSchool, color: 'bg-blue-500' },
    { title: 'الشكاوى المعلقة', value: '8', change: '+15%', icon: FaExclamationTriangle, color: 'bg-red-500' },
    { title: 'التقييمات المكتملة', value: '45', change: '+8%', icon: FaClipboardCheck, color: 'bg-green-500' },
    { title: 'التقارير الميدانية', value: '23', change: '+12%', icon: FaFileAlt, color: 'bg-yellow-500' }
  ];

  // Schools under supervision
  const supervisedSchools = [
    { id: 1, name: 'مدرسة النجاح الابتدائية', location: 'الرياض', students: 450, rating: 4.5, lastVisit: '2024-01-10', status: 'ممتاز' },
    { id: 2, name: 'مدرسة الأمل المتوسطة', location: 'جدة', students: 320, rating: 4.2, lastVisit: '2024-01-08', status: 'جيد جداً' },
    { id: 3, name: 'مدرسة المستقبل الثانوية', location: 'الدمام', students: 280, rating: 4.8, lastVisit: '2024-01-05', status: 'ممتاز' },
    { id: 4, name: 'مدرسة الفجر الابتدائية', location: 'الرياض', students: 380, rating: 3.9, lastVisit: '2024-01-03', status: 'جيد' },
    { id: 5, name: 'مدرسة الضياء المتوسطة', location: 'مكة', students: 290, rating: 4.1, lastVisit: '2024-01-01', status: 'جيد جداً' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent School Visits */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">الزيارات الميدانية الأخيرة</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                عرض الكل
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {supervisedSchools.slice(0, 3).map((school) => (
                <div key={school.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaSchool className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{school.name}</p>
                      <p className="text-xs text-gray-500">{school.location} • آخر زيارة: {school.lastVisit}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-sm text-gray-700 mr-1">{school.rating}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      school.status === 'ممتاز' ? 'bg-green-100 text-green-800' :
                      school.status === 'جيد جداً' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {school.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">إجراءات سريعة</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button 
                onClick={() => setActiveTab('schools')}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
              >
                <FaSchool />
                <span>إدارة المدارس</span>
              </button>
              <button 
                onClick={() => setActiveTab('complaints')}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 flex items-center space-x-2 space-x-reverse"
              >
                <FaExclamationTriangle />
                <span>مراجعة الشكاوى</span>
              </button>
              <button 
                onClick={() => setActiveTab('evaluations')}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 flex items-center space-x-2 space-x-reverse"
              >
                <FaClipboardCheck />
                <span>تقييم المدارس</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const sidebarItems = [
    { id: 'overview', label: 'نظرة عامة', icon: FaChartBar },
    { id: 'schools', label: 'المدارس المُشرف عليها', icon: FaSchool },
    { id: 'complaints', label: 'شكاوى أولياء الأمور', icon: FaExclamationTriangle },
    { id: 'evaluations', label: 'التقييمات الميدانية', icon: FaClipboardCheck },
    { id: 'reports', label: 'التقارير الميدانية', icon: FaFileAlt },
    { id: 'send-reports', label: 'إرسال التقارير', icon: FaPaperPlane },
    { id: 'settings', label: 'الإعدادات', icon: FaCog }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-cairo" dir="rtl">
      <div className="flex">
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 min-h-screen`}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">م</span>
              </div>
              {sidebarOpen && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900">لوحة المشرف</h2>
                  <p className="text-sm text-gray-500">المشرف التعليمي</p>
                </div>
              )}
            </div>
          </div>
          
          <nav className="mt-6">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 text-right hover:bg-gray-50 transition-colors ${
                  activeTab === item.id ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-600' : 'text-gray-700'
                }`}
              >
                <item.icon className="text-lg" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaCog className="text-lg" />
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {sidebarItems.find(item => item.id === activeTab)?.label}
                  </h1>
                </div>
                
                <div className="flex items-center space-x-4 space-x-reverse">
                  <button className="relative p-2 text-gray-500 hover:text-gray-700">
                    <FaBell className="text-lg" />
                    <span className="absolute top-0 left-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">م</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">محمد المشرف</p>
                      <p className="text-xs text-gray-500">مشرف تعليمي</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main className="p-6">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'schools' && <div><h2 className="text-xl font-bold">المدارس المُشرف عليها</h2><p className="mt-4">صفحة إدارة المدارس ستكون هنا</p></div>}
            {activeTab === 'complaints' && <div><h2 className="text-xl font-bold">شكاوى أولياء الأمور</h2><p className="mt-4">صفحة مراجعة الشكاوى ستكون هنا</p></div>}
            {activeTab === 'evaluations' && <div><h2 className="text-xl font-bold">التقييمات الميدانية</h2><p className="mt-4">صفحة التقييمات ستكون هنا</p></div>}
            {activeTab === 'reports' && <div><h2 className="text-xl font-bold">التقارير الميدانية</h2><p className="mt-4">صفحة التقارير ستكون هنا</p></div>}
            {activeTab === 'send-reports' && <div><h2 className="text-xl font-bold">إرسال التقارير</h2><p className="mt-4">صفحة إرسال التقارير ستكون هنا</p></div>}
            {activeTab === 'settings' && <div><h2 className="text-xl font-bold">الإعدادات</h2><p className="mt-4">صفحة الإعدادات ستكون هنا</p></div>}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
