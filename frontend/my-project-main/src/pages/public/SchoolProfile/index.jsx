


import React from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import SchoolInfo from "../../public/SchoolProfile/components/SchoolInfo";
import Briefsummary from "../../public/SchoolProfile/components/Briefsummary";
import SchoolEvaluation from "../../public/SchoolProfile/components/SchoolEvaluation";
import GenerelEvaluation from "../../public/SchoolProfile/components/GenerelEvaluation";
import headerimg from '../../../assets/images/headerimg1.png';


export default function About() {
  return (
    <div className="flex flex-col min-h-screen font-cairo font-arabic bg-white" dir="rtl">

      {/* الهيدر */}


      <div className="relative h-[210px]">
        <img 
          src={headerimg} 
          alt="خلفية الهيدر" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-600/50 to-cyan-950/10"></div>
        <Header title="المدارس" variant="default" />
      </div>

      {/* نموذج التواصل */}
      <SchoolInfo />
<Briefsummary/>
<SchoolEvaluation/>
<GenerelEvaluation/>
      {/* الفوتر */}
      <Footer />
      
    </div>
  );
}