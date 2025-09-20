// components/routes/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/*
  PrivateRoute Component
  Props:
    - isAuthenticated: boolean, whether the user is logged in
    - allowedRoles: array, list of roles allowed to access the route
    - userRole: string, the role of the current user
    - redirectPath: string, path to redirect if not authenticated (default: "/login")
*/
const PrivateRoute = ({ isAuthenticated, allowedRoles, userRole, redirectPath = "/login" }) => {
  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) return <Navigate to={redirectPath} replace />;

  // If user role is not allowed, redirect to error page (or 403)
  if (!allowedRoles.includes(userRole)) return <Navigate to="/NotFound404" replace />;

  // If authenticated and role is allowed, render the child route
  return <Outlet />;
};

export default PrivateRoute;
