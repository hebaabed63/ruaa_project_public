import React, { useState, useRef, useEffect } from "react";
import { useRatings } from "../index";
import person from "../../../../assets/images/person.png";

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

// Custom hook for staggered review animations
const useStaggeredReviews = (reviews, delay = 300) => {
  const [visibleReviews, setVisibleReviews] = useState(new Set());
  const [containerRef, isContainerVisible] = useFadeInAnimation(0.1);

  useEffect(() => {
    if (isContainerVisible && reviews.length > 0) {
      reviews.forEach((_, index) => {
        setTimeout(() => {
          setVisibleReviews(prev => new Set([...prev, index]));
        }, index * delay);
      });
    }
  }, [isContainerVisible, reviews.length, delay]);

  return [containerRef, visibleReviews];
};

// Star Rating Component
const StarRating = ({ rating, size = "w-4 h-4", interactive = false, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const currentRating = interactive ? hoverRating || rating : rating;

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`${size} transition-all duration-200 ${
            interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
          }`}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          onClick={() => interactive && onRatingChange && onRatingChange(star)}
          disabled={!interactive}
          aria-label={`${star} نجوم`}
        >
          <svg
            className={`w-full h-full transition-colors duration-200 ${
              star <= currentRating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

// Individual Review Card Component
const ReviewCard = ({ review, index, isVisible, onReviewInteraction }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
    onReviewInteraction && onReviewInteraction(review.id, 'expand');
  };

  const handleLike = (e) => {
    e.stopPropagation();
    onReviewInteraction && onReviewInteraction(review.id, 'like');
  };

  const formatTimestamp = (timestamp) => {
    const timeMap = {
      'الآن': '🟢 متصل الآن',
      'قبل يومين': '🔵 قبل يومين',
      'قبل ساعة': '🟡 قبل ساعة'
    };
    return timeMap[timestamp] || timestamp;
  };

  return (
    <div
      className={`
        bg-white rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl rounded-br-none 
        p-4 w-[450px] h-auto min-h-[110px] flex items-center justify-between 
        transition-all duration-500 cursor-pointer relative overflow-hidden
        ${review.marginClass}
        ${isVisible 
          ? 'opacity-100 translate-x-0 translate-y-0' 
          : 'opacity-0 translate-x-8 translate-y-4'
        }
        ${isHovered 
          ? 'shadow-lg scale-102 bg-gradient-to-r from-white to-blue-50' 
          : 'shadow-md'
        }
        ${isExpanded ? 'h-auto pb-6' : ''}
      `}
      style={{ 
        transitionDelay: `${index * 100}ms`,
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      role="article"
      aria-label={`تقييم من ${review.parentType}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
    >
      {/* Hover glow effect */}
      <div className={`
        absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 
        transition-opacity duration-300 pointer-events-none
        ${isHovered ? 'opacity-100' : 'opacity-0'}
      `}></div>

      {/* Avatar */}
      <div className={`
        bg-[#F1F4F8] rounded-full w-12 h-12 flex items-center justify-center
        transition-all duration-300 relative z-10
        ${isHovered ? 'scale-110 bg-primary/10' : ''}
      `}>
        <img 
          src={person} 
          alt={`صورة ${review.parentType}`} 
          className="w-8 h-8 transition-transform duration-300"
        />
        {/* Online status indicator */}
        {review.timestamp === 'الآن' && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center text-right w-[80%] relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-black font-medium">
            ولي أمر - {review.parentType}
            <span className="text-[#19191966] font-normal mr-2">
              {formatTimestamp(review.timestamp)}
            </span>
          </p>
          {/* <StarRating rating={review.rating} size="w-3 h-3" /> */}
        </div>

        {/* Comment */}
        <p className={`
          text-sm text-[#191919] font-light leading-relaxed 
          transition-all duration-300
          ${isExpanded ? 'line-clamp-none' : 'line-clamp-2'}
        `}>
          {review.comment}
        </p>

        {/* Expanded content */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 animate-fadeIn">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <button 
                  className="flex items-center gap-1 hover:text-primary transition-colors duration-200"
                  onClick={handleLike}
                  aria-label="إعجاب"
                >
                  👍 مفيد
                </button>
                <button 
                  className="flex items-center gap-1 hover:text-primary transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReviewInteraction && onReviewInteraction(review.id, 'reply');
                  }}
                  aria-label="رد"
                >
                  💬 رد
                </button>
              </div>
              <span>التقييم: {review.rating}/5</span>
            </div>
          </div>
        )}

        {/* Expand indicator */}
        <div className={`
          absolute -bottom-1 left-1/2 transform -translate-x-1/2
          w-8 h-1 bg-gray-300 rounded-full transition-all duration-300
          ${isHovered ? 'bg-primary w-12' : ''}
        `}></div>
      </div>
    </div>
  );
};

