import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const EmailVerification = () => {
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("جاري التحقق من البريد الإلكتروني...");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get parameters from URL
    const searchParams = new URLSearchParams(location.search);
    const verificationStatus = searchParams.get("email_verification");
    const messageParam = searchParams.get("message");

    if (verificationStatus && messageParam) {
      if (verificationStatus === "success") {
        setStatus("success");
        setMessage(decodeURIComponent(messageParam));
        
        // Redirect to landing page after 5 seconds
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } else {
        setStatus("error");
        setMessage(decodeURIComponent(messageParam));
      }
    } else {
      // If no parameters, show error after a few seconds
      setTimeout(() => {
        setStatus("error");
        setMessage("رابط التحقق غير صحيح أو منتهي الصلاحية");
      }, 3000);
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            {status === "loading" && (
              <>
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100">
                  <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h2 className="mt-6 text-2xl font-bold text-gray-900">جاري التحقق من البريد الإلكتروني</h2>
                <p className="mt-2 text-gray-600">{message}</p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100">
                  <svg className="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="mt-6 text-2xl font-bold text-gray-900">تم التحقق بنجاح!</h2>
                <p className="mt-2 text-gray-600">{message}</p>
                <p className="mt-4 text-sm text-gray-500">سيتم تحويلك تلقائياً إلى الصفحة الرئيسية خلال ثوانٍ...</p>
              </>
            )}

            {status === "error" && (
              <>
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100">
                  <svg className="h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="mt-6 text-2xl font-bold text-gray-900">حدث خطأ في التحقق</h2>
                <p className="mt-2 text-gray-600">{message}</p>
                <div className="mt-6">
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    العودة لتسجيل الدخول
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;