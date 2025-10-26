import React, { useState, useEffect } from 'react';
import { FaStar, FaPlay } from 'react-icons/fa';
import { motion } from 'framer-motion';

const VideoTestimonialSection = () => {
  const [currentFeedback, setCurrentFeedback] = useState(0);
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
        setError("Failed to load testimonials");
        setLoading(false);
      }
    };

    fetchData();
    
    const timer = setInterval(() => {
      setCurrentFeedback((prev) => (prev + 1) % 3); // عدد التستيمونيالز
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Testimonial data with IDs for better key handling
  const testimonials = [
    {
      id: 1,
      name: 'أحمد السيد',
      role: 'ولي أمر',
      text: 'المنصة ساعدتني كثيراً في متابعة مستوى ابنتي الدراسي.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 2,
      name: 'سارة محمد',
      role: 'معلمة',
      text: 'أداة رائعة للتواصل مع أولياء الأمور ومتابعة الطلاب.',
      rating: 4,
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 3,
      name: 'خالد عبد الله',
      role: 'مدير مدرسة',
      text: 'حل متكامل لإدارة العملية التعليمية.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/men/75.jpg'
    }
  ];

  // Stats data with IDs
  const stats = [
    { id: 1, number: '50+', label: 'مدرسة مسجلة' },
    { id: 2, number: '10,000+', label: 'طالب' },
    { id: 3, number: '98%', label: 'رضا أولياء الأمور' },
    { id: 4, number: '24/7', label: 'دعم فني' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 font-cairo flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الشهادات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 font-cairo flex items-center justify-center" dir="rtl">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 font-cairo" dir="rtl">
      {/* Video & Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4yIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTI0IDBjMCAyLjIwOS0xLjc5MSA0LTQgNHMtNC0xLjc5MS00LTRjMC0yLjIwOSAxLjc5MS00IDQtNHM0IDEuNzkxIDQgNHptLTI0IDBjMCAyLjIwOS0xLjc5MSA0LTQgNHMtNC0xLjc5MS00LTRjMC0yLjIwOSAxLjc5MS00IDQtNHM0IDEuNzkxIDQgNHptLTI0IDBjMCAyLjIwOS0xLjc5MSA0LTQgNHMtNC0xLjc5MS00LTRjMC0yLjIwOSAxLjc5MS00IDQtNHM0IDEuNzkxIDQgNHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.span 
              className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              ماذا يقولون عنا
            </motion.span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">آراء أولياء الأمور والمعلمين</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              آراء حقيقية من مستخدمي منصتنا التعليمية المتميزة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Video Section */}
            <motion.div 
              className="relative rounded-2xl overflow-hidden shadow-2xl group"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1471&q=80" 
                  alt="عن المنصة التعليمية"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-video.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <motion.button 
                    className="w-20 h-20 md:w-24 md:h-24 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="تشغيل الفيديو"
                  >
                    <FaPlay className="text-blue-600 text-2xl ml-1" />
                  </motion.button>
                </div>
              </div>
              <div className="bg-white p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">جولة في منصتنا التعليمية</h3>
                <p className="text-gray-600">شاهد كيف يمكن لمنصتنا تحسين تجربة التعليم لأبنائك</p>
              </div>
            </motion.div>

            {/* Testimonials */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={testimonial.id}
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start gap-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-blue-100"
                      onError={(e) => {
                        e.target.src = "/placeholder-user.jpg";
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                          <p className="text-sm text-gray-500">{testimonial.role}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-gray-600">"{testimonial.text}"</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div 
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default VideoTestimonialSection;