import React, { useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import AdminDashboardComplete from './AdminDashboardComplete';
import AdminLoading from './AdminLoading'; // Add this import
import { 
  FaHome, 
  FaUsers, 
  FaSchool, 
  FaHeadset, 
  FaChartBar, 
  FaCog 
} from 'react-icons/fa';

const AdminDashboardWrapper = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Handle when loading is complete
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const sidebarItems = [
    { 
      id: 'overview', 
      label: 'نظرة عامة', 
      icon: FaHome, 
      active: activeTab === 'overview',
      onClick: () => setActiveTab('overview') 
    },
    { 
      id: 'users', 
      label: 'المستخدمين', 
      icon: FaUsers, 
      active: activeTab === 'users',
      onClick: () => setActiveTab('users') 
    },
    { 
      id: 'schools', 
      label: 'المدارس', 
      icon: FaSchool, 
      active: activeTab === 'schools',
      onClick: () => setActiveTab('schools') 
    },
    { 
      id: 'support', 
      label: 'الدعم الفني', 
      icon: FaHeadset, 
      active: activeTab === 'support',
      onClick: () => setActiveTab('support') 
    },
    { 
      id: 'reports', 
      label: 'التقارير', 
      icon: FaChartBar, 
      active: activeTab === 'reports',
      onClick: () => setActiveTab('reports') 
    },
    { 
      id: 'settings', 
      label: 'الإعدادات', 
      icon: FaCog, 
      active: activeTab === 'settings',
      onClick: () => setActiveTab('settings') 
    }
  ];

  const userInfo = {
    name: 'المدير العام',
    title: 'مدير النظام',
    avatar: 'م'
  };

  // Show loading component while initializing
  if (isLoading) {
    return <AdminLoading onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} userInfo={userInfo}>
      <AdminDashboardComplete activeTab={activeTab} setActiveTab={setActiveTab} />
    </DashboardLayout>
  );
};

export default AdminDashboardWrapper;