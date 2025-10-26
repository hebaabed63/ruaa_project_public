import React, { useState, useEffect, useRef } from "react";

import transparency from "../../../../assets/icons/transparency.svg";
import credibility from "../../../../assets/icons/Credibility.svg";
import improvement from "../../../../assets/icons/improvement.svg";

// Custom hook for staggered animations
const useStaggeredAnimation = (itemsCount, delay = 200) => {
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

// Value Card Component with interactive effects
const ValueCard = ({ value, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  const iconMap = {
    transparency: transparency,
    credibility: credibility,
    improvement: improvement
  };

  return (
    <div
className={`${
  value.icon === "credibility" ? "bg-primary" : "bg-white"
} rounded-lg shadow-md p-14 text-center transition-all duration-700 transform ${
  isVisible 
    ? 'opacity-100 translate-y-0' 
    : 'opacity-0 translate-y-8'
} ${
  isHovered 
    ? 'shadow-xl scale-105 -translate-y-2' 
    : 'shadow-md'
}`}

      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-center mb-4">
        
        <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
          isHovered ? 'bg-primary/20 scale-110' : ''
        }`}>
          <img 
            src={iconMap[value.icon]} 
            alt={value.title} 
            className={`w-12 h-13 transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
        </div>
      </div>
     <h3 className={`text-xl font-bold mb-7 transition-colors duration-300 ${
  value.icon === "credibility" ? "text-white" : (isHovered ? "text-primary" : "text-secondary")
}`}>
  {value.title}
</h3>

      <p className={`leading-8 font-semibold whitespace-pre-line ${
  value.icon === "credibility" ? "text-white" : "text-primary"
}`}>
  {value.description}
</p>

    </div>
  );
};

export default function ValuesSection({ data }) {
  // Fallback to default data if no data prop provided
  const defaultValues = [
    {
      id: 1,
      title: "الشفافية",
      description: `تقديم معلومات واضحــــة
وموثوقة بعيداً عن أي تحيّز`,
      icon: "transparency"
    },
    {
      id: 2,
      title: "المصداقية",
      description: `الاعتماد على أدوات تقييم
دقة ومعايير موضوعية`,
      icon: "credibility"
    },
    {
      id: 3,
      title: "التطوير المستمر",
      description: `دعم المدارس لرفع جودة 
التعليم والارتقــــاء بالبيئة
المدرسية`,
      icon: "improvement"
    }
  ];

  const valuesData = data || defaultValues;
  
  // Animation hooks
  const [containerRef, visibleItems] = useStaggeredAnimation(valuesData.length, 200);

  return (
    <div className="font-cairo bg-[#AEC8DEA8] text-black py-16" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
         <div className="flex items-start gap-4 text-white mr-60 mb-20">
            <h2 className="text-3xl font-bold whitespace-nowrap inline-block bg-primary px-6 mt-2 py-1">
              القيم
            </h2>
            <p className="text-3xl leading-relaxed font-bold text-secondary whitespace-pre-line">
              {`قيمنا ليست مجرد مبادئ مكتوبة، بل هي
بوصلة توجه خطواتنا وتحدد طريقة عملنا`}
            </p>
          </div>
        <div 
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {valuesData.map((value, index) => (
            <ValueCard 
              key={value.id}
              value={value}
              index={index}
              isVisible={visibleItems.has(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}