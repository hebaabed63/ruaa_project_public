/**
 * API Service for handling HTTP requests
 * This service provides methods to interact with the backend API
 */

// Base URL for the API - should be moved to environment variables in production
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

/**
 * Helper function to handle API responses
 * @param {Response} response - The fetch response object
 * @returns {Promise<*>} - The parsed JSON response or throws an error
 */
async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  
  // Handle empty responses (like 204 No Content)
  if (response.status === 204 || !contentType) {
    return null;
  }

  const data = await response.json();
  
  if (!response.ok) {
    // Handle API errors
    const error = new Error(data.message || 'حدث خطأ في الاتصال بالخادم');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
}

/**
 * Helper function to prepare request options
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {Object} data - Request body data (for POST, PUT, PATCH)
 * @param {Object} options - Additional fetch options
 * @returns {Object} - Prepared fetch options
 */
function prepareOptions(method, data = null, options = {}) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  });

  // Add authorization header if token exists
  const token = localStorage.getItem('authToken');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const fetchOptions = {
    method,
    headers,
    ...options,
  };

  // Add body for methods that require it
  if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    fetchOptions.body = JSON.stringify(data);
  }

  return fetchOptions;
}

/**
 * API Service methods
 */
const apiService = {
  /**
   * Perform a GET request
   * @param {string} endpoint - API endpoint (without base URL)
   * @param {Object} queryParams - Query parameters as an object
   * @param {Object} options - Additional fetch options
   * @returns {Promise<*>} - The response data
   */
  async get(endpoint, queryParams = {}, options = {}) {
    // Convert query parameters to URLSearchParams
    const queryString = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryString.append(key, value);
      }
    });
    
    const url = `${API_BASE_URL}${endpoint}${queryString.toString() ? `?${queryString}` : ''}`;
    const response = await fetch(url, prepareOptions('GET', null, options));
    return handleResponse(response);
  },

  /**
   * Perform a POST request
   * @param {string} endpoint - API endpoint (without base URL)
   * @param {Object} data - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise<*>} - The response data
   */
  async post(endpoint, data = {}, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, prepareOptions('POST', data, options));
    return handleResponse(response);
  },

  /**
   * Perform a PUT request
   * @param {string} endpoint - API endpoint (without base URL)
   * @param {string|number} id - Resource ID
   * @param {Object} data - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise<*>} - The response data
   */
  async put(endpoint, id, data = {}, options = {}) {
    const url = `${API_BASE_URL}${endpoint}/${id}`;
    const response = await fetch(url, prepareOptions('PUT', data, options));
    return handleResponse(response);
  },

  /**
   * Perform a PATCH request
   * @param {string} endpoint - API endpoint (without base URL)
   * @param {string|number} id - Resource ID
   * @param {Object} data - Request body data (only the fields to update)
   * @param {Object} options - Additional fetch options
   * @returns {Promise<*>} - The response data
   */
  async patch(endpoint, id, data = {}, options = {}) {
    const url = `${API_BASE_URL}${endpoint}/${id}`;
    const response = await fetch(url, prepareOptions('PATCH', data, options));
    return handleResponse(response);
  },

  /**
   * Perform a DELETE request
   * @param {string} endpoint - API endpoint (without base URL)
   * @param {string|number} id - Resource ID to delete
   * @param {Object} options - Additional fetch options
   * @returns {Promise<*>} - The response data (usually empty)
   */
  async delete(endpoint, id, options = {}) {
    const url = `${API_BASE_URL}${endpoint}/${id}`;
    const response = await fetch(url, prepareOptions('DELETE', null, options));
    return handleResponse(response);
  },

  /**
   * Upload a file
   * @param {string} endpoint - API endpoint (without base URL)
   * @param {File} file - The file to upload
   * @param {Object} additionalData - Additional form data to send with the file
   * @param {Function} onProgress - Progress callback (receives progress percentage)
   * @returns {Promise<*>} - The response data
   */
  async uploadFile(endpoint, file, additionalData = {}, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Append additional data to formData
    Object.entries(additionalData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      xhr.open('POST', `${API_BASE_URL}${endpoint}`, true);
      
      // Add authorization header if token exists
      const token = localStorage.getItem('authToken');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      // Progress tracking
      if (onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            onProgress(percentComplete);
          }
        };
      }
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = xhr.responseText ? JSON.parse(xhr.responseText) : null;
            resolve(response);
          } catch (error) {
            resolve(xhr.responseText || null);
          }
        } else {
          let error;
          try {
            const errorData = xhr.responseText ? JSON.parse(xhr.responseText) : {};
            error = new Error(errorData.message || 'فشل رفع الملف');
            error.status = xhr.status;
            error.data = errorData;
          } catch (e) {
            error = new Error('فشل رفع الملف');
            error.status = xhr.status;
          }
          reject(error);
        }
      };
      
      xhr.onerror = () => {
        reject(new Error('حدث خطأ في الاتصال بالخادم'));
      };
      
      xhr.send(formData);
    });
  },
};

export default apiService;
