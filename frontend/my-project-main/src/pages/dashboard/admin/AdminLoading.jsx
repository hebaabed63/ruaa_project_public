import React, { useEffect } from "react";
import DashboardLayout from '../../../layouts/DashboardLayout';
import LoadingOverlay from "../../../components/ui/LoadingOverlay";

const AdminLoading = ({ onLoadingComplete }) => {
  const userInfo = {
    name: 'المدير العام',
    title: 'مدير النظام',
    avatar: 'م'
  };

  const sidebarItems = [
    { 
      id: 'loading', 
      label: 'جاري التحميل...', 
      icon: () => <div className="w-5 h-5"></div>, 
      active: true,
      onClick: () => {} 
    }
  ];

  // Simulate loading time and then notify parent component
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    }, 2000); // Show loading spinner for 2 seconds

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userInfo={userInfo}>
      <div className="flex items-center justify-center h-full">
        <LoadingOverlay message="مرحباً بك في لوحة تحكم الإدارة" />
      </div>
    </DashboardLayout>
  );
};

export default AdminLoading;