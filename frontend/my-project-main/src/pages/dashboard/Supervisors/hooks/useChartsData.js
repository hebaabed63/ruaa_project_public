// =============================================================================
// Charts Data Hook - Custom hook for managing chart data
// هوك بيانات الرسوم البيانية - هوك مخصص لإدارة بيانات الرسوم البيانية
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { 
  getNumEvaluationsData, 
  getPerformanceData, 
  getEvaluationCriteriaData, 
  getEducationStagesData 
} from '../services/chartsApi';

/**
 * هوك لإدارة بيانات الرسوم البيانية
 * Hook for managing chart data
 */
export const useChartsData = () => {
  const [chartsData, setChartsData] = useState({
    numEvaluations: null,
    performance: null,
    evaluationCriteria: null,
    educationStages: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * جلب بيانات عدد التقييمات
   * Fetch number of evaluations data
   */
  const fetchNumEvaluationsData = useCallback(async () => {
    try {
      const data = await getNumEvaluationsData();
      setChartsData(prev => ({ ...prev, numEvaluations: data }));
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء جلب بيانات عدد التقييمات');
    }
  }, []);

  /**
   * جلب بيانات الأداء
   * Fetch performance data
   */
  const fetchPerformanceData = useCallback(async () => {
    try {
      const data = await getPerformanceData();
      setChartsData(prev => ({ ...prev, performance: data }));
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء جلب بيانات الأداء');
    }
  }, []);

  /**
   * جلب بيانات معايير التقييم
   * Fetch evaluation criteria data
   */
  const fetchEvaluationCriteriaData = useCallback(async () => {
    try {
      const data = await getEvaluationCriteriaData();
      setChartsData(prev => ({ ...prev, evaluationCriteria: data }));
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء جلب بيانات معايير التقييم');
    }
  }, []);

  /**
   * جلب بيانات المراحل الدراسية
   * Fetch education stages data
   */
  const fetchEducationStagesData = useCallback(async () => {
    try {
      const data = await getEducationStagesData();
      setChartsData(prev => ({ ...prev, educationStages: data }));
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء جلب بيانات المراحل الدراسية');
    }
  }, []);

  /**
   * جلب جميع بيانات الرسوم البيانية
   * Fetch all charts data
   */
  const fetchAllChartsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // جلب جميع البيانات بشكل متزامن
      // Fetch all data concurrently
      const [
        numEvaluations,
        performance,
        evaluationCriteria,
        educationStages
      ] = await Promise.all([
        getNumEvaluationsData(),
        getPerformanceData(),
        getEvaluationCriteriaData(),
        getEducationStagesData()
      ]);
      
      setChartsData({
        numEvaluations,
        performance,
        evaluationCriteria,
        educationStages
      });
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء جلب بيانات الرسوم البيانية');
    } finally {
      setLoading(false);
    }
  }, []);

  // عند التحميل الأولي، جلب جميع البيانات
  // On initial load, fetch all data
  useEffect(() => {
    fetchAllChartsData();
  }, [fetchAllChartsData]);

  return {
    chartsData,
    loading,
    error,
    refetch: fetchAllChartsData,
    fetchNumEvaluationsData,
    fetchPerformanceData,
    fetchEvaluationCriteriaData,
    fetchEducationStagesData
  };
};

export default useChartsData;