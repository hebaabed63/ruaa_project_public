import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaSchool,
  FaStar, 
  FaChartLine,
  FaComments,
  FaBell,
  FaCalendarAlt,
  FaFileAlt
} from 'react-icons/fa';

import { Card, Loading } from '../components/ui';
import { useDashboardStats } from '../hooks/useSupervisorData';
import { useSupervisorProfile } from '../hooks/useSupervisorData';

// Import the custom hook for charts data
import { useChartsData } from '../hooks/useChartsData';

import Chart from "./Charts/NumEvaluationChart";
import PerformanceChart from './Charts/PerformanceChart';
import EvaluationCriteriaChart from './Charts/EvaluationCriteriaChart';
import EducationStagesChart from './Charts/EducationStagesChart';

// ======= Gauge Component =======
const Gauge = ({ value = 1.2, max = 1.8 }) => {
  const ticks = 15;
  const radius = 80;
  const center = radius + 20;
  const angleStart = -180;
  const angleEnd = 20;
  const angleRange = angleEnd - angleStart;
  const needleAngle = angleStart + (value / max) * angleRange;
  const needleRadians = (needleAngle * Math.PI) / 180;
  const needleLength = radius - 20;
  const needleX = center + needleLength * Math.cos(needleRadians);
  const needleY = center + needleLength * Math.sin(needleRadians);

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="200">
        {/* Base Arc */}
        <path
          d={`M${center - radius},${center} A${radius},${radius} 0 0,1 ${center + radius},${center}`}
          fill="none"
          stroke="#d1d5db"
          strokeWidth="15"
          strokeLinecap="round"
        />
        {/* Progress Arc */}
        <path
          d={`M${center - radius},${center} A${radius},${radius} 0 0,1 ${center + radius},${center}`}
          fill="none"
          stroke="#64C8CC"
          strokeWidth="15"
          strokeDasharray={`${(value / max) * Math.PI * radius},${Math.PI * radius}`}
          strokeLinecap="round"
        />
        {/* Ticks */}
        {[...Array(ticks)].map((_, i) => {
          const angle = angleStart + (i / ticks) * angleRange;
          const rad = (angle * Math.PI) / 180;
          const outerRadius = radius - 10;
          const innerRadius = radius - 18;
          const x1 = center + innerRadius * Math.cos(rad);
          const y1 = center + innerRadius * Math.sin(rad);
          const x2 = center + outerRadius * Math.cos(rad);
          const y2 = center + outerRadius * Math.sin(rad);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#999" strokeWidth="2" />;
        })}
        {/* Center Circle */}
        <circle cx={center} cy={center} r="6" fill="none" stroke="#64C8CC" strokeWidth="4" />
        {/* Needle */}
        <polygon
          points={`${center - 4},${center} ${center + 4},${center} ${center},${center - needleLength}`}
          fill="#64C8CC"
          transform={`rotate(${needleAngle} ${center} ${center})`}
        />
      </svg>
      <p className="text-center dark:text-white font-semibold mt-2">النتيجة: {value.toFixed(3)}</p>
    </div>
  );
};

// ======= StatsCard Component =======
const StatsCard = ({ title, value, icon: Icon, color, loading = false, suffix, index }) => {
  const colorClasses = {
    primary: 'text-primary-500',
    success: 'text-green-500', 
    warning: 'text-purple-500',
    danger: 'text-cyan-500',
    info: 'text-black-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        ease: "easeOut",
        delay: index * 0.1 
      }}
      whileHover={{ 
        y: -10,
        scale: 1.03,
        transition: { duration: 0.3 }
      }}
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

