import React, { useState, useEffect } from "react";
import { 
  FaSearch, 
  FaEye, 
  FaDownload, 
  FaChartLine, 
  FaSchool, 
  FaUserTie, 
  FaUsers,
  FaSync,
  FaExclamationTriangle
} from "react-icons/fa";
import { motion } from "framer-motion";
import { showAlert } from "../../../../utils/SweetAlert";
import { 
  useReportsSchools, 
  useReportsSummary, 
  useReportsComparison,
  useExportReport 
} from "../hooks/useAdminReports";

// مكون تحميل بديل
const Loading = ({ type = "spinner", size = "md" }) => (
  <div className={`flex justify-center items-center ${size === "lg" ? "py-8" : "py-4"}`}>
    <div className={`animate-spin rounded-full ${
      size === "sm" ? "h-6 w-6" : size === "lg" ? "h-12 w-12" : "h-8 w-8"
    } border-b-2 border-blue-500`}></div>
  </div>
);

// مكون بطاقة الإحصائيات
const StatsCard = ({ title, value, icon: Icon, color, loading = false }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    green: 'bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-300',
    yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg text-center ${colorClasses[color]}`}
    >
      <div className="flex justify-center mb-2">
        <Icon className="text-2xl" />
      </div>
      <p className="text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold">
        {loading ? '...' : value}
      </p>
    </motion.div>
  );
};

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("summary");
  const [filters, setFilters] = useState({
    region: "",
    school_type: "",
    supervisor_id: "",
    date_range: "month"
  });
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [showSchoolModal, setShowSchoolModal] = useState(false);

  // استخدام الـ hooks
  const { 
    data: schoolsData, 
    loading: schoolsLoading, 
    error: schoolsError,
    refetch: refetchSchools 
  } = useReportsSchools(filters);

  const { 
    data: summaryData, 
    loading: summaryLoading, 
    error: summaryError,
    refetch: refetchSummary 
  } = useReportsSummary(filters);

  const { 
    data: comparisonData, 
    loading: comparisonLoading, 
    error: comparisonError,
    refetch: refetchComparison 
  } = useReportsComparison(filters);

  const exportMutation = useExportReport();

  const schools = schoolsData?.data || [];
  const summary = summaryData?.data || {};
  const comparison = comparisonData?.data || {};

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = async (exportType) => {
    try {
      await exportMutation.mutateAsync({
        export_type: exportType,
        report_data: {
          schools,
          summary,
          comparison,
          filters
        }
      });
      showAlert('success', `تم تصدير التقرير بنجاح كـ ${exportType}`);
    } catch (error) {
      showAlert('error', error.message || 'فشل في تصدير التقرير');
    }
  };

  const handleViewSchool = (school) => {
    setSelectedSchool(school);
    setShowSchoolModal(true);
  };

  const refetchAll = () => {
    refetchSchools();
    refetchSummary();
    refetchComparison();
  };

  // حالة الخطأ العام
  if (schoolsError || summaryError || comparisonError) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-8" dir="rtl">
        <div className="text-center py-8">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <p className="text-red-500 text-lg mb-4">فشل في تحميل بيانات التقارير</p>
          <button 
            onClick={refetchAll}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8" dir="rtl">
      <div className="text-right mb-6">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">التقارير والإحصائيات</h1>
        <p className="text-gray-600 dark:text-gray-400">مراقبة وتحليل جميع التقارير في النظام</p>
      </div>

      {/* فلترة البيانات */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المنطقة</label>
            <select
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">جميع المناطق</option>
              <option value="الرياض">الرياض</option>
              <option value="مكة">مكة</option>
              <option value="الشرقية">الشرقية</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نوع المدرسة</label>
            <select
              value={filters.school_type}
              onChange={(e) => handleFilterChange('school_type', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">جميع الأنواع</option>
              <option value="حكومية">حكومية</option>
              <option value="أهلية">أهلية</option>
              <option value="دولية">دولية</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الفترة الزمنية</label>
            <select
              value={filters.date_range}
              onChange={(e) => handleFilterChange('date_range', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="week">أسبوع</option>
              <option value="month">شهر</option>
              <option value="quarter">ربع سنوي</option>
              <option value="year">سنوي</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={refetchAll}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors w-full justify-center"
            >
              <FaSync />
              تحديث البيانات
            </button>
          </div>
        </div>

        {/* أزرار التصدير */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            disabled={exportMutation.isLoading}
          >
            <FaDownload />
            تصدير PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            disabled={exportMutation.isLoading}
          >
            <FaDownload />
            تصدير Excel
          </button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard 
          title="إجمالي المدارس" 
          value={summary.total_schools || 0} 
          icon={FaSchool} 
          color="blue" 
          loading={summaryLoading} 
        />
        <StatsCard 
          title="إجمالي التقييمات" 
          value={summary.total_evaluations || 0} 
          icon={FaChartLine} 
          color="green" 
          loading={summaryLoading} 
        />
        <StatsCard 
          title="متوسط التقييم" 
          value={summary.average_rating || 0} 
          icon={FaUserTie} 
          color="yellow" 
          loading={summaryLoading} 
        />
        <StatsCard 
          title="المشرفون النشطون" 
          value={summary.active_supervisors || 0} 
          icon={FaUsers} 
          color="purple" 
          loading={summaryLoading} 
        />
      </div>

      {/* تبويبات التقارير */}
      <div className="mb-6 border-b-2 border-gray-300 dark:border-gray-700">
        <div className="flex gap-4">
          {[
            { key: "summary", label: "ملخص التقارير", icon: FaChartLine },
            { key: "schools", label: "تقارير المدارس", icon: FaSchool },
            { key: "comparison", label: "المقارنات", icon: FaUsers },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors duration-200 border-b-2 ${
                activeTab === tab.key
                  ? "text-blue-600 border-blue-600 -mb-[2px]"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* محتوى التبويبات */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        {activeTab === "summary" && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">ملخص التقارير</h3>
            {summaryLoading ? (
              <Loading size="lg" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">التوزيع حسب النوع</h4>
                  {/* يمكن إضافة مخطط دائري هنا */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                    <p className="text-center text-gray-500">مخطط التوزيع سيظهر هنا</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">الأداء عبر الزمن</h4>
                  {/* يمكن إضافة مخطط خطي هنا */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                    <p className="text-center text-gray-500">مخطط الأداء سيظهر هنا</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "schools" && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">تقارير المدارس</h3>
            {schoolsLoading ? (
              <Loading size="lg" />
            ) : schools.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                لا توجد مدارس متاحة
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-600">
                      <th className="py-3 px-4 text-right text-gray-500 dark:text-gray-200 font-bold">اسم المدرسة</th>
                      <th className="py-3 px-4 text-right text-gray-500 dark:text-gray-200 font-bold">المشرف</th>
                      <th className="py-3 px-4 text-right text-gray-500 dark:text-gray-200 font-bold">المنطقة</th>
                      <th className="py-3 px-4 text-right text-gray-500 dark:text-gray-200 font-bold">عدد التقييمات</th>
                      <th className="py-3 px-4 text-right text-gray-500 dark:text-gray-200 font-bold">متوسط التقييم</th>
                      <th className="py-3 px-4 text-right text-gray-500 dark:text-gray-200 font-bold">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schools.map((school, index) => (
                      <motion.tr
                        key={school.school_id || index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-100">
                          {school.school_name}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-500 dark:text-gray-300">
                          {school.supervisor_name}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-500 dark:text-gray-300">
                          {school.region}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-500 dark:text-gray-300">
                          {school.evaluations_count}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-500 dark:text-gray-300">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            school.average_rating >= 4 ? 'bg-green-100 text-green-800' :
                            school.average_rating >= 3 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {school.average_rating}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleViewSchool(school)}
                            className="text-blue-500 hover:text-blue-700 p-1"
                            title="عرض التفاصيل"
                          >
                            <FaEye />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "comparison" && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">المقارنات والإحصائيات</h3>
            {comparisonLoading ? (
              <Loading size="lg" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">أفضل 5 مدارس</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                    {comparison.top_schools?.names?.map((name, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b dark:border-gray-600">
                        <span className="text-gray-900 dark:text-gray-100">{name}</span>
                        <span className="text-green-600 font-semibold">
                          {comparison.top_schools?.ratings?.[index] || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">توزيع المدارس حسب النوع</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                    {Object.entries(comparison.school_type_distribution || {}).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center py-2 border-b dark:border-gray-600">
                        <span className="text-gray-900 dark:text-gray-100">
                          {type === 'حكومية' ? 'حكومية' : type === 'أهلية' ? 'أهلية' : 'دولية'}
                        </span>
                        <span className="text-blue-600 font-semibold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* نافذة تفاصيل المدرسة */}
      {showSchoolModal && selectedSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">تفاصيل المدرسة</h3>
              <button
                onClick={() => setShowSchoolModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">اسم المدرسة</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedSchool.school_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">المشرف</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedSchool.supervisor_name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">المنطقة</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedSchool.region}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">نوع المدرسة</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedSchool.school_type}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">عدد التقييمات</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedSchool.evaluations_count}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">متوسط التقييم</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedSchool.average_rating >= 4 ? 'bg-green-100 text-green-800' :
                      selectedSchool.average_rating >= 3 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedSchool.average_rating}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t justify-center">
                <button
                  onClick={() => setShowSchoolModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}