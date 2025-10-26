
// Test file to debug notifications issue
const mockNotifications = [
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
    read: false
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
    read: false
  }
];

console.log('Mock notifications:', mockNotifications);
console.log('Number of notifications:', mockNotifications.length);
console.log('Unread notifications:', mockNotifications.filter(n => !n.read).length);