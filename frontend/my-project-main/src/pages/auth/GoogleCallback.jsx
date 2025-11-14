import React, { useEffect, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { showAlert } from '../../utils/SweetAlert';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import '../../components/ui/LoadingOverlay.css'; // Import the CSS for alternating animation
import usePageTitle from "../../hooks/usePageTitle";

export default function GoogleCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [showLoading, setShowLoading] = useState(false); // For showing the logo loading overlay

  // Set page title
  usePageTitle("معاودة تسجيل الدخول");

  useEffect(() => {
    let redirectTimeout;
    let isMounted = true; // Track if component is still mounted
    
    const processGoogleCallback = async () => {
      // If we're already showing the loading overlay, don't process again
      if (showLoading) {
        return;
      }
      
      try {
        // استخراج البيانات من URL parameters
        const urlParams = new URLSearchParams(location.search);
        const success = urlParams.get('success');
        const token = urlParams.get('token');
        const role = urlParams.get('role');
        const userBase64 = urlParams.get('user');
        const error = urlParams.get('error');

        // Debug logging
        console.log('Google OAuth Callback Data:', {
          success,
          token,
          role,
          userBase64,
          error
        });

        if (error) {
          showAlert('error', decodeURIComponent(error));
          setStatus('error');
          redirectTimeout = setTimeout(() => {
            if (isMounted) navigate('/login');
          }, 3000);
          return;
        }

        if (!success || !token || !role || !userBase64) {
          showAlert('error', 'بيانات غير كاملة من Google OAuth');
          setStatus('error');
          redirectTimeout = setTimeout(() => {
            if (isMounted) navigate('/login');
          }, 3000);
          return;
        }

        try {
          // فك تشفير بيانات المستخدم
          const user = JSON.parse(atob(userBase64));
          
          // Debug logging
          console.log('Decoded User Data:', user);
          console.log('User Status:', user.status);
          console.log('User Role:', role);
          
          // تسجيل الدخول في السياق أولاً
          login(token, role, user);
          
          // حفظ البيانات مباشرة في localStorage للتأكد
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);
          localStorage.setItem('user', JSON.stringify(user));
          
          // التحقق من حالة المستخدم لتحديد التوجيه المناسب
          console.log('Checking user status for redirect...');
          if (user.status === 'pending') {
            console.log('User is pending, redirecting to pending approval');
            // إذا كان المشرف أو مدير مدرسة في حالة انتظار
            if (role === 'supervisor') {
              // For supervisors, show loading overlay instead of alert
              console.log('Setting showLoading to true for pending supervisor');
              setShowLoading(true);
              // التوجيه إلى صفحة انتظار الموافقة للمشرفين المعلقين
              redirectTimeout = setTimeout(() => {
                if (isMounted) navigate('/pending-approval');
              }, 3000);
            } else if (role === 'school_manager') {
              // For school managers, show loading overlay instead of alert
              console.log('Setting showLoading to true for pending school manager');
              setShowLoading(true);
              // التوجيه إلى صفحة انتظار الموافقة لمدراء المدارس المعلقين
              redirectTimeout = setTimeout(() => {
                if (isMounted) navigate('/pending-approval');
              }, 3000);
            } else {
              // For other roles, show loading overlay instead of alert
              console.log('Setting showLoading to true for other pending roles');
              setShowLoading(true);
              if (role === 'admin') {
                redirectTimeout = setTimeout(() => {
                  if (isMounted) navigate('/dashboard/admin');
                }, 3000);
              } else {
                redirectTimeout = setTimeout(() => {
                  if (isMounted) navigate('/dashboard/parents');
                }, 3000);
              }
            }
          } else {
            console.log('User is active, redirecting to dashboard');
            // For all active users, show loading overlay instead of alert
            console.log('Setting showLoading to true for active user');
            setShowLoading(true);
            
            // Delay redirect to show loading animation
            console.log('Setting timeout for redirect');
            redirectTimeout = setTimeout(() => {
              console.log('Redirect timeout executed');
              console.log('Component still mounted:', isMounted);
              console.log('Role for redirect:', role);
              if (isMounted) { // Only navigate if component is still mounted
                console.log('Redirecting to dashboard...');
                if (role === 'admin') {
                  console.log('Navigating to admin dashboard');
                  navigate('/dashboard/admin');
                } else if (role === 'supervisor') {
                  console.log('Navigating to supervisor dashboard');
                  navigate('/dashboard/supervisor');
                } else if (role === 'school_manager') {
                  console.log('Navigating to school manager dashboard');
                  navigate('/dashboard/school-manager');
                } else {
                  console.log('Navigating to parents dashboard');
                  navigate('/dashboard/parents');
                }
              } else {
                console.log('Component was unmounted, skipping navigation');
              }
            }, 1500); // Show loading for 1.5 seconds to match user preference
          }

        } catch (decodeError) {
          console.error('Error decoding user data:', decodeError);
          // Instead of showing error alert, show loading overlay
          console.log('Setting showLoading to true for decode error');
          setShowLoading(true);
          setStatus('error');
          redirectTimeout = setTimeout(() => {
            if (isMounted) navigate('/login');
          }, 3000);
        }
        
      } catch (error) {
        console.error('Google OAuth Callback Error:', error);
        setStatus('error');
        
        // Instead of showing error alert, show loading overlay
        console.log('Setting showLoading to true for general error');
        setShowLoading(true);
        
        // العودة لصفحة تسجيل الدخول بعد 3 ثوان
        redirectTimeout = setTimeout(() => {
          if (isMounted) navigate('/login');
        }, 3000);
      }
    };

    processGoogleCallback();
    
    // Cleanup function to clear timeout on unmount
    return () => {
      isMounted = false; // Mark component as unmounted
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
  }, [location, navigate, login]); // Removed showLoading from dependencies to prevent infinite loop

  const renderContent = () => {
    // If we're showing the loading overlay, don't render other content
    if (showLoading) {
      // Add a fallback navigation in case the timeout doesn't work
      setTimeout(() => {
        const urlParams = new URLSearchParams(location.search);
        const role = urlParams.get('role');
        
        if (role) {
          console.log('Fallback navigation triggered for role:', role);
          if (role === 'admin') {
            navigate('/dashboard/admin');
          } else if (role === 'supervisor') {
            navigate('/dashboard/supervisor');
          } else if (role === 'school_manager') {
            navigate('/dashboard/school-manager');
          } else {
            navigate('/dashboard/parents');
          }
        }
      }, 3000); // Fallback after 3 seconds
      
      return <LoadingOverlay message="جاري التوجيه إلى لوحة التحكم..." />;
    }

    switch (status) {
      case 'processing':
        return (
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              {/* Use the same alternating animation as LoadingOverlay */}
              <div className="relative w-24 h-24">
                <div 
                  className="absolute inset-0 w-full h-full"
                  style={{
                    animation: 'pulse-first-part 1.5s cubic-bezier(0.22, 0.61, 0.36, 1) infinite'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" className="w-full h-full">
                    <path fill="#64c8cc" d="M771.39,379.64v-114.15c0-22.56,18.46-41.03,41.03-41.03h117.77v-121.63c0-2.45.16-4.86.42-7.24h-113.36c-95.04,0-172.79,77.76-172.79,172.79v111.26h126.94Z"/>
                   </svg>
                </div>
                <div 
                  className="absolute inset-0 w-full h-full"
                  style={{
                    animation: 'pulse-second-part 1.5s cubic-bezier(0.22, 0.61, 0.36, 1) infinite'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" className="w-full h-full">
                    <path fill="#30a1db" d="M930.2,224.47v114.15c0,22.56-18.46,41.03-41.03,41.03h-117.77v121.63c0,2.45-.16,4.86-.42,7.24h113.36c95.04,0,172.79-77.76,172.79-172.79v-111.26h-126.94Z"/>
                  </svg>
                </div>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2 font-cairo">
              جاري تسجيل الدخول...
            </h2>
            <p className="text-gray-600 font-cairo">
              يتم معالجة بيانات Google، يرجى الانتظار
            </p>
          </div>
        );
      
      case 'success':
      case 'error':
      default:
        // For all cases, if we're not showing loading overlay, show nothing
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center" dir="rtl">
      <div className="bg-white p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <img
            src={require('../../assets/images/LOGO1.svg')} 
            alt="شعار المشروع"
            className="w-16 h-16 mx-auto mb-4"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
}