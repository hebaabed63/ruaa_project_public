// =============================================================================
// Enhanced Hooks for Admin Dashboard - Complete Implementation
// هوكس محسنة ومتكاملة لداشبورد المدير مع تكامل API
// =============================================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { handleAPIError } from '../services/api';
import { 
  getDashboardStats,
  fetchAdminProfile as fetchAdminProfileAPI,
  fetchUsers,
  getUserDetails,
  updateUserStatus,
  deleteUser,
  fetchSchools,
  getSchoolDetails,
  createSchool,
  updateSchool,
  deleteSchool,
  fetchReports,
  getReportDetails,
  updateReportStatus,
  deleteReport,
  fetchInvitations,
  getInvitationDetails,
  createInvitation,
  updateInvitation,
  deleteInvitation
} from '../services/adminApiService';

/**
 * هوك لإدارة بيانات المدير
 * Hook for managing admin profile data
 */
export const useAdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdminProfileAPI();
      setProfile(data);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile
  };
};

/**
 * هوك لإدارة إحصائيات لوحة تحكم المدير
 * Hook for managing admin dashboard statistics
 */
export const useAdminDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

/**
 * هوك لإدارة قائمة المستخدمين مع الفلاتر
 * Hook for managing users list with filtering
 */
export const useUsers = (initialFilters = {}) => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchUsersData = useCallback(async (currentFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUsers(currentFilters);
      setUsers(data.users || data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsersData(filters);
  }, [fetchUsersData, filters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    users,
    total,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refetch: () => fetchUsersData(filters)
  };
};

/**
 * هوك لإدارة تفاصيل مستخدم محدد
 * Hook for managing specific user details
 */
export const useUserDetails = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserDetails = useCallback(async (id) => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getUserDetails(id);
      setUser(data);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserDetails(userId);
  }, [fetchUserDetails, userId]);

  const updateUserStatusData = useCallback(async (statusData) => {
    try {
      const data = await updateUserStatus(userId, statusData);
      setUser(data);
      return data;
    } catch (err) {
      setError(handleAPIError(err));
      throw err;
    }
  }, [userId]);

  const deleteUserData = useCallback(async () => {
    try {
      await deleteUser(userId);
      return true;
    } catch (err) {
      setError(handleAPIError(err));
      throw err;
    }
  }, [userId]);

  return {
    user,
    loading,
    error,
    refetch: () => fetchUserDetails(userId),
    updateUserStatus: updateUserStatusData,
    deleteUser: deleteUserData
  };
};

/**
 * هوك لإدارة قائمة المدارس مع الفلاتر
 * Hook for managing schools list with filtering
 */
