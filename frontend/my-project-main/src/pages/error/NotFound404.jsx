import React from "react";

// Page images
import Points from "../../assets/images/colored-points.svg"; // Updated to use colored points like registration pages
import LOGO1 from "../../assets/images/LOGO1.svg";
import NotFound404 from "../../assets/images/404 error.svg";
import usePageTitle from "../../hooks/usePageTitle";

export default function NotFound() {
  // Set page title
  usePageTitle("الصفحة غير موجودة");
  return (
    <div
      className="h-screen w-screen bg-white flex flex-col overflow-hidden font-arabic"
      dir="rtl"
    >
      {/* Header with logo and points - Reduced size to match registration pages */}
      <header className="flex justify-between items-center px-6 py-2 flex-shrink-0 h-[5%] relative">
        {/* Colored points on the left - Moved down slightly to match registration pages */}
        <img src={Points} alt="Points" className="absolute top-5 left-5 w-15 h-10" />
        {/* Logo on the right - Reduced size to match registration pages */}
        <img src={LOGO1} alt="LOGO" className="absolute top-4 right-8 w-24 h-14" />
      </header>

      {/* Main content centered */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {/* 404 error image - Centered in the middle of the page and slightly larger */}
        <img
          src={NotFound404}
          alt="not found error"
          className="w-[600px] h-[400px] object-contain"
        />
      </main>
    </div>
  );
}