import React, { useEffect } from "react";

// Page images
import Shape from "../../assets/images/shape.svg";
import Points from "../../assets/images/points.svg";
import LOGO from "../../assets/images/LOGO.svg";
import UserPhoto from "../../assets/images/user photo.svg";

// Layout wrapper for authentication pages
export default function AuthLayout({ children, expressiveImage, title }) {
  // Set document title
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  return (
    <div className="relative h-screen w-screen bg-white font-arabic overflow-hidden" dir="rtl">
      {/* Top section - 10% */}
      <div className="h-[10%] w-full relative">
        {/* Logo on the right */}
        <img src={LOGO} alt="Logo" className="absolute top-3 right-10 w-24 h-24" />
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
        <div className="w-1/2 flex flex-col items-center justify-start pt-20 overflow-y-auto">
          {/* User photo */}
          <img src={UserPhoto} alt="UserPhoto" className="w-28 h-28 rounded-full mb-8 mx-auto" />

          {/* Page title */}
          {title && (
            <h1 className="text-3xl font-semibold text-[#434343] mb-12 text-center">{title}</h1>
          )}

          {/* Form/content area */}
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
