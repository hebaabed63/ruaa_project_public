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

const parentApiService = {
  // Dashboard
  getDashboard: () => api.get('/parent/dashboard'),
  
  // Profile
  getProfile: () => api.get('/parent/profile'),
  updateProfile: (data) => api.put('/parent/profile', data),
  updateAvatar: (formData) => {
    return api.post('/parent/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Settings
  getSettings: () => api.get('/parent/settings'),
  changePassword: (data) => api.post('/parent/settings/change-password', data),
  updateNotificationSettings: (data) => api.put('/parent/settings/notifications', data),
  
  // Schools
  getSchools: () => api.get('/parent/schools'),
  
  // Evaluations
  getEvaluationCriteria: () => api.get('/parent/evaluation-criteria'),
  getSchoolEvaluation: (schoolId) => api.get(`/parent/schools/${schoolId}/evaluation`),
  submitEvaluation: (schoolId, data) => api.post(`/parent/schools/${schoolId}/evaluation`, data),
  
  // Notifications
  getNotifications: () => api.get('/parent/notifications'),
  markNotificationAsRead: (id) => api.put(`/parent/notifications/${id}/read`),
  
  // Reports
  getReports: () => api.get('/parent/reports'),
  
  // Complaints
  getComplaintsMeta: () => api.get('/parent/complaints/meta'),
  getComplaints: () => api.get('/parent/complaints'),
  submitComplaint: (data) => api.post('/parent/complaints', data),
};

export default parentApiService;
