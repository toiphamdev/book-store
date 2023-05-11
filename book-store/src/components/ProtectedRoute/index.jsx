import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NotPermitted from "../NotPermitted";

const RoleBaseRoute = ({ children }) => {
  const user = useSelector((state) => state.account.user);
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const userRole = user.role;

  if (isAdminRoute && userRole === "ADMIN") {
    return <>{children}</>;
  } else {
    return <NotPermitted />;
  }
};
const ProtectedRoute = ({ role, ...props }) => {
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);

  return (
    <>
      {isAuthenticated === true ? (
        role === "USER" || role === "ADMIN" ? (
          <>{props.children}</>
        ) : (
          <RoleBaseRoute>{props.children}</RoleBaseRoute>
        )
      ) : (
        <Navigate to={"/login"} replace />
      )}
    </>
  );
};

export default ProtectedRoute;
