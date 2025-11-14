import React, { useEffect } from "react";

// Page images
import Shape from "../assets/images/shape.svg";
import Points from "../assets/images/colored-points.svg"; // Updated to use the new colored points
import UserPhoto from "../assets/images/user photo.svg";
import Logo from "../assets/images/LOGO1.svg";

// Layout wrapper for authentication pages
export default function AuthLayout({ children, expressiveImage, title, userPhotoClassName = "", titleClassName = "" }) {
  // Set document title
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  return (
    <div className="relative h-screen w-screen bg-white overflow-hidden animate-fadeIn" dir="rtl">
      {/* Top section - Increased from 3% */}
      <div className="h-[5%] w-full relative">
        {/* Colored points on the left - Moved down slightly */}
        <img src={Points} alt="Points" className="absolute top-5 left-5 w-15 h-10" />
        
        {/* New Logo on the right - Increased size and moved slightly to the left */}
        <img src={Logo} alt="Logo" className="absolute top-4 right-8 w-24 h-14" />
      </div>

      {/* Main page - flex layout */}
      <div className="flex flex-1 flex-row-reverse gap-0 mt-[-4%]"> {/* Increased from -3% to -4% to move content higher */}
        {/* Left side */}
        <div className="w-1/2 flex flex-col relative overflow-hidden">
          <div className="flex-1 relative flex items-center justify-center">
            <img
              src={Shape} alt="Shape" className="w-full h-full object-cover" />
            {/* Expressive image if provided */}
            {expressiveImage && (
              <img
                src={expressiveImage}
                alt="Expressive"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 max-w-[550px] h-auto z-10"
              />
            )}
          </div>
        </div>

        {/* Right side - Center content vertically */}
        <div className="w-1/2 flex flex-col items-center justify-center overflow-y-auto pr-32 pl-0">
          {/* User photo */}
          <img src={UserPhoto} alt="UserPhoto" className={`w-12 h-12 rounded-full mb-1 mx-auto ${userPhotoClassName}`} />

          {/* Page title */}
          {title && (
            <h1 className={`text-base font-medium text-[#434343] mb-2 text-center ${titleClassName}`}>
              {title}
            </h1>
          )}

          {/* Form/content area - Centered */}
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}