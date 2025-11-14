// components/routes/PrivateRoute.jsx
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

/*
  PrivateRoute Component
  Props:
    - isAuthenticated: boolean, whether the user is logged in
    - allowedRoles: array, list of roles allowed to access the route
    - userRole: string, the role of the current user
    - redirectPath: string, path to redirect if not authenticated (default: "/login")
*/
const PrivateRoute = ({ isAuthenticated, allowedRoles, userRole, redirectPath = "/login" }) => {
  const { loading, checkAuth } = useContext(AuthContext);
  
  console.log('PrivateRoute check:', { loading, isAuthenticated, allowedRoles, userRole, redirectPath });
  
  // If still loading authentication state, show a loading indicator
  if (loading) {
    console.log('Still loading authentication state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to={redirectPath} replace />;
  }

  // If user role is not allowed, redirect to error page (or 404)
  if (!allowedRoles.includes(userRole)) {
    console.log('User role not allowed, redirecting to 404. Allowed roles:', allowedRoles, 'User role:', userRole);
    return <Navigate to="/NotFound" replace />;
  }

  // If authenticated and role is allowed, render the child route
  console.log('User authenticated and role allowed, rendering route');
  return <Outlet />;
};

export default PrivateRoute;