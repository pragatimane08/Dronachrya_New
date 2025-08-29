import React from "react";
import { Navigate, useLocation } from "react-router-dom"; // ✅ Add useLocation import

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  const userData = localStorage.getItem("user");
  const location = useLocation(); // ✅ Now this will work

  // Parse user data to get role
  let role = "";
  try {
    const user = userData ? JSON.parse(userData) : null;
    role = user?.role || "";
  } catch (e) {
    console.error("Error parsing user data:", e);
  }

  // Fallback: also check localStorage/sessionStorage directly
  role = role || localStorage.getItem("role") || sessionStorage.getItem("role") || "";

  if (!token) {
    // Not logged in → send to correct login page
    if (allowedRoles && allowedRoles.includes("admin")) {
      return <Navigate to="/admin-login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Logged in but wrong role → block access
    if (role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }
    if (role === "tutor") {
      return <Navigate to="/tutor-dashboard" replace />;
    }
    if (role === "student") {
      return <Navigate to="/student-dashboard" replace />;
    }
    
    // If role is missing or invalid, redirect to appropriate login
    if (allowedRoles.includes("admin")) {
      return <Navigate to="/admin-login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;