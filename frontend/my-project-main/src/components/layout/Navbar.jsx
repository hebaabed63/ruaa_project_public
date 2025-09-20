import React from "react";
import { FaChevronDown } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav dir="rtl" className="text-sm font-medium text-white">
      <ul className="flex space-x-4 rtl:space-x-reverse">
        {/* عن الهيئة مع قائمة فرعية */}
        <li className="relative group">
          <button className="flex items-center bg-blue-200 text-blue-900 px-3 py-1 rounded-md hover:bg-blue-300 transition">
          
            <span>عن الهيئة</span>
              <FaChevronDown className="ml-1 text-xs" />
          </button>

          {/* القائمة المنسدلة */}
          <ul className="absolute right-0 mt-2 w-52 bg-white text-blue-900 shadow-lg rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
            {["التأسيس", "الرؤية والرسالة", "مجلس الإدارة", "رئيس الهيئة", "الهيكل التنظيمي"].map((item, index) => (
              <li key={index} className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 transition">
                <span className="border-r-2 border-gray-300 pr-2">{item}</span>
              </li>
            ))}
          </ul>
        </li>

        {/* عناصر أخرى عادية */}
        <li className="flex items-center cursor-pointer hover:text-gray-100 transition">
          <FaChevronDown className="ml-1 text-xs" />
          <span>المراكز</span>
        </li>
        <li className="cursor-pointer hover:text-gray-100 transition">الخدمات</li>
        <li className="cursor-pointer hover:text-gray-100 transition">المركز الإعلامي</li>
        <li className="cursor-pointer hover:text-gray-100 transition">البيانات والتقارير</li>
        <li className="cursor-pointer hover:text-gray-100 transition">تواصل معنا</li>
      </ul>
    </nav>
  );
}

