// =============================================================================
// Admin Dashboard Main Index File
// ملف الفهرس الرئيسي لداشبورد  Admin
// =============================================================================

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { AdminProvider } from '../contexts/AdminContext';
import AdminDashboard from './AdminDashboard';
import Dashboard from './Dashboard';
import SchoolsManagement from './SchoolsManagement';
import SchoolComparisonPage from './SchoolComparisonPage';
import ComplaintsManagement from './ComplaintsManagement';
import EvaluationsPage from './EvaluationsPage';
import ProfilePage from './ProfilePage';
// Removed ChatPage import as component doesn't exist
import NotificationsPage from './NotificationsPage';
import Settings from './Settings';
import ReportsManagement from './ReportsManagement';
// Removed CalendarPage import as component doesn't exist
import TestNotifications from '../TestNotifications';
import ResetData from '../ResetData';
import TestSharedNotifications from '../TestSharedNotifications';
import SupportTickets from './SupportTickets';
import InvitationsManagement from './InvitationsManagement';

import UsersManagement from './UsersManagement';

const AdminDashboardRoutes = () => {
  return (
    <Layout>
      <AdminProvider>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="dashboard-old" element={<Dashboard />} />
          <Route path="schools" element={<SchoolsManagement />} />
          <Route path="schools/comparison" element={<SchoolComparisonPage />} />
          <Route path="complaints" element={<ComplaintsManagement />} />
          <Route path="evaluations" element={<EvaluationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          {/* Removed ChatPage route as component doesn't exist */}
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="reports" element={<ReportsManagement />} />
          {/* Removed CalendarPage route as component doesn't exist */}
          <Route path="test-notifications" element={<TestNotifications />} />
          <Route path="reset-data" element={<ResetData />} />
          <Route path="test-shared-notifications" element={<TestSharedNotifications />} />
          <Route path="SupportPage" element={<SupportTickets />} />
          <Route path="invitations" element={<InvitationsManagement />} />
          <Route path="users" element={<UsersManagement />} />
          
          {/* Default route to admin dashboard */}
          <Route path="*" element={<AdminDashboard />} />
        </Routes>
      </AdminProvider>
    </Layout>
  );
};

export default AdminDashboardRoutes;