/**
 * Complaints API Service
 * This service provides mock implementations that can easily be replaced with real API calls
 */

// Mock delay to simulate network requests
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock complaints data
const mockComplaints = [
  {
    id: 'comp_001',
    schoolId: 'school_001',
    schoolName: 'مدرسة الأمل الابتدائية',
    subject: 'مشكلة في التقييم',
    message: 'أريد التحدث عن تقييم طفلي في مادة الرياضيات',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'responded',
    attachment: 'تقرير_الطالب.pdf'
  },
  {
    id: 'comp_002',
    schoolId: 'school_002',
    schoolName: 'مدرسة النجاح المتوسطة',
    subject: 'تأخير في استلام الرسائل',
    message: 'لا أتلقى رسائل المدرسة في الوقت المناسب',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'reviewed'
  },
  {
    id: 'comp_003',
    schoolId: 'school_001',
    schoolName: 'مدرسة الأمل الابتدائية',
    subject: 'مشكلة في النقل المدرسي',
    message: 'الطفل يصل إلى المدرسة متأخرًا بسبب مشاكل في وسائل النقل',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    attachment: 'صور_المشكلة.jpg'
  }
];

/**
 * Fetch complaints for a specific parent
 * @returns {Promise<Array>} Array of complaints
 */
export const fetchComplaints = async () => {
  await simulateDelay(800);
  return [...mockComplaints];
};

/**
 * Submit a new complaint
 * @param {Object} complaintData - The complaint data
 * @returns {Promise<Object>} Success response with new complaint
 */
export const submitComplaint = async (complaintData) => {
  await simulateDelay(1500);
  
  // Create new complaint
  const newComplaint = {
    id: `comp_${Date.now()}`,
    schoolId: complaintData.schoolId,
    schoolName: complaintData.schoolName,
    subject: complaintData.subject,
    message: complaintData.message,
    attachment: complaintData.attachment,
    date: new Date().toISOString(),
    status: 'pending'
  };
  
  // Add to mock data
  mockComplaints.unshift(newComplaint);
  
  return {
    success: true,
    message: 'تم إرسال الشكوى بنجاح',
    data: newComplaint
  };
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
    case 'reviewed':
      return { icon: 'check', color: 'text-blue-500', bg: 'bg-blue-100' };
    case 'responded':
      return { icon: 'reply', color: 'text-green-500', bg: 'bg-green-100' };
    default:
      return { icon: 'hourglass', color: 'text-gray-500', bg: 'bg-gray-100' };
  }
};

export default {
  fetchComplaints,
  submitComplaint,
  getStatusInfo
};