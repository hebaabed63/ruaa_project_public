import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Plus from "../../../../assets/icons/plus.svg";
import QuestionMark from "../../../../assets/icons/quetion_mark.svg"; 
import Dots from "../../../../assets/icons/points2.svg"; 

const FQAsection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [faqs, setFaqs] = useState([]);

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // FAQ data with IDs
        const fetchedFaqs = [
          {
            id: 1,
            q: "هل أحتاج لتسجيل دخول؟",
            a: "لا! يمكنك البحث والتقييم مباشرةً دون حساب."
          },
          {
            id: 2,
            q: "كيف يتم التحقق من التقييمات؟",
            a: "تقييمات المشرفين معتمدة رسميًا. أما تقييمات الأهالي تخضع للمراجعة."
          },
          {
            id: 3,
            q: "هل جميع المدارس موجودة على المنصة؟",
            a: "نعمل باستمرار على تحديث قاعدة البيانات، وستجد أغلب المدارس مسجّلة."
          }
        ];
        
        setFaqs(fetchedFaqs);
        setLoading(false);
      } catch (err) {
        setError("Failed to load FAQs");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section
        className="bg-white py-12 px-6 md:px-20 relative overflow-hidden font-cairo"
        dir="rtl"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الأسئلة الشائعة...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="bg-white py-12 px-6 md:px-20 relative overflow-hidden font-cairo"
        dir="rtl"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-red-500 text-2xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      className="bg-white py-12 px-6 md:px-20 relative overflow-hidden font-cairo"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto text-center relative">
        <motion.div 
          className="flex items-center justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-[#2A6FA8]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            الأسئلة الشائعة من مستخدمي الموقع
          </motion.h2>
        </motion.div>

        {/* قائمة الأسئلة */}
        <div className="space-y-4 relative">
          <motion.img
            src={QuestionMark}
            alt="question mark"
            className="absolute -right-48 top-0 w-30 md:w-30"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />

          {faqs.map((item, index) => (
  <motion.div
    key={item.id}
    className="bg-[#E5F5F9] rounded-lg py-6 px-6 shadow-sm flex flex-col items-start justify-center text-right pr-20"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 * index }}
    whileHover={{ scale: 1.02 }}
  >
    {item.id === 1 ? (
      // السؤال الأول يظهر في سطر واحد
      <p className="text-[#2A6FA8] font-medium text-lg">
        "{item.q}"  <span className="text-gray-700 font-normal">{item.a}</span>
      </p>
    ) : (
      // باقي الأسئلة تبقى كما هي
      <>
        <p className="font-medium text-[#2A6FA8] text-lg">"{item.q}"</p>
        <p className="text-gray-700 mt-2">"{item.a}"</p>
      </>
    )}
  </motion.div>
))}


          <motion.div 
            className="bg-[#E5F5F9] rounded-lg py-4 px-6 text-center flex items-center justify-center gap-2 font-medium text-black text-xl cursor-pointer hover:bg-[#d9eef4] transition relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img 
              src={Plus} 
              alt="plus icon" 
              className="w-5 h-5" 
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            شاركنا استفساراتك.. لننبي معًا تعليقا أفضل!
          </motion.div>
        </div>
      </div>
      
      <motion.img
        src={Dots}
        alt="dots decoration"
        className="absolute bottom-10 left-7 w-22 md:w-32"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    </section>
  );
};

export default FQAsection;