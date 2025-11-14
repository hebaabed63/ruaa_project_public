// =============================================================================
// Enhanced Hooks for Parents Dashboard - Complete Implementation
// هوكس محسنة ومتكاملة لداشبورد أولياء الأمور مع تكامل API
// =============================================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { parentsAPI } from '../services/parentsApi';
import { handleAPIError } from '../services/api';
import { fetchParentProfile } from '../services/profileApi';

// Import our new hooks
import { useReportsData, useCalendarData } from './useReports';

/**
 * هوك لإدارة بيانات ولي الأمر
 * Hook for managing parent profile data
 */
export const useParentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchParentProfile();
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
      const data = await parentsAPI.getDashboardStats();
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
 * هوك لإدارة قائمة المدارس مع الفلاتر
 * Hook for managing schools list with filtering
 */
export const useSchools = (initialFilters = {}) => {
  const [schools, setSchools] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchSchools = useCallback(async (currentFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await parentsAPI.getSchools(currentFilters);
      setSchools(data.schools);
      setTotal(data.total);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchools(filters);
  }, [fetchSchools, filters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Schools grouped by type
  const groupedSchools = useMemo(() => {
    return schools.reduce((groups, school) => {
      const type = school.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(school);
      return groups;
    }, {});
  }, [schools]);

  // My children's schools
  const mySchools = useMemo(() => {
    if (filters.myChildren) {
      return schools.filter(school => school.hasMyChild);
    }
    return schools;
  }, [schools, filters.myChildren]);

  return {
    schools,
    groupedSchools,
    mySchools,
    total,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refetch: () => fetchSchools(filters)
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
      const data = await parentsAPI.getSchoolDetails(id);
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

  return {
    school,
    loading,
    error,
    refetch: () => fetchSchoolDetails(schoolId)
  };
};

/**
 * هوك لإدارة الإشعارات
 * Hook for managing notifications
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { profile: parentProfile } = useParentProfile();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Import the notifications API
      const { default: notificationsAPI } = await import('../services/notificationsApi');
      
      // Pass parent's children data to filter notifications properly
      const data = await notificationsAPI.fetchForParent('parent_001', parentProfile?.children || []);
      
      setNotifications(data);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  }, [parentProfile]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      const { default: notificationsAPI } = await import('../services/notificationsApi');
      await notificationsAPI.markAsRead(notificationId);
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
    } catch (err) {
      setError(handleAPIError(err));
    }
  }, []);

  const markAsUnread = useCallback(async (notificationId) => {
    try {
      const { default: notificationsAPI } = await import('../services/notificationsApi');
      await notificationsAPI.markAsUnread(notificationId);
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: false }
            : notif
        )
      );
    } catch (err) {
      setError(handleAPIError(err));
    }
  }, []);

  const archiveNotification = useCallback(async (notificationId) => {
    try {
      const { default: notificationsAPI } = await import('../services/notificationsApi');
      await notificationsAPI.archive(notificationId);
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, archived: true }
            : notif
        )
      );
    } catch (err) {
      setError(handleAPIError(err));
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const { default: notificationsAPI } = await import('../services/notificationsApi');
      await notificationsAPI.markAllAsRead();
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (err) {
      setError(handleAPIError(err));
    }
  }, []);

  // Get unread count
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Group by type
  const groupedNotifications = useMemo(() => {
    return notifications.reduce((groups, notification) => {
      const type = notification.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(notification);
      return groups;
    }, {});
  }, [notifications]);

  // Filter notifications by type
  const filterByType = useCallback((type) => {
    if (type === 'all') return notifications;
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  // Filter notifications by search term
  const filterBySearch = useCallback((searchTerm) => {
    if (!searchTerm) return notifications;
    const term = searchTerm.toLowerCase();
    return notifications.filter(n => 
      n.schoolName.toLowerCase().includes(term) || 
      n.title.toLowerCase().includes(term) || 
      n.message.toLowerCase().includes(term) ||
      (n.childName && n.childName.toLowerCase().includes(term)) ||
      (n.subject && n.subject.toLowerCase().includes(term)) ||
      (n.sender && n.sender.toLowerCase().includes(term))
    );
  }, [notifications]);

  // Filter archived notifications
  const getArchivedNotifications = useCallback(() => {
    return notifications.filter(n => n.archived || false);
  }, [notifications]);

  // Get counts for each type
  const getTypeCounts = useMemo(() => {
    const achievementCount = notifications.filter(n => n.type === 'achievement' && !(n.archived || false)).length;
    const improvementCount = notifications.filter(n => n.type === 'improvement' && !(n.archived || false)).length;
    const performanceCount = notifications.filter(n => n.type === 'performance' && !(n.archived || false)).length;
    const principalCount = notifications.filter(n => n.type === 'principal' && !(n.archived || false)).length;
    const chatCount = notifications.filter(n => n.type === 'chat' && !(n.archived || false)).length;
    const totalCount = notifications.filter(n => !(n.archived || false)).length;
    return { 
      achievement: achievementCount, 
      improvement: improvementCount, 
      performance: performanceCount,
      principal: principalCount,
      chat: chatCount,
      total: totalCount 
    };
  }, [notifications]);

  return {
    notifications,
    groupedNotifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAsUnread,
    archiveNotification,
    markAllAsRead,
    filterByType,
    filterBySearch,
    getArchivedNotifications,
    getTypeCounts,
    refetch: fetchNotifications
  };
};

/**
 * هوك لإدارة التقييمات
 * Hook for managing evaluations
 */
export const useEvaluations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitEvaluation = useCallback(async (schoolId, evaluation) => {
    try {
      setLoading(true);
      setError(null);
      const result = await parentsAPI.submitEvaluation(schoolId, evaluation);
      return result;
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    submitEvaluation
  };
};

/**
 * هوك لإدارة الرسائل والمحادثات
 * Hook for managing messages and chat
 */
export const useMessages = (schoolId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(async (id) => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await parentsAPI.getMessages(id);
      setMessages(data);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages(schoolId);
  }, [fetchMessages, schoolId]);

  const sendMessage = useCallback(async (message) => {
    if (!schoolId || !message.trim()) return;
    
    try {
      setSending(true);
      setError(null);
      const result = await parentsAPI.sendMessage(schoolId, message);
      
      // Add message to local state immediately for better UX
      const newMessage = {
        id: result.messageId,
        from: 'parent',
        text: message,
        timestamp: result.timestamp,
        read: true
      };
      
      setMessages(prev => [...prev, newMessage]);
      return result;
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSending(false);
    }
  }, [schoolId]);

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    refetch: () => fetchMessages(schoolId)
  };
};

/**
 * هوك لإدارة المحادثات
 * Hook for managing chat conversations
 */
export const useChat = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMySchools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // In a real app, this would call an API
      // For now, we'll use mock data
      const mockSchools = [
        {
          id: 'school_001',
          name: 'مدرسة الأمل الابتدائية',
          type: 'ابتدائية',
          location: 'الرياض - حي المروج',
          manager: {
            id: 'manager_001',
            name: 'أ. عبدالرحمن السالم',
            role: 'مدير المدرسة'
          }
        },
        {
          id: 'school_002',
          name: 'مدرسة النجاح المتوسطة',
          type: 'متوسطة',
          location: 'الرياض - حي النرجس',
          manager: {
            id: 'manager_002',
            name: 'أ. فاطمة الخالد',
            role: 'مدير المدرسة'
          }
        }
      ];
      setConversations(mockSchools);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (schoolId) => {
    try {
      setLoading(true);
      setError(null);
      // In a real app, this would call an API
      // For now, we'll use mock data
      const mockMessages = [
        {
          id: 'msg_001',
          from: 'manager',
          text: 'أهلاً بك! أنا أ. عبدالرحمن السالم. كيف أستطيع مساعدتك؟',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: true
        },
        {
          id: 'msg_002',
          from: 'parent',
          text: 'أهلاً وسهلاً، أريد الاستفسار عن أداء طفلي في الفصل الدراسي الحالي',
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          read: true
        },
        {
          id: 'msg_003',
          from: 'manager',
          text: 'بالطبع، يمكنني مساعدتك في ذلك. هل يمكنك تزويدي باسم الطالب ورقم الصف؟',
          timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
          read: true
        }
      ];
      setMessages(mockMessages);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (schoolId, messageText) => {
    try {
      // In a real app, this would call an API
      // For now, we'll simulate sending a message
      const newMessage = {
        id: `msg_${Date.now()}`,
        from: 'parent',
        text: messageText,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (err) {
      setError(handleAPIError(err));
      throw err;
    }
  }, []);

  const startConversation = useCallback((school) => {
    setActiveConversation(school);
    fetchMessages(school.id);
  }, [fetchMessages]);

  useEffect(() => {
    fetchMySchools();
  }, [fetchMySchools]);

  return {
    conversations,
    activeConversation,
    messages,
    loading,
    error,
    startConversation,
    sendMessage,
    setActiveConversation
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
    const saved = localStorage.getItem('parentsUI_settings');
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
    localStorage.setItem('parentsUI_settings', JSON.stringify(settings));
    
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
      // Import the theme API
      const { default: themeAPI } = await import('../services/themeApi');
      const result = await themeAPI.toggleTheme();
      
      if (result.success) {
        updateSetting('theme', result.theme);
      }
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

// Export our new hooks
export { useReportsData, useCalendarData };