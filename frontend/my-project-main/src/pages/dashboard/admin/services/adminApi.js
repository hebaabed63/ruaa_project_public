// =============================================================================
// Admin Dashboard Mock API Service
// خدمة وهمية لواجهة برمجة تطبيقات داشبورد  Admin
// =============================================================================

// Mock data for users
const mockUsers = [
  { id: 1, name: "أحمد محمد", email: "ahmed@example.com", role: "مدير النظام", phone: "0591234567", status: "نشط" },
  { id: 2, name: "سارة علي", email: "sara@example.com", role: "مشرف", phone: "0597654321", status: "نشط" },
  { id: 3, name: "محمد خالد", email: "khaled@example.com", role: "مدير مدرسة", phone: "0591111111", status: "غير نشط" },
  { id: 4, name: "ليلى أحمد", email: "layla@example.com", role: "ولي أمر", phone: "0592222222", status: "نشط" }
];

// Mock data for invitations
const mockInvitations = [
  { id: 1, institution: "مديرية التربية - غزة", status: "نشط", usages: "5/10", expiration: "2026-01-01" },
  { id: 2, institution: "مديرية التربية - الخان يونس", status: "منتهي", usages: "10/10", expiration: "2025-10-01" },
  { id: 3, institution: "مديرية التربية - الوسطى", status: "نشط", usages: "2/5", expiration: "2026-03-15" }
];

// Mock data for registration requests
const mockRequests = [
  { id: 1, name: "عمر عبد الرحمن", email: "omar@example.com", usages: "INV-001", date: "2025-10-15" },
  { id: 2, name: "نادية حسن", email: "nadia@example.com", usages: "INV-002", date: "2025-10-20" }
];

/**
 * Get all users
 * الحصول على جميع المستخدمين
 */
export const getUsers = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockUsers;
};

/**
 * Create a new user
 * إنشاء مستخدم جديد
 */
export const createUser = async (userData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Validate required fields
  if (!userData.name || !userData.email || !userData.role) {
    throw new Error('جميع الحقول مطلوبة');
  }
  
  // Add new user to mock data
  const newUser = {
    id: mockUsers.length + 1,
    ...userData,
    status: "نشط"
  };
  
  mockUsers.push(newUser);
  return newUser;
};

/**
 * Update a user
 * تحديث مستخدم
 */
export const updateUser = async (userId, userData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const userIndex = mockUsers.findIndex(user => user.id === userId);
  if (userIndex === -1) {
    throw new Error('المستخدم غير موجود');
  }
  
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
  return mockUsers[userIndex];
};

/**
 * Delete a user
 * حذف مستخدم
 */
export const deleteUser = async (userId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const userIndex = mockUsers.findIndex(user => user.id === userId);
  if (userIndex === -1) {
    throw new Error('المستخدم غير موجود');
  }
  
  mockUsers.splice(userIndex, 1);
  return { success: true };
};

/**
 * Get all invitations
 * الحصول على جميع الدعوات
 */
export const getInvitations = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockInvitations;
};

/**
 * Create a new invitation
 * إنشاء دعوة جديدة
 */
export const createInvitation = async (invitationData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Validate required fields
  if (!invitationData.institution) {
    throw new Error('المؤسسة/المديريّة مطلوبة');
  }
  
  // Add new invitation to mock data
  const newInvitation = {
    id: mockInvitations.length + 1,
    ...invitationData,
    status: "نشط",
    usages: invitationData.usages ? `${invitationData.usages}/10` : "0/10"
  };
  
  mockInvitations.push(newInvitation);
  return newInvitation;
};

/**
 * Get registration requests
 * الحصول على طلبات التسجيل
 */
export const getRegistrationRequests = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockRequests;
};

/**
 * Accept a registration request
 * قبول طلب التسجيل
 */
export const acceptRequest = async (requestId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const requestIndex = mockRequests.findIndex(req => req.id === requestId);
  if (requestIndex === -1) {
    throw new Error('الطلب غير موجود');
  }
  
  // Remove from requests (simulate acceptance)
  mockRequests.splice(requestIndex, 1);
  return { success: true };
};

/**
 * Reject a registration request
 * رفض طلب التسجيل
 */
export const rejectRequest = async (requestId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const requestIndex = mockRequests.findIndex(req => req.id === requestId);
  if (requestIndex === -1) {
    throw new Error('الطلب غير موجود');
  }
  
  // Remove from requests (simulate rejection)
  mockRequests.splice(requestIndex, 1);
  return { success: true };
};

export default {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getInvitations,
  createInvitation,
  getRegistrationRequests,
  acceptRequest,
  rejectRequest
};