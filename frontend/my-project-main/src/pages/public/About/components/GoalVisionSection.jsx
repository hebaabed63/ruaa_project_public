import React, { useState, useEffect, useRef } from "react";

import logo from "../../../../assets/icons/LOGO.svg";
import females from "../../../../assets/images/females.png";

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

export default function GoalVisionSection({ data }) {
  // Fallback to default data if no data prop provided
  const defaultData = {
    goal: {
      title: "الهدف",
      content: `منصة رؤى هي منصـــة فلسطيـــــنية مستقــــلة تهدف إلى تقييـــم المدارس بمختلف مستوياتها، بطريقة مهنية وشفافة، بما يســـاعد
إدارات المدارس على تطوير أدائها، ويمنح أوليــاء الأمــور معلومــــات دقيــقة وموضوعية لاختيار المدرسة الأنسب لأبنائهم.`
    },
    vision: {
      title: "الرؤية",
      content: `أن تكون "رؤى" المرجع الأول في فلسطين لتقييـــــم المدارس وتعزيز
ثقافة الجودة والتميز في التعليم، بما ينعكس على بنــــــاء أجيال أكثر
وعياً وكفاءة.`
    }
  };

  const goalVisionData = data || defaultData;
  
  // Animation hooks
  const [textRef, isTextVisible] = useFadeInAnimation(0.2);
  const [imageRef, isImageVisible] = useFadeInAnimation(0.3);
  const [goalRef, isGoalVisible] = useFadeInAnimation(0.4);
  const [visionRef, isVisionVisible] = useFadeInAnimation(0.5);

  return (
    <div className="font-cairo bg-white text-black" dir="rtl">
      <section className="grid md:grid-cols-2 gap-4 py-20 items-center px-0">
        {/* الفقرات */}
        <div 
          ref={textRef}
          className={`space-y-6 md:order-2 text-2xl px-4 transition-all duration-1000 ${
            isTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* الهدف */}
          <div 
            ref={goalRef}
            className={`transition-all  duration-1000 delay-200 ${
              isGoalVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h3 className="inline-block text-xl bg-primary text-white font-bold px-4 py-1 mb-6 transform transition-transform duration-500 hover:scale-105">
              {goalVisionData.goal.title}
            </h3>
            <p className="text-[#000000] mb-14  leading-relaxed font-semibold whitespace-pre-line transition-colors duration-300 hover:text-gray-900">
              {goalVisionData.goal.content}
            </p>
          </div>

          {/* الرؤية */}
          <div 
            ref={visionRef}
            className={`transition-all duration-1000 delay-300 ${
              isVisionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h3 className="inline-block text-xl bg-primary text-white font-bold px-4 py-1 mb-6 transform transition-transform duration-500 hover:scale-105">
              {goalVisionData.vision.title}
            </h3>
            <p className="text-[#000000] leading-relaxed font-semibold whitespace-pre-line transition-colors duration-300 hover:text-gray-900">
              {goalVisionData.vision.content}
            </p>
          </div>
        </div>

        {/* الصورة داخلها اللوقو */}
        <div 
          ref={imageRef}
          className={`flex justify-start md:order-1 transition-all duration-1000 delay-100 ${
            isImageVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}
        >
          <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-md transform transition-transform duration-700 hover:scale-[1.02]">
            <img
              src={females}
              alt="صورة لطالبات فلسطينيات"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
            />
            <div className="absolute inset-0 bg-blue-950/60 z-0 transition-opacity duration-500"></div>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <img
                src={logo}
                alt="شعار منصة رؤى"
                className="w-20 md:w-24 lg:w-32 h-auto transition-transform duration-700 hover:scale-110"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}