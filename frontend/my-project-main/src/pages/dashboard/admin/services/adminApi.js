import axios from 'axios';
import api from '../../../../api/axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminAPI = {
  // Dashboard Stats
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  
  // Users Management
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
  updateUserStatus: (userId, status) => api.put(`/admin/users/${userId}/status`, { status }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  
  // Admin Profile
  getProfile: () => api.get('/admin/profile'),
  
  // Recent Registrations
  getRecentRegistrations: () => api.get('/admin/recent-registrations'),
};

export default adminAPI;