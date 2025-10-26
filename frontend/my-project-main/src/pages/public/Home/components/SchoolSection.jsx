import React, { useState, useEffect } from 'react';
import { FaStar, FaMapMarkerAlt, FaUsers, FaGraduationCap } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { schoolsAPI } from '../../../../services/apiService';

import School1 from '../../../../assets/images/School1.jpg';
import School2 from '../../../../assets/images/School2.jpg';
import School3 from '../../../../assets/images/school3.png';
import search2 from "../../../../assets/icons/search2.svg";

const SchoolSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [allSchools, setAllSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultImages = [School1, School2, School3];

  // ✅ دالة جلب المدارس من الـ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await schoolsAPI.getAll();
        console.log('✅ API Response:', response.data);

        let schoolsData = [];

        // ✅ الشكل الصحيح حسب استجابة الـ API الحالية
        if (response.data?.data?.schools && Array.isArray(response.data.data.schools)) {
          schoolsData = response.data.data.schools;
        }
        else if (Array.isArray(response.data)) {
          schoolsData = response.data;
        }
        else if (Array.isArray(response.data.data)) {
          schoolsData = response.data.data;
        }
        else if (Array.isArray(response.data.schools)) {
          schoolsData = response.data.schools;
        }

        console.log('🎯 Extracted schools data:', schoolsData);

        // 🔄 تحويل البيانات إلى الشكل المطلوب للواجهة
        const formattedSchools = schoolsData.map((school, index) => ({
          id: school.school_id || school.id,
          name: school.name || school.english_name || 'مدرسة غير محددة',
          image:
            school.image ||
            school.logo ||
            school.cover_image ||
            defaultImages[index % defaultImages.length],
          location: school.city || school.region || school.address || 'غير محدد',
          students: school.students_count || 'غير محدد',
          levels: school.level || 'غير محدد',
          rating: parseFloat(school.rating) || 0,
          reviews: school.reviews_count || 0,
        }));

        setAllSchools(formattedSchools);
        setFilteredSchools(formattedSchools);
        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching schools:', err);
        setError("فشل في تحميل بيانات المدارس");

        // 🔁 fallback مؤقت في حال فشل الاتصال بالـ API
        const fallbackSchools = [
          {
            id: 1,
            name: "مدرسة النجاح الحديثة",
            image: School1,
            location: "غزة - الرمال",
            students: "500",
            levels: "ابتدائي - ثانوي",
            rating: "4.8",
            reviews: "430",
          },
          {
            id: 2,
            name: "مدرسة الأمل النموذجية",
            image: School2,
            location: "طولكرم",
            students: "1100",
            levels: "ابتدائي",
            rating: "4.5",
            reviews: "85",
          },
          {
            id: 3,
            name: "مدرسة المستقبل التطويرية",
            image: School3,
            location: "الخليل",
            students: "720",
            levels: "ثانوي",
            rating: "4.9",
            reviews: "150",
          },
        ];

        setAllSchools(fallbackSchools);
        setFilteredSchools(fallbackSchools);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔍 فلترة المدارس حسب البحث المحلي
  useEffect(() => {
    if (searchTerm) {
      const filtered = allSchools.filter(
        (school) =>
          school.name.includes(searchTerm) || school.location.includes(searchTerm)
      );
      setFilteredSchools(filtered);
    } else {
      setFilteredSchools(allSchools);
    }
  }, [searchTerm, allSchools]);

  // 🧠 دالة البحث من API
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setFilteredSchools(allSchools);
      return;
    }

    try {
      setLoading(true);
      const response = await schoolsAPI.search({ q: searchTerm });
      console.log('🔎 Search response:', response.data);

      let searchResults = [];

      if (response.data?.data?.schools && Array.isArray(response.data.data.schools)) {
        searchResults = response.data.data.schools;
      }
      else if (Array.isArray(response.data)) {
        searchResults = response.data;
      }
      else if (Array.isArray(response.data.data)) {
        searchResults = response.data.data;
      }
      else if (Array.isArray(response.data.schools)) {
        searchResults = response.data.schools;
      }

      const formattedResults = searchResults.map((school, index) => ({
        id: school.school_id || school.id,
        name: school.name || school.english_name || 'مدرسة غير محددة',
        image:
          school.image ||
          school.logo ||
          school.cover_image ||
          defaultImages[index % defaultImages.length],
        location: school.city || school.region || school.address || 'غير محدد',
        students: school.students_count || 'غير محدد',
        levels: school.level || 'غير محدد',
        rating: parseFloat(school.rating) || 0,
        reviews: school.reviews_count || 0,
      }));

      setFilteredSchools(formattedResults);
    } catch (error) {
      console.error('❌ Error searching schools:', error);
      const filtered = allSchools.filter(
        (school) =>
          school.name.includes(searchTerm) || school.location.includes(searchTerm)
      );
      setFilteredSchools(filtered);
    } finally {
      setLoading(false);
    }
  };

  // 🌀 حالة التحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 font-cairo flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل المدارس...</p>
        </div>
      </div>
    );
  }

  // ⚠️ حالة الخطأ
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 font-cairo flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // 🏫 عرض المدارس
  return (
    <div className="bg-white font-cairo flex flex-col items-center" dir="rtl">
      {/* 🔍 قسم البحث */}
      <section className="py-10 px-4 w-full">
        <div className="mx-auto max-w-8xl">
          <motion.form
            onSubmit={handleSearch}
            className="flex items-center bg-[#F2F3F0] rounded-lg px-4 py-3 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <img src={search2} alt="أيقونة البحث" className="h-5 w-5 object-contain ml-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن اسم المدرسة أو المنطقة.."
              className="w-full bg-[#F2F3F0] text-right focus:outline-none placeholder-[#A9A9A9] font-light"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  جاري البحث...
                </>
              ) : (
                'بحث'
              )}
            </button>
          </motion.form>
        </div>
      </section>

      {/* 🧱 بطاقات المدارس */}
      <section className="py-16 px-4 w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {filteredSchools.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg mb-4">
                {searchTerm
                  ? `لم يتم العثور على مدارس مطابقة لبحثك: "${searchTerm}"`
                  : 'لا توجد مدارس متاحة حالياً'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilteredSchools(allSchools);
                  }}
                  className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                >
                  عرض جميع المدارس
                </button>
              )}
            </div>
          ) : (
            filteredSchools.map((school, index) => (
              <motion.div
                key={school.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={school.image}
                    alt={school.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.src = School1; }}
                  />
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span className="text-green-600 font-medium">{school.rating}</span>
                    <span className="text-black font-light text-xs">({school.reviews} تقييم)</span>
                  </div>
                </div>

                <div className="p-4 text-right">
                  <h3 className="text-lg font-semibold mb-3">{school.name}</h3>
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt className="w-4 h-4" />
                      <span className="font-normal">{school.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaUsers className="w-4 h-4" />
                      <span className="font-normal">{school.students} طالب</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaGraduationCap className="w-4 h-4" />
                      <span className="font-normal">{school.levels}</span>
                    </div>
                  </div>
                  <motion.button
                    className="w-full font-medium text-primary border border-primary py-2 rounded-lg hover:bg-primary hover:text-white transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    عرض التفاصيل
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default SchoolSection;
