import React, { useState, useEffect, useRef } from "react";

import star from "../../../../assets/icons/star.svg";
import school from "../../../../assets/icons/school.svg";
import location from "../../../../assets/icons/location.svg";
import Infinity from "../../../../assets/icons/Infinity.svg";

// Custom hook for fade-in animation
const useFadeInAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold]);

  return [elementRef, isVisible];
};

// Custom hook for staggered animations
const useStaggeredAnimation = (itemsCount, delay = 150) => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const containerRef = useRef(null);
  const [containerVisible, setContainerVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setContainerVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (containerVisible) {
      const timers = [];
      for (let i = 0; i < itemsCount; i++) {
        const timer = setTimeout(() => {
          setVisibleItems(prev => new Set([...prev, i]));
        }, i * delay);
        timers.push(timer);
      }

      return () => timers.forEach(timer => clearTimeout(timer));
    }
  }, [containerVisible, itemsCount, delay]);

  return [containerRef, visibleItems];
};

// Development Plan Card Component with enhanced interactivity
const DevelopmentPlanCard = ({ item, index, isVisible }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getIconSrc = (iconName) => {
    switch (iconName) {
      case 'star': return star;
      case 'school': return school;
      case 'location': return location;
      default: return location;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityBgColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div 
      className={`transform transition-all duration-500 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }       } rounded-xl overflow-hidden `}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`flex items-start gap-4 p-6 cursor-pointer bg-white transition-colors duration-300 ${
          isHovered ? 'bg-gray-50' : 'bg-white'
        }`}
        onClick={toggleExpanded}
      >
        <div className={`bg-babyBlue w-16 h-16 flex items-center justify-center rounded-lg flex-shrink-0 transition-all duration-300 ${
          isHovered ? 'scale-110' : 'scale-100'
        }`}>
          <img
            src={getIconSrc(item.icon)}
            alt={`icon-${index}`}
            className="w-8 h-8 object-contain"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <p className={`text-secondary font-medium whitespace-pre-line transition-colors duration-300 ${
              isHovered ? 'text-primary' : 'text-gray-800'
            }`}>
              {item.text}
            </p>
            <div className="flex items-center gap-2 mr-4">
              {item.priority && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                  {item.priority === 'high' ? 'عالية' : item.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                </span>
              )}
              <button 
                className={`transform transition-transform duration-300 text-xl text-gray-500 hover:text-primary ${
                  isExpanded ? 'rotate-180' : 'rotate-0'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded();
                }}
                aria-label={isExpanded ? "طي التفاصيل" : "عرض التفاصيل"}
              >
                ▼
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expandable Content */}
      <div className={`overflow-hidden transition-all duration-700 ${
        isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          {item.title && (
            <h4 className="text-xl font-bold text-primary mb-3">{item.title}</h4>
          )}
          {item.details && (
            <p className="text-gray-700 mb-4 leading-relaxed">{item.details}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {item.timeline && (
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <span className="font-semibold text-gray-600 block">الجدول الزمني:</span>
                  <span className="text-blue-600">{item.timeline}</span>
                </div>
              </div>
            )}
            {item.status && (
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <span className="font-semibold text-gray-600 block">الحالة:</span>
                  <span className="text-green-600">{item.status}</span>
                </div>
              </div>
            )}
          </div>
          {item.progress !== undefined && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">نسبة الإنجاز</span>
                <span className="text-sm font-medium text-blue-600">{item.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${getPriorityBgColor(item.priority)}`}
                  style={{ 
                    width: isExpanded ? `${item.progress}%` : '0%',
                    transitionDelay: isExpanded ? '300ms' : '0ms'
                  }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
              متابعة التقدم
            </button>
            <button className="border border-primary text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors">
              مشاركة الملاحظات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DevelopmentPlanSection({ data }) {
  // Fallback to default data if no data prop provided
  const defaultItems = [
    {
      id: 1,
      icon: "location",
      title: "توسيع التغطية",
      text: `توسيع نطاق التغطية ليشمل كـــــــافة المــــــــــدارس
الفلسطيــــنية دون استثنــــاء.`,
      details: "هدفنا الوصول إلى جميع المدارس في كافة المحافظات الفلسطينية مع توفير أدوات تقييم شاملة ومتطورة.",
      priority: "high",
      timeline: "2024-2025",
      status: "في التقدم",
      progress: 60
    },
    {
      id: 2,
      icon: "school",
      title: "تعزيز الشراكات",
      text: `تعزيز الشراكات مع الجامعات ومراكـــــز البحث لتطويــــر
مؤشرات جودة تعليمية مبتكرة.`,
      details: "بناء علاقات استراتيجية مع المؤسسات الأكاديمية المحلية والإقليمية لتطوير معايير تقييم متقدمة.",
      priority: "medium",
      timeline: "2024-2026",
      status: "مخطط",
      progress: 25
    },
    {
      id: 3,
      icon: "star",
      title: "تطوير الأدوات",
      text: `تطوير أدوات تقييم أكثر تخصصًا تراعي خصوصية المراحل
التعليمية المختلفة.`,
      details: "إنشاء أدوات متقدمة لكل مرحلة تعليمية مع مراعاة الاحتياجات الخاصة والبرامج المتنوعة.",
      priority: "high",
      timeline: "2024",
      status: "قيد التنفيذ",
      progress: 80
    },
    {
      id: 4,
      icon: "location",
      title: "التخصص التعليمي",
      text: `تطوير أدوات تقييم أكثر تخصصًا تراعي خصوصية المراحل
التعليمية المختلفة.`,
      details: "تخصيص المعايير حسب نوع التعليم والمرحلة مع إدراج التعليم التقني والمهني.",
      priority: "medium",
      timeline: "2025",
      status: "مخطط",
      progress: 15
    }
  ];

  const developmentPlanData = data || defaultItems;
  
  // Animation hooks
  const [containerRef, visibleItems] = useStaggeredAnimation(developmentPlanData.length, 150);
  const [titleRef, isTitleVisible] = useFadeInAnimation(0.1);

  return (
    <div className="font-cairo bg-white text-black" dir="rtl">
      <section className="bg-white py-16 px-4">
        {/* العنوان */}
        <div 
          ref={titleRef}
          className={`relative w-full mb-12 transition-all duration-1000 ${
            isTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="relative w-full mb-4 mr-8">
          <img src={Infinity} alt="Infinity" />
          <h2 className="absolute top-1/2 transform -translate-y-1/2 text-4xl font-bold text-black z-10 mr-6">
            خطة التطوير المستقبلية
          </h2>
        </div>
        </div>

        {/* المربعات التفاعلية */}
        <div 
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto"
        >
          {developmentPlanData.map((item, index) => (
            <DevelopmentPlanCard 
              key={item.id} 
              item={item} 
              index={index}
              isVisible={visibleItems.has(index)}
            />
          ))}
        </div>

      </section>
    </div>
  );
}