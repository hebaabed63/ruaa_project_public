import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function ComplaintsPage() {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentTable, setCurrentTable] = useState("all");
  const [currentPages, setCurrentPages] = useState({
    all: 1,
    admins: 1,
    supervisors: 1,
    schoolManagers: 1,
  });

  const reportsData = {
    all: [
      { id: 1, name: "تحسين خدمات المرافق", role: "ولي أمر", date: "July 1, 2024", status: "Done", actions: "تم الاستلام" },
      { id: 2, name: "الحاجة لأجهزة حاسوب جديدة", role: "مشرف", date: "July 25, 2024", status: "Progress", actions: "لم يتم الإرسال" },
      { id: 3, name: "تعديل على الأنشطة", role: "مدير مدرسة", date: "July 26, 2024", status: "Pending", actions: "-" },
      { id: 4, name: "تبديل مواعيد الحصص", role: " مشرف", date: "July 27, 2024", status: "Done", actions: "تم الاستلام" },
      { id: 5, name: "تبديل مواعيد الحصص", role: "ولي أمر", date: "July 28, 2024", status: "Progress", actions: "لم يتم الإرسال" },
      { id: 6, name: "تعديل على الأنشطة", role: "مدير مدرسة", date: "July 29, 2024", status: "Pending", actions: "-" },
      ],
    admins: [
      { id: 1, name: " نقل من المدرسة", role: " ولي أمر", date: "July 5, 2024", status: "Done", actions: "تم الاستلام" },
          { id: 2, name: " شكوى على معلم", role: " ولي أمر", date: "July 8, 2024", status: "Pending", actions: "-" },
      { id: 3, name: "شكوى عن طالب آخر", role: "ولي أمر", date: "July 9, 2024", status: "Progress", actions: "لم يتم الإرسال"},

    ],
    supervisors: [
      { id: 1, name: " تعديل على الأنشطة", role: "مشرف", date: "July 10, 2024", status: "Progress", actions:"لم يتم الإرسال"},
          { id: 2, name: " تعديل على واجهة تسجيل الدخول", role: "مشرف", date: "July 25, 2024", status: "Done", actions:"تم الاستلام"},
      { id: 3, name: " إضافة مدارس جديدة", role: "مشرف", date: "July 17, 2024", status: "Progress", actions:"لم يتم الإرسال"},

    ],
    schoolManagers: [
      { id: 1, name: " زيادة مدة الاستراحة", role: "مدير مدرسة", date: "July 15, 2024", status: "Pending", actions: "-" },
         { id:2 , name: "تعديل على مواعيد الحصص ", role: "مدير مدرسة", date: "July 30, 2024", status: "Done", actions: "تم الاستلام" },
      { id: 3, name: "افتتاح صف جديد ", role: "مدير مدرسة", date: "July 2, 2024", status: "Pending", actions: "-" },

    ],
  };

  const statusClasses = {
    Done: "inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-xs font-semibold bg-[#F0FEED] text-[#259800]",
    Progress: "inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-xs font-semibold bg-[#EDF5FE] text-[#3083FF]",
    Pending: "inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-xs font-semibold bg-[#FEEDED] text-[#DC2626]",
  };

  const generatePages = (totalPages, currentPage) => {
    const delta = 2; 
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    let lastPage = 0;
    for (let i of range) {
      if (i - lastPage > 1) {
        rangeWithDots.push("dots");
      }
      rangeWithDots.push(i);
      lastPage = i;
    }

    return rangeWithDots;
  };

  const renderTable = (data, tableKey) => {
    const currentPage = currentPages[tableKey];
    const totalPages = Math.ceil(data.length / rowsPerPage);

    const goToPage = (page) => {
      setCurrentPages({ ...currentPages, [tableKey]: page });
    };

    const pages = generatePages(totalPages, currentPage);

    return (
      <div className="mt-4">
        <div className="grid grid-cols-5 font-bold bg-gray-100 dark:bg-gray-800 p-2 text-right  text-gray-500 dark:text-gray-200 rounded-t-lg">
          <div>اسم التقرير</div>
          <div>دور المستخدم</div>
          <div>التاريخ</div>
          <div>حالة التقرير</div>
          <div>التسليم</div>
        </div>

        {/* Rows */}
        <div className="space-y-2 p-2">
          {data
            .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
            .map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-5 bg-white dark:bg-gray-700 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
              >
                <div className="text-gray-800 dark:text-gray-300">{item.name}</div>
                <div className="text-gray-500 dark:text-gray-300">{item.role}</div>
                <div className="text-gray-500 dark:text-gray-300">{item.date}</div>
                <div>
                  <span className={statusClasses[item.status]}>
                    {item.status}
                    <span className="w-2 h-2 rounded-full bg-current inline-block"></span>
                  </span>
                </div>
                <div className="text-gray-500 dark:text-gray-300">{item.actions}</div>
              </div>
            ))}
        </div>

        {/* Pagination */}
        <div className="relative flex items-center px-4 py-2 mt-4">
          <div className="absolute left-0 flex items-center gap-2">
            <span className="text-sm text-slate-950 dark:text-gray-200">Row</span>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); goToPage(1); }}
              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-slate-950 dark:text-gray-200">Show</span>
          </div>

          <div className="flex justify-center items-center gap-1 w-full">
            <button
              className="px-2 py-1 border rounded bg-gray-200 dark:bg-gray-600 dark:text-gray-200"
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
            >
              &lt;
            </button>

            {pages.map((page, idx) =>
              page === "dots" ? (
                <span key={idx} className="px-2 dark:text-gray-200">..</span>
              ) : (
                <button
                  key={idx}
                  className={`px-2 py-1 ${currentPage === page ? "bg-[#64C8CC] text-white" : "dark:text-gray-200"}`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              )
            )}

            <button
              className="px-2 py-1 border rounded bg-gray-200 dark:bg-gray-600 dark:text-gray-200"
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8" dir="rtl">
      <div className="text-right mb-6">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">الشكاوي</h1>
      </div>

      <div className="mb-6 border-b-2 border-gray-300 dark:border-gray-700">
        <div className="flex gap-4">
          {[
            { key: "all", label: "شكاوي جميع المستخدمين" },
            { key: "supervisors", label: "المشرفون" },
            { key: "schoolManagers", label: "مديرو المدارس" },
                        { key: "admins", label: "أولياء الأمور" },

          ].map((tab) => {
            let selectedColorClass = "";
            if (tab.key === "admins" || tab.key === "schoolManagers" || tab.key === "supervisors" ) {
              selectedColorClass = "text-green-600 border-green-600";
            } else if (tab.key === "all") {
              selectedColorClass = "text-blue-600 border-blue-600";
            }

            return (
              <button
                key={tab.key}
                onClick={() => setCurrentTable(tab.key)}
                className={`px-4 py-2 font-medium transition-colors duration-200 border-b-2 ${
                  currentTable === tab.key
                    ? `${selectedColorClass} -mb-[2px]`
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {renderTable(reportsData[currentTable], currentTable)}
    </div>
  );
}
