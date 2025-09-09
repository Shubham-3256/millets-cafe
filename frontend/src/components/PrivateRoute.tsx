// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  role?: "user" | "admin"; // optional role restriction
}

const PrivateRoute: React.FC<Props> = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // we stored this on login

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />; // redirect unauthorized users
  }

  return <>{children}</>;
};

export default PrivateRoute;
