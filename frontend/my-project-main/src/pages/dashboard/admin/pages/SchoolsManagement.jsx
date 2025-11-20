import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaEye, FaSchool } from 'react-icons/fa';
import { showAlert } from "../../../../utils/SweetAlert";
import { 
  getAllSchools,
  createSchool,
  updateSchool,
  deleteSchool
} from "../../../../services/adminService";

export default function SchoolsManagement() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    address: '',
    // Removed phone field as it's not in the actual data structure
  });

  // Fetch schools on component mount
  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const response = await getAllSchools();
      if (response.success) {
        // Extract data from pagination structure
        const schoolsData = response.data.data || response.data;
        setSchools(schoolsData);
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في جلب المدارس');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchool = async (e) => {
    e.preventDefault();
    try {
      const response = await createSchool(formData);
      if (response.success) {
        showAlert('success', 'تم إنشاء المدرسة بنجاح');
        setShowCreateForm(false);
        resetForm();
        fetchSchools();
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في إنشاء المدرسة');
    }
  };

  const handleUpdateSchool = async (e) => {
    e.preventDefault();
    try {
      // Extract school_id from the school object
      const schoolId = editingSchool.school_id;
      const response = await updateSchool(schoolId, formData);
      if (response.success) {
        showAlert('success', 'تم تحديث المدرسة بنجاح');
        setShowEditForm(false);
        setEditingSchool(null);
        resetForm();
        fetchSchools();
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في تحديث المدرسة');
    }
  };

  const handleDeleteSchool = async (schoolId) => {
    const result = await showAlert(
      'warning',
      'هل أنت متأكد من حذف هذه المدرسة؟',
      'لا يمكن التراجع عن هذا الإجراء',
      'نعم، احذفها!',
      'إلغاء'
    );
    
    if (result.isConfirmed) {
      try {
        const response = await deleteSchool(schoolId);
        if (response.success) {
          showAlert('success', 'تم حذف المدرسة بنجاح');
          fetchSchools();
        }
      } catch (error) {
        showAlert('error', error.message || 'حدث خطأ في حذف المدرسة');
      }
    }
  };

  const openEditForm = (school) => {
    setEditingSchool(school);
    setFormData({
      name: school.name || '',
      type: school.type || '',
      address: school.address || '',
      // Removed phone field as it's not in the actual data structure
    });
    setShowEditForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      address: '',
      // Removed phone field as it's not in the actual data structure
    });
  };

  const getTypeName = (type) => {
    // The API now returns Arabic type values directly, so we can return them as-is
    return type;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">إدارة المدارس</h1>
        <button
          onClick={() => {
            resetForm();
            setShowCreateForm(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="ml-2" />
          إضافة مدرسة جديدة
        </button>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">إضافة مدرسة جديدة</h3>
            
            <form onSubmit={handleCreateSchool} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المدرسة
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="اسم المدرسة"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  النوع
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">اختر النوع</option>
                  <option value="primary">ابتدائي</option>
                  <option value="preparatory">متوسط</option>
                  <option value="secondary">ثانوي</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="عنوان المدرسة"
                />
              </div>

              <div className="flex space-x-4 space-x-reverse pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  إنشاء المدرسة
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">تعديل المدرسة</h3>
            
            <form onSubmit={handleUpdateSchool} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المدرسة
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="اسم المدرسة"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  النوع
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">اختر النوع</option>
                  <option value="primary">ابتدائي</option>
                  <option value="preparatory">متوسط</option>
                  <option value="secondary">ثانوي</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="عنوان المدرسة"
                />
              </div>

              <div className="flex space-x-4 space-x-reverse pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  تحديث المدرسة
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {schools.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اسم المدرسة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    النوع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العنوان
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schools.map((school) => (
                  <tr key={school.school_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <FaSchool className="ml-2 text-blue-500" />
                        {school.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getTypeName(school.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {school.address || 'غير محدد'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          onClick={() => openEditForm(school)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="تعديل"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteSchool(school.school_id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="حذف"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مدارس</h3>
          <p className="text-gray-500 mb-4">قم بإضافة مدرسة جديدة</p>
          <button
            onClick={() => {
              resetForm();
              setShowCreateForm(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
          >
            <FaPlus className="ml-2" />
            إضافة مدرسة جديدة
          </button>
        </div>
      )}
    </div>
  );
}