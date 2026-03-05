import React from "react";
import KPICard from "../components/KPICard";
import RevenueChart from "../components/RevenueChart";
import CompliancePanel from "../components/CompliancePanel";
import ActivityFeed from "../components/ActivityFeed";

const Dashboard = () => {
  const revenueData = [
    { name: "Mon", revenue: 1200 },
    { name: "Tue", revenue: 2100 },
    { name: "Wed", revenue: 800 },
    { name: "Thu", revenue: 1600 },
    { name: "Fri", revenue: 2400 },
    { name: "Sat", revenue: 1800 },
    { name: "Sun", revenue: 2800 },
  ];

  const alerts = [
    { type: "danger", message: "3 Doctor licenses expiring in 30 days" },
    { type: "warning", message: "2 Labs pending verification" },
    { type: "danger", message: "1 High-risk transaction flagged" },
  ];

  const activities = [
    { action: "GM suspended Dr. Adewale", time: "2 hours ago" },
    { action: "Admin verified Alpha Lab", time: "4 hours ago" },
    { action: "Refund requested for Consultation #3421", time: "Yesterday" },
  ];

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-semibold text-gray-800">
          Executive Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Real-time operational and financial insights for KenzaMedLink
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Users" value="12,340" icon="👥" />
        <KPICard title="Active Doctors" value="420" icon="🩺" />
        <KPICard title="Active Labs" value="58" icon="🧪" />
        <KPICard title="Active Pharmacies" value="73" icon="💊" />
        <KPICard title="Today's Revenue" value="₦1.2M" icon="💰" />
        <KPICard title="Monthly Revenue" value="₦32M" icon="📊" />
        <KPICard title="Pending Disputes" value="5" icon="⚖️" />
        <KPICard title="Expiring Licenses" value="7" icon="⏳" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <RevenueChart data={revenueData} />
        <CompliancePanel alerts={alerts} />
      </div>

      <ActivityFeed activities={activities} />

    </div>
  );
};

export default Dashboard;