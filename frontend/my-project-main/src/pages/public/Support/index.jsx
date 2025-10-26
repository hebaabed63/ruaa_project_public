import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Support = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            الدعم الفني
          </h1>
          <p className="text-xl text-gray-600">
            نحن هنا لمساعدتك في أي استفسارات أو مشكلات تواجهك
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="p-6 sm:p-8">
            <motion.div className="mb-10" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">معلومات الاتصال</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                  <div className="text-blue-600 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">الهاتف</h3>
                  <p className="text-gray-600">+962 77 777 7777</p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg text-center">
                  <div className="text-green-600 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">البريد الإلكتروني</h3>
                  <p className="text-gray-600">support@edudirectory.jo</p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg text-center">
                  <div className="text-purple-600 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">العنوان</h3>
                  <p className="text-gray-600">عمان، الأردن</p>
                </div>
              </div>
            </motion.div>

            <motion.div className="mb-10" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">الأسئلة الشائعة</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">كيف يمكنني إنشاء حساب؟</h3>
                  <p className="text-gray-600">يمكنك إنشاء حساب جديد من خلال الضغط على زر "تسجيل" في الزاوية العلوية من الصفحة الرئيسية وإدخال معلوماتك المطلوبة.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">كيف يمكنني تقييم مدرسة؟</h3>
                  <p className="text-gray-600">بعد تسجيل الدخول، يمكنك الانتقال إلى صفحة المدارس واختيار المدرسة التي ترغب في تقييمها ومن ثم الضغط على زر "تقييم المدرسة".</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">هل يمكنني تعديل تقييمي لمدرسة؟</h3>
                  <p className="text-gray-600">نعم، يمكنك تعديل تقييمك في أي وقت من خلال الدخول إلى صفحة المدرسة والضغط على زر "تعديل التقييم".</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">نموذج الاتصال</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل اسمك"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">الموضوع</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل موضوع رسالتك"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">الرسالة</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="اكتب رسالتك هنا"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 font-medium"
                  >
                    إرسال الرسالة
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={handleBackToHome}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            العودة إلى الصفحة الرئيسية
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Support;