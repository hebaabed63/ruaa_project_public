/**
 * Animation Helper Utilities for Framer Motion
 * Ensures all animations have valid, non-negative values
 */

/**
 * Safe transition configuration for Framer Motion
 * Prevents iterationCount errors by ensuring valid values
 */
export const safeTransition = (config = {}) => {
  const {
    duration = 1,
    delay = 0,
    repeat = 0,
    repeatType = "loop",
    ease = "easeInOut",
    ...rest
  } = config;

  return {
    duration: Math.max(duration, 0.1), // Minimum duration
    delay: Math.max(delay, 0), // Non-negative delay
    repeat: repeat === Infinity ? Infinity : Math.max(repeat, 0), // Valid repeat
    repeatType: repeat === Infinity ? "loop" : repeatType, // Explicit repeatType
    ease,
    ...rest
  };
};

/**
 * Safe infinite animation preset
 */
export const infiniteAnimation = (duration = 2, delay = 0, ease = "easeInOut") => 
  safeTransition({
    duration,
    delay,
    repeat: Infinity,
    repeatType: "loop",
    ease
  });

/**
 * Safe finite animation preset
 */
export const finiteAnimation = (duration = 0.5, delay = 0, repeat = 0) =>
  safeTransition({
    duration,
    delay,
    repeat,
    repeatType: "loop"
  });

/**
 * Validates animation values before use
 */
export const validateAnimationConfig = (config) => {
  const warnings = [];
  
  if (config.duration && config.duration < 0) {
    warnings.push("Duration should be non-negative");
  }
  
  if (config.delay && config.delay < 0) {
    warnings.push("Delay should be non-negative");
  }
  
  if (config.repeat !== undefined && config.repeat !== Infinity && config.repeat < 0) {
    warnings.push("Repeat should be non-negative or Infinity");
  }
  
  if (warnings.length > 0) {
    console.warn("Animation config warnings:", warnings, config);
  }
  
  return warnings.length === 0;
};