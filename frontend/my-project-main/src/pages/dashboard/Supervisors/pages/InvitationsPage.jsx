import React, { useState, useEffect } from "react";
import { FaPlus, FaSpinner } from 'react-icons/fa';
import { showAlert } from "../../../../utils/SweetAlert";
import { 
  getSupervisorPrincipalLinks, 
  createSupervisorPrincipalLink, 
  updateSupervisorPrincipalLink, 
  deleteSupervisorPrincipalLink,
  getSupervisorPrincipalLinksStatistics,
  getSupervisorPendingPrincipals,
  approveSupervisorPendingPrincipal,
  rejectSupervisorPendingPrincipal
} from "../../../../services/adminService";
import UnifiedLinkManagement from "../../../../components/LinkManagement/UnifiedLinkManagement";

export default function InvitationsPage() {
  const [links, setLinks] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // For supervisors, fetch principal links and pending principals
      const [linksResponse, statsResponse, pendingResponse] = await Promise.all([
        getSupervisorPrincipalLinks(),
        getSupervisorPrincipalLinksStatistics(),
        getSupervisorPendingPrincipals()
      ]);

      if (linksResponse.success) {
        setLinks(linksResponse.data);
      }

      if (statsResponse.success) {
        setStatistics(statsResponse.data);
      }

      if (pendingResponse.success) {
        setPendingRequests(pendingResponse.data);
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = async (data) => {
    try {
      // Validation for organization_name (school name in this case)
      if (!data.organization_name || data.organization_name.trim() === '') {
        showAlert('error', 'اسم المدرسة مطلوب');
        return;
      }

      const cleanData = {
        ...data,
        link_type: 'principal',
        organization_id: data.organization_id || null,
        organization_name: data.organization_name.trim(),
        expires_at: data.expires_at || null,
        max_uses: data.max_uses ? parseInt(data.max_uses) : null
      };

      const response = await createSupervisorPrincipalLink(cleanData);
      
      if (response.success) {
        showAlert('success', 'تم إنشاء رابط الدعوة بنجاح');
        fetchData();
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في إنشاء الرابط');
      throw error;
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
        fetchData();
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في تحديث الرابط');
      throw error;
    }
  };

  const handleDeleteLink = async (linkId) => {
    try {
      const response = await deleteSupervisorPrincipalLink(linkId);
      if (response.success) {
        showAlert('success', 'تم حذف رابط الدعوة بنجاح');
        fetchData();
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في حذف الرابط');
      throw error;
    }
  };

  const handleApproveRequest = async (userId) => {
    try {
      // Supervisors approve principals
      const response = await approveSupervisorPendingPrincipal(userId);
      
      if (response.success) {
        showAlert('success', 'تمت الموافقة على الطلب بنجاح');
        fetchData();
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في الموافقة على الطلب');
      throw error;
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      // Supervisors reject principals
      const response = await rejectSupervisorPendingPrincipal(userId);
      
      if (response.success) {
        showAlert('success', 'تم رفض الطلب بنجاح');
        fetchData();
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في رفض الطلب');
      throw error;
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
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">دعوات مدراء المدارس</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            قم بإنشاء وإدارة روابط الدعوة ومراجعة طلبات المدراء المعلقة
          </p>
        </div>
      </div>

      {/* Statistics - for supervisors */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FaPlus />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">إجمالي الروابط</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{statistics.overview.total_links}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaPlus />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">الروابط النشطة</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{statistics.overview.active_links}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FaPlus />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">الروابط المنتهية</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{statistics.overview.expired_links}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FaPlus />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">الروابط المستخدمة</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{statistics.overview.used_links}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unified Link Management Component with Pending Requests */}
      <UnifiedLinkManagement
        links={links}
        pendingRequests={pendingRequests}
        loading={loading}
        linkType="principal"
        entityName="المدرسة"
        createLinkLabel="رابط دعوة مدير مدرسة جديد"
        pendingRequestsLabel="طلبات تسجيل مدراء جديدة"
        noLinksMessage="لا توجد روابط دعوة لمدراء المدارس"
        noPendingRequestsMessage="لا توجد طلبات معلقة لتسجيل مدراء"
        onCreateLink={handleCreateLink}
        onUpdateLink={handleUpdateLink}
        onDeleteLink={handleDeleteLink}
        onApproveRequest={handleApproveRequest}
        onRejectRequest={handleRejectRequest}
        showPendingTab={true}
      />
    </div>
  );
}
