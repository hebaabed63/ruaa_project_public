import React, { useState } from "react";

// Password input component with toggle visibility
export default function PasswordInput({ 
  value, 
  onChange, 
  onBlur,
  placeholder, 
  startIcon, 
  endIcon, 
  error 
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative flex flex-col border-b border-[#434343] pb-1 mb-4">
      <div className="relative">
        {/* Start icon */}
        {startIcon && (
          <img src={startIcon} alt="start" className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6" />
        )}

        {/* Input field */}
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full outline-none bg-transparent text-[#434343] text-[16px] pr-10 pl-10 ${error ? "border-red-500" : ""}`}
        />

        {/* End icon for toggle */}
        {endIcon && (
          <img
            src={endIcon}
            alt="toggle"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 cursor-pointer"
            onClick={() => setShow(!show)}
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
