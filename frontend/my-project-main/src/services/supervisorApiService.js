import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const supervisorApiService = {
  // Dashboard Stats
  getDashboardStats: () => api.get('/supervisor/dashboard/stats'),
  getEvaluationChartData: () => api.get('/supervisor/dashboard/charts/evaluations'),
  getPerformanceChartData: () => api.get('/supervisor/dashboard/charts/performance'),
  
  // Schools
  getSchools: () => api.get('/supervisor/schools'),
  addSchoolToSupervision: (schoolId) => api.post('/supervisor/schools', { school_id: schoolId }),
  removeSchoolFromSupervision: (schoolId) => api.delete(`/supervisor/schools/${schoolId}`),
  getAvailableSchools: () => api.get('/supervisor/schools/available'),
  getSchoolDetails: (schoolId) => api.get(`/supervisor/schools/${schoolId}/details`),
  
  // Profile
  getProfile: () => api.get('/supervisor/profile'),
  updateProfile: (data) => api.put('/supervisor/profile', data),
  updateAvatar: (formData) => {
    return api.post('/supervisor/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  changePassword: (data) => api.post('/supervisor/profile/password', data),
  
  // Reports
  getReports: () => api.get('/supervisor/reports'),
  getReportDetails: (reportId) => api.get(`/supervisor/reports/${reportId}`),
  createReport: (data) => {
    if (data instanceof FormData) {
      return api.post('/supervisor/reports', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.post('/supervisor/reports', data);
  },
  updateReport: (id, data) => api.put(`/supervisor/reports/${id}`, data),
  deleteReport: (id) => api.delete(`/supervisor/reports/${id}`),
  getReportsStatistics: () => api.get('/supervisor/reports/statistics'),
  
  // Notifications
  getNotifications: () => api.get('/supervisor/notifications'),
  markNotificationAsRead: (id) => api.put(`/supervisor/notifications/${id}/read`),
  
  // Invitations
  getInvitations: () => api.get('/supervisor/invitations'),
  createInvitation: (data) => api.post('/supervisor/invitations', data),
  updateInvitation: (id, data) => api.put(`/supervisor/invitations/${id}`, data),
  deleteInvitation: (id) => api.delete(`/supervisor/invitations/${id}`),
  getInvitationsStatistics: () => api.get('/supervisor/invitations/statistics'),
  
  // Principals
  getPendingPrincipals: () => api.get('/supervisor/principals/pending'),
  getActivePrincipals: () => api.get('/supervisor/principals/active'),
  approvePendingPrincipal: (userId) => api.post(`/supervisor/principals/${userId}/approve`),
  rejectPendingPrincipal: (userId) => api.post(`/supervisor/principals/${userId}/reject`),
  getPrincipalsStatistics: () => api.get('/supervisor/principals/statistics'),
  
  // Principal Links
  getPrincipalLinks: () => api.get('/supervisor/principal-links'),
  createPrincipalLink: (data) => api.post('/supervisor/principal-links', data),
  updatePrincipalLink: (id, data) => api.put(`/supervisor/principal-links/${id}`, data),
  deletePrincipalLink: (id) => api.delete(`/supervisor/principal-links/${id}`),
  
  // Support Tickets
  getSupportTickets: () => api.get('/supervisor/support-tickets'),
  createSupportTicket: (data) => api.post('/supervisor/support-tickets', data),
  
  // Messages/Chat
  getConversations: () => api.get('/supervisor/conversations'),
  getMessages: (conversationId) => api.get(`/supervisor/conversations/${conversationId}/messages`),
  sendMessage: (conversationId, message) => api.post(`/supervisor/conversations/${conversationId}/messages`, { message }),
};

export default supervisorApiService;