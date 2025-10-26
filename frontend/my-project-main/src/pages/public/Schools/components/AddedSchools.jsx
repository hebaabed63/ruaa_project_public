import React, { useState, useEffect, useContext } from "react";
import { SchoolsContext } from "../context/SchoolsContext";

import alfajr from "../../../../assets/images/alfajr.png";
import alqema from "../../../../assets/images/alqema.png";
import alawda from "../../../../assets/images/alawda.png";

// Custom hook for fade-in animation
const useFadeInAnimation = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);
  const [elementRef, setElementRef] = useState(null);

  useEffect(() => {
    if (!elementRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(elementRef);
    return () => observer.disconnect();
  }, [elementRef, delay]);

  return [isVisible, setElementRef];
};

// Custom hook for staggered animation
const useStaggeredAnimation = (itemCount, staggerDelay = 150) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const [containerRef, setContainerRef] = useState(null);

  useEffect(() => {
    if (!containerRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate items with stagger effect
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setVisibleItems(prev => [...prev, i]);
            }, i * staggerDelay);
          }
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef);
    return () => observer.disconnect();
  }, [containerRef, itemCount, staggerDelay]);

  return [visibleItems, setContainerRef];
};

// Mock API service for added schools
const addedSchoolsApiService = {
  getRecentSchools: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      schools: [
        {
          id: 1,
          name: "مدرسة الفجر",
          location: "بيت لحم",
          image: alfajr,
          addedDate: "2024-01-15",
          type: "حكومية",
          students: 450,
          rating: 4.8,
          description: "مدرسة حديثة مع مرافق متطورة وطاقم تعليمي مؤهل"
        },
        {
          id: 2,
          name: "مدرسة القمّة",
          location: "النصيرات",
          image: alqema,
          addedDate: "2024-01-10",
          type: "خاصة",
          students: 320,
          rating: 4.9,
          description: "مدرسة متميزة تركز على التعليم التفاعلي والتكنولوجيا"
        },
        {
          id: 3,
          name: "مدرسة العودة",
          location: "نابلس",
          image: alawda,
          addedDate: "2024-01-05",
          type: "حكومية",
          students: 380,
          rating: 4.7,
          description: "مدرسة عريقة بتاريخ طويل في التميز الأكاديمي"
        },
      ],
      totalCount: 15,
      hasMore: true
    };
  }
};

