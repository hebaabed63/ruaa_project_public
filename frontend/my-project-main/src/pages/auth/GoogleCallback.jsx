import React, { useEffect, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { showAlert } from '../../utils/SweetAlert';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function GoogleCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [status, setStatus] = useState('processing'); // processing, success, error

  useEffect(() => {
    const processGoogleCallback = async () => {
      try {
        // استخراج البيانات من URL parameters
        const urlParams = new URLSearchParams(location.search);
        const success = urlParams.get('success');
        const token = urlParams.get('token');
        const role = urlParams.get('role');
        const userBase64 = urlParams.get('user');
        const error = urlParams.get('error');

        if (error) {
          showAlert('error', decodeURIComponent(error));
          setStatus('error');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
          return;
        }

        if (!success || !token || !role || !userBase64) {
          showAlert('error', 'بيانات غير كاملة من Google OAuth');
          setStatus('error');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
          return;
        }

        try {
          // فك تشفير بيانات المستخدم
          const user = JSON.parse(atob(userBase64));
          
          // تسجيل الدخول في السياق أولاً
          login(token, role, user);
          
          // حفظ البيانات مباشرة في localStorage للتأكد
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);
          localStorage.setItem('user', JSON.stringify(user));
          
          // التوجيه المباشر فوراً بدون alert أو تأخير
          if (role === 'admin') {
            window.location.replace('/dashboard/admin');
          } else if (role === 'supervisor') {
            window.location.replace('/dashboard/supervisor');
          } else if (role === 'school_manager') {
            window.location.replace('/dashboard/school-manager');
          } else {
            // للـ parents - توجيه مباشر بدون رسائل
            window.location.replace('/dashboard/parents');
          }
          
        } catch (decodeError) {
          console.error('Error decoding user data:', decodeError);
          showAlert('error', 'خطأ في معالجة بيانات المستخدم');
          setStatus('error');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
        
      } catch (error) {
        console.error('Google OAuth Callback Error:', error);
        setStatus('error');
        
        const errorMessage = error.message || 'حدث خطأ في تسجيل الدخول بـ Google';
        showAlert('error', errorMessage);
        
        // العودة لصفحة تسجيل الدخول بعد 3 ثوان
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    processGoogleCallback();
  }, [location, navigate, login]);

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center">
            <LoadingSpinner size="xl" className="mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2 font-cairo">
              جاري تسجيل الدخول...
            </h2>
            <p className="text-gray-600 font-cairo">
              يتم معالجة بيانات Google، يرجى الانتظار
            </p>
          </div>
        );
      
      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-green-800 mb-2 font-cairo">
              نجح تسجيل الدخول!
            </h2>
            <p className="text-gray-600 font-cairo">
              سيتم توجيهك إلى لوحة التحكم...
            </p>
          </div>
        );
      
      case 'error':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-red-800 mb-2 font-cairo">
              فشل تسجيل الدخول
            </h2>
            <p className="text-gray-600 font-cairo">
              سيتم توجيهك إلى صفحة تسجيل الدخول...
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <img
            src="/LOGO.svg" 
            alt="شعار المشروع"
            className="w-16 h-16 mx-auto mb-4"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h1 className="text-2xl font-bold text-primary font-cairo">
            تسجيل الدخول بـ Google
          </h1>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
}
