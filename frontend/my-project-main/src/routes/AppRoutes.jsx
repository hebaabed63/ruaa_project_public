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
// Public Pages
import LandingPage from '../pages/public/Home/LandingPage';
import About from '../pages/public/About/index';
import Objectives from '../pages/public/Objectives/index';
import Ratings from '../pages/public/Ratings/index';
import Schools from '../pages/public/Schools/index';
import Services from '../pages/public/Services/index';
import Contact from '../pages/public/Contact/index';
import Privacy from '../pages/public/Privacy/index';
import Terms from '../pages/public/Terms/index';
import Support from '../pages/public/Support/index';

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
        {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/About" element={<About />} />
      <Route path="/objectives" element={<Objectives />} />
      <Route path="/Objectives" element={<Objectives />} />
      <Route path="/ratings" element={<Ratings />} />
      <Route path="/Ratings" element={<Ratings />} />
      <Route path="/schools" element={<Schools />} />
      <Route path="/Schools" element={<Schools />} />
      <Route path="/services" element={<Services />} />
      <Route path="/Services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/Privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/Terms" element={<Terms />} />
      <Route path="/support" element={<Support />} />
      <Route path="/Support" element={<Support />} />
      {/* <Route path="/dashboard/parents/*" element={<ParentsDashboardLayout />} /> */}

      {/* Auth routes (without layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />

      {/* Protected Dashboards */}
      
      {/* <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={["admin"]} userRole={userRole} />}>
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
      </Route> */}

      {/* Temporary routes for testing - remove in production */}
      {/*<Route path="/admin-demo" element={<AdminDashboard />} />*/}
      {/* <Route path="/parents-demo" element={<ParentsDashboard />} />
      <Route path="/supervisor-demo" element={<SupervisorDashboard />} />
      <Route path="/school-manager-demo" element={<SchoolManagerDashboard />} />
       */}

      {/* Temporary direct access to parents dashboard for Google OAuth testing */}
      {/* <Route path="/dashboard/parents" element={<ParentsDashboard />} />
      
      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={["parent"]} userRole={userRole} />}>
        <Route path="/dashboard/parent" element={<ParentDashboard />} />
        {/* <Route path="/dashboard/parents" element={<ParentsDashboard />} /> */}
      {/* </Route>

      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={["supervisor"]} userRole={userRole} />}>
        <Route path="/dashboard/supervisor" element={<SupervisorDashboard />} />
      </Route> */} 

      {/* // <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={["school-manager"]} userRole={userRole} />}>
      //   <Route path="/dashboard/school-manager" element={<SchoolManagerDashboard />} />
      // </Route> */}

      {/* Catch-all / Errors */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
