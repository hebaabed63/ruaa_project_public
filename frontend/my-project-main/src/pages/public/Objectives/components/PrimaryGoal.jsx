import React, { useState, useEffect, useRef } from "react";

import greenschool from "../../../../assets/images/greenschool.png";

// Custom hook for fade-in animation
const useFadeInAnimation = () => {
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

export default function PrimaryGoal({ data }) {
  const [buttonHover, setButtonHover] = useState(false);
  const { isVisible, elementRef } = useFadeInAnimation();
  
  // Fallback to default data if no data prop provided
  const defaultData = {
    title: "الهدف الأساسي",
    description: "تمكين الأهالي من اختيار المدارس المناسبة\nلأبنائهم من خلال تقييمات موثوقة وشفّافة",
    callToAction: {
      text: "قيّم مدرستك الآن",
      link: "/evaluate",
      enabled: true
    },
    motivationalText: {
      part1: "ساهم معنا في",
      highlight: "تحقيق",
      part2: "أهدافنا وكن\nجزءًا من تطوير التعليم في فلسطين."
    },
    image: "greenschool"
  };

  const primaryGoalData = data || defaultData;

  const handleButtonClick = () => {
    if (primaryGoalData.callToAction?.enabled && primaryGoalData.callToAction?.link) {
      // Navigate to evaluation page or show modal
      console.log('Navigate to:', primaryGoalData.callToAction.link);
      // In real implementation: navigate(primaryGoalData.callToAction.link);
    }
  };

  return (
    <div className="font-cairo bg-white text-black" dir="rtl">
      <section 
        ref={elementRef}
        className={`grid md:grid-cols-2 gap-4 py-20 items-center px-0 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        {/* النص والزر */}
        <div className={`text-gray-700 leading-relaxed font-semibold space-y-6 md:order-2 text-2xl px-20 transform transition-all duration-1000 delay-200 ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
        }`}>
          <div>
            <p>
              {primaryGoalData.motivationalText.part1} <span className="text-yellow-300">{primaryGoalData.motivationalText.highlight}</span> {primaryGoalData.motivationalText.part2.split('\n')[0]}
            </p>
            <p>
              {primaryGoalData.motivationalText.part2.split('\n')[1]}
            </p>
          </div>

          <button 
            onClick={handleButtonClick}
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => setButtonHover(false)}
            disabled={!primaryGoalData.callToAction?.enabled}
            className={`bg-primary w-[320px] font-medium text-white px-6 py-3 mr-4 rounded-md transition-all duration-300 transform ${
              buttonHover 
                ? 'bg-secondary scale-105 shadow-lg' 
                : 'hover:bg-secondary hover:scale-105 hover:shadow-lg'
            } ${!primaryGoalData.callToAction?.enabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {primaryGoalData.callToAction?.text || "قيّم مدرستك الآن"}
          </button>
        </div>

        {/* الصورة مع الكلام */}
        <div className={`flex justify-start md:order-1 transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
        }`}>
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-md group">
            <img
              src={greenschool}
              alt="green school"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-blue-950/20 z-0 transition-all duration-300 group-hover:bg-blue-950/30"></div>

            {/* النص في منتصف الصورة */}
            <div className="absolute inset-0 flex flex-col justify-center items-center z-10 text-center px-4 space-y-2">
              <h3 className={`text-yallow text-3xl font-semibold ml-36 transform transition-all duration-700 delay-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                {primaryGoalData.title}
              </h3>
              <div className={`transform transition-all duration-700 delay-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <p className="whitespace-pre-line text-white text-xl font-semibold">
                  {primaryGoalData.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}