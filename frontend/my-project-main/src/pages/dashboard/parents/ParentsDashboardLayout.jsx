import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ParentsDashboard from './pages/ParentsDashboard';
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

const ParentsDashboardLayout = () => {
  return (
    <Layout>
      <Routes>
        <Route index element={<ErrorBoundary><ParentsDashboard /></ErrorBoundary>} />
        <Route path="dashboard" element={<ErrorBoundary><ParentsDashboard /></ErrorBoundary>} />
        <Route path="dashboard-old" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
        <Route path="schools" element={<ErrorBoundary><SchoolsPage /></ErrorBoundary>} />
        <Route path="schools/comparison" element={<ErrorBoundary><SchoolComparisonPage /></ErrorBoundary>} />
        <Route path="complaints" element={<ErrorBoundary><ComplaintsPage /></ErrorBoundary>} />
        <Route path="evaluations" element={<ErrorBoundary><EvaluationsPage /></ErrorBoundary>} />
        <Route path="profile" element={<ErrorBoundary><ProfilePage /></ErrorBoundary>} />
        <Route path="chat" element={<ErrorBoundary><ChatPage /></ErrorBoundary>} />
        <Route path="notifications" element={<ErrorBoundary><NotificationsPage /></ErrorBoundary>} />
        <Route path="settings" element={<ErrorBoundary><SettingsPage /></ErrorBoundary>} />
        <Route path="reports" element={<ErrorBoundary><ReportsPage /></ErrorBoundary>} />
        <Route path="calendar" element={<ErrorBoundary><CalendarPage /></ErrorBoundary>} />
        <Route path="test-notifications" element={<TestNotifications />} />
        <Route path="reset-data" element={<ResetData />} />
        <Route path="test-shared-notifications" element={<TestSharedNotifications />} />
        
        {/* Default route to schools page */}
        <Route path="*" element={<ErrorBoundary><SchoolsPage /></ErrorBoundary>} />
      </Routes>
    </Layout>
  );
};

export default ParentsDashboardLayout;