import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

// Auth Components
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Registration";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import PasswordResetSuccess from "../pages/auth/PasswordResetSuccess";
import GoogleCallback from "../pages/auth/GoogleCallback";

// Public Pages

import LandingPage from "../pages/public/Home/LandingPage";
/*
import AboutPage from '../pages/public/About/AboutPage';
import ContactPage from '../pages/public/Contact/ContactPage';
import ServicesPage from '../pages/public/Services/ServicesPage';
import GoalsPage from '../pages/public/Goals/GoalsPage';
import SchoolsPage from '../pages/public/Schools/SchoolsPage';
import EvaluationPage from '../pages/public/Evaluation/EvaluationPage';
*/
// Dashboard Components
import AdminDashboard from "../pages/dashboard/admin/AdminDashboard";
import ParentDashboard from "../pages/dashboard/ParentDashboard";
import ParentsDashboard from "../pages/dashboard/parents/ParentsDashboard";
import SupervisorDashboard from "../pages/dashboard/supervisor/SupervisorDashboard";
import SchoolManagerDashboard from "../pages/dashboard/school-manager/SchoolManagerDashboard";

// Error Page
import NotFound from "../pages/error/NotFound404";

// Utils
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  const { isAuthenticated, userRole } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      {/*
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/goals" element={<GoalsPage />} />
      <Route path="/schools" element={<SchoolsPage />} />
      <Route path="/evaluation" element={<EvaluationPage />} />
       */}
      {/* Auth routes (without layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />

      {/* Protected Dashboards */}
      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={["admin"]} userRole={userRole} />}>
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
      </Route>

      {/* Temporary routes for testing - remove in production */}
      {/*<Route path="/admin-demo" element={<AdminDashboard />} />*/}
      <Route path="/parents-demo" element={<ParentsDashboard />} />
      <Route path="/supervisor-demo" element={<SupervisorDashboard />} />
      <Route path="/school-manager-demo" element={<SchoolManagerDashboard />} />
      

      {/* Temporary direct access to parents dashboard for Google OAuth testing */}
      <Route path="/dashboard/parents" element={<ParentsDashboard />} />
      
      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={["parent"]} userRole={userRole} />}>
        <Route path="/dashboard/parent" element={<ParentDashboard />} />
        {/* <Route path="/dashboard/parents" element={<ParentsDashboard />} /> */}
      </Route>

      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={["supervisor"]} userRole={userRole} />}>
        <Route path="/dashboard/supervisor" element={<SupervisorDashboard />} />
      </Route>

      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={["school-manager"]} userRole={userRole} />}>
        <Route path="/dashboard/school-manager" element={<SchoolManagerDashboard />} />
      </Route>

      {/* Catch-all / Errors */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
