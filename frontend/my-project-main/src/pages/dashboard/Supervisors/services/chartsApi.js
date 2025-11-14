// =============================================================================
// Charts API Service - Real Implementation
// خدمة API للرسوم البيانية - تنفيذ حقيقي
// =============================================================================

import api from '../../../../api/axios';

/**
 * استدعاء بيانات عدد التقييمات
 * Fetch number of evaluations data
 * @returns {Promise<Object>} بيانات عدد التقييمات
 */
export const getNumEvaluationsData = async () => {
  try {
    const response = await api.get('/supervisor/charts/num-evaluations');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching number of evaluations data:', error);
    throw error;
  }
};

/**
 * استدعاء بيانات الأداء
 * Fetch performance data
 * @returns {Promise<Object>} بيانات الأداء
 */
export const getPerformanceData = async () => {
  try {
    const response = await api.get('/supervisor/charts/performance');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching performance data:', error);
    throw error;
  }
};

/**
 * استدعاء بيانات معايير التقييم
 * Fetch evaluation criteria data
 * @returns {Promise<Object>} بيانات معايير التقييم
 */
export const getEvaluationCriteriaData = async () => {
  try {
    const response = await api.get('/supervisor/charts/evaluation-criteria');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching evaluation criteria data:', error);
    throw error;
  }
};

/**
 * استدعاء بيانات المراحل الدراسية
 * Fetch education stages data
 * @returns {Promise<Object>} بيانات المراحل الدراسية
 */
export const getEducationStagesData = async () => {
  try {
    const response = await api.get('/supervisor/charts/education-stages');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching education stages data:', error);
    throw error;
  }
};

/**
 * استدعاء جميع بيانات الرسوم البيانية
 * Fetch all charts data
 * @returns {Promise<Object>} جميع بيانات الرسوم البيانية
 */
export const getAllChartsData = async () => {
  try {
    // Fetch all chart data concurrently
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
    
    return {
      numEvaluations,
      performance,
      evaluationCriteria,
      educationStages
    };
  } catch (error) {
    console.error('Error fetching all charts data:', error);
    throw error;
  }
};

export default {
  getNumEvaluationsData,
  getPerformanceData,
  getEvaluationCriteriaData,
  getEducationStagesData,
  getAllChartsData
};