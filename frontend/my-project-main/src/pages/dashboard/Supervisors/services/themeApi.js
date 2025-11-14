/**
 * Theme API Service
 * This service provides mock implementations for theme management
 * that can easily be replaced with real API calls
 */

// Mock delay to simulate network requests
const simulateDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Load theme from localStorage or use default
const loadTheme = () => {
  try {
    const saved = localStorage.getItem('parentsUI_settings');
    if (saved) {
      const settings = JSON.parse(saved);
      return settings.theme || 'light';
    }
    return 'light';
  } catch (error) {
    console.warn('Failed to load theme from localStorage, using default:', error);
    return 'light';
  }
};

// Save theme to localStorage
const saveTheme = (theme) => {
  try {
    const saved = localStorage.getItem('parentsUI_settings');
    let settings = {};
    
    if (saved) {
      settings = JSON.parse(saved);
    }
    
    settings.theme = theme;
    localStorage.setItem('parentsUI_settings', JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
};

/**
 * Get current theme
 * @returns {Promise<string>} Current theme ('light' or 'dark')
 */
export const getCurrentTheme = async () => {
  await simulateDelay(100);
  return loadTheme();
};

/**
 * Set theme
 * @param {string} theme - Theme to set ('light' or 'dark')
 * @returns {Promise<Object>} Success response
 */
export const setTheme = async (theme) => {
  await simulateDelay(200);
  saveTheme(theme);
  
  // Apply theme to document
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
  
  return { success: true, theme, message: `Theme set to ${theme}` };
};

/**
 * Toggle theme
 * @returns {Promise<Object>} Success response with new theme
 */
export const toggleTheme = async () => {
  await simulateDelay(200);
  const currentTheme = loadTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  saveTheme(newTheme);
  
  // Apply theme to document
  document.documentElement.setAttribute('data-theme', newTheme);
  document.documentElement.classList.toggle('dark', newTheme === 'dark');
  
  return { success: true, theme: newTheme, message: `Theme toggled to ${newTheme}` };
};

export default {
  getCurrentTheme,
  setTheme,
  toggleTheme
};