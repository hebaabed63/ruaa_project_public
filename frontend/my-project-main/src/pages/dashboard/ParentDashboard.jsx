import React, { useState } from 'react';
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
  FaChild
} from 'react-icons/fa';

const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for parent dashboard
  const statsData = [
    { title: 'الأبناء المسجلين', value: '2', change: '0', icon: FaChild, color: 'bg-purple-500' },
    { title: 'المدارس المفضلة', value: '3', change: '+1', icon: FaHeart, color: 'bg-red-500' },
    { title: 'الشكاوى المقدمة', value: '1', change: '0', icon: FaExclamationTriangle, color: 'bg-orange-500' },
    { title: 'التقييمات المقدمة', value: '4', change: '+2', icon: FaStar, color: 'bg-yellow-500' }
  ];

  // Children data
  const childrenData = [
    { id: 1, name: 'محمد أحمد', grade: 'الصف الخامس الابتدائي', school: 'مدرسة النجاح الابتدائية', performance: 'ممتاز' },
    { id: 2, name: 'فاطمة أحمد', grade: 'الصف الثاني المتوسط', school: 'مدرسة الأمل المتوسطة', performance: 'جيد جداً' }
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
      fees: '15000 ريال/سنة',
      distance: '2.5 كم',
      reviews: 127
    },
    { 
      id: 2, 
      name: 'مدرسة الأمل المتوسطة', 
      location: 'الرياض - حي الملقا', 
      type: 'متوسط', 
      students: 320, 
      teachers: 15, 
      overallRating: 4.2,
      fees: '18000 ريال/سنة',
      distance: '3.2 كم',
      reviews: 89
    },
    { 
      id: 3, 
      name: 'مدرسة المستقبل الثانوية', 
      location: 'الرياض - حي العليا', 
      type: 'ثانوي', 
      students: 280, 
      teachers: 20, 
      overallRating: 4.8,
      fees: '22000 ريال/سنة',
      distance: '4.1 كم',
      reviews: 156
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
                <p className={`text-sm ${stat.change.includes('+') ? 'text-green-600' : stat.change === '0' ? 'text-gray-500' : 'text-red-600'}`}>
                  {stat.change === '0' ? 'لا توجد تغييرات' : `${stat.change} هذا الشهر`}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Children Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">نظرة على أطفالي</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {childrenData.map((child) => (
              <div key={child.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 space-x-reverse mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaChild className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{child.name}</h4>
                    <p className="text-sm text-gray-600">{child.grade}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">المدرسة:</span>
                    <span className="font-medium">{child.school}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الأداء:</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      child.performance === 'ممتاز' ? 'bg-green-100 text-green-800' :
                      child.performance === 'جيد جداً' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {child.performance}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FaHeart className="text-green-600 text-sm" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">أضفت مدرسة للمفضلة</p>
                  <p className="text-xs text-gray-500">منذ أسبوع</p>
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

  // Sidebar navigation items
  const sidebarItems = [
    { id: 'overview', label: 'نظرة عامة', icon: FaHome },
    { id: 'schools', label: 'البحث عن مدارس', icon: FaSearch },
    { id: 'complaints', label: 'الشكاوى', icon: FaExclamationTriangle },
    { id: 'ratings', label: 'التقييمات', icon: FaStar },
    { id: 'comparison', label: 'مقارنة المدارس', icon: FaBalanceScale },
    { id: 'settings', label: 'الإعدادات', icon: FaCog }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <FaUserCircle className="text-white text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">أحمد محمد السعد</h3>
              <p className="text-sm text-gray-600">ولي أمر</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg text-right transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="text-lg" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة تحكم أولياء الأمور</h1>
            <p className="text-gray-600">إدارة وتتبع المدارس والتقييمات والشكاوى</p>
          </div>
          
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'schools' && <div><h2 className="text-xl font-bold">البحث عن مدارس</h2><p className="mt-4">صفحة البحث عن المدارس ستكون هنا</p></div>}
          {activeTab === 'complaints' && <div><h2 className="text-xl font-bold">الشكاوى</h2><p className="mt-4">صفحة الشكاوى ستكون هنا</p></div>}
          {activeTab === 'ratings' && <div><h2 className="text-xl font-bold">التقييمات</h2><p className="mt-4">صفحة التقييمات ستكون هنا</p></div>}
          {activeTab === 'comparison' && <div><h2 className="text-xl font-bold">مقارنة المدارس</h2><p className="mt-4">صفحة مقارنة المدارس ستكون هنا</p></div>}
          {activeTab === 'settings' && <div><h2 className="text-xl font-bold">الإعدادات</h2><p className="mt-4">صفحة الإعدادات ستكون هنا</p></div>}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
