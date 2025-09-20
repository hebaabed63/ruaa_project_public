import React, { useEffect } from "react";

// Page images
import Shape from "../assets/images/shape.svg";
import Points from "../assets/images/points.svg";
import LOGO from "../assets/images/LOGO.svg";
import UserPhoto from "../assets/images/user photo.svg";

// Layout wrapper for authentication pages
export default function AuthLayout({ children, expressiveImage, title }) {
  // Set document title
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  return (
    <div className=" font-cairo relative h-screen w-screen bg-white font-arabic overflow-hidden" dir="rtl">
      {/* Top section - 10% */}
      <div className="h-[10%] w-full relative">
        {/* Points on the left */}
        <img src={Points} alt="Points" className="absolute top-5 left-5 w-15 h-10" />
      </div>

      {/* Main page - flex layout */}
      <div className="flex flex-1 flex-row-reverse gap-0">
        {/* Left side */}
        <div className="w-1/2 flex flex-col relative overflow-hidden">
          <div className="flex-1 relative">
            <img src={Shape} alt="Shape" className="w-full h-full object-cover" />
            {/* Expressive image if provided */}
            {expressiveImage && (
              <img
                src={expressiveImage}
                alt="Expressive"
                className="absolute top-5 left-1/2 transform -translate-x-1/2 w-3/4 max-w-[550px] h-auto z-10"
              />
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="w-1/2 flex flex-col items-center justify-start overflow-y-auto pr-32 pl-0 pt-16">
          {/* User photo */}
          <img src={UserPhoto} alt="UserPhoto" className="w-14 h-14 rounded-full mb-1.5 mx-auto" />

          {/* Page title */}
          {title && (
            <h1 className="text-lg font-semibold text-[#434343] mb-3 text-center">{title}</h1>
          )}

          {/* Form/content area */}
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
