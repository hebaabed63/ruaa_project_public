import React from "react";
import { FaEye, FaCheck, FaTrash } from "react-icons/fa";

const ticketsData = [
  {
    title: "طلب ميزة جديدة",
    sender: "خالد يوسف",
    priority: "عالية",
    status: "محلولة",
    createdAt:"24 أكتوبر 2025، 2:04م.",
  },
  {
    title: "مشكلة في الطباعة ",
    sender: "ليلى علي",
    priority: "متوسطة",
    status: "قيد المعالجة",
    createdAt: "10 أكتوبر 2025، 2:04م.",
  },
  {
    title:"مشكلة في تسحيل الدخول",
    sender: "سامي خالد",
    priority: "منخفضة",
    status: "محلولة",
    createdAt: "2 أكتوبر 2025، 2:04م.",
  },
  {
    title:"تحديث بيانات تسجيل الدخول",
    sender: "حامد خالد",
    priority: "منخفضة",
    status: "قيد المعالجة",
    createdAt: "4 أكتوبر 2025، 2:04م.",
  },{
    title:"بطء في تحميل البيانات",
    sender: "أحمد صالح",
    priority: "عالية",
    status: "قيد المعالجة",
    createdAt: "8 أكتوبر 2025، 2:04م.",
  },{
    title:"مشكلة في التسحيل ",
    sender: "سامي مصطفى",
    priority: "منخفضة",
    status: "محلولة",
    createdAt: "6 أكتوبر 2025، 2:04م.",
  },
];

const SupportPage = () => {
  const renderPriority = (priority) => {
    let bgColor, textColor;
    switch (priority) {
      case "عالية":
        bgColor = "#F0FEED";
        textColor = "#259800";
        break;
      case "متوسطة":
        bgColor = "#FFF7BF";
        textColor = "#72511B";
        break;
      case "منخفضة":
        bgColor = "#FFE5DC";
        textColor = "#7D2C35";
        break;
      default:
        bgColor = "transparent";
        textColor = "black";
    }
    return (
      <div
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium text-sm"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <span
          className="w-2 h-2 rounded-full inline-block"
          style={{ backgroundColor: textColor }}
        ></span>
        {priority}
      </div>
    );
  };

  const renderStatus = (status) => {
    let bgColor, textColor;
    switch (status) {
      case "محلولة":
        bgColor = "#F0FEED";
        textColor = "#259800";
        break;
      case "قيد المعالجة":
        bgColor = "#FFF7BF";
        textColor = "#72511B";
        break;
      default:
        bgColor = "transparent";
        textColor = "black";
    }
    return (
      <div
        className="inline-flex items-center gap-2 px-3 py-1 rounded-lg font-medium text-sm"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <span
          className="w-2 h-2 rounded-full inline-block"
          style={{ backgroundColor: textColor }}
        ></span>
        {status}
      </div>
    );
  };

  return (
    <div className="p-6 font-cairo bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">إدارة  الدعم الفني</h1>

      {/* جدول التذاكر */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border rounded-lg">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-200 font-bold">
              <th className="py-2 px-4 border">العنوان</th>
              <th className="py-2 px-4 border">المرسل</th>
              <th className="py-2 px-4 border">الأولوية</th>
              <th className="py-2 px-4 border">الحالة</th>
              <th className="py-2 px-4 border">تاريخ الإنشاء</th>
              <th className="py-2 px-4 border">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {ticketsData.map((ticket, index) => (
              <tr
                key={index}
                className="text-center border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="py-2 px-4">{ticket.title}</td>
                <td className="py-2 px-4 text-gray-500">{ticket.sender}</td>
                <td className="py-2 px-4">{renderPriority(ticket.priority)}</td>
                <td className="py-2 px-4">{renderStatus(ticket.status)}</td>
                <td className="py-2 px-4 text-gray-500">{ticket.createdAt}</td>
                <td className="py-2 px-4 flex justify-center gap-2">
                  <button className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    <FaEye />
                  </button>
                  <button className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                    <FaCheck />
                  </button>
                  <button className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupportPage;
