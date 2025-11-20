import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// أنشئ instance واحد فقط
const createAPIClient = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // إضافة التوكن
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

export const adminSupportAPI = {
  // جلب جميع تذاكر الدعم
  getAllTickets: () => createAPIClient().get('/admin/support/tickets'),
  
  // جلب تذكرة محددة
  getTicketById: (ticketId) => createAPIClient().get(`/admin/support/tickets/${ticketId}`),
  
  // تحديث حالة التذكرة
  updateTicketStatus: (ticketId, status) => createAPIClient().put(`/admin/support/tickets/${ticketId}/status`, { status }),
  
  // حذف التذكرة
  deleteTicket: (ticketId) => createAPIClient().delete(`/admin/support/tickets/${ticketId}`),
  
  // إحصائيات التذاكر
  getTicketsStats: () => createAPIClient().get('/admin/support/tickets/stats'),
};

export default adminSupportAPI;