/**
 * API Service for Contact Page
 * This service provides methods to interact with the contact-related API endpoints
 */

import api from './api';

/**
 * Contact API methods
 */
export const contactAPI = {
  /**
   * Send a contact message
   * @param {Object} messageData - The contact message data
   * @returns {Promise<*>} - The response data
   */
  async sendMessage(messageData) {
    try {
      const response = await api.post('/contact', messageData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to send message');
    }
  },

  /**
   * Get contact information
   * @returns {Promise<*>} - The contact information
   */
  async getContactInfo() {
    try {
      const response = await api.get('/contact/info');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch contact information');
    }
  },

  /**
   * Get frequently asked questions
   * @returns {Promise<*>} - The FAQ data
   */
  async getFAQs() {
    try {
      const response = await api.get('/contact/faqs');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch FAQs');
    }
  }
};

/**
 * Schools API methods
 */
export const schoolsAPI = {
  /**
   * Get all schools
   * @returns {Promise<*>} - The schools data
   */
  async getAll() {
    try {
      const response = await api.get('/schools');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch schools');
    }
  },

  /**
   * Search schools
   * @param {Object} params - Search parameters
   * @returns {Promise<*>} - The search results
   */
  async search(params) {
    try {
      const response = await api.get('/schools', params);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to search schools');
    }
  },

  /**
   * Get school by ID
   * @param {string|number} id - School ID
   * @returns {Promise<*>} - The school data
   */
  async getById(id) {
    try {
      const response = await api.get(`/schools/${id}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch school');
    }
  }
};

export default {
  contactAPI,
  schoolsAPI
};