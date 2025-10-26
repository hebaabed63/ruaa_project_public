import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ReactComponent as ChevronRight } from "../../../../assets/icons/slide.svg";
import studentImg from '../../../../assets/images/School1.jpg'; //class.jpg
import meetingImg from '../../../../assets/images/School1.jpg';  // meeting.jpg
import males from '../../../../assets/images/School1.jpg'; // males.jpg
import Infinity from "../../../../assets/icons/Infinity.svg";

const UpdateSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setLoading(false);
      } catch (err) {
        setError("Failed to load news updates");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const newsData = [
    {
      id: 1,
      title: "المشرفون يشاركون في تحضير خطط تعليمية فعّالة للعام الدراسي الجديد",
      description: "عرض المزيد من التفاصيل",
      image: meetingImg,
    },
    {
      id: 2,
      title: "نصائح لأولياء الأمور حول آليات التعلم الحديثة",
      description: "عرض المزيد من التفاصيل",
      image: studentImg,
    },
    {
      id: 3,
      title: "إعلان نتائج المسابقة الثقافية السنوية",
      description: "عرض المزيد من التفاصيل",
      image: males,
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(newsData.length / 2));
  };

  const currentNewsItems = newsData.slice(currentSlide * 2, currentSlide * 2 + 2);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8 font-cairo flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل التحديثات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8 font-cairo flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8 font-cairo" dir="rtl">
      <div className="relative w-full mb-10">
        <motion.img 
          src={Infinity} 
          alt="Infinity" 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <motion.h2 
          className="absolute top-1/2 transform -translate-y-1/2 text-4xl font-bold text-primary z-10 mr-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          التحديثات الأخيرة:
        </motion.h2>
      </div>
      
      <div className="max-w-6xl mx-auto">
        {/* News Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentNewsItems.map((news, index) => (
              <motion.div
                key={news.id || currentSlide * 2 + index}
                className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="aspect-video bg-gray-100">
                  <img
                    src={news.image || "/placeholder.svg"}
                    alt={news.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-gray-800 font-semibold text-lg mb-4 leading-relaxed text-right">
                    {news.title}
                  </h3>
                  <div className="flex justify-between items-center flex-row-reverse">
                    <div className="flex gap-2">
                      <motion.button
                        onClick={nextSlide}
                        className="p-1 rounded-full hover:bg-blue-200 transition-colors"
                        aria-label="Next news"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronRight className="w-4 h-4 text-blue-600" />
                      </motion.button>
                    </div>
                    <motion.a 
                      href="#" 
                      className="text-[#7F7F7F] hover:text-gray-500 text-sm"
                      whileHover={{ x: -5 }}
                    >
                      {news.description}
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: Math.ceil(newsData.length / 2) }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? "bg-blue-600" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UpdateSection;