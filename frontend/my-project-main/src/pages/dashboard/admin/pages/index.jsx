// =============================================================================
// Admin Dashboard Main Index File
// ملف الفهرس الرئيسي لداشبورد  Admin
// =============================================================================

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import AdminDashboard from './AdminDashboard';
import Dashboard from './Dashboard';
import SchoolsPage from './SchoolsPage';
import SchoolComparisonPage from './SchoolComparisonPage';
import ComplaintsPage from './ComplaintsPage';
import EvaluationsPage from './EvaluationsPage';
import ProfilePage from './ProfilePage';
import ChatPage from './ChatPage';
import NotificationsPage from './NotificationsPage';
import SettingsPage from './SettingsPage';
import ReportsPage from './ReportsPage';
import CalendarPage from './CalendarPage';
import TestNotifications from '../TestNotifications';
import ResetData from '../ResetData';
import TestSharedNotifications from '../TestSharedNotifications';
import SupportPage from './SupportPage';
import InvitationsPage from './InvitationsPage';
import UsersPage from './UsersPage';

const AdminDashboardRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="dashboard-old" element={<Dashboard />} />
        <Route path="schools" element={<SchoolsPage />} />
        <Route path="schools/comparison" element={<SchoolComparisonPage />} />
        <Route path="complaints" element={<ComplaintsPage />} />
        <Route path="evaluations" element={<EvaluationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="test-notifications" element={<TestNotifications />} />
        <Route path="reset-data" element={<ResetData />} />
        <Route path="test-shared-notifications" element={<TestSharedNotifications />} />
        <Route path="SupportPage" element={<SupportPage />} />
        <Route path="invitations" element={<InvitationsPage />} />
        <Route path="users" element={<UsersPage />} />
        
        {/* Default route to admin dashboard */}
        <Route path="*" element={<AdminDashboard />} />
      </Routes>
    </Layout>
  );
};

export default AdminDashboardRoutes;