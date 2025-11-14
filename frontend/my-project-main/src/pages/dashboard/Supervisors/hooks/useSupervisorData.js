// =============================================================================
// Supervisor Data Hooks - Custom hooks for managing supervisor dashboard data
// هوكس بيانات المشرف - هوكس مخصصة لإدارة بيانات لوحة المشرف
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import * as supervisorAPI from '../services/supervisorApi';

/**
 * هوك لإدارة بيانات الملف الشخصي للمشرف
 * Hook for managing supervisor profile data
 */
export const useSupervisorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supervisorAPI.fetchSupervisorProfile();
      setProfile(data);
    } catch (err) {
      console.error('Error fetching supervisor profile:', err);
      // Set specific error message based on error type
      if (err.response?.status === 401) {
        setError('جلسة تسجيل الدخول منتهية. يرجى تسجيل الدخول مرة أخرى.');
      } else if (err.response?.status === 403) {
        setError('غير مسموح لك بالوصول لهذه البيانات.');
      } else if (err.response?.status === 500) {
        setError('حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.');
      } else if (!navigator.onLine) {
        setError('لا يوجد اتصال بالإنترنت. يرجى التحقق من الاتصال وإعادة المحاولة.');
      } else {
        setError('حدث خطأ أثناء جلب بيانات الملف الشخصي. يرجى المحاولة مرة أخرى لاحقاً.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to retry fetching profile
  const retryFetchProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    retry: retryFetchProfile
  };
};

/**
 * هوك لإدارة قائمة المدارس التي يشرف عليها المشرف
 * Hook for managing schools list that supervisor oversees
 */
export const useSupervisorSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supervisorAPI.fetchSupervisorSchools();
      setSchools(data);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء جلب بيانات المدارس');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  return {
    schools,
    loading,
    error,
    refetch: fetchSchools
  };
};

/**
 * هوك لإدارة التقييمات التي قام بها المشرف
 * Hook for managing evaluations by supervisor
 */
export const useSupervisorEvaluations = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvaluations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supervisorAPI.fetchSupervisorEvaluations();
      setEvaluations(data);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء جلب بيانات التقييمات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvaluations();
  }, [fetchEvaluations]);

  return {
    evaluations,
    loading,
    error,
    refetch: fetchEvaluations
  };
};

/**
 * هوك لإدارة التقارير التي أعدّها المشرف
 * Hook for managing reports by supervisor
 */
export const useSupervisorReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supervisorAPI.fetchSupervisorReports();
      setReports(data);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء جلب بيانات التقارير');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    loading,
    error,
    refetch: fetchReports
  };
};

/**
 * هوك لإدارة إحصائيات لوحة التحكم
 * Hook for managing dashboard statistics
 */
export const useDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supervisorAPI.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء جلب إحصائيات لوحة التحكم');
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
 * هوك لإدارة دعوات المدراء
 * Hook for managing school manager invitations
 */
export const useSupervisorInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvitations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [invitationsData, requestsData] = await Promise.all([
        supervisorAPI.fetchSupervisorInvitations(),
        supervisorAPI.fetchSupervisorRequests()
      ]);
      setInvitations(invitationsData);
      setRequests(requestsData);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء جلب بيانات الدعوات');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitInvitation = useCallback(async (invitationData) => {
    try {
      const response = await supervisorAPI.submitInvitation(invitationData);
      if (response.success) {
        // Refresh invitations list
        await fetchInvitations();
        return response;
      } else {
        throw new Error(response.message || 'فشل في إنشاء الدعوة');
      }
    } catch (err) {
      throw err;
      setError(err.message || 'حدث خطأ أثناء إنشاء الدعوة');
    }
  }, [fetchInvitations]);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  return {
    invitations,
    requests,
    loading,
    error,
    submitInvitation,
    refetch: fetchInvitations
  };
};

export default {
  useSupervisorProfile,
  useSupervisorSchools,
  useSupervisorEvaluations,
  useSupervisorReports,
  useDashboardStats,
  useSupervisorInvitations
};