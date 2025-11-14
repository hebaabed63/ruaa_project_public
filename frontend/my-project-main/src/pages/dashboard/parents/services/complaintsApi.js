/**
 * Complaints API Service
 * Real API implementation for complaints management
 */

import api from './api';

/**
 * Fetch metadata: complaint types + children's schools
 * @returns {Promise<Object>} Object containing types and schools
 */
export const fetchComplaintsMeta = async () => {
  const response = await api.get('/parent/complaints/meta');
  return response.data || { types: [], children_schools: [] };
};

/**
 * Fetch schools for parent's children (uses meta endpoint)
 * @returns {Promise<Array>} Array of schools
 */
export const fetchChildrenSchools = async () => {
  const meta = await fetchComplaintsMeta();
  return meta.children_schools || [];
};

/**
 * Fetch complaints for a specific parent
 * @returns {Promise<Array>} Array of complaints
 */
export const fetchComplaints = async () => {
  const response = await api.get('/parent/complaints');
  const complaints = response.data || [];
  
  // Map backend fields to frontend fields
  return complaints.map(complaint => ({
    id: complaint.id,
    schoolId: complaint.school_id,
    schoolName: complaint.school_name,
    subject: complaint.type,
    message: complaint.description,
    date: complaint.created_at,
    status: complaint.status,
    attachment: complaint.attachment_path ? complaint.attachment_path.split('/').pop() : null
  }));
};

/**
 * Submit a new complaint
 * @param {Object} complaintData - The complaint data
 * @returns {Promise<Object>} Success response with new complaint
 */

// services/complaintsApi.js
export const submitComplaint = async (complaintData) => {
  const formData = new FormData();
  
  // Map frontend fields to backend fields
  formData.append('school_id', complaintData.schoolId);
  formData.append('type', complaintData.subject);
  formData.append('description', complaintData.message);
  
  // Attach file if provided
  if (complaintData.attachment && complaintData.attachment instanceof File) {
    formData.append('attachment', complaintData.attachment);
  }
  
  const response = await api.post('/parent/complaints', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response;
};




/**
 * Get status info for display
 * @param {string} status - The status value
 * @returns {Object} Status information
 */
export const getStatusInfo = (status) => {
  switch (status) {
    case 'pending':
      return { icon: 'hourglass', color: 'text-yellow-500', bg: 'bg-yellow-100' };
    case 'in_review':
      return { icon: 'check', color: 'text-blue-500', bg: 'bg-blue-100' };
    case 'responded':
      return { icon: 'reply', color: 'text-green-500', bg: 'bg-green-100' };
    case 'rejected':
      return { icon: 'times', color: 'text-red-500', bg: 'bg-red-100' };
    default:
      return { icon: 'hourglass', color: 'text-gray-500', bg: 'bg-gray-100' };
  }
};

export default {
  fetchComplaintsMeta,
  fetchChildrenSchools,
  fetchComplaints,
  submitComplaint,
  getStatusInfo
};