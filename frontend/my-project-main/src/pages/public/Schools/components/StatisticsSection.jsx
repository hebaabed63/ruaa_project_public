import React, { useState, useEffect, useRef, useContext } from "react";
import { SchoolsContext } from "../context/SchoolsContext";

import Infinity from "../../../../assets/icons/Infinity.svg";
import schoolicon from "../../../../assets/icons/schoolicon.svg";
import team from "../../../../assets/icons/team.svg";
import office from "../../../../assets/icons/office.svg";
import StatCard from "./StatCard";

// Custom hook for fade-in animation on scroll
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
const useStaggeredAnimation = (items, delay = 200) => {
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

// Icon mapping
const iconMap = {
  office: office,
  schoolicon: schoolicon,
  team: team
};

export default function StatisticsSection({ data }) {
  const { state, dispatch } = useContext(SchoolsContext) || { state: {}, dispatch: () => {} };
  const [titleRef, isTitleVisible] = useFadeInAnimation(0.2);
  const [cardsRef, visibleCards] = useStaggeredAnimation(data?.stats || [], 300);

  // Loading state
  if (state.loading?.statistics || !data) {
    return (
      <div className="font-cairo bg-white text-black" dir="rtl">
        <section className="py-16 px-4">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-8 w-1/3"></div>
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-xl mt-10"></div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="font-cairo bg-white text-black" dir="rtl">
      <section className="py-16 px-4">
        {/* Animated Title */}
        <div 
          ref={titleRef}
          className={`relative w-full pb-8 transition-all duration-1000 ${
            isTitleVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <img 
            src={Infinity} 
            alt="رمز اللانهاية يدل على الاستمرارية" 
            className="transition-transform duration-500 hover:scale-110"
            loading="lazy" 
          />
          <h2 className="absolute top-1/2 transform -translate-y-1/2 text-4xl font-bold text-secondary z-10 mr-8">
            {data.title || "إحصائيات عامّة"}
          </h2>
        </div>

        {/* Statistics Cards */}
        <div className="max-w-6xl mx-auto" ref={cardsRef}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {(data?.stats || []).map((stat, index) => {
              const isVisible = visibleCards.has(index);
              
              return (
                <div
                  key={stat.id}
                  className={`transition-all duration-700 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-12 scale-95'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <StatCard
                    icon={iconMap[stat.icon]}
                    value={stat.value}
                    label={stat.label}
                    description={stat.description}
                    animationConfig={stat.animationConfig}
                    isVisible={isVisible}
                    index={index}
                  />
                </div>
              );
            })}
          </div>
        </div>

    
      </section>
    </div>
  );
}