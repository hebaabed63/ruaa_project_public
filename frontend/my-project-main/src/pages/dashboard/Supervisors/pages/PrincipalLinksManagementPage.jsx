import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaLink, FaCheck, FaTimes, FaCopy } from 'react-icons/fa';
import { 
  getSupervisorPrincipalLinks, 
  createSupervisorPrincipalLink, 
  updateSupervisorPrincipalLink, 
  deleteSupervisorPrincipalLink
} from "../../../../services/supervisorService";
import { showAlert } from "../../../../utils/SweetAlert";

const PrincipalLinksManagementPage = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [formData, setFormData] = useState({
    organization_name: '',
    expires_at: '',
    max_uses: ''
  });

  // Fetch links on component mount
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await getSupervisorPrincipalLinks();
      if (response.success) {
        setLinks(response.data);
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في جلب الروابط');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = async (e) => {
    e.preventDefault();
    
    try {
      // Validation
      if (!formData.organization_name.trim()) {
        showAlert('error', 'اسم المؤسسة/المدرسة مطلوب');
        return;
      }

      const cleanData = {
        organization_name: formData.organization_name.trim(),
        expires_at: formData.expires_at || null,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null
      };

      const response = await createSupervisorPrincipalLink(cleanData);
      
      if (response.success) {
        showAlert('success', 'تم إنشاء رابط الدعوة بنجاح');
        setFormData({ organization_name: '', expires_at: '', max_uses: '' });
        setShowCreateForm(false);
        fetchLinks();
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في إنشاء الرابط');
    }
  };

  const handleUpdateLink = async (linkId, data) => {
    try {
      const cleanData = {
        is_active: data.is_active,
        expires_at: data.expires_at || null,
        max_uses: data.max_uses ? parseInt(data.max_uses) : null,
        organization_name: data.organization_name
      };

      const response = await updateSupervisorPrincipalLink(linkId, cleanData);
      
      if (response.success) {
        showAlert('success', 'تم تحديث رابط الدعوة بنجاح');
        setEditingLink(null);
        fetchLinks();
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في تحديث الرابط');
    }
  };

  const handleDeleteLink = async (linkId) => {
    try {
      const result = await showAlert(
        'warning',
        'هل أنت متأكد من حذف الرابط؟',
        'لا يمكن التراجع عن هذا الإجراء',
        'نعم، احذفه!',
        'إلغاء'
      );
      
      if (result.isConfirmed) {
        const response = await deleteSupervisorPrincipalLink(linkId);
        if (response.success) {
          showAlert('success', 'تم حذف رابط الدعوة بنجاح');
          fetchLinks();
        }
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في حذف الرابط');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showAlert('success', 'تم نسخ الرابط إلى الحافظة');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'بدون تاريخ انتهاء';
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const getStatusBadge = (link) => {
    if (!link.is_active) {
      return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">غير نشط</span>;
    }
    
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">منتهي</span>;
    }
    
    if (link.max_uses && link.uses_count >= link.max_uses) {
      return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">مكتمل</span>;
    }
    
    return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">نشط</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">روابط دعوة مدراء المدارس</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              إدارة روابط الدعوة الخاصة بمدراء المدارس
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaPlus />
            إنشاء رابط جديد
          </button>
        </div>
      </div>

      {/* Create Link Form */}
      {showCreateForm && (
        <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">إنشاء رابط دعوة جديد</h3>
          <form onSubmit={handleCreateLink}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  اسم المؤسسة/المدرسة *
                </label>
                <input
                  type="text"
                  value={formData.organization_name}
                  onChange={(e) => setFormData({...formData, organization_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل اسم المؤسسة أو المدرسة"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  تاريخ انتهاء الصلاحية (اختياري)
                </label>
                <input
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  الحد الأقصى للاستخدامات (اختياري)
                </label>
                <input
                  type="number"
                  value={formData.max_uses}
                  onChange={(e) => setFormData({...formData, max_uses: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="عدد الاستخدامات المسموح بها"
                  min="1"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                إنشاء الرابط
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({ organization_name: '', expires_at: '', max_uses: '' });
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Links List */}
      <div className="overflow-x-auto">
        {links.length === 0 ? (
          <div className="text-center py-12">
            <FaLink className="mx-auto text-gray-400 text-4xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">لا توجد روابط دعوة</h3>
            <p className="text-gray-500 dark:text-gray-400">
              اضغط على زر "إنشاء رابط جديد" لإنشاء رابط دعوة لمدير مدرسة
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  المؤسسة/المدرسة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الرابط
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الاستخدامات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  انتهاء الصلاحية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {links.map((link) => (
                <tr key={link.link_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {link.organization_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="truncate max-w-xs">{`${window.location.origin}/register/principal?supervisor_token=${link.token}`}</span>
                      <button
                        onClick={() => copyToClipboard(`${window.location.origin}/register/principal?supervisor_token=${link.token}`)}
                        className="text-blue-600 hover:text-blue-800"
                        title="نسخ الرابط"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {link.uses_count} / {link.max_uses || '∞'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(link)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(link.expires_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingLink(link);
                          setFormData({
                            organization_name: link.organization_name,
                            expires_at: link.expires_at ? link.expires_at.split('T')[0] : '',
                            max_uses: link.max_uses || ''
                          });
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="تعديل"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteLink(link.link_id)}
                        className="text-red-600 hover:text-red-900"
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
        )}
      </div>

      {/* Edit Link Form (Modal) */}
      {editingLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">تعديل رابط الدعوة</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateLink(editingLink.link_id, formData);
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  اسم المؤسسة/المدرسة
                </label>
                <input
                  type="text"
                  value={formData.organization_name}
                  onChange={(e) => setFormData({...formData, organization_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  تاريخ انتهاء الصلاحية (اختياري)
                </label>
                <input
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  الحد الأقصى للاستخدامات (اختياري)
                </label>
                <input
                  type="number"
                  value={formData.max_uses}
                  onChange={(e) => setFormData({...formData, max_uses: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  تحديث الرابط
                </button>
                <button
                  type="button"
                  onClick={() => setEditingLink(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrincipalLinksManagementPage;