// Mock data for notifications with realistic examples covering all required types
const notificationsMockData = [
  // Student Performance (📊)
  {
    id: 1,
    type: "performance",
    icon: "📊",
    studentName: "أحمد محمد",
    description: "ابنك أحمد حصل على درجة ممتازة في مادة الرياضيات.",
    schoolName: "مدرسة الأمل",
    date: "2025-10-06T08:30:00Z",
    read: false
  },
  {
    id: 2,
    type: "performance",
    icon: "📊",
    studentName: "سارة علي",
    description: "ابنة سارة حققت تقدماً ملحوظاً في مادة اللغة العربية.",
    schoolName: "مدرسة النجاح",
    date: "2025-10-05T14:15:00Z",
    read: false
  },
  {
    id: 3,
    type: "performance",
    icon: "📊",
    studentName: "محمد خالد",
    description: "ابنك محمد حصل على درجة جيدة جداً في مادة العلوم.",
    schoolName: "مدرسة المستقبل",
    date: "2025-10-04T11:45:00Z",
    read: true
  },
  
  // School Achievements (🏆)
  {
    id: 4,
    type: "achievement",
    icon: "🏆",
    studentName: "",
    description: "مدرسة النجاح حصلت على جائزة في مسابقة العلوم.",
    schoolName: "مدرسة النجاح",
    date: "2025-10-03T09:20:00Z",
    read: false
  },
  {
    id: 5,
    type: "achievement",
    icon: "🏆",
    studentName: "",
    description: "مدرسة الأمل فازت بجائزة أفضل مدرسة ابتدائية لعام 2025.",
    schoolName: "مدرسة الأمل",
    date: "2025-10-02T16:30:00Z",
    read: true
  },
  
  // School Improvements (🔧)
  {
    id: 6,
    type: "improvement",
    icon: "🔧",
    studentName: "",
    description: "مدرسة الأمل قامت بتحديث المكتبة وزيادة عدد الكتب العلمية.",
    schoolName: "مدرسة الأمل",
    date: "2025-10-01T10:00:00Z",
    read: false
  },
  {
    id: 7,
    type: "improvement",
    icon: "🔧",
    studentName: "",
    description: "مدرسة المستقبل أضافت مختبراً جديداً لمادة الكيمياء.",
    schoolName: "مدرسة المستقبل",
    date: "2025-09-30T13:45:00Z",
    read: true
  },
  
  // Principal Responses (📨)
  {
    id: 8,
    type: "principal",
    icon: "📨",
    studentName: "",
    description: "مدير مدرسة النجاح رد على استفسارك بخصوص موعد الاجتماع.",
    schoolName: "مدرسة النجاح",
    date: "2025-09-29T15:20:00Z",
    read: false
  },
  {
    id: 9,
    type: "principal",
    icon: "📨",
    studentName: "",
    description: "مدير مدرسة الأمل أرسل تعميماً بخصوص الإجازات المدرسية.",
    schoolName: "مدرسة الأمل",
    date: "2025-09-28T08:10:00Z",
    read: true
  },
  
  // Chat Notifications (💬)
  {
    id: 10,
    type: "chat",
    icon: "💬",
    studentName: "",
    description: "رسالة جديدة من معلمة الصف الخامس بشأن الواجبات الأسبوعية.",
    schoolName: "مدرسة الأمل",
    date: "2025-09-27T17:50:00Z",
    read: false
  },
  {
    id: 11,
    type: "chat",
    icon: "💬",
    studentName: "",
    description: "رد من مدرس الرياضيات على سؤالك حول الامتحان القادم.",
    schoolName: "مدرسة المستقبل",
    date: "2025-09-26T12:30:00Z",
    read: true
  }
];

export default notificationsMockData;