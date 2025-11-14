import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import SupervisorsDashboard from './pages/SupervisorsDashboard';
import SchoolsPage from './pages/SchoolsPage';
import SchoolComparisonPage from './pages/SchoolComparisonPage';
import ComplaintsPage from './pages/ComplaintsPage';
import EvaluationsPage from './pages/EvaluationsPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import TestNotifications from './TestNotifications';
import ResetData from './ResetData';
import ReportsPage from './pages/ReportsPage';
import CalendarPage from './pages/CalendarPage';
import TestSharedNotifications from './TestSharedNotifications';
import InvitationsPage from "./pages/InvitationsPage";
import TestSupervisorAPI from './TestSupervisorAPI';

const SupervisorsDashboardLayout = () => {
  return (
    <Layout>
      <Routes>
        <Route index element={<SupervisorsDashboard />} />
        <Route path="dashboard" element={<SupervisorsDashboard />} />
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
        <Route path="InvitationsPage" element={<InvitationsPage />} />
        <Route path="test-api" element={<TestSupervisorAPI />} />

        {/* Default route to dashboard */}
        <Route path="*" element={<SupervisorsDashboard />} />
      </Routes>
    </Layout>
  );
};

export default SupervisorsDashboardLayout;