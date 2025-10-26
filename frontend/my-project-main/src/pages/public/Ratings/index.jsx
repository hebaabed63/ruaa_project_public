import React, { createContext, useContext, useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StatisticsSection from "./components/StatisticsSection";
import ParentsRate from "./components/ParentsRate";
import EvaluationCriteria from "./components/EvaluationCriteria";
import headerimg from '../../../assets/images/headerimg1.png';

// Create Context for Ratings data and state management
const RatingsContext = createContext();

// Custom hook to use the Ratings context
export const useRatings = () => {
  const context = useContext(RatingsContext);
  if (!context) {
    throw new Error('useRatings must be used within a RatingsProvider');
  }
  return context;
};

// Mock API service for simulating backend data
const ratingsApiService = {
  getPageData: async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      pageInfo: {
        title: "التقييمات",
        description: "منصة شاملة لتقييم المدارس وتطوير جودة التعليم"
      },
      statistics: {
        stats: [
          {
            id: 1,
            icon: "building",
            value: 23,
            description: "تمكّنا حتى الآن من تقييم ثلاث وعشرون مدارس مختلفة، مما يوفّر صورة أوّلية عن جودة التعليم والخدمات المقدّمة",
            animationConfig: {
              dashArray: "200",
              dashOffset: "30",
              rotation: "120"
            }
          },
          {
            id: 2,
            icon: "transparency",
            value: 1142,
            description: "أُجري حتى الآن عشرات التقييمات تفصيلية من قِبل المشرفين والأهالي لتغطية مختلف الجوانب التعليمية والإدارية",
            animationConfig: {
              height: "h-[300px]",
              dashArray: "251",
              dashOffset: "37",
              rotation: "240"
            }
          },
          {
            id: 3,
            icon: "improvement",
            value: 85,
            valueType: "percentage",
            description: "المؤشرات تُظهر أن الأداء العام للمدارس مصنّف عند مستوى \"جيد جداً\"، مع فرص للتحسين نحو التميّز.",
            animationConfig: {
             dashArray: "251",
              dashOffset: "37",
              rotation: "100"
            }
          }
        ]
      },
      parentsReviews: {
        reviews: [
          {
            id: 1,
            parentType: "أب",
            timestamp: "الآن",
            comment: "المدرسة وفّرت بيئة تعليمية ممتازة لبنتي، مستوى الاهتمام بالطلاب عالي جداً.",
            rating: 5,
            marginClass: ""
          },
          {
            id: 2,
            parentType: "أم",
            timestamp: "قبل يومين",
            comment: "هناك بعض الملاحظات على المرافق، لكن بشكل عام التجربة إيجابية والتعليم مميز.",
            rating: 4,
            marginClass: "mr-20"
          },
          {
            id: 3,
            parentType: "أم",
            timestamp: "قبل ساعة",
            comment: "أتمنى إضافة أنشطة أكثر في الرياضيات.",
            rating: 4,
            marginClass: ""
          }
        ],
        callToAction: {
          title: "ساهم بتقييمك الآن!",
          subtitle: "لتشجيع التطوير وبناء بيئة تعليمية أفضل.",
          buttonText: "قيّم مدرستك الآن"
        }
      },
      evaluationCriteria: {
        title: "معايير التقييم:",
        schools: [
          {
            id: 1,
            name: "مدرسة النجاح الحديثة",
            description: "حصلت على أعلى تقييم في جودة التعليم لهذا الشهر",
            rating: 4.5,
            votes: 6896,
            imageUrl: "School 1.jpg",
            criteria: [
              { label: "جودة التعليم", percentage: 95 },
              { label: "الإدارة والانضباط المدرسي", percentage: 90 },
              { label: "النظافة والبيئة المدرسية", percentage: 75 },
              { label: "الأنشطة والفعاليات", percentage: 65 },
              { label: "المرافق والخدمات", percentage: 90 }
            ]
          },
          {
            id: 2,
            name: "مدرسِة الأمل النموذجيّة",
            description: "حصلت على أعلى تقييم في الأنشطة لهذا الشهر.",
            rating: 4.2,
            votes: 2896,
            imageUrl: "School 1.jpg",
            criteria: [
              { label: "جودة التعليم", percentage: 80 },
              { label: "الإدارة والانضباط المدرسي", percentage: 90 },
              { label: "النظافة والبيئة المدرسية", percentage: 80 },
              { label: "الأنشطة والفعاليات", percentage: 100 },
              { label: "المرافق والخدمات", percentage: 95 }
            ]
          }
        ]
      }
    };
  },

  submitRating: async (ratingData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success/error response
    const success = Math.random() > 0.3; // 70% success rate
    
    if (success) {
      return {
        success: true,
        message: "تم إرسال تقييمك بنجاح! شكراً لمساهمتك في تطوير التعليم.",
        data: { id: Date.now(), ...ratingData }
      };
    } else {
      throw new Error("حدث خطأ أثناء إرسال التقييم. يرجى المحاولة مرة أخرى.");
    }
  }
};

