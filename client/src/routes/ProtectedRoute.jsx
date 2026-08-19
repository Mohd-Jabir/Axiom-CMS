import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";
import Spinner from "../components/ui/Spinner.jsx";

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) {
    return <Spinner />;
  }
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}