import React, { useState, useEffect, useRef, useMemo } from "react";
import Infinity from "../../../../assets/icons/Infinity.svg";

/* =========================
   Hook: عدّاد متحرك للرقم
   ========================= */
const useAnimatedCounter = (targetValue, duration = 2000, delay = 0, startAnimation = false) => {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!startAnimation || isAnimating) return;

    setIsAnimating(true);
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuad = 1 - Math.pow(1 - progress, 2);
      const currentValue = Math.floor(easeOutQuad * (Number(targetValue) || 0));

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timer);
      setIsAnimating(false);
    };
  }, [targetValue, duration, delay, startAnimation, isAnimating]);

  return count;
};

/* =========================
   Card: بطاقة إحصائية
   ========================= */
const StatisticsCard = ({ statistic, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  const animatedCount = useAnimatedCounter(
    statistic.targetValue ?? statistic.value ?? 0,
    2500,
    statistic.animationDelay ?? index * 200,
    isVisible
  );

  return (
    <div
      className={`p-6 text-center transform transition-all duration-1000 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${isHovered ? "scale-105 -translate-y-2" : "scale-100"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl opacity-50"></div>
        <h3
          className={`text-4xl font-bold text-primary mb-2 relative transition-all duration-500 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        >
          {animatedCount}
          {statistic.suffix || ""}
        </h3>
      </div>
      <div className="text-gray-700 font-light leading-relaxed">
        <p
          className={`font-bold text-lg transition-colors duration-300  ${
            isHovered ? "text-primary " : " text-secondary"
          }`}
        >
          {statistic.title}
        </p>
        {statistic.description ? (
          <p className="font-semibold whitespace-pre-line mt-2 text-secondary">
            {statistic.description}
          </p>
        ) : null}
      </div>
    </div>
  );
};

/* =========================
   Hook: ظهور تدريجي
   ========================= */
const useFadeInAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold }
    );
    const el = elementRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [threshold]);

  return [elementRef, isVisible];
};

/* =========================
   Normalizer: توحيد شكل البيانات
   ========================= */
/**
 * تحوّل أي شكل من data إلى Array جاهزة للعرض.
 * تدعم:
 *  - Array جاهزة [{id,value,title,...}]
 *  - { stats: [...] } أو { data: { stats: [...] } }
 *  - Feedback stats: { total, average, counts:{...}, percentage:{...} }
 *  - أي كائن آخر => يرجع [] فيعرض الديفولت.
 */
function normalizeStatistics(input) {
  if (!input) return [];

  // 1) إذا كانت مصفوفة بالفعل
  if (Array.isArray(input)) return input;

  // 2) أشهر أشكال التغليف
  if (Array.isArray(input?.stats)) return input.stats;
  if (Array.isArray(input?.data?.stats)) return input.data.stats;

  // 3) إحصائيات الفيدباك (مثال: /api/feedback/stats)
  const fb = input?.data ?? input;
  const hasFeedbackShape =
    typeof fb?.total !== "undefined" ||
    typeof fb?.average !== "undefined" ||
    typeof fb?.counts === "object" ||
    typeof fb?.percentage === "object";

  if (hasFeedbackShape) {
    const total = Number(fb.total || 0);
    const avg = Number(fb.average || 0);
    const per = fb.percentage || {};
    return [
      {
        id: "stat-total",
        value: total,
        suffix: "",
        title: "إجمالي التقييمات",
        description: "",
        targetValue: total,
        animationDelay: 0
      },
      {
        id: "stat-avg",
        value: avg,
        suffix: "/3",
        title: "متوسط التقييم",
        description: "",
        targetValue: avg,
        animationDelay: 150
      },
      {
        id: "stat-excellent",
        value: Number(per.excellent || 0),
        suffix: "%",
        title: "نسبة (ممتاز)",
        description: "",
        targetValue: Number(per.excellent || 0),
        animationDelay: 300
      },
      {
        id: "stat-good",
        value: Number(per.good || 0),
        suffix: "%",
        title: "نسبة (جيد)",
        description: "",
        targetValue: Number(per.good || 0),
        animationDelay: 450
      },
      {
        id: "stat-needs",
        value: Number(per.needs_improve || 0),
        suffix: "%",
        title: "نسبة (يحتاج تحسين)",
        description: "",
        targetValue: Number(per.needs_improve || 0),
        animationDelay: 600
      }
    ];
  }

  // 4) fallback: لو كائن غير معروف
  return [];
}

export default function StatisticsSection({ data }) {
  // بيانات افتراضية
  const defaultStatistics = useMemo(() => ([
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
  ]), []);

  // نطبّق النورمالايزر ونرجع للديفولت لو رجع فاضي
  const normalized = useMemo(() => {
    const arr = normalizeStatistics(data);
    return Array.isArray(arr) && arr.length > 0 ? arr : defaultStatistics;
  }, [data, defaultStatistics]);

  // Hooks الحركة
  const [containerRef, isContainerVisible] = useFadeInAnimation(0.1);
  const [titleRef, isTitleVisible] = useFadeInAnimation(0.2);

  return (
    <div className="font-cairo bg-white text-black" dir="rtl">
      <section className="bg-white py-16 px-0">
        {/* العنوان */}
        <div
          ref={titleRef}
          className={`relative w-full mb-12 transition-all duration-1000 ${
            isTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="relative w-full pr-8">
            <img src={Infinity} alt="Infinity" />
            <h2 className="absolute top-1/2 transform -translate-y-1/2 text-4xl font-bold text-secondary z-10 mr-11">
              الإحصائيات
            </h2>
          </div>
        </div>

        {/* بطاقات الإحصائيات */}
        <div
          ref={containerRef}
          className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {normalized.map((statistic, index) => (
            <StatisticsCard
              key={statistic.id ?? index}
              statistic={statistic}
              index={index}
              isVisible={isContainerVisible}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
