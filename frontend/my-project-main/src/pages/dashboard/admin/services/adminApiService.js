/**
 * Admin API Service
 * This service provides real API implementations for admin dashboard data
 */

import api from '../../../../api/axios';

/**
 * Get admin dashboard statistics
 * @returns {Promise<Object>} Dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/dashboard/stats');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Fetch admin profile data
 * @returns {Promise<Object>} Admin profile data
 */
export const fetchAdminProfile = async () => {
  try {
    const response = await api.get('/admin/profile');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    throw error;
  }
};

/**
 * Update admin profile data
 * @param {Object} profileData - The profile data to update
 * @returns {Promise<Object>} Updated profile data
 */
export const updateAdminProfile = async (profileData) => {
  try {
    const response = await api.put('/admin/profile', profileData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating admin profile:', error);
    throw error;
  }
};

/**
 * Update admin profile image
 * @param {FormData} formData - The form data containing the image file
 * @returns {Promise<Object>} Updated profile image data
 */
export const updateAdminProfileImage = async (formData) => {
  try {
    const response = await api.post('/admin/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating admin profile image:', error);
    throw error;
  }
};

/**
 * Change admin password
 * @param {Object} passwordData - Object containing current_password, new_password, new_password_confirmation
 * @returns {Promise<Object>} Success response
 */
export const changeAdminPassword = async (passwordData) => {
  try {
    const response = await api.post('/admin/profile/password', passwordData);
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

/**
 * Update admin privacy settings
 * @param {Object} privacyData - The privacy settings to update
 * @returns {Promise<Object>} Updated privacy settings
 */
export const updateAdminPrivacySettings = async (privacyData) => {
  try {
    const response = await api.put('/admin/settings', privacyData);
    return response.data;
  } catch (error) {
    console.error('Error updating admin privacy settings:', error);
    throw error;
  }
};

/**
 * Update admin notification settings
 * @param {Object} notificationData - The notification settings to update
 * @returns {Promise<Object>} Updated notification settings
 */
export const updateAdminNotificationSettings = async (notificationData) => {
  try {
    const response = await api.put('/admin/settings', notificationData);
    return response.data;
  } catch (error) {
    console.error('Error updating admin notification settings:', error);
    throw error;
  }
};

/**
 * Get system settings
 * @returns {Promise<Object>} System settings
 */
export const getSystemSettings = async () => {
  try {
    const response = await api.get('/admin/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching system settings:', error);
    throw error;
  }
};

/**
 * Update system settings
 * @param {Object} settingsData - The settings to update
 * @returns {Promise<Object>} Updated settings
 */
export const updateSystemSettings = async (settingsData) => {
  try {
    const response = await api.put('/admin/settings', settingsData);
    return response.data;
  } catch (error) {
    console.error('Error updating system settings:', error);
    throw error;
  }
};

/**
 * Fetch users with pagination and filtering
 * @param {Object} params - Filter parameters
 * @returns {Promise<Object>} Paginated users data
 */
export const fetchUsers = async (params = {}) => {
  try {
    const response = await api.get('/admin/users', { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get user details
 * @param {number} userId - The user ID
 * @returns {Promise<Object>} User details
 */
export const getUserDetails = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

/**
 * Update user status
 * @param {number} userId - The user ID
 * @param {Object} statusData - Status data
 * @returns {Promise<Object>} Updated user
 */
export const updateUserStatus = async (userId, statusData) => {
  try {
    const response = await api.put(`/admin/users/${userId}/status`, statusData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

/**
 * Delete user
 * @param {number} userId - The user ID
 * @returns {Promise<Object>} Success response
 */
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Fetch schools with pagination and filtering
 * @param {Object} params - Filter parameters
 * @returns {Promise<Object>} Paginated schools data
 */
export const fetchSchools = async (params = {}) => {
  try {
    const response = await api.get('/admin/schools', { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching schools:', error);
    throw error;
  }
};

/**
 * Get school details
 * @param {number} schoolId - The school ID
 * @returns {Promise<Object>} School details
 */
export const getSchoolDetails = async (schoolId) => {
  try {
    const response = await api.get(`/admin/schools/${schoolId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching school details:', error);
    throw error;
  }
};

/**
 * Create a new school
 * @param {Object} schoolData - The school data
 * @returns {Promise<Object>} Created school
 */
export const createSchool = async (schoolData) => {
  try {
    const response = await api.post('/admin/schools', schoolData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating school:', error);
    throw error;
  }
};

/**
 * Update a school
 * @param {number} schoolId - The school ID
 * @param {Object} schoolData - The school data
 * @returns {Promise<Object>} Updated school
 */
export const updateSchool = async (schoolId, schoolData) => {
  try {
    const response = await api.put(`/admin/schools/${schoolId}`, schoolData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating school:', error);
    throw error;
  }
};

/**
 * Delete a school
 * @param {number} schoolId - The school ID
 * @returns {Promise<Object>} Success response
 */
export const deleteSchool = async (schoolId) => {
  try {
    const response = await api.delete(`/admin/schools/${schoolId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting school:', error);
    throw error;
  }
};

/**
 * Fetch reports with pagination and filtering
 * @param {Object} params - Filter parameters
 * @returns {Promise<Object>} Paginated reports data
 */
export const fetchReports = async (params = {}) => {
  try {
    const response = await api.get('/admin/reports', { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

/**
 * Get report details
 * @param {number} reportId - The report ID
 * @returns {Promise<Object>} Report details
 */
export const getReportDetails = async (reportId) => {
  try {
    const response = await api.get(`/admin/reports/${reportId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching report details:', error);
    throw error;
  }
};

/**
 * Update report status
 * @param {number} reportId - The report ID
 * @param {Object} statusData - Status data
 * @returns {Promise<Object>} Updated report
 */
export const updateReportStatus = async (reportId, statusData) => {
  try {
    const response = await api.put(`/admin/reports/${reportId}/status`, statusData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
};

/**
 * Delete a report
 * @param {number} reportId - The report ID
 * @returns {Promise<Object>} Success response
 */
export const deleteReport = async (reportId) => {
  try {
    const response = await api.delete(`/admin/reports/${reportId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting report:', error);
    throw error;
  }
};

/**
 * Fetch invitations with pagination and filtering
 * @param {Object} params - Filter parameters
 * @returns {Promise<Object>} Paginated invitations data
 */
export const fetchInvitations = async (params = {}) => {
  try {
    const response = await api.get('/admin/links', { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching invitations:', error);
    throw error;
  }
};

/**
 * Get invitation details
 * @param {number} invitationId - The invitation ID
 * @returns {Promise<Object>} Invitation details
 */
export const getInvitationDetails = async (invitationId) => {
  try {
    const response = await api.get(`/admin/links/${invitationId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching invitation details:', error);
    throw error;
  }
};

/**
 * Create a new invitation
 * @param {Object} invitationData - The invitation data
 * @returns {Promise<Object>} Created invitation
 */
export const createInvitation = async (invitationData) => {
  try {
    const response = await api.post('/admin/links', invitationData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating invitation:', error);
    throw error;
  }
};

/**
 * Update an invitation
 * @param {number} invitationId - The invitation ID
 * @param {Object} invitationData - The invitation data
 * @returns {Promise<Object>} Updated invitation
 */
export const updateInvitation = async (invitationId, invitationData) => {
  try {
    const response = await api.put(`/admin/links/${invitationId}`, invitationData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating invitation:', error);
    throw error;
  }
};

/**
 * Delete an invitation
 * @param {number} invitationId - The invitation ID
 * @returns {Promise<Object>} Success response
 */
export const deleteInvitation = async (invitationId) => {
  try {
    const response = await api.delete(`/admin/links/${invitationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting invitation:', error);
    throw error;
  }
};

export default {
  getDashboardStats,
  fetchAdminProfile,
  updateAdminProfile,
  updateAdminProfileImage,
  changeAdminPassword,
  updateAdminPrivacySettings,
  updateAdminNotificationSettings,
  getSystemSettings,
  updateSystemSettings,
  fetchUsers,
  getUserDetails,
  updateUserStatus,
  deleteUser,
  fetchSchools,
  getSchoolDetails,
  createSchool,
  updateSchool,
  deleteSchool,
  fetchReports,
  getReportDetails,
  updateReportStatus,
  deleteReport,
  fetchInvitations,
  getInvitationDetails,
  createInvitation,
  updateInvitation,
  deleteInvitation
};