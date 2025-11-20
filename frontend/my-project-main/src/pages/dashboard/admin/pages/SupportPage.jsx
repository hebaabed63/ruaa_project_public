import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaCheck, FaTrash, FaExclamationTriangle, FaSync } from "react-icons/fa";

// مكون تحميل بديل
const Loading = ({ type = "spinner", size = "md" }) => (
  <div className={`flex justify-center items-center ${size === "lg" ? "py-8" : "py-4"}`}>
    <div className={`animate-spin rounded-full ${
      size === "sm" ? "h-6 w-6" : size === "lg" ? "h-12 w-12" : "h-8 w-8"
    } border-b-2 border-blue-500`}></div>
  </div>
);

// بيانات وهمية للتجربة
const mockTickets = [
  {
    ticket_id: "TICKET_001",
    title: "طلب ميزة جديدة",
    user_name: "خالد يوسف",
    user_email: "khalid@example.com",
    priority: "high",
    status: "resolved",
    description: "أرغب في إضافة ميزة جديدة للنظام",
    created_at: "2024-10-24T14:04:00Z",
    updated_at: "2024-10-25T10:30:00Z"
  },
  {
    ticket_id: "TICKET_002",
    title: "مشكلة في الطباعة",
    user_name: "ليلى علي",
    user_email: "laila@example.com",
    priority: "medium",
    status: "in_progress",
    description: "لا يمكنني طباعة التقارير بشكل صحيح",
    created_at: "2024-10-10T14:04:00Z",
    updated_at: "2024-10-24T09:15:00Z"
  },
  {
    ticket_id: "TICKET_003",
    title: "مشكلة في تسجيل الدخول",
    user_name: "سامي خالد",
    user_email: "sami@example.com",
    priority: "low",
    status: "open",
    description: "لا أستطيع تسجيل الدخول إلى حسابي",
    created_at: "2024-10-02T14:04:00Z",
    updated_at: "2024-10-02T14:04:00Z"
  }
];