// ======= SupervisorsDashboard Page =======
const SupervisorsDashboard = () => {
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useSupervisorProfile();
  const { stats, loading: statsLoading } = useDashboardStats();
  const { chartsData, loading: chartsLoading } = useChartsData();

  const quickActions = [
    { label: 'تقييم مدرسة', icon: FaStar, color: 'text-[#64C8CC]', action: () => navigate('/dashboard/supervisor/evaluations'), description: 'تقييم مدارس' },
    { label: 'إرسال رسالة', icon: FaComments, color: 'text-[#30A1DB]', action: () => navigate('/dashboard/supervisor/chat'), description: 'التواصل المباشر مع إدارة المدارس' },
    { label: 'التقارير', icon: FaFileAlt, color: 'text-[#1CB654]', action: () => navigate('/dashboard/supervisor/reports'), description: 'عرض جميع التقارير' },
    { label: 'التقويم', icon: FaCalendarAlt, color: 'text-[#9F45F2]', action: () => navigate('/dashboard/supervisor/calendar'), description: 'عرض التواريخ والفعاليات المهمة' }
  ];

  return (
    <div className="container mx-auto bg-white dark:bg-gray-900 p-4 transition-colors" dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          ease: "easeOut" 
        }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          أهلا {profile?.fullName?.split(' ')[0] || 'مشرف'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          هذه لوحة التحكّم الخاصَّة بك لمتابعة المدارس والتقييمات.
        </p>
      </motion.div>

      {/* Top Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
      >
        <StatsCard title="مدارس" value={statsLoading ? '...' : stats?.totalSchools || 0} suffix="من المدارس التي تُشرِف عليها" icon={FaSchool} color="danger" loading={statsLoading} index={0} />
        <StatsCard title="التقييمات المجدولة" value="لديك 2 زيارة للمدارس هذا الأسبوع" icon={FaCalendarAlt} color="warning" index={1} />
        <StatsCard title="التقييمات النشطة" value={statsLoading ? '...' : stats?.activeEvaluations || 0} suffix="تقييم" icon={FaChartLine} color="success" loading={statsLoading} index={2} />
        <StatsCard title="الإشعارات الجديدة" value={statsLoading ? '...' : stats?.pendingNotifications || 0} suffix="إشعارات" icon={FaBell} color="info" loading={statsLoading} index={3} />
      </motion.div>

      {/* Charts Section */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      >
        <motion.div
          className="bg-[#F9F9FA] dark:bg-gray-700 p-4 rounded-xl col-span-1"
          whileHover={{ 
            y: -5,
            transition: { duration: 0.3 }
          }}
        >
          <div className="border border-[#E5E7E9] dark:border-gray-600 rounded-xl p-4 bg-[#F9F9FA] dark:bg-gray-700">
            <motion.h3 
              className="text-gray-700 dark:text-gray-200 font-bold mb-4 text-right"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              الأداء
            </motion.h3>
            <div className="border border-gray-300 dark:border-gray-600 rounded-xl p-4 bg-[#F9F9FA] dark:bg-gray-700">
              <div className="flex justify-between items-center p-3 rounded-md mb-6 bg-gray-50 dark:bg-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#64C8CC] rounded-sm"></div>
                  <span className="text-gray-700 dark:text-gray-200 font-semibold">عدد التقييمات</span>
                </div>
                <select className="border border-[#EFF1F3] dark:border-gray-600 bg-[#EFF1F3] dark:bg-gray-600 text-black dark:text-white rounded-md p-1">
                  <option>Monthly</option>
                </select>
              </div>
              <Gauge value={1.2} max={1.8} />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-[#F9F9FA] dark:bg-gray-700 p-4 rounded-xl col-span-2"
          whileHover={{ 
            y: -5,
            transition: { duration: 0.3 }
          }}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
        >
          <Chart />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          className="bg-[#F9F9FA] dark:bg-gray-700 p-4 rounded-xl shadow-md h-fit"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.6 }}
          whileHover={{ 
            y: -5,
            transition: { duration: 0.3 }
          }}
        >
          <EducationStagesChart />
        </motion.div>
        <motion.div 
          className="bg-[#F9F9FA] dark:bg-gray-700 p-4 rounded-xl shadow-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.7 }}
          whileHover={{ 
            y: -5,
            transition: { duration: 0.3 }
          }}
        >
          <EvaluationCriteriaChart />
        </motion.div>
      </div>

      <motion.div 
        className="bg-[#F9F9FA] dark:bg-gray-700 p-4 rounded-xl shadow-md h-fit my-5"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.8 }}
        whileHover={{ 
          y: -5,
          transition: { duration: 0.3 }
        }}
      >
        <PerformanceChart />
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="mt-8" 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.9 }}
      >
        <Card className="!bg-[#F9F9FA] dark:!bg-gray-700">
          <motion.h2 
            className="text-xl font-bold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            الإجراءات السريعة
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                className="p-6 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center text-center group"
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  ease: "easeOut",
                  delay: 1.1 + index * 0.1 
                }}
                onClick={action.action}
              >
                <action.icon className={`text-3xl ${action.color} mb-4 group-hover:scale-110 transition-transform self-end`} />
                <div className="text-center">
                  <p className="font-bold text-lg">{action.label}</p>
                  <p className="text-sm opacity-90 mt-1 text-gray-500 dark:text-gray-300">{action.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SupervisorsDashboard;
