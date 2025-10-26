import React, { useState, useRef, useEffect, useContext } from "react";
import { SchoolsContext } from "../context/SchoolsContext";

import staryallow from "../../../../assets/icons/staryallow.svg";
import alamal from "../../../../assets/images/alamal.png";
import alfarooq from "../../../../assets/images/alfarooq.png";
import alnoor from "../../../../assets/images/alnoor.png";

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
const useStaggeredAnimation = (items, delay = 300) => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [containerRef, isContainerVisible] = useFadeInAnimation(0.1);

  useEffect(() => {
    if (isContainerVisible && items.length > 0) {
      items.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems(prev => new Set([...prev, index]));
        }, index * delay);
      });
    }
  }, [isContainerVisible, items.length, delay]);

  return [containerRef, visibleItems];
};

// Image mapping
const imageMap = {
  "alamal.png": alamal,
  "alfarooq.png": alfarooq,
  "alnoor.png": alnoor
};

// Enhanced School Card Component
const BestSchoolCard = ({ school, index, isVisible, onRate, onViewDetails }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const handleRate = () => {
    onRate(school);
  };

  const handleViewDetails = () => {
    onViewDetails(school);
  };

  return (
    <div
      className={`
        bg-white rounded-lg shadow-md p-4 text-right transition-all duration-700 cursor-pointer
        transform hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br hover:from-white hover:to-blue-50
        ${isVisible 
          ? 'opacity-100 translate-y-0 rotate-0' 
          : 'opacity-0 translate-y-12 rotate-3'
        }
      `}
      style={{ transitionDelay: `${index * 200}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`بطاقة مدرسة ${school.title}`}
      tabIndex={0}
    >
      {/* School Image */}
      <div className="relative overflow-hidden rounded-xl mb-4">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center h-48">
            <div className="text-gray-400">🏫</div>
          </div>
        )}
        <img
          src={imageMap[school.image] || school.image}
          alt={school.title}
          className={`
            w-full h-48 object-cover rounded-xl transition-all duration-500
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            ${isHovered ? 'scale-110' : 'scale-100'}
          `}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />


        {/* Hover overlay with achievements */}
        <div className={`
          absolute inset-0 bg-black bg-opacity-70 rounded-xl transition-opacity duration-300 
          flex items-center justify-center
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}>
          <button
            onClick={() => setShowAchievements(!showAchievements)}
            className="text-white text-sm font-medium bg-primary px-3 py-1 rounded-md hover:bg-secondary transition-colors duration-300"
          >
            عرض الإنجازات
          </button>
        </div>
      </div>

      {/* School Content */}
      <div className="flex justify-between items-start mb-4">
        {/* Right Side - School Info */}
        <div className="text-sm text-black space-y-2 text-right flex-1">
          <div className={`
            font-semibold text-2xl transition-colors duration-300
            ${isHovered ? 'text-primary' : 'text-black'}
          `}>
            {school.title}
          </div>
          
          {/* Star Rating */}
          <div className="flex flex-row-reverse items-center gap-1 justify-end">
            <span className={`
              font-light mr-1 transition-colors duration-300
              ${isHovered ? 'text-primary font-medium' : 'text-black'}
            `}>
              {school.rating}
            </span>
            {[...Array(5)].map((_, idx) => (
              <img 
                key={idx} 
                src={staryallow} 
                alt="نجمة" 
                className={`w-4 h-4 transition-all duration-300 ${
                  idx < Math.floor(school.rating) 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-30 scale-75'
                }`}
              />
            ))}
            
          </div>
          
          <div className={`
            font-light transition-colors duration-300
            ${isHovered ? 'text-gray-700' : 'text-gray-600'}
          `}>
            {school.description}
          </div>
        </div>

        {/* Left Side - Location */}
        <span className={`
          text-sm font-light transition-all duration-300
          ${isHovered ? 'text-primary font-medium scale-110' : 'text-[#4CAF50]'}
        `}>
          {school.location}
        </span>
      </div>

      {/* Achievements Section (Expandable) */}
      {showAchievements && school.achievements && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200 animate-slideDown">
          <h4 className="font-semibold text-primary mb-2">الإنجازات:</h4>
          <div className="space-y-1">
            {school.achievements.map((achievement, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-700">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between gap-2">
        <button 
          onClick={handleRate}
          className={`
            w-1/2 py-2 rounded-lg font-medium transition-all duration-300 transform
            ${isHovered 
              ? 'bg-secondary text-white scale-105 shadow-lg' 
              : 'bg-primary text-white hover:bg-secondary'
            }
          `}
        >
          قيّم الآن
        </button>
        <button 
          onClick={handleViewDetails}
          className={`
            w-1/2 border py-2 rounded-lg font-medium transition-all duration-300 transform
            ${isHovered 
              ? 'bg-primary text-white border-primary scale-105 shadow-lg' 
              : 'border-primary text-primary hover:bg-primary hover:text-white'
            }
          `}
        >
          عرض التفاصيل
        </button>
      </div>

      {/* Performance Indicator */}
      <div className={`
        absolute top-2 left-2 w-3 h-3 rounded-full transition-all duration-500
        ${isVisible ? 'bg-green-500 scale-100' : 'bg-transparent scale-0'}
      `}>
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
      </div>
    </div>
  );
};

export default function BestSchools({ data }) {
  const { state, dispatch } = useContext(SchoolsContext) || { state: {}, dispatch: () => {} };
  const [titleRef, isTitleVisible] = useFadeInAnimation(0.2);
  const [cardsRef, visibleCards] = useStaggeredAnimation(data?.schools || [], 400);

  // Handle rating submission
  const handleRate = async (school) => {
    try {
      const ratingData = {
        schoolId: school.id,
        schoolName: school.title,
        rating: 5, // Default rating, could be from a modal
        comment: `تقييم ممتاز لمدرسة ${school.title}`,
        timestamp: new Date().toISOString()
      };
      
      // Mock rating submission - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Rating submitted:', ratingData);
      
      // Update context if needed
      if (dispatch) {
        dispatch({
          type: 'UPDATE_SCHOOL_RATING',
          payload: { schoolId: school.id, rating: ratingData }
        });
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  // Handle view details
  const handleViewDetails = (school) => {
    console.log('Viewing details for:', school);
    // Navigate to school details page or open modal
  };

  // Loading state
  if (!data) {
    return (
      <div className="font-cairo bg-white text-black" dir="rtl">
        <section className="py-16 px-4 bg-babyBlue">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-12 w-1/3 mx-auto"></div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="font-cairo bg-white text-black" dir="rtl">
      <section className="py-16 px-4 bg-babyBlue">
        {/* Animated Title */}
        <h2 
          ref={titleRef}
          className={`
            text-3xl font-bold text-primary text-center mb-12 transition-all duration-1000
            ${isTitleVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-8 scale-95'
            }
          `}
        >
          {data.title || "أبرز المدارس لهذا الشهر"}
        </h2>

        {/* School Cards */}
        <div className="max-w-7xl mx-auto" ref={cardsRef}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.schools.map((school, index) => (
              <BestSchoolCard
                key={school.id}
                school={school}
                index={index}
                isVisible={visibleCards.has(index)}
                onRate={handleRate}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}