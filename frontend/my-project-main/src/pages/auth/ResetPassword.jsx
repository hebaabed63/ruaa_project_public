import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useParams, Link, useNavigate } from "react-router-dom"; // <--- أضف useNavigate
import { resetPasswordSchema } from "../../utils/validationForms";

import AuthLayout from "../../layouts/AuthLayout";
import { PasswordInput } from "../../components/inputs/FormInput";
import { getButtonState } from "../../utils/buttonState";
import { showAlert } from "../../utils/SweetAlert";

import ResetHero from "../../assets/images/Reset password.svg";
// Api Axios
import { resetPasswordService } from "../../services/authService";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate(); // <--- عرف navigate
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <AuthLayout
      expressiveImage={ResetHero}
      title="تعيين كلمة مرور جديدة"
      userPhotoClassName="mt-20"
      titleClassName="mb-8"
    >
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={resetPasswordSchema}
        onSubmit={async (values, { setSubmitting, validateForm }) => {
          const errors = await validateForm();
          if (Object.keys(errors).length === 0) {
            try {
              //  استخدام خدمة resetPasswordService
              const data = await resetPasswordService(token, {
                password: values.password,
                password_confirmation: values.confirmPassword
              });
        
              showAlert("success", "تم تعيين كلمة المرور الجديدة بنجاح!");
              setTimeout(() => {
                navigate("/password-reset-success");
              }, 2000);
            } catch (error) {
              const errorMessage = error.message || "فشل إعادة تعيين كلمة المرور!";
              showAlert("error", errorMessage);
              console.error(error);
            }
          }
          setSubmitting(false);
        }}
        
      >
        {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => {
          const btnState = getButtonState(
            !values.password || !values.confirmPassword
          );

          return (
            <Form className="w-full">
              {/* Description text */}
              <div className="text-center mb-6">
                <p className="text-gray-600 text-sm font-cairo leading-relaxed">
                  قم بإدخال كلمة المرور الجديدة التي تريد استخدامها<br/>
                  لتسجيل الدخول إلى حسابك
                </p>
              </div>
              
              {/* New Password */}
              <PasswordInput
                value={values.password}
                onChange={handleChange("password")}
                onBlur={handleBlur("password")}
                placeholder="كلمة المرور الجديدة"
                showPassword={showPassword}
                toggleShowPassword={() => setShowPassword(!showPassword)}
                error={touched.password && errors.password ? errors.password : ""}
              />

              {/* Confirm New Password */}
              <PasswordInput
                value={values.confirmPassword}
                onChange={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                placeholder="تأكيد كلمة المرور"
                showPassword={showConfirmPassword}
                toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ""}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={btnState.disabled || isSubmitting}
                className={`w-full h-12 bg-primary text-white text-lg font-cairo font-medium rounded-full hover:bg-secondary transition mt-8 mb-2 ${btnState.className}`}
              >
                {isSubmitting ? "جاري التعيين..." : "تعيين كلمة المرور"}
              </button>

              {/* Link to login page */}
              <div className="text-center text-sm mb-8 font-cairo">
                <span className="text-black font-bold">العودة إلى تسجيل الدخول؟ </span>
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
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
