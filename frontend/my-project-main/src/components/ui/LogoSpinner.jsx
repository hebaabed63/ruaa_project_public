import React from "react";
import logo from "../../logo.svg";

const LogoSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={logo} 
        alt="Loading" 
        className={`${sizeClasses[size]} animate-spin`} 
      />
    </div>
  );
};

export default LogoSpinner;