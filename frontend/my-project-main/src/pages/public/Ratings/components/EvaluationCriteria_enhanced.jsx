import React, { useState, useRef, useEffect } from "react";
import { useRatings } from "../index_enhanced";
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

// Expandable Section Component
const ExpandableSection = ({ title, children, defaultExpanded = false, icon }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded, children]);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-full px-6 py-4 text-right flex items-center justify-between
          transition-all duration-300 hover:bg-gray-50
          ${isExpanded ? 'bg-primary/5' : 'bg-white'}
        `}
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'إخفاء' : 'عرض'} ${title}`}
      >
        <div className="flex items-center gap-3">
          {icon && <img src={icon} alt="" className="w-6 h-6" />}
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        <div className={`
          transform transition-transform duration-300
          ${isExpanded ? 'rotate-180' : 'rotate-0'}
        `}>
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      <div
        style={{ height: contentHeight }}
        className="transition-all duration-500 ease-in-out overflow-hidden"
      >
        <div ref={contentRef} className="px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Criteria Explanation Component
const CriteriaExplanation = () => {
  const criteriaDetails = [
    {
      title: "جودة التعليم",
      description: "تقييم مستوى المناهج، كفاءة المعلمين، والطرق التدريسية المتبعة",
      weight: "30%",
      indicators: [
        "مؤهلات وخبرة المعلمين",
        "تنوع الطرق التدريسية",
        "مستوى المناهج والمحتوى",
        "معدلات نجاح الطلاب"
      ]
    },
    {
      title: "الإدارة والانضباط المدرسي",
      description: "فعالية الإدارة في تنظيم البيئة المدرسية والحفاظ على الانضباط",
      weight: "25%",
      indicators: [
        "وضوح القوانين واللوائح",
        "تطبيق الانضباط بعدالة",
        "التواصل مع الأهالي",
        "إدارة الوقت والجداول"
      ]
    },
    {
      title: "النظافة والبيئة المدرسية",
      description: "مستوى النظافة والأمان في البيئة المدرسية",
      weight: "20%",
      indicators: [
        "نظافة الفصول والمرافق",
        "صيانة المباني والتجهيزات",
        "توفر المياه النظيفة",
        "مساحات خضراء وبيئة صحية"
      ]
    },
    {
      title: "الأنشطة والفعاليات",
      description: "تنوع وجودة الأنشطة اللاصفية والفعاليات المدرسية",
      weight: "15%",
      indicators: [
        "الأنشطة الرياضية والثقافية",
        "المسابقات والفعاليات",
        "الرحلات التعليمية",
        "الأندية الطلابية"
      ]
    },
    {
      title: "المرافق والخدمات",
      description: "جودة المرافق المدرسية والخدمات المقدمة للطلاب",
      weight: "10%",
      indicators: [
        "المختبرات والمكتبة",
        "الملاعب والصالات",
        "الكافتيريا والنقل",
        "الخدمات الصحية"
      ]
    }
  ];

  return (
    <div className="space-y-4">
      {criteriaDetails.map((criteria, index) => (
        <ExpandableSection
          key={index}
          title={`${criteria.title} (${criteria.weight})`}
          defaultExpanded={index === 0}
        >
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">{criteria.description}</p>
            
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">مؤشرات التقييم:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {criteria.indicators.map((indicator, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-gray-700">{indicator}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">الوزن النسبي:</span>
                <span className="font-bold text-primary">{criteria.weight}</span>
              </div>
            </div>
          </div>
        </ExpandableSection>
      ))}
    </div>
  );
};

