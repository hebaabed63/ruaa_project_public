import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { registerSchema } from "../../utils/validationForms";

import AuthLayout from "../../layouts/AuthLayout";
import { EmailInput, PasswordInput, TextInput } from "../../components/inputs/FormInput";
import ButtonSpinner from "../../components/ui/ButtonSpinner";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";

import { getButtonState } from "../../utils/buttonState";
import { showAlert } from "../../utils/SweetAlert";

import RegisterHero from "../../assets/images/Sign up.svg";
import { AuthContext } from "../../contexts/AuthContext";// Auth context
// Api Axios
import { registerService } from "../../services/authService";

export default function Registration() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { login } = useContext(AuthContext); // Get login function from context
  const navigate = useNavigate();

  return (
    <AuthLayout
      expressiveImage={RegisterHero}
      title="إنشاء حساب"
      userPhotoClassName="mt-15"
      titleClassName="mb-8"
    >
      <Formik
        initialValues={{
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          agreeTerms: false,
        }}
        validationSchema={registerSchema}
        onSubmit={async (values, { setSubmitting, validateForm }) => {
          const errors = await validateForm();
          if (Object.keys(errors).length === 0) {
            setSubmitting(true);
            
            try {
              console.log('Submitting registration with data:', values);
              
              // استخدام خدمة التسجيل الجاهزة
              const response = await registerService(values);
              
              console.log('Registration response:', response); // للتأكد من الاستجابة
        
              // التحقق من نجاح العملية
              if (response && response.success) {
                // إظهار رسالة نجاح
                showAlert("success", response.message || "تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول");
                
                // انتظار قصير قبل التوجه
                setTimeout(() => {
                  navigate("/login");
                }, 2500); // يتوافق مع توقيت التنبيه
              } else {
                throw new Error(response?.message || "حدث خطأ أثناء التسجيل");
              }
              
            } catch (error) {
              // إظهار رسالة خطأ أكثر تفصيلاً
              console.error('Registration error:', error);
              const errorMessage = error.message || "حدث خطأ أثناء التسجيل";
              showAlert("error", errorMessage);
            } finally {
              setSubmitting(false);
            }
          } else {
            setSubmitting(false);
          }
        }}
        
      >
        {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => {
          const btnState = getButtonState(
            !values.fullName ||
            !values.email ||
              !values.password ||
              !values.confirmPassword ||
              !values.agreeTerms
          );

          return (
            <Form className="space-y-4 w-full">
              {/* Full Name input */}
              <TextInput
                value={values.fullName}
                onChange={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
                placeholder="الاسم الكامل"
                error={touched.fullName && errors.fullName ? errors.fullName : ""}
              />

              {/* Email input */}
              <EmailInput
                value={values.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                placeholder="البريد الإلكتروني"
                error={touched.email && errors.email ? errors.email : ""}
                className="transition-all duration-300 ease-in-out focus:border-primary focus:shadow-sm"
              />

              {/* Password input */}
              <PasswordInput
                value={values.password}
                onChange={handleChange("password")}
                onBlur={handleBlur("password")}
                placeholder="كلمة المرور"
                showPassword={showPassword}
                toggleShowPassword={() => setShowPassword(!showPassword)}
                error={touched.password && errors.password ? errors.password : ""}
                className="transition-all duration-300 ease-in-out focus:border-primary focus:shadow-sm"
              />

              {/* Confirm password input */}
              <PasswordInput
                value={values.confirmPassword}
                onChange={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                placeholder="تأكيد كلمة المرور"
                showPassword={showConfirmPassword}
                toggleShowPassword={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                error={
                  touched.confirmPassword && errors.confirmPassword
                    ? errors.confirmPassword
                    : ""
                }
                className="transition-all duration-300 ease-in-out focus:border-primary focus:shadow-sm"
              />

              {/* Agree to terms */}
              <div className="flex items-center gap-1.5 font-cairo font-normal px-2 mb-6 text-xs text-black">
                <input
                  type="checkbox"
                  checked={values.agreeTerms}
                  onChange={handleChange("agreeTerms")}
                  className="w-3.5 h-3.5 accent-primary"
                />
                <span className="text-xs">
                  أوافق على{" "}
                  <Link to="/terms" className="text-primary underline text-xs">
                    شروط الاستخدام
                  </Link>{" "}
                  و{" "}
                  <Link to="/privacy" className="text-primary underline text-xs">
                    سياسة الخصوصية
                  </Link>
                </span>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={btnState.disabled || isSubmitting}
                className={`w-full h-11 text-white text-base font-bold font-cairo rounded-full transition-all duration-300 ease-in-out mb-4 bg-primary hover:bg-secondary ${btnState.className} flex items-center justify-center`}
              >
                {isSubmitting ? (
                  <>
                    <ButtonSpinner size="sm" className="ml-2" />
                    جاري إنشاء الحساب...
                  </>
                ) : (
                  "إنشاء الحساب"
                )}
              </button>

              {/* Google Sign-Up Option */}
              <div className="flex items-center my-4">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-3 text-gray-400 font-cairo text-sm">
                  أو إنشاء حساب باستخدام
                </span>
                <hr className="flex-grow border-gray-300" />
              </div>

              {process.env.REACT_APP_GOOGLE_CLIENT_ID && (
                <GoogleSignInButton 
                  text="إنشاء حساب باستخدام Google"
                  className="w-full mb-3"
                  onSuccess={(data) => {
                    // عرض رسالة ترحيب مخصصة للتسجيل
                    showAlert('success', `مرحباً ${data.data.user.name}! تم إنشاء حسابك بنجاح`);
                  }}
                />
              )}

              {/* Login link */}
              <div className="text-center text-sm font-cairo mt-3">
                <span className="text-black font-bold text-xs">هل لديك حساب؟ </span>
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium text-xs mr-1.5"
                >
                  تسجيل الدخول.
                </Link>
              </div>
            </Form>
          );
        }}
      </Formik>
    </AuthLayout>
  );
}
