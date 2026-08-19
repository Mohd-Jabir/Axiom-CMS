import { Navigate, Outlet } from "react-router-dom";
import Spinner from "../components/ui/Spinner.jsx";
import { useAuth } from "../hooks/useAuth.js";

export default function GuestRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}