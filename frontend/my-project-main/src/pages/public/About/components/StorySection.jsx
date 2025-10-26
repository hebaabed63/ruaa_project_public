import React, { useState, useEffect, useRef } from "react";

import storyImage from "../../../../assets/images/girl.png";
import Infinity from "../../../../assets/icons/Infinity.svg";
import twoTrue from "../../../../assets/icons/twoTrue.svg";

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

// Story Paragraph Component
const StoryParagraph = ({ paragraph, index, isVisible }) => {
  return (
    <div 
      className={`mb-8 transition-all duration-1000 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >


<div className="flex items-center gap-2">
                <img src={twoTrue} alt="رمز تحقق مزدوج" />
<p className="text-lg font-medium text-[#000000] mb-2">
        {paragraph.intro}
      </p>              </div>



      <p className="text-lg font-medium text-[#000000] mb-2 leading-relaxed whitespace-pre-line mr-4">
        {paragraph.content}
      </p>
    </div>
  );
};

export default function StorySection({ data }) {
  // Fallback to default data if no data prop provided
  const defaultData = {
    title: "القصة وراء المنصة",
    paragraphs: [
      {
        id: 1,
        intro: "انطلقت فكرة منصة رؤى من الحاجة الملحــة إلى وجود",
        content: `مصدر موثوق وموحد يعكس واقع المدارس في فلسطيـن،
ويمنح أولياء الأمور القدرة على اتخاذ قـــــرارات مبنيـــة على
بيانات لا على انطباعات.`
      },
      {
        id: 2,
        intro: "في ظل التباين الكبير بين المدارس من حيث الإمكـانيات",
        content: `والبرامج التعليمية والأنشطة، جاءت "رؤى" لتكـون جسرًا بين
المدرسة والمجتمع، تفتح أبواب التقييم والمساءلة، وتدفـع
باتجاه تطوير التعليم كحق أساسي لكل طالب.`
      }
    ]
  };

  const storyData = data || defaultData;
  
  // Animation hooks
  const [containerRef, isContainerVisible] = useFadeInAnimation(0.1);
  const [titleRef, isTitleVisible] = useFadeInAnimation(0.2);
  const [imageRef, isImageVisible] = useFadeInAnimation(0.3);

  return (
    <div className="font-cairo bg-white text-black py-16" dir="rtl">
      <div 
        ref={containerRef}
        className="max-w-7xl mx-auto px-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
          {/* Text Content */}
          <div>
            <h2 
              ref={titleRef}
              className={`text-3xl font-bold text-primary mb-8 transition-all duration-1000 ${
                isTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >



<div className="relative w-full pl-10">
              <img src={Infinity} alt="Infinity" />
              <h2 className="absolute top-1/2 transform -translate-y-1/2 text-4xl font-bold text-secondary z-10 mr-8">
              {storyData.title}
              </h2>
            </div>

            </h2>
            
            <div>
              {storyData.paragraphs.map((paragraph, index) => (
                <StoryParagraph 
                  key={paragraph.id}
                  paragraph={paragraph}
                  index={index}
                  isVisible={isContainerVisible}
                />
              ))}
            </div>
          </div>
          
          {/* Image */}
          <div 
            ref={imageRef}
            className={`transition-all duration-1000 delay-200 ${
              isImageVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            } `}
          >
            <div className="rounded-xl overflow-hidden shadow-lg transform transition-transform duration-700 hover:scale-[1.02]">
              <img 
                src={storyImage} 
                alt="قصة منصة رؤى" 
                className="w-full h-auto object-cover transition-transform duration-1000 hover:scale-110"
              />
                          <div className="absolute inset-0 bg-blue-950/30 z-0"></div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


