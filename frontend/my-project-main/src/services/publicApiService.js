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

// Handle responses
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

const publicApiService = {
  // Schools
  getSchools: (params) => api.get('/schools', { params }),
  getSchool: (id) => api.get(`/schools/${id}`),
  getBestSchools: () => api.get('/schools/best'),
  getRecentSchools: () => api.get('/schools/recent'),
  searchSchools: (search) => api.get('/schools/search', { params: { search } }),
  getSchoolsByRegion: (region) => api.get('/schools/by-region', { params: { region } }),
  getRegions: () => api.get('/schools/regions'),
  
  // Statistics
  getStatistics: () => api.get('/statistics/general'),
  getSchoolStatistics: () => api.get('/schools/statistics'),
  
  // About
  getAbout: () => api.get('/about'),
  getTeam: () => api.get('/about/team'),
  
  // Contact
  getContactInfo: () => api.get('/contact/info'),
  submitContactForm: (data) => api.post('/contact', data),
  
  // Services
  getServices: () => api.get('/services'),
  getService: (id) => api.get(`/services/${id}`),
  
  // Ratings & Reviews
  getEvaluationCriteria: () => api.get('/ratings/criteria'),
  getSchoolRatings: (schoolId) => api.get(`/ratings/school/${schoolId}`),
  submitRating: (data) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return Promise.reject(new Error('يجب تسجيل الدخول لتقييم المدارس'));
    }
    return api.post('/ratings', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  
  // Feedback
  getFeedback: (params) => api.get('/feedback', { params }),
  submitFeedback: (data) => api.post('/feedback', data),
};

export default publicApiService;
