import { useState, useCallback } from 'react';
import { getStudentReport, getAvailableTerms, exportReportPDF } from '../services/reportsApi';

/**
 * Custom hook for managing student reports
 * هوك مخصص لإدارة تقارير الطلاب
 */
export const useStudentReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableTerms, setAvailableTerms] = useState([]);

  /**
   * Fetch student report
   */
  const fetchReport = useCallback(async (childId, term) => {
    if (!childId || !term) {
      setError('يرجى تحديد الطالب والفصل الدراسي');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await getStudentReport(childId, term);
      
      if (result.success) {
        setReport(result.data);
      } else {
        setError(result.message || 'فشل في جلب التقرير');
        setReport(null);
      }
    } catch (err) {
      console.error('Error in fetchReport:', err);
      setError('حدث خطأ أثناء جلب التقرير');
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch available terms
   */
  const fetchAvailableTerms = useCallback(async () => {
    try {
      const result = await getAvailableTerms();
      if (result.success) {
        setAvailableTerms(result.data);
      }
    } catch (err) {
      console.error('Error fetching terms:', err);
    }
  }, []);

  /**
   * Export report as PDF
   */
  const exportReport = useCallback(async (childId, term) => {
    try {
      setLoading(true);
      const result = await exportReportPDF(childId, term);
      return result;
    } catch (err) {
      console.error('Error exporting report:', err);
      return { success: false, message: 'فشل في تصدير التقرير' };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear report data
   */
  const clearReport = useCallback(() => {
    setReport(null);
    setError(null);
  }, []);

  return {
    report,
    loading,
    error,
    availableTerms,
    fetchReport,
    fetchAvailableTerms,
    exportReport,
    clearReport
  };
};

export default useStudentReport;
