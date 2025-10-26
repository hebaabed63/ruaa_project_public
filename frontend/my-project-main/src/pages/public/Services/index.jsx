import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ServicesSection from "./components/ServicesSection";
import headerimg from '../../../assets/images/headerimg1.png';
import { servicesAPI } from '../../../services/apiService';

export default function Services() {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleEvaluateClick = () => {
    // Navigate to ratings page or evaluation form
    window.location.href = '/ratings';
  };

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
        <Header title="الخدمات" variant="default" />
      </div>

      {/* <Header title="الخدمات" /> */}

      {/* Main Services Section */}
      <ServicesSection />

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-[#5F5959] mb-8">
            ابدأ الآن في استكشاف المدارس <span className="text-yellow-400">وتقييمها</span> عبر منصتنا.
          </h2>
          <button
            className={`bg-primary text-white px-20 py-4 rounded-lg text-lg font-medium transform transition-all duration-300 shadow-lg ${
              isButtonHovered
                ? 'bg-primary-dark scale-105 shadow-xl'
                : 'hover:bg-primary-dark hover:scale-105 hover:shadow-xl'
            }`}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            onClick={handleEvaluateClick}
          >
            قيّم مدرستك الآن
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
