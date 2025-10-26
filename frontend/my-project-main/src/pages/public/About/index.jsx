import React, { useState, useEffect, createContext, useContext } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import GoalVisionSection from "./components/GoalVisionSection";
import ValuesSection from "./components/ValuesSection";
import StorySection from "./components/StorySection";
import StatisticsSection from "./components/StatisticsSection";
import PartnersSection from "./components/PartnersSection";
import DevelopmentPlanSection from "./components/DevelopmentPlanSection";
import headerimg from "../../../assets/images/headerimg1.png";
import { contentAPI, statisticsAPI } from "../../../services/apiService";

// Context for About page data management
const AboutContext = createContext();

// Custom hook to access About context
export const useAboutData = () => {
  const context = useContext(AboutContext);
  if (!context) {
    throw new Error('useAboutData must be used within AboutProvider');
  }
  return context;
};

// Real API service to fetch data from backend
const aboutApiService = {
  getPageData: async () => {
    try {
      // جلب البيانات من الـ API الحقيقي
      const [aboutResponse, statisticsResponse] = await Promise.all([
        contentAPI.about(),
        statisticsAPI.general()
      ]);

      return {
        pageInfo: {
          title: "عن المنصّة",
          lastUpdated: new Date().toISOString(),
          description: "منصة رؤى للتقييم التعليمي في فلسطين"
        },
        goalVision: {
          goal: {
            title: "الهدف",
            content: `منصة رؤى هي منصـــة فلسطيـــــنية مستقــــلة تهدف إلى تقييـــم المدارس بمختلف مستوياتها، بطريقة مهنية وشفافة، بما يســـاعد
إدارات المدارس على تطوير أدائها، ويمنح أوليــاء الأمــور معلومــــات دقيــقة وموضوعية لاختيار المدرسة الأنسب لأبنائهم.`
          },
          vision: {
            title: "الرؤية",
            content: `أن تكون "رؤى" المرجع الأول في فلسطين لتقييـــــم المدارس وتعزيز
ثقافة الجودة والتميز في التعليم، بما ينعكس على بنــــــاء أجيال أكثر
وعياً وكفاءة.`
          }
        },
        values: [
          {
            id: 1,
            title: "الشفافية",
            description: `تقديم معلومات واضحــــة
موثوقة بعيداً عن أي تحيّز`,
            icon: "transparency"
          },
          {
            id: 2,
            title: "المصداقية",
            description: `الاعتماد على أدوات تقييم
دقيقة ومعايير موضوعية`,
            icon: "credibility"
          },
          {
            id: 3,
            title: "التطوير المستمر",
            description: `دعم المدارس لرفع جودة
التعليم والارتقــــاء بالبيئة
المدرسية`,
            icon: "improvement"
          }
        ],
        story: {
          title: "القصة وراء المنصة",
          paragraphs: [
            {
              id: 1,
              intro: "انطلقت فكرة منصة رؤى من الحاجة الملحــة إلى وجود",
              content: `مصدر موثوق وموحد يعكس واقع المدارس في فلسطيـن،
ويمنح أولياء الأمور القدرة على اتخاذ قـــــرارات مبنيـــة على
بيانات لا على انطباعات.`
            },
            {
              id: 2,
              intro: "في ظل التباين الكبير بين المدارس من حيث الإمكـانيات",
              content: `والبرامج التعليمية والأنشطة، جاءت "رؤى" لتكـون جسرًا بين
المدرسة والمجتمع، تفتح أبواب التقييم والمساءلة، وتدفـع
باتجاه تطوير التعليم كحق أساسي لكل طالب.`
            }
          ]
        },
        statistics: statisticsResponse.data?.data || [
          {
            id: 1,
            value: 23,
            suffix: "+",
            title: "مديــــرية تعليـمية",
            description: `تم تغطيتــــــــها في
مختلف المحافظات.`,
            targetValue: 23,
            animationDelay: 0
          },
          {
            id: 2,
            value: 700,
            suffix: "+",
            title: "مدرســــــــــــــــــــة",
            description: `أُدرجـــــــــت وقُيِّمت
عبر المنصـــــــــــــة.`,
            targetValue: 700,
            animationDelay: 200
          },
          {
            id: 3,
            value: 69,
            suffix: "+",
            title: "مشرفًا ومعلمًــــــــا",
            description: `شاركوا في عمليـــــة
التقييـــــــــــــــــــــم.`,
            targetValue: 69,
            animationDelay: 400
          }
        ],
        partners: [
          {
            id: 1,
            name: "وزارة التربية والتعليم العالي",
            logo: "partner",
            description: "الشريك الرسمي في تطوير التعليم",
            website: "https://www.moehe.pna.ps",
            active: true
          },
          {
            id: 2,
            name: "الجامعة العربية الأمريكية",
            logo: "partner",
            description: "شريك أكاديمي في البحث والتطوير",
            website: "https://www.aau.edu.ps",
            active: true
          },
          {
            id: 3,
            name: "مركز دراسات التعليم الفلسطيني",
            logo: "partner",
            description: "شريك في تطوير المعايير التعليمية",
            website: "https://www.peerc.ps",
            active: true
          }
        ],
        developmentPlan: [
          {
            id: 1,
            icon: "location",
            title: "توسيع التغطية",
            text: `توسيع نطاق التغطية ليشمل كـــــــافة المــــــــــدارس
الفلسطيــــنية دون استثنــــاء.`,
            details: "هدفنا الوصول إلى جميع المدارس في كافة المحافظات الفلسطينية مع توفير أدوات تقييم شاملة ومتطورة.",
            priority: "high",
            timeline: "2024-2025",
            status: "في التقدم",
            progress: 60
          },
          {
            id: 2,
            icon: "school",
            title: "تعزيز الشراكات",
            text: `تعزيز الشراكات مع الجامعات ومراكـــــز البحث لتطويــــر
مؤشرات جودة تعليمية مبتكرة.`,
            details: "بناء علاقات استراتيجية مع المؤسسات الأكاديمية المحلية والإقليمية لتطوير معايير تقييم متقدمة.",
            priority: "medium",
            timeline: "2024-2026",
            status: "مخطط",
            progress: 25
          },
          {
            id: 3,
            icon: "star",
            title: "تطوير الأدوات",
            text: `تطوير أدوات تقييم أكثر تخصصًا تراعي خصوصية المراحل
التعليمية المختلفة.`,
            details: "إنشاء أدوات متقدمة لكل مرحلة تعليمية مع مراعاة الاحتياجات الخاصة والبرامج المتنوعة.",
            priority: "high",
            timeline: "2024",
            status: "قيد التنفيذ",
            progress: 80
          },
          {
            id: 4,
            icon: "location",
            title: "التخصص التعليمي",
            text: `تطوير أدوات تقييم أكثر تخصصًا تراعي خصوصية المراحل
التعليمية المختلفة.`,
            details: "تخصيص المعايير حسب نوع التعليم والمرحلة مع إدراج التعليم التقني والمهني.",
            priority: "medium",
            timeline: "2025",
            status: "مخطط",
            progress: 15
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching about data:', error);
      // في حالة فشل API، نرجع بيانات افتراضية
      return {
        pageInfo: {
          title: "عن المنصّة",
          lastUpdated: new Date().toISOString(),
          description: "منصة رؤى للتقييم التعليمي في فلسطين"
        },
        goalVision: {
          goal: {
            title: "الهدف",
            content: `منصة رؤى هي منصـــة فلسطيـــــنية مستقــــلة تهدف إلى تقييـــم المدارس بمختلف مستوياتها، بطريقة مهنية وشفافة، بما يســـاعد
إدارات المدارس على تطوير أدائها، ويمنح أوليــاء الأمــور معلومــــات دقيــقة وموضوعية لاختيار المدرسة الأنسب لأبنائهم.`
          },
          vision: {
            title: "الرؤية",
            content: `أن تكون "رؤى" المرجع الأول في فلسطين لتقييـــــم المدارس وتعزيز
ثقافة الجودة والتميز في التعليم، بما ينعكس على بنــــــاء أجيال أكثر
وعياً وكفاءة.`
          }
        },
        values: [
          {
            id: 1,
            title: "الشفافية",
            description: `تقديم معلومات واضحــــة
موثوقة بعيداً عن أي تحيّز`,
            icon: "transparency"
          },
          {
            id: 2,
            title: "المصداقية",
            description: `الاعتماد على أدوات تقييم
دقيقة ومعايير موضوعية`,
            icon: "credibility"
          },
          {
            id: 3,
            title: "التطوير المستمر",
            description: `دعم المدارس لرفع جودة
التعليم والارتقــــاء بالبيئة
المدرسية`,
            icon: "improvement"
          }
        ],
        story: {
          title: "القصة وراء المنصة",
          paragraphs: [
            {
              id: 1,
              intro: "انطلقت فكرة منصة رؤى من الحاجة الملحــة إلى وجود",
              content: `مصدر موثوق وموحد يعكس واقع المدارس في فلسطيـن،
ويمنح أولياء الأمور القدرة على اتخاذ قـــــرارات مبنيـــة على
بيانات لا على انطباعات.`
            },
            {
              id: 2,
              intro: "في ظل التباين الكبير بين المدارس من حيث الإمكـانيات",
              content: `والبرامج التعليمية والأنشطة، جاءت "رؤى" لتكـون جسرًا بين
المدرسة والمجتمع، تفتح أبواب التقييم والمساءلة، وتدفـع
باتجاه تطوير التعليم كحق أساسي لكل طالب.`
            }
          ]
        },
        statistics: [
          {
            id: 1,
            value: 23,
            suffix: "+",
            title: "مديــــرية تعليـمية",
            description: `تم تغطيتــــــــها في
مختلف المحافظات.`,
            targetValue: 23,
            animationDelay: 0
          },
          {
            id: 2,
            value: 700,
            suffix: "+",
            title: "مدرســــــــــــــــــــة",
            description: `أُدرجـــــــــت وقُيِّمت
عبر المنصـــــــــــــة.`,
            targetValue: 700,
            animationDelay: 200
          },
          {
            id: 3,
            value: 69,
            suffix: "+",
            title: "مشرفًا ومعلمًــــــــا",
            description: `شاركوا في عمليـــــة
التقييـــــــــــــــــــــم.`,
            targetValue: 69,
            animationDelay: 400
          }
        ],
        partners: [
          {
            id: 1,
            name: "وزارة التربية والتعليم العالي",
            logo: "partner",
            description: "الشريك الرسمي في تطوير التعليم",
            website: "https://www.moehe.pna.ps",
            active: true
          },
          {
            id: 2,
            name: "الجامعة العربية الأمريكية",
            logo: "partner",
            description: "شريك أكاديمي في البحث والتطوير",
            website: "https://www.aau.edu.ps",
            active: true
          },
          {
            id: 3,
            name: "مركز دراسات التعليم الفلسطيني",
            logo: "partner",
            description: "شريك في تطوير المعايير التعليمية",
            website: "https://www.peerc.ps",
            active: true
          }
        ],
        developmentPlan: [
          {
            id: 1,
            icon: "location",
            title: "توسيع التغطية",
            text: `توسيع نطاق التغطية ليشمل كـــــــافة المــــــــــدارس
الفلسطيــــنية دون استثنــــاء.`,
            details: "هدفنا الوصول إلى جميع المدارس في كافة المحافظات الفلسطينية مع توفير أدوات تقييم شاملة ومتطورة.",
            priority: "high",
            timeline: "2024-2025",
            status: "في التقدم",
            progress: 60
          },
          {
            id: 2,
            icon: "school",
            title: "تعزيز الشراكات",
            text: `تعزيز الشراكات مع الجامعات ومراكـــــز البحث لتطويــــر
مؤشرات جودة تعليمية مبتكرة.`,
            details: "بناء علاقات استراتيجية مع المؤسسات الأكاديمية المحلية والإقليمية لتطوير معايير تقييم متقدمة.",
            priority: "medium",
            timeline: "2024-2026",
            status: "مخطط",
            progress: 25
          },
          {
            id: 3,
            icon: "star",
            title: "تطوير الأدوات",
            text: `تطوير أدوات تقييم أكثر تخصصًا تراعي خصوصية المراحل
التعليمية المختلفة.`,
            details: "إنشاء أدوات متقدمة لكل مرحلة تعليمية مع مراعاة الاحتياجات الخاصة والبرامج المتنوعة.",
            priority: "high",
            timeline: "2024",
            status: "قيد التنفيذ",
            progress: 80
          },
          {
            id: 4,
            icon: "location",
            title: "التخصص التعليمي",
            text: `تطوير أدوات تقييم أكثر تخصصًا تراعي خصوصية المراحل
التعليمية المختلفة.`,
            details: "تخصيص المعايير حسب نوع التعليم والمرحلة مع إدراج التعليم التقني والمهني.",
            priority: "medium",
            timeline: "2025",
            status: "مخطط",
            progress: 15
          }
        ]
      };
    }
  }
};

// About Provider Component for state management
const AboutProvider = ({ children }) => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await aboutApiService.getPageData();
      setAboutData(data);
      setRetryCount(0);
    } catch (err) {
      setError('فشل في تحميل بيانات الصفحة');
      console.error('Error fetching about data:', err);
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const value = {
    aboutData,
    loading,
    error,
    retryCount,
    refreshData: fetchAboutData
  };

  return (
    <AboutContext.Provider value={value}>
      {children}
    </AboutContext.Provider>
  );
};

// Loading Component with enhanced UX
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <div className="text-center" dir="rtl">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto mb-6"></div>
      <h2 className="text-gray-800 font-cairo text-2xl font-bold mb-2">جاري تحميل الصفحة</h2>
      <p className="text-gray-600 font-cairo text-lg mb-4">يرجى الانتظار قليلاً...</p>
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
        <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '75%' }}></div>
      </div>
    </div>
  </div>
);

