/**
 * Schools API Service
 * خدمة API للمدارس - جميع العمليات المتعلقة بالمدارس
 */

import axiosInstance from './axios.instance';
import { API_ENDPOINTS } from '../config/api.config';

/**
 * Schools Service - يحتوي على جميع دوال API الخاصة بالمدارس
 */
const schoolsService = {
  /**
   * جلب جميع المدارس
   * @param {Object} params - معاملات البحث والفلترة
   * @param {number} params.page - رقم الصفحة
   * @param {number} params.limit - عدد النتائج في الصفحة
   * @param {string} params.region - المنطقة
   * @param {string} params.type - نوع المدرسة
   * @param {string} params.directorate - المديرية
   * @returns {Promise} - البيانات من الخادم
   */
  getAllSchools: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.SCHOOLS.GET_ALL, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          region: params.region,
          type: params.type,
          directorate: params.directorate,
          sortBy: params.sortBy || 'created_at',
          order: params.order || 'desc',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * جلب تفاصيل مدرسة معينة
   * @param {string|number} schoolId - معرف المدرسة
   * @returns {Promise} - بيانات المدرسة
   */
  getSchoolById: async (schoolId) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.SCHOOLS.GET_BY_ID(schoolId)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * جلب أفضل المدارس
   * @param {number} limit - عدد المدارس المطلوبة
   * @returns {Promise} - قائمة أفضل المدارس
   */
  getBestSchools: async (limit = 10) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.SCHOOLS.GET_BEST, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * جلب المدارس حسب المنطقة
   * @param {string} region - اسم المنطقة
   * @returns {Promise} - المدارس في المنطقة
   */
  getSchoolsByRegion: async (region) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.SCHOOLS.GET_BY_REGION,
        {
          params: { region },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * جلب المدارس المضافة حديثاً
   * @param {number} limit - عدد المدارس
   * @returns {Promise} - المدارس الحديثة
   */
  getRecentlyAddedSchools: async (limit = 6) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.SCHOOLS.GET_RECENTLY_ADDED,
        {
          params: { limit },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * البحث عن المدارس
   * @param {Object} searchParams - معاملات البحث
   * @param {string} searchParams.query - نص البحث
   * @param {string} searchParams.region - المنطقة
   * @param {string} searchParams.type - نوع المدرسة
   * @param {string} searchParams.level - المرحلة التعليمية
   * @param {number} searchParams.minRating - أقل تقييم
   * @returns {Promise} - نتائج البحث
   */
  searchSchools: async (searchParams = {}) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.SCHOOLS.SEARCH, {
        params: {
          q: searchParams.query,
          region: searchParams.region,
          type: searchParams.type,
          level: searchParams.level,
          minRating: searchParams.minRating,
          page: searchParams.page || 1,
          limit: searchParams.limit || 10,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * جلب بيانات صفحة المدارس الكاملة (جميع الأقسام)
   * @returns {Promise} - جميع بيانات صفحة المدارس
   */
  getSchoolsPageData: async () => {
    try {
      // يمكن استدعاء عدة APIs في نفس الوقت
      const [
        searchResults,
        bestSchools,
        recentSchools,
        statistics,
      ] = await Promise.all([
        schoolsService.getAllSchools({ limit: 3 }),
        schoolsService.getBestSchools(3),
        schoolsService.getRecentlyAddedSchools(3),
        axiosInstance.get(API_ENDPOINTS.STATISTICS.GENERAL),
      ]);

      return {
        pageInfo: {
          title: 'المدارس',
          description: 'دليل شامل لجميع المدارس في فلسطين مع إمكانية البحث والتقييم',
        },
        searchResults: {
          schools: searchResults.data?.schools || searchResults.data || [],
          totalCount: searchResults.data?.total || searchResults.data?.length || 0,
          regions: searchResults.data?.regions || [],
        },
        bestSchools: {
          title: 'أبرز المدارس لهذا الشهر',
          schools: bestSchools.data?.schools || bestSchools.data || [],
        },
        recentSchools: {
          title: 'مدارس مُضافة مُؤخرًا',
          schools: recentSchools.data?.schools || recentSchools.data || [],
        },
        statistics: {
          title: 'إحصائيات عامّة',
          stats: [
            {
              id: 1,
              icon: 'office',
              value: statistics.data?.total_directorates ?? 0,
              label: 'مديرية',
              description: '',
              animationConfig: {
                dashArray: '210',
                dashOffset: '45',
                rotation: '50',
              },
            },
            {
              id: 2,
              icon: 'schoolicon',
              value: statistics.data?.total_schools ?? 0,
              label: 'مدرسة',
              description: '',
              animationConfig: {
                height: 'h-[300px]',
                dashArray: '251',
                dashOffset: '37',
                rotation: '160',
              },
            },
            {
              id: 3,
              icon: 'team',
              value: statistics.data?.total_teachers ?? 0,
              label: 'معلم',
              description: '',
              animationConfig: {
                dashArray: '200',
                dashOffset: '0',
                rotation: '30',
              },
            },
          ],
        },
      };
    } catch (error) {
      console.error('Error fetching schools page data:', error);
      throw error;
    }
  },
};

export default schoolsService;
