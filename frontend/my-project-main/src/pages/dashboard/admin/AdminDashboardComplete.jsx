import React, { useState, useContext, useEffect } from "react";
import { 
  FaUsers, 
  FaSchool, 
  FaChartPie, 
  FaCog, 
  FaChevronLeft, 
  FaChevronRight, 
  FaUserTie, 
  FaFileAlt, 
  FaUserCheck, 
  FaUserClock, 
  FaLink, 
  FaChartBar 
} from "react-icons/fa";
import { AuthContext } from "../../../contexts/AuthContext";
import SupervisorLinksManagement from '../../admin/SupervisorLinksManagement';
import ReportsManagement from '../../admin/ReportsManagement';
import SchoolsManagement from '../../admin/SchoolsManagement';
import UsersManagement from '../../admin/UsersManagement';
import SettingsManagement from '../../admin/SettingsManagement';
import { getDashboardStatistics } from '../../../services/adminService';
import { showAlert } from "../../../utils/SweetAlert";
import usePageTitle from "../../../hooks/usePageTitle";

const AdminDashboardComplete = () => {
  console.log('AdminDashboardComplete component rendered');
  const { trackActivity } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    schools: 0,
    totalLinks: 0,
    pendingUsers: 0,
    recentRegistrations: []
  });
  const [loading, setLoading] = useState(true);

  // Set page title based on active tab
  usePageTitle(getPageTitle(activeTab));

  // Function to get page title based on active tab
  function getPageTitle(tab) {
    switch (tab) {
      case "overview":
        return "نظرة عامة";
      case "users":
        return "إدارة المستخدمين";
      case "schools":
        return "إدارة المدارس";
      case "supervisor-links":
        return "دعوات المشرفين";
      case "reports":
        return "إدارة التقارير";
      case "settings":
        return "الإعدادات";
      default:
        return "لوحة تحكم مدير النظام";
    }
  }

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        const dashboardStats = await getDashboardStatistics();
        
        // التصحيح: البيانات تأتي مباشرة بدون overview
        if (dashboardStats.success) {
          setStats({
            totalUsers: dashboardStats.data.totalUsers || 0,
            activeUsers: dashboardStats.data.activeUsers || 0,
            schools: dashboardStats.data.totalSchools || 0,
            totalLinks: dashboardStats.data.totalInvitations || 0,
            pendingUsers: dashboardStats.data.pendingUsers || 0,
            recentRegistrations: [] // غير متوفر حالياً في الـ Backend
          });
        } else {
          throw new Error(dashboardStats.message || 'فشل في جلب البيانات');
        }
      } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
        showAlert('error', error.message || 'حدث خطأ في جلب إحصائيات لوحة التحكم');
        
        // بيانات افتراضية للعرض
        setStats({
          totalUsers: 0,
          activeUsers: 0,
          schools: 0,
          totalLinks: 0,
          pendingUsers: 0,
          recentRegistrations: []
        });
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "overview") {
      fetchDashboardStats();
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">نظرة عامة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full mr-3">
                    <FaUsers className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-600">إجمالي المستخدمين</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full mr-3">
                    <FaUserCheck className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-600">المستخدمون النشطون</p>
                    <p className="text-2xl font-bold">{stats.activeUsers}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-full mr-3">
                    <FaUserClock className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-gray-600">المستخدمون المعلقون</p>
                    <p className="text-2xl font-bold">{stats.pendingUsers}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full mr-3">
                    <FaSchool className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-600">عدد المدارس</p>
                    <p className="text-2xl font-bold">{stats.schools}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-indigo-100 rounded-full mr-3">
                    <FaLink className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-gray-600">إجمالي الدعوات</p>
                    <p className="text-2xl font-bold">{stats.totalLinks}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-teal-100 rounded-full mr-3">
                    <FaChartBar className="text-teal-600" />
                  </div>
                  <div>
                    <p className="text-gray-600">نسبة النشاط</p>
                    <p className="text-2xl font-bold">
                      {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* قسم أحدث التسجيلات - مؤقتاً غير متوفر */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-lg font-semibold mb-4">معلومات النظام</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">إحصائيات المستخدمين</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">المستخدمون النشطون:</span>
                      <span className="font-bold text-green-600">{stats.activeUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المستخدمون المعلقون:</span>
                      <span className="font-bold text-yellow-600">{stats.pendingUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">إجمالي المستخدمين:</span>
                      <span className="font-bold">{stats.totalUsers}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">إحصائيات النظام</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">عدد المدارس:</span>
                      <span className="font-bold">{stats.schools}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">عدد الدعوات:</span>
                      <span className="font-bold">{stats.totalLinks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">نسبة النشاط:</span>
                      <span className="font-bold">
                        {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-3">حالة المستخدمين</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>النشطون</span>
                    <span className="font-bold text-green-600">{stats.activeUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>المعلقون</span>
                    <span className="font-bold text-yellow-600">{stats.pendingUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الإجمالي</span>
                    <span className="font-bold">{stats.totalUsers}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-3">معدل النشاط</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>نسبة المستخدمين النشطين</span>
                    <span className="font-bold">
                      {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>نسبة المستخدمين المعلقين</span>
                    <span className="font-bold text-yellow-600">
                      {stats.totalUsers > 0 ? Math.round((stats.pendingUsers / stats.totalUsers) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>المدارس المسجلة</span>
                    <span className="font-bold">{stats.schools}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "users":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">إدارة المستخدمين</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden p-6">
              <UsersManagement />
            </div>
          </div>
        );
      case "schools":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">إدارة المدارس</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden p-6">
              <SchoolsManagement />
            </div>
          </div>
        );
      case "supervisor-links":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">دعوات المشرفين</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden p-6">
              <SupervisorLinksManagement />
            </div>
          </div>
        );
      case "reports":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">إدارة التقارير</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden p-6">
              <ReportsManagement />
            </div>
          </div>
        );
      case "settings":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">الإعدادات</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden p-6">
              <SettingsManagement />
            </div>
          </div>
        );
      default:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">مرحباً بك في لوحة التحكم</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <p>اختر أحد الخيارات من القائمة الجانبية للبدء</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100" dir="rtl">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h1 className="text-xl font-bold">لوحة التحكم</h1>}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-1 rounded hover:bg-gray-700"
            >
              {sidebarOpen ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          </div>
        </div>
        <nav className="mt-4">
          <button
            onClick={() => {
              setActiveTab("overview");
              trackActivity();
            }}
            className={`flex items-center w-full p-4 text-right ${
              activeTab === "overview" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            <FaChartPie className="ml-2" />
            {sidebarOpen && <span>نظرة عامة</span>}
          </button>
          <button
            onClick={() => {
              setActiveTab("users");
              trackActivity();
            }}
            className={`flex items-center w-full p-4 text-right ${
              activeTab === "users" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            <FaUsers className="ml-2" />
            {sidebarOpen && <span>المستخدمين</span>}
          </button>
          <button
            onClick={() => {
              setActiveTab("schools");
              trackActivity();
            }}
            className={`flex items-center w-full p-4 text-right ${
              activeTab === "schools" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            <FaSchool className="ml-2" />
            {sidebarOpen && <span>المدارس</span>}
          </button>
          <button
            onClick={() => {
              setActiveTab("supervisor-links");
              trackActivity();
            }}
            className={`flex items-center w-full p-4 text-right ${
              activeTab === "supervisor-links" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            <FaUserTie className="ml-2" />
            {sidebarOpen && <span>دعوات المشرفين</span>}
          </button>
          <button
            onClick={() => {
              setActiveTab("reports");
              trackActivity();
            }}
            className={`flex items-center w-full p-4 text-right ${
              activeTab === "reports" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            <FaFileAlt className="ml-2" />
            {sidebarOpen && <span>التقارير</span>}
          </button>
          <button
            onClick={() => {
              setActiveTab("settings");
              trackActivity();
            }}
            className={`flex items-center w-full p-4 text-right ${
              activeTab === "settings" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            <FaCog className="ml-2" />
            {sidebarOpen && <span>الإعدادات</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">لوحة تحكم المدير</h1>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                م
              </div>
              <span className="mr-2">مدير النظام</span>
            </div>
          </div>
        </header>
        <main className="p-6">
          {loading && activeTab === "overview" ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <span className="mr-3">جاري تحميل البيانات...</span>
            </div>
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardComplete;