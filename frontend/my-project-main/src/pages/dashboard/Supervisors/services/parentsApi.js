import api from './api';

// =============================================================================
// Parents Dashboard API Services - Complete Implementation
// خدمات API كاملة لداشبورد أولياء الأمور مع بيانات واقعية
// =============================================================================

/**
 * محاكاة تأخير الشبكة لتجربة واقعية
 * Simulate network delay for realistic experience
 */
const simulateDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * بيانات وهمية واقعية لأولياء الأمور والأطفال
 * Realistic mock data for parents and children
 */
const getDefaultMockData = () => ({
  // بيانات ولي الأمر
  parentProfile: {
    id: 'parent_001',
    fullName: 'أحمد محمد السعد',
    email: 'ahmed.alsaad@gmail.com',
    phone: '+96650124567',
    address: 'الرياض، حي المروج، شارع الأمير سلطان',
    region: 'منطقة الرياض',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&default=1',
    dateJoined: '2023-09-15',
    preferences: {
      notifications: true,
      emailNotifications: true,
      smsNotifications: false,
      language: 'ar',
      theme: 'light'
    }
  },

  // بيانات الأطفال
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
  ],

  // بيانات المدارس التفصيلية
  schools: [
    {
      id: 'school_001',
      name: 'مدرسة الأمل الابتدائية',
      type: 'ابتدائية',
      location: 'الرياض - حي المروج',
      address: 'شارع الأمير سلطان، حي المروج، الرياض 12345',
      phone: '+966112345678',
      email: 'info@alamal-primary.edu.sa',
      website: 'www.alamal-primary.edu.sa',
      principalName: 'أ. عبدالرحمن السالم',
      establishedYear: 1995,
      studentsCount: 450,
      teachersCount: 24,
      classroomsCount: 18,
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=250&fit=crop',
      overallRating: 4.5,
      ratingsCount: 127,
      description: 'مدرسة الأمل الابتدائية هي إحدى المدارس الرائدة في منطقة الرياض، تتميز بالتعليم الحديث والبيئة التعليمية المحفزة. نسعى لتقديم تعليم متميز يهدف لإعداد جيل واعٍ ومبدع.',
      facilities: [
        'مختبرات علوم متطورة',
        'مكتبة رقمية',
        'ملاعب رياضية',
        'قاعة متعددة الأغراض',
        'مقصف صحي',
        'عيادة طبية',
        'نظام أمان متطور'
      ],
      achievements: [
        'المركز الأول في مسابقة العلوم على مستوى المنطقة 2024',
        'شهادة الجودة التعليمية من وزارة التعليم',
        'أفضل برنامج للأنشطة اللاصفية 2023'
      ],
      ratings: {
        educationQuality: 4.6,
        facilities: 4.3,
        teachers: 4.7,
        administration: 4.4,
        cleanliness: 4.5,
        safety: 4.8,
        communication: 4.2,
        activities: 3.8
      },
      workingHours: {
        start: '07:00',
        end: '14:30',
        breakTime: '10:00-10:30'
      },
      tuitionFees: 15000,
      hasMyChild: true
    },
    {
      id: 'school_002',
      name: 'مدرسة النجاح المتوسطة',
      type: 'متوسطة',
      location: 'الرياض - حي النرجس',
      address: 'طريق الملك فهد، حي النرجس، الرياض 12234',
      phone: '+966112345679',
      email: 'contact@alnajah-middle.edu.sa',
      website: 'www.alnajah-middle.edu.sa',
      principalName: 'أ. فاطمة الخالد',
      establishedYear: 2001,
      studentsCount: 320,
      teachersCount: 28,
      classroomsCount: 15,
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=250&fit=crop',
      overallRating: 4.2,
      ratingsCount: 89,
      description: 'مدرسة النجاح المتوسطة تركز على التعليم الشامل والتربية الإيجابية، مع برامج متنوعة تهدف لإعداد الطلاب للمرحلة الثانوية بكفاءة عالية.',
      facilities: [
        'معامل حاسوب متقدمة',
        'مختبرات فيزياء وكيمياء',
        'مكتبة شاملة',
        'صالة رياضية مغطاة',
        'مسرح المدرسة',
        'مقصف متنوع',
        'موقف آمن للسيارات'
      ],
      achievements: [
        'التميز في الأنشطة الثقافية 2024',
        'أفضل مشروع علمي على مستوى الإدارة',
        'برنامج متميز للطلاب الموهوبين'
      ],
      ratings: {
        educationQuality: 4.3,
        facilities: 4.0,
        teachers: 4.4,
        administration: 4.1,
        cleanliness: 4.2,
        safety: 4.5,
        communication: 4.0,
        activities: 3.9
      },
      workingHours: {
        start: '07:30',
        end: '15:00',
        breakTime: '10:30-11:00'
      },
      tuitionFees: 18000,
      hasMyChild: true
    },
    {
      id: 'school_003',
      name: 'مدرسة المستقبل الثانوية',
      type: 'ثانوية',
      location: 'الرياض - حي العليا',
      address: 'شارع العليا العام، حي العليا، الرياض 12211',
      phone: '+966112345680',
      email: 'info@almostaqbal-high.edu.sa',
      website: 'www.almostaqbal-high.edu.sa',
      principalName: 'أ. خالد العمري',
      establishedYear: 2005,
      studentsCount: 280,
      teachersCount: 35,
      classroomsCount: 20,
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=400&h=250&fit=crop',
      overallRating: 4.8,
      ratingsCount: 156,
      description: 'مدرسة المستقبل الثانوية تتميز بالتعليم المتقدم والإعداد المتميز للجامعات، مع تركيز على التفكير النقدي والإبداع.',
      facilities: [
        'مختبرات علمية متطورة',
        'استوديو تسجيل',
        'مركز تقنية المعلومات',
        'قاعات محاضرات مجهزة',
        'مكتبة إلكترونية',
        'كافتيريا حديثة',
        'مقاعد واسعة'
      ],
      achievements: [
        'أعلى نسبة قبول جامعي في المنطقة 2024',
        'مركز التميز في التعليم الإلكتروني',
        'جائزة أفضل مدرسة ثانوية 2023'
      ],
      ratings: {
        educationQuality: 4.9,
        facilities: 4.7,
        teachers: 4.8,
        administration: 4.6,
        cleanliness: 4.8,
        safety: 4.9,
        communication: 4.5,
        activities: 4.6
      },
      workingHours: {
        start: '07:00',
        end: '15:30',
        breakTime: '10:00-10:30'
      },
      tuitionFees: 22000,
      hasMyChild: false
    },
    {
      id: 'school_004',
      name: 'مدرسة الياسمين الابتدائية',
      type: 'ابتدائية',
      location: 'الرياض - حي النرجس',
      address: 'شارع النرجس، الرياض 12234',
      phone: '+966112345681',
      email: 'info@alyasmin-primary.edu.sa',
      website: 'www.alyasmin-primary.edu.sa',
      principalName: 'أ. محمد علي',
      establishedYear: 2010,
      studentsCount: 350,
      teachersCount: 20,
      classroomsCount: 15,
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=250&fit=crop',
      overallRating: 3.9,
      ratingsCount: 95,
      description: 'مدرسة الياسمين الابتدائية تقدم تعليماً متميزاً في بيئة محفزة وآمنة.',
      facilities: [
        'مختبرات علوم',
        'مكتبة',
        'ملعب رياضي',
        'قاعة متعددة الأغراض',
        'مقصف'
      ],
      achievements: [
        'المركز الثاني في مسابقة الرياضيات على مستوى المنطقة 2024',
        'أفضل مدرسة في التفاعل مع المجتمع 2023'
      ],
      ratings: {
        educationQuality: 3.7,
        facilities: 3.6,
        teachers: 3.7,
        administration: 3.9,
        cleanliness: 3.6,
        safety: 4.2,
        communication: 3.8,
        activities: 3.9
      },
      workingHours: {
        start: '07:30',
        end: '14:00',
        breakTime: '10:00-10:30'
      },
      tuitionFees: 12000,
      hasMyChild: false
    },
    {
      id: 'school_005',
      name: 'مدرسة الأمل المتوسطة',
      type: 'متوسطة',
      location: 'الرياض - حي النرجس',
      address: 'شارع الملك فهد، الرياض 12234',
      phone: '+966112345682',
      email: 'contact@alamal-middle.edu.sa',
      website: 'www.alamal-middle.edu.sa',
      principalName: 'أ. سارة أحمد',
      establishedYear: 2008,
      studentsCount: 280,
      teachersCount: 25,
      classroomsCount: 12,
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=250&fit=crop',
      overallRating: 4.5,
      ratingsCount: 112,
      description: 'مدرسة الأمل المتوسطة تركز على تطوير المهارات الأكاديمية والاجتماعية للطلاب.',
      facilities: [
        'معامل حاسوب',
        'مختبرات فيزياء وكيمياء',
        'مكتبة شاملة',
        'صالة رياضية',
        'مسرح المدرسة',
        'مقصف'
      ],
      achievements: [
        'أفضل برنامج للأنشطة اللاصفية 2024',
        'المركز الأول في مسابقة العلوم على مستوى الإدارة'
      ],
      ratings: {
        educationQuality: 4.8,
        facilities: 4.2,
        teachers: 4.8,
        administration: 4.6,
        cleanliness: 4.2,
        safety: 4.7,
        communication: 4.5,
        activities: 4.6
      },
      workingHours: {
        start: '07:00',
        end: '14:30',
        breakTime: '10:00-10:30'
      },
      tuitionFees: 16000,
      hasMyChild: false
    }
  ],

  // الإشعارات
  notifications: [
    {
      id: 'n-001',
      schoolId: 'school_001',
      schoolName: 'مدرسة الأمل الابتدائية',
      directorate: 'مديرية شرق غزة',
      type: 'achievement',
      title: 'فوز في مسابقة الرياضيات',
      message: 'مدرسة الأمل الابتدائية حصلت على جائزة المركز الأول في مسابقة الرياضيات على مستوى المحافظة.',
      date: '2025-09-20T10:30:00Z',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      read: false,
      actionUrl: '/dashboard/parents/schools'
    },
    {
      id: 'n-002',
      schoolId: 'school_002',
      schoolName: 'مدرسة النجاح المتوسطة',
      directorate: 'مديرية شرق غزة',
      type: 'improvement',
      title: 'تحسين المرافق العامة',
      message: 'مدرسة النجاح المتوسطة قامت بتحسين المرافق العامة: ترميم الفناء وتجديد دورات المياه.',
      date: '2025-09-18T09:00:00Z',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: false,
      actionUrl: '/dashboard/parents/schools'
    },
    {
      id: 'n-003',
      schoolId: 'school_001',
      schoolName: 'مدرسة الأمل الابتدائية',
      directorate: 'مديرية شرق غزة',
      type: 'achievement',
      title: 'الحصول على جائزة التميز',
      message: 'مدرسة الأمل الابتدائية حصلت على جائزة التميز كأفضل مدرسة ابتدائية لعام 2025.',
      date: '2025-09-15T14:00:00Z',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      read: true,
      actionUrl: '/dashboard/parents/schools'
    },
    {
      id: 'n-004',
      schoolId: 'school_002',
      schoolName: 'مدرسة النجاح المتوسطة',
      directorate: 'مديرية شرق غزة',
      type: 'improvement',
      title: 'تطوير مختبر العلوم',
      message: 'مدرسة النجاح المتوسطة قامت بتطوير مختبر العلوم بإضافة معدات ومختبرات جديدة.',
      date: '2025-09-10T11:30:00Z',
      timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      read: false,
      actionUrl: '/dashboard/parents/schools'
    },
    {
      id: 'n-005',
      schoolId: 'school_001',
      schoolName: 'مدرسة الأمل الابتدائية',
      directorate: 'مديرية شرق غزة',
      type: 'achievement',
      title: 'النجاح في مسابقة القراءة',
      message: 'فريق مدرسة الأمل الابتدائية حصل على المركز الثاني في مسابقة القراءة على مستوى المنطقة.',
      date: '2025-09-05T16:45:00Z',
      timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
      read: true,
      actionUrl: '/dashboard/parents/schools'
    },
    {
      id: 'n-006',
      schoolId: 'school_002',
      schoolName: 'مدرسة النجاح المتوسطة',
      directorate: 'مديرية شرق غزة',
      type: 'improvement',
      title: 'تحديث المكتبة',
      message: 'مدرسة النجاح المتوسطة قامت بتحديث مكتبتها بإضافة أكثر من 300 كتاب جديد.',
      date: '2025-08-28T09:15:00Z',
      timestamp: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
      read: false,
      actionUrl: '/dashboard/parents/schools'
    },
    {
      id: 'n-007',
      schoolId: 'school_001',
      schoolName: 'مدرسة الأمل الابتدائية',
      directorate: 'مديرية شرق غزة',
      type: 'achievement',
      title: 'الحصول على جائزة الابتكار',
      message: 'مدرسة الأمل الابتدائية حصلت على جائزة الابتكار في التعليم للعام الدراسي 2024-2025.',
      date: '2025-08-20T13:20:00Z',
      timestamp: new Date(Date.now() - 144 * 60 * 60 * 1000).toISOString(),
      read: true,
      actionUrl: '/dashboard/parents/schools'
    },
    {
      id: 'n-008',
      schoolId: 'school_002',
      schoolName: 'مدرسة النجاح المتوسطة',
      directorate: 'مديرية شرق غزة',
      type: 'improvement',
      title: 'تحسين نظام الأمان',
      message: 'مدرسة النجاح المتوسطة قامت بتحسين نظام الأمان بإضافة كاميرات مراقبة وتحديث نظام الدخول.',
      date: '2025-08-15T10:00:00Z',
      timestamp: new Date(Date.now() - 168 * 60 * 60 * 1000).toISOString(),
      read: false,
      actionUrl: '/dashboard/parents/schools'
    }
  ],

  // الأنشطة الحديثة
  recentActivities: [
    {
      id: 'act_001',
      title: 'تقييم مدرسة الأمل',
      description: 'لقد قمت بتقييم مدرسة الأمل الابتدائية',
      type: 'evaluation',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: 'act_002',
      title: 'رسالة جديدة من المدرسة',
      description: 'لقد تلقيت رسالة من إدارة مدرسة النجاح المتوسطة',
      type: 'message',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: 'act_003',
      title: 'إنجاز طفلك',
      description: 'محمد حصل على المرتبة الأولى في مسابقة الرياضيات',
      type: 'achievement',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: 'act_004',
      title: 'تحديث معلومات المدرسة',
      description: 'تم تحديث معلومات مدرسة المستقبل الثانوية',
      type: 'school',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: 'act_005',
      title: 'تحسن أكاديمي',
      description: 'سجلت سارة تحسناً ملحوظاً في أدائها الأكاديمي',
      type: 'achievement',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: 'act_006',
      title: 'جائزة مدرس السنة',
      description: 'أ. عبدالرحمن السالم حصل على جائزة مدرس السنة في مدرسة الأمل الابتدائية',
      type: 'achievement',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false
    }
  ],

  // إحصائيات الداشبورد
  dashboardStats: {
    totalSchools: 2,
    averageRating: 4.35,
    activeEvaluations: 1,
    pendingNotifications: 5,
    recentActivities: []
  }
});
const DEFAULT_MOCK_DATA = getDefaultMockData();

// Load persisted data from localStorage or use default data
const loadPersistedData = () => {
  try {
    const savedData = localStorage.getItem('parentDashboardMockData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      return parsedData;
    }
    // Return a deep copy of default data to avoid reference issues
    const defaultData = JSON.parse(JSON.stringify(DEFAULT_MOCK_DATA));
    
    // Load notification read states from localStorage if available
    const storedNotifications = localStorage.getItem('parentNotifications');
    if (storedNotifications) {
      const parsedNotifications = JSON.parse(storedNotifications);
      // Merge read states with default notifications
      defaultData.notifications = defaultData.notifications.map(notification => {
        const storedNotification = parsedNotifications.find(n => n.id === notification.id);
        return storedNotification ? { ...notification, read: storedNotification.read } : notification;
      });
    }
    
    return defaultData;
  } catch (error) {
    console.warn('Failed to load persisted mock data, using defaults:', error);
    // Return a deep copy of default data to avoid reference issues
    return JSON.parse(JSON.stringify(DEFAULT_MOCK_DATA));
  }
};

// Save data to localStorage
const savePersistedData = (data) => {
  try {
    localStorage.setItem('parentDashboardMockData', JSON.stringify(data));
    
    // Also save notification states separately for easier access
    const notificationStates = data.notifications.map(n => ({ id: n.id, read: n.read }));
    localStorage.setItem('parentNotifications', JSON.stringify(notificationStates));
  } catch (error) {
    console.warn('Failed to save mock data to localStorage:', error);
  }
};

// Reset mock data to defaults
export const resetMockData = () => {
  MOCK_DATA = getDefaultMockData();
  savePersistedData(MOCK_DATA);
  console.log('Mock data has been reset to defaults');
};

// Initialize MOCK_DATA with persisted data
let MOCK_DATA = loadPersistedData();
console.log('Final MOCK_DATA profile image:', MOCK_DATA.parentProfile.profileImage);
console.log('Full MOCK_DATA:', MOCK_DATA);

/**
 * استدعاء بيانات ملف ولي الأمر
 * Fetch parent profile data
 * @returns {Promise<Object>} بيانات ملف ولي الأمر
 */
export const parentsAPI = {
  // إدارة الملف الشخصي
  getParentProfile: async () => {
    await simulateDelay(800);
    return MOCK_DATA.parentProfile;
  },
  
  updateParentProfile: async (data) => {
    await simulateDelay(800);
    MOCK_DATA.parentProfile = { ...MOCK_DATA.parentProfile, ...data };
    savePersistedData(MOCK_DATA); // Save to localStorage
    return {
      success: true,
      message: 'تم تحديث البيانات بنجاح',
      data: MOCK_DATA.parentProfile
    };
  },
  
  updateProfileImage: async (formData) => {
    await simulateDelay(800);
    // Simulate image upload with a clearly different image
    const timestamp = Date.now();
    const imageUrl = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&t=${timestamp}`;
    MOCK_DATA.parentProfile.profileImage = imageUrl;
    savePersistedData(MOCK_DATA); // Save to localStorage
    return {
      success: true,
      message: 'تم تحديث الصورة بنجاح',
      data: { profileImage: imageUrl }
    };
  },
  
  // إدارة التفضيلات
  getPreferences: async () => {
    await simulateDelay(500);
    return MOCK_DATA.parentProfile.preferences;
  },
  
  updatePreferences: async (preferences) => {
    await simulateDelay(500);
    MOCK_DATA.parentProfile.preferences = { ...MOCK_DATA.parentProfile.preferences, ...preferences };
    savePersistedData(MOCK_DATA); // Save to localStorage
    return {
      success: true,
      message: 'تم تحديث التفضيلات بنجاح',
      data: MOCK_DATA.parentProfile.preferences
    };
  },
  
  updateTheme: async (theme) => {
    await simulateDelay(300);
    MOCK_DATA.parentProfile.preferences.theme = theme;
    savePersistedData(MOCK_DATA); // Save to localStorage
    return {
      success: true,
      message: 'تم تحديث السمة بنجاح',
      data: { theme }
    };
  },
  
  // إدارة الإشعارات
  getNotifications: async () => {
    await simulateDelay(600);
    return MOCK_DATA.notifications;
  },
  
  markNotificationRead: async (notificationId) => {
    await simulateDelay(300);
    const notification = MOCK_DATA.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      savePersistedData(MOCK_DATA); // Save to localStorage
      
      // Also update the separate notifications storage
      const storedNotifications = JSON.parse(localStorage.getItem('parentNotifications') || '[]');
      const updatedNotifications = storedNotifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem('parentNotifications', JSON.stringify(updatedNotifications));
    }
    return {
      success: true,
      message: 'تم وضع علامة مقروء على الإشعار'
    };
  },
  
  markAllNotificationsRead: async () => {
    await simulateDelay(500);
    MOCK_DATA.notifications.forEach(n => n.read = true);
    savePersistedData(MOCK_DATA); // Save to localStorage
    
    // Also update the separate notifications storage
    const storedNotifications = JSON.parse(localStorage.getItem('parentNotifications') || '[]');
    const updatedNotifications = storedNotifications.map(n => ({ ...n, read: true }));
    localStorage.setItem('parentNotifications', JSON.stringify(updatedNotifications));
    
    return {
      success: true,
      message: 'تم وضع علامة مقروء على جميع الإشعارات'
    };
  },
  
  updateNotificationSettings: async (settings) => {
    await simulateDelay(500);
    MOCK_DATA.parentProfile.preferences = { ...MOCK_DATA.parentProfile.preferences, ...settings };
    savePersistedData(MOCK_DATA); // Save to localStorage
    return {
      success: true,
      message: 'تم تحديث إعدادات الإشعارات بنجاح',
      data: MOCK_DATA.parentProfile.preferences
    };
  },
  
  // إحصائيات لوحة التحكم
  getDashboardStats: async () => {
    await simulateDelay(700);
    // Update dashboard stats with recent activities
    const stats = {
      ...MOCK_DATA.dashboardStats,
      recentActivities: MOCK_DATA.recentActivities
    };
    return stats;
  },
  
  // إدارة المدارس
  getSchools: async (filters = {}) => {
    await simulateDelay(800);
    let filteredSchools = [...MOCK_DATA.schools];

    // Apply filters
    if (filters.myChildren) {
      filteredSchools = filteredSchools.filter(school => school.hasMyChild);
    }

    if (filters.search) {
      const term = filters.search.toLowerCase();
      filteredSchools = filteredSchools.filter(school => 
        school.name.toLowerCase().includes(term) || 
        school.location.toLowerCase().includes(term)
      );
    }

    return {
      schools: filteredSchools,
      total: filteredSchools.length
    };
  },
  
  getSchoolDetails: async (schoolId) => {
    await simulateDelay(600);
    const school = MOCK_DATA.schools.find(s => s.id === schoolId);
    
    if (!school) {
      throw new Error('المدرسة غير موجودة');
    }

    return school;
  },
  
  rateSchool: async (schoolId, rating) => {
    await simulateDelay(1000);
    const school = MOCK_DATA.schools.find(s => s.id === schoolId);
    
    if (!school) {
      throw new Error('المدرسة غير موجودة');
    }

    // Simulate rating submission
    return {
      success: true,
      message: 'تم إرسال تقييمك بنجاح',
      data: { schoolId, rating }
    };
  },
  
  getSchoolReviews: async (schoolId) => {
    await simulateDelay(700);
    // Simulate reviews
    const reviews = [
      {
        id: 'rev_001',
        parentId: 'parent_001',
        parentName: 'أحمد محمد',
        rating: 5,
        comment: 'مدرسة ممتازة، المعلمين متعاونون جداً',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'rev_002',
        parentId: 'parent_002',
        parentName: 'فاطمة علي',
        rating: 4,
        comment: 'بيئة تعليمية جيدة جداً',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    return reviews;
  },
  
  addSchoolReview: async (schoolId, review) => {
    await simulateDelay(1000);
    // Simulate review submission
    const newReview = {
      id: `rev_${Date.now()}`,
      parentId: MOCK_DATA.parentProfile.id,
      parentName: MOCK_DATA.parentProfile.fullName.split(' ')[0],
      ...review,
      timestamp: new Date().toISOString()
    };

    return {
      success: true,
      message: 'تم إضافة تقييمك بنجاح',
      data: newReview
    };
  },
  
  // إدارة التقييمات
  getEvaluations: async () => {
    await simulateDelay(700);
    // Simulate evaluations
    const evaluations = [
      {
        id: 'eval_001',
        schoolId: 'school_001',
        schoolName: 'مدرسة الأمل الابتدائية',
        ratings: {
          educationQuality: 5,
          facilities: 4,
          teachers: 5,
          administration: 4,
          cleanliness: 4,
          safety: 5,
          communication: 4
        },
        overallRating: 4.4,
        comment: 'مدرسة ممتازة والمعلمون متعاونون جداً',
        timestamp: '2024-01-15T10:30:00Z',
        status: 'approved'
      },
      {
        id: 'eval_002',
        schoolId: 'school_002',
        schoolName: 'مدرسة النجاح المتوسطة',
        ratings: {
          educationQuality: 4,
          facilities: 4,
          teachers: 4,
          administration: 4,
          cleanliness: 4,
          safety: 4,
          communication: 3
        },
        overallRating: 3.9,
        comment: 'مدرسة جيدة لكن يحتاج تحسين التواصل مع أولياء الأمور',
        timestamp: '2024-01-10T14:20:00Z',
        status: 'approved'
      }
    ];

    return evaluations;
  },
  
  getEvaluationDetails: async (evaluationId) => {
    await simulateDelay(600);
    // Simulate evaluation details
    const evaluation = {
      id: evaluationId,
      schoolId: 'school_001',
      schoolName: 'مدرسة الأمل الابتدائية',
      ratings: {
        educationQuality: 5,
        facilities: 4,
        teachers: 5,
        administration: 4,
        cleanliness: 4,
        safety: 5,
        communication: 4
      },
      overallRating: 4.4,
      comment: 'مدرسة ممتازة والمعلمون متعاونون جداً',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'approved',
      response: {
        managerName: 'أ. عبدالرحمن السالم',
        responseText: 'شكرًا لتقييمكم الإيجابي. نحن نسعى دائمًا لتحسين تجربة التعليم لأبنائكم.',
        timestamp: '2024-01-16T09:15:00Z'
      }
    };

    return evaluation;
  },
  
  submitEvaluation: async (evaluationData) => {
    await simulateDelay(1000);
    // Simulate evaluation submission
    const newEvaluation = {
      id: `eval_${Date.now()}`,
      ...evaluationData,
      timestamp: new Date().toISOString(),
      status: 'submitted'
    };

    return {
      success: true,
      message: 'تم إرسال تقييمك بنجاح. شكرًا لمساهمتك في تحسين التعليم.',
      data: newEvaluation
    };
  },
  
  updateEvaluation: async (evaluationId, data) => {
    await simulateDelay(800);
    // Simulate evaluation update
    return {
      success: true,
      message: 'تم تحديث التقييم بنجاح',
      data: { evaluationId, ...data }
    };
  },
  
  // إدارة الرسائل
  getMessages: async (schoolId) => {
    await simulateDelay(600);
    // Simulate messages
    const messages = [
      {
        id: 'msg_001',
        from: 'manager',
        text: 'أهلاً بك! أنا أ. عبدالرحمن السالم. كيف أستطيع مساعدتك؟',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: true
      },
      {
        id: 'msg_002',
        from: 'parent',
        text: 'أهلاً وسهلاً، أريد الاستفسار عن أداء طفلي في الفصل الدراسي الحالي',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        read: true
      },
      {
        id: 'msg_003',
        from: 'manager',
        text: 'بالطبع، يمكنني مساعدتك في ذلك. هل يمكنك تزويدي باسم الطالب ورقم الصف؟',
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        read: true
      }
    ];

    return messages;
  },
  
  sendMessage: async (schoolId, message) => {
    await simulateDelay(500);
    // Simulate message sending
    const newMessage = {
      messageId: `msg_${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    // Simulate auto-reply
    setTimeout(() => {
      // This would be handled by a real-time system in production
    }, 1000);

    return {
      success: true,
      message: 'تم إرسال الرسالة بنجاح',
      data: newMessage
    };
  }
};

/**
 * تحديث بيانات ملف ولي الأمر
 * Update parent profile data
 * @param {Object} profileData - البيانات المحدثة
 * @returns {Promise<Object>} نتيجة التحديث
 */
export const updateParentProfile = async (profileData) => {
  await simulateDelay(800);
  // محاكاة تحديث البيانات
  MOCK_DATA.parentProfile = { ...MOCK_DATA.parentProfile, ...profileData };
  savePersistedData(MOCK_DATA); // Save to localStorage
  return {
    success: true,
    message: 'تم تحديث البيانات بنجاح',
    data: MOCK_DATA.parentProfile
  };
};

/**
 * استدعاء بيانات الأطفال
 * Fetch children data
 * @returns {Promise<Object>} قائمة الأطفال
 */
export const getChildren = async () => {
  await simulateDelay(600);
  return {
    success: true,
    data: MOCK_DATA.children
  };
};

/**
 * استدعاء بيانات المدارس المرتبطة بالأطفال
 * Fetch schools associated with children
 * @returns {Promise<Object>} قائمة المدارس
 */
export const getMyChildrenSchools = async () => {
  await simulateDelay(700);
  const mySchools = MOCK_DATA.schools.filter(school => school.hasMyChild);
  return {
    success: true,
    data: mySchools,
    total: mySchools.length
  };
};

/**
 * استدعاء جميع المدارس المتاحة
 * Fetch all available schools
 * @param {Object} filters - فلاتر البحث
 * @returns {Promise<Object>} قائمة المدارس مع الفلاترز
 */
export const getAllSchools = async (filters = {}) => {
  await simulateDelay(800);
  let filteredSchools = [...MOCK_DATA.schools];

  // تطبيق فلاتر البحث
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredSchools = filteredSchools.filter(school =>
      school.name.toLowerCase().includes(searchTerm) ||
      school.location.toLowerCase().includes(searchTerm) ||
      school.description.toLowerCase().includes(searchTerm)
    );
  }

  if (filters.type && filters.type !== 'all') {
    filteredSchools = filteredSchools.filter(school => school.type === filters.type);
  }

  if (filters.minRating) {
    filteredSchools = filteredSchools.filter(school => school.overallRating >= parseFloat(filters.minRating));
  }

  if (filters.myChildren) {
    filteredSchools = filteredSchools.filter(school => school.hasMyChild);
  }

  // ترتيب النتائج
  if (filters.sortBy) {
    filteredSchools.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'ar');
        case 'overallRating':
          return b.overallRating - a.overallRating;
        case 'studentsCount':
          return b.studentsCount - a.studentsCount;
        default:
          return 0;
      }
    });
  }

  return {
    success: true,
    data: filteredSchools,
    total: filteredSchools.length,
    filters: filters
  };
};

/**
 * استدعاء تفاصيل مدرسة محددة
 * Fetch specific school details
 * @param {string} schoolId - معرف المدرسة
 * @returns {Promise<Object>} تفاصيل المدرسة
 */
export const getSchoolDetails = async (schoolId) => {
  await simulateDelay(600);
  const school = MOCK_DATA.schools.find(s => s.id === schoolId);
  
  if (!school) {
    return {
      success: false,
      error: 'المدرسة غير موجودة'
    };
  }

  return {
    success: true,
    data: school
  };
};

/**
 * تقييم مدرسة
 * Evaluate a school
 * @param {string} schoolId - معرف المدرسة
 * @param {Object} evaluation - بيانات التقييم
 * @returns {Promise<Object>} نتيجة التقييم
 */
export const evaluateSchool = async (schoolId, evaluation) => {
  await simulateDelay(1000);
  
  // محاكاة حفظ التقييم
  const newEvaluation = {
    id: `eval_${Date.now()}`,
    schoolId,
    parentId: MOCK_DATA.parentProfile.id,
    ...evaluation,
    timestamp: new Date().toISOString(),
    status: 'submitted'
  };

  return {
    success: true,
    message: 'تم إرسال تقييمك بنجاح. شكرًا لمساهمتك في تحسين التعليم.',
    data: newEvaluation
  };
};

/**
 * استدعاء تقييمات ولي الأمر
 * Fetch parent's evaluations
 * @returns {Promise<Object>} قائمة التقييمات
 */
export const getMyEvaluations = async () => {
  await simulateDelay(700);
  
  // بيانات وهمية للتقييمات السابقة
  const evaluations = [
    {
      id: 'eval_001',
      schoolId: 'school_001',
      schoolName: 'مدرسة الأمل الابتدائية',
      ratings: {
        educationQuality: 5,
        facilities: 4,
        teachers: 5,
        administration: 4,
        cleanliness: 4,
        safety: 5,
        communication: 4
      },
      overallRating: 4.4,
      comment: 'مدرسة ممتازة والمعلمون متعاونون جداً',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'approved'
    },
    {
      id: 'eval_002',
      schoolId: 'school_002',
      schoolName: 'مدرسة النجاح المتوسطة',
      ratings: {
        educationQuality: 4,
        facilities: 4,
        teachers: 4,
        administration: 4,
        cleanliness: 4,
        safety: 4,
        communication: 3
      },
      overallRating: 3.9,
      comment: 'مدرسة جيدة لكن يحتاج تحسين التواصل مع أولياء الأمور',
      timestamp: '2024-01-10T14:20:00Z',
      status: 'approved'
    }
  ];

  return {
    success: true,
    data: evaluations,
    total: evaluations.length
  };
};

/**
 * استدعاء الإشعارات
 * Fetch notifications
 * @param {Object} options - خيارات الاستدعاء (unreadOnly, limit)
 * @returns {Promise<Object>} قائمة الإشعارات
 */
export const getNotifications = async (options = {}) => {
  await simulateDelay(400);
  
  let notifications = [...MOCK_DATA.notifications];
  
  if (options.unreadOnly) {
    notifications = notifications.filter(n => !n.read);
  }
  
  if (options.limit) {
    notifications = notifications.slice(0, options.limit);
  }
  
  // ترتيب حسب التاريخ (الأحدث أولاً)
  notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return {
    success: true,
    data: notifications,
    unreadCount: MOCK_DATA.notifications.filter(n => !n.read).length
  };
};

/**
 * تحديد الإشعار كمقروء
 * Mark notification as read
 * @param {string} notificationId - معرف الإشعار
 * @returns {Promise<Object>} نتيجة التحديث
 */
export const markNotificationAsRead = async (notificationId) => {
  await simulateDelay(200);
  
  const notification = MOCK_DATA.notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }

  return {
    success: true,
    message: 'تم وضع علامة مقروء على الإشعار'
  };
};

/**
 * تحديد جميع الإشعارات كمقروءة
 * Mark all notifications as read
 * @returns {Promise<Object>} نتيجة التحديث
 */
