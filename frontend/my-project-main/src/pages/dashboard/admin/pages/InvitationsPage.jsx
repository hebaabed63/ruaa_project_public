import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaEdit, FaCopy, FaCheck, FaTimes, FaPlus } from "react-icons/fa";
import * as Yup from "yup";
// Fixed import to use correct admin data hook
import { useInvitations } from "../hooks/useAdminData";

// Validation schema for invitation form
const invitationSchema = Yup.object().shape({
  institution: Yup.string()
    .required('المؤسسة/المديريّة مطلوبة')
    .min(3, 'اسم المؤسسة يجب أن يكون أكثر من 3 أحرف'),
  expiration: Yup.date()
    .nullable(),
  usages: Yup.number()
    .nullable()
    .min(1, 'عدد الاستخدامات يجب أن يكون على الأقل 1')
    .max(100, 'عدد الاستخدامات يجب ألا يتجاوز 100')
});

export default function InvitationsPage() {
  // Updated to use correct admin data hook functions
  const { invitations, loading, error, refetch, createInvitation, updateInvitation, deleteInvitation } = useInvitations();
  const [activeTab, setActiveTab] = useState("links");
  const [showModal, setShowModal] = useState(false);
  const [editingInvitation, setEditingInvitation] = useState(null);
  const [formData, setFormData] = useState({
    institution: "",
    expiration: "",
    usages: ""
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = async () => {
    try {
      await invitationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach(error => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleCreateLink = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      await createInvitation(formData);
      setFormData({ institution: "", expiration: "", usages: "" });
      setEditingInvitation(null);
      setShowModal(false);
      // Refresh the list
      refetch();
    } catch (err) {
      setErrors({ submit: err.message });
    }
  };

  const handleEditLink = (invitation) => {
    setEditingInvitation(invitation);
    setFormData({
      institution: invitation.institution || "",
      expiration: invitation.expiration || "",
      usages: invitation.usages || ""
    });
    setShowModal(true);
  };

  const handleUpdateLink = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      await updateInvitation(editingInvitation.id, formData);
      setFormData({ institution: "", expiration: "", usages: "" });
      setEditingInvitation(null);
      setShowModal(false);
      // Refresh the list
      refetch();
    } catch (err) {
      setErrors({ submit: err.message });
    }
  };

  const handleDeleteLink = async (invitationId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الرابط؟")) {
      try {
        await deleteInvitation(invitationId);
        // Refresh the list
        refetch();
      } catch (err) {
        alert("حدث خطأ أثناء حذف الرابط: " + err.message);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">خطأ! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto p-4 bg-white dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      dir="rtl"
    >
      <motion.h1 
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        إدارة الدعوات والطلبات
      </motion.h1>

      {/* Tabs */}
      <motion.div 
        className="flex mb-6 border-b border-gray-300 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "links"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("links")}
        >
          روابط الدعوات
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "requests"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("requests")}
        >
          طلبات التسجيل
        </button>
      </motion.div>

      {/* محتوى روابط الدعوات */}
      {activeTab === "links" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-end mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingInvitation(null);
                setFormData({ institution: "", expiration: "", usages: "" });
                setErrors({});
                setShowModal(true);
              }}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaPlus /> إنشاء رابط دعوة
            </motion.button>
          </div>

          <motion.div 
            className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <table className="w-full text-right border-collapse rounded-lg">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-200">
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <th className="px-4 py-2 font-bold">المديريّة/المؤسسة</th>
                  <th className="px-4 py-2 font-bold">الحالة</th>
                  <th className="px-4 py-2 font-bold">الاستخدامات</th>
                  <th className="px-4 py-2 font-bold">تاريخ الانتهاء</th>
                  <th className="px-4 py-2 font-bold">الإجراءات</th>
                </tr>
              </thead>

              <tbody>
                {invitations.map((inv, index) => (
                  <motion.tr
                    key={inv.id}
                    className="border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <td className="px-4 py-3 rounded-s-lg">{inv.institution || 'غير محدد'}</td>
                    <td className="px-4 py-3">
                      {inv.status === "active" ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 text-sm font-medium">
                          <span className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400 inline-block"></span>
                          نشط
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 text-sm font-medium">
                          <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-400 inline-block"></span>
                          غير نشط
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {inv.used_count || 0} / {inv.max_usages || 'غير محدود'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {inv.expires_at ? new Date(inv.expires_at).toLocaleDateString('ar-SA') : "غير محدد"}
                    </td>
                    <td className="px-4 py-3 rounded-e-lg">
                      <div className="flex gap-3 justify-start">
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteLink(inv.id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="حذف"
                        >
                          <FaTrash />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditLink(inv)}
                          className="text-blue-500 hover:text-blue-700"
                          aria-label="تعديل"
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => copyToClipboard(`${window.location.origin}/invite/${inv.token}`)}
                          className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-500"
                          aria-label="نسخ الرابط"
                        >
                          <FaCopy />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* النافذة المنبثقة */}
          {showModal && (
            <motion.div 
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md text-right text-gray-900 dark:text-gray-200"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">
                    {editingInvitation ? "تعديل رابط الدعوة" : "إنشاء رابط دعوة مشرف جديد"}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <FaTimes />
                  </motion.button>
                </div>
                
                {errors.submit && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {errors.submit}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1">المؤسسة/المديريّة</label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 ${
                        errors.institution ? "border-red-500" : ""
                      }`}
                      placeholder="اسم المؤسسة/المديرية"
                    />
                    {errors.institution && (
                      <p className="text-red-500 text-sm mt-1">{errors.institution}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block mb-1">تاريخ الانتهاء (اختياري)</label>
                    <input
                      type="date"
                      name="expiration"
                      value={formData.expiration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1">عدد الاستخدامات المسموحة (اختياري)</label>
                    <input
                      type="number"
                      name="usages"
                      value={formData.usages}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 ${
                        errors.usages ? "border-red-500" : ""
                      }`}
                      placeholder="غير محدود"
                      min="1"
                      max="100"
                    />
                    {errors.usages && (
                      <p className="text-red-500 text-sm mt-1">{errors.usages}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={editingInvitation ? handleUpdateLink : handleCreateLink}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {editingInvitation ? "تحديث الرابط" : "إنشاء الرابط"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(false)}
                    className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    إلغاء
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* محتوى طلبات التسجيل */}
      {activeTab === "requests" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">وظيفة طلبات التسجيل غير متوفرة حالياً</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}