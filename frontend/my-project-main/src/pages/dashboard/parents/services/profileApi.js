/**
 * Profile API Service
 * This service provides mock implementations for parent profile data
 */

// Mock delay to simulate network requests
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch parent profile data
 * @returns {Promise<Object>} Parent profile data
 */
export const fetchParentProfile = async () => {
  await simulateDelay(800);
  
  // In a real application, this would fetch from an actual API
  // For now, we're returning mock data that matches the parent profile structure
  return {
    id: 'parent_001',
    fullName: 'أحمد محمد السعد',
    email: 'ahmed.alsaad@gmail.com',
    phone: '+96650124567',
    address: 'الرياض، حي المروج، شارع الأمير سلطان',
    region: 'منطقة الرياض',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    dateJoined: '2023-09-15',
    preferences: {
      notifications: true,
      emailNotifications: true,
      smsNotifications: false,
      language: 'ar',
      theme: 'light'
    },
    children: [
      {
        id: 'child_001',
        name: 'محمد أحمد السعد',
        grade: 'الصف السادس الابتدائي',
        school: {
          id: 'school_001',
          name: 'مدرسة الأمل الابتدائية',
          type: 'ابتدائية',
          location: 'الرياض - حي المروج'
        },
        age: 12,
        profileImage: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=150&h=150&fit=crop&crop=face',
        academicYear: '2024-2025',
        studentId: 'STU001234'
      },
      {
        id: 'child_002',
        name: 'سارة أحمد السعد',
        grade: 'الصف الثاني المتوسط',
        school: {
          id: 'school_002',
          name: 'مدرسة النجاح المتوسطة',
          type: 'متوسطة',
          location: 'الرياض - حي النرجس'
        },
        age: 14,
        profileImage: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=150&h=150&fit=crop&crop=face',
        academicYear: '2024-2025',
        studentId: 'STU001235'
      }
    ]
  };
};

export default {
  fetchParentProfile
};