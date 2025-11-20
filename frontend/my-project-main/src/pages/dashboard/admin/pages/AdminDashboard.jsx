import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaSchool, FaLink, FaUserFriends, FaUserShield, FaUser, FaUserTie, FaTimes, FaChartLine, FaBell
} from 'react-icons/fa';

import { Card, Loading } from '../components/ui';
// Updated imports to use admin hooks instead of parent hooks
import { useAdminDashboardStats, useUsers } from '../hooks/useAdminData';
import { useAdminContext } from '../contexts/AdminContext';
// Import test component
import TestAdminAPI from '../components/TestAdminAPI';

// ======= StatsCard Component with Enhanced Animations =======
const StatsCard = ({ title, value, icon: Icon, color, loading = false, suffix }) => {
  const colorClasses = {
    blue: 'text-sky-700',
    success: 'text-green-500', 
    danger: 'text-cyan-500',
    info: 'text-yellow-500',
    purple: 'text-purple-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="relative overflow-hidden h-full group bg-[#F9F9FA] dark:bg-gray-700 transition-colors">
        <div className="absolute inset-0 bg-slate-200 dark:bg-gray-600 opacity-30 group-hover:opacity-70 transition-opacity" />
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex justify-end mb-2">
            <div className={`${colorClasses[color]}`}>
              <Icon className="text-2xl" />
            </div>
          </div>
          <div className="space-y-1 mt-auto text-center">
            <p
              className="text-lg text-gray-900 dark:text-white font-bold truncate overflow-hidden whitespace-nowrap"
              title={title}
            >
              {title}
            </p>
            <h3
              className="text-sm font-thin text-gray-500 dark:text-gray-300 truncate overflow-hidden whitespace-nowrap"
              title={value}
            >
              {loading ? <Loading type="spinner" size="sm" /> : `${value} ${suffix || ''}`}
            </h3>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// ======= Dashboard Panel Selection Modal =======
const ChooseDashboards = ({ onClose }) => {
  const navigate = useNavigate();
  
  const panels = [
    { 
      title: 'لوحة مدير النظام', 
      description: 'إدارة شاملة للنظام', 
      icon: FaUserShield, 
      bgColor: 'bg-[#3083FF33]', 
      iconColor: 'text-[#3083FF]',
      path: '/dashboard/Admin'
    },
    { 
      title: 'لوحة المشرف', 
      description: 'مراقبة وتقييم المدارس', 
      icon: FaUserTie, 
      bgColor: 'bg-[#25980026]', 
      iconColor: 'text-[#259800]',
      path: '/dashboard/Supervisors'
    },
    { 
      title: 'لوحة مدير المدرسة', 
      description: 'إدارة المدرسة والطلاب', 
      icon: FaSchool, 
      bgColor: 'bg-[#4CDBC433]', 
      iconColor: 'text-[#4CDBC4]',
      path: '/dashboard/Schools'
    },
    { 
      title: 'لوحة ولي الأمر', 
      description: 'متابعة الأطفال والمدارس', 
      icon: FaUser, 
      bgColor: 'bg-[#9F45F233]', 
      iconColor: 'text-[#8785FF]',
      path: '/dashboard/parents'
    },
  ];

  const handlePanelSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl"
        dir="rtl"
      >
        <div className="flex items-center justify-between p-2 mb-4 border-b border-gray-300">
          <h2 className="text-xl font-bold text-right text-gray-900 dark:text-white">اختر لوحة التحكم</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-slate-900 hover:text-red-700 dark:text-white"
          >
            <FaTimes className="text-xl" />
          </motion.button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {panels.map((panel, index) => {
            const Icon = panel.icon;
            return (
              <motion.div
                key={index}
                className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 flex flex-col justify-between h-full cursor-pointer"
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePanelSelect(panel.path)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-start mb-2">
                  <div className={`ml-2 p-2 rounded-full ${panel.bgColor}`}>
                    <Icon className={`text-xl ${panel.iconColor}`} />
                  </div>
                  <div className="text-right">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{panel.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{panel.description}</p>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-500 text-white py-1 px-4 rounded-full hover:bg-blue-600 transition"
                  >
                    انتقال
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ======= AdminDashboard Page with Enhanced Features =======
const AdminDashboard = () => {
  const navigate = useNavigate();
  // Updated to use admin context instead of parent context
  const { profile } = useAdminContext();
  // Updated to use admin dashboard stats instead of parent stats
  const { stats, loading: statsLoading, error, refetch: refetchStats } = useAdminDashboardStats();
  const { users: usersData, loading: usersLoading, refetch: refetchUsers } = useUsers({ limit: 5 });

  const [showModal, setShowModal] = useState(false);
  const [showTestAPI, setShowTestAPI] = useState(false);

  // Removed mock data - now using real API data

  return (
    <motion.div 
      className="container mx-auto bg-white dark:bg-gray-900 p-4 transition-colors"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      dir="rtl"
    >
      {/* Header with Enhanced Animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <motion.h1 
          className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          أهلا {profile?.fullName?.split(' ')[0] || 'مدير النظام'}!
        </motion.h1>
        <motion.p 
          className="text-gray-600 dark:text-gray-400 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          هذه لوحة التحكّم الخاصَّة بك لمتابعة المنصّة.
        </motion.p>
        
        {/* Test API Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTestAPI(!showTestAPI)}
          className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {showTestAPI ? 'إخفاء اختبار API' : 'اختبار اتصال API'}
        </motion.button>
      </motion.div>

      {/* Error handling */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <p className="text-red-700 dark:text-red-300">فشل في تحميل بيانات لوحة التحكم</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => refetchStats()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors mr-2"
            >
              إعادة المحاولة
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => refetchUsers()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              تحديث المستخدمين
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Test API Component */}
      {showTestAPI && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8"
        >
          <TestAdminAPI />
        </motion.div>
      )}

      {/* Top Stats Cards with Staggered Animations */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <StatsCard 
          title="إجمالي المستخدمين" 
          value={stats?.totalUsers || 0} 
          suffix="مستخدم" 
          icon={FaUserFriends} 
          color="danger" 
          loading={statsLoading} 
        />

        <StatsCard 
          title="المستخدمون النشطون" 
          value={stats?.activeUsers || 0} 
          suffix="مستخدم" 
          icon={FaUserFriends} 
          color="success" 
          loading={statsLoading} 
        />

        <StatsCard 
          title="المستخدمون المعلّقون" 
          value={stats?.pendingUsers || 0} 
          suffix="مستخدم" 
          icon={FaUserFriends} 
          color="warning" 
          loading={statsLoading} 
        />

        <StatsCard 
          title="إجمالي التقارير" 
          value={stats?.totalReports || 0} 
          suffix="تقرير" 
          icon={FaChartLine} 
          color="info" 
          loading={statsLoading} 
        />
      </motion.div>

      <motion.div 
        className="flex justify-center gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="w-[250px]">
          <StatsCard 
            title="إجمالي الروابط" 
            value={statsLoading ? '...' : stats?.totalInvitations || 0} 
            suffix="مديريّة" 
            icon={FaLink} 
            color="purple" 
            loading={statsLoading}  
          />
        </div>
        <div className="w-[250px]">
          <StatsCard 
            title="الروابط النشطة"  
            value={statsLoading ? '...' : stats?.activeInvitations || 0} 
            suffix="مدرسة" 
            icon={FaLink} 
            color="success" 
            loading={statsLoading} 
          />
        </div>
      </motion.div>

      {/* Recent Registrations Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12"
      >
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-900 dark:text-white">
          أحدث التسجيلات
        </h2>

        <motion.div 
          className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600"
          whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="py-3 px-6 text-right text-gray-500 dark:text-gray-200 font-bold">الاسم</th>
                <th className="py-3 px-6 text-right text-gray-500 dark:text-gray-200 font-bold">البريد الإلكتروني</th>
                <th className="py-3 px-6 text-right text-gray-500 dark:text-gray-200 font-bold">نوع المستخدم</th>
                <th className="py-3 px-6 text-right text-gray-500 dark:text-gray-200 font-bold">تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody>
              {usersLoading ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500 dark:text-gray-400">
                    جاري تحميل البيانات...
                  </td>
                </tr>
              ) : usersData?.length > 0 ? (
                usersData.map((user, index) => (
                  <motion.tr 
                    key={user.id}
                    className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <td className="py-3 px-6 text-right text-slate-950 dark:text-white">{user.name || user.fullName || 'غير محدد'}</td>
                    <td className="py-3 px-6 text-right text-gray-500 dark:text-white">{user.email}</td>
                    <td className="py-3 px-6 text-right text-gray-500 dark:text-white">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {user.role === 'admin' ? 'مدير' : user.role === 'supervisor' ? 'مشرف' : user.role === 'school_manager' ? 'مدير مدرسة' : user.role === 'parent' ? 'ولي أمر' : user.role}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right text-gray-500 dark:text-white">{new Date(user.created_at).toLocaleDateString('ar-SA')}</td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500 dark:text-gray-400">
                    لا توجد تسجيلات حديثة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </motion.div>

      {/* Dashboard Switch Button */}
      <motion.div
        className="flex justify-end mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowModal(true)}
          className="flex flex-col items-center justify-center w-14 h-14 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg"
          aria-label="تبديل لوحة التحكم"
        >
          <FaChartLine className="text-sm" />
          <FaBell className="text-sm mt-1" />
        </motion.button>
      </motion.div>

      {/* Modal */}
      {showModal && <ChooseDashboards onClose={() => setShowModal(false)} />}
    </motion.div>
  );
};

export default AdminDashboard;