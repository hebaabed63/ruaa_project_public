import axiosInstance from './axios.instance';

const feedbackService = {
  submit: async ({ rating, mood, comment }) => {
    const res = await axiosInstance.post('/feedback', { rating, mood, comment });
    return res.data; // { success, message, data: { ... } }
  },

  // اختياري: إحصائيات عامة
  stats: async () => {
    const res = await axiosInstance.get('/feedback/stats');
    return res.data; // { success, data: { total, average, counts, percentage } }
  }
};

export default feedbackService;
