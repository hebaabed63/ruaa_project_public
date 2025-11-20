import React, { useState, useEffect, useContext } from "react";
import { FaPlus, FaSpinner, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import { AuthContext } from "../../../../contexts/AuthContext";

import { showAlert } from "../../../../utils/SweetAlert";
import { 
  getSupervisorLinks, 
  createSupervisorLink, 
  updateSupervisorLink, 
  deleteSupervisorLink,
  getSupervisorLinksStatistics,
  getPendingSupervisors,
  approvePendingSupervisor,
  rejectPendingSupervisor
} from "../../../../services/adminService";
import UnifiedLinkManagement from "../../../../components/LinkManagement/UnifiedLinkManagement";

export default function InvitationsManagement() {
  const { userRole } = useContext(AuthContext);
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
      // For admins, fetch supervisor links and pending supervisors
      const [linksResponse, statsResponse, pendingResponse] = await Promise.all([
        getSupervisorLinks(),
        getSupervisorLinksStatistics(),
        getPendingSupervisors()
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
      // Validation for organization_name
      if (!data.organization_name || data.organization_name.trim() === '') {
        showAlert('error', 'اسم المؤسسة/المديرية مطلوب');
        return;
      }

      const cleanData = {
        ...data,
        link_type: 'supervisor',
        organization_name: data.organization_name.trim(),
        expires_at: data.expires_at || null,
        max_uses: data.max_uses ? parseInt(data.max_uses) : null
      };
      
      // Only add organization_id if it's provided
      if (data.organization_id) {
        cleanData.organization_id = data.organization_id;
      }

      const response = await createSupervisorLink(cleanData);
      
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

      const response = await updateSupervisorLink(linkId, cleanData);
      
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
      const response = await deleteSupervisorLink(linkId);
      if (response.success) {
        showAlert('success', 'تم حذف رابط الدعوة بنجاح');
        fetchData();
      }
    } catch (error) {
      showAlert('error', error.message || 'حدث خطأ في حذف الرابط');
      throw error;
    }
  };

  // New function to handle deleting all supervisor links
  const handleDeleteAllLinks = async () => {
    if (links.length === 0) {
      showAlert('info', 'لا توجد روابط لحذفها');
      return;
    }

    const result = await showAlert(
      'warning',
      'هل أنت متأكد من حذف جميع الروابط؟',
      `سيتم حذف ${links.length} روابط. لا يمكن التراجع عن هذا الإجراء`,
      'نعم، احذف الكل!',
      'إلغاء'
    );
    
    if (result.isConfirmed) {
      try {
        // Delete all links one by one
        let successCount = 0;
        for (const link of links) {
          try {
            await deleteSupervisorLink(link.link_id);
            successCount++;
          } catch (error) {
            console.error(`Error deleting link ${link.link_id}:`, error);
          }
        }
        
        if (successCount > 0) {
          showAlert('success', `تم حذف ${successCount} روابط بنجاح`);
          fetchData();
        } else {
          showAlert('error', 'حدث خطأ في حذف الروابط');
        }
      } catch (error) {
        showAlert('error', error.message || 'حدث خطأ في حذف الروابط');
      }
    }
  };

  const handleApproveRequest = async (userId) => {
    try {
      // Admins approve supervisors
      const response = await approvePendingSupervisor(userId);
      
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
      // Admins reject supervisors
      const response = await rejectPendingSupervisor(userId);
      
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">إدارة روابط الدعوة</h1>
      </div>

      {/* Statistics - only for admins */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FaPlus />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-500">إجمالي الروابط</p>
                <p className="text-xl font-bold">{statistics.overview.total_links}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaPlus />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-500">الروابط النشطة</p>
                <p className="text-xl font-bold">{statistics.overview.active_links}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FaPlus />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-500">الروابط المنتهية</p>
                <p className="text-xl font-bold">{statistics.overview.expired_links}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FaPlus />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-500">الروابط المستخدمة</p>
                <p className="text-xl font-bold">{statistics.overview.used_links}</p>
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
        linkType="supervisor"
        entityName="المؤسسة/المديرية"
        createLinkLabel="رابط دعوة مشرف جديد"
        pendingRequestsLabel="طلبات تسجيل مشرفين جديدة"
        noLinksMessage="لا توجد روابط دعوة للمشرفين"
        noPendingRequestsMessage="لا توجد طلبات معلقة لتسجيل مشرفين"
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
