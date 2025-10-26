import React, { useState, useRef, useEffect } from "react";
import { useRatings } from "../index";
import Infinity from "../../../../assets/icons/Infinity.svg";
import SchoolCard from "./SchoolCard";

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

export default function EvaluationCriteria({ data }) {
  const { submitRating, submitLoading } = useRatings();
  const [titleRef, isTitleVisible] = useFadeInAnimation(0.2);
  const [filteredSchools, setFilteredSchools] = useState(data?.schools || []);
  const [showCriteriaDetails, setShowCriteriaDetails] = useState(false);

  // Update filtered schools when data changes
  useEffect(() => {
    setFilteredSchools(data?.schools || []);
  }, [data]);

  // Handle rating submission
  const handleRatingSubmit = async (formData) => {
    try {
      await submitRating(formData);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  // Loading state
  if (!data) {
    return (
      <div className="font-cairo bg-white text-black" dir="rtl">
        <section className="bg-white py-16 px-4">
          <div className="max-w-6xl mx-auto animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-8 w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-48 bg-gray-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="font-cairo bg-white text-black" dir="rtl">
      <section className="bg-white py-16 px-4" id="evaluation-criteria">
        <div className="max-w-6xl mx-auto">

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
              alt="رمز لا نهائي يمثل الاستمرارية" 
              className="transition-transform duration-500 hover:scale-110"
            />
            <h2 className="absolute top-1/2 transform -translate-y-1/2 text-4xl font-bold text-primary z-10 mr-8">
              {data.title || "معايير التقييم:"}
            </h2>
          </div>

          {/* School Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            {filteredSchools.map((school, index) => (
              <div
                key={school.id}
                className={`transition-all duration-700 ${
                  isTitleVisible 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-12 scale-95'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <SchoolCard
                  school={school}
                  isVisible={isTitleVisible}
                  onRatingSubmit={handleRatingSubmit}
                  isSubmitting={submitLoading}
                />
              </div>
            ))}
          </div>

         


        </div>
      </section>
    </div>
  );
}