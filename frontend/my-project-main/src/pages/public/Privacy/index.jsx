import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Privacy = () => {
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
            سياسة الخصوصية
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              نحن في "رؤى التعليم المستقبلية" نحترم خصوصيتك ونلتزم بحماية معلوماتك الشخصية. 
              هذه السياسة توضح كيف نجمع ونستخدم ونحمي المعلومات التي تقدمها عند استخدامك لموقعنا.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">
              1. المعلومات التي نجمعها
            </h2>
            <ul className="list-disc pr-6 space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>المعلومات الشخصية مثل الاسم وعنوان البريد الإلكتروني ورقم الهاتف</li>
              <li>معلومات الأطفال المسجلين في النظام</li>
              <li>معلومات المدرسة والتقييمات</li>
              <li>بيانات استخدام الموقع والخدمات</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">
              2. كيفية استخدام المعلومات
            </h2>
            <ul className="list-disc pr-6 space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>لتقديم خدماتنا وتخصيص تجربة المستخدم</li>
              <li>لتحسين الموقع والخدمات المقدمة</li>
              <li>لإرسال تحديثات و thôngاعة مهمة</li>
              <li>للحماية من الاحتيال وسوء الاستخدام</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">
              3. حماية المعلومات
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              نستخدم تقنيات وأمنية متقدمة لحماية معلوماتك من الوصول غير المصرح به أو الكشف أو الاستخدام.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">
              4. مشاركة المعلومات
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              لا نقوم ببيع أو تأجير معلوماتك الشخصية لأطراف ثالثة. قد نشارك المعلومات مع:
            </p>
            <ul className="list-disc pr-6 space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>الجهات التعليمية المعنية</li>
              <li>مقدمي الخدمات الموثوقين</li>
              <li>السلطات القانونية عند الضرورة</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">
              5. حقوقك
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              لديك الحق في الوصول إلى معلوماتك الشخصية وتصحيحها أو حذفها. 
              يمكنك الاتصال بنا في أي وقت للاستفسار عن معلوماتك أو طلب تعديلها.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">
              6. التغييرات على السياسة
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. 
              سيتم نشر أي تغييرات على هذه الصفحة مع تاريخ التحديث.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-500 p-4 mt-8">
              <p className="text-blue-800 dark:text-blue-200">
                <strong>للاتصال بنا:</strong> إذا كانت لديك أي أسئلة حول سياسة الخصوصية، 
                يرجى الاتصال بنا عبر البريد الإلكتروني: privacy@education-insights.ps
              </p>
            </div>
          </div>
        </div>
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default Privacy;