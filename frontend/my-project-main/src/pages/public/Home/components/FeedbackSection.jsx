import React, { useState } from "react";
import { motion } from "framer-motion";
import { ReactComponent as ChevronRight } from "../../../../assets/icons/whiteSlide.svg";
// عدّل المسار حسب هيكلة مشروعك إن لزم
import feedbackService from "../../../../services/feedback.service";

const FeedbackSection = () => {
  // 1=needs improvement? لا: سنستخدم 3=excellent, 2=good, 1=needs improvement
  const [selectedRating, setSelectedRating] = useState(null); // 1 | 2 | 3
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // خريطة تحويل الرقم إلى mood الذي ينتظره الباك
  const moodByRating = {
    3: "happy",   // ممتاز 😊
    2: "neutral", // جيد 😐
    1: "sad",     // يحتاج تحسين 😞
  };

  const validateForm = () => {
    const errors = {};
    if (!selectedRating) {
      errors.rating = "يرجى اختيار تقييم";
    }
    if (!feedback.trim()) {
      errors.feedback = "يرجى كتابة تعليقك";
    } else if (feedback.length < 10) {
      errors.feedback = "التعليق يجب أن يكون على الأقل 10 أحرف";
    }
    return errors;
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // تجهيز الحمولة للباك إند
      const payload = {
        rating: selectedRating,                // 1|2|3
        mood: moodByRating[selectedRating] ?? null, // 'happy' | 'neutral' | 'sad'
        comment: feedback.trim(),             // نص
      };

      const res = await feedbackService.submit(payload);

      // نجاح
      setSubmitSuccess(true);
      // إعادة الضبط
      setSelectedRating(null);
      setFeedback("");

      // إخفاء رسالة النجاح بعد 3 ثواني
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      // رسالة ودّية خطأ
      const message =
        error?.data?.message ||
        error?.message ||
        "فشل في إرسال التقييم. يرجى المحاولة مرة أخرى.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-cairo" dir="rtl">
      <div className="bg-primary py-16 px-8">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            className="text-3xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            شاركنا رأيك عن المنصة
          </motion.h2>

          <motion.p
            className="text-blue-100 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            رأيك يهمنا في تطوير وتحسين خدماتنا ! :)
          </motion.p>

          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✓</div>
                <h3 className="text-xl font-bold text-green-600 mb-2">
                  تم إرسال التقييم بنجاح!
                </h3>
                <p className="text-gray-600">شكراً لملاحظاتك القيمة</p>
              </div>
            ) : (
              <>
                <motion.h3
                  className="text-gray-800 font-semibold text-lg mb-6 text-right"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  ما هو تقييمك العام للمنصة؟
                </motion.h3>

                <div className="flex justify-center gap-8 mb-8">
                  {/* ممتاز = 3 */}
                  <motion.button
                    type="button"
                    onClick={() => setSelectedRating(3)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-colors ${
                      selectedRating === 3 ? "bg-green-100" : "hover:bg-gray-50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    aria-label="تقييم ممتاز"
                  >
                    <div className="text-4xl">😊</div>
                    <span className="text-sm text-gray-600">ممتاز</span>
                  </motion.button>

                  {/* جيد = 2 */}
                  <motion.button
                    type="button"
                    onClick={() => setSelectedRating(2)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-colors ${
                      selectedRating === 2 ? "bg-yellow-100" : "hover:bg-gray-50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    aria-label="تقييم جيد"
                  >
                    <div className="text-4xl">😐</div>
                    <span className="text-sm text-gray-600">جيد</span>
                  </motion.button>

                  {/* يحتاج تحسين = 1 */}
                  <motion.button
                    type="button"
                    onClick={() => setSelectedRating(1)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-colors ${
                      selectedRating === 1 ? "bg-orange-100" : "hover:bg-gray-50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    aria-label="يحتاج تحسين"
                  >
                    <div className="text-4xl">😞</div>
                    <span className="text-sm text-gray-600">يحتاج تحسين</span>
                  </motion.button>
                </div>

                {formErrors.rating && (
                  <div className="text-red-500 text-sm mb-4 text-center">
                    {formErrors.rating}
                  </div>
                )}

                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <h2 className="justify-self-start mb-5">
                    ما الذي أعجبك في المنصة وما الذي تقترح تحسينه؟
                  </h2>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="اكتب تعليقك هنا..."
                    className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-none text-right placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir="rtl"
                    maxLength={500}
                  />
                  {formErrors.feedback && (
                    <div className="text-red-500 text-sm mt-1">
                      {formErrors.feedback}
                    </div>
                  )}
                </motion.div>

                {submitError && (
                  <div className="text-red-500 text-sm mb-4 text-center">
                    {submitError}
                  </div>
                )}

                <motion.button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting}
                  className={`w-full bg-primary hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      إرسال التقييم
                      <ChevronRight className="w-6 h-6 text-white mr-3" />
                    </>
                  )}
                </motion.button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSection;
