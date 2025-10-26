import React, { useState, useEffect, useRef } from "react";

// Custom hook for animated counter
const useAnimatedCounter = (endValue, duration = 2000, startAnimation = false) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!startAnimation || isAnimating) return;

    setIsAnimating(true);
    const startValue = 0;
    const increment = endValue / (duration / 16); // 60fps
    let current = startValue;

    const timer = setInterval(() => {
      current += increment;
      if (current >= endValue) {
        setCurrentValue(endValue);
        clearInterval(timer);
        setIsAnimating(false);
      } else {
        setCurrentValue(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [endValue, duration, startAnimation, isAnimating]);

  return currentValue;
};

// Custom hook for intersection observer
const useIntersectionObserver = (threshold = 0.5, rootMargin = '0px') => {
  const [isVisible, setIsVisible] = useState(false);
  const [element, setElement] = useState(null);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [element, threshold, rootMargin, isVisible]);

  return [isVisible, setElement];
};

// Custom hook for animated progress circle
const useAnimatedProgress = (targetProgress, startAnimation = false, duration = 2000) => {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    const increment = targetProgress / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetProgress) {
        setCurrentProgress(targetProgress);
        clearInterval(timer);
      } else {
        setCurrentProgress(current);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [targetProgress, startAnimation, duration]);

  return currentProgress;
};

