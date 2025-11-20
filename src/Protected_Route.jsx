// src/components/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  const userData = localStorage.getItem("user");
  const location = useLocation();

  // Parse user role
  let role = "";
  try {
    const user = userData ? JSON.parse(userData) : null;
    role = user?.role || "";
  } catch (e) {
    console.error("Error parsing user data:", e);
  }

  // Fallback to role from storage
  role =
    role ||
    localStorage.getItem("role") ||
    sessionStorage.getItem("role") ||
    "";

  // 🚫 Not logged in
  if (!token) {
    if (allowedRoles?.includes("admin")) {
      return <Navigate to="/admin-login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🚫 Wrong role logged in
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }
    if (role === "tutor") {
      return <Navigate to="/tutor-dashboard" replace />;
    }
    if (role === "student") {
      return <Navigate to="/student-dashboard" replace />;
    }

    // Unknown role → fallback to login
    if (allowedRoles.includes("admin")) {
      return <Navigate to="/admin-login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // ✅ Passed all checks → render page
  return children;
};

export default ProtectedRoute;
