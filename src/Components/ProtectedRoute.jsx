import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.user);
  const token = localStorage.getItem("token");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Allow if authenticated in Redux OR token exists in localStorage
  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  // If superadmin, allow all routes
  if (user?.role === "superadmin") {
    return children;
  }

  // Check permission if provided and user is not superadmin
  if (requiredPermission) {
    if (!hasPermission(user, requiredPermission)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-gray-600 font-semibold">Access Denied</p>
            <p className="text-gray-500 text-sm">
              You don't have permission to access this page
            </p>
          </div>
        </div>
      );
    }
  }

  return children;
};

// Helper function to check permissions based on path
const hasPermission = (user, requiredPermission) => {
  if (!user || !user.permissions) return false;

  const perms = user.permissions;

  // Check based on path
  if (requiredPermission.includes("configuration")) {
    return perms.configuration?.configuration?.view || false;
  }
  if (requiredPermission.includes("accounting")) {
    return perms.accounting?.accounting?.view || false;
  }
  if (requiredPermission.includes("employer-management")) {
    return perms.employerManagement?.employerManagement?.view || false;
  }
  if (requiredPermission.includes("candidate-management")) {
    if (requiredPermission.includes("initial-registration")) {
      return perms.candidateManagement?.initialRegistration?.view || false;
    }
    if (requiredPermission.includes("candidate-final-registration")) {
      return (
        perms.candidateManagement?.candidateFinalRegistration?.view || false
      );
    }
    return perms.candidateManagement?.candidateManagement?.view || false;
  }

  return true; // Default to allowing if permission type not found
};

export default ProtectedRoute;
