import { Routes, Route, Navigate } from "react-router-dom";

import PublicRegister from "@/pages/public/PublicRegister";

import AdminRoutes from "./admin/routes/AdminRoutes";
import ManagerRoutes from "./manager/routes/ManagerRoutes";
import StaffRoutes from "./staff/routes/StaffRoutes";

import ResetPassword from "@/pages/ResetPassword";
import { useAuth } from "@/context/AuthContext";

// public pages
import Landing from "@/pages/public/Landing";
import PublicLogin from "@/pages/public/PublicLogin";
import About from "@/pages/public/About";
import Privacy from "@/pages/public/Privacy";
import Terms from "@/pages/public/Terms";
import Cookies from "@/pages/public/Cookies";
import Support from "@/pages/public/Support";
import Contact from "@/pages/public/Contact";

export default function App() {
  const { initializing } = useAuth();
  if (initializing) return null;

  return (
    <Routes>
      {/* Public website */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicLogin />} />
      <Route path="/about" element={<About />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/support" element={<Support />} />
      <Route path="/contact" element={<Contact />} />
	<Route path="/register" element={<PublicRegister />} />
      {/* shared auth route */}
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Portals (not linked from landing) */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/manager/*" element={<ManagerRoutes />} />
      <Route path="/staff/*" element={<StaffRoutes />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}