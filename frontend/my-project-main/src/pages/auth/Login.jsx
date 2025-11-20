import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import AuthLayout from "../../layouts/AuthLayout";
import { EmailInput, PasswordInput } from "../../components/inputs/FormInput";
import ButtonSpinner from "../../components/ui/ButtonSpinner";
import LogoSpinner from "../../components/ui/LogoSpinner";
import LoadingOverlay from "../../components/ui/LoadingOverlay"; // Add this import
import GoogleIcon from "../../components/icons/GoogleIcon";

import { getButtonState } from "../../utils/buttonState";
import { showAlert } from "../../utils/SweetAlert";
import { AuthContext } from "../../contexts/AuthContext";

import loginHero from "../../assets/images/login-hero.svg";
import { FaSpinner } from 'react-icons/fa';

import { loginService } from "../../services/authService";
import usePageTitle from "../../hooks/usePageTitle";

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("بريد إلكتروني غير صحيح")
    .required("البريد الإلكتروني مطلوب"),
  password: Yup.string()
    .min(6, "كلمة المرور قصيرة جداً")
    .required("كلمة المرور مطلوبة"),
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Set page title
  usePageTitle("تسجيل الدخول");

  return (
    <>
      {/* Show loading overlay when logging in */}
      {loading && <LoadingOverlay message="جاري تسجيل الدخول وإعداد لوحة التحكم..." />}
      
      <AuthLayout
        expressiveImage={loginHero}
        title="تسجيل الدخول"
        userPhotoClassName="mt-2"
        titleClassName="mb-1"
      >
        <div className="w-full max-w-sm">
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                setSubmitting(true);
                setLoading(true);
                
                // 🔹 استخدام الخدمة الجاهزة
                const data = await loginService(values);
          
                // 🔹 حفظ التوكن والدور
                const token = data.data.token;
                const role = data.data.role;
                const user = data.data.user;
          
                console.log('Login successful. Token:', token, 'Role:', role, 'User:', user);
                login(token, role, user);
                // Always store the token in localStorage, not just when rememberMe is true
                localStorage.setItem("token", token);
          
                // انتظار قصير ثم التوجيه حسب الدور
                setTimeout(() => {
                  console.log('Navigating based on role:', role);
                  if (role === 'admin') {
                    console.log('Navigating to admin dashboard');
                    navigate('/dashboard/admin');
                  } else if (role === 'supervisor') {
                    // Check if supervisor is approved
                    if (user.status === 'pending') {
                      // Redirect pending supervisors to a waiting page
                      navigate('/pending-approval');
                    } else {
                      navigate('/dashboard/supervisor');
                    }
                  } else if (role === 'school_manager') {
                    // Check if school manager is approved
                    if (user.status === 'pending') {
                      // Redirect pending school managers to a waiting page
                      navigate('/pending-approval');
                    } else {
                      console.log('Navigating to school manager dashboard');
                      navigate('/dashboard/school-manager');
                    }
                  } else {
                    console.log('Navigating to parent dashboard, role:', role);
                    navigate('/dashboard/parent'); // parent dashboard
                  }
                }, 1500);
                
              } catch (error) {
                console.log('Login error:', error);
                // Handle pending supervisor status
                if (error.response && error.response.data && 
                    error.response.data.data && 
                    error.response.data.data.status === 'pending' && 
                    error.response.data.data.role === 'supervisor') {
                  // Allow pending supervisors to log in
                  const token = error.response.data.data.token;
                  const role = error.response.data.data.role;
                  const user = error.response.data.data.user;
                  
                  if (token && role === 'supervisor') {
                    login(token, role, user);
                    // Always store the token in localStorage, not just when rememberMe is true
                    localStorage.setItem("token", token);
                    
                    // Redirect pending supervisor to waiting page
                    setTimeout(() => {
                      navigate('/pending-approval');
                    }, 1500);
                    setSubmitting(false);
                    setLoading(false);
                    return;
                  }
                }
                
                // Handle pending school manager status
                if (error.response && error.response.data && 
                    error.response.data.data && 
                    error.response.data.data.status === 'pending' && 
                    error.response.data.data.role === 'school_manager') {
                  // Allow pending school managers to log in
                  const token = error.response.data.data.token;
                  const role = error.response.data.data.role;
                  const user = error.response.data.data.user;
                  
                  if (token && role === 'school_manager') {
                    login(token, role, user);
                    // Always store the token in localStorage, not just when rememberMe is true
                    localStorage.setItem("token", token);
                    
                    // Redirect pending school manager to waiting page
                    setTimeout(() => {
                      navigate('/pending-approval');
                    }, 1500);
                    setSubmitting(false);
                    setLoading(false);
                    return;
                  }
                }
                
                // Handle the special error case for pending supervisors from authService
                if (error.response && error.response.data && error.response.data.success === true &&
                    error.response.data.data && error.response.data.data.status === 'pending' &&
                    (error.response.data.data.role === 'supervisor' || error.response.data.data.role === 'school_manager')) {
                  // This is a pending supervisor or school manager with success response
                  const responseData = error.response.data;
                  const token = responseData.data.token;
                  const role = responseData.data.role;
                  const user = responseData.data.user;
                  
                  if (token && (role === 'supervisor' || role === 'school_manager')) {
                    login(token, role, user);
                    // Always store the token in localStorage, not just when rememberMe is true
                    localStorage.setItem("token", token);
                    
                    // Redirect pending user to waiting page
                    setTimeout(() => {
                      navigate('/pending-approval');
                    }, 1500);
                    setSubmitting(false);
                    setLoading(false);
                    return;
                  }
                }
                
                // Handle different types of errors
                let errorMessage = "فشل تسجيل الدخول! تحقق من البيانات.";
                
                if (error.message) {
                  // If it's already a string message
                  if (typeof error.message === 'string') {
                    errorMessage = error.message;
                  } 
                  // If it's an object with message property
                  else if (typeof error.message === 'object' && error.message.message) {
                    errorMessage = error.message.message;
                  }
                }
                
                // Handle validation errors from backend
                if (error.response && error.response.data) {
                  const data = error.response.data;
                  if (data.errors) {
                    // Format validation errors
                    const errorMessages = Object.values(data.errors).flat();
                    errorMessage = errorMessages.join(', ') || errorMessage;
                  } else if (data.message) {
                    errorMessage = data.message;
                  }
                }
                
                showAlert("error", errorMessage);
                console.error(error);
                setSubmitting(false);
                setLoading(false);
              }
            }}
          >
            {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => {
              const btnState = getButtonState(!values.email || !values.password);

              return (
                <Form className="space-y-4">
                  <EmailInput
                    value={values.email}
                    onChange={handleChange("email")}
                    onBlur={handleBlur("email")}
                    placeholder="البريد الإلكتروني"
                    error={touched.email && errors.email ? errors.email : ""}
                  />
                  <PasswordInput
                    value={values.password}
                    onChange={handleChange("password")}
                    onBlur={handleBlur("password")}
                    placeholder="كلمة المرور"
                    showPassword={showPassword}
                    toggleShowPassword={() => setShowPassword(!showPassword)}
                    error={touched.password && errors.password ? errors.password : ""}
                  />
                  <div className="flex justify-between items-center w-full mb-4 text-xs text-black px-2 font-cairo font-bold">
                    <label className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 accent-primary"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span className="text-xs">تذَّكرني</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-primary hover:underline text-xs pl-1 font-semibold font-cairo"
                    >
                      هل نسيت كلمة المرور؟
                    </Link>
                  </div>
                  <button
                    type="submit"
                    disabled={btnState.disabled || isSubmitting}
                    className={`w-full h-11 mt-2 bg-[#2ca1db] text-white text-lg font-bold font-cairo rounded-full hover:bg-[#C4E4F5] transition ${btnState.className} flex items-center justify-center`}
                  >
                    {isSubmitting ? (
                      <><ButtonSpinner size="sm" className="ml-2" />جاري تسجيل الدخول...</>
                    ) : (
                      "تسجيل الدخول"
                    )}
                  </button>

                  <div className="flex items-center my-5">
                    <hr className="flex-grow border-gray-300" />
                    <span className="mx-3 text-gray-400 font-cairo text-sm">
                      أو تسجيل باستخدام
                    </span>
                    <hr className="flex-grow border-gray-300" />
                  </div>

                  {/* Google OAuth Sign-In - Simple Redirect Method */}
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/auth/google`;
                    }}
                    className="w-full flex items-center justify-center gap-2.5 border border-gray-300 rounded-full py-2 h-11 hover:shadow-md transition-all duration-300 hover:bg-gray-50 mb-3"
                  >
                    <div className="w-5 h-5">
                      <GoogleIcon />
                    </div>
                    <span className="font-cairo font-medium text-base">
                      تسجيل الدخول باستخدام Google
                    </span>
                  </button>

                  <div className="text-center text-sm font-cairo mt-3">
                    <span className="text-black font-bold text-xs">ليس لديك حساب؟ </span>
                    <Link
                      to="/register"
                      className="text-primary mr-1.5 font-medium hover:underline text-xs"
                    >
                      إنشاء حساب
                    </Link>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </AuthLayout>
    </>
  );
}