import React, { useState, useContext, useEffect, useRef } from "react";
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
  FaChartBar,
  FaBell
} from "react-icons/fa";
import { AuthContext } from "../../../contexts/AuthContext";
import SupervisorLinksManagement from '../../admin/SupervisorLinksManagement';
import ReportsManagement from '../../admin/ReportsManagement';
import SchoolsManagement from '../../admin/SchoolsManagement';
import UsersManagement from '../../admin/UsersManagement';
import SettingsManagement from '../../admin/SettingsManagement';
import { getDashboardStatistics, getRecentRegistrations } from '../../../services/adminService';
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
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  
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
        const [dashboardStats, recentRegs] = await Promise.all([
          getDashboardStatistics(),
          getRecentRegistrations()
        ]);
        
        // التصحيح: البيانات تأتي مباشرة بدون overview
        if (dashboardStats.success) {
          setStats({
            totalUsers: dashboardStats.data.totalUsers || 0,
            activeUsers: dashboardStats.data.activeUsers || 0,
            schools: dashboardStats.data.totalSchools || 0,
            totalLinks: dashboardStats.data.totalInvitations || 0,
            pendingUsers: dashboardStats.data.pendingUsers || 0,
            recentRegistrations: recentRegs.success ? recentRegs.data : []
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

  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        // For now, we'll use mock data
        // In a real implementation, you would fetch from an API
        const mockNotifications = [
          {
            id: 1,
            title: "طلب تسجيل جديد",
            message: "يوجد طلب تسجيل جديد من مستخدم",
            time: "قبل 5 دقائق",
            read: false
          },
          {
            id: 2,
            title: "تقرير مدرسة",
            message: "تم إرسال تقرير جديد من مدرسة الأمل",
            time: "قبل ساعة",
            read: false
          },
          {
            id: 3,
            title: "تحديث النظام",
            message: "يتوفر تحديث جديد للنظام",
            time: "قبل يوم",
            read: true
          }
        ];
        
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };
    
    loadNotifications();
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    setUnreadCount(prev => prev > 0 ? prev - 1 : 0);
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    setUnreadCount(0);
  };

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
            
            {/* Recent Registrations Section */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-lg font-semibold mb-4">أحدث التسجيلات</h3>
              {stats.recentRegistrations && stats.recentRegistrations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">البريد الإلكتروني</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الدور</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ التسجيل</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.recentRegistrations.map((user) => (
                        <tr key={user.user_id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${user.role === 0 ? 'bg-red-100 text-red-800' : ''}
                              ${user.role === 1 ? 'bg-blue-100 text-blue-800' : ''}
                              ${user.role === 2 ? 'bg-green-100 text-green-800' : ''}
                              ${user.role === 3 ? 'bg-purple-100 text-purple-800' : ''}
                              ${user.role !== 0 && user.role !== 1 && user.role !== 2 && user.role !== 3 ? 'bg-gray-100 text-gray-800' : ''}`}>
                              {user.role_name || user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.registered_at).toLocaleDateString('ar-SA')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">لا توجد تسجيلات حديثة</p>
              )}
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
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Notification Bell Icon */}
              <div className="relative" ref={notificationRef}>
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 relative"
                  onClick={toggleNotificationDropdown}
                >
                  <FaBell className="text-gray-600 text-xl" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">الإشعارات</h3>
                        <button 
                          onClick={markAllAsRead}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          تعليم الكل كمقروء
                        </button>
                      </div>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex justify-between">
                              <h4 className="font-medium text-gray-900">{notification.title}</h4>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          لا توجد إشعارات
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 border-t border-gray-200 text-center">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        عرض جميع الإشعارات
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
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