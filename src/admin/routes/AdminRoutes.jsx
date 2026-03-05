import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ProfilePage from "@/pages/Profile";


import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Finance from "../pages/Finance";
import Compliance from "../pages/Compliance";
import Operations from "../pages/Operations";
import Disputes from "../pages/Disputes";
import Verification from "../pages/Verification";
import Transactions from "../pages/Transactions";
import RiskMonitoring from "../pages/RiskMonitoring";
import RoleAudit from "../pages/RoleAudit";
import RoleManagement from "../pages/RoleManagement";
import SystemHealth from "../pages/SystemHealth";
import Login from "../pages/Login";

export default function AdminRoutes() {
  const { user, initializing, isAdmin } = useAuth();

  return (
    <Routes>
      <Route
        path="login"
        element={isAdmin ? <Navigate to="/admin" replace /> : <Login />}
      />

      <Route
        element={
          initializing ? (
            <div className="p-10">Loading...</div>
          ) : isAdmin ? (
            <DashboardLayout />
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Navigate to="/admin" replace />} />
	<Route path="profile" element={<ProfilePage />} />
        <Route path="users" element={<Users />} />
        <Route path="finance" element={<Finance />} />
        <Route path="compliance" element={<Compliance />} />
        <Route path="operations" element={<Operations />} />
        <Route path="disputes" element={<Disputes />} />
        <Route path="verification" element={<Verification />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="risk-monitoring" element={<RiskMonitoring />} />
        <Route path="role-audit" element={<RoleAudit />} />
        <Route path="role-management" element={<RoleManagement />} />
        <Route path="system-health" element={<SystemHealth />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}