/**
 * Feedback Service
 * This service provides methods to interact with the feedback API endpoints
 */

import api from './api';

/**
 * Feedback Service methods
 */
const feedbackService = {
  /**
   * Submit feedback
   * @param {Object} feedbackData - The feedback data
   * @returns {Promise<*>} - The response data
   */
  async submit(feedbackData) {
    try {
      const response = await api.post('/feedback', feedbackData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to submit feedback');
    }
  },

  /**
   * Get feedback statistics
   * @returns {Promise<*>} - The feedback statistics
   */
  async getStatistics() {
    try {
      const response = await api.get('/feedback/statistics');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch feedback statistics');
    }
  },

  /**
   * Get all feedback
   * @returns {Promise<*>} - The feedback data
   */
  async getAll() {
    try {
      const response = await api.get('/feedback');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch feedback');
    }
  }
};

export default feedbackService;