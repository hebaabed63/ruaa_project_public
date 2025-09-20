import React from "react";

// Standard text input component
export default function TextInput({ 
  type = "text", 
  value, 
  onChange, 
  onBlur,
  placeholder, 
  icon, 
  error 
}) {
  return (
    <div className="relative flex flex-col border-b border-[#434343] pb-1 mb-4">
      {/* Input field */}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full outline-none bg-transparent text-[#434343] text-[16px] pr-10 pl-2 ${error ? "border-red-500" : ""}`}
        />

        {/* Icon on the right */}
        {icon && (
          <img
            src={icon}
            alt="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6"
          />
        )}
      </div>

      {/* Inline error */}
      {error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
}
