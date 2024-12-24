import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const PublicRoute = () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export { PrivateRoute, PublicRoute };
