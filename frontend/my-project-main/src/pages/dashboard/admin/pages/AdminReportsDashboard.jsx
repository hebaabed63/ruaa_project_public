import React, { useState, useEffect, useMemo } from "react";
import { 
  FaFilter, 
  FaDownload, 
  FaEye, 
  FaChartLine, 
  FaSchool,
  FaStar,
  FaClipboardList,
  FaUsers,
  FaUserFriends
} from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { showAlert } from "../../../../utils/SweetAlert";
import { 
  getReportsSchools,
  getReportsSummary,
  getReportsComparison,
  exportAdminReports,
  getSchoolReport
} from "../../../../services/adminService";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminReportsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [schoolsData, setSchoolsData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [filters, setFilters] = useState({
    region: "",
    schoolType: "",
    supervisorId: "",
    dateRange: "month"
  });

  // Filter options
  const regions = ["الرياض", "جدة", "مكة", "المدينة", "الدمام", "الخبر"];
  const schoolTypes = ["ابتدائي", "متوسط", "ثانوي", "تعليم خاص"];
  const dateRanges = [
    { value: "week", label: "الأسبوع الماضي" },
    { value: "month", label: "الشهر الماضي" },
    { value: "quarter", label: "الربع الأخير" },
    { value: "year", label: "السنة الماضية" }
  ];

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [schoolsResponse, summaryResponse, comparisonResponse] = await Promise.all([
        getReportsSchools(filters),
        getReportsSummary(filters),
        getReportsComparison(filters)
      ]);

      if (schoolsResponse.success) {
        setSchoolsData(schoolsResponse.data);
      }

      if (summaryResponse.success) {
        setSummaryData(summaryResponse.data);
      }

      if (comparisonResponse.success) {
        setComparisonData(comparisonResponse.data);
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchData();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Handle export report
  const handleExportReport = async (exportType) => {
    try {
      const response = await exportAdminReports({
        export_type: exportType,
        report_data: schoolsData
      });
      
      if (response.success) {
        showAlert('success', `تم تصدير التقرير كـ ${exportType.toUpperCase()} بنجاح`);
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في تصدير التقرير');
    }
  };

  // Handle view school report
  const handleViewSchoolReport = async (schoolId) => {
    try {
      const response = await getSchoolReport(schoolId);
      if (response.success) {
        setSelectedSchool(response.data);
        setShowSchoolModal(true);
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في جلب تقرير المدرسة');
    }
  };

  // Chart data
  const lineChartData = useMemo(() => {
    if (!comparisonData?.performance_over_time) return null;
    
    return {
      labels: comparisonData.performance_over_time.map(item => item.month),
      datasets: [
        {
          label: 'الأداء العام',
          data: comparisonData.performance_over_time.map(item => item.average_rating),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        }
      ]
    };
  }, [comparisonData]);

  const barChartData = useMemo(() => {
    if (!comparisonData?.top_schools) return null;
    
    return {
      labels: comparisonData.top_schools.names,
      datasets: [
        {
          label: 'التقييم المتوسط',
          data: comparisonData.top_schools.ratings,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  }, [comparisonData]);

  const pieChartData = useMemo(() => {
    if (!comparisonData?.school_type_distribution) return null;
    
    const labels = Object.keys(comparisonData.school_type_distribution);
    const data = Object.values(comparisonData.school_type_distribution);
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  }, [comparisonData]);

  // Chart options
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'الأداء العام للمدارس عبر الزمن'
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'أفضل 5 مدارس من حيث التقييم'
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'توزيع المدارس حسب النوع'
      }
    }
  };

  // Get performance level color
  const getPerformanceColor = (rating) => {
    if (rating >= 4.0) return "text-green-600";
    if (rating >= 3.0) return "text-yellow-600";
    return "text-red-600";
  };

  // Get performance level badge
  const getPerformanceBadge = (rating) => {
    if (rating >= 4.0) return "🟢 عالي";
    if (rating >= 3.0) return "🟡 متوسط";
    return "🔴 منخفض";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تقارير الأداء</h1>
          <p className="text-gray-600 mt-1">تحليل شامل لأداء المدارس والمستخدمين</p>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <button
            onClick={() => handleExportReport('excel')}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaDownload />
            <span>تصدير Excel</span>
          </button>
          <button
            onClick={() => handleExportReport('pdf')}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaDownload />
            <span>تصدير PDF</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <FiFilter className="text-lg" />
            <span className="font-medium">الفلاتر:</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
            <select
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع المناطق</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            
            <select
              value={filters.schoolType}
              onChange={(e) => handleFilterChange('schoolType', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع الأنواع</option>
              {schoolTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <select
              value={filters.supervisorId}
              onChange={(e) => handleFilterChange('supervisorId', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع المشرفين</option>
              <option value="1">أحمد محمد</option>
              <option value="2">فاطمة علي</option>
              <option value="3">خالد سعد</option>
            </select>
            
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {dateRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {summaryData && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي المدارس</p>
                <p className="text-2xl font-bold text-gray-900">{summaryData.total_schools}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaSchool className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي التقييمات</p>
                <p className="text-2xl font-bold text-gray-900">{summaryData.total_evaluations}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FaStar className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">التقييم المتوسط</p>
                <p className="text-2xl font-bold text-gray-900">{summaryData.average_rating}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FaClipboardList className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">المشرفين النشطين</p>
                <p className="text-2xl font-bold text-gray-900">{summaryData.active_supervisors}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaUsers className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">الوالدين النشطين</p>
                <p className="text-2xl font-bold text-gray-900">{summaryData.active_parents}</p>
              </div>
              <div className="bg-pink-100 p-3 rounded-lg">
                <FaUserFriends className="text-pink-600 text-xl" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {comparisonData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
          
          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
          
          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 lg:col-span-2">
            <div className="max-w-2xl mx-auto">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>
        </div>
      )}

      {/* Detailed Reports Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">تقارير المدارس التفصيلية</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  اسم المدرسة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التقييم المتوسط
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عدد التقييمات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المشرف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المنطقة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schoolsData.map((school) => (
                <tr key={school.school_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {school.school_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${getPerformanceColor(school.average_rating)}`}>
                      {school.average_rating} {getPerformanceBadge(school.average_rating)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {school.evaluations_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {school.supervisor_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {school.region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {school.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewSchoolReport(school.school_id)}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                    >
                      <FaEye />
                      <span>عرض</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* School Report Modal */}
      {showSchoolModal && selectedSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  تقرير تفصيلي - {selectedSchool.school.name}
                </h3>
                <button
                  onClick={() => setShowSchoolModal(false)}
                  className="text-gray-400 hover:text-gray-500 text-2xl"
                >
                  &times;
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* School Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">معلومات المدرسة</h4>
                  <div className="space-y-2">
                    <p><span className="text-gray-600">الاسم:</span> {selectedSchool.school.name}</p>
                    <p><span className="text-gray-600">المنطقة:</span> {selectedSchool.school.region}</p>
                    <p><span className="text-gray-600">النوع:</span> {selectedSchool.school.type}</p>
                    <p><span className="text-gray-600">المشرف:</span> {selectedSchool.school.supervisor_name}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">الإحصائيات</h4>
                  <div className="space-y-2">
                    <p><span className="text-gray-600">إجمالي التقييمات:</span> {selectedSchool.statistics.total_evaluations}</p>
                    <p>
                      <span className="text-gray-600">التقييم المتوسط:</span> 
                      <span className={`font-medium ${getPerformanceColor(selectedSchool.statistics.average_rating)} mr-2`}>
                        {selectedSchool.statistics.average_rating}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Criteria Breakdown */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">تحليل التقييم حسب المعايير</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(selectedSchool.statistics.criteria_averages).map(([criteria, average]) => (
                    <div key={criteria} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">{criteria}</span>
                        <span className={`font-medium ${getPerformanceColor(average)}`}>
                          {average}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            average >= 4.0 ? 'bg-green-500' : 
                            average >= 3.0 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(average / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowSchoolModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
                >
                  إغلاق
                </button>
                <button
                  onClick={() => {
                    // Here you would implement the send to supervisor functionality
                    showAlert('info', 'سيتم تنفيذ هذه الميزة في النسخة القادمة');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <FaUsers />
                  <span>إرسال إلى المشرف</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReportsDashboard;