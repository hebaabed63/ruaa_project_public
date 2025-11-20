import React, { useState } from "react";
import { Formik, Form } from "formik";
import { forgotPasswordSchema } from "../../utils/validationForms";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import { EmailInput } from "../../components/inputs/FormInput";
import { getButtonState } from "../../utils/buttonState";
import LoadingOverlay from "../../components/ui/LoadingOverlay";

import ForgotHero from "../../assets/images/Forgot password.svg";
// Api Axios
import { forgotPasswordService } from "../../services/authService";
import usePageTitle from "../../hooks/usePageTitle";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Set page title
  usePageTitle("نسيت كلمة المرور");

  return (
    <>
      {loading && <LoadingOverlay message="جاري إرسال رابط إعادة التعيين..." />}
      
      <AuthLayout
        expressiveImage={ForgotHero}
        title="نسيت كلمة المرور؟"
        userPhotoClassName="mt-20" // Reduced from mt-28 to move content higher
      >
        <Formik
          initialValues={{ email: "" }}
          validationSchema={forgotPasswordSchema}
          //api
          onSubmit={async (values, { setSubmitting, validateForm }) => {
            const errors = await validateForm();
            if (Object.keys(errors).length === 0) {
              setLoading(true);
              try {
                //  استخدام خدمة forgotPasswordService
                const data = await forgotPasswordService({ email: values.email });
          
                // Instead of showAlert, we'll show a success message in the UI
                // and navigate directly to the reset password page if token is available
                if (data.data && data.data.reset_token) {
                  navigate(`/reset-password/${data.data.reset_token}`);
                } else {
                  // We could set a state to show this message in the UI instead of alert
                  console.log("تحقق من بريدك الإلكتروني للحصول على رابط إعادة التعيين");
                }
              } catch (error) {
                const errorMessage = error.message || "فشل إرسال البريد! حاول مجددًا";
                // Instead of showAlert, we'll log the error and could show it in UI
                console.error(error);
              } finally {
                setLoading(false);
              }
            }
            setSubmitting(false);
          }}        
        >
          {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => {
            const btnState = getButtonState(!values.email);

            return (
              <Form className="space-y-4 w-full">
                {/* Description text */}
                <div className="text-center mb-4">
                  <p className="text-gray-600 text-sm font-cairo leading-relaxed">
                    أدخل عنوان بريدك الإلكتروني<br/>
                    وسنأخذك مباشرة لتعيين كلمة مرور جديدة
                  </p>
                </div>

                {/* Email input */}
                <EmailInput
                  value={values.email}
                  onChange={handleChange("email")}
                  onBlur={handleBlur("email")}
                  placeholder="البريد الإلكتروني"
                  error={touched.email && errors.email ? errors.email : ""}
                />

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={btnState.disabled || isSubmitting}
                    className={`w-full h-11 mt-2 bg-[#2ca1db] text-white text-lg font-bold font-cairo rounded-full hover:bg-[#C4E4F5] transition ${btnState.className} flex items-center justify-center`}
                >
                  {isSubmitting ? "جاري المعالجة..." : "تعيين كلمة مرور جديدة"}
                </button>

                {/* Link to login page */}
                <div className="text-center text-sm font-cairo mt-3">
                  <span className="text-black font-bold text-xs">العودة إلى تسجيل الدخول؟ </span>
                  <Link
                    to="/login"
                    className="text-primary mr-1.5 font-medium hover:underline text-xs"
                  >
                    سجّل الدخول.
                  </Link>
                </div>
              </Form>
            );
          }}
        </Formik>
      </AuthLayout>
    </>
  );
}