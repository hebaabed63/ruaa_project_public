import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaFileAlt, 
  FaChartLine, 
  FaUserGraduate, 
  FaCalendarCheck,
  FaTrophy,
  FaBook,
  FaTasks,
  FaDownload,
  FaSpinner
} from 'react-icons/fa';
import { useStudentReport } from '../hooks/useStudentReport';
import { useSchools } from '../hooks/useData';

/**
 * Student Report Page Component
 * صفحة تقارير الطلاب
 */
const StudentReportPage = () => {
  const [selectedChild, setSelectedChild] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('2024-2025-1');
  
  const { 
    report, 
    loading, 
    error, 
    availableTerms,
    fetchReport, 
    fetchAvailableTerms,
    exportReport 
  } = useStudentReport();
  
  const { mySchools, loading: schoolsLoading } = useSchools({ myChildren: true });

  // Load available terms on mount
  useEffect(() => {
    fetchAvailableTerms();
  }, [fetchAvailableTerms]);

  // Auto-select first child when schools load
  useEffect(() => {
    if (mySchools && mySchools.length > 0 && !selectedChild) {
      const firstChild = mySchools[0];
      if (firstChild.childName) {
        setSelectedChild(firstChild.id || '1');
      }
    }
  }, [mySchools, selectedChild]);

  // Fetch report when child or term changes
  useEffect(() => {
    if (selectedChild && selectedTerm) {
      fetchReport(selectedChild, selectedTerm);
    }
  }, [selectedChild, selectedTerm, fetchReport]);

  const handleExportPDF = async () => {
    const result = await exportReport(selectedChild, selectedTerm);
    if (result.success) {
      alert('تم تصدير التقرير بنجاح');
    } else {
      alert(result.message || 'فشل في تصدير التقرير');
    }
  };

  return (
    <div className="container mx-auto p-4" dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          <FaFileAlt className="inline ml-3" />
          تقارير الطلاب
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          عرض التقارير التفصيلية لأداء أبنائك الأكاديمي
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Child Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              اختر الطالب
            </label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              disabled={schoolsLoading}
            >
              {schoolsLoading ? (
                <option>جاري التحميل...</option>
              ) : (
                mySchools?.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.childName || school.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Term Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الفصل الدراسي
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              {availableTerms.map((term) => (
                <option key={term.value} value={term.value}>
                  {term.label}
                </option>
              ))}
            </select>
          </div>

          {/* Export Button */}
          <div className="flex items-end">
            <button
              onClick={handleExportPDF}
              disabled={loading || !report}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FaDownload />
              تصدير PDF
            </button>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="animate-spin text-4xl text-primary-500" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center"
        >
          <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
        </motion.div>
      )}

      {/* Report Content */}
      {report && !loading && (
        <div className="space-y-6">
          {/* Summary Section */}
          <ReportSection
            title="ملخص الأداء"
            icon={FaTrophy}
            data={report.summary}
            type="summary"
          />

          {/* Attendance Section */}
          <ReportSection
            title="الحضور والغياب"
            icon={FaCalendarCheck}
            data={report.attendance}
            type="attendance"
          />

          {/* Activity Section */}
          <ReportSection
            title="النشاط والمشاركة"
            icon={FaUserGraduate}
            data={report.activity}
            type="activity"
          />

          {/* Grades Section */}
          <GradesSection grades={report.grades} />

          {/* Homeworks Section */}
          <HomeworksSection homeworks={report.homeworks} />
        </div>
      )}
    </div>
  );
};

/**
 * Report Section Component
 */
const ReportSection = ({ title, icon: Icon, data, type }) => {
  const getBadgeColor = (badge) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      very_good: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      good: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };
    return colors[badge] || colors.good;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <Icon className="text-2xl text-primary-500" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {type === 'summary' && (
          <>
            <StatCard label="الترتيب" value={data.rank_text} />
            <StatCard 
              label="التقدير" 
              value={
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(data.rank_badge)}`}>
                  {data.rank_badge === 'excellent' ? 'ممتاز' : data.rank_badge}
                </span>
              } 
            />
            <StatCard label="المجموع" value={`${data.total_score}/${data.max_score}`} />
            <StatCard label="النسبة المئوية" value={`${data.percentage}%`} />
          </>
        )}

        {type === 'attendance' && (
          <>
            <StatCard label="نسبة الحضور" value={`${data.percentage}%`} />
            <StatCard label="الحالة" value={data.status} />
            <StatCard label="أيام الحضور" value={`${data.present_days}/${data.total_days}`} />
            <StatCard label="أيام الغياب" value={data.absent_days} />
          </>
        )}

        {type === 'activity' && (
          <>
            <StatCard label="نسبة النشاط" value={`${data.percentage}%`} />
            <StatCard label="الحالة" value={data.status} />
            <StatCard label="درجة المشاركة" value={`${data.participation_score}/${data.max_participation}`} />
          </>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Stat Card Component
 */
const StatCard = ({ label, value }) => (
  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
    <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
  </div>
);

/**
 * Grades Section Component
 */
const GradesSection = ({ grades }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
  >
    <div className="flex items-center gap-3 mb-4">
      <FaBook className="text-2xl text-primary-500" />
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">الدرجات</h2>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">المادة</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">الدرجة</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">التقدير</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">الحالة</th>
          </tr>
        </thead>
        <tbody>
          {grades?.map((grade, index) => (
            <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="py-3 px-4 text-gray-900 dark:text-white">{grade.subject}</td>
              <td className="py-3 px-4 text-center text-gray-900 dark:text-white">
                {grade.score}/{grade.out_of}
              </td>
              <td className="py-3 px-4 text-center">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm font-medium">
                  {grade.letter}
                </span>
              </td>
              <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
                {grade.status === 'excellent' ? 'ممتاز' : grade.status === 'very_good' ? 'جيد جداً' : 'جيد'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

/**
 * Homeworks Section Component
 */
const HomeworksSection = ({ homeworks }) => {
  const getStatusColor = (status) => {
    const colors = {
      submitted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      late: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      pending: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status) => {
    const texts = {
      submitted: 'مسلّم',
      late: 'متأخر',
      pending: 'قيد الانتظار',
    };
    return texts[status] || status;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <FaTasks className="text-2xl text-primary-500" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">الواجبات المنزلية</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {homeworks?.map((homework, index) => (
          <div 
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">{homework.subject}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(homework.status)}`}>
                {getStatusText(homework.status)}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{homework.title}</p>
            {homework.score !== null && (
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                الدرجة: {homework.score}/{homework.out_of}
              </p>
            )}
            {homework.submitted_date && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                تاريخ التسليم: {homework.submitted_date}
              </p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default StudentReportPage;
