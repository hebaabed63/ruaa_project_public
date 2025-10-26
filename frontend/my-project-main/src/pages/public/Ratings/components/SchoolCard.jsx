import React, { useState, useEffect, useRef } from "react";
import staryallow from "../../../../assets/icons/staryallow.svg";
import school from "../../../../assets/images/School1.jpg";

// Custom hook for progress bar animation
const useProgressAnimation = (targetPercentage, isVisible, delay = 0) => {
  const [currentPercentage, setCurrentPercentage] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      const duration = 1500;
      const steps = 60;
      const increment = targetPercentage / steps;
      let current = 0;

      const progressTimer = setInterval(() => {
        current += increment;
        if (current >= targetPercentage) {
          setCurrentPercentage(targetPercentage);
          clearInterval(progressTimer);
        } else {
          setCurrentPercentage(Math.round(current));
        }
      }, duration / steps);

      return () => clearInterval(progressTimer);
    }, delay);

    return () => clearTimeout(timer);
  }, [targetPercentage, isVisible, delay]);

  return currentPercentage;
};

// Star Rating Component with Animation
const AnimatedStarRating = ({ rating, maxStars = 5, size = "w-4 h-4", isVisible = false }) => {
  const [animatedRating, setAnimatedRating] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimatedRating(rating);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, rating]);

  return (
    <div className="flex" role="img" aria-label={`${rating} من أصل ${maxStars} نجوم`}>
      {[...Array(maxStars)].map((_, i) => (
        <div
          key={i}
          className={`
            ${size} transition-all duration-300 transform
            ${i < Math.floor(animatedRating) ? 'scale-100 opacity-100' : 'scale-75 opacity-30'}
            ${isVisible ? 'animate-bounce' : ''}
          `}
          style={{ 
            animationDelay: `${i * 100}ms`,
            animationDuration: '0.6s',
            animationFillMode: 'both'
          }}
        >
          <img
            src={staryallow}
            alt={i < Math.floor(animatedRating) ? "نجمة ملونة" : "نجمة فارغة"}
            className="w-full h-full"
          />
        </div>
      ))}
    </div>
  );
};

