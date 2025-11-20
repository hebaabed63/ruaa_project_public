import { useState, useEffect } from 'react';

// استخدام بيانات وهمية مباشرة بدل الـ API
const mockReportsData = {
  schools: [
    {
      school_id: 1,
      school_name: "مدرسة النهضة",
      average_rating: 4.5,
      evaluations_count: 15,
      supervisor_name: "أحمد محمد",
      region: "الرياض",
      status: "active",
      school_type: "حكومية"
    },
    {
      school_id: 2,
      school_name: "مدرسة المستقبل",
      average_rating: 3.8,
      evaluations_count: 8,
      supervisor_name: "فاطمة علي",
      region: "مكة",
      status: "active",
      school_type: "أهلية"
    },
    {
      school_id: 3,
      school_name: "مدرسة الأمل",
      average_rating: 4.2,
      evaluations_count: 12,
      supervisor_name: "خالد إبراهيم",
      region: "الشرقية",
      status: "active",
      school_type: "دولية"
    }
  ],
  summary: {
    total_schools: 3,
    total_evaluations: 35,
    average_rating: 4.17,
    active_supervisors: 3,
    active_parents: 150
  },
  comparison: {
    top_schools: {
      names: ["مدرسة النهضة", "مدرسة الأمل", "مدرسة المستقبل"],
      ratings: [4.5, 4.2, 3.8]
    },
    school_type_distribution: {
      "حكومية": 1,
      "أهلية": 1,
      "دولية": 1
    },
    performance_over_time: [
      { month: "Jan 2024", average_rating: 4.1 },
      { month: "Feb 2024", average_rating: 4.2 },
      { month: "Mar 2024", average_rating: 4.3 },
      { month: "Apr 2024", average_rating: 4.4 },
      { month: "May 2024", average_rating: 4.5 }
    ]
  }
};

// Hook لجلب بيانات مدارس التقارير
export const useReportsSchools = (filters = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // محاكاة طلب API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // تطبيق الفلاتر على البيانات الوهمية
        let filteredData = [...mockReportsData.schools];
        
        if (filters.region) {
          filteredData = filteredData.filter(school => school.region === filters.region);
        }
        
        if (filters.school_type) {
          filteredData = filteredData.filter(school => school.school_type === filters.school_type);
        }
        
        setData(filteredData);
        setError(null);
      } catch (err) {
        setError(err.message || "حدث خطأ في تحميل البيانات");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [JSON.stringify(filters)]);

  const refetch = () => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setData(mockReportsData.schools);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  return { data, loading, error, refetch };
};

// Hook لجلب ملخص التقارير
export const useReportsSummary = (filters = {}) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setData(mockReportsData.summary);
        setError(null);
      } catch (err) {
        setError(err.message || "حدث خطأ في تحميل البيانات");
        setData({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [JSON.stringify(filters)]);

  const refetch = () => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setData(mockReportsData.summary);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  return { data, loading, error, refetch };
};

// Hook لجلب بيانات المقارنات
export const useReportsComparison = (filters = {}) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 600));
        setData(mockReportsData.comparison);
        setError(null);
      } catch (err) {
        setError(err.message || "حدث خطأ في تحميل البيانات");
        setData({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [JSON.stringify(filters)]);

  const refetch = () => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setData(mockReportsData.comparison);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  return { data, loading, error, refetch };
};

// Hook لتصدير التقارير
export const useExportReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutateAsync = async (exportData) => {
    try {
      setLoading(true);
      setError(null);
      
      // محاكاة تصدير التقرير
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = {
        success: true,
        message: "تم تصدير التقرير بنجاح",
        data: {
          export_type: exportData.export_type,
          file_url: "http://example.com/report." + exportData.export_type
        }
      };
      
      // تحميل الملف بعد التصدير الناجح
      if (response.data?.file_url) {
        window.open(response.data.file_url, '_blank');
      }
      
      return response;
    } catch (err) {
      setError(err.message || "فشل في تصدير التقرير");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    mutateAsync, 
    isLoading: loading, 
    error 
  };
};

// Hook لجلب تقارير المدارس العامة
export const useReports = (filters = {}) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // استخدام بيانات وهمية مؤقتاً
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockReports = [
          {
            id: 1,
            title: "تقرير أداء المدرسة الأولى",
            description: "تقرير مفصل عن أداء المدرسة خلال الفصل الدراسي",
            userRole: "supervisor",
            status: "completed",
            created_at: "2024-01-15T10:30:00Z"
          },
          {
            id: 2,
            title: "تقرير التقييم الربع سنوي",
            description: "تقرير التقييم للربع الأول من العام",
            userRole: "school_manager",
            status: "in_progress",
            created_at: "2024-01-10T14:20:00Z"
          },
          {
            id: 3,
            title: "تقرير متابعة الطلاب",
            description: "متابعة أداء الطلاب وتحصيلهم العلمي",
            userRole: "admin",
            status: "pending",
            created_at: "2024-01-05T09:15:00Z"
          },
          {
            id: 4,
            title: "تقرير الصيانة الدورية",
            description: "تقرير صيانة مرافق المدرسة",
            userRole: "supervisor",
            status: "completed",
            created_at: "2024-01-20T11:45:00Z"
          },
          {
            id: 5,
            title: "تقرير الأنشطة الطلابية",
            description: "تقرير عن الأنشطة الطلابية للفصل الأول",
            userRole: "school_manager",
            status: "in_progress",
            created_at: "2024-01-18T16:30:00Z"
          }
        ];
        
        setReports(mockReports);
        setError(null);
      } catch (err) {
        setError(err.message || "حدث خطأ في تحميل التقارير");
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [JSON.stringify(filters)]);

  const refetch = () => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  return { reports, loading, error, refetch };
};

export default {
  useReportsSchools,
  useReportsSummary,
  useReportsComparison,
  useExportReport,
  useReports
};