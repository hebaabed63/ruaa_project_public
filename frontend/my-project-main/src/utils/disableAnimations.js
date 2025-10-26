// Utility to temporarily disable problematic infinite animations
// This prevents the "iterationCount must be non-negative" error

export const disableInfiniteAnimations = true;

// Safe animation transition that prevents infinite animation errors
export const safeInfiniteTransition = (config = {}) => {
  if (disableInfiniteAnimations) {
    // Return a static animation without repeat
    return {
      duration: 0.1,
      ease: "linear"
    };
  }
  
  return {
    ...config,
    repeatType: "loop"
  };
};

// Safe animate props that disable infinite animations
export const safeInfiniteAnimate = (animateProps, fallback = {}) => {
  if (disableInfiniteAnimations) {
    return fallback;
  }
  
  return animateProps;
};