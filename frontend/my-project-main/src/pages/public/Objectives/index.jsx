import React, { useState, useEffect, createContext, useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PrimaryGoal from "./components/PrimaryGoal";
import SecondaryGoals from "./components/SecondaryGoals";
import ImpactSection from "./components/ImpactSection";
import VisionSection from "./components/VisionSection";
import headerimg from '../../../assets/images/headerimg1.png';

// Context for Objectives page data management
const ObjectivesContext = createContext();

// Custom hook to access Objectives context
export const useObjectivesData = () => {
  const context = useContext(ObjectivesContext);
  if (!context) {
    throw new Error('useObjectivesData must be used within ObjectivesProvider');
  }
  return context;
};

// Mock API service to simulate backend calls
const objectivesApiService = {
  getPageData: async () => {
    // Simulate realistic API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return {
      pageInfo: {
        title: "الأهداف",
        lastUpdated: new Date().toISOString(),
        description: "أهداف منصة رؤى للتقييم التعليمي"
      },
      primaryGoal: {
        title: "الهدف الأساسي",
        description: "تمكين الأهالي من اختيار المدارس المناسبة\nلأبنائهم من خلال تقييمات موثوقة وشفّافة",
        callToAction: {
          text: "قيّم مدرستك الآن",
          link: "/evaluate",
          enabled: true
        },
        motivationalText: {
          part1: "ساهم معنا في",
          highlight: "تحقيق",
          part2: "أهدافنا وكن\nجزءًا من تطوير التعليم في فلسطين."
        },
        image: "greenschool"
      },
      secondaryGoals: {
        title: "الأهداف الفرعيّة",
        goals: [
          {
            id: 1,
            icon: "fileSchool",
            text: "تطوير بيئة تعليميّة عادلة وشفّافة\nعبر مقاييس موحّدة وموثوقة",
            category: "quality"
          },
          {
            id: 2,
            icon: "monitor2",
            text: "تجميع البيانات: نظام موحّد لجمع\nوتنظيم تقييمات المدارس",
            category: "data"
          },
          {
            id: 3,
            icon: "folders",
            text: "معايير مُوحَّدة: جودة أكاديميّة، بيئة\nتعليميّة، مرافق..",
            category: "standards"
          },
          {
            id: 4,
            icon: "connection",
            text: "التفاعل: تعزيز قنوات التواصل بين\nالأهالي والمشرفين والمدارس",
            category: "communication"
          },
          {
            id: 5,
            icon: "www",
            text: "التقارير: تقارير دورية دائمة للمتابعة.",
            category: "reporting"
          },
          {
            id: 6,
            icon: "ok",
            text: "الموثوقية والشفافية: آليّات تحقّق\nومراجعة دقيقة.",
            category: "reliability"
          }
        ]
      },
      impactSections: {
        educational: {
          title: "تأثير الأهداف على المجتمع التعليمي",
          impacts: [
            {
              id: 1,
              icon: "family",
              title: "الأهالي",
              description: "قرارات واعية ومدروسة في اختيار\nالمدرسة المناسبة للأطفال",
              category: "parents"
            },
            {
              id: 2,
              icon: "manager",
              title: "المُشرفين",
              description: "أدوات فعّالة لمتابعة وتطوير\nجودة التعليم في المنطقة",
              category: "supervisors"
            },
            {
              id: 3,
              icon: "female",
              title: "الطلاب",
              description: "بيئة تعليمية محسّنة ومناسبة\nلاحتياجاتهم التعليمية",
              category: "students"
            }
          ]
        },
        community: {
          title: "تأثير الأهداف على البيئة المُجتمعيّة",
          impacts: [
            {
              id: 4,
              icon: "family",
              title: "الأهالي",
              description: "تقليل الحيرة وتوفير الوقت والجهد عند\nاختيار المدرسة المناسبة لأطفالهم",
              category: "parents"
            },
            {
              id: 5,
              icon: "manager",
              title: "المُشرفين",
              description: "تعزيز دورهم في تحسين جودة التعليم\nومتابعة الأداء بشكل منتظم",
              category: "supervisors"
            },
            {
              id: 6,
              icon: "school",
              title: "المدارس",
              description: "رفع مستوى الخدمات والتحفيز على\nالتطوير المستمر والتميز التعليمي",
              category: "schools"
            }
          ]
        }
      },
      futureVision: {
        title: "الرؤية المستقبلية",
        visionItems: [
          {
            id: 1,
            text: "توسيع نطاق التقييم ليشمل المعلمين والطلاب..",
            priority: "high",
            timeline: "2024-2025"
          },
          {
            id: 2,
            text: "إدخال أدوات ذكاء اصطناعي للتوصية بالمدارس بناءً على تفضيلات الأسرة.",
            priority: "medium",
            timeline: "2025-2026"
          },
          {
            id: 3,
            text: "تطوير تطبيق محمول لسهولة الوصول للتقييمات والبيانات.",
            priority: "high",
            timeline: "2024"
          },
          {
            id: 4,
            text: "ربط النظام بمنصات تعليمية أخرى على المستوى الوطني.",
            priority: "medium",
            timeline: "2025"
          }
        ]
      }
    };
  }
};