// Enhanced School Card Component with animations
const AddedSchoolCard = ({ school, index, isVisible, onViewDetails, onQuickAction }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden p-4 transform transition-all duration-700 ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-8 opacity-0'
      } ${
        isHovered 
          ? 'shadow-xl scale-105 -translate-y-2' 
          : 'shadow-md'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`بطاقة ${school.name}`}
    >
      {/* صورة المدرسة */}
      <div className="relative overflow-hidden rounded-3xl">
        <img
          src={school.image}
          alt={school.name}
          className={`w-full h-48 object-cover transition-all duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-3xl" />
        )}
        
        {/* Overlay with school type badge */}
        {/* <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            school.type === 'خاصة' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {school.type}
          </span>
        </div> */}
        
        {/* Rating badge */}
        {/* <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
          <span className="text-yellow-500 text-sm">⭐</span>
          <span className="text-sm font-medium">{school.rating}</span>
        </div> */}
        
        {/* Quick action button */}
        <button 
          className={`absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full transition-all duration-300 ${
            isHovered ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
          onClick={() => onQuickAction && onQuickAction(school.id)}
          aria-label="إجراء سريع"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* المحتوى أسفل الصورة */}
      <div className="flex justify-between items-start px-4 pb-4 pt-4">
        {/* الجهة اليمنى */}
        <div className="text-right text-sm text-gray-700 space-y-2 flex-1">
          <div className="font-semibold text-2xl text-gray-900 leading-tight">
            {school.name}
          </div>
          <div className="text-[#888E99] font-normal flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {school.location}
          </div>
          
          {/* Student count */}
          {/* <div className="text-gray-500 text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            {school.students} طالب
          </div> */}
          
          {/* Expandable description */}
          <div className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
              {school.description}
            </p>
          </div>
        </div>

        {/* الجهة اليسرى */}
        <div className="flex flex-col gap-2 mr-4">
          <button 
            className={`bg-white text-primary border border-primary px-3 py-1.5 rounded-lg transition-all duration-300 font-medium text-sm ${
              isHovered 
                ? 'bg-primary text-secondary border-primary shadow-md transform scale-105' 
                : 'hover:bg-primary/5'
            }`}
            onClick={() => onViewDetails && onViewDetails(school.id)}
            aria-label={`عرض تفاصيل ${school.name}`}
          >
            عرض التفاصيل
          </button>
          
          {/* Expand/Collapse button */}
          <button 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
          >
            <svg 
              className={`w-4 h-4 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : 'rotate-0'
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Loading skeleton component
const SchoolCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden p-4 animate-pulse">
    <div className="w-full h-48 bg-gray-200 rounded-3xl mb-4" />
    <div className="flex justify-between items-center px-4 pb-4 pt-2">
      <div className="space-y-2 flex-1">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
      <div className="h-8 bg-gray-200 rounded w-20 mr-4" />
    </div>
  </div>
);

export default function AddedSchools() {
  // State management
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Context
  const { state, dispatch } = useContext(SchoolsContext) || { state: {}, dispatch: () => {} };
  
  // Animations
  const [headerVisible, headerRef] = useFadeInAnimation(200);
  const [visibleCards, cardsRef] = useStaggeredAnimation(3, 200);

  // Load schools data
  useEffect(() => {
    const loadSchools = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await addedSchoolsApiService.getRecentSchools();
        setSchools(data.schools);
        
        // Update context if available
        if (dispatch) {
          dispatch({
            type: 'SET_ADDED_SCHOOLS',
            payload: data
          });
        }
      } catch (err) {
        console.error('Failed to load added schools:', err);
        setError('فشل في تحميل المدارس المضافة حديثاً. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    loadSchools();
  }, [dispatch, retryCount]);

  // Event handlers
  const handleViewDetails = (schoolId) => {
    console.log('View details for school:', schoolId);
    // Here you would typically navigate to school details page
    // or open a modal with detailed information
  };

  const handleQuickAction = (schoolId) => {
    console.log('Quick action for school:', schoolId);
    // Here you could implement quick actions like adding to favorites
  };

  const handleViewAll = () => {
    setShowAll(true);
    console.log('View all schools');
    // Here you would typically navigate to a full schools listing page
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Error state
  if (error && !loading) {
    return (
      <div className="font-cairo bg-white text-black" dir="rtl">
        <section className="py-16 px-4 bg-babyBlue">
          <div className="max-w-7xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <div className="text-red-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">خطأ في التحميل</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button 
                onClick={handleRetry}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="font-cairo bg-white text-black" dir="rtl">
      <section className="py-16 px-4 bg-babyBlue">
        {/* العنوان والزر */}
        <div 
          ref={headerRef}
          className={`max-w-7xl mx-auto flex justify-between items-center mb-12 transform transition-all duration-1000 ${
            headerVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-2">
              مدارس مُضافة مُؤخراً
            </h2>
           
          </div>
          <button 
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium"
            onClick={handleViewAll}
            aria-label="عرض جميع المدارس المضافة حديثاً"
          >
            <span className="flex items-center gap-2">
              عرض الكل
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </span>
          </button>
        </div>

        {/* البطاقات */}
        {loading ? (
          // Loading state
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <SchoolCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div 
            ref={cardsRef}
            className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {schools.map((school, i) => (
              <AddedSchoolCard
                key={school.id}
                school={school}
                index={i}
                isVisible={visibleCards.includes(i)}
                onViewDetails={handleViewDetails}
                onQuickAction={handleQuickAction}
              />
            ))}
          </div>
        )}

      </section>
    </div>
  );
}