import { useState, useEffect, useCallback } from 'react';

/**
 * هوك لإدارة الشكاوي
 * Hook for managing complaints
 */
export const useComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate network delay
  const simulateDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Import the complaints API
      const { default: complaintsAPI } = await import('../services/complaintsApi');
      const data = await complaintsAPI.fetchComplaints();
      await simulateDelay(800);
      setComplaints(data);
    } catch (err) {
      setError('حدث خطأ أثناء تحميل الشكاوى');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const submitComplaint = useCallback(async (complaintData) => {
    try {
      setLoading(true);
      setError(null);
      // Import the complaints API
      const { default: complaintsAPI } = await import('../services/complaintsApi');
      const result = await complaintsAPI.submitComplaint(complaintData);
      await simulateDelay(1500);
      
      // Update local state
      setComplaints(prev => [result.data, ...prev]);
      
      return result;
    } catch (err) {
      const errorMessage = 'حدث خطأ أثناء إرسال الشكوى';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    complaints,
    loading,
    error,
    submitComplaint,
    refetch: fetchComplaints
  };
};

export default useComplaints;