const SupportPage = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [tickets, setTickets] = useState(mockTickets);
  const [loading, setLoading] = useState(false);

  // إحصائيات وهمية
  const stats = {
    totalTickets: tickets.length,
    inProgressTickets: tickets.filter(t => t.status === 'in_progress').length,
    resolvedTickets: tickets.filter(t => t.status === 'resolved').length,
    highPriorityTickets: tickets.filter(t => t.priority === 'high').length,
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const handleUpdateStatus = async (ticketId, newStatus) => {
    setLoading(true);
    try {
      // محاكاة API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket.ticket_id === ticketId 
            ? { ...ticket, status: newStatus, updated_at: new Date().toISOString() }
            : ticket
        )
      );
      
      alert(`تم تحديث حالة التذكرة إلى: ${
        newStatus === 'in_progress' ? 'قيد المعالجة' :
        newStatus === 'resolved' ? 'محلولة' : 'مغلقة'
      }`);
    } catch (error) {
      console.error('فشل في تحديث حالة التذكرة:', error);
      alert('فشل في تحديث حالة التذكرة');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه التذكرة؟')) {
      setLoading(true);
      try {
        // محاكاة API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setTickets(prevTickets => 
          prevTickets.filter(ticket => ticket.ticket_id !== ticketId)
        );
        
        alert('تم حذف التذكرة بنجاح');
      } catch (error) {
        console.error('فشل في حذف التذكرة:', error);
        alert('فشل في حذف التذكرة');
      } finally {
        setLoading(false);
      }
    }
  };

  const refetchTickets = () => {
    setLoading(true);
    setTimeout(() => {
      setTickets(mockTickets);
      setLoading(false);
      alert('تم تحديث البيانات');
    }, 1000);
  };

  const renderPriority = (priority) => {
    let bgColor, textColor;
    switch (priority) {
      case "high":
        bgColor = "#FFE5DC";
        textColor = "#7D2C35";
        break;
      case "medium":
        bgColor = "#FFF7BF";
        textColor = "#72511B";
        break;
      case "low":
        bgColor = "#F0FEED";
        textColor = "#259800";
        break;
      default:
        bgColor = "transparent";
        textColor = "black";
    }
    return (
      <div
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium text-sm"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <span
          className="w-2 h-2 rounded-full inline-block"
          style={{ backgroundColor: textColor }}
        ></span>
        {priority === 'high' ? 'عالية' : 
         priority === 'medium' ? 'متوسطة' : 'منخفضة'}
      </div>
    );
  };

  const renderStatus = (status) => {
    let bgColor, textColor;
    switch (status) {
      case "open":
        bgColor = "#E5F3FF";
        textColor = "#0066CC";
        break;
      case "in_progress":
        bgColor = "#FFF7BF";
        textColor = "#72511B";
        break;
      case "resolved":
        bgColor = "#F0FEED";
        textColor = "#259800";
        break;
      case "closed":
        bgColor = "#F3F4F6";
        textColor = "#6B7280";
        break;
      default:
        bgColor = "transparent";
        textColor = "black";
    }
    return (
      <div
        className="inline-flex items-center gap-2 px-3 py-1 rounded-lg font-medium text-sm"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <span
          className="w-2 h-2 rounded-full inline-block"
          style={{ backgroundColor: textColor }}
        ></span>
        {status === 'open' ? 'مفتوحة' :
         status === 'in_progress' ? 'قيد المعالجة' :
         status === 'resolved' ? 'محلولة' : 'مغلقة'}
      </div>
    );
  };

  // حالة التحميل
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loading type="spinner" size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 font-cairo bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">إدارة الدعم الفني</h1>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-center">
          <p className="text-blue-600 dark:text-blue-300 text-sm">الإجمالي</p>
          <p className="text-2xl font-bold">{stats.totalTickets || 0}</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg text-center">
          <p className="text-yellow-600 dark:text-yellow-300 text-sm">قيد المعالجة</p>
          <p className="text-2xl font-bold">{stats.inProgressTickets || 0}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg text-center">
          <p className="text-green-600 dark:text-green-300 text-sm">تم الحل</p>
          <p className="text-2xl font-bold">{stats.resolvedTickets || 0}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg text-center">
          <p className="text-red-600 dark:text-red-300 text-sm">عالية الأولوية</p>
          <p className="text-2xl font-bold">{stats.highPriorityTickets || 0}</p>
        </div>
      </div>

      {/* جدول التذاكر */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border rounded-lg">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-200 font-bold">
              <th className="py-2 px-4 border">العنوان</th>
              <th className="py-2 px-4 border">المرسل</th>
              <th className="py-2 px-4 border">البريد الإلكتروني</th>
              <th className="py-2 px-4 border">الأولوية</th>
              <th className="py-2 px-4 border">الحالة</th>
              <th className="py-2 px-4 border">تاريخ الإنشاء</th>
              <th className="py-2 px-4 border">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <motion.tr
                key={ticket.ticket_id || index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="py-2 px-4">{ticket.title}</td>
                <td className="py-2 px-4">{ticket.user_name}</td>
                <td className="py-2 px-4 text-gray-500">{ticket.user_email}</td>
                <td className="py-2 px-4">{renderPriority(ticket.priority)}</td>
                <td className="py-2 px-4">{renderStatus(ticket.status)}</td>
                <td className="py-2 px-4 text-gray-500">
                  {new Date(ticket.created_at).toLocaleDateString('ar-EG')}
                </td>
                <td className="py-2 px-4 flex justify-center gap-2">
                  <button 
                    onClick={() => handleViewTicket(ticket)}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-2"
                  >
                    <FaEye />
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(ticket.ticket_id, 'resolved')}
                    className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 p-2"
                  >
                    <FaCheck />
                  </button>
                  <button 
                    onClick={() => handleDeleteTicket(ticket.ticket_id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2"
                  >
                    <FaTrash />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {tickets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            لا توجد تذاكر دعم حالياً
          </div>
        )}
      </div>

      {/* زر تحديث البيانات */}
      <div className="flex justify-center mt-6">
        <button
          onClick={refetchTickets}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <FaSync />
          تحديث البيانات
        </button>
      </div>

      {/* نافذة تفاصيل التذكرة */}
      {showTicketModal && selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          onClose={() => setShowTicketModal(false)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

// مكون نافذة تفاصيل التذكرة
const TicketDetailsModal = ({ ticket, onClose, onUpdateStatus }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">تفاصيل التذكرة</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="font-semibold">العنوان:</label>
              <p className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded">{ticket.title}</p>
            </div>
            
            <div>
              <label className="font-semibold">الوصف:</label>
              <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded min-h-[100px]">
                {ticket.description || 'لا يوجد وصف متوفر'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold">المرسل:</label>
                <p className="mt-1">{ticket.user_name}</p>
              </div>
              <div>
                <label className="font-semibold">البريد الإلكتروني:</label>
                <p className="mt-1">{ticket.user_email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold">الأولوية:</label>
                <div className="mt-1">
                  {ticket.priority === "high" ? "عالية" : 
                   ticket.priority === "medium" ? "متوسطة" : "منخفضة"}
                </div>
              </div>
              <div>
                <label className="font-semibold">الحالة:</label>
                <div className="mt-1">
                  {ticket.status === "open" ? "مفتوحة" :
                   ticket.status === "in_progress" ? "قيد المعالجة" :
                   ticket.status === "resolved" ? "محلولة" : "مغلقة"}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold">تاريخ الإنشاء:</label>
                <p className="mt-1">{new Date(ticket.created_at).toLocaleString('ar-EG')}</p>
              </div>
              <div>
                <label className="font-semibold">آخر تحديث:</label>
                <p className="mt-1">{new Date(ticket.updated_at).toLocaleString('ar-EG')}</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6 pt-4 border-t justify-center">
            <button
              onClick={() => onUpdateStatus(ticket.ticket_id, 'in_progress')}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              وضع قيد المعالجة
            </button>
            <button
              onClick={() => onUpdateStatus(ticket.ticket_id, 'resolved')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              تم الحل
            </button>
            <button
              onClick={() => onUpdateStatus(ticket.ticket_id, 'closed')}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              إغلاق التذكرة
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SupportPage;