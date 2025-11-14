// useComplaints.js
import { useState, useEffect, useCallback } from 'react';
import complaintsAPI from '../services/complaintsApi';

/**
 * هوك لإدارة الشكاوي (محدّث)
 * الآن يعيد: complaints, schools, meta, loading, error, submitComplaint, refetch
 */
export const useComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [schools, setSchools] = useState([]); // children schools for select
  const [meta, setMeta] = useState({ types: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const simulateDelay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchMetaAndSchools = useCallback(async () => {
    try {
      const metaRes = await complaintsAPI.fetchComplaintsMeta();
      // metaRes is expected to be { types: [...], children_schools: [...] }
      setMeta({
        types: metaRes.types || [],
      });
      setSchools(metaRes.children_schools || []);
    } catch (err) {
      console.error('Failed to fetch complaints meta:', err);
      setError('فشل تحميل بيانات الميتا');
    }
  }, []);

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // fetch meta & schools first (so select is populated)
      await fetchMetaAndSchools();

      const data = await complaintsAPI.fetchComplaints();
      // complaintsAPI.fetchComplaints() should already map backend -> frontend fields,
      // but defend against unexpected shapes:
      const mapped = Array.isArray(data) ? data : (data?.data || []);
      await simulateDelay(400);
      setComplaints(mapped);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError('حدث خطأ أثناء تحميل الشكاوى');
    } finally {
      setLoading(false);
    }
  }, [fetchMetaAndSchools]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const submitComplaint = useCallback(async (complaintData) => {
    try {
      setLoading(true);
      setError(null);

      const res = await complaintsAPI.submitComplaint(complaintData);
      // Normalize response:
      // backend may return { data: {...} } or full axios response.
      const payload = res?.data ?? res;
      const newRaw = payload?.data ?? payload;

      // Map backend fields to frontend fields (same mapping as fetchComplaints)
      const mapped = {
        id: newRaw?.id ?? newRaw?.complaint_id ?? Date.now(),
        schoolId: newRaw?.school_id ?? complaintData.schoolId,
        schoolName: newRaw?.school_name ?? (schools.find(s => Number(s.school_id) === Number(complaintData.schoolId))?.school_name) ?? '',
        subject: newRaw?.type ?? complaintData.subject,
        message: newRaw?.description ?? complaintData.message,
        date: newRaw?.created_at ?? new Date().toISOString(),
        status: newRaw?.status ?? 'pending',
        attachment: newRaw?.attachment_path ? newRaw.attachment_path.split('/').pop() : (complaintData.attachment?.name || null)
      };

      // prepend to state
      setComplaints(prev => [mapped, ...prev]);
      await simulateDelay(400);

      return { success: true, data: newRaw };
    } catch (err) {
      console.error('submitComplaint error:', err);
      const errorMessage = (err?.response?.data?.message) || 'حدث خطأ أثناء إرسال الشكوى';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [schools]);

  return {
    complaints,
    schools,
    meta,
    loading,
    error,
    submitComplaint,
    refetch: fetchComplaints
  };
};

export default useComplaints;
