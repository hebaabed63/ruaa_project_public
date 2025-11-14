import api from './axios';

/**
 * Parent Dashboard API
 * جميع API calls لأولياء الأمور
 */

// ============================================================================
// Dashboard Home - الصفحة الرئيسية
// ============================================================================

/**
 * Get dashboard statistics and data
 * الحصول على إحصائيات وبيانات لوحة التحكم
 */
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/parent/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// ============================================================================
// Profile - الملف الشخصي
// ============================================================================

/**
 * Get parent profile
 * الحصول على الملف الشخصي
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/parent/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

/**
 * Update parent profile
 * تحديث الملف الشخصي
 */
export const updateProfile = async (data) => {
  try {
    const response = await api.put('/parent/profile', data);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

/**
 * Update profile avatar
 * تحديث صورة الملف الشخصي
 */
export const updateAvatar = async (formData) => {
  try {
    const response = await api.post('/parent/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating avatar:', error);
    throw error;
  }
};

// ============================================================================
// Schools - المدارس
// ============================================================================

/**
 * Get parent's schools (schools where their children study)
 * الحصول على مدارس أبناء ولي الأمر
 */
export const getParentSchools = async () => {
  try {
    const response = await api.get('/parent/schools');
    return response.data;
  } catch (error) {
    console.error('Error fetching schools:', error);
    throw error;
  }
};

/**
 * Get all available schools for selection
 * الحصول على جميع المدارس المتاحة للاختيار
 */
export const getAllSchools = async (params = {}) => {
  try {
    const response = await api.get('/schools', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching all schools:', error);
    throw error;
  }
};

/**
 * Get school details
 * الحصول على تفاصيل مدرسة
 */
export const getSchoolDetails = async (schoolId) => {
  try {
    const response = await api.get(`/parent/schools/${schoolId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching school details:', error);
    throw error;
  }
};

/**
 * Add child to school
 * إضافة ابن إلى مدرسة
 */
export const addChildToSchool = async (data) => {
  try {
    const response = await api.post('/parent/children', data);
    return response.data;
  } catch (error) {
    console.error('Error adding child to school:', error);
    throw error;
  }
};

/**
 * Remove child from school
 * حذف ابن من مدرسة
 */
export const removeChildFromSchool = async (childId) => {
  try {
    const response = await api.delete(`/parent/children/${childId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing child:', error);
    throw error;
  }
};

// ============================================================================
// School Evaluations - تقييم المدارس
// ============================================================================

/**
 * Get evaluation criteria
 * الحصول على معايير التقييم
 */
export const getEvaluationCriteria = async () => {
  try {
    const response = await api.get('/parent/evaluation-criteria');
    return response.data;
  } catch (error) {
    console.error('Error fetching evaluation criteria:', error);
    throw error;
  }
};

/**
 * Get school evaluation (parent's evaluation for a school)
 * الحصول على تقييم مدرسة
 */
export const getSchoolEvaluation = async (schoolId) => {
  try {
    const response = await api.get(`/parent/schools/${schoolId}/evaluation`);
    return response.data;
  } catch (error) {
    console.error('Error fetching school evaluation:', error);
    throw error;
  }
};

/**
 * Submit or update school evaluation
 * إرسال أو تحديث تقييم مدرسة
 */
export const submitSchoolEvaluation = async (schoolId, data) => {
  try {
    const response = await api.post(`/parent/schools/${schoolId}/evaluation`, data);
    return response.data;
  } catch (error) {
    console.error('Error submitting evaluation:', error);
    throw error;
  }
};

/**
 * Rate a school (simple rating)
 * تقييم مدرسة بسيط
 */
export const rateSchool = async (schoolId, data) => {
  try {
    const response = await api.post(`/parent/schools/${schoolId}/rate`, data);
    return response.data;
  } catch (error) {
    console.error('Error rating school:', error);
    throw error;
  }
};

// ============================================================================
// Reports - التقارير
// ============================================================================

/**
 * Get children reports
 * الحصول على تقارير الأبناء
 */
export const getReports = async (params = {}) => {
  try {
    const response = await api.get('/parent/reports', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

/**
 * Get single report details
 * الحصول على تفاصيل تقرير
 */
export const getReportDetails = async (reportId) => {
  try {
    const response = await api.get(`/parent/reports/${reportId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching report details:', error);
    throw error;
  }
};

// ============================================================================
// Calendar - التقويم
// ============================================================================

/**
 * Get calendar events
 * الحصول على أحداث التقويم
 */
export const getCalendarEvents = async (params = {}) => {
  try {
    const response = await api.get('/parent/calendar', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
};

/**
 * Create calendar event
 * إنشاء حدث في التقويم
 */
export const createCalendarEvent = async (data) => {
  try {
    const response = await api.post('/parent/calendar', data);
    return response.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};

/**
 * Update calendar event
 * تحديث حدث في التقويم
 */
export const updateCalendarEvent = async (eventId, data) => {
  try {
    const response = await api.put(`/parent/calendar/${eventId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating calendar event:', error);
    throw error;
  }
};

/**
 * Delete calendar event
 * حذف حدث من التقويم
 */
export const deleteCalendarEvent = async (eventId) => {
  try {
    const response = await api.delete(`/parent/calendar/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    throw error;
  }
};

// ============================================================================
// Complaints - الشكاوى
// ============================================================================

/**
 * Get complaints metadata (schools, categories, etc.)
 * الحصول على البيانات الوصفية للشكاوى
 */
export const getComplaintsMeta = async () => {
  try {
    const response = await api.get('/parent/complaints/meta');
    return response.data;
  } catch (error) {
    console.error('Error fetching complaints meta:', error);
    throw error;
  }
};

/**
 * Get complaints list
 * الحصول على قائمة الشكاوى
 */
export const getComplaints = async (params = {}) => {
  try {
    const response = await api.get('/parent/complaints', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw error;
  }
};

/**
 * Submit new complaint
 * إرسال شكوى جديدة
 */
export const submitComplaint = async (data) => {
  try {
    const response = await api.post('/parent/complaints', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting complaint:', error);
    throw error;
  }
};

/**
 * Get complaint details
 * الحصول على تفاصيل شكوى
 */
export const getComplaintDetails = async (complaintId) => {
  try {
    const response = await api.get(`/parent/complaints/${complaintId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching complaint details:', error);
    throw error;
  }
};

// ============================================================================
// Chat/Messages - المحادثات
// ============================================================================

/**
 * Get conversations list
 * الحصول على قائمة المحادثات
 */
export const getConversations = async () => {
  try {
    const response = await api.get('/parent/conversations');
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

/**
 * Get messages for a conversation
 * الحصول على رسائل محادثة
 */
export const getMessages = async (conversationId, params = {}) => {
  try {
    const response = await api.get(`/parent/conversations/${conversationId}/messages`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

/**
 * Send message in a conversation
 * إرسال رسالة في محادثة
 */
export const sendMessage = async (conversationId, data) => {
  try {
    const response = await api.post(`/parent/conversations/${conversationId}/messages`, data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Create new conversation
 * إنشاء محادثة جديدة
 */
export const createConversation = async (data) => {
  try {
    const response = await api.post('/parent/conversations', data);
    return response.data;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

// ============================================================================
// Notifications - الإشعارات
// ============================================================================

/**
 * Get notifications
 * الحصول على الإشعارات
 */
export const getNotifications = async (params = {}) => {
  try {
    const response = await api.get('/parent/notifications', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 * وضع علامة مقروء على إشعار
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/parent/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read
 * وضع علامة مقروء على جميع الإشعارات
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.put('/parent/notifications/mark-all-read');
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Delete notification
 * حذف إشعار
 */
export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`/parent/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// ============================================================================
// Settings - الإعدادات
// ============================================================================

/**
 * Get settings
 * الحصول على الإعدادات
 */
export const getSettings = async () => {
  try {
    const response = await api.get('/parent/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

/**
 * Update notification settings
 * تحديث إعدادات الإشعارات
 */
export const updateNotificationSettings = async (data) => {
  try {
    const response = await api.put('/parent/settings/notifications', data);
    return response.data;
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
};

/**
 * Change password
 * تغيير كلمة المرور
 */
export const changePassword = async (data) => {
  try {
    const response = await api.post('/parent/settings/change-password', data);
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

/**
 * Update general settings
 * تحديث الإعدادات العامة
 */
export const updateSettings = async (data) => {
  try {
    const response = await api.put('/parent/settings', data);
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

// ============================================================================
// Support - الدعم الفني
// ============================================================================

/**
 * Get support tickets
 * الحصول على تذاكر الدعم
 */
export const getSupportTickets = async (params = {}) => {
  try {
    const response = await api.get('/parent/support-tickets', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    throw error;
  }
};

/**
 * Create support ticket
 * إنشاء تذكرة دعم
 */
export const createSupportTicket = async (data) => {
  try {
    const response = await api.post('/parent/support-tickets', data);
    return response.data;
  } catch (error) {
    console.error('Error creating support ticket:', error);
    throw error;
  }
};

/**
 * Get support ticket details
 * الحصول على تفاصيل تذكرة دعم
 */
export const getSupportTicketDetails = async (ticketId) => {
  try {
    const response = await api.get(`/parent/support-tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching support ticket details:', error);
    throw error;
  }
};

/**
 * Reply to support ticket
 * الرد على تذكرة دعم
 */
export const replyToSupportTicket = async (ticketId, data) => {
  try {
    const response = await api.post(`/parent/support-tickets/${ticketId}/reply`, data);
    return response.data;
  } catch (error) {
    console.error('Error replying to support ticket:', error);
    throw error;
  }
};

/**
 * Close support ticket
 * إغلاق تذكرة دعم
 */
export const closeSupportTicket = async (ticketId) => {
  try {
    const response = await api.put(`/parent/support-tickets/${ticketId}/close`);
    return response.data;
  } catch (error) {
    console.error('Error closing support ticket:', error);
    throw error;
  }
};

// ============================================================================
// Export all functions as default object
// ============================================================================

export default {
  // Dashboard
  getDashboardStats,
  
  // Profile
  getProfile,
  updateProfile,
  updateAvatar,
  
  // Schools
  getParentSchools,
  getAllSchools,
  getSchoolDetails,
  addChildToSchool,
  removeChildFromSchool,
  
  // Evaluations
  getEvaluationCriteria,
  getSchoolEvaluation,
  submitSchoolEvaluation,
  rateSchool,
  
  // Reports
  getReports,
  getReportDetails,
  
  // Calendar
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  
  // Complaints
  getComplaintsMeta,
  getComplaints,
  submitComplaint,
  getComplaintDetails,
  
  // Chat
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
  
  // Notifications
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  
  // Settings
  getSettings,
  updateNotificationSettings,
  changePassword,
  updateSettings,
  
  // Support
  getSupportTickets,
  createSupportTicket,
  getSupportTicketDetails,
  replyToSupportTicket,
  closeSupportTicket,
};