export default function StatCard({
  icon,
  value,
  description,
  height = "h-[250px]",
  dashArray,
  dashOffset,
  rotation,
  animationDelay = 0,
  progressPercentage = 75,
  category = "default",
  isClickable = false,
  onClick = null,
  showAnimation = true
}) {
  // State management
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Animation hooks
  const [isVisible, elementRef] = useIntersectionObserver(0.3);
  const shouldStartAnimation = isVisible && showAnimation && !hasAnimated;
  const animatedValue = useAnimatedCounter(
    typeof value === 'number' ? value : parseInt(value) || 0, 
    2000 + animationDelay, 
    shouldStartAnimation
  );
  const animatedProgress = useAnimatedProgress(
    progressPercentage, 
    shouldStartAnimation, 
    2000 + animationDelay
  );

  // Effect to track animation completion
  useEffect(() => {
    if (shouldStartAnimation) {
      setHasAnimated(true);
    }
  }, [shouldStartAnimation]);

  // Calculate circle properties for animated progress
  const radius = 40; // 40% of 50 (center position)
  const circumference = 2 * Math.PI * radius;
  const currentDashOffset = circumference - (animatedProgress / 100) * circumference;

  // Dynamic styling based on category
  const getCategoryStyles = () => {
    switch (category) {
      case 'primary':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          accentColor: 'bg-blue-500',
          strokeColor: '#3B82F6'
        };
      case 'success':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          accentColor: 'bg-green-500',
          strokeColor: '#10B981'
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          accentColor: 'bg-yellow-500',
          strokeColor: '#F59E0B'
        };
      case 'danger':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          accentColor: 'bg-red-500',
          strokeColor: '#EF4444'
        };
      default:
        return {
          bgColor: 'bg-[#F2F3F0B5]',
          borderColor: 'border-gray-200',
          accentColor: 'bg-primary',
          strokeColor: '#4CAF50'
        };
    }
  };

  const styles = getCategoryStyles();

  // Event handlers
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  const handleMouseDown = () => {
    if (isClickable) setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleClick = () => {
    if (isClickable && onClick) {
      onClick({ value, description, category });
    }
  };

  const handleKeyPress = (e) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      ref={elementRef}
      className={`
        relative rounded-xl shadow-md p-6 flex flex-col justify-center items-center text-center w-[340px] ${height} mt-10
        transform transition-all duration-500 ease-out
        ${styles.bgColor}
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
        ${isHovered ? 'shadow-xl scale-105 -translate-y-2' : 'shadow-md'}
        ${isPressed ? 'scale-95' : ''}
        ${isClickable ? 'cursor-pointer hover:shadow-2xl' : ''}
        ${isClickable ? 'focus:outline-none focus:ring-4 focus:ring-primary/20' : ''}
      `}
      style={{ 
        transitionDelay: `${animationDelay}ms`,
        border: isHovered ? `2px solid ${styles.strokeColor}20` : 'none'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={isClickable ? 0 : -1}
      role={isClickable ? "button" : "article"}
      aria-label={isClickable ? `انقر لعرض تفاصيل ${description}` : `إحصائية ${description}`}
    >
      {/* Animated accent line */}
      <div 
        className={`
          absolute top-4 right-4 w-1 rounded-full transition-all duration-500
          ${styles.accentColor}
          ${isVisible ? 'h-[80%] opacity-100' : 'h-0 opacity-0'}
        `}
        style={{ transitionDelay: `${animationDelay + 300}ms` }}
      />

      {/* Icon with animation */}
      <div 
        className={`
          absolute top-4 left-4 transition-all duration-500
          ${isVisible ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-2 opacity-0 -rotate-12'}
          ${isHovered ? 'scale-110' : 'scale-100'}
        `}
        style={{ transitionDelay: `${animationDelay + 200}ms` }}
      >
        <img 
          src={icon} 
          alt="أيقونة الإحصائية" 
          className="w-10 h-10 transition-transform duration-300" 
          loading="lazy" 
        />
      </div>

      {/* Animated progress circle */}
      <div 
        className={`
          relative w-24 h-24 mb-4 transition-all duration-700
          ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
          ${isHovered ? 'scale-110' : 'scale-100'}
        `}
        style={{ transitionDelay: `${animationDelay + 400}ms` }}
      >
        {/* Background circle */}
        <svg className="absolute top-0 left-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="40%"
            stroke="#E5E7EB"
            strokeWidth="6"
            fill="none"
            className="opacity-30"
          />
        </svg>
        
        {/* Animated progress circle */}
        <svg className="absolute top-0 left-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="40%"
            stroke={styles.strokeColor}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={showAnimation ? currentDashOffset : dashOffset || circumference * 0.25}
            strokeLinecap="round"
            className="transition-all duration-100 ease-out"
            style={{
              filter: isHovered ? 'drop-shadow(0 0 8px rgba(74, 222, 128, 0.4))' : 'none'
            }}
          />
        </svg>
        
        {/* Animated value display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className={`
              text-2xl font-extrabold text-black transition-all duration-500
              ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
              ${isHovered ? 'scale-110 text-primary' : ''}
            `}
            style={{ transitionDelay: `${animationDelay + 600}ms` }}
          >
            {showAnimation ? (
              <span className="tabular-nums">
                {typeof value === 'number' || !isNaN(parseInt(value)) 
                  ? animatedValue.toLocaleString('ar-SA')
                  : value
                }
              </span>
            ) : (
              value
            )}
          </div>
        </div>

        {/* Pulse effect when hovering */}
        {isHovered && (
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
        )}
      </div>

      {/* Description with typing effect */}
      <div 
        className={`
          text-sm font-cairo font-light text-black leading-relaxed transition-all duration-700
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          ${isHovered ? 'text-gray-800 font-medium' : ''}
        `}
        style={{ transitionDelay: `${animationDelay + 800}ms` }}
      >
        <p className="transition-colors duration-300">
          {description}
        </p>
      </div>

      {/* Interactive indicator */}
      {isClickable && (
        <div 
          className={`
            absolute bottom-2 right-2 w-3 h-3 rounded-full transition-all duration-300
            ${styles.accentColor}
            ${isHovered ? 'scale-125 shadow-lg' : 'scale-100'}
            ${isVisible ? 'opacity-70' : 'opacity-0'}
          `}
          style={{ transitionDelay: `${animationDelay + 1000}ms` }}
        />
      )}

      {/* Loading overlay for animation */}
      {!isVisible && showAnimation && (
        <div className="absolute inset-0 bg-white/50 rounded-xl flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}