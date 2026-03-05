import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ManagerGuard() {
  const { initializing, isManager } = useAuth();

  if (initializing) return null; // or a spinner component
  if (!isManager) return <Navigate to="/manager/login" replace />;

  return <Outlet />;
}