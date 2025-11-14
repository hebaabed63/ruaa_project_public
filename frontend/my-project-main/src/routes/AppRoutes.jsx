import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

// Auth Components
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Registration";
import SupervisorRegistration from "../pages/auth/SupervisorRegistration";
import PrincipalRegistration from "../pages/auth/PrincipalRegistration";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import PasswordResetSuccess from "../pages/auth/PasswordResetSuccess";
import GoogleCallback from "../pages/auth/GoogleCallback";
import PendingApproval from "../pages/auth/PendingApproval";

// Auth Components
import Logout from "../components/auth/Logout";

// Legal Pages
import TermsOfUse from "../pages/legal/TermsOfUse";
import PrivacyPolicy from "../pages/legal/PrivacyPolicy";

// Public Pages

import LandingPage from "../pages/public/Home/LandingPage";
import ContactPage from '../pages/public/Contact/ContactPage';
/*
import AboutPage from '../pages/public/About/AboutPage';
import ServicesPage from '../pages/public/Services/ServicesPage';
import GoalsPage from '../pages/public/Goals/GoalsPage';
import SchoolsPage from '../pages/public/Schools/SchoolsPage';
import EvaluationPage from '../pages/public/Evaluation/EvaluationPage';
*/
// Dashboard Components
import AdminDashboard from "../pages/dashboard/admin/AdminDashboard";
// import ParentDashboard from "../pages/dashboard/ParentDashboard"; // Old version
import ParentsDashboardLayout from "../pages/dashboard/parents/ParentsDashboardLayout"; // New organized version with Layout
import SupervisorDashboard from "../pages/dashboard/Supervisors/SupervisorsDashboardLayout";
import SchoolManagerDashboard from "../pages/dashboard/school-manager/SchoolManagerDashboard";

// Supervisor Dashboard Components
import SupervisorsDashboard from "../pages/dashboard/Supervisors/pages/SupervisorsDashboard";
import SchoolComparisonPage from "../pages/dashboard/Supervisors/pages/SchoolComparisonPage";
import ComplaintsPage from "../pages/dashboard/Supervisors/pages/ComplaintsPage";
import ProfilePage from "../pages/dashboard/Supervisors/pages/ProfilePage";
import ChatPage from "../pages/dashboard/Supervisors/pages/ChatPage";
import NotificationsPage from "../pages/dashboard/Supervisors/pages/NotificationsPage";
import SettingsPage from "../pages/dashboard/Supervisors/pages/SettingsPage";
import ReportsPage from "../pages/dashboard/Supervisors/pages/ReportsPage";
import CreateReport from "../pages/dashboard/Supervisors/pages/CreateReport";
import CalendarPage from "../pages/dashboard/Supervisors/pages/CalendarPage";
import InvitationsPage from "../pages/dashboard/Supervisors/pages/InvitationsPage";

// Test Components
import TestLoadingSpinner from "../components/TestLoadingSpinner";
import TestLoadingButton from "../components/TestLoadingButton";

// Error Page
import NotFound from "../pages/error/NotFound404";

// Utils
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  const { isAuthenticated, userRole, loading } = useContext(AuthContext);
  console.log('AppRoutes - Auth context:', { isAuthenticated, userRole, loading });

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      {/*
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/goals" element={<GoalsPage />} />
      <Route path="/schools" element={<SchoolsPage />} />
      <Route path="/evaluation" element={<EvaluationPage />} />
       */}
      <Route path="/contact" element={<ContactPage />} />
      
      {/* Auth routes (without layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/:token" element={<Register />} />
      
      {/* Token-based registration routes */}
      <Route path="/register/supervisor/:token" element={<SupervisorRegistration />} />
      <Route path="/register/principal" element={<PrincipalRegistration />} />
      
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />

      {/* Pending approval page */}
      <Route path="/pending-approval" element={<PendingApproval />} />

      {/* Logout route */}
      <Route path="/logout" element={<Logout />} />

      {/* Legal pages */}
      <Route path="/terms" element={<TermsOfUse />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      
      {/* Legal pages with return source */}
      <Route path="/terms/:source" element={<TermsOfUse />} />
      <Route path="/privacy/:source" element={<PrivacyPolicy />} />

      {/* Test routes */}
      <Route path="/test-loading" element={<TestLoadingSpinner />} />
      <Route path="/test-loading-button" element={<TestLoadingButton />} />

      {/* Protected Dashboards */}
      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={["admin"]} userRole={userRole} />}>
        <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
      </Route>

      {/* Temporary routes for testing - remove in production */}
      {/*<Route path="/admin-demo" element={<AdminDashboard />} />*/}
      <Route path="/parents-demo/*" element={<ParentsDashboardLayout />} />
      <Route path="/supervisor-demo" element={<SupervisorDashboard />} />
      <Route path="/school-manager-demo" element={<SchoolManagerDashboard />} />
      

      {/* Parent Dashboard - New organized version with Layout */}
      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={["parent"]} userRole={userRole} />}>
        <Route path="/dashboard/parent/*" element={<ParentsDashboardLayout />} />
        <Route path="/dashboard/parents/*" element={<ParentsDashboardLayout />} />
      </Route>

      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={["supervisor"]} userRole={userRole} />}>
        <Route path="/dashboard/supervisor/*" element={<SupervisorDashboard />} />
      </Route>

      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={["school_manager"]} userRole={userRole} />}>
        <Route path="/dashboard/school-manager" element={<SchoolManagerDashboard />} />
      </Route>

      {/* Catch-all / Errors */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}