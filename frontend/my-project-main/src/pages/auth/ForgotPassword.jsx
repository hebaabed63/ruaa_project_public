import React from "react";
import { Formik, Form } from "formik";
import { forgotPasswordSchema } from "../../utils/validationForms";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import { EmailInput } from "../../components/inputs/FormInput";
import { getButtonState } from "../../utils/buttonState";
import { showAlert, showToast } from "../../utils/SweetAlert";

import ForgotHero from "../../assets/images/Forgot password.svg";
// Api Axios
import { forgotPasswordService } from "../../services/authService";

export default function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      expressiveImage={ForgotHero}
      title="نسيت كلمة المرور؟"
      userPhotoClassName="mt-28"
    >
      <Formik
        initialValues={{ email: "" }}
        validationSchema={forgotPasswordSchema}
        //api
        onSubmit={async (values, { setSubmitting, validateForm }) => {
          const errors = await validateForm();
          if (Object.keys(errors).length === 0) {
            try {
              //  استخدام خدمة forgotPasswordService
              const data = await forgotPasswordService({ email: values.email });
        
              showAlert("success", "تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني!");
              
              // الانتقال مباشرة لصفحة إعادة تعيين كلمة المرور
              if (data.data && data.data.reset_token) {
                navigate(`/reset-password/${data.data.reset_token}`);
              } else {
                // في حالة عدم وجود التوكن، نعرض رسالة
                showAlert("info", "تحقق من بريدك الإلكتروني للحصول على رابط إعادة التعيين");
              }
            } catch (error) {
              const errorMessage = error.message || "فشل إرسال البريد! حاول مجددًا";
              showAlert("error", errorMessage);
              console.error(error);
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
              <div className="text-center mb-6">
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
                className={`w-full h-11 bg-primary text-white text-base font-cairo font-bold rounded-full hover:bg-secondary transition mt-6 ${btnState.className}`}
              >
                {isSubmitting ? "جاري المعالجة..." : "تعيين كلمة مرور جديدة"}
              </button>

              {/* Link to login page */}
              <div className="text-center text-sm font-cairo mt-4">
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
  );
}