// Individual Criteria Progress Bar
const CriteriaProgressBar = ({ label, percentage, isVisible, delay = 0 }) => {
  const animatedPercentage = useProgressAnimation(percentage, isVisible, delay);
  const [isHovered, setIsHovered] = useState(false);

  const getColorByPercentage = (percentage) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 80) return 'bg-green-400';
    if (percentage >= 70) return 'bg-yellow-500';
    if (percentage >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getGradeByPercentage = (percentage) => {
    if (percentage >= 95) return 'ممتاز';
    if (percentage >= 85) return 'جيد جداً';
    if (percentage >= 75) return 'جيد';
    if (percentage >= 65) return 'مقبول';
    return 'يحتاج تحسين';
  };

  return (
    <div 
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-1">
        <p className={`
          text-xs text-[#A3A3A3] font-light transition-all duration-300
          ${isHovered ? 'text-gray-700 font-medium' : ''}
        `}>
          {label}
        </p>
        <span className={`
          text-xs font-medium transition-all duration-300
          ${isHovered ? 'text-primary scale-110' : 'text-gray-500'}
        `}>
          {animatedPercentage}%
        </span>
      </div>
      
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`
              h-2 rounded-full transition-all duration-1000 ease-out relative
              ${getColorByPercentage(animatedPercentage)}
              ${isHovered ? 'shadow-lg' : ''}
            `}
            style={{ width: `${animatedPercentage}%` }}
          >
            {/* Shine effect */}
            <div className={`
              absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30
              transform -skew-x-12 transition-transform duration-1000
              ${isVisible ? 'translate-x-full' : '-translate-x-full'}
            `}></div>
          </div>
        </div>

        {/* Tooltip */}
        {isHovered && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10">
            <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              {getGradeByPercentage(animatedPercentage)} ({animatedPercentage}%)
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-gray-800"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Interactive Rating Button Component
const RatingInteraction = ({ school, onRatingSubmit, isSubmitting }) => {
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmitRating = async () => {
    if (userRating === 0) return;
    
    try {
      await onRatingSubmit({
        schoolId: school.id,
        schoolName: school.name,
        rating: userRating,
        timestamp: new Date().toISOString()
      });
      setShowRatingForm(false);
      setUserRating(0);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <div className="mt-4">
      {!showRatingForm ? (
        <button
          onClick={() => setShowRatingForm(true)}
          className="w-full py-2 px-4 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
        >
          قيّم هذه المدرسة
        </button>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h5 className="font-semibold text-gray-800">قيّم {school.name}</h5>
          
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="w-8 h-8 transition-transform duration-200 hover:scale-110"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setUserRating(star)}
              >
                <img
                  src={staryallow}
                  alt={`${star} نجوم`}
                  className={`w-full h-full transition-all duration-200 ${
                    star <= (hoverRating || userRating) 
                      ? 'opacity-100 scale-100' 
                      : 'opacity-30 scale-90'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmitRating}
              disabled={userRating === 0 || isSubmitting}
              className={`
                flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300
                ${userRating === 0 || isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-secondary transform hover:scale-105'
                }
              `}
            >
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال'}
            </button>
            <button
              onClick={() => {
                setShowRatingForm(false);
                setUserRating(0);
                setHoverRating(0);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function SchoolCard({ 
  school, 
  isVisible = false, 
  onRatingSubmit, 
  isSubmitting = false 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const cardRef = useRef(null);

  // Destructure school data with defaults
  const {
    name = "مدرسة غير معروفة",
    description = "لا يوجد وصف متاح",
    rating = 0,
    votes = 0,
    imageUrl = school,
    criteria = []
  } = school || {};

  // Calculate overall performance
  const averagePerformance = criteria.length > 0 
    ? criteria.reduce((sum, criterion) => sum + criterion.percentage, 0) / criteria.length 
    : 0;

  const getPerformanceGrade = (average) => {
    if (average >= 90) return { grade: 'ممتاز', color: 'text-green-600', bg: 'bg-green-100' };
    if (average >= 80) return { grade: 'جيد جداً', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (average >= 70) return { grade: 'جيد', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { grade: 'يحتاج تحسين', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const performanceInfo = getPerformanceGrade(averagePerformance);

  return (
    <div 
      ref={cardRef}
      dir="rtl" 
      className={`
        transform transition-all duration-500 cursor-pointer
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${isHovered ? 'scale-102' : 'scale-100'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`بطاقة مدرسة ${name}`}
      tabIndex={0}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      
      {/* School Title and Description */}
      <div className={`
        text-center mb-4 transition-all duration-300
        ${isHovered ? 'transform -translate-y-1' : ''}
      `}>
        <h3 className={`
          text-xl font-semibold text-black mb-2 transition-all duration-300
          ${isHovered ? 'text-primary scale-105' : ''}
        `}>
          {name}
        </h3>
        
        <div className="relative">
          <p className={`
            text-sm text-black font-normal transition-all duration-300
            ${showFullDescription ? '' : 'line-clamp-2'}
            ${isHovered ? 'text-gray-700' : ''}
          `}>
            {description}
          </p>
          
          {description.length > 100 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFullDescription(!showFullDescription);
              }}
              className="text-primary hover:text-secondary text-xs mt-1 transition-colors duration-300"
            >
              {showFullDescription ? 'أقل' : 'المزيد...'}
            </button>
          )}
        </div>

        {/* Performance Badge */}
        <div className={`
          inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2
          ${performanceInfo.bg} ${performanceInfo.color}
          transition-all duration-300 transform
          ${isHovered ? 'scale-110' : 'scale-100'}
        `}>
          {performanceInfo.grade} ({Math.round(averagePerformance)}%)
        </div>
      </div>

      {/* Main Card Content */}
      <div className={`
        bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6 items-start w-full
        transition-all duration-500 relative overflow-hidden
        ${isHovered 
          ? 'shadow-2xl bg-gradient-to-br from-white to-gray-50' 
          : ''
        }
      `}>

        {/* Hover Glow Effect */}
        <div className={`
          absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 
          transition-opacity duration-500 pointer-events-none
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}></div>

        {/* Image and Rating Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center space-y-4 relative z-10">
          
          {/* School Image */}
          <div className="relative w-full h-32 rounded-lg overflow-hidden group">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="text-gray-400">🏫</div>
              </div>
            )}
            <img
              src={imageUrl}
              alt={`صورة ${name}`}
              className={`
                w-full h-full object-cover transition-all duration-500
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                ${isHovered ? 'scale-110' : 'scale-100'}
              `}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
            
            {/* Image overlay on hover */}
            <div className={`
              absolute inset-0 bg-black transition-opacity duration-300 flex items-center justify-center
              ${isHovered ? 'opacity-30' : 'opacity-0'}
            `}>
              <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                عرض التفاصيل
              </span>
            </div>
          </div>

          {/* Rating Display */}
          <div className="flex justify-center items-center w-full gap-4">
            <div className="flex flex-col items-center">
              <span className={`
                text-lg font-normal text-black transition-all duration-300
                ${isHovered ? 'text-primary scale-110' : ''}
              `}>
                {votes.toLocaleString()}
              </span>
              <AnimatedStarRating 
                rating={rating} 
                isVisible={isVisible}
              />
              <span className="text-xs text-gray-500 mt-1">تقييم</span>
            </div>
            
            <div className={`
              text-6xl font-bold transition-all duration-500 transform
              ${isHovered ? 'text-primary scale-110' : 'text-gray-800'}
            `}>
              {rating}
            </div>
          </div>
        </div>

        {/* Criteria Section */}
        <div className="w-full md:w-1/2 space-y-4 mt-2 relative z-10">
          
          
          {criteria.map((criterion, index) => (
            <CriteriaProgressBar
              key={index}
              label={criterion.label}
              percentage={criterion.percentage}
              isVisible={isVisible}
              delay={index * 200}
            />
          ))}

          
          
        </div>

        {/* Success Indicator */}
        <div className={`
          absolute top-2 right-2 w-3 h-3 rounded-full transition-all duration-500
          ${isVisible ? 'bg-green-500 scale-100' : 'bg-transparent scale-0'}
        `}>
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
        </div>

      </div>
    </div>
  );
}