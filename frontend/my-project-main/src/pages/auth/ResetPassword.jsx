import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useParams, Link, useNavigate } from "react-router-dom";
import { resetPasswordSchema } from "../../utils/validationForms";

import AuthLayout from "../../layouts/AuthLayout";
import { PasswordInput } from "../../components/inputs/FormInput";
import { getButtonState } from "../../utils/buttonState";
import LoadingOverlay from "../../components/ui/LoadingOverlay";

import ResetHero from "../../assets/images/Reset password.svg";
// Api Axios
import { resetPasswordService } from "../../services/authService";
import usePageTitle from "../../hooks/usePageTitle";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Set page title
  usePageTitle("تعيين كلمة مرور جديدة");

  return (
    <>
      {loading && <LoadingOverlay message="جاري تعيين كلمة المرور الجديدة..." />}
      
      <AuthLayout
        expressiveImage={ResetHero}
        title="تعيين كلمة مرور جديدة"
        userPhotoClassName="mt-15" // Reduced from mt-20 to move content higher
        titleClassName="mb-4" // Reduced from mb-8 to move content higher
      >
        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={resetPasswordSchema}
          onSubmit={async (values, { setSubmitting, validateForm }) => {
            const errors = await validateForm();
            if (Object.keys(errors).length === 0) {
              setLoading(true);
              try {
                //  استخدام خدمة resetPasswordService
                const data = await resetPasswordService(token, {
                  password: values.password,
                  password_confirmation: values.confirmPassword
                });
          
                // Instead of showAlert, we'll navigate directly with a success message
                setTimeout(() => {
                  navigate("/password-reset-success");
                }, 2000);
              } catch (error) {
                const errorMessage = error.message || "فشل إعادة تعيين كلمة المرور!";
                // Instead of showAlert, we'll show the error in the UI
                console.error(error);
                // We could set an error state here to display the error in the UI
              } finally {
                setLoading(false);
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
                <div className="text-center mb-4">
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
                    className={`w-full h-11 mt-2 bg-[#2ca1db] text-white text-lg font-bold font-cairo rounded-full hover:bg-[#C4E4F5] transition ${btnState.className} flex items-center justify-center`}
                >
                  {isSubmitting ? "جاري التعيين..." : "تعيين كلمة المرور"}
                </button>

                {/* Link to login page */}
                <div className="text-center text-sm mb-4 font-cairo">
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
    </>
  );
}