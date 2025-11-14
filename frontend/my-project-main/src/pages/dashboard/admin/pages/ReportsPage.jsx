import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
// Import admin hooks
import { useReports } from "../hooks/useAdminData";

export default function ReportsPage() {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentTable, setCurrentTable] = useState("all");
  const [currentPages, setCurrentPages] = useState({
    all: 1,
    admins: 1,
    supervisors: 1,
    schoolManagers: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  
  // Use admin reports hook instead of mock data
  const { reports, loading, error, refetch } = useReports();

  // Filter reports based on current table and search term
  const filteredReports = reports.filter(report => {
    // Filter by search term
    const matchesSearch = !searchTerm || 
      (report.title && report.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.description && report.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by role if specific table is selected
    if (currentTable === "admins") {
      return matchesSearch && report.userRole === "admin";
    } else if (currentTable === "supervisors") {
      return matchesSearch && report.userRole === "supervisor";
    } else if (currentTable === "schoolManagers") {
      return matchesSearch && report.userRole === "school_manager";
    }
    
    // For "all" table, show all reports that match search
    return matchesSearch;
  });

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

    // Format report data for display
    const formatReportData = (report) => {
      return {
        id: report.id,
        name: report.title || 'تقرير غير معنون',
        role: report.userRole === 'admin' ? 'مدير نظام' : 
              report.userRole === 'supervisor' ? 'مشرف' : 
              report.userRole === 'school_manager' ? 'مدير مدرسة' : 
              report.userRole || 'غير محدد',
        date: report.created_at ? new Date(report.created_at).toLocaleDateString('ar-SA') : 'غير محدد',
        status: report.status === 'completed' ? 'Done' : 
                report.status === 'in_progress' ? 'Progress' : 'Pending',
        actions: report.status === 'completed' ? 'تم الاستلام' : 
                 report.status === 'in_progress' ? 'لم يتم الإرسال' : '-'
      };
    };

    return (
      <div className="mt-4">
        <div className="grid grid-cols-5 font-bold bg-gray-100 dark:bg-gray-800 p-2 text-right  text-gray-500 dark:text-gray-200 rounded-t-lg">
          <div>اسم التقرير</div>
          <div>دور المستخدم</div>
          <div>التاريخ</div>
          <div>حالة التقرير</div>
          <div>التسليم</div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-4">
            <p>جاري تحميل التقارير...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>حدث خطأ أثناء تحميل التقارير: {error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && data.length === 0 && (
          <div className="text-center py-4">
            <p>لا توجد تقارير متاحة</p>
          </div>
        )}

        {/* Rows */}
        {!loading && !error && data.length > 0 && (
          <div className="space-y-2 p-2">
            {data
              .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
              .map((report) => {
                const item = formatReportData(report);
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-5 bg-white dark:bg-gray-700 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
                  >
                    <div className="text-gray-800 dark:text-gray-300">{item.name}</div>
                    <div className="text-gray-500 dark:text-gray-300">{item.role}</div>
                    <div className="text-gray-500 dark:text-gray-300">{item.date}</div>
                    <div>
                      <span className={statusClasses[item.status]}>
                        {item.status === 'Done' ? 'مكتمل' : 
                         item.status === 'Progress' ? 'قيد التنفيذ' : 'معلق'}
                        <span className="w-2 h-2 rounded-full bg-current inline-block"></span>
                      </span>
                    </div>
                    <div className="text-gray-500 dark:text-gray-300">{item.actions}</div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && data.length > 0 && (
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
                disabled={currentPage === 1}
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
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8" dir="rtl">
      <div className="text-right mb-6">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">التقارير</h1>
      </div>

      {/* Search Bar */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="بحث في التقارير..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <div className="mb-6 border-b-2 border-gray-300 dark:border-gray-700">
        <div className="flex gap-4">
          {[
            { key: "all", label: "تقارير جميع المستخدمين" },
            { key: "admins", label: "مديرو النظام" },
            { key: "supervisors", label: "المشرفون" },
            { key: "schoolManagers", label: "مديرو المدارس" },
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

      {renderTable(filteredReports, currentTable)}
    </div>
  );
}