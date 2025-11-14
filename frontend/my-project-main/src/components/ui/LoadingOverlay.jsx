import React from "react";
import "./LoadingOverlay.css"; // Import the CSS file

const LoadingOverlay = ({ message = "جاري التحميل..." }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        {/* Animated logo with alternating parts */}
        <div className="relative w-24 h-24">
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              animation: 'pulse-first-part 1.5s cubic-bezier(0.22, 0.61, 0.36, 1) infinite'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" className="w-full h-full">
              <path fill="#64c8cc" d="M771.39,379.64v-114.15c0-22.56,18.46-41.03,41.03-41.03h117.77v-121.63c0-2.45.16-4.86.42-7.24h-113.36c-95.04,0-172.79,77.76-172.79,172.79v111.26h126.94Z"/>
             </svg>
          </div>
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              animation: 'pulse-second-part 1.5s cubic-bezier(0.22, 0.61, 0.36, 1) infinite'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" className="w-full h-full">
              <path fill="#30a1db" d="M930.2,224.47v114.15c0,22.56-18.46,41.03-41.03,41.03h-117.77v121.63c0,2.45-.16,4.86-.42,7.24h113.36c95.04,0,172.79-77.76,172.79-172.79v-111.26h-126.94Z"/>
            </svg>
          </div>
        </div>
        
        {message && (
          <p className="mt-4 text-white text-lg font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;