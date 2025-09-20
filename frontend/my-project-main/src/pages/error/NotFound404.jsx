import React from "react";
import { Link } from "react-router-dom";

// Page images
import Points from "../../assets/images/points.svg";
import LOGO from "../../assets/images/LOGO.svg";
import NotFound404 from "../../assets/images/404 error.svg";

export default function NotFound() {
  return (
    <div
      className="h-screen w-screen bg-white flex flex-col overflow-hidden font-arabic "
      dir="rtl"
    >
      {/* Header with logo and points */}
      <header className="flex justify-between items-center px-12 py-4 flex-shrink-0">
        {/* Logo on the right */}
        <img src={LOGO} alt="LOGO" className="w-24 h-24 mt-10" />
        {/* Points on the left */}
        <img src={Points} alt="Points" className="w-16 h-12 mr-5 mt-10" />
      </header>

      {/* Main content centered */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {/* Success image */}
        <img
          src={NotFound404}
          alt="not found error"
          className="w-[900px] h-[500px] object-contain"
        />

        {/* Login button */}
        <Link to="/login">
          <button
            type="button"
            className="w-[483px] h-[42px] font-cairo font-bold bg-primary text-white text-[18px] rounded-full hover:bg-secondary transition duration-300 ease-in-out shadow-md tracking-wide mb-9"
          >
            الصفحة الرئيسية 
          </button>
        </Link>
      </main>
    </div>
  );
}
