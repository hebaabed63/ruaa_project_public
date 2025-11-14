import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaEdit, FaPlus, FaTimes } from "react-icons/fa";
import * as Yup from "yup";
// Updated import to use correct admin data hook
import { useUsers } from "../hooks/useAdminData";

// Validation schema for user form
const userSchema = Yup.object().shape({
  name: Yup.string()
    .required('الاسم مطلوب')
    .min(2, 'الاسم يجب أن يكون أكثر من حرفين')
    .max(50, 'الاسم يجب أن يكون أقل من 50 حرف'),
  email: Yup.string()
    .email('صيغة البريد الإلكتروني غير صحيحة')
    .required('البريد الإلكتروني مطلوب'),
  role: Yup.string()
    .required('الدور مطلوب'),
  phone: Yup.string()
    .matches(/^05\d{8}$/, 'رقم الهاتف يجب أن يكون بصيغة صحيحة (05xxxxxxxx)')
});

export default function UsersPage() {
  // Updated to use correct admin data hook functions
  const { users, loading, error, refetch, createSchool, updateSchool, deleteSchool } = useUsers();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    phone: ""
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
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
      await userSchema.validate(newUser, { abortEarly: false });
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

  const handleCreateUser = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      // Note: In the admin API, we don't have direct user creation
      // We'll need to implement this functionality or use existing school management
      // For now, we'll just close the modal and show a message
      alert("وظيفة إنشاء المستخدم غير متوفرة حالياً. يرجى استخدام إدارة المدارس بدلاً من ذلك.");
      setNewUser({ name: "", email: "", role: "", phone: "" });
      setEditingUser(null);
      setShowModal(false);
    } catch (err) {
      setErrors({ submit: err.message });
    }
  };

  const handleEditUser = (user) => {
    // Note: In the admin API, we don't have direct user editing
    // We'll need to implement this functionality or use existing school management
    // For now, we'll just show a message
    alert("وظيفة تعديل المستخدم غير متوفرة حالياً. يرجى استخدام إدارة المدارس بدلاً من ذلك.");
  };

  const handleDeleteUser = async (userId) => {
    // Note: In the admin API, we don't have direct user deletion
    // We'll need to implement this functionality or use existing school management
    // For now, we'll just show a message
    alert("وظيفة حذف المستخدم غير متوفرة حالياً. يرجى استخدام إدارة المدارس بدلاً من ذلك.");
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
      <div className="flex justify-between items-center mb-6">
        <motion.h1 
          className="text-2xl font-bold text-gray-900 dark:text-white"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          إدارة المستخدمين
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingUser(null);
            setNewUser({ name: "", email: "", role: "", phone: "" });
            setErrors({});
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <FaPlus /> إضافة مستخدم
        </motion.button>
      </div>

      <motion.div 
        className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <table className="w-full text-right border-collapse rounded-lg">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-200">
            <tr className="border-b border-gray-300 dark:border-gray-700">
              <th className="px-4 py-3 font-bold">الاسم</th>
              <th className="px-4 py-3 font-bold">البريد الإلكتروني</th>
              <th className="px-4 py-3 font-bold">الدور</th>
              <th className="px-4 py-3 font-bold">رقم الهاتف</th>
              <th className="px-4 py-3 font-bold">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <motion.tr 
                key={user.id}
                className="border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{user.email}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{user.phone || "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEditUser(user)}
                      className="text-blue-500 hover:text-blue-700"
                      aria-label="تعديل"
                    >
                      <FaEdit />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="حذف"
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Modal */}
      {showModal && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md text-gray-900 dark:text-gray-100"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingUser ? "تعديل مستخدم" : "إضافة مستخدم جديد"}
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
                <label className="block mb-1">الاسم</label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  placeholder="اسم المستخدم"
                  onChange={handleInputChange}
                  className={`w-full border px-3 py-2 rounded mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  placeholder="البريد الإلكتروني للمستخدم"
                  onChange={handleInputChange}
                  className={`w-full border px-3 py-2 rounded mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block mb-1">الدور</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  className={`w-full border px-3 py-2 rounded mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${
                    errors.role ? "border-red-500" : ""
                  }`}
                >
                  <option value="">اختر الدور</option>
                  <option value="مدير النظام">مدير النظام</option>
                  <option value="مشرف">مشرف</option>
                  <option value="مدير مدرسة">مدير مدرسة</option>
                  <option value="ولي أمر">ولي أمر</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>

              <div>
                <label className="block mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  name="phone"
                  value={newUser.phone}
                  placeholder="رقم هاتف المستخدم"
                  onChange={handleInputChange}
                  className={`w-full border px-3 py-2 rounded mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateUser}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                {editingUser ? "تحديث" : "إنشاء"}
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
  );
}