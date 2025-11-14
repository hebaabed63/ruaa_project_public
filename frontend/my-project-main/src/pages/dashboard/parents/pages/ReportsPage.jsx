import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarCheck, FaClipboardList, FaChartBar, FaBook } from 'react-icons/fa';
import { Card } from '../components/ui';
import { useReportsData } from '../hooks/useReports';

const ReportsPage = () => {
  // 1) جلب البيانات الحقيقية من الـ API
  const {
    grades = [],
    performance = [],
    projects = [],
    loading = false,
    error = null,
  } = useReportsData();

  // 2) استخراج قائمة الأبناء من بيانات الدرجات
  const childrenList = useMemo(() => {
    const map = new Map();
    (grades || []).forEach((g) => {
      if (!map.has(g.childId)) {
        map.set(g.childId, { id: g.childId, name: g.childName || '—' });
      }
    });
    return Array.from(map.values());
  }, [grades]);

  // 3) إدارة الابن النشط (مع دعم التحميل المتأخر للبيانات)
  const [activeChildId, setActiveChildId] = useState(null);
  useEffect(() => {
    if (!activeChildId && childrenList.length > 0) {
      setActiveChildId(childrenList[0].id);
    }
    // لو الابن النشط لم يعد موجودًا بعد تحديث البيانات، نعيّنه لأول متوفر
    if (
      activeChildId &&
      childrenList.length > 0 &&
      !childrenList.some((c) => c.id === activeChildId)
    ) {
      setActiveChildId(childrenList[0].id);
    }
  }, [childrenList, activeChildId]);

  // 4) تحويل/تهيئة بيانات الدرجات للابن النشط + حساب Letter Grade
  const activeGrades = useMemo(() => {
    if (!activeChildId) return [];
    return (grades || [])
      .filter((g) => g.childId === activeChildId)
      .map((g) => {
        const percentage = g.maxGrade ? (g.grade / g.maxGrade) * 100 : 0;
        const letter =
          percentage >= 95 ? 'A+' :
          percentage >= 90 ? 'A'  :
          percentage >= 85 ? 'B+' :
          percentage >= 80 ? 'B'  :
          percentage >= 75 ? 'C+' :
          percentage >= 70 ? 'C'  : 'D';
        return { ...g, letterGrade: letter };
      });
  }, [grades, activeChildId]);

  // 5) الأداء/الترتيب — نحاول القراءة من API، وإن لم تتوفر نُشتق الحالة من overallGrade
  const activePerformance = useMemo(() => {
    if (!activeChildId) return { rank: '—', status: '—' };
    const perf = (performance || []).find((p) => p.childId === activeChildId);
    if (!perf) return { rank: '—', status: '—' };

    // حالة عربية
    let arabicStatus = perf.status || '—';
    const og = perf.overallGrade ?? perf.overall ?? null;
    if (typeof og === 'number') {
      if (og >= 90) arabicStatus = 'ممتاز';
      else if (og >= 80) arabicStatus = 'جيد جداً';
      else if (og >= 70) arabicStatus = 'جيد';
      else arabicStatus = 'مقبول';
    }

    // الترتيب إن وُجد (من الـ API) وإلا شرطة
    const rank = perf.rank || '—';

    return { rank, status: arabicStatus };
  }, [performance, activeChildId]);

  // 6) الواجبات/المشاريع — تحويل الحقول لأسماء العرض العربية
  const activeProjects = useMemo(() => {
    if (!activeChildId) return [];
    return (projects || [])
      .filter((p) => p.childId === activeChildId)
      .map((p) => ({
        id: p.id,
        childId: p.childId,
        subject: p.type || p.subject || 'عام',
        assignment: p.title || p.assignment || '—',
        status:
          p.status === 'completed'
            ? 'تم التسليم'
            : p.status === 'due' || p.status === 'pending'
            ? 'آخر موعد'
            : p.status || '—',
        date: p.date || p.deadline || '—',
      }));
  }, [projects, activeChildId]);

  // 7) حالات التحميل/الخطأ
  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center" dir="rtl">
        جاري التحميل...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-600" dir="rtl">
        حدث خطأ أثناء جلب البيانات
      </div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto p-4" 
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* العنوان + أزرار الأبناء */}
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div 
          className="text-right"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">التقارير</h1>
          <p className="text-gray-600 mt-1 dark:text-white">عرض جميع التقارير المُتعلِّقة بأبنائك</p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-md flex gap-2 p-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {childrenList.length === 0 ? (
            <div className="px-4 py-2 text-gray-500">لا توجد بيانات للعرض</div>
          ) : (
            childrenList.map((child, index) => (
              <motion.button
                key={child.id}
                onClick={() => setActiveChildId(child.id)}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  child.id === activeChildId 
                    ? 'bg-[#64C8CC] text-white' 
                    : 'bg-gray-100 text-[#64C8CC] hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                {child.name}
              </motion.button>
            ))
          )}
        </motion.div>
      </motion.div>

      {/* البطاقات العلوية الثلاث */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* الحضور (قيم افتراضية حتى تتوفر endpoints الحضور) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className="p-4 flex flex-col justify-between h-full">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">الحضور</span>
              <FaCalendarCheck className="text-purple-600" />
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="bg-[#DCFCE7] text-green-700 px-3 py-1 rounded-full text-sm">Good</div>
              <span className="text-xl font-bold">85.6%</span>
            </div>
            <div className="h-1 bg-black mt-3"></div>
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>العدد الكلي للأيام: 160</span>
              <span>أيام الحضور: 137</span>
            </div>
          </Card>
        </motion.div>

        {/* الأنشطة (قيمة افتراضية لحد ما تربطي endpoint الأنشطة) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className="p-4 flex flex-col justify-between h-full">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">الأنشطة والتفاعل</span>
              <FaCalendarCheck className="text-purple-600" />
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="bg-[#DCFCE7] text-green-700 px-3 py-1 rounded-full text-sm">Good</div>
              <span className="text-xl font-bold">85.6%</span>
            </div>
            <div className="h-1 bg-black mt-3"></div>
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>المجموع الكلي: 100%</span>
            </div>
          </Card>
        </motion.div>

        {/* الترتيب/الحالة من بيانات الأداء */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className="p-4 flex flex-col justify-between h-full">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">الترتيب</span>
              <FaChartBar className="text-[#009689]" />
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="font-bold text-xl">{activePerformance.rank || '—'}</div>
              <div className="bg-green-700 text-white px-3 py-1 rounded-full text-sm">
                {activePerformance.status || '—'}
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">آخر تقييم: September 15, 2025</div>
          </Card>
        </motion.div>
      </motion.div>

      {/* الدرجات + الواجبات */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
      >
        {/* الدرجات */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.9 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center gap-2 mb-4">
              <FaBook className="text-[#009689]" />
              <span className="font-bold text-lg">الدرجات</span>
            </div>

            {activeChildId && activeGrades.length === 0 ? (
              <div className="text-center text-gray-500 py-8">لا توجد درجات لهذا الطالب</div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {activeGrades.map((g, index) => (
                  <motion.div 
                    key={g.id || `${g.subject}-${index}`} 
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  >
                    <div className="text-right">
                      <div className="font-medium">{g.subject}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-300 font-bold">
                          {g.letterGrade}
                        </div>
                        <span>{g.grade}/{g.maxGrade}</span>
                      </div>
                    </div>

                    <div className="w-24"> 
                      <div className="bg-gray-200 h-2 rounded-full w-full">
                        <motion.div
                          className="bg-black h-2 rounded-full"
                          style={{ width: `${g.maxGrade ? (g.grade / g.maxGrade) * 100 : 0}% `}}
                          initial={{ width: 0 }}
                          animate={{ width: `${g.maxGrade ? (g.grade / g.maxGrade) * 100 : 0}% `}}
                          transition={{ duration: 1, delay: 1.2 + index * 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* الواجبات */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1.0 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center gap-2 mb-4">
              <FaClipboardList className="text-[#4F39F6]" />
              <span className="font-bold text-lg">الواجبات</span>
            </div>

            {activeChildId && activeProjects.length === 0 ? (
              <div className="text-center text-gray-500 py-8">لا توجد واجبات مسجّلة</div>
            ) : (
              <div className="flex flex-col gap-4">
                {activeProjects.map((p, index) => (
                  <motion.div
                    key={p.id || index}
                    className="bg-white rounded-xl shadow p-4 flex justify-between items-center w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.1 + index * 0.1 }}
                    whileHover={{ 
                      scale: 1.02, 
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      transition: { duration: 0.3 } 
                    }}
                  >
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{p.subject}</div>
                      <div className="text-sm text-gray-600">{p.assignment}</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-gray-500 mb-1">{p.date}</span>
                      <motion.div
                        className={`text-center text-white px-3 py-1 rounded-full text-sm ${
                          p.status === 'تم التسليم'
                            ? 'bg-gray-400'
                            : p.status === 'آخر موعد'
                            ? 'bg-gray-400'
                            : 'bg-red-500'
                        }`}
                        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {p.status}
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ReportsPage;