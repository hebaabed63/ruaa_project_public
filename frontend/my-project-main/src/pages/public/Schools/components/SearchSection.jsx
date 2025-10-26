import React, { useState, useRef, useEffect, useContext } from "react";
import { SchoolsContext } from "../context/SchoolsContext";

import building from "../../../../assets/icons/buildingsblack.svg";
import studentsIcon from "../../../../assets/icons/studentss.svg";
import locate from "../../../../assets/icons/locate.svg";
import search2 from "../../../../assets/icons/search2.svg";
import staryallow from "../../../../assets/icons/staryallow.svg";

import SchoolImg1 from "../../../../assets/images/School1.jpg";
import SchoolImg2 from "../../../../assets/images/School2.jpg";
import SchoolImg3 from "../../../../assets/images/school3.png";

import { schoolsAPI } from "../../../../services/apiService";

/* =========================
   Hook: ظهور تدريجي عند السكول
   ========================= */
const useFadeInAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold });

    const el = elementRef.current;
    if (el) obs.observe(el);
    return () => { if (el) obs.unobserve(el); };
  }, [threshold]);

  return [elementRef, isVisible];
};

/* =========================
   Card: بطاقة مدرسة
   ========================= */
const SchoolCard = ({ school, index, isVisible, onViewDetails }) => {
  const [isHovered, setIsHovered] = useState(false);

  // خرائط لأسماء ملفات الصور القادمة من الـ API إلى صور محلية بديلة
  const imageMap = {
    "School1.jpg": SchoolImg1,
    "School2.jpg": SchoolImg2,
    "school3.jpg": SchoolImg3,
  };

  const fallbackSet = [SchoolImg1, SchoolImg2, SchoolImg3];
  const imgSrc =
    imageMap[school.image] ||
    school.image ||
    fallbackSet[index % fallbackSet.length];

  return (
    <div
      className={`
        bg-white rounded-lg shadow-md overflow-hidden transition-all duration-500 cursor-pointer
        transform hover:scale-105 hover:shadow-xl
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* الصورة */}
      <div className="relative h-48">
        <img
          src={imgSrc}
          alt={school.name}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          onError={(e) => { e.currentTarget.src = SchoolImg1; }}
        />

        {/* شارة التقييم */}
        <div
          className={`
            absolute left-2 top-2 bg-white bg-opacity-90 px-2 py-1 rounded-full
            flex items-center gap-1 text-sm font-semibold transition-all duration-300
            ${isHovered ? "scale-110" : "scale-100"}
          `}
        >
          <img src={staryallow} alt="نجمة" className="w-4 h-4" />
          <span className="text-[#4CAF50] font-medium">{school.rating}</span>
          <span className="text-black font-light">({school.reviews} تقييم)</span>
        </div>
      </div>

      {/* المعلومات */}
      <div className="p-4 text-right">
        <h3
          className={`text-lg font-semibold mb-3 transition-colors duration-300 ${
            isHovered ? "text-primary" : "text-gray-900"
          }`}
        >
          {school.name}
        </h3>

        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <img src={locate} alt="الموقع" className="w-4 h-4" />
            <span className="font-normal">{school.location}</span>
          </div>

          <div className="flex items-center gap-1">
            <img src={studentsIcon} alt="الطلاب" className="w-4 h-4" />
            <span className="font-normal">{school.students} طالب</span>
          </div>

          <div className="flex items-center gap-1">
            <img src={building} alt="المرحلة" className="w-4 h-4" />
            <span className="font-normal">{school.level}</span>
          </div>
        </div>

        <button
          onClick={() => onViewDetails && onViewDetails(school)}
          className={`w-full font-medium border py-2 rounded-lg transition-all duration-300 transform
            ${isHovered
              ? "bg-primary text-white border-primary scale-105"
              : "text-primary border-primary hover:bg-primary hover:text-white"}
          `}
        >
          عرض التفاصيل
        </button>
      </div>
    </div>
  );
};

/* =========================
   Search UI
   ========================= */
const SearchComponent = ({ onSearch, searchLoading }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) await onSearch(searchQuery.trim());
  };

  return (
    <form onSubmit={handleSearch} className="mx-auto">
      <div
        className={`flex items-center bg-[#F2F3F0] rounded-lg px-4 py-3 shadow-sm transition-all duration-300 ${
          isFocused ? "border-primary shadow-md" : "border-gray-300"
        }`}
      >
        <img src={search2} alt="بحث" className="h-5 w-5 object-contain ml-2" />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="ابحث عن اسم المدرسة أو اسم المنطقة"
          disabled={searchLoading}
          className="w-full bg-[#F2F3F0] text-right focus:outline-none placeholder-[#A9A9A9] font-light"
        />

        {searchQuery && (
          <button
            type="submit"
            disabled={searchLoading}
            className={`mr-2 px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ${
              searchLoading
                ? "bg-gray-400 text-gray-600"
                : "bg-primary text-white hover:bg-secondary"
            }`}
          >
            {searchLoading ? "جاري..." : "بحث"}
          </button>
        )}
      </div>
    </form>
  );
};

/* =========================
   Helpers: استخراج وتحويل بيانات الـ API
   ========================= */
const extractSchoolsArray = (resp) => {
  const d = resp?.data;
  // paginate(): { data: { schools: { data: [...] } } }
  if (Array.isArray(d?.data?.schools?.data)) return d.data.schools.data;
  // get(): { data: { schools: [...] } }
  if (Array.isArray(d?.data?.schools)) return d.data.schools;
  // بدائل شائعة
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.schools)) return d.schools;
  return [];
};

const mapSchool = (s, index) => {
  const fallbacks = [SchoolImg1, SchoolImg2, SchoolImg3];
  return {
    id: s.school_id || s.id,
    name: s.name || s.english_name || "مدرسة غير محددة",
    image: s.image || s.logo || s.cover_image || fallbacks[index % fallbacks.length],
    location: s.city || s.region || s.address || "غير محدد",
    students: s.students_count ?? "غير محدد",
    level: s.level || "غير محدد",
    rating: Number.parseFloat(s.rating) || 0,
    reviews: s.reviews_count || 0,
  };
};

/* =========================
   المكوّن الرئيسي
   ========================= */
export default function SearchSection({ data }) {
  const { state, dispatch } =
    useContext(SchoolsContext) || { state: {}, dispatch: () => {} };

  const [searchRef, isSearchVisible] = useFadeInAnimation(0.2);

  const [searchLoading, setSearchLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  const [allSchools, setAllSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // تحميل أولي (من API أو من prop data)
  useEffect(() => {
    const load = async () => {
      try {
        setInitialLoading(true);
        setError(null);

        if (data?.schools?.length) {
          const formatted = data.schools.map((s, i) => mapSchool(s, i));
          setAllSchools(formatted);
          setFilteredSchools(formatted);
        } else {
          const resp = await schoolsAPI.getAll();
          const arr = extractSchoolsArray(resp);
          const formatted = arr.map((s, i) => mapSchool(s, i));
          setAllSchools(formatted);
          setFilteredSchools(formatted);
        }
      } catch (e) {
        console.error("Load schools error:", e);
        setError("فشل في تحميل بيانات المدارس");
        setAllSchools([]);
        setFilteredSchools([]);
      } finally {
        setInitialLoading(false);
      }
    };
    load();
  }, [data]);

  // بحث عبر API
  const handleSearch = async (query) => {
    try {
      setSearchLoading(true);
      const resp = await schoolsAPI.search({ q: query });
      const arr = extractSchoolsArray(resp);
      const formatted = arr.map((s, i) => mapSchool(s, i));
      setFilteredSchools(formatted);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
      // fallback: بحث محلي
      const local = allSchools.filter(
        (x) =>
          x.name.toLowerCase().includes(query.toLowerCase()) ||
          x.location.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSchools(local);
      setShowResults(true);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleViewDetails = (school) => {
    console.log("Viewing details for:", school);
    // TODO: navigate(`/schools/${school.id}`)
  };

  const displaySchools = filteredSchools;

  return (
    <div className="font-cairo bg-white text-black" dir="rtl">
      {/* شريط البحث - دائمًا ظاهر */}
      <section className="py-10 px-4 bg-white w-full">
        <div
          ref={searchRef}
          className={`transition-all duration-1000 ${
            isSearchVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <SearchComponent onSearch={handleSearch} searchLoading={searchLoading} />
        </div>

        {showResults && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              تم العثور على{" "}
              <span className="font-bold text-primary">{displaySchools.length}</span>{" "}
              مدرسة
            </p>
            <button
              onClick={() => {
                setShowResults(false);
                setFilteredSchools(allSchools);
              }}
              className="mt-2 text-primary hover:text-secondary transition-colors duration-300 text-sm"
            >
              عرض جميع المدارس
            </button>
          </div>
        )}
      </section>

      {/* بطاقات المدارس/السكيليتون */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {initialLoading ? (
            // 🦴 سكيليتون أثناء التحميل
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={`sk-${i}`} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : displaySchools.length > 0 ? (
            // ✅ بطاقات المدارس
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displaySchools.map((s, i) => (
                <SchoolCard
                  key={s.id ?? `${s.name}-${i}`}
                  school={s}
                  index={i}
                  isVisible={true}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            // 😕 لا توجد نتائج
            <div className="text-center py-12">
              <div className="text-gray-400 text-6l mb-4">🔍</div>
              <p className="text-gray-500 text-lg mb-4">لا توجد مدارس مطابقة</p>
            </div>
          )}
        </div>
      </section>

      {/* أخطاء عامة */}
      {error && (
        <div className="py-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