export const markAllNotificationsAsRead = async () => {
  await simulateDelay(300);
  
  MOCK_DATA.notifications.forEach(n => n.read = true);

  return {
    success: true,
    message: 'تم وضع علامة مقروء على جميع الإشعارات'
  };
};

/**
 * استدعاء إحصائيات الداشبورد
 * Fetch dashboard statistics
 * @returns {Promise<Object>} إحصائيات الداشبورد
 */
export const getDashboardStats = async () => {
  await simulateDelay(500);
  
  // Update dashboard stats with recent activities
  const stats = {
    ...MOCK_DATA.dashboardStats,
    recentActivities: MOCK_DATA.recentActivities
  };
  
  return {
    success: true,
    data: stats
  };
};

/**
 * البحث في المدارس
 * Search schools
 * @param {string} query - كلمة البحث
 * @param {Object} filters - فلاتر إضافية
 * @returns {Promise<Object>} نتائج البحث
 */
export const searchSchools = async (query, filters = {}) => {
  await simulateDelay(600);
  
  const searchFilters = {
    ...filters,
    search: query
  };
  
  return await getAllSchools(searchFilters);
};

/**
 * استدعاء الأحداث والفعاليات القادمة
 * Fetch upcoming events
 * @returns {Promise<Object>} قائمة الأحداث
 */
export const getUpcomingEvents = async () => {
  await simulateDelay(400);
  
  const events = [
    {
      id: 'event_001',
      title: 'اجتماع أولياء الأمور - مدرسة الأمل',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'قاعة المدرسة الرئيسية',
      type: 'meeting',
      schoolId: 'school_001',
      description: 'اجتماع دوري لمناقشة تطوير العملية التعليمية'
    },
    {
      id: 'event_002',
      title: 'يوم مفتوح - مدرسة النجاح',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'باحة المدرسة',
      type: 'open_day',
      schoolId: 'school_002',
      description: 'يوم مفتوح للطلاب وأولياء الأمور'
    }
  ];

  return {
    success: true,
    data: events
  };
};