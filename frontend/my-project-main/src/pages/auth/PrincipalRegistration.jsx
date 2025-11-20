import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import AuthLayout from "../../layouts/AuthLayout";
import { EmailInput, PasswordInput, TextInput } from "../../components/inputs/FormInput";
import ButtonSpinner from "../../components/ui/ButtonSpinner";

import { getButtonState } from "../../utils/buttonState";
import { showAlert } from "../../utils/SweetAlert";

import RegisterHero from "../../assets/images/Sign up.svg";
import { 
  FaSchool,
  FaSpinner,
  FaExclamationCircle,
  FaCheckCircle,
  FaUserTie,
  FaGoogle
} from 'react-icons/fa';

import { validateRegistrationToken, registerPrincipal } from "../../services/authService";
import usePageTitle from "../../hooks/usePageTitle";

// Google Icon Component
const GoogleIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 533.5 544.3">
    <path fill="#4285F4" d="M533.5 278.4c0-17.6-1.4-35.2-4.3-52H272v98.9h146.9c-6.4 34.5-25.5 63.8-54.6 83.3v68h88.3c51.8-47.7 81.9-118.2 81.9-198.2z"/>
    <path fill="#34A853" d="M272 544.3c73.7 0 135.5-24.3 180.7-66.1l-88.3-68c-24.5 16.5-55.7 26.3-92.4 26.3-71 0-131-47.8-152.5-112.1H31.6v70.5C76.8 491.2 167.6 544.3 272 544.3z"/>
    <path fill="#FBBC05" d="M119.5 325.4c-7.2-21.4-11.3-44.1-11.3-67.4s4.1-46 11.3-67.4V120H31.6C11.3 166.5 0 218.7 0 278s11.3 111.5 31.6 158l87.9-70.6z"/>
    <path fill="#EA4335" d="M272 109.7c38.4 0 72.7 13.2 99.9 39.1l74.9-74.9C407.3 24.3 345.5 0 272 0 167.6 0 76.8 53.1 31.6 145.7l87.9 70.5c21.5-64.3 81.5-112 152.5-112z"/>
  </svg>
);

// Validation schema for principal registration
const principalValidationSchema = Yup.object({
  fullName: Yup.string()
    .min(2, "الاسم يجب أن يكون على الأقل حرفين")
    .required("الاسم الكامل مطلوب"),
  email: Yup.string()
    .email("البريد الإلكتروني غير صحيح")
    .required("البريد الإلكتروني مطلوب"),
  password: Yup.string()
    .min(6, "كلمة المرور يجب أن تكون على الأقل 6 أحرف")
    .required("كلمة المرور مطلوبة"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "كلمة المرور غير متطابقة")
    .required("تأكيد كلمة المرور مطلوب"),
  agreeTerms: Yup.boolean()
    .oneOf([true], "يجب الموافقة على الشروط والأحكام")
});

