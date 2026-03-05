import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function StaffGuard() {
  const { initializing, isStaff } = useAuth();

  if (initializing) return null;
  if (!isStaff) return <Navigate to="/staff/login" replace />;

  return <Outlet />;
}