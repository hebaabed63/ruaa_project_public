// =============================================================================
// Reports and Calendar API Services
// وظائف استدعاء بيانات التقارير والتقويم
// =============================================================================

import api from './api';

/**
 * Mock data for reports and calendar
 * بيانات محاكاة للتقارير والتقويم
 */

// Mock academic grades data
const mockGradesData = [
  {
    id: 1,
    childId: 1,
    childName: "محمد أحمد",
    subject: "الرياضيات",
    grade: 95,
    maxGrade: 100,
    classAverage: 85,
    teacher: "أ. أحمد عبدالله"
  },
  {
    id: 2,
    childId: 1,
    childName: "محمد أحمد",
    subject: "اللغة العربية",
    grade: 88,
    maxGrade: 100,
    classAverage: 82,
    teacher: "أ. فاطمة علي"
  },
  {
    id: 3,
    childId: 1,
    childName: "محمد أحمد",
    subject: "العلوم",
    grade: 92,
    maxGrade: 100,
    classAverage: 78,
    teacher: "أ. سارة محمد"
  },
  {
    id: 4,
    childId: 2,
    childName: "سارة أحمد",
    subject: "الرياضيات",
    grade: 90,
    maxGrade: 100,
    classAverage: 87,
    teacher: "أ. خالد عمر"
  },
  {
    id: 5,
    childId: 2,
    childName: "سارة أحمد",
    subject: "اللغة الإنجليزية",
    grade: 85,
    maxGrade: 100,
    classAverage: 80,
    teacher: "أ. نورا عبدالله"
  }
];

// Mock evaluations and behavior data
const mockEvaluationsData = [
  {
    id: 1,
    childId: 1,
    childName: "محمد أحمد",
    type: "behavior",
    title: "التقييم الشهري للسلوك",
    date: "2024-01-15",
    rating: 4.5,
    comment: "سلوك ممتاز ومشاركة فعالة في الفصول",
    teacher: "أ. أحمد عبدالله"
  },
  {
    id: 2,
    childId: 1,
    childName: "محمد أحمد",
    type: "attendance",
    title: "نسبة الحضور",
    date: "2024-01-15",
    rating: 5,
    comment: "حضور ممتاز بدون غياب",
    teacher: "أ. أحمد عبدالله"
  },
  {
    id: 3,
    childId: 2,
    childName: "سارة أحمد",
    type: "behavior",
    title: "التقييم الشهري للسلوك",
    date: "2024-01-15",
    rating: 4,
    comment: "سلوك جيد وتحسن ملحوظ في التفاعل",
    teacher: "أ. خالد عمر"
  }
];

// Mock performance summary data
const mockPerformanceData = [
  {
    id: 1,
    childId: 1,
    childName: "محمد أحمد",
    overallGrade: 92,
    classAverage: 82,
    schoolAverage: 85,
    improvement: 5.2,
    subjectsCount: 5,
    topSubject: "الرياضيات"
  },
  {
    id: 2,
    childId: 2,
    childName: "سارة أحمد",
    overallGrade: 88,
    classAverage: 83,
    schoolAverage: 86,
    improvement: 3.7,
    subjectsCount: 6,
    topSubject: "اللغة الإنجليزية"
  }
];

// Mock project/activity reports data
const mockProjectReportsData = [
  {
    id: 1,
    childId: 1,
    childName: "محمد أحمد",
    title: "مسابقة العلوم السنوية",
    date: "2024-01-10",
    type: "science_competition",
    status: "completed",
    result: "المركز الثاني",
    description: "مشاركة متميزة في مسابقة العلوم على مستوى المدرسة"
  },
  {
    id: 2,
    childId: 2,
    childName: "سارة أحمد",
    title: "مهرجان المواهب",
    date: "2024-01-05",
    type: "talent_show",
    status: "completed",
    result: "أداء متميز",
    description: "عرض موهبة الغناء في مهرجان المواهب المدرسي"
  }
];

// Mock calendar events data
const mockCalendarEvents = [
  {
    id: 1,
    title: "بداية الفصل الدراسي الثاني",
    date: "2024-02-01",
    type: "school_date",
    description: "بدء الفصل الدراسي الثاني للعام 1445ه"
  },
  {
    id: 2,
    title: "إجازة عيد الفطر",
    date: "2024-03-15",
    type: "holiday",
    description: "إجازة رسمية لمدة 5 أيام"
  },
  {
    id: 3,
    title: "رحلة مدرسية إلى المتحف",
    date: "2024-02-10",
    type: "event",
    description: "رحلة تعليمية لطلاب الصف الثالث الابتدائي"
  },
  {
    id: 4,
    title: "اختبارات منتصف الفصل",
    date: "2024-02-20",
    type: "exam",
    description: "اختبارات منتصف الفصل الثاني"
  },
  {
    id: 5,
    title: "اجتماع أولياء الأمور",
    date: "2024-02-25",
    type: "meeting",
    description: "اجتماع دوري مع أولياء الأمور"
  },
  {
    id: 6,
    title: "موعد مراجعة محمد مع المعلم",
    date: "2024-02-05",
    type: "personal",
    description: "مراجعة دروس الرياضيات مع أ. أحمد عبدالله"
  }
];

/**
 * Get academic grades for children
 * الحصول على الدرجات الأكاديمية للأبناء
 */
export const getAcademicGrades = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockGradesData, success: true };
  } catch (error) {
    return { error: 'Failed to fetch grades data', success: false };
  }
};

/**
 * Get behavior and evaluation reports
 * الحصول على تقارير السلوك والتقييم
 */
export const getBehaviorReports = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockEvaluationsData, success: true };
  } catch (error) {
    return { error: 'Failed to fetch behavior reports', success: false };
  }
};

/**
 * Get performance summary
 * الحصول على ملخص الأداء
 */
export const getPerformanceSummary = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockPerformanceData, success: true };
  } catch (error) {
    return { error: 'Failed to fetch performance summary', success: false };
  }
};

/**
 * Get project and activity reports
 * الحصول على تقارير المشاريع والأنشطة
 */
export const getProjectReports = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockProjectReportsData, success: true };
  } catch (error) {
    return { error: 'Failed to fetch project reports', success: false };
  }
};

/**
 * Get calendar events
 * الحصول على أحداث التقويم
 */
export const getCalendarEvents = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockCalendarEvents, success: true };
  } catch (error) {
    return { error: 'Failed to fetch calendar events', success: false };
  }
};

/**
 * Add personal appointment
 * إضافة موعد شخصي
 */
export const addPersonalAppointment = async (appointment) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const newAppointment = {
      id: mockCalendarEvents.length + 1,
      ...appointment,
      type: "personal"
    };
    mockCalendarEvents.push(newAppointment);
    return { data: newAppointment, success: true };
  } catch (error) {
    return { error: 'Failed to add personal appointment', success: false };
  }
};

export default {
  getAcademicGrades,
  getBehaviorReports,
  getPerformanceSummary,
  getProjectReports,
  getCalendarEvents,
  addPersonalAppointment
};