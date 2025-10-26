import React, { useState, useEffect, useRef } from "react";

import partnerImg from "../../../../assets/images/partner.jpg";

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

// Partner Card Component with interactive effects
const PartnerCard = ({ partner, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-all duration-700 transform ${
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
      onClick={() => partner.website && window.open(partner.website, '_blank')}
    >
      <div className="mb-4">
        <div className="  w-30 h-30 flex items-center justify-center overflow-hidden">
          <img 
            src={ partnerImg|| partner.logo } 
            alt={partner.name} 
            className={`w-30 h-30 object-contain transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
        </div>
      </div>
      {/* <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
        isHovered ? 'text-primary' : 'text-gray-900'
      }`}>
        {partner.name}
      </h3>
      <p className="text-gray-600 text-sm mb-3">
        {partner.description}
      </p> */}
      {/* {partner.website && (
        <button 
          className={`text-primary font-medium text-sm transition-colors duration-300 ${
            isHovered ? 'underline' : ''
          }`}
        >
          زيارة الموقع
        </button>
      )} */}
    </div>
  );
};

export default function PartnersSection({ data }) {
  // Fallback to default data if no data prop provided
  const defaultPartners = [
    {
      id: 1,
      name: "وزارة التربية والتعليم العالي",
      logo: partnerImg,
      // description: "الشريك الرسمي في تطوير التعليم",
      // website: "https://www.moehe.pna.ps",
      active: true
    }
  ];

  const partnersData = data || defaultPartners;
  
  // Animation hooks
  const [containerRef, isContainerVisible] = useFadeInAnimation(0.1);
  const [titleRef, isTitleVisible] = useFadeInAnimation(0.2);

  return (
    <div className="font-cairo bg-secondary text-black py-16" dir="rtl">
      <div 
        ref={containerRef}
        className="max-w-7xl mx-auto px-4"
      >

<div className="flex flex-col lg:flex-row justify-center items-center  lg:items-start gap-8">
  <h2
    ref={titleRef}
    className={`text-3xl mt-28 font-bold text-white transition-all duration-1000 ${
      isTitleVisible? 'opacity-100 translate-y-0': 'opacity-0 translate-y-4'
}`}
>
    شركاؤنا:
  </h2>

  <div className="w-full max-w-sm">
    {partnersData.slice(0, 1).map((partner, index) => (
      <PartnerCard
        key={partner.id}
        partner={partner}
        index={index}
        isVisible={isContainerVisible}
      />
))}
  </div>
</div>


        
      </div>
    </div>
  );
}