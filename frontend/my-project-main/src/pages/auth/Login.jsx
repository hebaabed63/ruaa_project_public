import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { loginSchema } from "../../utils/validationForms";

import AuthLayout from "../../layouts/AuthLayout";
import { EmailInput, PasswordInput } from "../../components/inputs/FormInput";
import ButtonSpinner from "../../components/ui/ButtonSpinner";
import { getButtonState } from "../../utils/buttonState";
import { showAlert } from "../../utils/SweetAlert";

import LoginHero from "../../assets/images/login-hero.svg";

// Context for auth
import { AuthContext } from "../../contexts/AuthContext";
// Api Axios
import { loginService } from "../../services/authService";

// Google Icon Component
const GoogleIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 533.5 544.3">
    <path fill="#4285F4" d="M533.5 278.4c0-17.6-1.4-35.2-4.3-52H272v98.9h146.9c-6.4 34.5-25.5 63.8-54.6 83.3v68h88.3c51.8-47.7 81.9-118.2 81.9-198.2z"/>
    <path fill="#34A853" d="M272 544.3c73.7 0 135.5-24.3 180.7-66.1l-88.3-68c-24.5 16.5-55.7 26.3-92.4 26.3-71 0-131-47.8-152.5-112.1H31.6v70.5C76.8 491.2 167.6 544.3 272 544.3z"/>
    <path fill="#FBBC05" d="M119.5 325.4c-7.2-21.4-11.3-44.1-11.3-67.4s4.1-46 11.3-67.4V120H31.6C11.3 166.5 0 218.7 0 278s11.3 111.5 31.6 158l87.9-70.6z"/>
    <path fill="#EA4335" d="M272 109.7c38.4 0 72.7 13.2 99.9 39.1l74.9-74.9C407.3 24.3 345.5 0 272 0 167.6 0 76.8 53.1 31.6 145.7l87.9 70.5c21.5-64.3 81.5-112 152.5-112z"/>
  </svg>
);

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  return (
    <AuthLayout
      expressiveImage={LoginHero}
      title="تسجيل الدخول"
      userPhotoClassName="mt-20"
      titleClassName="mb-8"
    >
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={async (values, { setSubmitting, validateForm }) => {
          const errors = await validateForm();
          if (Object.keys(errors).length === 0) {
            try {
              setSubmitting(true);
              
              // 🔹 استخدام الخدمة الجاهزة
              const data = await loginService(values);
        
              // 🔹 حفظ التوكن والدور
              const token = data.data.token;
              const role = data.data.role;
              const user = data.data.user;
        
              login(token, role);
              if (rememberMe) localStorage.setItem("token", token);
        
              // إظهار رسالة ترحيب
              showAlert("success", `مرحباً ${user.name}! تم تسجيل الدخول بنجاح`);
              
              // انتظار قصير ثم التوجيه حسب الدور
              setTimeout(() => {
                if (role === 'admin') {
                  navigate('/dashboard/admin');
                } else if (role === 'supervisor') {
                  navigate('/dashboard/supervisor');
                } else if (role === 'school_manager') {
                  navigate('/dashboard/school-manager');
                } else {
                  navigate('/dashboard/parents'); // parent dashboard
                }
              }, 2200); // يتوافق مع توقيت التنبيه
              
            } catch (error) {
              const errorMessage = error.message || "فشل تسجيل الدخول! تحقق من البيانات.";
              showAlert("error", errorMessage);
              console.error(error);
            }
          }
          setSubmitting(false);
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
              <div className="flex justify-between items-center w-full mb-8 text-xs text-black px-2 font-cairo font-bold">
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
                className={`w-full h-11 mt-4 bg-primary text-white text-lg font-bold font-cairo rounded-full hover:bg-secondary transition ${btnState.className} flex items-center justify-center`}
              >
                {isSubmitting ? (
                  <>
                    <ButtonSpinner size="sm" className="ml-2" />
                    جاري تسجيل الدخول...
                  </>
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
    </AuthLayout>
  );
}
