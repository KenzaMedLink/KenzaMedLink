import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  FileCheck,
  AlertTriangle,
  LifeBuoy,
  Receipt,
  ChevronLeft,
  LogOut,
  User, // ✅ added
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function StaffSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { logout } = useAuth();

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      // ✅ AuthContext.logout already redirects using window.location.replace
      await logout("/staff/login");
    } catch (e) {
      console.error("Logout failed:", e);
      // safety redirect even if logout throws
      window.location.replace("/staff/login");
    }
    // no need to setLoggingOut(false) because we leave the page
  };

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/staff" },
    { name: "Verification Queue", icon: FileCheck, path: "/staff/verification" },
    { name: "Dispute Review", icon: AlertTriangle, path: "/staff/disputes" },
    { name: "Support Center", icon: LifeBuoy, path: "/staff/support" },
    { name: "Transaction Viewer", icon: Receipt, path: "/staff/transactions" },
    { name: "My Profile", icon: User, path: "/staff/profile" }, // ✅ added

  ];

  return (
    <div
      className={`h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && <h2 className="font-bold text-lg">Staff Panel</h2>}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-gray-700 rounded transition"
        >
          <ChevronLeft
            size={20}
            className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-4 space-y-2 px-2">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive ? "bg-blue-600" : "hover:bg-gray-800 text-gray-300"
                }`
              }
            >
              <Icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-3 text-gray-300 hover:text-red-400 disabled:opacity-60 transition"
        >
          <LogOut size={18} />
          {!collapsed && (
            <span>{loggingOut ? "Logging out..." : "Logout"}</span>
          )}
        </button>
      </div>
    </div>
  );
}