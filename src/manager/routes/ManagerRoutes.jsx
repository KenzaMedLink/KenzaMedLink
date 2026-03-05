import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ProfilePage from "@/pages/Profile";


import ManagerLayout from "../layouts/ManagerLayout";
import Dashboard from "../pages/Dashboard";
import ApprovalCenter from "../pages/ApprovalCenter";
import DisputeCenter from "../pages/DisputeCenter";
import UserManagement from "../pages/UserManagement";
import TransactionOversight from "../pages/TransactionOversight";
import ManagerLogin from "../pages/ManagerLogin";

export default function ManagerRoutes() {
  const { initializing, isManager } = useAuth();

  return (
    <Routes>
      {/* LOGIN */}
      <Route
        path="login"
        element={
          isManager ? <Navigate to="/manager" replace /> : <ManagerLogin />
        }
      />

      {/* PROTECTED AREA */}
      <Route
        element={
          initializing ? (
            <div style={{ padding: 40 }}>Loading manager...</div>
          ) : isManager ? (
            <ManagerLayout />
          ) : (
            <Navigate to="/manager/login" replace />
          )
        }
      >
        {/* /manager */}
        <Route index element={<Dashboard />} />

        {/* optional alias */}
        <Route path="dashboard" element={<Navigate to="/manager" replace />} />
	
	<Route path="profile" element={<ProfilePage />} />

        <Route path="approvals" element={<ApprovalCenter />} />
        <Route path="disputes" element={<DisputeCenter />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="transactions" element={<TransactionOversight />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/manager" replace />} />
    </Routes>
  );
}