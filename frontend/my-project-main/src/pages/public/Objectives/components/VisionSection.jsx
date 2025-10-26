import React, { useState, useEffect, useRef } from "react";

import Infinity from "../../../../assets/icons/Infinity.svg";

// Custom hook for slide-in animation
const useSlideInAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return { isVisible, elementRef };
};

// Vision Item Component
const VisionItem = ({ item, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'عالية';
      case 'medium': return 'متوسطة';
      case 'low': return 'منخفضة';
      default: return 'غير محدد';
    }
  };

  return (
    <div 
      className={`flex items-center gap-4 p-4 border-r-8 border-primary rounded-r-xl rounded-l-xl shadow-sm cursor-pointer transform transition-all duration-700 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
      } ${isHovered ? 'scale-105 shadow-lg' : 'hover:scale-105 hover:shadow-lg'}`}
      style={{
        background: 'linear-gradient(to left, #F1F4F8, #CFD8E8)',
        animationDelay: `${index * 200}ms`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <p className={`text-sm font-medium text-primary leading-relaxed transition-all duration-300 ${
            isHovered ? 'text-blue-700' : ''
          }`}>
            {item.text}
          </p>
          
        </div>
       
      </div>
    </div>
  );
};

export default function VisionSection({ data }) {
  const { isVisible, elementRef } = useSlideInAnimation();
  
  // Fallback to default data if no data prop provided
  const defaultData = {
    title: "الرؤية المستقبلية",
    visionItems: [
      {
        id: 1,
        text: "توسيع نطاق التقييم ليشمل المعلمين والطلاب..",
        priority: "high",
        timeline: "2024-2025"
      },
      {
        id: 2,
        text: "إدخال أدوات ذكاء اصطناعي للتوصية بالمدارس بناءً على تفضيلات الأسرة.",
        priority: "medium",
        timeline: "2025-2026"
      },
      {
        id: 3,
        text: "تطوير تطبيق محمول لسهولة الوصول للتقييمات والبيانات.",
        priority: "high",
        timeline: "2024"
      },
      {
        id: 4,
        text: "ربط النظام بمنصات تعليمية أخرى على المستوى الوطني.",
        priority: "medium",
        timeline: "2025"
      }
    ]
  };

  const visionData = data || defaultData;

  return (
    <div className="font-cairo bg-white text-black" dir="rtl">
      <section className="bg-white py-1 px-4">
        
        {/* العنوان */}
        <div className={`relative w-full pb-8 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <img src={Infinity} className="" alt="Infinity" />
          <h2 className="absolute top-1/2 transform -translate-y-1/2 text-4xl font-bold text-primary z-10 mr-8">
            {visionData.title}
          </h2>
        </div>

        {/* عناصر الرؤية */}
        <div 
          ref={elementRef}
          className="max-w-4xl mx-2 space-y-6"
        >
          {visionData.visionItems.map((item, index) => (
            <VisionItem 
              key={item.id} 
              item={item} 
              index={index} 
              isVisible={isVisible}
            />
          ))}
        </div>
      </section>
    </div>
  );
}