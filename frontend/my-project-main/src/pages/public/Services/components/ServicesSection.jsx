import React, { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";

// Import icons - adjust paths as needed based on your project structure
import search from "../../../../assets/icons/search.svg";
import analytics from "../../../../assets/icons/analytics.svg";
import monitor from "../../../../assets/icons/monitor.svg";
import google from "../../../../assets/icons/google.svg";
import handStar from "../../../../assets/icons/handStar.svg";

// Custom hook for fade-in animation
const useFadeInAnimation = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);
  return isVisible;
};
export default function ServicesSection() {
  const titleVisible = useFadeInAnimation(200);
  const firstRowVisible = useFadeInAnimation(400);
  const secondRowVisible = useFadeInAnimation(600);
  const firstRowServices = [
    {
      icon: search,
      title: "التقييمات الأكاديميّة والسلوكيَّة",
      desc: "تمكين أولياء الأمور والمشرفيين من تقييم المدارس أكاديميًّا وسلوكيًا بدقّة."
    },
    {
      icon: analytics,
      title: "إعداد التقارير وتحليل البيانات",
      desc: "تمكين أولياء الأمور والمشرفيين من تقييم المدارس أكاديميًّا وسلوكيًا بدقّة."
    },
    {
      icon: monitor,
      title: "مراقبة الأداء التعليمي للمدارس",
      desc: "متابعة التطور الأكاديمي والإداري للمدارس بشكل دوري."
    }
  ];
  const secondRowServices = [
    {
      icon: google,
      title: "التفاعل بين أولياء الأمور والمعلمين",
      desc: "تعزيز التواصل الفعّال بين الأهالي والمعلمين لمصلحة الطلاب."
    },
    {
      icon: handStar,
      title: "إمكانية تقييم المدارس مباشرة",
      desc: "سهولة تقييم المدرسة بضغطة زر مع واجهة مستخدم واضحة وبسيطة."
    }
  ];
  return (
    <div className="font-cairo bg-babyBlue rounded-lg text-black max-w-7xl mx-auto w-full mt-10" dir="rtl">
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className={`text-center mb-12 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            
            <p className="text-primary text-lg max-w-3xl mx-auto">
نوفر مجموعة من الخدمات لدعم المدارس، المشرفين،<br/>
وأولياء الأمور في تحسين العملية التعليمية.            </p>
          </div>

          {/* First Row - 3 Cards */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 transition-all duration-1000 ${
            firstRowVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {firstRowServices.map((service, index) => (
              <div 
                key={index}
                className="transition-all duration-500"
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  desc={service.desc}
                />
              </div>
            ))}
          </div>

          {/* Second Row - 2 Cards */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto transition-all duration-1000 ${
            secondRowVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {secondRowServices.map((service, index) => (
              <div 
                key={index}
                className="transition-all duration-500"
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  desc={service.desc}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}