import { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex bg-gray-100 min-h-screen relative">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-72"
        }`}
      >
        {/* Top Header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="bg-[#0B1B34] text-white p-2 rounded-md shadow-md hover:bg-[#13294B] transition"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>

          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            KenzaMedLink Executive Control Panel
          </h1>
        </div>

        {/* ✅ Page Content (FULL WIDTH, no max-width, better left extension) */}
        <div className="w-full max-w-none px-6 md:px-8 py-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}