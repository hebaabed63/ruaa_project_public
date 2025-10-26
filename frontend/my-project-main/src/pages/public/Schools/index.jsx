import React, { useState, useEffect } from "react";
import { SchoolsProvider } from "./context/SchoolsContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchSection from "./components/SearchSection";
import BestSchools from "./components/BestSchools";
import SchoolsOnArea from "./components/SchoolsOnArea";
import StatisticsSection from "./components/StatisticsSection";
import AddedSchools from "./components/AddedSchools";
import headerimg from '../../../assets/images/headerimg1.png';
import { schoolsAPI, statisticsAPI, ratingsAPI } from '../../../services/apiService';

// ============================================================================
// استخدام Real API Service بدلاً من Mock Data
// ============================================================================
const schoolsApiService = {
  getPageData: async () => {
    try {
      // جلب البيانات من الـ API الحقيقي
      const [schoolsResponse, statisticsResponse, bestSchoolsResponse, recentSchoolsResponse] = await Promise.all([
        schoolsAPI.getAll(),
        statisticsAPI.general(),
        schoolsAPI.getBest(),
        schoolsAPI.getRecent()
      ]);

      return {
        pageInfo: {
          title: "المدارس",
          description: "استكشف أفضل المدارس في فلسطين"
        },
        searchResults: {
          schools: schoolsResponse.data?.data || [],
          totalCount: schoolsResponse.data?.total || schoolsResponse.data?.data?.length || 0
        },
        bestSchools: bestSchoolsResponse.data?.data || [],
        recentSchools: recentSchoolsResponse.data?.data || [],
        statistics: statisticsResponse.data?.data || {
          totalSchools: schoolsResponse.data?.data?.length || 0,
          totalStudents: 0,
          averageRating: 0,
          regions: []
        },
        mapData: {
          coordinates: { lat: 31.8, lng: 35.0 },
          embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d866748.4208940891!2d34.367485!3d31.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1502b7dbf8fd2d0b%3A0x85eb7e9c9b6eca7b!2sPalestine!5e0!3m2!1sen!2s!4v1647887231234!5m2!1sen!2s',
          zoomLevel: 8
        }
      };
    } catch (error) {
      console.error('Error in getPageData:', error);
      throw new Error(error.message || 'فشل في تحميل بيانات المدارس');
    }
  },

  // دالة البحث - تستخدم API الحقيقي
  searchSchools: async (searchQuery, filters = {}) => {
    try {
      const searchParams = {
        q: searchQuery,
        region: filters.location,
        type: filters.type,
        level: filters.level,
        min_rating: filters.minRating,
      };

      const response = await schoolsAPI.search(searchParams);

      return {
        schools: response.data?.data || [],
        totalCount: response.data?.total || response.data?.data?.length || 0,
        searchQuery,
        filters,
      };
    } catch (error) {
      console.error('Error in searchSchools:', error);
      throw new Error(error.message || 'فشل في البحث عن المدارس');
    }
  },

  // دالة إرسال التقييم - تستخدم ratings API
  submitRating: async (ratingData) => {
    try {
      const response = await ratingsAPI.create(ratingData);
      return {
        success: true,
        message: "تم إرسال تقييمك بنجاح! شكراً لمساهمتك في تطوير التعليم.",
        data: response.data?.data || { id: Date.now(), ...ratingData }
      };
    } catch (error) {
      console.error('Error in submitRating:', error);
      throw new Error(error.message || "حدث خطأ أثناء إرسال التقييم. يرجى المحاولة مرة أخرى.");
    }
  },
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

// Main Schools Component
export default function Schools() {
  return (
    <SchoolsProvider>
      <SchoolsContent />
    </SchoolsProvider>
  );
}

// Content component that uses the context
const SchoolsContent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch page data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const pageData = await schoolsApiService.getPageData();
      setData(pageData);
    } catch (err) {
      setError(err.message || "فشل في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="font-cairo bg-white text-black" dir="rtl">
        <Header title="المدارس" />
        <LoadingComponent />
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-cairo bg-white text-black" dir="rtl">
        <Header title="المدارس" />
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
        <Header title={data?.pageInfo?.title || "المدارس"} variant="default" />
      </div>

      {/* <Header title={data?.pageInfo?.title || "المدارس"} /> */}

      {/* Search Section */}
      <SearchSection data={data?.searchResults} />

      {/* Best Schools */}
      <BestSchools data={data?.bestSchools} />

      {/* Schools on Area Map */}
      <SchoolsOnArea data={data?.mapData} />

      {/* Statistics Section */}
      <StatisticsSection data={data?.statistics} />

      {/* Recently Added Schools */}
      <AddedSchools data={data?.recentSchools} />

      {/* Footer */}
      <Footer />
    </div>
  );
};
