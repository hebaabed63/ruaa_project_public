import React from 'react';
import { motion } from 'framer-motion';

const NotificationDemo = () => {
  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: "performance",
      icon: "📊",
      studentName: "أحمد محمد",
      description: "ابنك أحمد حصل على درجة ممتازة في مادة الرياضيات.",
      schoolName: "مدرسة الأمل",
      date: "2025-10-06T08:30:00Z",
      read: false
    },
    {
      id: 2,
      type: "achievement",
      icon: "🏆",
      studentName: "",
      description: "مدرسة النجاح حصلت على جائزة في مسابقة العلوم.",
      schoolName: "مدرسة النجاح",
      date: "2025-10-05T14:15:00Z",
      read: false
    },
    {
      id: 3,
      type: "improvement",
      icon: "🔧",
      studentName: "",
      description: "مدرسة الأمل قامت بتحديث المكتبة وزيادة عدد الكتب العلمية.",
      schoolName: "مدرسة الأمل",
      date: "2025-10-04T11:45:00Z",
      read: true
    },
    {
      id: 4,
      type: "principal",
      icon: "📨",
      studentName: "",
      description: "مدير مدرسة النجاح رد على استفسارك بخصوص موعد الاجتماع.",
      schoolName: "مدرسة النجاح",
      date: "2025-10-03T15:20:00Z",
      read: false
    },
    {
      id: 5,
      type: "chat",
      icon: "💬",
      studentName: "",
      description: "رسالة جديدة من معلمة الصف الخامس بشأن الواجبات الأسبوعية.",
      schoolName: "مدرسة الأمل",
      date: "2025-10-02T17:50:00Z",
      read: true
    }
  ];

  // Format date in Arabic locale
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } else {
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // Get type-specific styling
  const getTypeStyles = (type) => {
    const styles = {
      performance: {
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-500',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      achievement: {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-500',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
      },
      improvement: {
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-500',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600'
      },
      principal: {
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-500',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600'
      },
      chat: {
        bgColor: 'bg-pink-50',
        borderColor: 'border-pink-500',
        iconBg: 'bg-pink-100',
        iconColor: 'text-pink-600'
      }
    };
    
    return styles[type] || {
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-500',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600'
    };
  };

  return (
    <div className="max-w-4xl mx-auto p-4" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">عرض تجريبي للإشعارات</h1>
      
      <div className="space-y-4">
        {notifications.map((notification, index) => {
          const typeStyles = getTypeStyles(notification.type);
          
          return (
            <motion.div
              key={notification.id}
              className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
                notification.read 
                  ? 'bg-white border-gray-200' 
                  : `${typeStyles.bgColor} border-gray-300 shadow-sm`
              } border-r-4 ${typeStyles.borderColor}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <div className="flex items-start">
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${typeStyles.iconBg} ${typeStyles.iconColor} mr-3`}>
                  <span className="text-lg">{notification.icon}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {!notification.read && (
                        <motion.div 
                          className="w-2 h-2 bg-blue-500 rounded-full mr-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        ></motion.div>
                      )}
                      <h3 className={`font-bold ${notification.read ? 'text-gray-800' : 'text-gray-900'}`}>
                        {notification.type === 'performance' 
                          ? 'تقييم جديد' 
                          : notification.type === 'achievement' 
                            ? 'إنجاز مدرسي' 
                            : notification.type === 'improvement' 
                              ? 'تحسن في المدرسة' 
                              : notification.type === 'principal' 
                                ? 'رد من المدير' 
                                : 'رسالة جديدة'}
                      </h3>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(notification.date)}
                    </span>
                  </div>
                  
                  <p className={`mt-1 text-sm ${notification.read ? 'text-gray-600' : 'text-gray-700'}`}>
                    {notification.description}
                  </p>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      {notification.schoolName}
                    </span>
                    {notification.studentName && (
                      <span className="text-xs text-gray-500">
                        {notification.studentName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationDemo;