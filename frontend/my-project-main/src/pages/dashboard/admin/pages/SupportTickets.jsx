import React, { useState, useEffect } from "react";
import { FaSpinner, FaEye, FaTrash, FaReply, FaCheck } from 'react-icons/fa';
import { showAlert } from "../../../../utils/SweetAlert";
import { 
  getAllSupportTickets,
  getSupportTicketById,
  updateSupportTicketStatus,
  deleteSupportTicket
} from "../../../../services/adminService";

export default function SupportTicketsManagement() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch support tickets on component mount
  useEffect(() => {
    fetchSupportTickets();
  }, []);

  const fetchSupportTickets = async () => {
    setLoading(true);
    try {
      const response = await getAllSupportTickets();
      if (response.success) {
        setTickets(response.data);
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في جلب تذاكر الدعم');
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = async (ticketId) => {
    try {
      const response = await getSupportTicketById(ticketId);
      if (response.success) {
        setSelectedTicket(response.data);
        setShowDetailsModal(true);
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في جلب تفاصيل التذكرة');
    }
  };

  const handleUpdateStatus = async (ticketId, status) => {
    try {
      const response = await updateSupportTicketStatus(ticketId, status);
      if (response.success) {
        showAlert('success', `تم ${status === 'resolved' ? 'حل' : 'إغلاق'} التذكرة بنجاح`);
        fetchSupportTickets(); // Refresh the list
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في تحديث حالة التذكرة');
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    const result = await showAlert(
      'warning',
      'هل أنت متأكد من حذف هذه التذكرة؟',
      'لا يمكن التراجع عن هذا الإجراء',
      'نعم، احذفها!',
      'إلغاء'
    );
    
    if (result.isConfirmed) {
      try {
        const response = await deleteSupportTicket(ticketId);
        if (response.success) {
          showAlert('success', 'تم حذف التذكرة بنجاح');
          fetchSupportTickets(); // Refresh the list
        }
      } catch (error) {
        showAlert('error', error.message || 'حدث خطأ في حذف التذكرة');
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

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          عالية
        </span>;
      case 'medium':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          متوسطة
        </span>;
      case 'low':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          منخفضة
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          غير معروفة
        </span>;
    }
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
        <h1 className="text-2xl font-bold text-gray-800">إدارة تذاكر الدعم الفني</h1>
      </div>

      {tickets.length > 0 ? (
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
                    الأولوية
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
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
                {tickets.map((ticket) => (
                  <tr key={ticket.ticket_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ticket.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.user_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(ticket.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(ticket.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          onClick={() => handleViewTicket(ticket.ticket_id)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="عرض التفاصيل"
                        >
                          <FaEye />
                        </button>
                        {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(ticket.ticket_id, 'resolved')}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="حل التذكرة"
                            >
                              <FaCheck />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteTicket(ticket.ticket_id)}
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تذاكر دعم</h3>
          <p className="text-gray-500">لا توجد تذاكر دعم لعرضها</p>
        </div>
      )}

      {/* Ticket Details Modal */}
      {showDetailsModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">تفاصيل التذكرة</h3>
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
                <p className="mt-1 text-sm text-gray-900">{selectedTicket.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">المرسل</label>
                <p className="mt-1 text-sm text-gray-900">{selectedTicket.user_name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                <p className="mt-1 text-sm text-gray-900">{selectedTicket.user_email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">الأولوية</label>
                <p className="mt-1 text-sm text-gray-900">
                  {getPriorityBadge(selectedTicket.priority)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">الحالة</label>
                <p className="mt-1 text-sm text-gray-900">
                  {getStatusBadge(selectedTicket.status)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">تاريخ الإنشاء</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(selectedTicket.created_at)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">الوصف</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>
              
              {selectedTicket.attachment_url && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">المرفق</label>
                  <a 
                    href={selectedTicket.attachment_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-1 text-sm text-blue-600 hover:underline"
                  >
                    عرض المرفق
                  </a>
                </div>
              )}
              
              <div className="flex space-x-4 space-x-reverse pt-4">
                {selectedTicket.status !== 'resolved' && selectedTicket.status !== 'closed' && (
                  <>
                    <button
                      onClick={() => {
                        handleUpdateStatus(selectedTicket.ticket_id, 'resolved');
                        setShowDetailsModal(false);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                    >
                      حل التذكرة
                    </button>
                    <button
                      onClick={() => {
                        handleUpdateStatus(selectedTicket.ticket_id, 'closed');
                        setShowDetailsModal(false);
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                    >
                      إغلاق التذكرة
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
