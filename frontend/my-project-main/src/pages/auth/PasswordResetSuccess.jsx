import React from "react";
import { Link } from "react-router-dom";

// Page images
import PasswordSuccess from "../../assets/images/Password Reset Success.svg";

export default function PasswordResetSuccess() {
  return (
    <div
      className="min-h-screen w-screen bg-white flex flex-col items-center justify-center font-arabic px-4"
      dir="rtl"
    >
      {/* Main content centered */}
      <main className="flex flex-col items-center justify-center gap-8 max-w-md w-full">
        {/* Success image */}
        <img
          src={PasswordSuccess}
          alt="Password Reset Success"
          className="w-[250px] h-[250px] object-contain"
        />

        {/* Success message */}
        <div className="text-center">
          <p className="text-gray-700 font-cairo text-lg leading-relaxed mb-6">
            يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة
          </p>
          
          {/* Return to login button - مرئي وواضح */}
          <Link to="/login" className="w-full">
            <button
              type="button"
              className="w-full h-11 text-white text-base font-bold font-cairo rounded-full transition-all duration-300 ease-in-out mb-2 flex items-center justify-center"
              style={{
                backgroundColor: '#4682B4',
                border: '1px solid #4682B4'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#002147';
                e.target.style.borderColor = '#002147';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#4682B4';
                e.target.style.borderColor = '#4682B4';
              }}
            >
              العودة إلى تسجيل الدخول
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
