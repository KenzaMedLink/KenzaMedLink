import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar({ collapsed }) {
  const [openSection, setOpenSection] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { logout, isAdmin } = useAuth();

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-600/20 text-blue-400 font-semibold"
      : "text-gray-400 hover:text-white";

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await logout("/admin/login"); // ✅ unified logout + hard redirect
    } catch (e) {
      console.error("Logout failed:", e);
      window.location.replace("/admin/login");
    }
  }

  // Optional safety: if user is not admin, hide sidebar
  if (!isAdmin) return null;

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-[#0B1B34] text-white flex flex-col justify-between transition-all duration-300 shadow-xl z-50 ${
        collapsed ? "-translate-x-full" : "translate-x-0 w-72"
      }`}
    >
      {/* TOP */}
      <div className="p-8 overflow-y-auto">
        {/* LOGO */}
        <h2
          onClick={() => navigate("/admin")}
          className="text-lg font-semibold tracking-wide mb-10 cursor-pointer text-gray-200 hover:text-white"
        >
          KenzaMedLink
          <span className="block text-xs text-gray-400 mt-1">
            Executive Control
          </span>
        </h2>

        <ul className="space-y-5 text-sm">
          {/* Executive Overview */}
          <li
            onClick={() => navigate("/admin")}
            className={`px-3 py-2 rounded-md transition cursor-pointer ${isActive(
              "/admin"
            )}`}
          >
            Executive Overview
          </li>

          {/* Governance */}
          <li>
            <div
              onClick={() => toggleSection("governance")}
              className="text-gray-300 hover:text-white font-medium cursor-pointer px-3 py-2 rounded-md"
            >
              Governance Center
            </div>

            {openSection === "governance" && (
              <ul className="ml-3 mt-2 space-y-2 border-l border-slate-700 pl-4">
                <li
                  onClick={() => navigate("/admin/users")}
                  className={`px-2 py-1 rounded cursor-pointer ${isActive(
                    "/admin/users"
                  )}`}
                >
                  User Management
                </li>

                <li
                  onClick={() => navigate("/admin/role-management")}
                  className={`px-2 py-1 rounded cursor-pointer ${isActive(
                    "/admin/role-management"
                  )}`}
                >
                  Role Management
                </li>

                <li
                  onClick={() => navigate("/admin/operations")}
                  className={`px-2 py-1 rounded cursor-pointer ${isActive(
                    "/admin/operations"
                  )}`}
                >
                  Suspension Center
                </li>

                <li
                  onClick={() => navigate("/admin/operations")}
                  className={`px-2 py-1 rounded cursor-pointer ${isActive(
                    "/admin/operations"
                  )}`}
                >
                  Deletion Requests Queue
                </li>
              </ul>
            )}
          </li>

          {/* Financial */}
          <li
            onClick={() => navigate("/admin/finance")}
            className={`px-3 py-2 rounded-md transition cursor-pointer ${isActive(
              "/admin/finance"
            )}`}
          >
            Financial Control Center
          </li>

          {/* Compliance */}
          <li
            onClick={() => navigate("/admin/compliance")}
            className={`px-3 py-2 rounded-md transition cursor-pointer ${isActive(
              "/admin/compliance"
            )}`}
          >
            Compliance Center
          </li>

          {/* System */}
          <li
            onClick={() => navigate("/admin/system-health")}
            className={`px-3 py-2 rounded-md transition cursor-pointer ${isActive(
              "/admin/system-health"
            )}`}
          >
            System Control
          </li>

          {/* NHIS */}
          <li
            onClick={() => navigate("/admin/operations")}
            className="text-gray-300 hover:text-white font-medium px-3 py-2 rounded-md cursor-pointer"
          >
            NHIS
          </li>

          {/* Fraud */}
          <li
            onClick={() => navigate("/admin/risk-monitoring")}
            className={`px-3 py-2 rounded-md transition cursor-pointer ${isActive(
              "/admin/risk-monitoring"
            )}`}
          >
            Fraud Monitoring
          </li>
<li
  onClick={() => navigate("/admin/profile")}
  className={`px-3 py-2 rounded-md transition cursor-pointer ${isActive("/admin/profile")}`}
>
  My Profile
</li>
        </ul>
      </div>

      {/* Logout */}
      <div className="p-6 border-t border-slate-800">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 transition py-2 rounded-md text-sm font-semibold shadow-md"
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}