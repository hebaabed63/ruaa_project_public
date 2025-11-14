/**
 * Supervisor API Service
 * This service provides real API implementations for supervisor dashboard data
 */

import api from '../../../../api/axios';

/**
 * Fetch supervisor profile data
 * @returns {Promise<Object>} Supervisor profile data
 */
export const fetchSupervisorProfile = async () => {
  try {
    const response = await api.get('/supervisor/profile');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching supervisor profile:', error);
    throw error;
  }
};

/**
 * Update supervisor profile data
 * @param {Object} profileData - The profile data to update
 * @returns {Promise<Object>} Updated profile data
 */
export const updateSupervisorProfile = async (profileData) => {
  try {
    const response = await api.put('/supervisor/profile', profileData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating supervisor profile:', error);
    throw error;
  }
};

/**
 * Update supervisor profile image
 * @param {FormData} formData - The form data containing the image file
 * @returns {Promise<Object>} Updated profile image data
 */
export const updateSupervisorProfileImage = async (formData) => {
  try {
    const response = await api.post('/supervisor/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating supervisor profile image:', error);
    throw error;
  }
};

/**
 * Change supervisor password
 * @param {Object} passwordData - Object containing current_password, new_password, new_password_confirmation
 * @returns {Promise<Object>} Success response
 */
export const changeSupervisorPassword = async (passwordData) => {
  try {
    const response = await api.post('/supervisor/profile/password', passwordData);
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

/**
 * Fetch schools that supervisor oversees
 * @returns {Promise<Array>} Array of schools
 */
export const fetchSupervisorSchools = async () => {
  try {
    const response = await api.get('/supervisor/schools');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching supervisor schools:', error);
    throw error;
  }
};

/**
 * Fetch reports for supervisor
 * @returns {Promise<Array>} Array of reports
 */
export const fetchSupervisorReports = async () => {
  try {
    const response = await api.get('/supervisor/reports');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching supervisor reports:', error);
    throw error;
  }
};

/**
 * Create a new report
 * @param {FormData} reportData - The report data
 * @returns {Promise<Object>} Created report
 */
export const createSupervisorReport = async (reportData) => {
  try {
    const response = await api.post('/supervisor/reports', reportData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error creating supervisor report:', error);
    throw error;
  }
};

/**
 * Update a report
 * @param {number} reportId - The report ID
 * @param {FormData} reportData - The report data
 * @returns {Promise<Object>} Updated report
 */
export const updateSupervisorReport = async (reportId, reportData) => {
  try {
    const response = await api.put(`/supervisor/reports/${reportId}`, reportData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating supervisor report:', error);
    throw error;
  }
};

/**
 * Delete a report
 * @param {number} reportId - The report ID
 * @returns {Promise<Object>} Success response
 */
export const deleteSupervisorReport = async (reportId) => {
  try {
    const response = await api.delete(`/supervisor/reports/${reportId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting supervisor report:', error);
    throw error;
  }
};

/**
 * Fetch invitations for supervisor
 * @returns {Promise<Array>} Array of invitations
 */
export const fetchSupervisorInvitations = async () => {
  try {
    const response = await api.get('/supervisor/invitations');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching supervisor invitations:', error);
    throw error;
  }
};

/**
 * Create a new invitation
 * @param {Object} invitationData - The invitation data
 * @returns {Promise<Object>} Created invitation
 */
export const createSupervisorInvitation = async (invitationData) => {
  try {
    const response = await api.post('/supervisor/invitations', invitationData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating supervisor invitation:', error);
    throw error;
  }
};

/**
 * Update an invitation
 * @param {number} invitationId - The invitation ID
 * @param {Object} invitationData - The invitation data
 * @returns {Promise<Object>} Updated invitation
 */
export const updateSupervisorInvitation = async (invitationId, invitationData) => {
  try {
    const response = await api.put(`/supervisor/invitations/${invitationId}`, invitationData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating supervisor invitation:', error);
    throw error;
  }
};

/**
 * Delete an invitation
 * @param {number} invitationId - The invitation ID
 * @returns {Promise<Object>} Success response
 */
export const deleteSupervisorInvitation = async (invitationId) => {
  try {
    const response = await api.delete(`/supervisor/invitations/${invitationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting supervisor invitation:', error);
    throw error;
  }
};

/**
 * Fetch support tickets for supervisor
 * @returns {Promise<Array>} Array of support tickets
 */
export const fetchSupervisorSupportTickets = async () => {
  try {
    const response = await api.get('/supervisor/support-tickets');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching supervisor support tickets:', error);
    throw error;
  }
};

/**
 * Create a new support ticket
 * @param {FormData} ticketData - The ticket data
 * @returns {Promise<Object>} Created ticket
 */
export const createSupervisorSupportTicket = async (ticketData) => {
  try {
    const response = await api.post('/supervisor/support-tickets', ticketData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error creating supervisor support ticket:', error);
    throw error;
  }
};

/**
 * Fetch messages for supervisor
 * @returns {Promise<Array>} Array of conversations
 */
export const fetchSupervisorMessages = async () => {
  try {
    const response = await api.get('/supervisor/messages');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching supervisor messages:', error);
    throw error;
  }
};

/**
 * Send a message
 * @param {FormData} messageData - The message data
 * @returns {Promise<Object>} Sent message
 */
export const sendSupervisorMessage = async (messageData) => {
  try {
    const response = await api.post('/supervisor/messages', messageData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error sending supervisor message:', error);
    throw error;
  }
};

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} Dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/supervisor/dashboard/stats');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Fetch notifications for supervisor
 * @returns {Promise<Array>} Array of notifications
 */
export const fetchSupervisorNotifications = async () => {
  try {
    const response = await api.get('/supervisor/notifications');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching supervisor notifications:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 * @param {number} notificationId - The notification ID
 * @returns {Promise<Object>} Success response
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/supervisor/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Fetch conversations for supervisor
 * @returns {Promise<Array>} Array of conversations
 */
export const fetchSupervisorConversations = async () => {
  try {
    const response = await api.get('/supervisor/conversations');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching supervisor conversations:', error);
    throw error;
  }
};

/**
 * Fetch messages for a conversation
 * @param {number} conversationId - The conversation ID
 * @returns {Promise<Object>} Conversation with messages
 */
export const fetchConversationMessages = async (conversationId) => {
  try {
    const response = await api.get(`/supervisor/conversations/${conversationId}/messages`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    throw error;
  }
};

/**
 * Send a message in a conversation
 * @param {number} conversationId - The conversation ID
 * @param {string} message - The message text
 * @returns {Promise<Object>} Sent message
 */
export const sendMessageInConversation = async (conversationId, message) => {
  try {
    const response = await api.post(`/supervisor/conversations/${conversationId}/messages`, { message });
    return response.data.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Fetch evaluations for supervisor
 * @returns {Promise<Array>} Array of evaluations
 */
export const fetchSupervisorEvaluations = async () => {
  try {
    const response = await api.get('/supervisor/evaluations');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching supervisor evaluations:', error);
    throw error;
  }
};

/**
 * Fetch requests for supervisor
 * @returns {Promise<Array>} Array of requests
 */
export const fetchSupervisorRequests = async () => {
  try {
    const response = await api.get('/supervisor/requests');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching supervisor requests:', error);
    throw error;
  }
};

/**
 * Submit an invitation
 * @param {Object} invitationData - The invitation data
 * @returns {Promise<Object>} Created invitation
 */
export const submitInvitation = async (invitationData) => {
  try {
    const response = await api.post('/supervisor/invitations', invitationData);
    return response.data;
  } catch (error) {
    console.error('Error submitting invitation:', error);
    throw error;
  }
};

/**
 * Add school to supervisor's supervision list
 * @param {number} schoolId - The school ID to add
 * @returns {Promise<Object>} Added school data
 */
export const addSchoolToSupervision = async (schoolId) => {
  try {
    const response = await api.post('/supervisor/schools', { school_id: schoolId });
    return response.data.data;
  } catch (error) {
    console.error('Error adding school to supervision:', error);
    throw error;
  }
};

/**
 * Remove school from supervisor's supervision list
 * @param {number} schoolId - The school ID to remove
 * @returns {Promise<Object>} Success response
 */
export const removeSchoolFromSupervision = async (schoolId) => {
  try {
    const response = await api.delete(`/supervisor/schools/${schoolId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing school from supervision:', error);
    throw error;
  }
};

/**
 * Get all schools available for supervision (not just supervised)
 * @returns {Promise<Array>} Array of all schools
 */
export const getAllAvailableSchools = async () => {
  try {
    const response = await api.get('/schools');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching available schools:', error);
    throw error;
  }
};

/**
 * Get chart data for evaluations
 * @returns {Promise<Object>} Chart data
 */
export const getEvaluationsChartData = async () => {
  try {
    const response = await api.get('/supervisor/dashboard/charts/evaluations');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching evaluations chart data:', error);
    throw error;
  }
};

/**
 * Get chart data for school performance
 * @returns {Promise<Object>} Chart data
 */
export const getPerformanceChartData = async () => {
  try {
    const response = await api.get('/supervisor/dashboard/charts/performance');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching performance chart data:', error);
    throw error;
  }
};

/**
 * Get chart data for evaluation criteria
 * @returns {Promise<Object>} Chart data
 */
export const getCriteriaChartData = async () => {
  try {
    const response = await api.get('/supervisor/dashboard/charts/criteria');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching criteria chart data:', error);
    throw error;
  }
};

/**
 * Get chart data for education stages
 * @returns {Promise<Object>} Chart data
 */
export const getStagesChartData = async () => {
  try {
    const response = await api.get('/supervisor/dashboard/charts/education-stages');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching stages chart data:', error);
    throw error;
  }
};

export default {
  fetchSupervisorProfile,
  updateSupervisorProfile,
  updateSupervisorProfileImage,
  changeSupervisorPassword,
  fetchSupervisorSchools,
  addSchoolToSupervision,
  removeSchoolFromSupervision,
  getAllAvailableSchools,
  fetchSupervisorReports,
  createSupervisorReport,
  updateSupervisorReport,
  deleteSupervisorReport,
  fetchSupervisorInvitations,
  createSupervisorInvitation,
  updateSupervisorInvitation,
  deleteSupervisorInvitation,
  fetchSupervisorSupportTickets,
  createSupervisorSupportTicket,
  fetchSupervisorMessages,
  sendSupervisorMessage,
  getDashboardStats,
  fetchSupervisorEvaluations,
  fetchSupervisorRequests,
  submitInvitation,
  fetchSupervisorNotifications,
  markNotificationAsRead,
  fetchSupervisorConversations,
  fetchConversationMessages,
  sendMessageInConversation,
  getEvaluationsChartData,
  getPerformanceChartData,
  getCriteriaChartData,
  getStagesChartData
};