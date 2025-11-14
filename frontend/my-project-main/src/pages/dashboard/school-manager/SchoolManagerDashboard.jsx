import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import DashboardSwitcher from '../../../components/common/DashboardSwitcher';
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
  FaBell,
  FaStar,
  FaBars,
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaEye,
  FaEdit,
  FaPlus,
  FaDownload,
  FaSearch,
  FaFilter,
  FaSort,
  FaTrash
} from 'react-icons/fa';
import usePageTitle from '../../../hooks/usePageTitle';

const SchoolManagerDashboard = () => {
  console.log('SchoolManagerDashboard component rendered');
  const { trackActivity, user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Set page title based on active tab
  usePageTitle(getPageTitle(activeTab));

  // Function to get page title based on active tab
  function getPageTitle(tab) {
    switch (tab) {
      case 'overview':
        return 'نظرة عامة';
      case 'schools':
        return 'إدارة المدرسة';
      case 'teachers':
        return 'إدارة المعلمين';
      case 'students':
        return 'إدارة الطلاب';
      case 'classes':
        return 'إدارة الفصول';
      case 'complaints':
        return 'الشكاوى والتقييمات';
      case 'reports':
        return 'التقارير';
      case 'settings':
        return 'الإعدادات';
      default:
        return 'لوحة مدير المدرسة';
    }
  }

  // Track activity when activeTab changes
  React.useEffect(() => {
    trackActivity();
  }, [activeTab, trackActivity]);

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
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
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
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setActiveTab('schools')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse transition-colors duration-300"
            >
              <FaSchoolIcon />
              <span>إدارة المدرسة</span>
            </button>
            <button 
              onClick={() => setActiveTab('complaints')}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 flex items-center space-x-2 space-x-reverse transition-colors duration-300"
            >
              <FaExclamationTriangle />
              <span>الشكاوى والتقييمات</span>
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 flex items-center space-x-2 space-x-reverse transition-colors duration-300"
            >
              <FaFileAlt />
              <span>التقارير</span>
            </button>
          </div>
        </div>

        {/* School Info Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
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
                <span className="font-medium">{user?.name || 'سارة أحمد'}</span>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">النشاط الأخير</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaUsers className="text-blue-600 text-sm" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">تسجيل طالب جديد</p>
                  <p className="text-xs text-gray-500">منذ ساعتين</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-50 transition-colors">
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

  // School Management Section
  const renderSchoolManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">إدارة المدرسة</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse transition-colors duration-300">
          <FaEdit />
          <span>تحديث المعلومات</span>
        </button>
      </div>
      
      {/* School Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي الطلاب</p>
              <p className="text-2xl font-bold text-gray-900">1,245</p>
            </div>
            <FaUsers className="text-blue-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">المعلمين</p>
              <p className="text-2xl font-bold text-gray-900">68</p>
            </div>
            <FaChalkboardTeacher className="text-green-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">الفصول</p>
              <p className="text-2xl font-bold text-gray-900">32</p>
            </div>
            <FaClipboardCheck className="text-yellow-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">متوسط التقييم</p>
              <p className="text-2xl font-bold text-gray-900">4.2</p>
            </div>
            <FaStar className="text-purple-500 text-2xl" />
          </div>
        </div>
      </div>
      
      {/* School Information Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">معلومات المدرسة</h3>
        </div>
        <div className="p-6">
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المدرسة</label>
                <input 
                  type="text" 
                  defaultValue="مدرسة النموذجية" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع المدرسة</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                  <option>ابتدائي</option>
                  <option>متوسط</option>
                  <option>ثانوي</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                <input 
                  type="text" 
                  defaultValue="الرياض - حي النرجس" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                <input 
                  type="tel" 
                  defaultValue="011-2345678" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
              <textarea 
                rows="3" 
                defaultValue="مدرسة حكومية تقدم تعليماً متميزاً للطلاب في المرحلة الابتدائية."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse transition-colors duration-300"
              >
                <FaSave />
                <span>حفظ التغييرات</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Complaints Section
  const renderComplaints = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">الشكاوى والتقييمات</h1>
        <div className="flex space-x-2 space-x-reverse">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300">
            تصدير التقرير
          </button>
        </div>
      </div>
      
      {/* Complaints Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي الشكاوى</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <FaExclamationTriangle className="text-orange-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">الشكاوى الجديدة</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
            <FaBell className="text-red-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">قيد المراجعة</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <FaClipboardCheck className="text-yellow-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">تم الحل</p>
              <p className="text-2xl font-bold text-gray-900">11</p>
            </div>
            <FaUsers className="text-green-500 text-2xl" />
          </div>
        </div>
      </div>
      
      {/* Complaints List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">الشكاوى الحديثة</h3>
            <div className="flex space-x-2 space-x-reverse">
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <FaFilter />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <FaSort />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { id: 1, title: 'شكوى حول جودة الطعام', parent: 'أحمد محمد', priority: 'عالية', status: 'جديد', date: '2024-01-20' },
              { id: 2, title: 'مشكلة في النقل المدرسي', parent: 'فاطمة علي', priority: 'متوسطة', status: 'قيد المراجعة', date: '2024-01-19' },
              { id: 3, title: 'استفسار حول المناهج', parent: 'خالد سعد', priority: 'منخفضة', status: 'تم الحل', date: '2024-01-18' }
            ].map((complaint) => (
              <div key={complaint.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{complaint.title}</h4>
                  <p className="text-sm text-gray-600">الوالد: {complaint.parent} • {complaint.date}</p>
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
                  <div className="flex space-x-1 space-x-reverse">
                    <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50">
                      <FaEye />
                    </button>
                    <button className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Performance Section
  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">أداء المدرسة</h1>
        <div className="flex space-x-2 space-x-reverse">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
            تحليل مفصل
          </button>
        </div>
      </div>
      
      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">متوسط التقييم</p>
              <p className="text-2xl font-bold text-gray-900">4.2/5</p>
            </div>
            <FaStar className="text-yellow-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">نسبة الحضور</p>
              <p className="text-2xl font-bold text-gray-900">94%</p>
            </div>
            <FaUsers className="text-blue-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">الإنجازات</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
            </div>
            <FaClipboardCheck className="text-green-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">الجوائز</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
            <FaStar className="text-purple-500 text-2xl" />
          </div>
        </div>
      </div>
      
      {/* Performance Charts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">التطور خلال العام</h3>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <FaChartLine className="text-4xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">مخطط الأداء الشهري</p>
              <p className="text-sm text-gray-400 mt-1">سيتم عرض الرسم البياني هنا</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Reports Section
  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">التقارير</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse transition-colors duration-300">
          <FaPlus />
          <span>تقرير جديد</span>
        </button>
      </div>
      
      {/* Reports Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي التقارير</p>
              <p className="text-2xl font-bold text-gray-900">32</p>
            </div>
            <FaFileAlt className="text-blue-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">هذا الشهر</p>
              <p className="text-2xl font-bold text-gray-900">6</p>
            </div>
            <FaCalendarAlt className="text-green-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">قيد المراجعة</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
            <FaClock className="text-yellow-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">مكتملة</p>
              <p className="text-2xl font-bold text-gray-900">28</p>
            </div>
            <FaCheckCircle className="text-green-500 text-2xl" />
          </div>
        </div>
      </div>
      
      {/* Recent Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">التقارير الحديثة</h3>
            <div className="flex space-x-2 space-x-reverse">
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                عرض الكل
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { id: 1, title: 'تقرير الأداء الشهري - يناير 2024', status: 'مكتمل', date: '2024-01-20', score: '4.5/5' },
              { id: 2, title: 'تقرير الحضور والانضباط', status: 'قيد المراجعة', date: '2024-01-19', score: '4.2/5' },
              { id: 3, title: 'تقرير الأنشطة المدرسية', status: 'مكتمل', date: '2024-01-18', score: '4.1/5' }
            ].map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{report.title}</h4>
                  <p className="text-sm text-gray-600">{report.date}</p>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <span className="text-sm font-medium text-gray-900">{report.score}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    report.status === 'مكتمل' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                  <div className="flex space-x-1 space-x-reverse">
                    <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50">
                      <FaEye />
                    </button>
                    <button className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50">
                      <FaDownload />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const sidebarItems = [
    { id: 'overview', label: 'نظرة عامة', icon: FaHome },
    { id: 'schools', label: 'إدارة المدرسة', icon: FaSchoolIcon },
    { id: 'complaints', label: 'الشكاوى', icon: FaExclamationTriangle },
    { id: 'performance', label: 'الأداء', icon: FaChartLine },
    { id: 'reports', label: 'التقارير', icon: FaFileAlt },
    { id: 'settings', label: 'الإعدادات', icon: FaCog }
  ];

  return (
    <div className="font-cairo relative min-h-screen w-full bg-gray-50 font-arabic" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <button
              onClick={() => {
                setSidebarOpen(!sidebarOpen);
                trackActivity();
              }}
              className="md:hidden text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaBars className="text-xl" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">لوحة مدير المدرسة</h1>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            <button className="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <FaBell className="text-lg" />
              <span className="absolute top-0 left-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.name ? user.name.charAt(0) : 'س'}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'سارة أحمد'}</p>
                <p className="text-xs text-gray-500">مدير المدرسة</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className={`bg-white shadow-lg md:shadow-none md:border-l border-gray-200 w-64 fixed md:static md:translate-x-0 h-full z-30 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-4 border-b border-gray-200 flex justify-between items-center md:hidden">
            <h2 className="text-lg font-bold text-gray-900">القائمة</h2>
            <button 
              onClick={() => {
                setSidebarOpen(false);
                trackActivity();
              }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
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
                  trackActivity();
                }}
                className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 text-right hover:bg-gray-50 transition-colors duration-300 ${
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
              {activeTab === 'schools' && renderSchoolManagement()}
              {activeTab === 'complaints' && renderComplaints()}
              {activeTab === 'performance' && renderPerformance()}
              {activeTab === 'reports' && renderReports()}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات عامة</h3>
                    <p className="text-gray-600">صفحة الإعدادات ستكون هنا</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => {
            setSidebarOpen(false);
            trackActivity();
          }}
        ></div>
      )}
      
      <DashboardSwitcher />
    </div>
  );
};

export default SchoolManagerDashboard;