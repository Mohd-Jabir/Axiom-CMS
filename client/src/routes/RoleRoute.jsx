import { Navigate, Outlet } from "react-router-dom";
import Spinner from "../components/ui/Spinner.jsx";
import { useAuth } from "../hooks/useAuth.js";


export default function RoleRoute({ allowedRoles }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}