import React, { useState, useEffect } from "react";
import { FaSearch, FaEye, FaTrash, FaCheck, FaExclamationTriangle, FaSync } from "react-icons/fa";
import { motion } from "framer-motion";
import { showAlert } from "../../../../utils/SweetAlert";
import { 
  getAllComplaints, 
  getComplaintById, 
  updateComplaintStatus, 
  deleteComplaint,
  getComplaintsStats 
} from "../../../../services/adminService";

// مكون تحميل بديل
const Loading = ({ type = "spinner", size = "md" }) => (
  <div className={`flex justify-center items-center ${size === "lg" ? "py-8" : "py-4"}`}>
    <div className={`animate-spin rounded-full ${
      size === "sm" ? "h-6 w-6" : size === "lg" ? "h-12 w-12" : "h-8 w-8"
    } border-b-2 border-blue-500`}></div>
  </div>
);

export default function ComplaintsPage() {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentTable, setCurrentTable] = useState("all");
  const [currentPages, setCurrentPages] = useState({
    all: 1,
    admins: 1,
    supervisors: 1,
    schoolManagers: 1,
  });

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch complaints on component mount
  useEffect(() => {
    fetchComplaints();
    fetchComplaintsStats();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await getAllComplaints();
      if (response.success) {
        setComplaints(response.data || []);
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في جلب الشكاوى');
    } finally {
      setLoading(false);
    }
  };

  const fetchComplaintsStats = async () => {
    try {
      const response = await getComplaintsStats();
      if (response.success) {
        setStats(response.data || {});
      }
    } catch (error) {
      console.error('Error fetching complaints stats:', error);
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
        showAlert('success', `تم ${status === 'resolved' ? 'حل' : 'تحديث حالة'} الشكوى بنجاح`);
        fetchComplaints();
        fetchComplaintsStats();
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
          fetchComplaints();
          fetchComplaintsStats();
        }
      } catch (error) {
        showAlert('error', error.message || 'حدث خطأ في حذف الشكوى');
      }
    }
  };

  // Filter complaints by user role
  const filterComplaintsByRole = (role) => {
    if (role === "all") return complaints;
    
    const roleMap = {
      "admins": "parent",
      "supervisors": "supervisor", 
      "schoolManagers": "school_manager"
    };
    
    return complaints.filter(complaint => {
      const userRole = complaint.user?.role || complaint.role;
      return userRole === roleMap[role];
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-xs font-semibold bg-[#FEEDED] text-[#DC2626]">
            مفتوحة
            <span className="w-2 h-2 rounded-full bg-current inline-block"></span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-xs font-semibold bg-[#EDF5FE] text-[#3083FF]">
            قيد المعالجة
            <span className="w-2 h-2 rounded-full bg-current inline-block"></span>
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-xs font-semibold bg-[#F0FEED] text-[#259800]">
            محلولة
            <span className="w-2 h-2 rounded-full bg-current inline-block"></span>
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            مغلقة
            <span className="w-2 h-2 rounded-full bg-current inline-block"></span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            غير معروفة
            <span className="w-2 h-2 rounded-full bg-current inline-block"></span>
          </span>
        );
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case 'parent': return 'ولي أمر';
      case 'supervisor': return 'مشرف';
      case 'school_manager': return 'مدير مدرسة';
      case 'admin': return 'مدير نظام';
      default: return role;
    }
  };

  const getComplaintTypeName = (type) => {
    switch (type) {
      case 'technical': return 'تقنية';
      case 'service': return 'خدمة';
      case 'other': return 'أخرى';
      default: return type;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generatePages = (totalPages, currentPage) => {
    const delta = 2; 
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    let lastPage = 0;
    for (let i of range) {
      if (i - lastPage > 1) {
        rangeWithDots.push("dots");
      }
      rangeWithDots.push(i);
      lastPage = i;
    }

    return rangeWithDots;
  };

  const renderTable = (data, tableKey) => {
    const currentPage = currentPages[tableKey];
    const totalPages = Math.ceil(data.length / rowsPerPage);

    const goToPage = (page) => {
      setCurrentPages({ ...currentPages, [tableKey]: page });
    };

    const pages = generatePages(totalPages, currentPage);

    if (loading) {
      return <Loading size="lg" />;
    }

    if (data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          لا توجد شكاوى لعرضها
        </div>
      );
    }

    return (
      <div className="mt-4">
        <div className="grid grid-cols-6 font-bold bg-gray-100 dark:bg-gray-800 p-2 text-right text-gray-500 dark:text-gray-200 rounded-t-lg">
          <div>اسم الشكوى</div>
          <div>دور المستخدم</div>
          <div>نوع الشكوى</div>
          <div>التاريخ</div>
          <div>حالة الشكوى</div>
          <div>الإجراءات</div>
        </div>

        {/* Rows */}
        <div className="space-y-2 p-2">
          {data
            .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
            .map((complaint, index) => (
              <motion.div
                key={complaint.id || complaint.complaint_id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="grid grid-cols-6 bg-white dark:bg-gray-700 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
              >
                <div className="text-gray-800 dark:text-gray-300 truncate" title={complaint.title}>
                  {complaint.title}
                </div>
                <div className="text-gray-500 dark:text-gray-300">
                  {getRoleName(complaint.user?.role || complaint.role)}
                </div>
                <div className="text-gray-500 dark:text-gray-300">
                  {getComplaintTypeName(complaint.complaint_type)}
                </div>
                <div className="text-gray-500 dark:text-gray-300">
                  {formatDate(complaint.created_at)}
                </div>
                <div>
                  {getStatusBadge(complaint.status)}
                </div>
                <div className="flex justify-center gap-2">
                  <button 
                    onClick={() => handleViewComplaint(complaint.id || complaint.complaint_id)}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                    title="عرض التفاصيل"
                  >
                    <FaEye />
                  </button>
                  {complaint.status !== 'resolved' && complaint.status !== 'closed' && (
                    <button 
                      onClick={() => handleUpdateStatus(complaint.id || complaint.complaint_id, 'resolved')}
                      className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 p-1"
                      title="حل الشكوى"
                    >
                      <FaCheck />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteComplaint(complaint.id || complaint.complaint_id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                    title="حذف الشكوى"
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="relative flex items-center px-4 py-2 mt-4">
            <div className="absolute left-0 flex items-center gap-2">
              <span className="text-sm text-slate-950 dark:text-gray-200">صفوف</span>
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); goToPage(1); }}
                className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-slate-950 dark:text-gray-200">عرض</span>
            </div>

            <div className="flex justify-center items-center gap-1 w-full">
              <button
                className="px-2 py-1 border rounded bg-gray-200 dark:bg-gray-600 dark:text-gray-200"
                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                &lt;
              </button>

              {pages.map((page, idx) =>
                page === "dots" ? (
                  <span key={idx} className="px-2 dark:text-gray-200">..</span>
                ) : (
                  <button
                    key={idx}
                    className={`px-2 py-1 rounded ${
                      currentPage === page 
                        ? "bg-[#64C8CC] text-white" 
                        : "bg-gray-200 dark:bg-gray-600 dark:text-gray-200"
                    }`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                className="px-2 py-1 border rounded bg-gray-200 dark:bg-gray-600 dark:text-gray-200"
                onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8" dir="rtl">
      <div className="text-right mb-6">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">إدارة الشكاوى</h1>
        <p className="text-gray-600 dark:text-gray-400">مراقبة وإدارة جميع الشكاوى في النظام</p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-center">
          <p className="text-blue-600 dark:text-blue-300 text-sm">الإجمالي</p>
          <p className="text-2xl font-bold">{stats.totalComplaints || 0}</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg text-center">
          <p className="text-yellow-600 dark:text-yellow-300 text-sm">قيد المعالجة</p>
          <p className="text-2xl font-bold">{stats.inProgressComplaints || 0}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg text-center">
          <p className="text-green-600 dark:text-green-300 text-sm">تم الحل</p>
          <p className="text-2xl font-bold">{stats.resolvedComplaints || 0}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg text-center">
          <p className="text-red-600 dark:text-red-300 text-sm">شكاوى تقنية</p>
          <p className="text-2xl font-bold">{stats.technicalComplaints || 0}</p>
        </div>
      </div>

      {/* زر تحديث البيانات */}
      <div className="flex justify-end mb-4">
        <button
          onClick={fetchComplaints}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <FaSync />
          تحديث البيانات
        </button>
      </div>

      <div className="mb-6 border-b-2 border-gray-300 dark:border-gray-700">
        <div className="flex gap-4">
          {[
            { key: "all", label: "شكاوي جميع المستخدمين" },
            { key: "supervisors", label: "المشرفون" },
            { key: "schoolManagers", label: "مديرو المدارس" },
            { key: "admins", label: "أولياء الأمور" },
          ].map((tab) => {
            let selectedColorClass = "";
            if (tab.key === "admins" || tab.key === "schoolManagers" || tab.key === "supervisors" ) {
              selectedColorClass = "text-green-600 border-green-600";
            } else if (tab.key === "all") {
              selectedColorClass = "text-blue-600 border-blue-600";
            }

            return (
              <button
                key={tab.key}
                onClick={() => setCurrentTable(tab.key)}
                className={`px-4 py-2 font-medium transition-colors duration-200 border-b-2 ${
                  currentTable === tab.key
                    ? `${selectedColorClass} -mb-[2px]`
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {renderTable(filterComplaintsByRole(currentTable), currentTable)}

      {/* نافذة تفاصيل الشكوى */}
      {showDetailsModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">تفاصيل الشكوى</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">العنوان</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  {selectedComplaint.title}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">المرسل</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedComplaint.user?.name || selectedComplaint.user_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedComplaint.user?.email || selectedComplaint.user_email}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">نوع الشكوى</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {getComplaintTypeName(selectedComplaint.complaint_type)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الحالة</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedComplaint.status)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">تاريخ الإرسال</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {formatDate(selectedComplaint.created_at)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">آخر تحديث</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {formatDate(selectedComplaint.updated_at)}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الوصف</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap p-3 bg-gray-50 dark:bg-gray-700 rounded min-h-[100px]">
                  {selectedComplaint.description || 'لا يوجد وصف متوفر'}
                </p>
              </div>
              
              {selectedComplaint.attachment_url && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">المرفق</label>
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
              
              <div className="flex gap-3 pt-4 border-t justify-center">
                {selectedComplaint.status !== 'resolved' && selectedComplaint.status !== 'closed' && (
                  <>
                    <button
                      onClick={() => {
                        handleUpdateStatus(selectedComplaint.id || selectedComplaint.complaint_id, 'resolved');
                        setShowDetailsModal(false);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      حل الشكوى
                    </button>
                    <button
                      onClick={() => {
                        handleUpdateStatus(selectedComplaint.id || selectedComplaint.complaint_id, 'in_progress');
                        setShowDetailsModal(false);
                      }}
                      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                    >
                      وضع قيد المعالجة
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowDetailsModal(false)}
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