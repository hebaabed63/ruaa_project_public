import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaSchool,
  FaStar, 
  FaChartLine,
  FaComments,
  FaBell,
  FaCalendarAlt,
  FaFileAlt,
  FaUsers,
  FaGraduationCap,
  FaTrophy,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaHeart,
  FaPaperPlane,
  FaCog,
  FaUser,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaSearch,
  FaChevronDown
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

import { Card, Button, Badge, ProgressBar, Loading } from '../components/ui';
import { useParentProfile, useDashboardStats, useSchools, useNotifications, useMessages } from '../hooks/useData';
import ChatWidget from '../components/ChatWidget';

/**
 * مكون بطاقة الإحصائية
 * Statistics Card Component
 */
const StatsCard = ({ title, value, subtitle, icon: Icon, color, trend, loading = false }) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-green-500 to-green-600', 
    warning: 'from-yellow-500 to-yellow-600',
    danger: 'from-red-500 to-red-600',
    info: 'from-blue-500 to-blue-600'
  };

  return (
    <Card className="relative overflow-hidden h-full">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${colorClasses[color]} opacity-5`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} text-white shadow-lg`}>
            <Icon className="text-xl" />
          </div>
          
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium
              ${trend.type === 'up' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
              }
            `}>
              {trend.type === 'up' ? <FaArrowUp /> : <FaArrowDown />}
              {trend.value}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {loading ? <Loading type="spinner" size="sm" /> : value}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 font-medium">{title}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

/**
 * مكون بطاقة النشاط الحديث
 * Recent Activity Card Component
 */
const ActivityCard = ({ activity, index }) => {
  const typeIcons = {
    evaluation: FaStar,
    message: FaComments,
    school: FaSchool,
    achievement: FaTrophy
  };

  const typeColors = {
    evaluation: 'text-yellow-500',
    message: 'text-blue-500', 
    school: 'text-green-500',
    achievement: 'text-purple-500'
  };

  const Icon = typeIcons[activity.type];

  return (
    <motion.div
      className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ x: 5 }}
    >
      <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${typeColors[activity.type]}`}>
        <Icon className="text-lg" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
          {activity.title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {activity.description}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {new Date(activity.timestamp).toLocaleDateString('ar-SA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          {!activity.read && (
            <div className="w-2 h-2 bg-primary-500 rounded-full" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * مكون بطاقة المدرسة السريعة
 * Quick School Card Component
 */
const QuickSchoolCard = ({ school, index }) => {
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-purple-500';
    if (rating >= 3.5) return 'text-green-500';
    if (rating >= 3.0) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-blue-500/5" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white">
                <FaSchool className="text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                  {school.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {school.type}
                </p>
              </div>
            </div>
            
            <Badge variant={school.hasMyChild ? 'success' : 'gray'} size="sm">
              {school.hasMyChild ? 'مدرسة طفلي' : 'أخرى'}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">التقييم العام</span>
              <div className="flex items-center gap-2">
                <FaStar className={`text-sm ${getRatingColor(school.overallRating)}`} />
                <span className={`font-bold ${getRatingColor(school.overallRating)}`}>
                  {school.overallRating}
                </span>
              </div>
            </div>

            <ProgressBar 
              value={school.overallRating} 
              max={5} 
              color={school.overallRating >= 4.5 ? 'success' : school.overallRating >= 3.5 ? 'primary' : 'warning'}
              size="sm"
              showPercentage={false}
            />

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{school.studentsCount} طالب</span>
              <span>{school.teachersCount} معلم</span>
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors"
            >
              <FaEye className="ml-2" />
              عرض التفاصيل
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

/**
 * مكون الإشعارات المنسدلة
 * Notifications Dropdown Component
 */
const NotificationsDropdown = ({ notifications, unreadCount, onMarkAsRead, onMarkAllAsRead, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNotificationClick = (notification) => {
    onMarkAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    onClose();
  };

  return (
    <motion.div
      className="absolute left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden z-50"
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-white">الإشعارات</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {unreadCount} غير مقروء
          </span>
        </div>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {notifications.slice(0, 5).map((notification) => (
          <motion.div
            key={notification.id}
            className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
              !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
            whileHover={{ x: 5 }}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                !notification.read ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {notification.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {new Date(notification.timestamp).toLocaleDateString('ar-SA')}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-600">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full"
          onClick={() => {
            navigate('/dashboard/Admin/notifications');
            onClose();
          }}
        >
          عرض جميع الإشعارات
        </Button>
      </div>
    </motion.div>
  );
};

/**
 * مكون الإعدادات السريعة
 * Quick Settings Component
 */
const QuickSettings = ({ theme, onThemeToggle, onProfileClick, onSettingsClick, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('.quick-settings-container') === null) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative quick-settings-container">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center space-x-2 space-x-reverse"
      >
        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
          ا
        </div>
        <span className="hidden lg:inline text-gray-700 dark:text-gray-300">
          ولي الأمر
        </span>
        <FaChevronDown className="text-xs" />
      </Button>

      {isOpen && (
        <motion.div
          className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden z-50"
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Profile Info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white text-lg font-bold">
                ا
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  ولي الأمر
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  parent@example.com
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button 
              className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-right"
              onClick={() => {
                onProfileClick();
                setIsOpen(false);
              }}
            >
              <FaUser className="text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">الملف الشخصي</span>
            </button>
            
            <button 
              className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-right"
              onClick={() => {
                onSettingsClick();
                setIsOpen(false);
              }}
            >
              <FaCog className="text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">الإعدادات</span>
            </button>
            
            <button 
              className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-right"
              onClick={() => {
                onThemeToggle();
                setIsOpen(false);
              }}
            >
              {theme === 'light' ? <FaMoon className="text-gray-400" /> : <FaSun className="text-gray-400" />}
              <span className="text-gray-700 dark:text-gray-300">
                {theme === 'light' ? 'الوضع المظلم' : 'الوضع المضيء'}
              </span>
            </button>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-600 py-2">
            <button 
              className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-right"
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
            >
              <FaSignOutAlt className="text-red-400" />
              <span className="text-red-600 dark:text-red-400">تسجيل الخروج</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

/**
 * الصفحة الرئيسية للداشبورد
 * Main Dashboard Page Component
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useParentProfile();
  const { stats, loading: statsLoading } = useDashboardStats();
  const { mySchools, loading: schoolsLoading } = useSchools({ myChildren: true });
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  
  const [chatOpen, setChatOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.success(`البحث عن: ${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Handle notification mark as read
  const handleMarkAsRead = (id) => {
    markAsRead(id);
    toast.success('تم وضع علامة مقروء على الإشعار');
  };

  // Handle mark all notifications as read
  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast.success('تم وضع علامة مقروء على جميع الإشعارات');
  };

  // Handle new notification
  useEffect(() => {
    if (notifications.length > 0 && !notifications[0].read) {
      toast(`إشعار جديد: ${notifications[0].title}`, {
        icon: '🔔',
        duration: 4000,
      });
    }
  }, [notifications]);

  return (
    <div className="relative min-h-screen" dir="rtl">
      {/* Main Dashboard Content - Header is now provided by Layout component */}
      <div className="space-y-6">
        {/* Statistics Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <StatsCard
          title="مدارس أطفالي"
          value={statsLoading ? '...' : stats?.totalSchools || 0}
          subtitle="المدارس المسجل بها أطفالك"
          icon={FaSchool}
          color="primary"
          loading={statsLoading}
        />
        
        <StatsCard
          title="متوسط التقييمات"
          value={statsLoading ? '...' : `${stats?.averageRating || 0}/5`}
          subtitle="متوسط تقييماتك للمدارس"
          icon={FaStar}
          color="warning"
          trend={{ type: 'up', value: '+0.2' }}
          loading={statsLoading}
        />
        
        <StatsCard
          title="التقييمات النشطة"
          value={statsLoading ? '...' : stats?.activeEvaluations || 0}
          subtitle="تقييمات في انتظار المراجعة"
          icon={FaChartLine}
          color="success"
          loading={statsLoading}
        />
        
        <StatsCard
          title="الإشعارات الجديدة"
          value={statsLoading ? '...' : stats?.pendingNotifications || 0}
          subtitle="إشعارات لم تتم قراءتها"
          icon={FaBell}
          color="info"
          trend={{ type: 'down', value: '-2' }}
          loading={statsLoading}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* My Schools Section */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FaSchool className="text-2xl text-primary-500" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      مدارس أطفالي
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      المدارس المسجل بها أطفالك حالياً
                    </p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/dashboard/Admin/schools')}
                >
                  <FaEye className="ml-2" />
                  عرض الكل
                </Button>
              </div>

              <div className="flex-1">
                {schoolsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-gray-100 dark:bg-gray-700 animate-pulse rounded-xl h-48" />
                    ))}
                  </div>
                ) : mySchools.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mySchools.slice(0, 4).map((school, index) => (
                      <QuickSchoolCard 
                        key={school.id} 
                        school={school} 
                        index={index} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaSchool className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      لا توجد مدارس مسجلة حالياً
                    </p>
                    <Button variant="primary">
                      إضافة مدرسة
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity Section */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FaBell className="text-2xl text-primary-500" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      النشاط الحديث
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      آخر التحديثات والأنشطة
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                {statsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-2" />
                          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded animate-pulse w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : stats?.recentActivities?.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {stats.recentActivities.map((activity, index) => (
                      <ActivityCard 
                        key={activity.id} 
                        activity={activity} 
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaBell className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      لا توجد أنشطة حديثة
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => navigate('/dashboard/Admin/notifications')}
                >
                  <FaEye className="ml-2" />
                  عرض جميع الأنشطة
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            الإجراءات السريعة
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { 
                label: 'تقييم مدرسة', 
                icon: FaStar, 
                color: 'from-yellow-500 to-yellow-600',
                action: () => navigate('/dashboard/Admin/evaluations')
              },
              { 
                label: 'إرسال رسالة', 
                icon: FaComments, 
                color: 'from-blue-500 to-blue-600',
                action: () => setChatOpen(true)
              },
              { 
                label: 'عرض التقارير', 
                icon: FaFileAlt, 
                color: 'from-green-500 to-green-600',
                action: () => navigate('/dashboard/Admin/reports')
              },
              { 
                label: 'التقويم', 
                icon: FaCalendarAlt, 
                color: 'from-purple-500 to-purple-600',
                action: () => navigate('/dashboard/Admin/calendar')
              }
            ].map((action, index) => (
              <motion.button
                key={action.label}
                className={`p-6 rounded-xl bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-all duration-200 text-center group`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                onClick={action.action}
              >
                <action.icon className="text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-semibold">{action.label}</p>
              </motion.button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Chat Widget */}
      <ChatWidget 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
        contacts={[
          { id: 'school1', schoolName: 'مدرسة الأمل الابتدائية', managerName: 'أ. عبدالرحمن السالم' },
          { id: 'school2', schoolName: 'مدرسة النجاح المتوسطة', managerName: 'أ. فاطمة الخالد' }
        ]}
      />
    </div>
  </div>
);
};

export default Dashboard;