import React from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";

// Page images
import PasswordSuccess from "../../assets/images/Password Reset Success.svg";
import usePageTitle from "../../hooks/usePageTitle";

export default function PasswordResetSuccess() {
  // Set page title
  usePageTitle("تم تعيين كلمة المرور بنجاح");
  return (
    <AuthLayout
      expressiveImage={PasswordSuccess}
      title="تم تعيين كلمة المرور بنجاح"
      userPhotoClassName="mt-15" // Reduced from mt-20 to move content higher
      titleClassName="mb-4" // Reduced from mb-8 to move content higher
    >
      <div className="w-full max-w-md">
        {/* Success message */}
        <div className="text-center mb-8">
          <p className="text-gray-700 font-cairo text-lg leading-relaxed">
            يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة
          </p>
        </div>
        
        {/* Return to login button */}
        <Link to="/login" className="w-full block">
          <button
            type="button"
            className="w-full h-11 text-white text-base font-bold font-cairo rounded-full transition-all duration-300 ease-in-out flex items-center justify-center"
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
    </AuthLayout>
  );
}