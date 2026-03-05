import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AdminGuard() {
  const { initializing, isAdmin } = useAuth();

  if (initializing) return null;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return <Outlet />;
}