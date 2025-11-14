import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { showAlert } from "../../utils/SweetAlert";
import { 
  getPendingUsers,
  approvePendingUser,
  rejectPendingUser
} from "../../services/adminService";

export default function PendingRequestsManagement() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending users on component mount
  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const response = await getPendingUsers();
      if (response.success) {
        setPendingUsers(response.data);
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في جلب الطلبات المعلقة');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      const response = await approvePendingUser(userId);
      if (response.success) {
        showAlert('success', 'تمت الموافقة على المستخدم بنجاح');
        fetchPendingUsers(); // Refresh the list
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في الموافقة على المستخدم');
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      const response = await rejectPendingUser(userId);
      if (response.success) {
        showAlert('success', 'تم رفض المستخدم بنجاح');
        fetchPendingUsers(); // Refresh the list
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في رفض المستخدم');
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
        <h1 className="text-2xl font-bold text-gray-800">طلبات التسجيل المعلقة</h1>
      </div>

      {pendingUsers.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الاسم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    البريد الإلكتروني
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الدور
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ الطلب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingUsers.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.role === 'supervisor' && 'مشرف'}
                        {user.role === 'school_manager' && 'مدير مدرسة'}
                        {user.role === 'parent' && 'ولي أمر'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          onClick={() => handleApproveUser(user.user_id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center"
                        >
                          <FaCheck className="ml-1" />
                          موافقة
                        </button>
                        <button
                          onClick={() => handleRejectUser(user.user_id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center"
                        >
                          <FaTimes className="ml-1" />
                          رفض
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات معلقة</h3>
          <p className="text-gray-500">جميع الطلبات تمت معالجتها</p>
        </div>
      )}
    </div>
  );
}