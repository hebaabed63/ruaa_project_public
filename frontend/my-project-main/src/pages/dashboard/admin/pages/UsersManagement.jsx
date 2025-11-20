import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaEye, FaUser, FaUserTie, FaSchool, FaUserFriends } from 'react-icons/fa';
import { showAlert } from "../../../../utils/SweetAlert";
import { 
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
} from "../../../../services/adminService";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phone: ''
  });
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'admins', 'supervisors', 'principals', 'parents'

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let filters = {};
      
      // Apply filters based on active tab
      switch (activeTab) {
        case 'admins':
          filters = { role: 0 };
          break;
        case 'supervisors':
          filters = { role: 1 };
          break;
        case 'principals':
          filters = { role: 2 };
          break;
        case 'parents':
          filters = { role: 3 };
          break;
        default:
          filters = {};
      }
      
      const response = await getAllUsers(filters);
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في جلب المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await createUser(formData);
      if (response.success) {
        showAlert('success', 'تم إنشاء المستخدم بنجاح');
        setShowCreateForm(false);
        resetForm();
        fetchUsers();
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في إنشاء المستخدم');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser(editingUser.user_id, formData);
      if (response.success) {
        showAlert('success', 'تم تحديث المستخدم بنجاح');
        setShowEditForm(false);
        setEditingUser(null);
        resetForm();
        fetchUsers();
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في تحديث المستخدم');
    }
  };

  const handleDeleteUser = async (userId) => {
    const result = await showAlert(
      'warning',
      'هل أنت متأكد من حذف هذا المستخدم؟',
      'لا يمكن التراجع عن هذا الإجراء',
      'نعم، احذفه!',
      'إلغاء'
    );
    
    if (result.isConfirmed) {
      try {
        const response = await deleteUser(userId);
        if (response.success) {
          showAlert('success', 'تم حذف المستخدم بنجاح');
          fetchUsers();
        }
      } catch (error) {
        showAlert('error', error.message || 'حدث خطأ في حذف المستخدم');
      }
    }
  };

  const openEditForm = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || '',
      phone: user.phone || ''
    });
    setShowEditForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: '',
      phone: ''
    });
  };

  const getRoleName = (role) => {
    switch (role) {
      case 0:
      case 'admin':
        return 'مدير النظام';
      case 1:
      case 'supervisor':
        return 'مشرف';
      case 2:
      case 'school_manager':
        return 'مدير مدرسة';
      case 3:
      case 'parent':
        return 'ولي أمر';
      default:
        return role;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 0:
      case 'admin':
        return <FaUser className="text-red-600" />;
      case 1:
      case 'supervisor':
        return <FaUserTie className="text-blue-600" />;
      case 2:
      case 'school_manager':
        return <FaSchool className="text-green-600" />;
      case 3:
      case 'parent':
        return <FaUserFriends className="text-purple-600" />;
      default:
        return <FaUser className="text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          نشط
        </span>;
      case 'inactive':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          غير نشط
        </span>;
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          معلق
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          غير معروف
        </span>;
    }
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
        <h1 className="text-2xl font-bold text-gray-800">إدارة المستخدمين</h1>
        <button
          onClick={() => {
            resetForm();
            setShowCreateForm(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="ml-2" />
          إضافة مستخدم جديد
        </button>
      </div>

      {/* Tabs for user types */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8 space-x-reverse" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center">
              <FaUser className="ml-2" />
              جميع المستخدمين
            </div>
          </button>
          <button
            onClick={() => setActiveTab('admins')}
            className={`py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'admins'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center">
              <FaUser className="ml-2 text-red-600" />
              مديرو النظام
            </div>
          </button>
          <button
            onClick={() => setActiveTab('supervisors')}
            className={`py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'supervisors'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center">
              <FaUserTie className="ml-2 text-blue-600" />
              المشرفون
            </div>
          </button>
          <button
            onClick={() => setActiveTab('principals')}
            className={`py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'principals'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center">
              <FaSchool className="ml-2 text-green-600" />
              مديرو المدارس
            </div>
          </button>
          <button
            onClick={() => setActiveTab('parents')}
            className={`py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'parents'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center">
              <FaUserFriends className="ml-2 text-purple-600" />
              أولياء الأمور
            </div>
          </button>
        </nav>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">إضافة مستخدم جديد</h3>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="اسم المستخدم"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="البريد الإلكتروني"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الدور
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">اختر الدور</option>
                  <option value="0">مدير النظام</option>
                  <option value="1">مشرف</option>
                  <option value="2">مدير مدرسة</option>
                  <option value="3">ولي أمر</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="رقم الهاتف"
                />
              </div>

              <div className="flex space-x-4 space-x-reverse pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  إنشاء المستخدم
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
            <h3 className="text-xl font-bold mb-4">تعديل المستخدم</h3>
            
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="اسم المستخدم"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="البريد الإلكتروني"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الدور
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">اختر الدور</option>
                  <option value="0">مدير النظام</option>
                  <option value="1">مشرف</option>
                  <option value="2">مدير مدرسة</option>
                  <option value="3">ولي أمر</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="رقم الهاتف"
                />
              </div>

              <div className="flex space-x-4 space-x-reverse pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  تحديث المستخدم
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

      {users.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الاسم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    البريد الإلكتروني
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الدور
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center ml-3">
                          {getRoleIcon(user.role)}
                        </div>
                        <div>
                          {user.name}
                          {user.phone && (
                            <div className="text-xs text-gray-500">{user.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        {getRoleIcon(user.role)}
                        <span className="mr-2">{getRoleName(user.role)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          onClick={() => openEditForm(user)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="تعديل"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.user_id)}
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مستخدمين</h3>
          <p className="text-gray-500 mb-4">قم بإضافة مستخدم جديد</p>
          <button
            onClick={() => {
              resetForm();
              setShowCreateForm(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
          >
            <FaPlus className="ml-2" />
            إضافة مستخدم جديد
          </button>
        </div>
      )}
    </div>
  );
}