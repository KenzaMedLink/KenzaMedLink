import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import ProfilePage from "@/pages/Profile";

import StaffLogin from "../pages/Login";
import StaffDashboard from "../pages/Dashboard";
import Verification from "../pages/Verification";
import Disputes from "../pages/Disputes";
import Support from "../pages/Support";
import Transactions from "../pages/Transactions";

import StaffLayout from "../layouts/StaffLayout";

export default function StaffRoutes() {
  const { initializing, isStaff } = useAuth();

  return (
    <Routes>
      {/* LOGIN */}
      <Route
        path="login"
        element={isStaff ? <Navigate to="/staff" replace /> : <StaffLogin />}
      />

      {/* PROTECTED + LAYOUT */}
      <Route
        element={
          initializing ? (
            <div className="p-10">Loading...</div>
          ) : isStaff ? (
            <StaffLayout />
          ) : (
            <Navigate to="/staff/login" replace />
          )
        }
      >
        <Route index element={<StaffDashboard />} />


	<Route path="profile" element={<ProfilePage />} />

        <Route path="verification" element={<Verification />} />
        <Route path="disputes" element={<Disputes />} />
        <Route path="support" element={<Support />} />
        <Route path="transactions" element={<Transactions />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/staff" replace />} />
    </Routes>
  );
}