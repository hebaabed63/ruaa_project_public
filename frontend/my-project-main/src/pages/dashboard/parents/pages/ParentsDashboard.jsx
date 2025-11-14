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
  FaEye,
  FaPaperPlane,
  FaBook,
  FaClipboardList,
  FaTasks,
  FaInfo
} from 'react-icons/fa';

import { Card, Button, Badge, Loading } from '../components/ui';
import { useParentProfile, useDashboardStats, useSchools, useNotifications } from '../hooks/useData';
import school1 from "../../../../assets/images/School 1.jpg";

// Safe icon and color mapping with fallbacks
const ICONS_BY_TYPE = {
  evaluation: FaStar,
  message: FaComments,
  school: FaSchool,
  achievement: FaTrophy,
};

const COLORS_BY_TYPE = {
  evaluation: 'text-yellow-500',
  message: 'text-blue-500',
  school: 'text-green-500',
  achievement: 'text-purple-500',
};

const getTypeIcon = (type) => ICONS_BY_TYPE[type] || FaInfo;
const getTypeColor = (type) => COLORS_BY_TYPE[type] || 'text-gray-500';

/**
 * مكون بطاقة الإحصائية
 * Statistics Card Component
 */
const StatsCard = ({ title, value, icon: Icon, color, loading = false, suffix }) => {
  const colorClasses = {
    primary: 'text-primary-500',
    success: 'text-green-500', 
    warning: 'text-yellow-500',
    danger: 'text-cyan-500',
    info: 'text-black-500'
  };

  const colorStatisticClasses = {
    success: 'text-green-500', 
    info: 'text-gray-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="relative overflow-hidden h-full group bg-white dark:bg-gray-600">
        <div className="absolute inset-0 bg-gray-50 dark:bg-gray-700 opacity-50 group-hover:opacity-70 transition-opacity" />
        <div className="relative z-10">
          <div className="flex flex-col h-full">
            <div className="flex justify-end mb-2">
              <div className={`${colorClasses[color]}`}>
                <Icon className="text-2xl" />
              </div>
            </div>
           <div className="space-y-1 mt-auto text-center">
  <p className="text-xs text-gray-900 dark:text-white font-thin">{title}</p>
  <h3 className={`text-lg font-thin ${colorStatisticClasses[color]}`}>
    {loading ? <Loading type="spinner" size="sm" /> : `${value} ${suffix || ''}`}
  </h3>
</div>

          </div>
        </div>
      </Card>
    </motion.div>
  );
};

/**
 * مكون بطاقة المدرسة
 * School Card Component
 */
