import api from "./api";

// ===========================================
// Admin Dashboard Statistics Services - التصحيح
// ===========================================

// Get dashboard statistics - التصحيح
export const getDashboardStatistics = async () => {
  try {
    const response = await api.get("/admin/dashboard-stats"); // ← التصحيح
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب إحصائيات لوحة التحكم");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// ===========================================
// Admin Invitations Management Services - التصحيح
// ===========================================

// Get all invitations - التصحيح
export const getSupervisorLinks = async (filters = {}) => {
  try {
    const response = await api.get("/admin/invitations", filters); // ← التصحيح
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب الدعوات");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Create new invitation - التصحيح
export const createSupervisorLink = async (data) => {
  try {
    const response = await api.post("/admin/invitations", data); // ← التصحيح
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMsg = error.response.data.message || error.response.data.errors || "فشل في إنشاء الدعوة";
      throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Update invitation - التصحيح
export const updateSupervisorLink = async (id, data) => {
  try {
    const response = await api.put(`/admin/invitations/${id}`, data); // ← التصحيح
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMsg = error.response.data.message || error.response.data.errors || "فشل في تحديث الدعوة";
      throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Delete invitation - التصحيح
export const deleteSupervisorLink = async (id) => {
  try {
    const response = await api.delete(`/admin/invitations/${id}`); // ← التصحيح
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في حذف الدعوة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// ===========================================
// Admin User Management Services - التصحيح
// ===========================================

// Get all users with filters - التصحيح
export const getAllUsers = async (filters = {}) => {
  try {
    const response = await api.get("/admin/users", filters);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب المستخدمين");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get user by ID - التصحيح
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

// Update user status - التصحيح
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

// Delete user - التصحيح
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
// Admin School Management Services - التصحيح
// ===========================================

// Get all schools - التصحيح
export const getAllSchools = async (filters = {}) => {
  try {
    const response = await api.get("/admin/schools", filters); // ← التصحيح
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب المدارس");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get school by ID - التصحيح
export const getSchoolById = async (schoolId) => {
  try {
    const response = await api.get(`/admin/schools/${schoolId}`); // ← التصحيح
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب بيانات المدرسة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Create new school - التصحيح
export const createSchool = async (schoolData) => {
  try {
    const response = await api.post("/admin/schools", schoolData); // ← التصحيح
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMsg = error.response.data.message || error.response.data.errors || "فشل في إنشاء المدرسة";
      throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Update school - التصحيح
export const updateSchool = async (schoolId, schoolData) => {
  try {
    const response = await api.put(`/admin/schools/${schoolId}`, schoolData); // ← التصحيح
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMsg = error.response.data.message || error.response.data.errors || "فشل في تحديث المدرسة";
      throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Delete school - التصحيح
export const deleteSchool = async (schoolId) => {
  try {
    const response = await api.delete(`/admin/schools/${schoolId}`); // ← التصحيح
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في حذف المدرسة");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// ===========================================
// Admin Reports Management Services - التصحيح
// ===========================================

// Get all reports - التصحيح
export const getAllReports = async (filters = {}) => {
  try {
    const response = await api.get("/admin/reports", filters);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "فشل في جلب التقارير");
    }
    throw new Error("خطأ في الاتصال بالخادم");
  }
};

// Get report by ID - التصحيح
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

// Update report status - التصحيح
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

// Delete report - التصحيح
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
// Services that don't exist in Backend - إزالة
// ===========================================

// ❌ إزالة الخدمات غير الموجودة في الـ Backend:
// - جميع خدمات Principal Links
// - جميع خدمات Support Tickets  
// - جميع خدمات Complaints
// - خدمات Reports الإضافية غير الموجودة

// ===========================================
// تصحيح هيكل البيانات في الـ Frontend
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
    supportTickets: 0, // غير موجود في الـ Backend الحالي
    totalLinks: data.totalInvitations || 0,
    activeLinks: 0, // تحتاج حساب من البيانات
    pendingUsers: data.pendingUsers || 0,
    recentRegistrations: [] // غير موجود في الـ Backend الحالي
  };
};