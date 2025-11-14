import React, { useEffect, useRef, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { loginWithGoogleCredential } from '../../services/authService';
import { showAlert } from '../../utils/SweetAlert';

// Google Icon Component
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 533.5 544.3">
    <path fill="#4285F4" d="M533.5 278.4c0-17.6-1.4-35.2-4.3-52H272v98.9h146.9c-6.4 34.5-25.5 63.8-54.6 83.3v68h88.3c51.8-47.7 81.9-118.2 81.9-198.2z"/>
    <path fill="#34A853" d="M272 544.3c73.7 0 135.5-24.3 180.7-66.1l-88.3-68c-24.5 16.5-55.7 26.3-92.4 26.3-71 0-131-47.8-152.5-112.1H31.6v70.5C76.8 491.2 167.6 544.3 272 544.3z"/>
    <path fill="#FBBC05" d="M119.5 325.4c-7.2-21.4-11.3-44.1-11.3-67.4s4.1-46 11.3-67.4V120H31.6C11.3 166.5 0 218.7 0 278s11.3 111.5 31.6 158l87.9-70.6z"/>
    <path fill="#EA4335" d="M272 109.7c38.4 0 72.7 13.2 99.9 39.1l74.9-74.9C407.3 24.3 345.5 0 272 0 167.6 0 76.8 53.1 31.6 145.7l87.9 70.5c21.5-64.3 81.5-112 152.5-112z"/>
  </svg>
);

const GoogleSignInButton = ({ 
  text = "تسجيل الدخول باستخدام Google",
  onSuccess = null,
  onError = null,
  className = "",
  buttonClassName = ""
}) => {
  const googleButtonRef = useRef(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // تحقق من وجود Google Client ID
    if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
      console.warn('REACT_APP_GOOGLE_CLIENT_ID not configured');
      setShowFallback(true);
      return;
    }

    // تحميل Google Identity Services script
    const loadGoogleScript = () => {
      if (window.google) {
        initializeGoogleSignIn();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      script.onerror = () => {
        console.error('Failed to load Google Identity Services');
        setShowFallback(true);
      };
      document.head.appendChild(script);
      
      // Timeout fallback
      setTimeout(() => {
        if (!window.google) {
          setShowFallback(true);
        }
      }, 5000);
    };

    const initializeGoogleSignIn = () => {
      if (!window.google) {
        setShowFallback(true);
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // عرض الزر المخصص
        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(
            googleButtonRef.current,
            {
              theme: 'outline',
              size: 'large',
              width: '100%',
              text: 'signin_with',
              shape: 'rectangular',
              logo_alignment: 'left'
            }
          );
        }
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
        setShowFallback(true);
      }
    };

    loadGoogleScript();
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      if (!response.credential) {
        throw new Error('لم يتم الحصول على بيانات الاعتماد من Google');
      }

      // إرسال التوكن إلى Backend
      const data = await loginWithGoogleCredential(response.credential);

      if (data.success) {
        const { user, token, role } = data.data;

        // تسجيل الدخول في السياق
        login(token, role, user);

        // عرض رسالة ترحيب
        showAlert('success', `مرحباً ${user.name}! تم تسجيل الدخول بـ Google بنجاح`);

        // استدعاء دالة النجاح المخصصة إن وجدت
        if (onSuccess) {
          onSuccess(data);
        } else {
          // التوجيه حسب الدور
          setTimeout(() => {
            if (role === 'admin') {
              navigate('/dashboard/admin');
            } else if (role === 'supervisor') {
              navigate('/dashboard/supervisor');
            } else if (role === 'school_manager') {
              navigate('/dashboard/school-manager');
            } else {
              navigate('/dashboard/parents');
            }
          }, 2200);
        }
      } else {
        throw new Error(data.message || 'فشل تسجيل الدخول بـ Google');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      const errorMessage = error.message || 'حدث خطأ في تسجيل الدخول بـ Google';
      showAlert('error', errorMessage);
      
      if (onError) {
        onError(error);
      }
    }
  };

  const handleManualClick = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      // Fallback to redirect method
      window.location.href = `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/auth/google`;
    }
  };

  // Show fallback button if Google services failed to load
  if (showFallback) {
    return (
      <div className={`google-signin-container ${className}`}>
        <button
          type="button"
          onClick={handleManualClick}
          className={`w-full flex items-center justify-center gap-2.5 border border-gray-300 rounded-full py-2 h-11 hover:shadow-md transition-all duration-300 hover:bg-gray-50 ${buttonClassName}`}
        >
          <GoogleIcon />
          <span className="font-medium text-base">
            {text}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className={`google-signin-container ${className}`}>
      {/* الزر الرسمي من Google */}
      <div ref={googleButtonRef} className="w-full"></div>
      
      {/* زر احتياطي مخصص - يظهر إذا لم يحمل الزر الرسمي */}
      <button
        type="button"
        onClick={handleManualClick}
        className={`hidden w-full flex items-center justify-center gap-2.5 border border-gray-300 rounded-full py-2 h-11 hover:shadow-md transition-all duration-300 hover:bg-gray-50 ${buttonClassName}`}
      >
        <GoogleIcon />
        <span className="font-medium text-base">
          {text}
        </span>
      </button>
    </div>
  );
};

export default GoogleSignInButton;