// Loading component
const LoadingComponent = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">جاري تحميل البيانات...</p>
    </div>
  </div>
);

// Error component
const ErrorComponent = ({ error, onRetry }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center bg-red-50 p-8 rounded-lg max-w-md">
      <div className="text-red-500 text-5xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold text-red-700 mb-2">حدث خطأ في التحميل</h3>
      <p className="text-red-600 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-300"
      >
        إعادة المحاولة
      </button>
    </div>
  </div>
);

// Success notification component
const SuccessNotification = ({ message, onClose }) => (
  <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-md">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="text-2xl mr-3">✅</div>
        <p className="font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 font-bold text-xl ml-3"
      >
        ×
      </button>
    </div>
  </div>
);

// Ratings Provider Component
const RatingsProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch page data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const pageData = await ratingsApiService.getPageData();
      setData(pageData);
    } catch (err) {
      setError(err.message || "فشل في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  // Submit rating function
  const submitRating = async (ratingData) => {
    try {
      setSubmitLoading(true);
      const response = await ratingsApiService.submitRating(ratingData);
      setSuccessMessage(response.message);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
      return response;
    } catch (err) {
      throw new Error(err.message || "فشل في إرسال التقييم");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const contextValue = {
    data,
    loading,
    error,
    submitLoading,
    successMessage,
    fetchData,
    submitRating,
    setSuccessMessage
  };

  return (
    <RatingsContext.Provider value={contextValue}>
      {children}
      {successMessage && (
        <SuccessNotification
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
    </RatingsContext.Provider>
  );
};

// Main Ratings Component
export default function Ratings() {
  return (
    <RatingsProvider>
      <RatingsContent />
    </RatingsProvider>
  );
}

// Content component that uses the context
const RatingsContent = () => {
  const { data, loading, error, fetchData } = useRatings();

  if (loading) {
    return (
      <div className="font-cairo bg-white text-black" dir="rtl">
        <Header title="التقييمات" />
        <LoadingComponent />
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-cairo bg-white text-black" dir="rtl">
        <Header title="التقييمات" />
        <ErrorComponent error={error} onRetry={fetchData} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-cairo bg-white text-black" dir="rtl">
      {/* Header */}

 {/* الهيدر مع الخلفية */}
      <div className="relative h-[210px]">
        <img 
          src={headerimg} 
          alt="خلفية الهيدر" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-600/50 to-cyan-950/10"></div>
        <Header title={data?.pageInfo?.title || "التقييمات"} variant="default" />
      </div>


      {/* <Header title={data?.pageInfo?.title || "التقييمات"} /> */}

      {/* Statistics Section */}
      <StatisticsSection data={data?.statistics} />

      {/* Parents Reviews Section */}
      <ParentsRate data={data?.parentsReviews} />

      {/* Evaluation Criteria Section */}
      <EvaluationCriteria data={data?.evaluationCriteria} />

      {/* Footer */}
      <Footer />
    </div>
  );
};