import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import AuthLayout from "../../layouts/AuthLayout";
import { FaUserCheck, FaHome } from 'react-icons/fa';

import pendingApprovalImage from "../../assets/images/login-hero.svg";
import usePageTitle from "../../hooks/usePageTitle";

export default function PendingApproval() {
  const { isAuthenticated, userRole, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Set page title
  usePageTitle("طلبك قيد المراجعة");

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // If user is not a supervisor or school manager, redirect to their dashboard
    if (userRole !== 'supervisor' && userRole !== 'school_manager') {
      if (userRole === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard/parents');
      }
      return;
    }

    // If user is already approved, redirect to their dashboard
    if (user && user.status !== 'pending') {
      if (userRole === 'supervisor') {
        navigate('/dashboard/supervisor');
      } else if (userRole === 'school_manager') {
        navigate('/dashboard/school-manager');
      }
    }
  }, [isAuthenticated, userRole, user, navigate]);

  // Determine the appropriate message based on user role
  const getApprovalMessage = () => {
    if (userRole === 'school_manager') {
      return {
        title: "طلبك قيد المراجعة",
        description: "شكراً لك على التسجيل كمدير مدرسة. طلبك الآن قيد مراجعة المشرف وسيتم إعلامك بمجرد الموافقة عليه.",
        nextSteps: [
          "سيقوم المشرف بمراجعة معلوماتك",
          "سيتم إرسال إشعار لك عند الموافقة",
          "يمكنك تسجيل الدخول في أي وقت لتحقق من الحالة"
        ]
      };
    } else {
      // Default to supervisor message
      return {
        title: "طلبك قيد المراجعة",
        description: "شكراً لك على التسجيل كمشرف. طلبك الآن قيد مراجعة الإدارة وسيتم إعلامك بمجرد الموافقة عليه.",
        nextSteps: [
          "سيقوم المسؤول بمراجعة معلوماتك",
          "سيتم إرسال إشعار لك عند الموافقة",
          "يمكنك تسجيل الدخول في أي وقت لتحقق من الحالة"
        ]
      };
    }
  };

  const message = getApprovalMessage();

  return (
    <AuthLayout
      expressiveImage={pendingApprovalImage}
      title=""
      userPhotoClassName="mt-2"
      titleClassName="mb-1"
    >
      <div className="w-full max-w-sm text-center">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{message.title}</h2>
          
          <p className="text-gray-600 mb-4">
            {message.description}
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-4 text-right">
            <div className="flex items-center mb-2">
              <FaUserCheck className="text-blue-600 ml-2" />
              <span className="font-medium text-gray-900">ما التالي؟</span>
            </div>
            <ul className="text-sm text-gray-700 space-y-2 mr-6">
              {message.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="ml-2">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Link
              to="/logout"
              className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2 space-x-reverse"
            >
              <span>تسجيل الخروج</span>
            </Link>
            
            <Link
              to="/"
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2 space-x-reverse"
            >
              <FaHome className="text-gray-500" />
              <span>الصفحة الرئيسية</span>
            </Link>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-600">
          <p>هل لديك أي استفسارات؟</p>
          <Link to="/contact" className="text-primary hover:underline">
            تواصل مع الدعم
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}