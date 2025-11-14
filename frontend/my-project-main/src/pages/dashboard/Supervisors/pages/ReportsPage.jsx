import React, { useState, useEffect } from "react";
import { FaSearch, FaFileAlt, FaPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import supervisorAPI from '../services/supervisorApi';

export default function ReportsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showCreateReportModal, setShowCreateReportModal] = useState(false);
  const [newReport, setNewReport] = useState({
    title: "",
    school_id: "",
    description: "",
    file: null,
    priority: "medium",
    status: "draft"
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [reports, setReports] = useState([]);
  const [urgentReports, setUrgentReports] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reports and schools when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch supervisor reports
        const reportsData = await supervisorAPI.fetchSupervisorReports();
        setReports(reportsData);
        
        // Fetch schools for dropdown
        const schoolsData = await supervisorAPI.fetchSupervisorSchools();
        setSchools(schoolsData);
        
        // For now, we'll use the same data for urgent reports
        setUrgentReports(reportsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const statusClasses = {
    Done: "inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-xs font-semibold bg-[#F0FEED] text-[#259800]",
    Progress: "inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-xs font-semibold bg-[#EDF5FE] text-[#3083FF]",
    Pending: "inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-xs font-semibold bg-[#FEEDED] text-[#DC2626]",
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReport(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, file: 'يجب أن يكون الملف من نوع PDF, DOCX, أو XLSX' }));
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, file: 'حجم الملف يجب أن لا يتجاوز 5 ميجابايت' }));
        return;
      }
      
      setNewReport(prev => ({
        ...prev,
        file: file
      }));
      
      // Clear file error if exists
      if (errors.file) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.file;
          return newErrors;
        });
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!newReport.title.trim()) {
      newErrors.title = 'عنوان التقرير مطلوب';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Create FormData object to send file
      const formData = new FormData();
      formData.append('title', newReport.title);
      formData.append('description', newReport.description);
      formData.append('priority', newReport.priority);
      formData.append('status', newReport.status);
      
      if (newReport.school_id) {
        formData.append('school_id', newReport.school_id);
      }
      
      if (newReport.file) {
        formData.append('file', newReport.file);
      }
      
      // Create report via API
      const createdReport = await supervisorAPI.createSupervisorReport(formData);
      
      // Add to reports list
      setReports(prev => [createdReport, ...prev]);
      setSuccessMessage('تم إنشاء التقرير بنجاح');
      
      // Reset form
      setNewReport({
        title: "",
        school_id: "",
        description: "",
        file: null,
        priority: "medium",
        status: "draft"
      });
      
      // Close modal after delay
      setTimeout(() => {
        setShowCreateReportModal(false);
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error('Error creating report:', error);
      setErrors({ general: 'حدث خطأ أثناء إنشاء التقرير. يرجى المحاولة مرة أخرى.' });
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowCreateReportModal(false);
    setNewReport({
      title: "",
      school: "",
      description: "",
      file: null
    });
    setErrors({});
    setSuccessMessage("");
  };

  const renderTable = (data, columns, keys) => (
    <div className="mt-4">
      {/* Header */}
      <div className={`grid grid-cols-${columns.length} bg-gray-100 dark:bg-gray-800 p-2 text-right font-semibold text-gray-500 dark:text-gray-200 rounded-t-lg`}>
        {columns.map((col, idx) => (
          <div key={idx}>{col}</div>
        ))}
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
              {keys.map((key, idx) =>
                key === "status" ? (
                  <div key={idx}>
                    <span className={statusClasses[item.status]}>
                      {item.status}
                      <span className="w-2 h-2 rounded-full bg-current inline-block"></span>
                    </span>
                  </div>
                ) : (
                  <div key={idx} className="text-gray-500 dark:text-gray-300">{item[key]}</div>
                )
              )}
            </div>
          ))}
      </div>
    </div>
  );

  const totalPages = 10;
  const pages = [1, 2, 3, 4, 5, "dots", totalPages];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8" dir="rtl">
      {/* Header + Filter */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="text-right">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">التقارير</h1>
          <p className="text-gray-500 dark:text-gray-400">عرض وإدارة تقاريرك</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Create Report Button */}
          <button
            onClick={() => setShowCreateReportModal(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaPlus className="text-white" />
            <span>إنشاء تقرير</span>
          </button>
          
          <span className="text-gray-400 dark:text-gray-400 text-sm">
            Filter by <span className="text-[#64C8CC]">dates</span> | <span className="text-[#64C8CC]">Status</span>
          </span>

          <div className="relative w-10 h-8">
            <input
              type="text"
              placeholder=""
              className="w-full h-full border border-gray-300 dark:border-gray-600 rounded text-sm pl-2 pr-8 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-black dark:text-gray-200" />
          </div>
        </div>
      </div>

      {/* Create Report Modal */}
      <AnimatePresence>
        {showCreateReportModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-right">إنشاء تقرير جديد</h2>
                
                {successMessage && (
                  <motion.div 
                    className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-right"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {successMessage}
                  </motion.div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 text-right">عنوان التقرير *</label>
                    <input
                      type="text"
                      name="title"
                      value={newReport.title}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-100 dark:bg-gray-700 border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md p-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="أدخل عنوان التقرير"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1 text-right">{errors.title}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 text-right">اسم المدرسة *</label>
                    <select
                      name="school_id"
                      value={newReport.school_id}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-100 dark:bg-gray-700 border ${errors.school_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md p-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="">اختر المدرسة (اختياري)</option>
                      {schools.map(school => (
                        <option key={school.school_id} value={school.school_id}>{school.name}</option>
                      ))}
                    </select>
                    {errors.school && <p className="text-red-500 text-sm mt-1 text-right">{errors.school}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 text-right">الوصف / حالة المرافق / الملاحظات</label>
                    <textarea
                      name="description"
                      value={newReport.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="أدخل الوصف أو الملاحظات"
                    ></textarea>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 text-right">رفع ملف التقرير (اختياري)</label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.docx,.xlsx"
                      className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {newReport.file && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 text-right">
                        الملف المحدد: {newReport.file.name}
                      </p>
                    )}
                    {errors.file && <p className="text-red-500 text-sm mt-1 text-right">{errors.file}</p>}
                  </div>
                  
                  <div className="flex justify-between gap-4 mt-6">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      رفع التقرير
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table 1: المستلمة */}
      <h2 className="text-right text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">التقارير المستلمة</h2>
      {renderTable(
        reports,
        ["اسم التقرير", "المشرف", "التاريخ", "حالة التقرير", "الاستلام"],
        ["name", "supervisor", "date", "status", "actions"]
      )}
       {/* Pagination */}
      <div className="relative flex items-center px-4 py-2 mt-4">
        <div className="absolute left-0 flex items-center gap-2">
          <span className="text-sm text-slate-950 dark:text-gray-200">Row</span>
          <select
            value={rowsPerPage}
            onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
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
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            )
          )}

          <button
            className="px-2 py-1 border rounded bg-gray-200 dark:bg-gray-600 dark:text-gray-200"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Table 2: المرسلة */}
      <h2 className="text-right text-xl font-bold text-gray-800 dark:text-gray-100 mt-6 mb-2">التقارير المرسلة</h2>
      {renderTable(
        urgentReports,
        ["اسم التقرير", "المعلم", "التاريخ", "حالة التقرير", "التسليم"],
        ["title", "teacher", "date", "status", "actions"]
      )}

      {/* Pagination */}
      <div className="relative flex items-center px-4 py-2 mt-4">
        <div className="absolute left-0 flex items-center gap-2">
          <span className="text-sm text-slate-950 dark:text-gray-200">Row</span>
          <select
            value={rowsPerPage}
            onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
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
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            )
          )}

          <button
            className="px-2 py-1 border rounded bg-gray-200 dark:bg-gray-600 dark:text-gray-200"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-6 mb-8 mt-10">
        {/* Card 1 */}
        <div className="flex-[2] bg-[#F9F9F9] dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-right text-lg font-bold mb-2 text-gray-800 dark:text-gray-100">التقارير المرسلة</h3>
          <div className="border-b border-gray-300 dark:border-gray-600 mb-4"></div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#D1D5DB" strokeWidth="12" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#64C8CC"
                  strokeWidth="12"
                  strokeDasharray="251.2"
                  strokeDashoffset="125.6"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-700 dark:text-gray-100">50%</span>
              </div>
            </div>

            <div className="text-sm w-full md:w-auto text-center">
              <div className="grid grid-cols-2 gap-2 mb-2 bg-[#EFEFF8] dark:bg-gray-700 rounded-lg p-2">
                <span className="text-gray-500 dark:text-gray-300">الاستلام</span>
                <span className="text-gray-500 dark:text-gray-300">النسبة</span>
              </div>

              <div className="grid grid-cols-2 gap-2 items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-gray-400"></div>
                  <span className="text-gray-700 dark:text-gray-200">تم</span>
                </div> 
                <span className="text-gray-700 dark:text-gray-200">50</span>
              </div>

              <div className="grid grid-cols-2 gap-2 items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-[#64C8CC]"></div>
                  <span className="text-gray-700 dark:text-gray-200">قيد التحميل</span>
                </div>
                <span className="text-gray-700 dark:text-gray-200">50</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <h3 className="text-right text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">التقارير المنجزة</h3>
          <div className="flex items-center justify-end p-5 border border-gray-300 dark:border-gray-600 rounded-lg">
            <div className="flex flex-col items-end gap-2">
              <FaFileAlt className="text-2xl text-gray-500 dark:text-gray-200" />
              <span className="text-sm text-gray-600 dark:text-gray-300">reports</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-300">report</span>
                <span className="text-sm text-[#64C8CC]">14/30</span>
                <div className="w-32 h-2 bg-[#64C8CC] rounded-full overflow-hidden">
                  <div className="h-full bg-gray-300 dark:bg-gray-500 w-[46.6%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <h3 className="text-right text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">التقارير العاجلة</h3>
          <div className="flex items-center justify-end p-5 border border-gray-300 dark:border-gray-600 rounded-lg">
            <div className="flex flex-col items-end gap-2">
              <FaFileAlt className="text-2xl text-gray-500 dark:text-gray-200" />
              <span className="text-sm text-gray-600 dark:text-gray-300">reports</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-300">report</span>
                <span className="text-sm text-[#64C8CC]">10/30</span>
                <div className="w-32 h-2 bg-[#64C8CC] rounded-full overflow-hidden">
                  <div className="h-full bg-gray-300 dark:bg-gray-500 w-[33.3%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}