export const useSchools = (initialFilters = {}) => {
  const [schools, setSchools] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchSchoolsData = useCallback(async (currentFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSchools(currentFilters);
      setSchools(data.schools || data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchoolsData(filters);
  }, [fetchSchoolsData, filters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const createSchoolData = useCallback(async (schoolData) => {
    try {
      const data = await createSchool(schoolData);
      // Refresh the list
      fetchSchoolsData(filters);
      return data;
    } catch (err) {
      setError(handleAPIError(err));
      throw err;
    }
  }, [filters, fetchSchoolsData]);

  const updateSchoolData = useCallback(async (schoolId, schoolData) => {
    try {
      const data = await updateSchool(schoolId, schoolData);
      // Refresh the list
      fetchSchoolsData(filters);
      return data;
    } catch (err) {
      setError(handleAPIError(err));
      throw err;
    }
  }, [filters, fetchSchoolsData]);

  const deleteSchoolData = useCallback(async (schoolId) => {
    try {
      await deleteSchool(schoolId);
      // Refresh the list
      fetchSchoolsData(filters);
      return true;
    } catch (err) {
      setError(handleAPIError(err));
      throw err;
    }
  }, [filters, fetchSchoolsData]);

  return {
    schools,
    total,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refetch: () => fetchSchoolsData(filters),
    createSchool: createSchoolData,
    updateSchool: updateSchoolData,
    deleteSchool: deleteSchoolData
  };
};

/**
 * هوك لإدارة تفاصيل مدرسة محددة
 * Hook for managing specific school details
 */
export const useSchoolDetails = (schoolId) => {
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchoolDetails = useCallback(async (id) => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getSchoolDetails(id);
      setSchool(data);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchoolDetails(schoolId);
  }, [fetchSchoolDetails, schoolId]);

  const updateSchoolData = useCallback(async (schoolData) => {
    try {
      const data = await updateSchool(schoolId, schoolData);
      setSchool(data);
      return data;
    } catch (err) {
      setError(handleAPIError(err));
      throw err;
    }
  }, [schoolId]);

  const deleteSchoolData = useCallback(async () => {
    try {
      await deleteSchool(schoolId);
      return true;
    } catch (err) {
      setError(handleAPIError(err));
      throw err;
    }
  }, [schoolId]);

  return {
    school,
    loading,
    error,
    refetch: () => fetchSchoolDetails(schoolId),
    updateSchool: updateSchoolData,
    deleteSchool: deleteSchoolData
  };
};

/**
 * هوك لإدارة التقارير مع الفلاتر
 * Hook for managing reports with filtering
 */
export const useReports = (initialFilters = {}) => {
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchReportsData = useCallback(async (currentFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchReports(currentFilters);
      setReports(data.reports || data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportsData(filters);
  }, [fetchReportsData, filters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const updateReportStatusData = useCallback(async (reportId, statusData) => {
    try {
      const data = await updateReportStatus(reportId, statusData);
      // Refresh the list
      fetchReportsData(filters);
      return data;
    } catch (err) {
      setError(handleAPIError(err));
      throw err;
    }
  }, [filters, fetchReportsData]);

  const deleteReportData = useCallback(async (reportId) => {
    try {
      await deleteReport(reportId);
      // Refresh the list
      fetchReportsData(filters);
      return true;
    } catch (err) {
      setError(handleAPIError(err));
      throw err;
    }
  }, [filters, fetchReportsData]);

  return {
    reports,
    total,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refetch: () => fetchReportsData(filters),
    updateReportStatus: updateReportStatusData,
    deleteReport: deleteReportData
  };
};

/**
 * هوك لإدارة تفاصيل تقرير محدد
 * Hook for managing specific report details
 */
export const useReportDetails = (reportId) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReportDetails = useCallback(async (id) => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getReportDetails(id);
      setReport(data);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportDetails(reportId);
  }, [fetchReportDetails, reportId]);

  const updateReportStatusData = useCallback(async (statusData) => {
    try {
      const data = await updateReportStatus(reportId, statusData);
      setReport(data);
      return data;
    } catch (err) {
      setError(handleAPIError(err));
      throw err;
    }
  }, [reportId]);

  const deleteReportData = useCallback(async () => {
    try {
      await deleteReport(reportId);
      return true;
    } catch (err) {
      setError(handleAPIError(err));
      throw err;
    }
  }, [reportId]);

  return {
    report,
    loading,
    error,
    refetch: () => fetchReportDetails(reportId),
    updateReportStatus: updateReportStatusData,
    deleteReport: deleteReportData
  };
};

/**
 * هوك لإدارة الدعوات مع الفلاتر
 * Hook for managing invitations with filtering
 */
export const useInvitations = (initialFilters = {}) => {
  const [invitations, setInvitations] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchInvitationsData = useCallback(async (currentFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchInvitations(currentFilters);
      setInvitations(data.invitations || data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvitationsData(filters);
  }, [fetchInvitationsData, filters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const createInvitationData = useCallback(async (invitationData) => {
    try {
      const data = await createInvitation(invitationData);
      // Refresh the list
      fetchInvitationsData(filters);
      return data;
    } catch (err) {
      setError(handleAPIError(err));
      throw err;
    }
  }, [filters, fetchInvitationsData]);

  const updateInvitationData = useCallback(async (invitationId, invitationData) => {
    try {
      const data = await updateInvitation(invitationId, invitationData);
      // Refresh the list
      fetchInvitationsData(filters);
      return data;
    } catch (err) {
      setError(handleAPIError(err));
      throw err;
    }
  }, [filters, fetchInvitationsData]);

  const deleteInvitationData = useCallback(async (invitationId) => {
    try {
      await deleteInvitation(invitationId);
      // Refresh the list
      fetchInvitationsData(filters);
      return true;
    } catch (err) {
      setError(handleAPIError(err));
      throw err;
    }
  }, [filters, fetchInvitationsData]);

  return {
    invitations,
    total,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refetch: () => fetchInvitationsData(filters),
    createInvitation: createInvitationData,
    updateInvitation: updateInvitationData,
    deleteInvitation: deleteInvitationData
  };
};

/**
 * هوك لإدارة تفاصيل دعوة محددة
 * Hook for managing specific invitation details
 */
export const useInvitationDetails = (invitationId) => {
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvitationDetails = useCallback(async (id) => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getInvitationDetails(id);
      setInvitation(data);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvitationDetails(invitationId);
  }, [fetchInvitationDetails, invitationId]);

  const updateInvitationData = useCallback(async (invitationData) => {
    try {
      const data = await updateInvitation(invitationId, invitationData);
      setInvitation(data);
      return data;
    } catch (err) {
      setError(handleAPIError(err));
      throw err;
    }
  }, [invitationId]);

  const deleteInvitationData = useCallback(async () => {
    try {
      await deleteInvitation(invitationId);
      return true;
    } catch (err) {
      setError(handleAPIError(err));
      throw err;
    }
  }, [invitationId]);

  return {
    invitation,
    loading,
    error,
    refetch: () => fetchInvitationDetails(invitationId),
    updateInvitation: updateInvitationData,
    deleteInvitation: deleteInvitationData
  };
};

/**
 * هوك مخصص لإدارة Loading States المتعددة
 * Custom hook for managing multiple loading states
 */
export const useLoadingStates = (initialStates = {}) => {
  const [loadingStates, setLoadingStates] = useState(initialStates);

  const setLoading = useCallback((key, value) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const isLoading = useCallback((key) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const isAnyLoading = useMemo(() => {
    return Object.values(loadingStates).some(loading => loading);
  }, [loadingStates]);

  return {
    loadingStates,
    setLoading,
    isLoading,
    isAnyLoading
  };
};

/**
 * هوك مخصص للبحث والفلترة
 * Custom hook for search and filtering functionality
 */
export const useSearch = (items, searchFields) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    
    return items.filter(item => {
      return searchFields.some(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [items, searchTerm, searchFields]);

  const sortedItems = useMemo(() => {
    if (!sortBy) return filteredItems;

    return [...filteredItems].sort((a, b) => {
      const aValue = sortBy.split('.').reduce((obj, key) => obj?.[key], a);
      const bValue = sortBy.split('.').reduce((obj, key) => obj?.[key], b);

      if (typeof aValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [filteredItems, sortBy, sortOrder]);

  return {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filteredItems,
    sortedItems,
    resultsCount: sortedItems.length
  };
};

/**
 * هوك مخصص للتحكم في الـ Theme والـ UI Settings
 * Custom hook for theme and UI settings management
 */
export const useUISettings = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('adminUI_settings');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      sidebarCollapsed: false,
      language: 'ar',
      animations: true,
      compactMode: false,
      notifications: true,
      emailNotifications: true,
      smsNotifications: false,
      desktopNotifications: true,
      profileVisibility: 'everyone',
      activityVisibility: 'friends',
      searchIndexing: false,
      marketingData: true
    };
  });

  useEffect(() => {
    localStorage.setItem('adminUI_settings', JSON.stringify(settings));
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings]);

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const toggleTheme = useCallback(async () => {
    try {
      // For now, just toggle locally
      updateSetting('theme', settings.theme === 'light' ? 'dark' : 'light');
    } catch (error) {
      // Fallback to local state if API fails
      updateSetting('theme', settings.theme === 'light' ? 'dark' : 'light');
    }
  }, [settings.theme, updateSetting]);

  const toggleSidebar = useCallback(() => {
    updateSetting('sidebarCollapsed', !settings.sidebarCollapsed);
  }, [settings.sidebarCollapsed, updateSetting]);

  return {
    settings,
    updateSetting,
    toggleTheme,
    toggleSidebar
  };
};

export default {
  useAdminProfile,
  useAdminDashboardStats,
  useUsers,
  useUserDetails,
  useSchools,
  useSchoolDetails,
  useReports,
  useReportDetails,
  useInvitations,
  useInvitationDetails,
  useLoadingStates,
  useSearch,
  useUISettings
};