// =============================================================================
// Parents Dashboard API Services - Real Backend Integration
// =============================================================================

import api from '../../../../api/axios';

/** Dashboard stats */
const getDashboardStats = async () => {
  try {
    const response = await api.get('/parent/dashboard');
    if (response.data?.success) {
      const { user_name, statistics, recent_notifications, children_schools } = response.data.data;

      return {
        // ✅ الاسم من user_info (مش user_name)
        userName: user_name || 'ولي الأمر',

        totalSchools: statistics?.schools_count || 0,
        averageRating: statistics?.average_rating || 0,
        activeEvaluations: Array.isArray(children_schools) ? children_schools.length : 0,

        pendingNotifications: Array.isArray(recent_notifications)
          ? recent_notifications.filter(n => !n.is_read).length
          : 0,

        recentActivities: Array.isArray(recent_notifications)
          ? recent_notifications.slice(0, 5).map(notification => ({
              id: notification.id,
              type: notification.type || 'info',
              title: notification.title,
              description: notification.message,
              timestamp: notification.created_at,
              read: notification.is_read
            }))
          : []
      };
    }

    return {
      userName: 'ولي الأمر',
      totalSchools: 0,
      averageRating: 0,
      activeEvaluations: 0,
      pendingNotifications: 0,
      recentActivities: []
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/** Schools list (يدعم myChildren) */
const getSchools = async (filters = {}) => {
  try {
    // مدارس الأبناء من الداشبورد
    if (filters.myChildren) {
      const response = await api.get('/parent/dashboard');
      if (response.data?.success) {
        const children_schools = response.data.data.children_schools || [];
        const schools = children_schools.map(child => {
          const s = child.school || {};
          // نحاول نتعامل مع اختلاف أسماء الحقول (name / school_name ، id / school_id)
          const schoolId = s.school_id ?? s.id;
          const schoolName = s.name ?? s.school_name ?? 'مدرسة';
          return {
            id: schoolId,
            name: schoolName,
            type: s.type || s.school_type || 'غير محدد',
            location: [s.city, s.region].filter(Boolean).join(' - '),
            address: s.address,
            overallRating: parseFloat(s.rating) || 0,
            ratingsCount: s.reviews_count || 0,
            description: `مدرسة ${schoolName}`,
            image:
              s.image ||
              s.logo ||
              s.cover_image ||
              'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=250&fit=crop',
            hasMyChild: true,
            childName: child.child_name || child.name,
            childGrade: child.child_grade || child.grade
          };
        });

        return { schools, total: schools.length };
      }
    }

    // جميع المدارس
    const response = await api.get('/schools', { params: filters });
    if (response.data?.success) {
      const schools = (response.data.data || []).map(school => ({
        id: school.school_id ?? school.id,
        name: school.name ?? school.school_name,
        type: school.type || school.school_type || 'غير محدد',
        location: [school.city, school.region].filter(Boolean).join(' - '),
        address: school.address,
        overallRating: parseFloat(school.rating) || 0,
        ratingsCount: school.reviews_count || 0,
        description: school.description || `مدرسة ${school.name ?? school.school_name ?? ''}`,
        image:
          school.logo ||
          school.cover_image ||
          'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=250&fit=crop',
        hasMyChild: false
      }));

      return { schools, total: response.data.total || schools.length };
    }

    return { schools: [], total: 0 };
  } catch (error) {
    console.error('Error fetching schools:', error);
    throw error;
  }
};

/** School details */
const getSchoolDetails = async (schoolId) => {
  try {
    const response = await api.get(`/schools/${schoolId}`);
    if (response.data?.success) {
      const school = response.data.data;
      return {
        id: school.school_id ?? school.id,
        name: school.name ?? school.school_name,
        type: school.type || school.school_type || 'غير محدد',
        location: [school.city, school.region].filter(Boolean).join(' - '),
        address: school.address,
        phone: school.phone,
        email: school.email,
        website: school.website,
        principalName: school.principal_name || 'غير محدد',
        establishedYear: school.established_year || new Date().getFullYear(),
        studentsCount: school.students_count || 0,
        teachersCount: school.teachers_count || 0,
        classroomsCount: school.classrooms_count || 0,
        image:
          school.logo ||
          school.cover_image ||
          'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=250&fit=crop',
        overallRating: parseFloat(school.rating) || 0,
        ratingsCount: school.reviews_count || 0,
        description: school.description || `مدرسة ${school.name ?? school.school_name ?? ''}`,
        facilities: school.facilities || [],
        achievements: school.achievements || [],
        ratings: school.ratings_breakdown || {}
      };
    }
    throw new Error('School not found');
  } catch (error) {
    console.error('Error fetching school details:', error);
    throw error;
  }
};

/** Submit evaluation */
const submitEvaluation = async (schoolId, evaluation) => {
  try {
    const response = await api.post(`/ratings`, {
      school_id: schoolId,
      rating: evaluation.overallRating,
      comment: evaluation.comment,
      criteria: evaluation.ratings
    });
    if (response.data?.success) {
      return {
        success: true,
        message: response.data.message || 'تم إرسال تقييمك بنجاح',
        evaluationId: response.data.data?.id
      };
    }
    throw new Error(response.data?.message || 'Failed to submit evaluation');
  } catch (error) {
    console.error('Error submitting evaluation:', error);
    throw error;
  }
};

/** Messages */
const getMessages = async (schoolId) => {
  try {
    const response = await api.get(`/parent/schools/${schoolId}/messages`);
    if (response.data?.success) {
      return (response.data.data || []).map(msg => ({
        id: msg.id,
        from: msg.sender_type === 'parent' ? 'parent' : 'school',
        text: msg.message,
        timestamp: msg.created_at,
        read: msg.is_read
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

const sendMessage = async (schoolId, messageText) => {
  try {
    const response = await api.post(`/parent/schools/${schoolId}/messages`, { message: messageText });
    if (response.data?.success) {
      return {
        messageId: response.data.data.id,
        timestamp: response.data.data.created_at
      };
    }
    throw new Error(response.data?.message || 'Failed to send message');
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/** Notifications */
const getNotifications = async (options = {}) => {
  try {
    const params = {};
    if (options.unreadOnly) params.unread_only = true;
    if (options.limit) params.limit = options.limit;

    const response = await api.get('/parent/notifications', { params });
    if (response.data?.success) {
      const d = response.data.data || {};
      return {
        success: true,
        data: (d.notifications || []).map(notif => ({
          id: notif.id,
          title: notif.title,
          message: notif.message,
          type: notif.type,
          read: notif.is_read,
          timestamp: notif.created_at,
          schoolId: notif.related_school_id
        })),
        unreadCount: d.unread_count ?? 0,
        total: d.total ?? 0
      };
    }
    return { success: false, data: [], unreadCount: 0, total: 0 };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { success: false, data: [], unreadCount: 0, total: 0 };
  }
};

const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/parent/notifications/${notificationId}/read`);
    if (response.data?.success) return { success: true };
    throw new Error('Failed to mark notification as read');
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// ===================================================================
// Parent Profile API (Real Backend Integration)
// ===================================================================

/** Get parent profile with children */
const getParentProfile = async () => {
  const res = await api.get('/parent/profile');
  if (!res.data?.success) throw new Error('Failed to fetch parent profile');
  const p = res.data.data;
  return {
    fullName: p.fullName ?? '',
    email: p.email ?? '',
    phone: p.phone ?? '',
    address: p.address ?? '',
    profileImage: p.profileImage ?? null,
    children: Array.isArray(p.children) ? p.children : []
  };
};

/** Update parent profile */
const updateParentProfile = async (payload) => {
  const res = await api.put('/parent/profile', payload);
  if (!res.data?.success) throw new Error(res.data?.message || 'Failed to update profile');
  return await getParentProfile();
};

/** Update parent avatar */
const updateParentAvatar = async (formData) => {
  const res = await api.post('/parent/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  if (!res.data?.success) throw new Error(res.data?.message || 'Failed to upload avatar');
  return res.data; // { success, data: { profileImage: '...' } }
};

/** Get children list (backward compatibility) */
const getChildren = async () => {
  const profile = await getParentProfile();
  return Array.isArray(profile.children) ? profile.children : [];
};

// ===================================================================
// Parent Settings API (Real Backend Integration)
// ===================================================================

/** Get parent settings */
const getParentSettings = async () => {
  const res = await api.get('/parent/settings');
  if (!res.data?.success) throw new Error('Failed to fetch settings');
  return res.data.data;
};

/** Change password */
const changePassword = async (payload) => {
  const res = await api.post('/parent/settings/change-password', {
    current_password: payload.currentPassword,
    new_password: payload.newPassword,
    confirm_password: payload.confirmPassword,
  });
  if (!res.data?.success) throw new Error(res.data?.message || 'Failed to change password');
  return res.data;
};

/** Update notification settings */
const updateNotificationSettings = async (payload) => {
  const res = await api.put('/parent/settings/notifications', payload);
  if (!res.data?.success) throw new Error(res.data?.message || 'Failed to update settings');
  return res.data;
};

// ===================================================================
// School Evaluation API (Real Backend Integration)
// ===================================================================

/** Get school evaluation details */
const getSchoolEvaluation = async (schoolId) => {
  const res = await api.get(`/parent/schools/${schoolId}/evaluation`);
  if (!res.data?.success) throw new Error('Failed to fetch school evaluation');
  return res.data.data;
};

/** Submit school evaluation */
const submitSchoolEvaluation = async (schoolId, evaluation) => {
  const criteriaArray = evaluation.criteria.map((c) => ({
    criterion_id: c.criterion_id,  // لا تغير
    score: c.rating || 3            // ⚠️ يجب أن يكون 'score' وليس 'rating'
  }));

  const res = await api.post(`/parent/schools/${schoolId}/evaluation`, {
    criteria: criteriaArray,
    comment: evaluation.comment || '',
    date: evaluation.evaluation_date || new Date().toISOString().split('T')[0], // إعادة التسمية لـ 'date'
  });

  if (!res.data?.success) throw new Error(res.data?.message || 'Failed to submit evaluation');
  return res.data;
};


/** Get evaluation criteria */
const getEvaluationCriteria = async () => {
  const res = await api.get('/parent/evaluation-criteria');
  if (!res.data?.success) throw new Error('Failed to fetch criteria');
  return res.data.data;
};

/* ===================================================================== */

/** Export */
export const parentsAPI = {
  // Profile - Real Backend Integration
  getParentProfile,
  updateParentProfile,
  updateParentAvatar,
  getChildren,

  // Settings - Real Backend Integration
  getParentSettings,
  changePassword,
  updateNotificationSettings,

  // School Evaluations - Real Backend Integration
  getSchoolEvaluation,
  submitSchoolEvaluation,
  getEvaluationCriteria,

  // Dashboard + Schools + Messages + Notifications
  getDashboardStats,
  getSchools,
  getSchoolDetails,
  submitEvaluation,
  getMessages,
  sendMessage,
  getNotifications,
  markNotificationAsRead,
};

export default parentsAPI;
