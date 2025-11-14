// =============================================================================
// Custom Hook for Reports and Calendar Data
// خطاف مخصص لبيانات التقارير والتقويم
// =============================================================================

import { useState, useEffect } from 'react';
import * as reportsApi from '../services/reportsApi';

/**
 * Custom hook for managing reports data
 * خطاف مخصص لإدارة بيانات التقارير
 */
export const useReportsData = () => {
  const [grades, setGrades] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all reports data in parallel
        const [gradesRes, evaluationsRes, performanceRes, projectsRes] = await Promise.all([
          reportsApi.getAcademicGrades(),
          reportsApi.getBehaviorReports(),
          reportsApi.getPerformanceSummary(),
          reportsApi.getProjectReports()
        ]);

        if (gradesRes.success) setGrades(gradesRes.data);
        if (evaluationsRes.success) setEvaluations(evaluationsRes.data);
        if (performanceRes.success) setPerformance(performanceRes.data);
        if (projectsRes.success) setProjects(projectsRes.data);
        
        if (!gradesRes.success || !evaluationsRes.success || !performanceRes.success || !projectsRes.success) {
          setError('Some data failed to load');
        }
      } catch (err) {
        setError('Failed to fetch reports data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    grades,
    evaluations,
    performance,
    projects,
    loading,
    error
  };
};

/**
 * Custom hook for managing calendar data
 * خطاف مخصص لإدارة بيانات التقويم
 */
export const useCalendarData = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await reportsApi.getCalendarEvents();
        
        if (res.success) {
          setEvents(res.data);
        } else {
          setError(res.error);
        }
      } catch (err) {
        setError('Failed to fetch calendar events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const addAppointment = async (appointment) => {
    try {
      const res = await reportsApi.addPersonalAppointment(appointment);
      
      if (res.success) {
        setEvents(prev => [...prev, res.data]);
        return { success: true, data: res.data };
      } else {
        return { success: false, error: res.error };
      }
    } catch (err) {
      return { success: false, error: 'Failed to add appointment' };
    }
  };

  return {
    events,
    loading,
    error,
    addAppointment
  };
};