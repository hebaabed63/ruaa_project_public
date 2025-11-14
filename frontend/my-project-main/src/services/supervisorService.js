import api from "../api/axios";

// ===========================================
// Supervisor Dashboard Services
// ===========================================

// Get supervisor dashboard statistics
export const getSupervisorDashboardStats = async () => {
  try {
    const response = await api.get("/supervisor/dashboard/stats");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب إحصائيات لوحة التحكم");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get evaluation chart data
export const getEvaluationChartData = async () => {
  try {
    const response = await api.get("/supervisor/dashboard/charts/evaluations");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب بيانات التقييمات");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get performance chart data
export const getPerformanceChartData = async () => {
  try {
    const response = await api.get("/supervisor/dashboard/charts/performance");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب بيانات الأداء");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// ===========================================
// Supervisor Profile Services
// ===========================================

// Get supervisor profile
export const getSupervisorProfile = async () => {
  try {
    const response = await api.get("/supervisor/profile");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب بيانات المشرف");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Update supervisor profile
export const updateSupervisorProfile = async (profileData) => {
  try {
    const response = await api.put("/supervisor/profile", profileData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMsg = error.response.data.message || error.response.data.errors || "فشل في تحديث البيانات";
      throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Update supervisor avatar
export const updateSupervisorAvatar = async (avatarFile) => {
  try {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    const response = await api.post("/supervisor/profile/avatar", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في تحديث الصورة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Change supervisor password
export const changeSupervisorPassword = async (passwordData) => {
  try {
    const response = await api.post("/supervisor/profile/password", passwordData);
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
// Supervisor Schools Management Services
// ===========================================

// Get schools managed by supervisor
export const getSupervisorSchools = async () => {
  try {
    const response = await api.get("/supervisor/schools");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب المدارس");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Add school to supervision
export const addSchoolToSupervision = async (schoolId) => {
  try {
    const response = await api.post("/supervisor/schools", { school_id: schoolId });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في إضافة المدرسة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Remove school from supervision
export const removeSchoolFromSupervision = async (schoolId) => {
  try {
    const response = await api.delete(`/supervisor/schools/${schoolId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في إزالة المدرسة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get available schools for supervision
export const getAvailableSchools = async () => {
  try {
    const response = await api.get("/supervisor/schools/available");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب المدارس المتاحة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get school details
export const getSchoolDetails = async (schoolId) => {
  try {
    const response = await api.get(`/supervisor/schools/${schoolId}/details`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب تفاصيل المدرسة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// ===========================================
// Supervisor Reports Services
// ===========================================

// Get supervisor reports
export const getSupervisorReports = async () => {
  try {
    const response = await api.get("/supervisor/reports");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب التقارير");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get report details
export const getSupervisorReportDetails = async (reportId) => {
  try {
    const response = await api.get(`/supervisor/reports/${reportId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب تفاصيل التقرير");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Create new report
export const createSupervisorReport = async (reportData) => {
  try {
    const response = await api.post("/supervisor/reports", reportData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMsg = error.response.data.message || error.response.data.errors || "فشل في إنشاء التقرير";
      throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Update report
export const updateSupervisorReport = async (reportId, reportData) => {
  try {
    const response = await api.put(`/supervisor/reports/${reportId}`, reportData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في تحديث التقرير");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Delete report
export const deleteSupervisorReport = async (reportId) => {
  try {
    const response = await api.delete(`/supervisor/reports/${reportId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في حذف التقرير");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get reports statistics
export const getReportsStatistics = async () => {
  try {
    const response = await api.get("/supervisor/reports/statistics");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب إحصائيات التقارير");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// ===========================================
// Supervisor Invitations Services
// ===========================================

// Get supervisor invitations
export const getSupervisorInvitations = async () => {
  try {
    const response = await api.get("/supervisor/invitations");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب الدعوات");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Create supervisor invitation
export const createSupervisorInvitation = async (invitationData) => {
  try {
    const response = await api.post("/supervisor/invitations", invitationData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMsg = error.response.data.message || error.response.data.errors || "فشل في إنشاء الدعوة";
      throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Update supervisor invitation
export const updateSupervisorInvitation = async (invitationId, invitationData) => {
  try {
    const response = await api.put(`/supervisor/invitations/${invitationId}`, invitationData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في تحديث الدعوة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Delete supervisor invitation
export const deleteSupervisorInvitation = async (invitationId) => {
  try {
    const response = await api.delete(`/supervisor/invitations/${invitationId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في حذف الدعوة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get invitations statistics
export const getInvitationsStatistics = async () => {
  try {
    const response = await api.get("/supervisor/invitations/statistics");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب إحصائيات الدعوات");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// ===========================================
// Supervisor Principals Management Services
// ===========================================

// Get pending principals
export const getSupervisorPendingPrincipals = async () => {
  try {
    const response = await api.get("/supervisor/principals/pending");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب طلبات مدراء المدارس المعلقة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get active principals
export const getSupervisorActivePrincipals = async () => {
  try {
    const response = await api.get("/supervisor/principals/active");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب مدراء المدارس النشطين");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Approve pending principal
export const approveSupervisorPendingPrincipal = async (userId) => {
  try {
    const response = await api.post(`/supervisor/principals/${userId}/approve`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في الموافقة على طلب مدير المدرسة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Reject pending principal
export const rejectSupervisorPendingPrincipal = async (userId) => {
  try {
    const response = await api.post(`/supervisor/principals/${userId}/reject`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في رفض طلب مدير المدرسة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get principals statistics
export const getPrincipalsStatistics = async () => {
  try {
    const response = await api.get("/supervisor/principals/statistics");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب إحصائيات مدراء المدارس");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// ===========================================
// Supervisor Principal Links Services
// ===========================================

// Get principal invitation links
export const getSupervisorPrincipalLinks = async () => {
  try {
    const response = await api.get("/supervisor/principal-links");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب روابط الدعوة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Create principal invitation link
export const createSupervisorPrincipalLink = async (data) => {
  try {
    const response = await api.post("/supervisor/principal-links", data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMsg = error.response.data.message || error.response.data.errors || "فشل في إنشاء رابط الدعوة";
      throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Update principal invitation link
export const updateSupervisorPrincipalLink = async (linkId, data) => {
  try {
    const response = await api.put(`/supervisor/principal-links/${linkId}`, data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في تحديث رابط الدعوة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Delete principal invitation link
export const deleteSupervisorPrincipalLink = async (linkId) => {
  try {
    const response = await api.delete(`/supervisor/principal-links/${linkId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في حذف رابط الدعوة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// ===========================================
// Supervisor Support Tickets Services
// ===========================================

// Get supervisor support tickets
export const getSupervisorSupportTickets = async () => {
  try {
    const response = await api.get("/supervisor/support-tickets");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب تذاكر الدعم الفني");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Create supervisor support ticket
export const createSupervisorSupportTicket = async (ticketData) => {
  try {
    const response = await api.post("/supervisor/support-tickets", ticketData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMsg = error.response.data.message || error.response.data.errors || "فشل في إنشاء تذكرة الدعم الفني";
      throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// ===========================================
// Supervisor Notifications Services
// ===========================================

// Get supervisor notifications
export const getSupervisorNotifications = async () => {
  try {
    const response = await api.get("/supervisor/notifications");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب الإشعارات");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Mark notification as read
export const markSupervisorNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/supervisor/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في تحديث الإشعار");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// ===========================================
// Export all services as object
// ===========================================

const supervisorService = {
  // Dashboard
  getDashboardStats: getSupervisorDashboardStats,
  getEvaluationChartData,
  getPerformanceChartData,
  
  // Profile
  getProfile: getSupervisorProfile,
  updateProfile: updateSupervisorProfile,
  updateAvatar: updateSupervisorAvatar,
  changePassword: changeSupervisorPassword,
  
  // Schools
  getSchools: getSupervisorSchools,
  addSchoolToSupervision,
  removeSchoolFromSupervision,
  getAvailableSchools,
  getSchoolDetails,
  
  // Reports
  getReports: getSupervisorReports,
  getReportDetails: getSupervisorReportDetails,
  createReport: createSupervisorReport,
  updateReport: updateSupervisorReport,
  deleteReport: deleteSupervisorReport,
  getReportsStatistics,
  
  // Invitations
  getInvitations: getSupervisorInvitations,
  createInvitation: createSupervisorInvitation,
  updateInvitation: updateSupervisorInvitation,
  deleteInvitation: deleteSupervisorInvitation,
  getInvitationsStatistics,
  
  // Principals
  getPendingPrincipals: getSupervisorPendingPrincipals,
  getActivePrincipals: getSupervisorActivePrincipals,
  approvePendingPrincipal: approveSupervisorPendingPrincipal,
  rejectPendingPrincipal: rejectSupervisorPendingPrincipal,
  getPrincipalsStatistics,
  
  // Principal Links
  getPrincipalLinks: getSupervisorPrincipalLinks,
  createPrincipalLink: createSupervisorPrincipalLink,
  updatePrincipalLink: updateSupervisorPrincipalLink,
  deletePrincipalLink: deleteSupervisorPrincipalLink,
  
  // Support Tickets
  getSupportTickets: getSupervisorSupportTickets,
  createSupportTicket: createSupervisorSupportTicket,
  
  // Notifications
  getNotifications: getSupervisorNotifications,
  markNotificationAsRead: markSupervisorNotificationAsRead,
};

export default supervisorService;