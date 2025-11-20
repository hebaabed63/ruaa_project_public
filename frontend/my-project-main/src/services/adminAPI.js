import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminAPI = {
  // Dashboard Stats
  getDashboardStats: () => apiClient.get('/admin/dashboard/stats'),
  
  // Users Management
  getUsers: (params) => apiClient.get('/admin/users', { params }),
  getUserDetails: (userId) => apiClient.get(`/admin/users/${userId}`),
  updateUserStatus: (userId, status) => apiClient.put(`/admin/users/${userId}/status`, { status }),
  deleteUser: (userId) => apiClient.delete(`/admin/users/${userId}`),
  
  // Admin Profile
  getProfile: () => apiClient.get('/admin/profile'),
  
  // Recent Registrations
  getRecentRegistrations: () => apiClient.get('/admin/recent-registrations'),
};

export default adminAPI;