import React from "react";
import { Navigate } from "react-router-dom";

// This component checks for authentication (token in localStorage) and conditionally renders the children
const ProtectedRoute = ({ children, forLoginPage = false }) => {
  const token = localStorage.getItem("token");

  // If the user is logged in and tries to access login/register page, redirect them to home/dashboard
  if (forLoginPage && token) {
    return <Navigate to="/staff-dashboard" />; // Redirect to home or dashboard
  }

  // If no token is found and the route is not for the login page, redirect to login
  if (!forLoginPage && !token) {
    return <Navigate to="/" />;
  }

  // Render children if authenticated or if it's a login/register page and the user is not logged in
  return children;
};

export default ProtectedRoute;
