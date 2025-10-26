import React, { useState, useEffect } from 'react';
import School1 from '../../../../assets/images/School1.jpg';
import { FaStar, FaUsers, FaGraduationCap, FaIdCard } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { schoolsAPI } from '../../../../services/apiService';

const BestSchools = () => {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bestSchool, setBestSchool] = useState(null);

  useEffect(() => {
    const fetchBestSchool = async () => {
      try {
        const response = await schoolsAPI.getBest();
        const schools = response.data?.data || [];
        if (schools.length > 0) {
          setBestSchool(schools[0]); // أخذ أول مدرسة من أفضل المدارس
        }
      } catch (error) {
        console.error('Error fetching best school:', error);
        // في حالة فشل الـ API، نستخدم بيانات افتراضية
        setBestSchool({
          name: 'مدرسة التميز النموذجية',
          manager: 'د. أحمد محمد',
          students_count: 300,
          level: 'المرحلة الإعداديّة',
          description: 'مناهج تعليميَّة، كادر تعليمي مُؤهل وذو خبرة عالية، أنشطة لا منهجيَّة متنوعة',
          rating: 4.8,
          rating_count: 430
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBestSchool();
  }, []);

  return (
    <div className="font-cairo bg-babyBlue py-16 px-4" dir="rtl">
      <div className="max-w-full mx-auto space-y-8">
        <motion.h2
          className="text-3xl font-semibold text-green-600 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          ✅ المدرسة المميزة لهذا العام
        </motion.h2>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* صورة المدرسة */}
          <motion.div
            className="w-full lg:w-1/2 rounded-xl overflow-hidden shadow-lg relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {!imageError ? (
              <img
                src={School1}
                alt="المدرسة المميزة"
                className="w-full h-auto object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center">
                <div className="text-gray-500">Unable to load image</div>
              </div>
            )}

            {/* التقييم أعلى يسار الصورة */}
            <motion.div
              className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <FaStar className="text-yellow-500" />
              <span className="text-green-500">{bestSchool?.rating || 4.8}</span>
              <span className="text-gray-600 font-normal">({bestSchool?.rating_count || 430} تقييم)</span>
            </motion.div>
          </motion.div>

          {/* تفاصيل المدرسة */}
          <motion.div
            className="w-full lg:w-1/2 space-y-4 mt-5 text-black"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold text-secondary">مدرسة التميز النموذجية</h3>

            <ul className="text-gray-800 font-normal space-y-1">
              <div className="flex items-center gap-1 mb-5">
                <FaIdCard className="w-4 h-4" />
                <li>مدير المدرسة (د. أحمد محمد)</li>
              </div>

              <div className="flex gap-9 text-sm mb-8">
                <div className="flex flex-col items-start text-black">
                  <div className="flex items-center gap-1">
                    <FaUsers className="w-4 h-4" />
                    <span className="font-normal">300 طالب</span>
                  </div>
                  <span className="font-normal mr-5">وطالبة</span>
                </div>

                <div className="flex flex-col items-start text-black">
                  <div className="flex items-center gap-1">
                    <FaGraduationCap className="w-4 h-4" />
                    <span className="font-normal">المرحلة الإعداديّة</span>
                  </div>
                  <span className="font-light ml-5">(من الصف السابع وحتى التاسع)</span>
                </div>
              </div>
            </ul>

            {/* الميزات */}
            <motion.div
              className="mt-4 space-y-2 text-black font-normal"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="font-semibold">ما يُميِّزنا:</p>
              <p>✅ مناهج تعليميَّة</p>
              <p>✅ كادر تعليمي مُؤهل وذو خبرة عالية.</p>
              <p>✅ أنشطة لا منهجيَّة متنوعة.</p>
            </motion.div>

            {/* الأزرار */}
            <div className="flex gap-4 mt-6">
              <motion.button
                className="bg-primary text-white px-20 py-2 rounded-lg hover:bg-primary/80 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                تواصل معنا
              </motion.button>
              <motion.button
                className="border border-primary text-primary px-20 py-2 rounded-lg hover:bg-primary hover:text-white transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                عرض التفاصيل
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BestSchools;
