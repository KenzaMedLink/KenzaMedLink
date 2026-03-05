import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // ✅ unified auth

export default function Sidebar({ collapsed, setCollapsed }) {
  const [openSection, setOpenSection] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { logout } = useAuth(); // ✅ unified logout

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-600/20 text-blue-400 font-semibold"
      : "text-gray-400 hover:text-white";

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      // ✅ unified logout does signOut + hard redirect
      await logout("/manager/login");
    } catch (e) {
      console.error("Manager logout failed:", e);
      window.location.replace("/manager/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-[#0B1B34] text-white flex flex-col justify-between transition-all duration-300 shadow-xl ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* TOP */}
      <div className="p-4 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          {!collapsed && (
            <h2
              onClick={() => navigate("/manager")}
              className="text-lg font-semibold cursor-pointer"
            >
              KenzaMedLink
              <span className="block text-xs text-gray-400">General Manager</span>
            </h2>
          )}

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="bg-slate-700 hover:bg-slate-600 p-2 rounded-md transition"
          >
            ☰
          </button>
        </div>

        <ul className="space-y-4 text-sm">
          <SidebarItem
            label="Operational Overview"
            path="/manager"
            collapsed={collapsed}
            isActive={isActive}
            navigate={navigate}
          />
          
          <SidebarItem
            label="Approval Center"
            collapsed={collapsed}
            onClick={() => toggleSection("approval")}
          />

          {!collapsed && openSection === "approval" && (
            <div className="ml-4 space-y-2 text-xs text-gray-400">
              <div
                onClick={() => navigate("/manager/doctors-queue")}
                className="cursor-pointer hover:text-white"
              >
                Doctors Queue
              </div>
              <div
                onClick={() => navigate("/manager/labs-queue")}
                className="cursor-pointer hover:text-white"
              >
                Labs Queue
              </div>
              <div
                onClick={() => navigate("/manager/pharmacy-queue")}
                className="cursor-pointer hover:text-white"
              >
                Pharmacy Queue
              </div>
              <div
                onClick={() => navigate("/manager/admin-queue")}
                className="cursor-pointer hover:text-white"
              >
                Admin Queue
              </div>
            </div>
          )}

          <SidebarItem
            label="Dispute Center"
            collapsed={collapsed}
            onClick={() => toggleSection("disputes")}
          />

          {!collapsed && openSection === "disputes" && (
            <div className="ml-4 space-y-2 text-xs text-gray-400">
              <div
                onClick={() => navigate("/manager/lab-disputes")}
                className="cursor-pointer hover:text-white"
              >
                Lab Disputes
              </div>
              <div
                onClick={() => navigate("/manager/prescription-disputes")}
                className="cursor-pointer hover:text-white"
              >
                Prescription Disputes
              </div>
              <div
                onClick={() => navigate("/manager/consultation-disputes")}
                className="cursor-pointer hover:text-white"
              >
                Consultation Disputes
              </div>
              <div
                onClick={() => navigate("/manager/escalations")}
                className="cursor-pointer hover:text-red-400"
              >
                Escalations
              </div>
            </div>
          )}

          <SidebarItem
            label="User Management"
            path="/manager/users"
            collapsed={collapsed}
            isActive={isActive}
            navigate={navigate}
          />

          <SidebarItem
            label="Transaction Oversight"
            path="/manager/transactions"
            collapsed={collapsed}
            isActive={isActive}
            navigate={navigate}
          />

          {/* ✅ ADDED: My Profile */}
          <SidebarItem
            label="My Profile"
            path="/manager/profile"
            collapsed={collapsed}
            isActive={isActive}
            navigate={navigate}
          />
        </ul>
      </div>

      {/* LOGOUT */}
      <div className="p-4 border-t border-slate-800">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 transition py-2 rounded-md text-sm font-semibold"
        >
          {!collapsed ? (loggingOut ? "Logging out..." : "Logout") : "⎋"}
        </button>
      </div>
    </div>
  );
}

function SidebarItem({ label, path, collapsed, isActive, navigate, onClick }) {
  return (
    <div
      onClick={path ? () => navigate(path) : onClick}
      className={`px-3 py-2 rounded-md cursor-pointer transition ${
        path ? isActive(path) : "text-gray-400 hover:text-white"
      }`}
    >
      {collapsed ? "•" : label}
    </div>
  );
}