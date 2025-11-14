import { useEffect } from 'react';

/**
 * Custom hook to manage page titles
 * @param {string} title - The title to set for the page
 */
const usePageTitle = (title) => {
  useEffect(() => {
    // Store the original title to restore it later if needed
    const originalTitle = document.title;
    
    // Set the new title with platform name
    const platformName = 'منصة رؤى التعليمية';
    document.title = title ? `${title} | ${platformName}` : platformName;
    
    // Update favicon
    const favicon = document.querySelector("link[rel~='icon']");
    if (favicon) {
      favicon.href = '/favicon-blue.svg';
    }
    
    // Cleanup function to restore original title when component unmounts
    return () => {
      document.title = originalTitle;
    };
  }, [title]);
};

export default usePageTitle;