// Error Component with retry functionality
const ErrorMessage = ({ error, onRetry, retryCount }) => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <div className="text-center p-8 max-w-md bg-red-50 rounded-xl border border-red-200" dir="rtl">
      <div className="text-red-500 text-5xl mb-6">⚠️</div>
      <h3 className="text-gray-800 font-cairo text-2xl font-bold mb-3">خطأ في التحميل</h3>
      <p className="text-gray-700 font-cairo mb-6 text-lg">{error}</p>

      {retryCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 font-cairo text-sm">
            عدد المحاولات الفاشلة: <span className="font-bold">{retryCount}</span>
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRetry}
          className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors font-cairo font-medium text-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform"
        >
          إعادة المحاولة
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors font-cairo font-medium text-lg"
        >
          تحديث الصفحة
        </button>
      </div>

      <p className="text-gray-500 font-cairo text-sm mt-6">
        إذا استمرت المشكلة، يرجى المحاولة لاحقاً
      </p>
    </div>
  </div>
);

// Main About Content Component
const AboutContent = () => {
  const { aboutData, loading, error, retryCount, refreshData } = useAboutData();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={refreshData} retryCount={retryCount} />;
  if (!aboutData) return <ErrorMessage error="لا توجد بيانات متاحة" onRetry={refreshData} retryCount={retryCount} />;

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
        <Header title={aboutData.pageInfo.title} variant="default" />
      </div>

      {/* <Header title={aboutData.pageInfo.title} /> */}

      {/* Goal and Vision Section */}
      <GoalVisionSection data={aboutData.goalVision} />

      {/* Values Section */}
      <ValuesSection data={aboutData.values} />

      {/* Story Section */}
      <StorySection data={aboutData.story} />

      {/* Statistics Section with Interactive Counters */}
      <StatisticsSection data={aboutData.statistics} />

      {/* Partners Section with Hover Effects */}
      <PartnersSection data={aboutData.partners} />

      {/* Development Plan Section with Expandable Cards */}
      <DevelopmentPlanSection data={aboutData.developmentPlan} />


      {/* Footer Section */}
      <Footer />
    </div>
  );
};

// Main About Page Component
export default function About() {
  return (
    <AboutProvider>
      <AboutContent />
    </AboutProvider>
  );
}
