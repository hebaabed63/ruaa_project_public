import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      <Header />
      
      <motion.main
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            الشروط والأحكام
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              هذه الشروط والأحكام تنظم استخدامك لموقع "رؤى التعليم المستقبلية" وجميع الخدمات المرتبطة به.
              باستخدامك للموقع، فإنك توافق على الالتزام بهذه الشروط.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">
              1. قبول الشروط
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              باستخدامك لهذا الموقع، فإنك تقر بأنك قرأت وفهمت ووافقت على الالتزام بهذه الشروط والأحكام.
              إذا كنت لا توافق على أي جزء من هذه الشروط، يُرجى عدم استخدام الموقع.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">
              2. استخدام الموقع
            </h2>
            <ul className="list-disc pr-6 space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>يُمنع استخدام الموقع لأغراض غير قانونية أو ضارة</li>
              <li>يُمنع محاولة اختراق الموقع أو تجاوز أنظمته الأمنية</li>
              <li>يجب استخدام الموقع بحسن نية واحترام للأخلاقيات</li>
              <li>يُمنع نشر معلومات كاذبة أو مضللة</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">
              3. حقوق الملكية
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              جميع المحتويات والمعلومات والبرمجيات الموجودة في هذا الموقع هي ملك لـ "رؤى التعليم المستقبلية" 
              و محمية بقوانين حقوق الملكية الفكرية.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">
              4. التقييمات والمحتوى
            </h2>
            <ul className="list-disc pr-6 space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>التقييمات المقدمة من المستخدمين تعبر عن آرائهم الشخصية</li>
              <li>لا نتحمل مسؤولية دقة أو صحة التقييمات المقدمة</li>
              <li>نحتفظ بالحق في إزالة أي محتوى يخالف الشروط</li>
              <li>يتحمل المستخدم مسؤولية المحتوى الذي ينشره</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">
              5. الحد من المسؤولية
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              نسعى لتوفير معلومات دقيقة وموثوقة، لكن لا نضمن خلو الموقع من الأخطاء أو انقطاع الخدمة.
              استخدامك للموقع يكون على مسؤوليتك الشخصية.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">
              6. التعديلات
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. 
              سيتم نشر النسخة المحدثة على هذا الموقع مع تاريخ التحديث.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">
              7. القانون الواجب التطبيق
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              تخضع هذه الشروط والأحكام لقوانين دولة فلسطين. 
              أي نزاع ينشأ عن استخدامك للموقع يخضع لاختصاص محاكم غزة.
            </p>
            
            <div className="bg-green-50 dark:bg-green-900/20 border-r-4 border-green-500 p-4 mt-8">
              <p className="text-green-800 dark:text-green-200">
                <strong>آخر تحديث:</strong> سبتمبر 2025
              </p>
            </div>
          </div>
        </div>
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default Terms;