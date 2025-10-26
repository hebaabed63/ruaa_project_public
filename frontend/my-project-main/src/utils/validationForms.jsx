import * as Yup from "yup";

// Login form validation schema
export const loginSchema = Yup.object().shape({
    email: Yup.string()
    .email('البريد الإلكتروني غير صالح')
    .required('البريد الإلكتروني مطلوب'),
  password: Yup.string()
    .required("كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .matches(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
    .matches(/[a-z]/, "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل")
    .matches(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل")
    .matches(/[!@#$%^&*]/, "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل"),
});

// Register form validation schema
export const registerSchema = Yup.object().shape({
  username: Yup.string()
  .required("اسم المستخدم مطلوب")
  .min(4, "اسم المستخدم يجب أن يكون أكثر من 4 أحرف")
  .matches(/^[A-Za-z0-9]+$/, "اسم المستخدم يجب أن يكون بالإنجليزية فقط"),
  email: Yup.string()
    .email("صيغة البريد الإلكتروني غير صحيحة")
    .required("البريد الإلكتروني مطلوب"),
  password: Yup.string()
    .required("كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .matches(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
    .matches(/[a-z]/, "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل")
    .matches(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل")
    .matches(/[!@#$%^&*]/, "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "كلمتا المرور غير متطابقتين")
    .required("تأكيد كلمة المرور مطلوب"),
  agreeTerms: Yup.bool()
    .oneOf([true], "يجب الموافقة على الشروط وسياسة الخصوصية"),
});

// Forgot password schema
export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("صيغة البريد الإلكتروني غير صحيحة")
    .required("البريد الإلكتروني مطلوب"),
});

// Reset password schema
export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .matches(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
    .matches(/[a-z]/, "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل")
    .matches(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل")
    .matches(/[!@#$%^&*]/, "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "كلمتا المرور غير متطابقتين")
    .required("تأكيد كلمة المرور مطلوب"),
});

// Contact form validation schema
export const contactFormSchema = Yup.object().shape({
  name: Yup.string()
    .required('الاسم مطلوب')
    .min(2, 'الاسم يجب أن يكون أكثر من حرفين')
    .max(50, 'الاسم يجب أن يكون أقل من 50 حرف')
    .matches(/^[\u0600-\u06FFa-zA-Z\s]+$/, 'الاسم يجب أن يحتوي على أحرف فقط'),
  
  email: Yup.string()
    .email('صيغة البريد الإلكتروني غير صحيحة')
    .required('البريد الإلكتروني مطلوب')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'يجب إدخال بريد إلكتروني صحيح'),
  
  address: Yup.string()
    .required('العنوان مطلوب')
    .min(5, 'العنوان يجب أن يكون أكثر من 5 أحرف')
    .max(100, 'العنوان يجب أن يكون أقل من 100 حرف'),
  
  message: Yup.string()
    .required('الرسالة مطلوبة')
    .min(10, 'الرسالة يجب أن تكون أكثر من 10 أحرف')
    .max(1000, 'الرسالة يجب أن تكون أقل من 1000 حرف')
});