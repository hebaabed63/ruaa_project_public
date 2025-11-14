// =============================================================================
// Theme and Settings Management Hook for Parents Dashboard
// هوك إدارة السمات والإعدادات لداشبورد أولياء الأمور
// =============================================================================

import { useState, useEffect, useCallback } from 'react';

// الإعدادات الافتراضية
// Default settings
const DEFAULT_SETTINGS = {
  theme: 'light',
  language: 'ar',
  direction: 'rtl',
  fontSize: 'medium',
  animations: true,
  notifications: {
    sound: true,
    desktop: true,
    email: false
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    largeText: false
  },
  performance: {
    reducedAnimations: false,
    lazyLoading: true
  }
};

// مفتاح التخزين في LocalStorage
// LocalStorage key
const STORAGE_KEY = 'parents_dashboard_theme_settings';

/**
 * هوك إدارة السمات والإعدادات
 * Theme and settings management hook
 */
export const useTheme = () => {
  // تحميل الإعدادات من LocalStorage أو استخدام الإعدادات الافتراضية
  // Load settings from LocalStorage or use defaults
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // حفظ الإعدادات في LocalStorage عند تغييرها
  // Save settings to LocalStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      
      // تطبيق السمة على عنصر html
      // Apply theme to html element
      document.documentElement.setAttribute('data-theme', settings.theme);
      document.documentElement.setAttribute('dir', settings.direction);
      document.documentElement.classList.toggle('dark', settings.theme === 'dark');
      
      // تطبيق إعدادات الحركة
      // Apply motion settings
      document.documentElement.classList.toggle(
        'reduce-motion',
        settings.accessibility.reducedMotion
      );
      
      // تطبيق إعدادات التباين العالي
      // Apply high contrast settings
      document.documentElement.classList.toggle(
        'high-contrast',
        settings.accessibility.highContrast
      );
      
      // تطبيق حجم الخط
      // Apply font size
      document.documentElement.setAttribute('data-font-size', settings.fontSize);
    } catch (error) {
      console.error('Failed to save theme settings:', error);
    }
  }, [settings]);

  // تحديث إعداد محدد
  // Update specific setting
  const updateSetting = useCallback((key, value) => {
    setSettings(prev => {
      const keys = key.split('.');
      const lastKey = keys.pop();
      let current = { ...prev };
      let target = current;

      keys.forEach(k => {
        target[k] = { ...target[k] };
        target = target[k];
      });

      target[lastKey] = value;
      return current;
    });
  }, []);

  // تبديل السمة بين الفاتح والداكن
  // Toggle between light and dark theme
  const toggleTheme = useCallback(() => {
    updateSetting('theme', settings.theme === 'light' ? 'dark' : 'light');
  }, [settings.theme, updateSetting]);

  // إعادة تعيين الإعدادات إلى الافتراضية
  // Reset settings to defaults
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  // تصدير الإعدادات
  // Export settings
  const exportSettings = useCallback(() => {
    try {
      const dataStr = JSON.stringify(settings, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', 'theme-settings.json');
      linkElement.click();
    } catch (error) {
      console.error('Failed to export settings:', error);
    }
  }, [settings]);

  // استيراد الإعدادات
  // Import settings
  const importSettings = useCallback(async (file) => {
    try {
      const content = await file.text();
      const imported = JSON.parse(content);
      setSettings(prev => ({ ...prev, ...imported }));
      return true;
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  }, []);

  return {
    settings,
    updateSetting,
    toggleTheme,
    resetSettings,
    exportSettings,
    importSettings,
    isDark: settings.theme === 'dark'
  };
};