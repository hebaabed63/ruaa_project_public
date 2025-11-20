import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Formik, Form } from "formik";
import { registerSchema } from "../../utils/validationForms";

import AuthLayout from "../../layouts/AuthLayout";
import { EmailInput, PasswordInput, TextInput } from "../../components/inputs/FormInput";
import ButtonSpinner from "../../components/ui/ButtonSpinner";
import LoadingOverlay from "../../components/ui/LoadingOverlay";

import { getButtonState } from "../../utils/buttonState";
import { showAlert } from "../../utils/SweetAlert";

import RegisterHero from "../../assets/images/Sign up.svg";
import { AuthContext } from "../../contexts/AuthContext";
import { 
  FaUser, 
  FaUserTie, 
  FaSchool, 
  FaUsers, 
  FaChild,
  FaSpinner,
  FaExclamationCircle,
  FaInfoCircle
} from 'react-icons/fa';
// Api Axios
import { registerService } from "../../services/authService";
import usePageTitle from "../../hooks/usePageTitle";

export default function Registration() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [error, setError] = '';

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'general';

  // Set page title based on registration type
  usePageTitle(getPageTitle(type));

  // Function to get page title based on registration type
  function getPageTitle(regType) {
    switch (regType) {
      case 'supervisor':
        return 'تسجيل مشرف جديد';
      case 'school_manager':
        return 'تسجيل مدير مدرسة';
      case 'parent':
        return 'تسجيل ولي أمر';
      case 'student':
        return 'تسجيل طالب';
      default:
        return 'إنشاء حساب';
    }
  }

  // Role configurations for different user types
  const roleConfig = {
    general: {
      title: 'إنشاء حساب',
      icon: FaUser,
      color: 'bg-primary',
      fields: ['fullName', 'email', 'password', 'confirmPassword'],
      description: 'قم بإنشاء حساب جديد في النظام'
    },
    supervisor: {
      title: 'تسجيل مشرف جديد',
      icon: FaUserTie,
      color: 'bg-primary',
      fields: ['fullName', 'email', 'phone', 'city', 'password', 'confirmPassword'],
      description: 'قم بتسجيل بياناتك كمشرف في النظام'
    },
    school_manager: {
      title: 'تسجيل مدير مدرسة',
      icon: FaSchool,
      color: 'bg-primary',
      fields: ['fullName', 'email', 'phone', 'schoolName', 'schoolType', 'city', 'password', 'confirmPassword'],
      description: 'قم بتسجيل بياناتك ومعلومات المدرسة'
    },
    parent: {
      title: 'تسجيل ولي أمر',
      icon: FaUsers,
      color: 'bg-primary',
      fields: ['fullName', 'email', 'phone', 'nationalId', 'city', 'password', 'confirmPassword'],
      description: 'قم بتسجيل بياناتك كولي أمر'
    },
    student: {
      title: 'تسجيل طالب',
      icon: FaChild,
      color: 'bg-primary',
      fields: ['fullName', 'email', 'phone', 'studentId', 'grade', 'password', 'confirmPassword'],
      description: 'قم بتسجيل بيانات الطالب'
    }

  };

  const currentConfig = roleConfig[type] || roleConfig.general;

  // Validate token if present
  useEffect(() => {
    const validateRegistrationToken = async () => {
      if (token) {
        setLoading(true);
        try {
          // Simulate API call to validate token
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock token validation - replace with actual API call
          const mockTokenData = {
            id: token,
            role: type,
            createdBy: 'Admin',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            isValid: true,
            schoolId: token.includes('school') ? '12345' : null
          };

          if (!mockTokenData.isValid || new Date() > mockTokenData.expiresAt) {
            setError('رابط التسجيل منتهي الصلاحية أو غير صالح');
            return;
          }

          setRegistrationData(mockTokenData);
        } catch (err) {
          setError('حدث خطأ في التحقق من رابط التسجيل');
        } finally {
          setLoading(false);
        }
      }
    };

    validateRegistrationToken();
  }, [token, type]);

  // Generate initial form values based on user type
  const getInitialValues = () => {
    const baseValues = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    };

    // Add additional fields based on user type
    const additionalFields = {
      phone: "",
      city: "",
      nationalId: "",
      schoolName: "",
      schoolType: "",
      studentId: "",
      grade: ""
    };

    return { ...baseValues, ...additionalFields };
  };

  // Check if field should be shown for current user type
  const shouldShowField = (fieldName) => {
    return currentConfig.fields.includes(fieldName);
  };

  // Render additional fields based on user type
  const renderAdditionalFields = (values, handleChange, handleBlur, errors, touched) => {
    const additionalFields = [];

    if (shouldShowField('phone')) {
      additionalFields.push(
        <TextInput
          key="phone"
          value={values.phone}
          onChange={handleChange("phone")}
          onBlur={handleBlur("phone")}
          placeholder="رقم الهاتف"
          error={touched.phone && errors.phone ? errors.phone : ""}
        />
      );
    }

    if (shouldShowField('city')) {
      additionalFields.push(
        <TextInput
          key="city"
          value={values.city}
          onChange={handleChange("city")}
          onBlur={handleBlur("city")}
          placeholder="المدينة"
          error={touched.city && errors.city ? errors.city : ""}
        />
      );
    }

    if (shouldShowField('nationalId')) {
      additionalFields.push(
        <TextInput
          key="nationalId"
          value={values.nationalId}
          onChange={handleChange("nationalId")}
          onBlur={handleBlur("nationalId")}
          placeholder="رقم الهوية الوطنية"
          error={touched.nationalId && errors.nationalId ? errors.nationalId : ""}
        />
      );
    }

    if (shouldShowField('schoolName')) {
      additionalFields.push(
        <TextInput
          key="schoolName"
          value={values.schoolName}
          onChange={handleChange("schoolName")}
          onBlur={handleBlur("schoolName")}
          placeholder="اسم المدرسة"
          error={touched.schoolName && errors.schoolName ? errors.schoolName : ""}
        />
      );
    }

    if (shouldShowField('schoolType')) {
      additionalFields.push(
        <div key="schoolType" className="space-y-1">
          <select
            name="schoolType"
            value={values.schoolType}
            onChange={handleChange("schoolType")}
            onBlur={handleBlur("schoolType")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          >
            <option value="">اختر نوع المدرسة</option>
            <option value="ابتدائي">ابتدائي</option>
            <option value="متوسط">متوسط</option>
            <option value="ثانوي">ثانوي</option>
            <option value="مختلط">مختلط</option>
          </select>
          {touched.schoolType && errors.schoolType && (
            <p className="text-red-500 text-sm">{errors.schoolType}</p>
          )}
        </div>
      );
    }

    if (shouldShowField('studentId')) {
      additionalFields.push(
        <TextInput
          key="studentId"
          value={values.studentId}
          onChange={handleChange("studentId")}
          onBlur={handleBlur("studentId")}
          placeholder="رقم الطالب"
          error={touched.studentId && errors.studentId ? errors.studentId : ""}
        />
      );
    }

    if (shouldShowField('grade')) {
      additionalFields.push(
        <div key="grade" className="space-y-1">
          <select
            name="grade"
            value={values.grade}
            onChange={handleChange("grade")}
            onBlur={handleBlur("grade")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          >
            <option value="">اختر الصف الدراسي</option>
            <option value="الأول الابتدائي">الأول الابتدائي</option>
            <option value="الثاني الابتدائي">الثاني الابتدائي</option>
            <option value="الثالث الابتدائي">الثالث الابتدائي</option>
            <option value="الرابع الابتدائي">الرابع الابتدائي</option>
            <option value="الخامس الابتدائي">الخامس الابتدائي</option>
            <option value="السادس الابتدائي">السادس الابتدائي</option>
            <option value="الأول المتوسط">الأول المتوسط</option>
            <option value="الثاني المتوسط">الثاني المتوسط</option>
            <option value="الثالث المتوسط">الثالث المتوسط</option>
            <option value="الأول الثانوي">الأول الثانوي</option>
            <option value="الثاني الثانوي">الثاني الثانوي</option>
            <option value="الثالث الثانوي">الثالث الثانوي</option>
          </select>
          {touched.grade && errors.grade && (
            <p className="text-red-500 text-sm">{errors.grade}</p>
          )}
        </div>
      );
    }

    return additionalFields;
  };

  return (
    <>
      {/* Show loading overlay when submitting registration */}
      {loading === 'submitting' && <LoadingOverlay message="جاري إنشاء الحساب وإعداد لوحة التحكم..." />}
      
      {/* Loading state for token validation */}
      {loading === true && (
        <AuthLayout
          expressiveImage={RegisterHero}
          title={currentConfig.title}
          userPhotoClassName="mt-6" // Reduced from mt-8 to move content higher
          titleClassName="mb-1" // Reduced from mb-2 to move content higher
        >
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <FaSpinner className="text-4xl text-primary animate-spin" />
            <p className="text-gray-600">جاري التحقق من رابط التسجيل...</p>
          </div>
        </AuthLayout>
      )}

      {/* Error state */}
      {error && (
        <AuthLayout
          expressiveImage={RegisterHero}
          title="خطأ في التسجيل"
          userPhotoClassName="mt-6" // Reduced from mt-8 to move content higher
          titleClassName="mb-1" // Reduced from mb-2 to move content higher
        >
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
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
      )}

      {/* Registration form */}
      {!loading && !error && (
        <AuthLayout
          expressiveImage={RegisterHero}
          title={currentConfig.title}
          userPhotoClassName="mt-6" // Reduced from mt-8 to move content higher
          titleClassName="mb-1" // Reduced from mb-2 to move content higher
        >
          {/* Registration Type Indicator */}
          {(token || type !== 'general') && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"> {/* Reduced from mb-6 */}
              <div className="flex items-center space-x-3 space-x-reverse">
                <currentConfig.icon className={`text-xl ${currentConfig.color.replace('bg-', 'text-')}`} />
                <div>
                  <h3 className="font-medium text-gray-900">{currentConfig.title}</h3>
                  <p className="text-sm text-gray-600">{currentConfig.description}</p>
                </div>
              </div>
              {registrationData && (
                <div className="mt-2 flex items-center space-x-2 space-x-reverse text-sm text-blue-600">
                  <FaInfoCircle />
                  <span>تم إرسال الدعوة بواسطة: {registrationData.createdBy}</span>
                </div>
              )}
            </div>
          )}

          <Formik
            initialValues={getInitialValues()}
            validationSchema={registerSchema}
            onSubmit={async (values, { setSubmitting, validateForm }) => {
              const errors = await validateForm();
              if (Object.keys(errors).length === 0) {
                setSubmitting(true);
                
                try {
                  console.log('Submitting registration with data:', values);
                  
                  // Add user type and token to submission data
                  const submissionData = {
                    ...values,
                    userType: type,
                    registrationToken: token,
                    tokenData: registrationData
                  };
                  
                  // استخدام خدمة التسجيل الجاهزة
                  const response = await registerService(submissionData);
                  
                  console.log('Registration response:', response);
            
                  // التحقق من نجاح العملية
                  if (response && response.success) {
                    // Set loading state to show spinner
                    setLoading('submitting');
                    
                    // Wait a moment to show the spinner
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    // Check if the response includes a redirect URL
                    if (response.data && response.data.redirect_url) {
                      // Redirect to the check-email page
                      window.location.href = response.data.redirect_url;
                    } else {
                      // Fallback to login page
                      const successMessage = type === 'general' 
                        ? "تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول"
                        : `تم تسجيل ${currentConfig.title.replace('تسجيل ', '')} بنجاح! يمكنك الآن تسجيل الدخول`;
                      
                      // Navigate to login after showing spinner
                      navigate("/login");
                    }
                  } else {
                    throw new Error(response?.message || "حدث خطأ أثناء التسجيل");
                  }

                } catch (error) {
                  console.error('Registration error:', error);
                  
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
                  setLoading(false);
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
                !values.agreeTerms ||
                (shouldShowField('phone') && !values.phone) ||
                (shouldShowField('city') && !values.city) ||
                (shouldShowField('schoolName') && !values.schoolName) ||
                (shouldShowField('schoolType') && !values.schoolType) ||
                (shouldShowField('nationalId') && !values.nationalId) ||
                (shouldShowField('studentId') && !values.studentId) ||
                (shouldShowField('grade') && !values.grade)
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

                  {/* Additional fields based on user type */}
                  {renderAdditionalFields(values, handleChange, handleBlur, errors, touched)}

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
                  <div className="flex items-center gap-1.5 font-cairo font-normal px-2 mb-1 text-xs text-black">
                    <input
                      type="checkbox"
                      checked={values.agreeTerms}
                      onChange={handleChange("agreeTerms")}
                      className="w-3.5 h-3.5 accent-primary"
                    />
                    <span className="text-xs">
                      أوافق على{" "}
                      <Link to="/terms/regular" className="text-blue-600 underline text-xs">
                        شروط الاستخدام
                      </Link>{" "}
                      و{" "}
                      <Link to="/privacy/regular" className="text-blue-600 underline text-xs">
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
                      <><ButtonSpinner size="sm" className="ml-2" />جاري إنشاء الحساب...</>
                    ) : (
                      currentConfig.title
                    )}
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
                </Form>
              );
            }}
          </Formik>
        </AuthLayout>
      )}
    </>
  );
}
