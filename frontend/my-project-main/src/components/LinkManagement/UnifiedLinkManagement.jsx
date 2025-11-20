import React, { useState } from "react";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCopy, 
  FaUserTie,
  FaSchool,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner
} from 'react-icons/fa';
import { showAlert, showConfirmAlert } from "../../utils/SweetAlert";

const UnifiedLinkManagement = ({
  links = [],
  pendingRequests = [],
  loading = false,
  linkType = 'supervisor', // 'supervisor' or 'principal'
  onCreateLink,
  onUpdateLink,
  onDeleteLink,
  onApproveRequest,
  onRejectRequest,
  showPendingTab = true,
  entityName = 'المؤسسة/المديرية', // For supervisor links
  schoolName = 'المدرسة', // For principal links
  createLinkLabel = 'رابط دعوة جديد',
  pendingRequestsLabel = 'الطلبات المعلقة',
  noLinksMessage = 'لا توجد روابط دعوة',
  noPendingRequestsMessage = 'لا توجد طلبات معلقة'
}) => {
  const [activeTab, setActiveTab] = useState('links');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [formData, setFormData] = useState({
    organization_name: '',
    expires_at: '',
    max_uses: '',
    is_active: true
  });

  const handleCreateLink = async (e) => {
    e.preventDefault();
    try {
      // Validation for organization_name
      if (!formData.organization_name || formData.organization_name.trim() === '') {
        showAlert('error', 'اسم المؤسسة/المديرية مطلوب');
        return;
      }

      const cleanData = {
        ...formData,
        link_type: linkType, // Add link_type to ensure it's set correctly
        organization_name: formData.organization_name.trim(),
        expires_at: formData.expires_at || null,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null
      };

      await onCreateLink(cleanData);
      setShowCreateForm(false);
      resetForm();
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في إنشاء الرابط');
    }
  };

  const handleUpdateLink = async (e) => {
    e.preventDefault();
    try {
      const cleanData = {
        ...formData,
        expires_at: formData.expires_at || null,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        is_active: formData.is_active
      };

      await onUpdateLink(editingLink.link_id, cleanData);
      setShowEditForm(false);
      setEditingLink(null);
      resetForm();
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في تحديث الرابط');
    }
  };

  const handleDeleteLink = async (linkId) => {
    showConfirmAlert(
      'هل أنت متأكد من حذف هذا الرابط؟',
      'لا يمكن التراجع عن هذا الإجراء',
      async () => {
        try {
          await onDeleteLink(linkId);
        } catch (error) {
          showAlert('error', error.message || 'حدث خطأ في حذف الرابط');
        }
      }
    );
  };

  // New function to handle deleting all links
  const handleDeleteAllLinks = async () => {
    if (links.length === 0) {
      showAlert('info', 'لا توجد روابط لحذفها');
      return;
    }

    showConfirmAlert(
      'هل أنت متأكد من حذف جميع الروابط؟',
      `سيتم حذف ${links.length} روابط. لا يمكن التراجع عن هذا الإجراء`,
      async () => {
        try {
          // Delete all links one by one
          for (const link of links) {
            await onDeleteLink(link.link_id);
          }
          showAlert('success', 'تم حذف جميع الروابط بنجاح');
        } catch (error) {
          showAlert('error', error.message || 'حدث خطأ في حذف الروابط');
        }
      }
    );
  };

  // New function to handle approving all requests
  const handleApproveAllRequests = async () => {
    if (pendingRequests.length === 0) {
      showAlert('info', 'لا توجد طلبات لقبولها');
      return;
    }

    showConfirmAlert(
      'هل أنت متأكد من قبول جميع الطلبات؟',
      `سيتم قبول ${pendingRequests.length} طلبات. لا يمكن التراجع عن هذا الإجراء`,
      async () => {
        try {
          // Approve all requests one by one
          let successCount = 0;
          for (const request of pendingRequests) {
            try {
              await onApproveRequest(request.user_id);
              successCount++;
            } catch (error) {
              console.error(`Error approving request ${request.user_id}:`, error);
            }
          }
          
          if (successCount > 0) {
            showAlert('success', `تم قبول ${successCount} طلبات بنجاح`);
          } else {
            showAlert('error', 'حدث خطأ في قبول الطلبات');
          }
        } catch (error) {
          showAlert('error', error.message || 'حدث خطأ في قبول الطلبات');
        }
      }
    );
  };

  // New function to handle rejecting all requests
  const handleRejectAllRequests = async () => {
    if (pendingRequests.length === 0) {
      showAlert('info', 'لا توجد طلبات لرفضها');
      return;
    }

    showConfirmAlert(
      'هل أنت متأكد من رفض جميع الطلبات؟',
      `سيتم رفض ${pendingRequests.length} طلبات. لا يمكن التراجع عن هذا الإجراء`,
      async () => {
        try {
          // Reject all requests one by one
          let successCount = 0;
          for (const request of pendingRequests) {
            try {
              await onRejectRequest(request.user_id);
              successCount++;
            } catch (error) {
              console.error(`Error rejecting request ${request.user_id}:`, error);
            }
          }
          
          if (successCount > 0) {
            showAlert('success', `تم رفض ${successCount} طلبات بنجاح`);
          } else {
            showAlert('error', 'حدث خطأ في رفض الطلبات');
          }
        } catch (error) {
          showAlert('error', error.message || 'حدث خطأ في رفض الطلبات');
        }
      }
    );
  };

  const handleApproveRequest = async (userId) => {
    try {
      await onApproveRequest(userId);
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في الموافقة على الطلب');
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      await onRejectRequest(userId);
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في رفض الطلب');
    }
  };

  const openEditForm = (link) => {
    setEditingLink(link);
    setFormData({
      organization_name: link.organization_name || '',
      expires_at: link.expires_at || '',
      max_uses: link.max_uses || '',
      is_active: link.is_active
    });
    setShowEditForm(true);
  };

  const resetForm = () => {
    setFormData({
      organization_name: '',
      expires_at: '',
      max_uses: '',
      is_active: true
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showAlert('success', 'تم نسخ الرابط إلى الحافظة');
    }).catch(() => {
      showAlert('error', 'فشل في نسخ الرابط');
    });
  };

  const generateRegistrationUrl = (link) => {
    const baseUrl = window.location.origin;
    if (link.link_type === 'supervisor' || linkType === 'supervisor') {
      return `${baseUrl}/register/supervisor/${link.token}`;
    } else {
      return `${baseUrl}/register/principal?supervisor_token=${link.token}`;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <FaSpinner className="text-4xl text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8 space-x-reverse">
          <button
            onClick={() => setActiveTab('links')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'links'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            روابط الدعوة
          </button>
          {showPendingTab && (
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {pendingRequestsLabel} ({pendingRequests.length})
            </button>
          )}
        </nav>
      </div>

      {/* Links Tab */}
      {activeTab === 'links' && (
        <div>
          {/* Create New Link Button and Delete All Button */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => {
                resetForm();
                setShowCreateForm(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors"
            >
              <FaPlus />
              <span>{createLinkLabel}</span>
            </button>
            
            {links.length > 0 && (
              <button
                onClick={handleDeleteAllLinks}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors"
              >
                <FaTrash />
                <span>حذف الكل ({links.length})</span>
              </button>
            )}
          </div>

          {/* Create Form Modal */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">إنشاء {createLinkLabel}</h3>
                
                <form onSubmit={handleCreateLink} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {linkType === 'supervisor' ? entityName : schoolName}
                    </label>
                    <input
                      type="text"
                      value={formData.organization_name}
                      onChange={(e) => setFormData({...formData, organization_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder={linkType === 'supervisor' ? 'اسم المؤسسة/المديرية' : 'اسم المدرسة'}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الانتهاء (اختياري)</label>
                    <input
                      type="date"
                      value={formData.expires_at}
                      onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">عدد الاستخدامات المسموحة (اختياري)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.max_uses}
                      onChange={(e) => setFormData({...formData, max_uses: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="غير محدود"
                    />
                  </div>

                  <div className="flex space-x-4 space-x-reverse pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                    >
                      إنشاء الرابط
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
                <h3 className="text-xl font-bold mb-4">تعديل رابط الدعوة</h3>
                
                <form onSubmit={handleUpdateLink} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {linkType === 'supervisor' ? entityName : schoolName}
                    </label>
                    <input
                      type="text"
                      value={formData.organization_name}
                      onChange={(e) => setFormData({...formData, organization_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder={linkType === 'supervisor' ? 'اسم المؤسسة/المديرية' : 'اسم المدرسة'}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_active" className="mr-2 block text-sm text-gray-900">
                        نشط
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الانتهاء (اختياري)</label>
                    <input
                      type="date"
                      value={formData.expires_at}
                      onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">عدد الاستخدامات المسموحة (اختياري)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.max_uses}
                      onChange={(e) => setFormData({...formData, max_uses: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="غير محدود"
                    />
                  </div>

                  <div className="flex space-x-4 space-x-reverse pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                    >
                      تحديث الرابط
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

          {/* Links Table */}
          {links.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {linkType === 'supervisor' ? entityName : schoolName}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الاستخدامات
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاريخ الانتهاء
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {links.map((link) => (
                      <tr key={link.link_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {link.organization_name || 'غير محدد'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {link.is_active ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FaCheckCircle className="ml-1" />
                              نشط
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <FaTimesCircle className="ml-1" />
                              معطل
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {link.used_count} / {link.max_uses || '∞'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(link.expires_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={() => openEditForm(link)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="تعديل"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteLink(link.link_id)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="حذف"
                            >
                              <FaTrash />
                            </button>
                            <button
                              onClick={() => copyToClipboard(generateRegistrationUrl(link))}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="نسخ الرابط"
                            >
                              <FaCopy />
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
              <FaUserTie className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{noLinksMessage}</h3>
              <p className="text-gray-500 mb-4">قم بإنشاء رابط دعوة جديد</p>
              <button
                onClick={() => {
                  resetForm();
                  setShowCreateForm(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse mx-auto"
              >
                <FaPlus />
                <span>إنشاء رابط دعوة</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pending Requests Tab */}
      {showPendingTab && activeTab === 'pending' && (
        <div>
          {/* Accept All and Reject All Buttons */}
          {pendingRequests.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={handleApproveAllRequests}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors"
              >
                <FaCheckCircle />
                <span>قبول الكل ({pendingRequests.length})</span>
              </button>
              
              <button
                onClick={handleRejectAllRequests}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors"
              >
                <FaTimesCircle />
                <span>رفض الكل ({pendingRequests.length})</span>
              </button>
            </div>
          )}

          {pendingRequests.length > 0 ? (
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
                        رقم الهاتف
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاريخ الطلب
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingRequests.map((request) => (
                      <tr key={request.user_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {request.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.phone || 'غير محدد'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(request.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={() => handleApproveRequest(request.user_id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                            >
                              موافقة
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request.user_id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                            >
                              رفض
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
              <FaUserTie className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{noPendingRequestsMessage}</h3>
              <p className="text-gray-500">لا توجد طلبات معلقة للمراجعة</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UnifiedLinkManagement;