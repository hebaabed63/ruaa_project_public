import React, { useState } from "react";

export default function ServiceCard({ icon, title, desc }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-center mb-4">
        <img 
          src={icon} 
          alt={title} 
          className={`w-16 h-16 object-contain transition-transform duration-300 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
      </div>
      <h3 className={`text-xl font-semibold mb-3 font-cairo transition-colors duration-300 ${
        isHovered ? 'text-primary' : 'text-gray-900'
      }`}>
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed font-cairo">
        {desc}
      </p>
    </div>
  );
}