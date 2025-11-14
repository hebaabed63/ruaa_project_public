import React, { useState, useEffect } from "react";
import { FaSpinner, FaEye, FaTrash, FaDownload } from 'react-icons/fa';
import { showAlert } from "../../utils/SweetAlert";
import { 
  getAllReports,
  getReportById,
  deleteReport,
  exportReport
} from "../../services/adminService";

export default function ReportsManagement() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await getAllReports();
      if (response.success) {
        setReports(response.data);
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في جلب التقارير');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = async (reportId) => {
    try {
      const response = await getReportById(reportId);
      if (response.success) {
        setSelectedReport(response.data);
        setShowDetailsModal(true);
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في جلب تفاصيل التقرير');
    }
  };

  const handleDeleteReport = async (reportId) => {
    const result = await showAlert(
      'warning',
      'هل أنت متأكد من حذف هذا التقرير؟',
      'لا يمكن التراجع عن هذا الإجراء',
      'نعم، احذفه!',
      'إلغاء'
    );
    
    if (result.isConfirmed) {
      try {
        const response = await deleteReport(reportId);
        if (response.success) {
          showAlert('success', 'تم حذف التقرير بنجاح');
          fetchReports(); // Refresh the list
        }
      } catch (error) {
        showAlert('error', error.message || 'حدث خطأ في حذف التقرير');
      }
    }
  };

  const handleExportReport = async (reportId) => {
    try {
      const response = await exportReport(reportId);
      // Create a blob from the response data
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showAlert('success', 'تم تصدير التقرير بنجاح');
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في تصدير التقرير');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'user_activity':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          نشاط المستخدمين
        </span>;
      case 'school_performance':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          أداء المدارس
        </span>;
      case 'financial':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          مالي
        </span>;
      case 'system_logs':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          سجلات النظام
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          غير محدد
        </span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">إدارة التقارير</h1>
      </div>

      {reports.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العنوان
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    النوع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ الإنشاء
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.report_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(report.report_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(report.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          onClick={() => handleViewReport(report.report_id)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="عرض التفاصيل"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleExportReport(report.report_id)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="تصدير"
                        >
                          <FaDownload />
                        </button>
                        <button
                          onClick={() => handleDeleteReport(report.report_id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="حذف"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تقارير</h3>
          <p className="text-gray-500">لا توجد تقارير لعرضها</p>
        </div>
      )}

      {/* Report Details Modal */}
      {showDetailsModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">تفاصيل التقرير</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">العنوان</label>
                <p className="mt-1 text-sm text-gray-900">{selectedReport.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">النوع</label>
                <p className="mt-1 text-sm text-gray-900">
                  {getTypeBadge(selectedReport.report_type)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">تاريخ الإنشاء</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(selectedReport.created_at)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">الوصف</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{selectedReport.description}</p>
              </div>
              
              <div className="flex space-x-4 space-x-reverse pt-4">
                <button
                  onClick={() => handleExportReport(selectedReport.report_id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <FaDownload className="ml-2" />
                  تصدير التقرير
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}