// Filter Component
const SchoolFilter = ({ onFilterChange, schoolsData }) => {
  const [filters, setFilters] = useState({
    sortBy: 'rating',
    minRating: 0,
    showTopOnly: false
  });

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <h4 className="font-semibold text-gray-800 mb-4">تصفية وترتيب المدارس</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ترتيب حسب:
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="rating">التقييم العام</option>
            <option value="votes">عدد التقييمات</option>
            <option value="name">اسم المدرسة</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الحد الأدنى للتقييم:
          </label>
          <select
            value={filters.minRating}
            onChange={(e) => handleFilterChange({ minRating: Number(e.target.value) })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value={0}>جميع التقييمات</option>
            <option value={3}>3 نجوم فأكثر</option>
            <option value={4}>4 نجوم فأكثر</option>
            <option value={4.5}>4.5 نجوم فأكثر</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.showTopOnly}
              onChange={(e) => handleFilterChange({ showTopOnly: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">المدارس المميزة فقط</span>
          </label>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>عدد المدارس: {schoolsData?.length || 0}</span>
        <button
          onClick={() => handleFilterChange({ sortBy: 'rating', minRating: 0, showTopOnly: false })}
          className="text-primary hover:text-secondary transition-colors duration-200"
        >
          إعادة تعيين
        </button>
      </div>
    </div>
  );
};

export default function EvaluationCriteria({ data }) {
  const { submitRating, submitLoading } = useRatings();
  const [titleRef, isTitleVisible] = useFadeInAnimation(0.2);
  const [schoolsRef, visibleSchools] = useStaggeredAnimation(data?.schools || [], 400);
  const [filteredSchools, setFilteredSchools] = useState(data?.schools || []);
  const [showCriteriaDetails, setShowCriteriaDetails] = useState(false);

  // Update filtered schools when data changes
  useEffect(() => {
    setFilteredSchools(data?.schools || []);
  }, [data]);

  // Handle school filtering
  const handleFilterChange = (filters) => {
    if (!data?.schools) return;

    let filtered = [...data.schools];

    // Filter by minimum rating
    if (filters.minRating > 0) {
      filtered = filtered.filter(school => school.rating >= filters.minRating);
    }

    // Filter top schools only
    if (filters.showTopOnly) {
      filtered = filtered.filter(school => school.rating >= 4.0);
    }

    // Sort schools
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'votes':
          return b.votes - a.votes;
        case 'name':
          return a.name.localeCompare(b.name, 'ar');
        default:
          return 0;
      }
    });

    setFilteredSchools(filtered);
  };

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

          {/* Criteria Explanation Toggle */}
          <div className={`mb-8 transition-all duration-1000 ${
            isTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <button
              onClick={() => setShowCriteriaDetails(!showCriteriaDetails)}
              className={`
                bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg
                font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg
                flex items-center gap-2
              `}
            >
              <span>{showCriteriaDetails ? 'إخفاء' : 'تفاصيل'} معايير التقييم</span>
              <svg 
                className={`w-5 h-5 transition-transform duration-300 ${
                  showCriteriaDetails ? 'rotate-180' : 'rotate-0'
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Criteria Details */}
          {showCriteriaDetails && (
            <div className="mb-12 animate-slideDown">
              <CriteriaExplanation />
            </div>
          )}

          {/* School Filter */}
          <SchoolFilter 
            onFilterChange={handleFilterChange}
            schoolsData={filteredSchools}
          />

          {/* School Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8" ref={schoolsRef}>
            {filteredSchools.map((school, index) => {
              const isVisible = visibleSchools.has(index);
              
              return (
                <div
                  key={school.id}
                  className={`transition-all duration-700 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-12 scale-95'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <SchoolCard
                    school={school}
                    isVisible={isVisible}
                    onRatingSubmit={handleRatingSubmit}
                    isSubmitting={submitLoading}
                  />
                </div>
              );
            })}
          </div>

          {/* No results message */}
          {filteredSchools.length === 0 && data.schools.length > 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏫</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                لا توجد مدارس تطابق المعايير المحددة
              </h3>
              <p className="text-gray-600">جرب تغيير معايير البحث أو إعادة تعيين الفلاتر</p>
            </div>
          )}

          {/* Call to Action */}
          <div className={`text-center mt-12 transition-all duration-1000 ${
            visibleSchools.size === filteredSchools.length 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-primary mb-4">
                شارك في تطوير التعليم
              </h3>
              <p className="text-gray-700 mb-6">
                تقييمك يساعد المدارس على التحسن ويساعد الأهالي الآخرين في اتخاذ قرارات أفضل
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-secondary transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                  onClick={() => {
                    document.querySelector('#parents-reviews')?.scrollIntoView({ 
                      behavior: 'smooth' 
                    });
                  }}
                >
                  قيّم مدرستك الآن
                </button>
                <button 
                  className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-medium hover:bg-primary hover:text-white transition-all duration-300"
                  onClick={() => setShowCriteriaDetails(true)}
                >
                  تعرف على معايير التقييم
                </button>
              </div>

              {/* Statistics Summary */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-primary">
                    {data.schools.length}
                  </div>
                  <p className="text-sm text-gray-600">مدرسة مُقيّمة</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-secondary">
                    {(data.schools.reduce((sum, school) => sum + school.rating, 0) / data.schools.length).toFixed(1)}
                  </div>
                  <p className="text-sm text-gray-600">متوسط التقييم العام</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-green-600">
                    {data.schools.reduce((sum, school) => sum + school.votes, 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">إجمالي التقييمات</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}