// Rating Form Component
const RatingForm = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    parentType: '',
    rating: 0,
    comment: '',
    schoolName: ''
  });
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0 || !formData.comment.trim()) return;
    
    await onSubmit(formData);
    setFormData({ parentType: '', rating: 0, comment: '', schoolName: '' });
    setIsFormVisible(false);
  };

  return (
    <div className="mt-8">
      <button
        onClick={() => setIsFormVisible(!isFormVisible)}
        className={`
          bg-primary w-[320px] font-medium text-white px-6 py-3 rounded-md 
          transition-all duration-300 transform
          ${isFormVisible 
            ? 'bg-secondary scale-105 shadow-lg' 
            : 'hover:bg-secondary hover:scale-105'
          }
        `}
      >
        {isFormVisible ? 'إخفاء النموذج' : 'قيّم مدرستك الآن'}
      </button>

      {isFormVisible && (
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto animate-slideDown">
          <h4 className="text-xl font-semibold text-primary mb-4">إضافة تقييمك</h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع ولي الأمر *
              </label>
              <select
                value={formData.parentType}
                onChange={(e) => setFormData({...formData, parentType: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">اختر...</option>
                <option value="أب">أب</option>
                <option value="أم">أم</option>
                <option value="ولي أمر">ولي أمر</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تقييمك *
              </label>
              <StarRating 
                rating={formData.rating}
                size="w-8 h-8"
                interactive={true}
                onRatingChange={(rating) => setFormData({...formData, rating})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تعليقك *
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({...formData, comment: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent h-24 resize-none"
                placeholder="شاركنا رأيك حول المدرسة..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || formData.rating === 0 || !formData.comment.trim()}
              className={`
                w-full py-3 rounded-md font-medium transition-all duration-300
                ${isSubmitting || formData.rating === 0 || !formData.comment.trim()
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-secondary transform hover:scale-105'
                }
              `}
            >
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default function ParentsRate({ data }) {
  const { submitRating, submitLoading } = useRatings();
  const [reviewsRef, visibleReviews] = useStaggeredReviews(data?.reviews || [], 200);
  const [ctaRef, isCtaVisible] = useFadeInAnimation(0.2);

  // Handle review interactions
  const handleReviewInteraction = (reviewId, action) => {
    console.log(`Review ${reviewId} - Action: ${action}`);
    // Here you could implement like, reply, or other interactive features
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
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
        <section className="bg-babyBlue py-16 px-4">
          <div className="max-w-6xl mx-auto animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded-3xl"></div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded w-2/3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="font-cairo bg-white text-black" dir="rtl">
      <section className="bg-babyBlue py-16 px-4" id="parents-reviews">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

          {/* Reviews Section */}
          <div className="p-6 space-y-6 order-2 md:order-1" ref={reviewsRef}>
            <h3 className={`
              text-2xl font-bold text-primary mb-2 transition-all duration-1000
              ${visibleReviews.size > 0 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
              }
            `}>
              جزء من تقييمات أولياء الأمور
            </h3>

            {/* Review Cards */}
            <div className="space-y-6">
              {data.reviews.map((review, index) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  index={index}
                  isVisible={visibleReviews.has(index)}
                  onReviewInteraction={handleReviewInteraction}
                />
              ))}
            </div>

          </div>

          {/* Call to Action Section */}
          <div 
            ref={ctaRef}
            className={`
              text-gray-700 leading-relaxed font-semibold space-y-6 md:order-2 
              text-2xl px-20 mt-20 text-center transition-all duration-1000
              ${isCtaVisible 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-8 scale-95'
              }
            `}
          >
            <div className="space-y-3">
              <p className="text-4xl">
                ساهم <span className="text-yallow">بتقييمك</span> الآن!
              </p>
              <p className="text-xl">
                {data.callToAction?.subtitle || "لتشجيع التطوير وبناء بيئة تعليمية أفضل."}
              </p>
            </div>

            <RatingForm 
              onSubmit={handleFormSubmit}
              isSubmitting={submitLoading}
            />
          </div>

        </div>
      </section>
    </div>
  );
}