import React, { useState } from 'react';
import DashboardSwitcher from '../../../components/common/DashboardSwitcher';
import { 
  FaSchool, 
  FaExclamationTriangle, 
  FaCog,
  FaSearch,
  FaStar,
  FaUsers,
  FaHome,
  FaMapMarkerAlt,
  FaHeart,
  FaBalanceScale,
  FaUserCircle,
  FaFilter,
  FaEye,
  FaPlus,
  FaPaperPlane,
  FaBars,
  FaTimes,
  FaBell,
  FaClipboardCheck
} from 'react-icons/fa';
import usePageTitle from '../../../hooks/usePageTitle';

const ParentsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Set page title based on active tab
  usePageTitle(getPageTitle(activeTab));

  // Function to get page title based on active tab
  function getPageTitle(tab) {
    switch (tab) {
      case 'overview':
        return 'نظرة عامة';
      case 'search':
        return 'البحث عن مدارس';
      case 'complaints':
        return 'الشكاوى';
      case 'ratings':
        return 'التقييمات';
      case 'comparison':
        return 'مقارنة المدارس';
      case 'settings':
        return 'الإعدادات';
      default:
        return 'لوحة أولياء الأمور';
    }
  }

  // Sample data for parents dashboard
  const statsData = [
    { title: 'المدارس المفضلة', value: '5', change: '+2', icon: FaHeart, color: 'bg-red-500' },
    { title: 'الشكاوى المقدمة', value: '3', change: '+1', icon: FaExclamationTriangle, color: 'bg-orange-500' },
    { title: 'التقييمات المقدمة', value: '8', change: '+3', icon: FaStar, color: 'bg-yellow-500' },
    { title: 'المدارس المقارنة', value: '4', change: '+1', icon: FaBalanceScale, color: 'bg-blue-500' }
  ];

  // Available schools data
  const schoolsData = [
    { 
      id: 1, 
      name: 'مدرسة النجاح الابتدائية', 
      location: 'الرياض - حي النرجس', 
      type: 'ابتدائي', 
      students: 450, 
      teachers: 18, 
      overallRating: 4.5,
      educationQuality: 4.6,
      facilities: 4.3,
      environment: 4.7,
      fees: '15000 ريال/سنة',
      distance: '2.5 كم',
      reviews: 127,
      image: '/images/school1.jpg'
    },
    { 
      id: 2, 
      name: 'مدرسة الأمل المتوسطة', 
      location: 'الرياض - حي الملقا', 
      type: 'متوسط', 
      students: 320, 
      teachers: 15, 
      overallRating: 4.2,
      educationQuality: 4.3,
      facilities: 4.0,
      environment: 4.4,
      fees: '18000 ريال/سنة',
      distance: '3.2 كم',
      reviews: 89,
      image: '/images/school2.jpg'
    },
    { 
      id: 3, 
      name: 'مدرسة المستقبل الثانوية', 
      location: 'الرياض - حي العليا', 
      type: 'ثانوي', 
      students: 280, 
      teachers: 20, 
      overallRating: 4.8,
      educationQuality: 4.9,
      facilities: 4.7,
      environment: 4.8,
      fees: '22000 ريال/سنة',
      distance: '4.1 كم',
      reviews: 156,
      image: '/images/school3.jpg'
    }
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
                <p className="text-sm text-green-600">
                  {stat.change} هذا الشهر
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
              onClick={() => setActiveTab('search')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
            >
              <FaSearch />
              <span>البحث عن مدارس</span>
            </button>
            <button 
              onClick={() => setActiveTab('complaints')}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 flex items-center space-x-2 space-x-reverse"
            >
              <FaExclamationTriangle />
              <span>تقديم شكوى</span>
            </button>
            <button 
              onClick={() => setActiveTab('ratings')}
              className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 flex items-center space-x-2 space-x-reverse"
            >
              <FaStar />
              <span>تقييم مدرسة</span>
            </button>
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
                  <FaStar className="text-blue-600 text-sm" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">قيمت مدرسة النجاح</p>
                  <p className="text-xs text-gray-500">منذ يومين</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <FaExclamationTriangle className="text-orange-600 text-sm" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">تم الرد على شكواك</p>
                  <p className="text-xs text-gray-500">منذ 3 أيام</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Rated Schools */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">أعلى المدارس تقييماً</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {schoolsData.slice(0, 3).map((school) => (
                <div key={school.id} className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaSchool className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{school.name}</p>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <FaStar className="text-yellow-400 text-xs" />
                      <span className="text-xs text-gray-600">{school.overallRating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // School Search Function
  const renderSchoolSearch = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">البحث عن مدارس</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <p className="text-gray-600">قريباً - صفحة البحث المتقدم عن المدارس</p>
      </div>
    </div>
  );

  // Complaints Section
  const renderComplaints = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">الشكاوى المقدمة</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse">
          <FaPlus />
          <span>شكوى جديدة</span>
        </button>
      </div>
      
      {/* Complaints Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي الشكاوى</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <FaExclamationTriangle className="text-orange-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">الشكاوى الجديدة</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <FaBell className="text-red-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">قيد المراجعة</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
            <FaClipboardCheck className="text-yellow-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">تم الحل</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
            <FaUsers className="text-green-500 text-2xl" />
          </div>
        </div>
      </div>
      
      {/* Complaints List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">الشكاوى الحديثة</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { id: 1, title: 'شكوى حول جودة الطعام', school: 'مدرسة النجاح', priority: 'عالية', status: 'جديد', date: '2024-01-20' },
              { id: 2, title: 'مشكلة في النقل المدرسي', school: 'مدرسة الأمل', priority: 'متوسطة', status: 'قيد المراجعة', date: '2024-01-19' },
              { id: 3, title: 'استفسار حول المناهج', school: 'مدرسة المستقبل', priority: 'منخفضة', status: 'تم الحل', date: '2024-01-18' }
            ].map((complaint) => (
              <div key={complaint.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{complaint.title}</h4>
                  <p className="text-sm text-gray-600">المدرسة: {complaint.school} • {complaint.date}</p>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    complaint.priority === 'عالية' ? 'bg-red-100 text-red-800' :
                    complaint.priority === 'متوسطة' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {complaint.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    complaint.status === 'جديد' ? 'bg-blue-100 text-blue-800' :
                    complaint.status === 'قيد المراجعة' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {complaint.status}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800">
                    <FaEye />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // School Ratings Section
  const renderRatings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">تقييم المدارس</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse">
          <FaPlus />
          <span>تقييم جديد</span>
        </button>
      </div>
      
      {/* Ratings Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي التقييمات</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <FaStar className="text-yellow-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">تقييم إيجابي</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
            </div>
            <FaStar className="text-green-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">تقييم محايد</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
            <FaStar className="text-yellow-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">تقييم سلبي</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
            <FaStar className="text-red-500 text-2xl" />
          </div>
        </div>
      </div>
      
      {/* Ratings List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">التقييمات الحديثة</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { id: 1, school: 'مدرسة النجاح الابتدائية', rating: 4.5, comment: 'ممتازة في جميع المجالات', date: '2024-01-20' },
              { id: 2, school: 'مدرسة الأمل المتوسطة', rating: 4.2, comment: 'جيدة جداً، بيئة تعليمية مريحة', date: '2024-01-19' },
              { id: 3, school: 'مدرسة المستقبل الثانوية', rating: 4.8, comment: 'ممتازة، فريق تدريبي متميز', date: '2024-01-18' }
            ].map((rating) => (
              <div key={rating.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{rating.school}</h4>
                  <p className="text-sm text-gray-600">{rating.comment} • {rating.date}</p>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400" />
                    <span className="text-sm text-gray-700 mr-1">{rating.rating}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    <FaEye />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // School Comparison Section
  const renderComparison = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">مقارنة المدارس</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse">
          <FaPlus />
          <span>مقارنة جديدة</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">قريباً - ميزة مقارنة المدارس</h3>
        <p className="text-gray-600">ستتمكن من مقارنة المدارس المختلفة حسب معايير متنوعة مثل الجودة التعليمية، المرافق، البيئة، وغيرها.</p>
      </div>
    </div>
  );

  // Settings Section
  const renderSettings = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات الحساب</h3>
        <p className="text-gray-600">قريباً - صفحة إعدادات الحساب الشخصي</p>
      </div>
    </div>
  );

  const sidebarItems = [
    { id: 'overview', label: 'نظرة عامة', icon: FaHome },
    { id: 'search', label: 'البحث عن مدارس', icon: FaSearch },
    { id: 'complaints', label: 'الشكاوى', icon: FaExclamationTriangle },
    { id: 'ratings', label: 'التقييمات', icon: FaStar },
    { id: 'comparison', label: 'مقارنة المدارس', icon: FaBalanceScale },
    { id: 'settings', label: 'الإعدادات', icon: FaCog }
  ];

  return (
    <div className="font-cairo relative min-h-screen w-full bg-gray-50 font-arabic animate-fadeIn" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-gray-700"
            >
              <FaBars className="text-xl" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">لوحة أولياء الأمور</h1>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <FaBell className="text-lg" />
              <span className="absolute top-0 left-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">و</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">وليد أحمد</p>
                <p className="text-xs text-gray-500">ولي أمر</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`bg-white shadow-lg md:shadow-none md:border-l border-gray-200 w-64 fixed md:static md:translate-x-0 h-full z-30 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-4 border-b border-gray-200 flex justify-between items-center md:hidden">
            <h2 className="text-lg font-bold text-gray-900">القائمة</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <FaTimes className="text-xl" />
            </button>
          </div>
          <nav className="mt-4">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 text-right hover:bg-gray-50 transition-colors ${
                  activeTab === item.id ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-600' : 'text-gray-700'
                }`}
              >
                <item.icon className="text-lg" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {sidebarItems.find(item => item.id === activeTab)?.label}
            </h1>
            
            {/* Tab content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'search' && renderSchoolSearch()}
              {activeTab === 'complaints' && renderComplaints()}
              {activeTab === 'ratings' && renderRatings()}
              {activeTab === 'comparison' && renderComparison()}
              {activeTab === 'settings' && renderSettings()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      <DashboardSwitcher />
    </div>
  );
};

export default ParentsDashboard;