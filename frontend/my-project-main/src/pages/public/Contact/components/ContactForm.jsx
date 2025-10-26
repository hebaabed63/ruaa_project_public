import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiUser, FiMail, FiMapPin, FiMessageSquare, FiSend, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useContactData } from '../index';

// Enhanced FormInput Component with Modern Styling
const ContactFormInput = ({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  icon: IconComponent, 
  required = false,
  ...props 
}) => (
  <motion.div 
    className="mb-8 w-full group"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {/* <label 
      htmlFor={name} 
      className="block text-sm font-semibold text-gray-800 mb-3 transition-colors duration-300 group-hover:text-primary"
      aria-label={label}
    >
      {label} {required && <span className="text-red-500 ml-1">*</span>}
    </label> */}
    
    <Field name={name}>
      {({ field, meta }) => (
        <div className="relative">
          <motion.div 
            className={`
              relative flex items-center bg-white border-2 rounded-xl shadow-sm
              transition-all duration-300 ease-in-out overflow-hidden
              ${
                meta.touched && meta.error 
                  ? 'border-red-400 bg-red-50/30' 
                  : 'border-gray-200 hover:border-gray-300 focus-within:border-primary focus-within:shadow-lg focus-within:shadow-primary/20'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* Icon Container */}
            {IconComponent && (
              <motion.div 
                className="flex items-center justify-center w-12 h-12 mr-3"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <IconComponent className={`w-5 h-5 transition-colors duration-300 ${
                  meta.touched && meta.error ? 'text-red-400' : 'text-gray-400 group-hover:text-primary'
                }`} />
              </motion.div>
            )}
            
            {/* Input Field */}
            <input
              {...field}
              {...props}
              id={name}
              type={type}
              placeholder={placeholder}
              className="
                flex-1 py-4  bg-transparent text-gray-800 placeholder-gray-400
                focus:outline-none focus:placeholder-gray-500
                transition-all duration-300 text-base font-medium
              "
              aria-describedby={meta.touched && meta.error ? `${name}-error` : undefined}
              aria-invalid={meta.touched && meta.error ? 'true' : 'false'}
            />
            
            {/* Success/Error Indicator */}
            <AnimatePresence>
              {meta.touched && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="mr-3"
                >
                  {meta.error ? (
                    <FiAlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <FiCheck className="w-5 h-5 text-green-500" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Error Message */}
          <AnimatePresence>
            {meta.touched && meta.error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mt-2"
              >
                <ErrorMessage name={name}>
                  {msg => (
                    <div 
                      id={`${name}-error`}
                      className="flex items-center gap-2 text-red-600 text-sm font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-200"
                      role="alert"
                    >
                      <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{msg}</span>
                    </div>
                  )}
                </ErrorMessage>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </Field>
  </motion.div>
);

// Enhanced TextArea Component with Modern Styling
const ContactTextArea = ({ label, name, placeholder, required = false, ...props }) => (
  <motion.div 
    className="mb-8 w-full group"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {/* <label 
      htmlFor={name} 
      className="block text-sm font-semibold text-gray-800 mb-3 transition-colors duration-300 group-hover:text-primary"
      aria-label={label}
    >
      {label} {required && <span className="text-red-500 ml-1">*</span>}
    </label> */}
    
    <Field name={name}>
      {({ field, meta }) => (
        <div className="relative">
          <motion.div 
            className={`
              relative bg-white border-2 rounded-xl shadow-sm overflow-hidden
              transition-all duration-300 ease-in-out
              ${
                meta.touched && meta.error 
                  ? 'border-red-400 bg-red-50/30' 
                  : 'border-gray-200 hover:border-gray-300 focus-within:border-primary focus-within:shadow-lg focus-within:shadow-primary/20'
              }
            `}
            whileHover={{ scale: 1.01 }}
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            {/* Message Icon */}
            {/* <div className="absolute top-4 right-4 z-10">
              <motion.div
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <FiMessageSquare className={`w-5 h-5 transition-colors duration-300 ${
                  meta.touched && meta.error ? 'text-red-400' : 'text-gray-400'
                }`} />
              </motion.div>
            </div>
             */}
            <textarea
              {...field}
              {...props}
              id={name}
              placeholder={placeholder}
              rows="6"
              className="
                w-full py-4 pr-7 bg-transparent text-gray-800 placeholder-gray-400
                focus:outline-none focus:placeholder-gray-500 resize-none
                transition-all duration-300 text-base font-medium
              "
              aria-describedby={meta.touched && meta.error ? `${name}-error` : undefined}
              aria-invalid={meta.touched && meta.error ? 'true' : 'false'}
            />
            
            {/* Character count indicator */}
            <div className="absolute bottom-3 left-3 text-xs text-gray-400">
              {field.value?.length || 0} / 1000
            </div>
          </motion.div>
          
          {/* Error Message */}
          <AnimatePresence>
            {meta.touched && meta.error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mt-2"
              >
                <ErrorMessage name={name}>
                  {msg => (
                    <div 
                      id={`${name}-error`}
                      className="flex items-center gap-2 text-red-600 text-sm font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-200"
                      role="alert"
                    >
                      <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{msg}</span>
                    </div>
                  )}
                </ErrorMessage>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </Field>
  </motion.div>
);

// Contact Form Validation Schema
const contactFormSchema = Yup.object().shape({
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

const ContactForm = ({ data }) => {
  const { submitForm, submissionCount } = useContactData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const initialValues = {
    name: '',
    email: '',
    address: '',
    message: ''
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setIsSubmitting(true);
      setSubmissionSuccess(false);
      
      await submitForm(values);
      
      setSubmissionSuccess(true);
      resetForm();
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setSubmissionSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="px-6  bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30" dir="rtl">
      <div className="max-w-3xl mx-auto">
        
        {/* Form Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          
          
          
          
        
          
          {data?.description && (
            <motion.p 
              className="text-sm text-gray-500 max-w-lg mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {data.description}
            </motion.p>
          )}
          
          {submissionCount > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-6 py-3 rounded-full text-sm mt-6 shadow-md"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 0.6 }}
              >
                <FiCheck className="w-5 h-5" />
              </motion.div>
              تم إرسال {submissionCount} رسالة بنجاح
            </motion.div>
          )}
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          className="bg-[#CADBEA] backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-gray-100"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          whileHover={{ 
            shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            transition: { duration: 0.3 }
          }}
        >
          
          {/* Success Message */}
          <AnimatePresence>
            {submissionSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-800 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 shadow-sm"
                role="alert"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <FiCheck className="w-6 h-6 text-green-600" />
                </motion.div>
                <div>
                  <p className="font-semibold">تم إرسال رسالتك بنجاح!</p>
                  <p className="text-sm text-green-600">سنتواصل معك قريباً في أقرب وقت ممكن.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Formik
            initialValues={initialValues}
            validationSchema={contactFormSchema}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({ isValid, dirty }) => (
              <Form className="space-y-6 flex flex-col items-start" noValidate>
                  <motion.p 
            className="text-4xl text-primary font-bold mb-4 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {data?.subtitle || 'شاركنا ما تودّ إخبارنا به!'}
          </motion.p>
                {/* Name Field */}
                <ContactFormInput
                  label="الاسم الكامل"
                  name="name"
                  type="text"
                  placeholder="اسم المستخدم"
                  icon={FiUser}
                  required
                  autoComplete="name"
                />

                {/* Email Field */}
                <ContactFormInput
                  label="البريد الإلكتروني"
                  name="email"
                  type="email"
                  placeholder="البريد الإلكتروني"
                  icon={FiMail}
                  required
                  autoComplete="email"
                />

                {/* Address Field */}
                <ContactFormInput
                  label="العنوان"
                  name="address"
                  type="text"
                  placeholder="العنوان"
                  icon={FiMapPin}
                  required
                  autoComplete="address"
                />

                {/* Message Field */}
                <ContactTextArea
                  label="الرسالة"
                  name="message"
                  placeholder="الرسالة.."
                  required
                />

                {/* Submit Button */}
                <div className="w-full flex justify-center mt-10">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !isValid || !dirty}
                    className={`
                      relative overflow-hidden group flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold 
                      transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 min-w-[180px]
                      ${
                        isSubmitting || !isValid || !dirty
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-primary text-white hover:from-blue-600 hover:to-primary focus:ring-primary/30 shadow-lg hover:shadow-xl'
                      }
                    `}
                    whileHover={
                      isValid && dirty && !isSubmitting ? { 
                        scale: 1.02,
                        y: -2,
                        transition: { duration: 0.2 }
                      } : {}
                    }
                    whileTap={
                      isValid && dirty && !isSubmitting ? { 
                        scale: 0.98,
                        y: 0
                      } : {}
                    }
                    aria-label="إرسال نموذج التواصل"
                  >
                    {/* Background animation */}
                    {!isSubmitting && isValid && dirty && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                    )}
                    
                    {/* Button content */}
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.div
                          key="submitting"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-3"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, repeatType: "loop", ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          <span>جاري الإرسال...</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="submit"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-3"
                        >
                          <motion.div
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FiSend className="w-5 h-5" />
                          </motion.div>
                          <span>تواصل معنا</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                

              </Form>
            )}
          </Formik>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactForm;