import React, { useState, useEffect } from "react";
import { FaSpinner, FaEye, FaTrash, FaCheck } from 'react-icons/fa';
import { showAlert } from "../../../../utils/SweetAlert";
import { 
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint
} from "../../../../services/adminService";

export default function ComplaintsManagement() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch complaints on component mount
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await getAllComplaints();
      if (response.success) {
        setComplaints(response.data);
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في جلب الشكاوى');
    } finally {
      setLoading(false);
    }
  };

  const handleViewComplaint = async (complaintId) => {
    try {
      const response = await getComplaintById(complaintId);
      if (response.success) {
        setSelectedComplaint(response.data);
        setShowDetailsModal(true);
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في جلب تفاصيل الشكوى');
    }
  };

  const handleUpdateStatus = async (complaintId, status) => {
    try {
      const response = await updateComplaintStatus(complaintId, status);
      if (response.success) {
        showAlert('success', `تم ${status === 'resolved' ? 'حل' : 'إغلاق'} الشكوى بنجاح`);
        fetchComplaints(); // Refresh the list
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في تحديث حالة الشكوى');
    }
  };

  const handleDeleteComplaint = async (complaintId) => {
    const result = await showAlert(
      'warning',
      'هل أنت متأكد من حذف هذه الشكوى؟',
      'لا يمكن التراجع عن هذا الإجراء',
      'نعم، احذفها!',
      'إلغاء'
    );
    
    if (result.isConfirmed) {
      try {
        const response = await deleteComplaint(complaintId);
        if (response.success) {
          showAlert('success', 'تم حذف الشكوى بنجاح');
          fetchComplaints(); // Refresh the list
        }
      } catch (error) {
        showAlert('error', error.message || 'حدث خطأ في حذف الشكوى');
      }
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          مفتوحة
        </span>;
      case 'in_progress':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          قيد المعالجة
        </span>;
      case 'resolved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          محلولة
        </span>;
      case 'closed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          مغلقة
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          غير معروفة
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
        <h1 className="text-2xl font-bold text-gray-800">إدارة الشكاوى</h1>
      </div>

      {complaints.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العنوان
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المرسل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    النوع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ الإرسال
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {complaints.map((complaint) => (
                  <tr key={complaint.complaint_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {complaint.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {complaint.user_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {complaint.complaint_type === 'technical' && 'تقنية'}
                      {complaint.complaint_type === 'service' && 'خدمة'}
                      {complaint.complaint_type === 'other' && 'أخرى'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(complaint.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(complaint.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          onClick={() => handleViewComplaint(complaint.complaint_id)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="عرض التفاصيل"
                        >
                          <FaEye />
                        </button>
                        {complaint.status !== 'resolved' && complaint.status !== 'closed' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(complaint.complaint_id, 'resolved')}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="حل الشكوى"
                            >
                              <FaCheck />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteComplaint(complaint.complaint_id)}
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد شكاوى</h3>
          <p className="text-gray-500">لا توجد شكاوى لعرضها</p>
        </div>
      )}

      {/* Complaint Details Modal */}
      {showDetailsModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">تفاصيل الشكوى</h3>
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
                <p className="mt-1 text-sm text-gray-900">{selectedComplaint.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">المرسل</label>
                <p className="mt-1 text-sm text-gray-900">{selectedComplaint.user_name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                <p className="mt-1 text-sm text-gray-900">{selectedComplaint.user_email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">نوع الشكوى</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedComplaint.complaint_type === 'technical' && 'تقنية'}
                  {selectedComplaint.complaint_type === 'service' && 'خدمة'}
                  {selectedComplaint.complaint_type === 'other' && 'أخرى'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">الحالة</label>
                <p className="mt-1 text-sm text-gray-900">
                  {getStatusBadge(selectedComplaint.status)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">تاريخ الإرسال</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(selectedComplaint.created_at)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">الوصف</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{selectedComplaint.description}</p>
              </div>
              
              {selectedComplaint.attachment_url && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">المرفق</label>
                  <a 
                    href={selectedComplaint.attachment_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-1 text-sm text-blue-600 hover:underline"
                  >
                    عرض المرفق
                  </a>
                </div>
              )}
              
              <div className="flex space-x-4 space-x-reverse pt-4">
                {selectedComplaint.status !== 'resolved' && selectedComplaint.status !== 'closed' && (
                  <>
                    <button
                      onClick={() => {
                        handleUpdateStatus(selectedComplaint.complaint_id, 'resolved');
                        setShowDetailsModal(false);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                    >
                      حل الشكوى
                    </button>
                    <button
                      onClick={() => {
                        handleUpdateStatus(selectedComplaint.complaint_id, 'closed');
                        setShowDetailsModal(false);
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                    >
                      إغلاق الشكوى
                    </button>
                  </>
                )}
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