export default function PrincipalRegistration() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const supervisorToken = searchParams.get('supervisor_token');

  // Set page title
  usePageTitle("تسجيل مدير مدرسة");

  // Initial form values
  const initialValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  };

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!supervisorToken) {
        setError('رابط التسجيل غير صالح');
        return;
      }

      setLoading(true);
      try {
        const response = await validateRegistrationToken(supervisorToken);
        
        if (response.success && response.data.link_type === 'principal') {
          setTokenData(response.data);
        } else {
          setError('رابط التسجيل غير صالح لمدراء المدارس');
        }
      } catch (err) {
        setError(err.message || 'حدث خطأ في التحقق من رابط التسجيل');
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [supervisorToken]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const submissionData = {
        ...values,
        supervisor_token: supervisorToken
      };

      const response = await registerPrincipal(submissionData);

      if (response && response.success) {
        showAlert("success", "تم تسجيلك، بانتظار موافقة المشرف");
        
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        throw new Error(response?.message || "حدث خطأ أثناء التسجيل");
      }
      
    } catch (error) {
      console.error('Principal registration error:', error);
      
      // Handle different types of errors
      let errorMessage = "حدث خطأ أثناء التسجيل";
      
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
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Google registration
  const handleGoogleRegister = () => {
    // Redirect to Google OAuth for registration
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/auth/google?registration_token=${supervisorToken}&role=principal`;
  };

  // Loading state for token validation
  if (loading) {
    return (
      <AuthLayout
        expressiveImage={RegisterHero}
        title="تسجيل مدير مدرسة"
        userPhotoClassName="mt-10" // Reduced from -mt-8 to move content higher
        titleClassName="mb-4" // Reduced from -mb-4 to move content higher
      >
        <div className="flex flex-col items-center justify-center space-y-4 py-8 mt-6">
          <FaSpinner className="text-4xl text-primary animate-spin" />
          <p className="text-gray-600">جاري التحقق من رابط التسجيل...</p>
        </div>
      </AuthLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AuthLayout
        expressiveImage={RegisterHero}
        title="خطأ في التسجيل"
        userPhotoClassName="mt-10" // Reduced from -mt-8 to move content higher
        titleClassName="mb-4" // Reduced from -mb-4 to move content higher
      >
        <div className="flex flex-col items-center justify-center space-y-4 py-8 mt-6">
          <FaExclamationCircle className="text-4xl text-red-500" />
          <p className="text-red-600 text-center">{error}</p>
          <Link 
            to="/login" 
            className="text-primary hover:underline font-medium"
          >
            العودة لتسجيل الدخول
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      expressiveImage={RegisterHero}
      title="تسجيل مدير مدرسة"
      userPhotoClassName="mt-10" // Reduced from -mt-8 to move content higher
      titleClassName="mb-4" // Reduced from -mb-4 to move content higher
    >
      <div className="mt-4">
        {/* Supervisor Info - Made linear to save space */}
        {tokenData && tokenData.supervisor && (
          <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-center space-x-2 space-x-reverse">
                <FaUserTie className="text-green-600 text-lg" />
                <span className="text-sm font-bold text-gray-700">تسجيل تحت إشراف:</span>
                <span className="text-sm font-bold text-green-700">
                  {tokenData.supervisor.name}
                </span>
              </div>
              {tokenData.organization_name && (
                <div className="flex items-center justify-center space-x-1 space-x-reverse">
                  <FaSchool className="text-blue-600 text-sm" />
                  <span className="text-xs text-gray-600">لمدرسة:</span>
                  <span className="text-xs font-medium text-blue-600">
                    {tokenData.organization_name}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <Formik
        initialValues={initialValues}
        validationSchema={principalValidationSchema}
        onSubmit={handleSubmit}
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
            <Form className="space-y-3 w-full">
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
                toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ""}
                className="transition-all duration-300 ease-in-out focus:border-primary focus:shadow-sm"
              />

              {/* Agree to terms */}
              <div className="flex items-center gap-1.5 font-cairo font-normal px-2 mb-3 text-xs text-black">
                <input
                  type="checkbox"
                  checked={values.agreeTerms}
                  onChange={handleChange("agreeTerms")}
                  className="w-3.5 h-3.5 accent-primary"
                />
                <span className="text-xs">
                  أوافق على{" "}
                  <Link to="/terms" className="text-blue-600 underline text-xs">
                    شروط الاستخدام
                  </Link>{" "}
                  و{" "}
                  <Link to="/privacy" className="text-blue-600 underline text-xs">
                    سياسة الخصوصية
                  </Link>
                </span>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={btnState.disabled || isSubmitting}
                    className={`w-full h-11 mt-2 bg-[#2ca1db] text-white text-lg font-bold font-cairo rounded-full hover:bg-[#C4E4F5] transition ${btnState.className} flex items-center justify-center`}
              >
                {isSubmitting ? (
                  <>
                    <ButtonSpinner size="sm" className="ml-2" />
                    جاري التسجيل...
                  </>
                ) : (
                  "تسجيل كمدير مدرسة"
                )}
              </button>

              {/* Google registration button - Styled to match login page */}
              <button
                type="button"
                onClick={handleGoogleRegister}
                className="w-full h-11 flex items-center justify-center gap-2.5 border border-gray-300 rounded-full hover:shadow-md transition-all duration-300 hover:bg-gray-50 mb-3"
              >
                <div className="w-5 h-5">
                  <GoogleIcon />
                </div>
                <span className="font-cairo font-medium text-base">
                  التسجيل باستخدام Google
                </span>
              </button>

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

              {/* Important Notice - Compact Version */}
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">ملاحظة: سيتم مراجعة طلبك من قبل المشرف خلال 1-2 أيام عمل</p>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
      </div>
    </AuthLayout>
  );
}