// Objectives Provider Component for state management
const ObjectivesProvider = ({ children }) => {
  const [objectivesData, setObjectivesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchObjectivesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await objectivesApiService.getPageData();
      setObjectivesData(data);
      setRetryCount(0);
    } catch (err) {
      setError('فشل في تحميل بيانات الصفحة');
      console.error('Error fetching objectives data:', err);
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObjectivesData();
  }, []);

  const value = {
    objectivesData,
    loading,
    error,
    retryCount,
    refreshData: fetchObjectivesData
  };

  return (
    <ObjectivesContext.Provider value={value}>
      {children}
    </ObjectivesContext.Provider>
  );
};

// Loading Component with enhanced UX
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <div className="text-center" dir="rtl">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-gray-600 font-cairo text-lg">جاري تحميل محتوى الأهداف...</p>
      <p className="text-gray-400 font-cairo text-sm mt-2">يرجى الانتظار</p>
    </div>
  </div>
);

// Error Component with retry functionality
const ErrorMessage = ({ error, onRetry, retryCount }) => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <div className="text-center p-8 max-w-md" dir="rtl">
      <div className="text-red-500 text-4xl mb-4">⚠️</div>
      <h3 className="text-gray-800 font-cairo text-xl font-bold mb-2">خطأ في التحميل</h3>
      <p className="text-gray-600 font-cairo mb-4">{error}</p>
      {retryCount > 0 && (
        <p className="text-gray-500 font-cairo text-sm mb-4">
          عدد المحاولات: {retryCount}
        </p>
      )}
      <button
        onClick={onRetry}
        className="bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-cairo font-medium"
      >
        إعادة المحاولة
      </button>
    </div>
  </div>
);

// Main Objectives Content Component
const ObjectivesContent = () => {
  const { objectivesData, loading, error, retryCount, refreshData } = useObjectivesData();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={refreshData} retryCount={retryCount} />;
  if (!objectivesData) return <ErrorMessage error="لا توجد بيانات متاحة" onRetry={refreshData} retryCount={retryCount} />;

  return (
    <div className="font-cairo bg-white text-black" dir="rtl">
      {/* Header Section */}

 {/* الهيدر مع الخلفية */}
      <div className="relative h-[210px]">
        <img 
          src={headerimg} 
          alt="خلفية الهيدر" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-600/50 to-cyan-950/10"></div>
        <Header title={objectivesData.pageInfo.title} variant="default" />
      </div>


      {/* <Header title={objectivesData.pageInfo.title} /> */}

      {/* Primary Goal Section */}
      <PrimaryGoal data={objectivesData.primaryGoal} />

      {/* Secondary Goals Section */}
      <SecondaryGoals data={objectivesData.secondaryGoals} />

      {/* Impact Section */}
      <ImpactSection data={objectivesData.impactSections} />

      {/* Vision Section */}
      <VisionSection data={objectivesData.futureVision} />

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

// Main Objectives Page Component
export default function Objectives() {
  return (
    <ObjectivesProvider>
      <ObjectivesContent />
    </ObjectivesProvider>
  );
}