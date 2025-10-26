import React, { useState, useEffect, useRef } from "react";

import family from "../../../../assets/icons/family.svg";
import manager from "../../../../assets/icons/manager.svg";
import female from "../../../../assets/icons/female.svg";
import school from "../../../../assets/icons/school2.svg";

// Custom hook for section animation
const useSectionAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
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

// Impact Card Component
const ImpactCard = ({ impact, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIconSrc = (iconName) => {
    const iconMap = {
      family,
      manager,
      female,
      school
    };
    return iconMap[iconName] || family;
  };

  return (
    <div 
      className={`bg-primary text-white p-6 rounded-xl shadow-sm w-full max-w-[300px] min-h-[200px] mx-auto flex flex-col justify-center items-center text-center cursor-pointer transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${isHovered ? 'scale-105 shadow-xl bg-blue-700' : 'hover:scale-105 hover:shadow-xl hover:bg-blue-700'}`}
      style={{ animationDelay: `${index * 200}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        <div className={`flex items-center gap-3 mb-2 transform transition-all duration-300 ${
          isHovered ? 'scale-110' : ''
        }`}>
          <img 
            src={getIconSrc(impact.icon)} 
            alt={`${impact.title} icon`} 
            className="w-15 h-14" 
          />
          <h3 className="text-lg font-semibold">{impact.title}</h3>
        </div>
        <p className={`whitespace-pre-line text-sm font-normal leading-relaxed transition-all duration-300 ${
          isHovered ? 'text-gray-100' : ''
        }`}>
          {impact.description}
        </p>
      </div>
    </div>
  );
};

// Impact Section Component
const ImpactSectionGroup = ({ title, impacts, isVisible, startIndex }) => {
  return (
    <>
      {/* العنوان */}
      <h2
        className={`text-3xl font-semibold text-center text-primary mb-10 underline decoration-[#D9D9D9] transform transition-all duration-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
        style={{ 
          textUnderlineOffset: '10px',
          animationDelay: `${startIndex * 100}ms`
        }}
      >
        {title}
      </h2>

      {/* البطاقات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-1 gap-y-6 mb-16">
        {impacts.map((impact, index) => (
          <ImpactCard 
            key={impact.id} 
            impact={impact} 
            index={startIndex + index} 
            isVisible={isVisible}
          />
        ))}
      </div>
    </>
  );
};

export default function ImpactSection({ data }) {
  const { isVisible, elementRef } = useSectionAnimation();
  
  // Fallback to default data if no data prop provided
  const defaultData = {
    educational: {
      title: "تأثير الأهداف على المجتمع التعليمي",
      impacts: [
        {
          id: 1,
          icon: "family",
          title: "الأهالي",
          description: "قرارات واعية ومدروسة في اختيار\nالمدرسة المناسبة للأطفال",
          category: "parents"
        },
        {
          id: 2,
          icon: "manager",
          title: "المُشرفين",
          description: "أدوات فعّالة لمتابعة وتطوير\nجودة التعليم في المنطقة",
          category: "supervisors"
        },
        {
          id: 3,
          icon: "female",
          title: "الطلاب",
          description: "بيئة تعليمية محسّنة ومناسبة\nلاحتياجاتهم التعليمية",
          category: "students"
        }
      ]
    },
    community: {
      title: "تأثير الأهداف على البيئة المُجتمعيّة",
      impacts: [
        {
          id: 4,
          icon: "family",
          title: "الأهالي",
          description: "تقليل الحيرة وتوفير الوقت والجهد عند\nاختيار المدرسة المناسبة لأطفالهم",
          category: "parents"
        },
        {
          id: 5,
          icon: "manager",
          title: "المُشرفين",
          description: "تعزيز دورهم في تحسين جودة التعليم\nومتابعة الأداء بشكل منتظم",
          category: "supervisors"
        },
        {
          id: 6,
          icon: "school",
          title: "المدارس",
          description: "رفع مستوى الخدمات والتحفيز على\nالتطوير المستمر والتميز التعليمي",
          category: "schools"
        }
      ]
    }
  };

  const impactData = data || defaultData;

  return (
    <div className="font-cairo bg-white text-black" dir="rtl">
      <section className="bg-white py-20 px-4">
        <div 
          ref={elementRef}
          className={`w-full mx-auto bg-babyBlue rounded-xl shadow-md p-10 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {/* المجموعة الأولى - التأثير التعليمي */}
          <ImpactSectionGroup 
            title={impactData.educational.title}
            impacts={impactData.educational.impacts}
            isVisible={isVisible}
            startIndex={0}
          />

          {/* المجموعة الثانية - التأثير المجتمعي */}
          <ImpactSectionGroup 
            title={impactData.community.title}
            impacts={impactData.community.impacts}
            isVisible={isVisible}
            startIndex={3}
          />
        </div>
      </section>
    </div>
  );
}