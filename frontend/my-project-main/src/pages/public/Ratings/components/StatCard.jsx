import React, { useState, useEffect } from "react";

// Custom hook for animated counter
const useAnimatedCounter = (endValue, duration = 2000, valueType = 'number', startAnimation = false) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    let startTime = null;
    const startValue = 0;
    const targetValue = typeof endValue === 'number' ? endValue : parseInt(endValue);

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.round(startValue + (targetValue - startValue) * easeOutQuart);
      
      setCurrentValue(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [endValue, duration, startAnimation, valueType]);

  const formatValue = () => {
    if (valueType === 'percentage') {
      return `${currentValue}%`;
    }
    return currentValue.toLocaleString();
  };

  return formatValue();
};

// Custom hook for circle animation
const useCircleAnimation = (isVisible, dashArray, dashOffset, delay = 0) => {
  const [currentOffset, setCurrentOffset] = useState(dashArray);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      setCurrentOffset(dashOffset);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, dashOffset, delay]);

  return currentOffset;
};

export default function StatCard({
  icon,
  value,
  valueType = 'number',
  description,
  animationConfig = {},
  isVisible = false,
  index = 0
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Animation configurations with defaults
  const {
    height = "h-[250px]",
    dashArray = "200",
    dashOffset = "0",
    rotation = "0"
  } = animationConfig;

  // Animated counter
  const animatedValue = useAnimatedCounter(
    value, 
    2000 + (index * 200), // Stagger the counter animations
    valueType,
    isVisible
  );

  // Animated circle
  const animatedOffset = useCircleAnimation(
    isVisible, 
    dashArray, 
    dashOffset, 
    500 + (index * 200) // Delay circle animation after counter starts
  );

  // Handle tooltip interactions
  const handleMouseEnter = () => {
    setIsHovered(true);
    setTimeout(() => setShowTooltip(true), 300);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowTooltip(false);
  };

  // Get percentage for progress circle
  const getProgressPercentage = () => {
    if (valueType === 'percentage') return value;
    
    // For other values, calculate a meaningful percentage
    const maxValues = {
      building: 50, // Max schools we might evaluate
      transparency: 2000, // Max reviews
      improvement: 100 // Already percentage
    };
    
    const maxValue = maxValues[Object.keys(maxValues).find(key => 
      description.includes(key) || String(value).includes(key)
    )] || 100;
    
    return Math.min((value / maxValue) * 100, 100);
  };

  const progressPercentage = getProgressPercentage();

  return (
    <div
      className={`
        relative bg-[#F2F3F0B5] rounded-xl shadow-md p-6 flex flex-col justify-center items-center text-center w-[340px] ${height} mt-10
        transform transition-all duration-500 cursor-pointer
        ${isHovered ? 'scale-105 shadow-xl bg-gradient-to-br from-[#F2F3F0B5] to-[#E8F5E8]' : 'hover:scale-102'}
        ${isVisible ? 'animate-pulse-once' : ''}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="article"
      aria-label={`إحصائية: ${animatedValue}`}
      tabIndex={0}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {/* Side indicator bar with animation */}
      <div className={`
        absolute top-4 right-4 w-1 bg-primary rounded-full transition-all duration-700
        ${isVisible ? 'h-[80%] opacity-100' : 'h-0 opacity-0'}
      `}></div>

      {/* Icon with hover effect */}
      <div className="absolute top-4 left-4 transition-transform duration-300">
        <div className={`
          p-2 rounded-full transition-all duration-300
          ${isHovered ? 'bg-primary/20 scale-110' : 'bg-transparent'}
        `}>
          <img 
            src={icon} 
            alt="أيقونة الإحصائية" 
            className={`w-10 h-10 transition-all duration-300 ${
              isHovered ? 'filter brightness-110' : ''
            }`} 
            loading="lazy" 
          />
        </div>
      </div>

      {/* Progress Circle with Animation */}
      <div className={`
        relative w-24 h-24 mb-4 transition-all duration-500 
        ${isHovered ? 'scale-110' : ''}
      `}>
        {/* Background circle */}
        <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="40%"
            stroke="#E5E7EB"
            strokeWidth="8"
            fill="none"
          />
        </svg>
        
        {/* Progress circle */}
        <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="40%"
            stroke={isHovered ? "#16A34A" : "#4CAF50"}
            strokeWidth="8"
            fill="none"
            strokeDasharray={dashArray}
            strokeDashoffset={animatedOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center'
            }}
          />
        </svg>
        
        {/* Animated value display */}
        <div className={`
          absolute inset-0 flex items-center justify-center text-xl font-extrabold text-black
          transition-all duration-300 ${isHovered ? 'scale-110 text-primary' : ''}
        `}>
          {animatedValue}
        </div>

        {/* Progress percentage indicator */}
        <div className={`
          absolute -bottom-2 left-1/2 transform -translate-x-1/2 
          text-xs font-medium text-gray-600 transition-opacity duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}>
          {Math.round(progressPercentage)}%
        </div>
      </div>

      {/* Description with enhanced typography */}
      <div className={`
        text-sm font-cairo font-light text-black leading-relaxed transition-all duration-300
        ${isHovered ? 'text-gray-800' : ''}
      `}>
        <p className={`transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
          {description}
        </p>
      </div>

      {/* Interactive tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20">
          <div className="bg-gray-800 text-white text-xs rounded py-2 px-3 whitespace-nowrap">
            <div className="font-semibold mb-1">تفاصيل الإحصائية</div>
            <div>القيمة الحالية: {animatedValue}</div>
            <div>معدل الإنجاز: {Math.round(progressPercentage)}%</div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      )}

      {/* Hover glow effect */}
      <div className={`
        absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300
        ${isHovered ? 'opacity-20 bg-gradient-to-r from-primary to-secondary' : 'opacity-0'}
      `}></div>

      {/* Success indicator when animation completes */}
      <div className={`
        absolute top-2 right-2 w-3 h-3 rounded-full transition-all duration-500
        ${isVisible && animatedValue !== '0' ? 'bg-green-500 scale-100' : 'bg-transparent scale-0'}
      `}>
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
      </div>
    </div>
  );
}