const SchoolCard = ({ school, index, onViewDetails, onEvaluateSchool, onCompare }) => {
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-purple-500 bg-purple-100';
    if (rating >= 3.5) return 'text-green-500 bg-green-100';
    if (rating >= 3.0) return 'text-yellow-500 bg-yellow-100';
    return 'text-red-500 bg-red-100';
  };

  const getRatingText = (rating) => {
    if (rating >= 4.5) return 'ممتاز';
    if (rating >= 3.5) return 'جيد';
    if (rating >= 3.0) return 'متوسط';
    return 'ضعيف';
  };

  const getDirectorate = (location) => {
    if (location.includes('مديرية')) {
      return location.split('مديرية')[1].trim();
    }
    return location;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 w-80 h-fit bg-white dark:bg-gray-800 rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-blue-500/5" />

        <div className="relative z-10">
          <div className="relative h-48 mb-4 overflow-hidden rounded-t-xl">
            <img 
src={school1}
              alt={school.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            <div className="absolute top-4 left-4">
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full backdrop-blur bg-white/90 ${getRatingColor(school.overallRating).split(' ')[0]}`}>
                <FaStar />
                <span className="font-bold">{school.overallRating}</span>
              </div>
            </div>
          </div>

          {/* معلومات المدرسة */}
          <div className="space-y-3 px-4 pb-4">
            {/* اسم المدرسة */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white text-right line-clamp-1">
              {school.name}
            </h3>

<div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
  {/* الطلاب */}
  <div className="flex items-center gap-1 " dir="ltr">
      <span>طالب</span>

<span>{school.studentsCount}</span>
          <FaGraduationCap className="text-gray-500 dark:text-gray-400" />

  </div>

  {/* المعلمون */}
  <div className="flex items-center gap-1" dir="ltr">
      <span>معلم</span>

    <span>{school.teachersCount}</span>
        <FaUsers className="text-gray-500 dark:text-gray-400" />

  </div>

  {/* نوع المدرسة */}
  <div className="flex items-center gap-1" dir="ltr">
    <Badge variant="primary" size="sm">{school.type}</Badge>
        <FaSchool className="text-gray-500 dark:text-gray-400" />

  </div>
</div>


            {/* وصف المدرسة */}
            <p className="text-sm text-gray-500 dark:text-gray-400 text-right mt-2">
              {school.description || 'مدرسة النجاح الابتدائيَّة هي إحدى المدارس الرائدة في منطقة البريج، تتميّز بالتعليم الحديث والبيئة التعليميَّة المحفزة. نسعى لتقديم تعليم متميّز يهدف لإعداد جيل واعٍ ومبدِع.'}
            </p>

            {/* الأزرار */}
            <div className="flex flex-col gap-2 mt-3">
              <Button 
                variant="primary" 
                className="w-full bg-primary dark:bg-gray-600"
                onClick={() => onViewDetails(school)}
              >
                عرض التفاصيل
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full bg-white border-primary text-primary dark:bg-gray-600 dark:border-gray-600"
                onClick={() => onEvaluateSchool(school)}
              >
                تقييم المدرسة
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

/**
 * الصفحة الرئيسية للداشبورد
 * Main Dashboard Page Component
 */
const ParentsDashboard = () => {
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useParentProfile();
  const { stats, loading: statsLoading } = useDashboardStats();
  const { mySchools, loading: schoolsLoading } = useSchools({ myChildren: true });
  const { notifications } = useNotifications();
  
  // Handle view details
  const handleViewDetails = (school) => {
    navigate(`/dashboard/parents/schools/${school.id}`);
  };

  // Handle evaluate school
  const handleEvaluateSchool = (school) => {
    navigate(`/dashboard/parents/evaluations?schoolId=${school.id}`);
  };

  // Handle send message
  const handleSendMessage = (school) => {
    navigate('/dashboard/parents/chat', { state: { schoolId: school.id } });
  };

  return (
    <div className="container mx-auto p-4" dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            أهلا {profile?.fullName?.split(' ')[0] || 'ولي الأمر'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            هذه لوحة التحكم الخاصة بك لمتابعة مدارس أبنائك والأنشطة المتعلقة بهم
          </p>
        </div>
      </motion.div>

      {/* Top Cards Section */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
       <StatsCard
  title="مدارس أبنائي"
  value={statsLoading ? '...' : stats?.totalSchools || 0}
  suffix="من المدارس الملتحق بها أبناؤك"
  icon={FaSchool}
  color="danger"
  loading={statsLoading}
/>

<StatsCard
  title="متوسط التقييمات"
  value={statsLoading ? '...' : `${stats?.averageRating?.toFixed(1) || 0}/5`}
  icon={FaStar}
  color="warning"
  loading={statsLoading}
/>

<StatsCard
  title="التقييمات النشطة"
  value={statsLoading ? '...' : stats?.activeEvaluations || 0}
  suffix="تقييم"
  icon={FaChartLine}
  color="success"
  loading={statsLoading}
/>

<StatsCard
  title="الإشعارات الجديدة"
  value={statsLoading ? '...' : stats?.pendingNotifications || 0}
  suffix="إشعارات"
  icon={FaBell}
  color="info"
  loading={statsLoading}
/>

      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 d">
        {/* My Children's Schools Section */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full dark:bg-black">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FaSchool className="text-2xl text-primary-500" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white ">
                      مدارس أبنائي
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      المدارس المسجل بها أبناؤك حالياً
                    </p>
                  </div>
                </div>
              </div>

              <div>
                {schoolsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-gray-100 dark:bg-gray-700 animate-pulse rounded-xl h-64" />
                    ))}
                  </div>
                ) : mySchools.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mySchools.map((school, index) => (
                      <SchoolCard 
                        key={school.id} 
                        school={school} 
                        index={index}
                        onViewDetails={handleViewDetails}
                        onEvaluateSchool={handleEvaluateSchool}
                        onSendMessage={handleSendMessage}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaSchool className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      لا توجد مدارس مسجلة حالياً لأبنائك
                    </p>
                    <Button variant="primary" onClick={() => navigate('/dashboard/parents/schools')}>
                      استعراض المدارس
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activities Section */}
<div>
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
  >
    <Card className="h-full flex flex-col  dark:bg-black">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaBell className="text-2xl text-primary-500" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              أخر النشاطات
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              آخر التحديثات والأنشطة
            </p>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="flex flex-col gap-3">
  {statsLoading ? (
    <>
      {[1, 2, 3].map((i) => (
        <div 
          key={i} 
          className="flex items-center gap-4 p-4 rounded-xl bg-gray-100 animate-pulse" 
        />
      ))}
    </>
  ) : Array.isArray(stats?.recentActivities) && stats.recentActivities.length > 0 ? (
    stats.recentActivities.map((activity, index) => {
      const Icon = getTypeIcon(activity?.type);
      const colorClass = getTypeColor(activity?.type);
      return (
        <motion.div
          key={activity?.id ?? index}
          className="flex items-start gap-4 p-4 rounded-xl bg-gray-100 dark:bg-gray-800"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className={colorClass}>
            <Icon className="text-lg" />
          </div>
          <div className="flex-1 min-w-0 text-right">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">
              {activity?.title ?? '—'}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {activity?.description ?? ''}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {activity?.timestamp
                ? new Date(activity.timestamp).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })
                : ''}
            </p>
          </div>
        </motion.div>
      );
    })
  ) : (
    <div className="text-center py-12">
      <FaInfo className="text-4xl text-gray-400 mx-auto mb-4" />
      <p className="text-gray-500 dark:text-gray-400">
        لا توجد أنشطة حديثة
      </p>
    </div>
  )}
</div>


      {/* View All Button */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
        <Button 
          variant="ghost" 
          className="w-full"
          onClick={() => navigate('/dashboard/parents/notifications')}
        >
          <FaEye className="ml-2" />
          عرض جميع الأنشطة
        </Button>
      </div>
    </Card>
  </motion.div>
</div>


      </div>
{/* Quick Actions Section */}
<motion.div
  className="mt-8"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.4 }}
>
  <Card className='dark:bg-black'>
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 ">
      الإجراءات السريعة
    </h2>
    
    {/* Quick Actions Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { 
          label: 'تقييم مدرسة', 
          icon: FaStar, 
          color: 'text-[#64C8CC]',
          action: () => navigate('/dashboard/parents/evaluations'),
          description: 'تقييم مدارس أبنائك ومشاركة تجربتكم'
        },
        { 
          label: 'إرسال رسالة', 
          icon: FaComments, 
          color: 'text-[#30A1DB]',
          action: () => navigate('/dashboard/parents/chat'),
          description: 'التواصل المباشر مع إدارة مدارس أبنائك'
        },
        { 
          label: 'التقارير', 
          icon: FaFileAlt, 
          color: 'text-[#1CB654]',
          action: () => navigate('/dashboard/parents/reports'),
          description: 'عرض جميع التقارير المتعلقة بأبنائك'
        },
        { 
          label: 'التقويم', 
          icon: FaCalendarAlt, 
          color: 'text-[#9F45F2]',
          action: () => navigate('/dashboard/parents/calendar'),
          description: 'عرض التواريخ والفعاليات المهمة'
        }
      ].map((action, index) => {
        // Safe fallback for icon
        const ActionIcon = action.icon || FaInfo;
        
        return (
        <motion.button
          key={action.label}
          className="p-6 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white hover:shadow-lg transition-all duration-200 text-right group flex flex-col items-end"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
          onClick={action.action}
        >
          <ActionIcon className={`text-3xl ${action.color || 'text-gray-500'} mb-4 group-hover:scale-110 transition-transform`} />

          <div className="text-right">
            <p className="font-bold text-lg">{action.label}</p>
            <p className="text-sm opacity-90 mt-1 text-gray-500 dark:text-gray-300">{action.description}</p>
          </div>
        </motion.button>
        );
      })}
    </div>
  </Card>
</motion.div>


    </div>
  );
};

export default ParentsDashboard;