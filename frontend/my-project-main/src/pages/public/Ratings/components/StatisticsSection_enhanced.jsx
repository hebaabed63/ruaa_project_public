import React, { useState, useEffect, useRef } from "react";
import { useRatings } from "../index_enhanced";
import building from "../../../../assets/icons/building.svg";
import transparency from "../../../../assets/icons/transparencyblue.svg";
import improvement from "../../../../assets/icons/improvementblue.svg";
import Infinity from "../../../../assets/icons/Infinity.svg";
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
  building: building,
  transparency: transparency,
  improvement: improvement
};

export default function StatisticsSection({ data }) {
  const { loading } = useRatings();
  const [titleRef, isTitleVisible] = useFadeInAnimation(0.2);
  const [cardsRef, visibleCards] = useStaggeredAnimation(data?.stats || [], 300);

  // Loading state
  if (loading || !data) {
    return (
      <div className="font-cairo bg-white text-black" dir="rtl">
        <section className="bg-white py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded mb-8 w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
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
      <section className="bg-white py-16 px-4">
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
          />
          <h2 className="absolute top-1/2 transform -translate-y-1/2 text-4xl font-bold text-secondary z-10 mr-8">
            إحصائيات عامّة
          </h2>
        </div>

        {/* Statistics Cards */}
        <div className="max-w-6xl mx-auto" ref={cardsRef}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {data.stats.map((stat, index) => {
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
                    valueType={stat.valueType}
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

        {/* Interactive Statistics Summary */}
        <div className={`max-w-4xl mx-auto mt-16 text-center transition-all duration-1000 ${
          visibleCards.size === data.stats.length 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-primary mb-4">
              ملخص الإحصائيات
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl font-bold text-primary">
                  {data.stats.reduce((sum, stat) => sum + (stat.valueType === 'percentage' ? 0 : stat.value), 0).toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 mt-1">إجمالي التقييمات والمدارس</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl font-bold text-secondary">
                  {Math.round(data.stats.reduce((sum, stat) => 
                    sum + (stat.valueType === 'percentage' ? stat.value : 0), 0
                  ) / data.stats.filter(s => s.valueType === 'percentage').length)}%
                </div>
                <p className="text-sm text-gray-600 mt-1">متوسط جودة التعليم</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl font-bold text-green-600">A+</div>
                <p className="text-sm text-gray-600 mt-1">التصنيف العام</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-12 transition-all duration-1000 ${
          visibleCards.size === data.stats.length 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-lg text-gray-700 mb-6">
            هذه الإحصائيات تعكس التزامنا بتطوير جودة التعليم
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-secondary transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
              onClick={() => {
                document.querySelector('#evaluation-criteria')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
            >
              اطّلع على معايير التقييم
            </button>
            <button 
              className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-medium hover:bg-primary hover:text-white transition-all duration-300"
              onClick={() => {
                document.querySelector('#parents-reviews')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
            >
              شاهد تقييمات الأهالي
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}