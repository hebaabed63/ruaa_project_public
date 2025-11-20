import api from "./api";

// ===========================================
// Admin Dashboard Statistics Services
// ===========================================

// Get dashboard statistics
export const getDashboardStatistics = async () => {
  try {
    const response = await api.get("/admin/dashboard/stats");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب إحصائيات لوحة التحكم");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get recent registrations
export const getRecentRegistrations = async () => {
  try {
    const response = await api.get("/admin/dashboard/recent-registrations");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب أحدث التسجيلات");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Admin Profile Services
export const getAdminProfile = async () => {
  try {
    const response = await api.get("/admin/profile");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب بيانات الملف الشخصي");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

export const updateAdminProfile = async (profileData) => {
  try {
    const response = await api.put("/admin/profile", profileData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMsg = error.response.data.message || error.response.data.errors || "فشل في تحديث الملف الشخصي";
      throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

export const updateAdminAvatar = async (formData) => {
  try {
    const response = await api.post("/admin/profile/avatar", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في تحديث صورة الملف الشخصي");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

export const changeAdminPassword = async (passwordData) => {
  try {
    const response = await api.post("/admin/profile/change-password", passwordData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMsg = error.response.data.message || error.response.data.errors || "فشل في تغيير كلمة المرور";
      throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// ===========================================
// Admin Support Tickets Services
// ===========================================

// Get all support tickets
export const getAllSupportTickets = async () => {
  try {
    const response = await api.get("/admin/support/tickets");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جبل تذاكر الدعم");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get support ticket by ID
export const getSupportTicketById = async (ticketId) => {
  try {
    const response = await api.get(`/admin/support/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب تفاصيل التذكرة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Update support ticket status
export const updateSupportTicketStatus = async (ticketId, status) => {
  try {
    const response = await api.put(`/admin/support/tickets/${ticketId}/status`, { status });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في تحديث حالة التذكرة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Delete support ticket
export const deleteSupportTicket = async (ticketId) => {
  try {
    const response = await api.delete(`/admin/support/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في حذف التذكرة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get support tickets statistics
export const getSupportTicketsStats = async () => {
  try {
    const response = await api.get("/admin/support/tickets/stats");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب إحصائيات التذاكر");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// ===========================================
// Admin Complaints Services
// ===========================================

// Get all complaints
export const getAllComplaints = async () => {
  try {
    const response = await api.get("/admin/complaints");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب الشكاوى");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get complaint by ID
export const getComplaintById = async (complaintId) => {
  try {
    const response = await api.get(`/admin/complaints/${complaintId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب تفاصيل الشكوى");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Update complaint status
export const updateComplaintStatus = async (complaintId, status) => {
  try {
    const response = await api.put(`/admin/complaints/${complaintId}/status`, { status });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في تحديث حالة الشكوى");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Delete complaint
export const deleteComplaint = async (complaintId) => {
  try {
    const response = await api.delete(`/admin/complaints/${complaintId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في حذف الشكوى");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get complaints statistics
export const getComplaintsStats = async () => {
  try {
    const response = await api.get("/admin/complaints/stats");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب إحصائيات الشكاوى");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// ===========================================
// Admin Invitations Management Services - UPDATED
// ===========================================

// Get invitations statistics
export const getSupervisorLinksStatistics = async () => {
  try {
    const response = await api.get("/admin/links/statistics");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب إحصائيات روابط المشرفين");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get all invitations - UPDATED
export const getSupervisorLinks = async () => {
  try {
    const response = await api.get("/admin/links");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب روابط المشرفين");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Create new invitation - UPDATED
export const createSupervisorLink = async (data) => {
  try {
    console.log('🔄 Creating supervisor link with data:', data);
    console.log('🌐 API Base URL:', process.env.REACT_APP_API_URL);
    
    const response = await api.post("/admin/links", {
      institution: data.institution,
      expiration: data.expiration || null,
      usages: data.usages || null
    });
    
    console.log('✅ Link created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating link:', error);
    console.error('📡 Error details:', error.response);
    
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في إنشاء رابط المشرف");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Update invitation - UPDATED
export const updateSupervisorLink = async (id, data) => {
  try {
    const response = await api.put(`/admin/links/${id}`, {
      institution: data.institution,
      expiration: data.expiration || null,
      usages: data.usages || null,
      status: data.status || 'active'
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMsg = error.response.data.message || error.response.data.errors || "فشل في تحديث رابط المشرف";
      throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Delete invitation
export const deleteSupervisorLink = async (id) => {
  try {
    const response = await api.delete(`/admin/links/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في حذف رابط المشرف");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get pending supervisors
export const getPendingSupervisors = async () => {
  try {
    const response = await api.get("/admin/users/pending");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب طلبات المشرفين المعلقة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Approve pending supervisor
export const approvePendingSupervisor = async (userId) => {
  try {
    const response = await api.post(`/admin/users/${userId}/approve`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في الموافقة على المشرف");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Reject pending supervisor
export const rejectPendingSupervisor = async (userId) => {
  try {
    const response = await api.post(`/admin/users/${userId}/reject`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في رفض المشرف");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// ===========================================
// Admin User Management Services
// ===========================================

// Get all users with filters
export const getAllUsers = async (filters = {}) => {
  try {
    const response = await api.get("/admin/users", { params: filters });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب المستخدمين");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب بيانات المستخدم");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Update user status
export const updateUserStatus = async (userId, status) => {
  try {
    const response = await api.put(`/admin/users/${userId}/status`, { status });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في تحديث حالة المستخدم");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Create user
export const createUser = async (userData) => {
  try {
    const response = await api.post("/admin/users", userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMsg = error.response.data.message || error.response.data.errors || "فشل في إنشاء المستخدم";
      throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Update user
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMsg = error.response.data.message || error.response.data.errors || "فشل في تحديث المستخدم";
      throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في حذف المستخدم");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// ===========================================
// Admin School Management Services
// ===========================================

// Get all schools
export const getAllSchools = async (filters = {}) => {
  try {
    const response = await api.get("/admin/schools", { params: filters });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب المدارس");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get school by ID
export const getSchoolById = async (schoolId) => {
  try {
    const response = await api.get(`/admin/schools/${schoolId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب بيانات المدرسة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Create new school
export const createSchool = async (schoolData) => {
  try {
    const response = await api.post("/admin/schools", schoolData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMsg = error.response.data.message || error.response.data.errors || "فشل في إنشاء المدرسة";
      throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Update school
export const updateSchool = async (schoolId, schoolData) => {
  try {
    const response = await api.put(`/admin/schools/${schoolId}`, schoolData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMsg = error.response.data.message || error.response.data.errors || "فشل في تحديث المدرسة";
      throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Delete school
export const deleteSchool = async (schoolId) => {
  try {
    const response = await api.delete(`/admin/schools/${schoolId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في حذف المدرسة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// ===========================================
// Admin Reports Management Services
// ===========================================

// Get all reports
export const getAllReports = async (filters = {}) => {
  try {
    const response = await api.get("/admin/reports", { params: filters });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب التقارير");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get report by ID
export const getReportById = async (reportId) => {
  try {
    const response = await api.get(`/admin/reports/${reportId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب تفاصيل التقرير");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Update report status
export const updateReportStatus = async (reportId, status, reviewNotes = '') => {
  try {
    const response = await api.put(`/admin/reports/${reportId}/status`, { 
      status, 
      review_notes: reviewNotes 
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في تحديث حالة التقرير");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Delete report
export const deleteReport = async (reportId) => {
  try {
    const response = await api.delete(`/admin/reports/${reportId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في حذف التقرير");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// ===========================================
// Admin Reports Analytics Services
// ===========================================

// Get reports schools data
export const getReportsSchools = async (filters = {}) => {
  try {
    const response = await api.get("/admin/reports/schools", { params: filters });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب بيانات المدارس");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get reports summary data
export const getReportsSummary = async (filters = {}) => {
  try {
    const response = await api.get("/admin/reports/summary", { params: filters });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب ملخص التقارير");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get reports comparison data
export const getReportsComparison = async (filters = {}) => {
  try {
    const response = await api.get("/admin/reports/comparison", { params: filters });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب بيانات المقارنات");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get detailed school report
export const getSchoolReport = async (schoolId) => {
  try {
    const response = await api.get(`/admin/reports/schools/${schoolId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب تقرير المدرسة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Export report
export const exportReport = async (exportData) => {
  try {
    const response = await api.post("/admin/reports/export", exportData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في تصدير التقرير");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// ===========================================
// Public Invitation Services - NEW
// ===========================================

// Validate invitation token
export const validateInvitationToken = async (token) => {
  try {
    const response = await api.get(`/public/invite/${token}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "رابط الدعوة غير صالح أو منتهي الصلاحية");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Register supervisor using invitation
export const registerWithInvitation = async (token, userData) => {
  try {
    const response = await api.post(`/public/invite/${token}/register`, userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMsg = error.response.data.message || error.response.data.errors || "فشل في التسجيل باستخدام رابط الدعوة";
      throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// ===========================================
// Admin System Settings Services
// ===========================================

// Get system settings
export const getSystemSettings = async () => {
  try {
    const response = await api.get("/admin/settings");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب إعدادات النظام");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Update system settings
export const updateSystemSettings = async (settingsData) => {
  try {
    const response = await api.put("/admin/settings", settingsData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMsg = error.response.data.message || error.response.data.errors || "فشل في تحديث إعدادات النظام";
      throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// ===========================================
// Helper Functions - UPDATED
// ===========================================

/**
 * وظيفة مساعدة لتحويل بيانات الـ Backend إلى تنسيق الـ Frontend
 */
export const transformDashboardData = (backendData) => {
  if (!backendData || !backendData.success) {
    return {
      totalUsers: 0,
      activeUsers: 0,
      schools: 0,
      supportTickets: 0,
      totalLinks: 0,
      activeLinks: 0,
      pendingUsers: 0,
      recentRegistrations: []
    };
  }

  const data = backendData.data;
  
  return {
    totalUsers: data.totalUsers || 0,
    activeUsers: data.activeUsers || 0,
    schools: data.totalSchools || 0,
    supportTickets: data.totalReports || 0,
    totalLinks: data.totalInvitations || 0,
    activeLinks: data.activeInvitations || 0,
    pendingUsers: data.pendingUsers || 0,
    recentRegistrations: data.recentRegistrations || []
  };
};

/**
 * وظيفة مساعدة لإنشاء رابط الدعوة الكامل
 */
export const generateInvitationLink = (token) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/invite/${token}`;
};

/**
 * وظيفة مساعدة لنسخ الرابط إلى الحافظة
 */
export const copyToClipboard = (text) => {
  return navigator.clipboard.writeText(text);
};

// Default export object
const adminService = {
  // Dashboard
  getDashboardStatistics,
  getRecentRegistrations,
  
  // Admin Profile
  getAdminProfile,
  updateAdminProfile,
  updateAdminAvatar,
  changeAdminPassword,
  
  // System Settings
  getSystemSettings,
  updateSystemSettings,
  
  // Support Tickets
  getAllSupportTickets,
  getSupportTicketById,
  updateSupportTicketStatus,
  deleteSupportTicket,
  getSupportTicketsStats,
  
  // Complaints
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  getComplaintsStats,
  
  // Invitations Management
  getSupervisorLinksStatistics,
  getSupervisorLinks,
  createSupervisorLink,
  updateSupervisorLink,
  deleteSupervisorLink,
  getPendingSupervisors,
  approvePendingSupervisor,
  rejectPendingSupervisor,
  
  // Public Invitations
  validateInvitationToken,
  registerWithInvitation,
  
  // Users
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
  
  // Schools
  getAllSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
  
  // Reports Management
  getAllReports,
  getReportById,
  updateReportStatus,
  deleteReport,
  
  // Reports Analytics
  getReportsSchools,
  getReportsSummary,
  getReportsComparison,
  getSchoolReport,
  exportReport,
  
  // Helper Functions
  transformDashboardData,
  generateInvitationLink,
  copyToClipboard
};

export default adminService;